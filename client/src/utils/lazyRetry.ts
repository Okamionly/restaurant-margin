import { lazy } from 'react';

// Auto-retry lazy imports on chunk load failure (stale deploy)
export function lazyRetry(importFn: () => Promise<any>) {
  return lazy(() => importFn().catch(() => {
    // Chunk failed — new deploy changed hashes. Force full page reload.
    // Use timestamp to allow multiple retries (not just once per session)
    const key = 'chunk-retry-ts';
    const last = parseInt(sessionStorage.getItem(key) || '0');
    const now = Date.now();
    // Allow reload if last retry was more than 5 seconds ago (prevents infinite loop)
    if (now - last > 5000) {
      sessionStorage.setItem(key, String(now));
      window.location.reload();
    }
    // If still failing after reload, return a placeholder to prevent crash
    return { default: () => {
      window.location.reload();
      return null;
    } } as any;
  }));
}
