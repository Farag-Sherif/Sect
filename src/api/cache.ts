/**
 * API Request Deduplication and In-Memory Page-Session Cache
 *
 * Implements:
 * 1. In-flight promise deduplication: Simultaneous identical requests share a single network call.
 * 2. In-memory page-session caching: GET responses are retained during the page session and reset on full refresh.
 * 3. Scope isolation: Keys include canonical URL, sorted query parameters, authentication token, and locale.
 * 4. Safe failure handling: Failed requests are immediately evicted so retries can proceed.
 * 5. Mutation awareness: Cache invalidation helpers for POST/PUT/DELETE actions.
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

// In-memory storage for the current page session
const sessionCache = new Map<string, CacheEntry<any>>();

// In-flight pending promises for deduplication
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Builds a deterministic canonical key for a request.
 */
export function buildCanonicalKey(
  endpoint: string,
  params?: Record<string, any>,
  headers?: Record<string, string>
): string {
  // 1. Base URL normalization
  let normalizedUrl = endpoint.trim();

  // 2. Canonical query parameters sorting
  const urlParts = normalizedUrl.split('?');
  const path = urlParts[0];
  const queryParams = new URLSearchParams(urlParts[1] || '');

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.set(key, String(val));
      }
    });
  }

  // Sort query parameter keys deterministically
  const sortedParams = new URLSearchParams();
  const keys = Array.from(queryParams.keys()).sort();
  keys.forEach(k => {
    const vals = queryParams.getAll(k).sort();
    vals.forEach(v => sortedParams.append(k, v));
  });

  const finalQuery = sortedParams.toString();
  const fullPath = finalQuery ? `${path}?${finalQuery}` : path;

  // 3. User & Locale isolation
  const authHeader = headers?.['Authorization'] || headers?.['authorization'] || '';
  const tokenHash = authHeader ? authHeader.slice(-16) : 'anonymous';
  const locale = headers?.['X-Locale'] || headers?.['x-locale'] || 'default';

  return `${locale}::${tokenHash}::${fullPath}`;
}

/**
 * Returns cached data for a given key if present.
 */
export function getCachedResponse<T = any>(key: string): T | undefined {
  const entry = sessionCache.get(key);
  if (!entry) return undefined;
  return entry.data as T;
}

/**
 * Stores a successfully resolved response in memory for the session.
 */
export function setCachedResponse<T = any>(key: string, data: T): void {
  sessionCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Retrieves an in-flight Promise for deduplication.
 */
export function getInFlightPromise<T = any>(key: string): Promise<T> | undefined {
  return inFlightRequests.get(key);
}

/**
 * Registers an active in-flight request Promise.
 */
export function setInFlightPromise<T = any>(key: string, promise: Promise<T>): void {
  inFlightRequests.set(key, promise);
}

/**
 * Removes an in-flight request Promise once settled.
 */
export function removeInFlightPromise(key: string): void {
  inFlightRequests.delete(key);
}

/**
 * Invalidates cache entries matching a substring or RegExp, or all if no pattern provided.
 */
export function invalidateApiCache(pattern?: string | RegExp): void {
  if (!pattern) {
    sessionCache.clear();
    return;
  }
  for (const key of sessionCache.keys()) {
    if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
      sessionCache.delete(key);
    }
  }
}

/**
 * Clears the entire session cache (used on logout or session reset).
 */
export function clearApiSessionCache(): void {
  sessionCache.clear();
  inFlightRequests.clear();
}
