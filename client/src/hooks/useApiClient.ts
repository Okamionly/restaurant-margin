import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getActiveRestaurantId } from '../services/api';

// ---------------------------------------------------------------------------
// Standalone helper — for modules outside the React tree (utils, plain services)
// ---------------------------------------------------------------------------

/**
 * Returns auth headers without needing a React context.
 * Matches the canonical authHeaders() in services/api.ts:
 *   Content-Type + Bearer token + X-Restaurant-Id (when present)
 */
export function authHeadersStandalone(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const restaurantId = getActiveRestaurantId();
  if (restaurantId) {
    headers['X-Restaurant-Id'] = restaurantId;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// React hook — use inside any component rendered inside BrowserRouter
// ---------------------------------------------------------------------------

/**
 * Centralised API client hook.
 *
 * Returns:
 *   authHeaders() — auth headers object (Content-Type + Bearer + X-Restaurant-Id)
 *   apiFetch<T>() — fetch wrapper: auto-headers, JSON parse, 401 → logout
 *   getToken()    — token from localStorage
 */
export function useApiClient() {
  const navigate = useNavigate();

  const authHeaders = useCallback((): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const restaurantId = getActiveRestaurantId();
    if (restaurantId) {
      headers['X-Restaurant-Id'] = restaurantId;
    }
    return headers;
  }, []);

  const apiFetch = useCallback(
    async <T = unknown>(url: string, options?: RequestInit): Promise<T> => {
      const res = await fetch(url, {
        ...options,
        headers: { ...authHeaders(), ...(options?.headers ?? {}) },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Session expirée');
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const ct = res.headers.get('content-type') ?? '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ct.includes('application/json') ? res.json() : (res.text() as any);
    },
    [authHeaders, navigate],
  );

  return {
    authHeaders,
    apiFetch,
    getToken: () => getToken(),
  };
}
