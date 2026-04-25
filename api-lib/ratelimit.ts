/**
 * Distributed rate limiter — Wave 3 infra 2026-04-25
 *
 * Strategy:
 *  - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set →
 *    use @upstash/ratelimit with slidingWindow(50 req / 1 min) per IP.
 *    Works across all Vercel serverless function instances.
 *  - Otherwise → in-memory Map fallback (single-process dev / legacy).
 *
 * Usage:
 *   const { success, limit, remaining, reset } = await ratelimit(identifier);
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ── Types ──────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // unix timestamp in seconds
}

// ── In-memory fallback (dev / no Upstash env) ──────────────────────────────

interface InMemoryEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 50;
const inMemoryStore = new Map<string, InMemoryEntry>();

function inMemoryRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = inMemoryStore.get(identifier);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    inMemoryStore.set(identifier, { count: 1, windowStart: now });
    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: Math.floor((now + WINDOW_MS) / 1000),
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, MAX_REQUESTS - entry.count);
  const reset = Math.floor((entry.windowStart + WINDOW_MS) / 1000);

  return {
    success: entry.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining,
    reset,
  };
}

// Prune stale entries every 5 minutes to avoid memory leak in long-running dev servers
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of inMemoryStore.entries()) {
    if (now - entry.windowStart >= WINDOW_MS * 2) {
      inMemoryStore.delete(key);
    }
  }
}, 5 * 60_000).unref?.();

// ── Upstash distributed limiter ────────────────────────────────────────────

let upstashLimiter: Ratelimit | null = null;

function getUpstashLimiter(): Ratelimit | null {
  if (upstashLimiter) return upstashLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '1 m'),
    analytics: false,
    prefix: 'restaumargin:rl',
  });
  return upstashLimiter;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Check rate limit for an identifier (usually IP address or user ID).
 * Returns { success, limit, remaining, reset }.
 *
 * Never throws — if Upstash is unreachable or misconfigured the request is
 * allowed through (fail-open) to avoid blocking legitimate traffic during
 * Redis degradation. The in-memory fallback is used for dev / CI.
 */
export async function ratelimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter();

  if (limiter) {
    try {
      const result = await limiter.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: Math.floor(result.reset / 1000),
      };
    } catch {
      // Fail-open: Upstash unreachable → allow request, fall through to in-memory
      console.warn('[ratelimit] Upstash unreachable, falling back to in-memory');
    }
  }

  return inMemoryRateLimit(identifier);
}
