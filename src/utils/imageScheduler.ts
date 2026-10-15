/**
 * Intelligent Image Loading and Concurrency Scheduler
 *
 * Capabilities:
 * 1. Bounded request concurrency (configurable limit, default 6) to prevent network socket congestion.
 * 2. Priority-aware queueing: Critical / Hero / Above-the-fold images execute ahead of lazy images.
 * 3. Simultaneous in-flight deduplication: Multiple elements requesting the same URL share one load cycle.
 * 4. Bounded exponential backoff with jitter retry policy (max 3 retries) on failure.
 * 5. Cache Storage API integration ('sect-images-v1') for reliable offline / network-glitch fallback.
 * 6. Session-level failure tracking: Permanently failing URLs are marked to prevent repeated thrashing.
 * 7. Unmount safety & AbortController support.
 */

const CACHE_NAME = 'sect-images-v1';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 350;
const MAX_BACKOFF_MS = 2500;
const CONCURRENCY_LIMIT = 6;

export type ImagePriority = 'high' | 'normal' | 'low';

interface QueueItem {
  id: string;
  url: string;
  priority: ImagePriority;
  retriesLeft: number;
  attempt: number;
  resolve: (resolvedUrl: string) => void;
  reject: (err: Error) => void;
  abortSignal?: AbortSignal;
}

class ImageRequestScheduler {
  private concurrency: number;
  private activeCount: number = 0;
  private queue: QueueItem[] = [];
  private inFlightLoads = new Map<string, Promise<string>>();
  private failedSessionUrls = new Set<string>();
  private cacheAvailable: boolean = typeof window !== 'undefined' && 'caches' in window;

  constructor(concurrency: number = CONCURRENCY_LIMIT) {
    this.concurrency = concurrency;
  }

  /**
   * Check if a URL has permanently failed in the current page session.
   */
  public isUrlFailedInSession(url: string): boolean {
    return this.failedSessionUrls.has(url);
  }

  /**
   * Reset session failed URLs (e.g. after user action or refresh).
   */
  public clearSessionFailures(): void {
    this.failedSessionUrls.clear();
  }

  /**
   * Schedule loading an image with priority, deduplication, retry, and caching.
   */
  public async scheduleLoad(
    url: string,
    priority: ImagePriority = 'normal',
    signal?: AbortSignal
  ): Promise<string> {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid image URL');
    }

    // If marked as permanently failed in this page session, fail fast
    if (this.failedSessionUrls.has(url)) {
      throw new Error(`Image ${url} previously failed all retries in this session`);
    }

    // 1. Deduplicate in-flight requests for the exact same URL
    const existingInFlight = this.inFlightLoads.get(url);
    if (existingInFlight) {
      return existingInFlight;
    }

    const loadPromise = new Promise<string>((resolve, reject) => {
      const item: QueueItem = {
        id: `${Date.now()}_${Math.random()}`,
        url,
        priority,
        retriesLeft: MAX_RETRIES,
        attempt: 0,
        resolve: (src) => {
          this.inFlightLoads.delete(url);
          resolve(src);
        },
        reject: (err) => {
          this.inFlightLoads.delete(url);
          this.failedSessionUrls.add(url);
          reject(err);
        },
        abortSignal: signal,
      };

      this.enqueue(item);
      this.processQueue();
    });

    this.inFlightLoads.set(url, loadPromise);
    return loadPromise;
  }

  private enqueue(item: QueueItem): void {
    const priorityWeights: Record<ImagePriority, number> = {
      high: 3,
      normal: 2,
      low: 1,
    };

    // Insert sorted by priority (high priority first)
    const weight = priorityWeights[item.priority] || 2;
    const insertIdx = this.queue.findIndex(
      (q) => priorityWeights[q.priority] < weight
    );

    if (insertIdx === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(insertIdx, 0, item);
    }
  }

  private processQueue(): void {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    // Check if component unmounted or aborted before start
    if (item.abortSignal?.aborted) {
      item.reject(new Error('Image loading aborted before dispatch'));
      this.processQueue();
      return;
    }

    this.activeCount++;
    this.executeLoadWithRetry(item).finally(() => {
      this.activeCount--;
      this.processQueue();
    });
  }

  private async executeLoadWithRetry(item: QueueItem): Promise<void> {
    try {
      // 1. First, check if already in persistent Cache Storage
      const cachedSrc = await this.readFromCacheStorage(item.url);
      if (cachedSrc) {
        item.resolve(cachedSrc);
        return;
      }

      // 2. Perform actual image load and decoding
      const resolvedSrc = await this.performSingleImageLoad(item.url, item.abortSignal);

      // 3. Populate persistent Cache Storage for offline/glitch resilience
      this.writeToCacheStorage(item.url).catch(() => {});

      item.resolve(resolvedSrc);
    } catch (err: any) {
      if (item.abortSignal?.aborted) {
        item.reject(new Error('Image load aborted'));
        return;
      }

      if (item.retriesLeft > 0) {
        item.attempt++;
        item.retriesLeft--;

        // Exponential backoff with random jitter to prevent synchronized retry storms
        const baseBackoff = Math.min(
          MAX_BACKOFF_MS,
          INITIAL_BACKOFF_MS * Math.pow(2, item.attempt)
        );
        const jitter = Math.floor(Math.random() * 200);
        const delay = baseBackoff + jitter;

        setTimeout(() => {
          if (item.abortSignal?.aborted) {
            item.reject(new Error('Image load aborted during backoff'));
            return;
          }
          this.enqueue(item);
          this.processQueue();
        }, delay);
      } else {
        // Last attempt failed: try to recover from Cache Storage one last time
        const cachedFallback = await this.readFromCacheStorage(item.url);
        if (cachedFallback) {
          item.resolve(cachedFallback);
        } else {
          item.reject(new Error(`Failed to load image after ${MAX_RETRIES} retries: ${item.url}`));
        }
      }
    }
  }

  /**
   * Loads an image element and awaits its native decode() method where supported.
   */
  private performSingleImageLoad(url: string, signal?: AbortSignal): Promise<string> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new Error('Aborted'));
      }

      const img = new Image();
      let onAbort: (() => void) | undefined;

      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
        if (signal && onAbort) {
          signal.removeEventListener('abort', onAbort);
        }
      };

      if (signal) {
        onAbort = () => {
          cleanup();
          img.src = '';
          reject(new Error('Aborted'));
        };
        signal.addEventListener('abort', onAbort, { once: true });
      }

      img.onload = () => {
        cleanup();
        // Use native decode if available to ensure frame readiness off the main thread
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode()
            .then(() => resolve(url))
            .catch(() => resolve(url)); // Resolve even if decode throws non-fatal error
        } else {
          resolve(url);
        }
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Network error loading ${url}`));
      };

      // Set crossOrigin if remote asset allows CORS
      if (url.startsWith('http') && !url.includes(window.location.host)) {
        img.crossOrigin = 'anonymous';
      }

      img.src = url;
    });
  }

  /**
   * Retrieve response from Cache Storage API.
   */
  private async readFromCacheStorage(url: string): Promise<string | null> {
    if (!this.cacheAvailable) return null;
    try {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match(url);
      if (match && match.ok) {
        const blob = await match.blob();
        if (blob && blob.size > 0) {
          return URL.createObjectURL(blob);
        }
      }
    } catch {
      // Ignore cache storage errors (e.g. private browsing or security restrictions)
    }
    return null;
  }

  /**
   * Save successful image response into Cache Storage API.
   */
  private async writeToCacheStorage(url: string): Promise<void> {
    if (!this.cacheAvailable) return;
    try {
      // Only cache fetchable resources (local or CORS-compliant remote)
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, res.clone());
      }
    } catch {
      // Silent catch for opaque cross-origin or unsupported schemes
    }
  }
}

// Global shared scheduler instance
export const imageScheduler = new ImageRequestScheduler(CONCURRENCY_LIMIT);
