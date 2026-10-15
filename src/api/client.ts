import i18n from '../i18n';

export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 'https://sect.bluebrain-co.com/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

import { 
  buildCanonicalKey, 
  getCachedResponse, 
  setCachedResponse, 
  getInFlightPromise, 
  setInFlightPromise, 
  removeInFlightPromise,
  invalidateApiCache,
  clearApiSessionCache 
} from './cache';

export { invalidateApiCache, clearApiSessionCache };

export const getAuthToken = (): string | null => {
  return localStorage.getItem('sect_token');
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('sect_token', token);
  } else {
    localStorage.removeItem('sect_token');
  }
  // Clear cached user responses when auth status changes
  clearApiSessionCache();
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;
  const method = (customConfig.method || 'GET').toUpperCase();

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Determine current locale (ar or en)
  const currentLocale = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Locale': currentLocale,
  };

  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const mergedHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...(headers as Record<string, string>),
  };

  // Only GET requests participate in session caching and in-flight deduplication
  const isGet = method === 'GET';
  const cacheKey = isGet ? buildCanonicalKey(endpoint, params, mergedHeaders) : '';

  if (isGet) {
    // 1. Check in-memory page-session cache
    const cached = getCachedResponse<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    // 2. Check for active in-flight request to deduplicate concurrent calls
    const inFlight = getInFlightPromise<T>(cacheKey);
    if (inFlight) {
      return inFlight;
    }
  }

  // 3. Initiate actual network request
  const fetchPromise = (async () => {
    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: mergedHeaders,
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = 
          (data && typeof data === 'object' && (data.message || (data.errors && Object.values(data.errors).flat().join(', ')))) ||
          `Request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, data);
      }

      // Store in memory session cache if GET
      if (isGet) {
        setCachedResponse(cacheKey, data as T);
      } else {
        // If mutation succeeded, invalidate relevant cache keys
        if (endpoint.includes('cart')) invalidateApiCache('cart');
        else if (endpoint.includes('profile')) invalidateApiCache('profile');
        else if (endpoint.includes('reviews')) invalidateApiCache('reviews');
        else if (endpoint.includes('wishlist')) invalidateApiCache('wishlist');
        else if (endpoint.includes('addresses')) invalidateApiCache('addresses');
        else if (endpoint.includes('orders')) invalidateApiCache('orders');
      }

      return data as T;
    } finally {
      if (isGet) {
        removeInFlightPromise(cacheKey);
      }
    }
  })();

  if (isGet) {
    setInFlightPromise(cacheKey, fetchPromise);
  }

  return fetchPromise;
}

export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};
