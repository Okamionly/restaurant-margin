// JTI blocklist — server-side JWT revocation.
//
// On every authenticated request, the auth middleware verifies the JWT signature
// AND consults this blocklist to make sure the token's `jti` hasn't been revoked
// (e.g. via POST /api/auth/logout). Without this, a stolen token would remain
// usable until its 7-day exp claim.
//
// Storage : `jwt_revoked` Postgres table (see migration 20260425_2000_jwt_revoked).
// Cache   : in-memory hot set keyed on jti, populated lazily and on revoke().
//           Sized small — only the revocations for the rolling 7-day TTL window
//           that are actually being hit. The DB stays the source of truth.
//
// Failure mode : if the DB lookup fails, we fail OPEN (allow). A revocation
//                check failure is operational, not a security event — better to
//                serve traffic than to lock everyone out on a flaky pool. The
//                token still needed a valid signature to reach this code.

import { prisma } from './prisma';

/** Fast hot cache of recently checked jti → isRevoked. Cleared on revoke(). */
const isRevokedCache = new Map<string, boolean>();
const CACHE_MAX_SIZE = 5000;

function cacheSet(jti: string, revoked: boolean) {
  if (isRevokedCache.size >= CACHE_MAX_SIZE) isRevokedCache.clear();
  isRevokedCache.set(jti, revoked);
}

/**
 * Check whether a JWT's jti has been revoked. Returns false on lookup error
 * (fail-open) — see module header.
 */
export async function isJtiRevoked(jti: string | undefined): Promise<boolean> {
  if (!jti) return false; // legacy token without jti claim
  const cached = isRevokedCache.get(jti);
  if (cached !== undefined) return cached;
  try {
    // @ts-ignore - prisma client may need regen after JwtRevoked model addition
    const row = await (prisma as any).jwtRevoked.findUnique({ where: { jti } });
    const revoked = row !== null;
    cacheSet(jti, revoked);
    return revoked;
  } catch (err) {
    // Fail-open — see module header.
    console.error('[JTI BLOCKLIST] DB lookup failed, allowing request:', (err as Error).message);
    return false;
  }
}

/**
 * Mark a jti as revoked. Idempotent — re-revoking is a no-op.
 * `expiresAt` should be the JWT's `exp` claim so a periodic vacuum job can prune.
 */
export async function revokeJti(jti: string, expiresAt: Date): Promise<void> {
  try {
    // @ts-ignore - prisma client may need regen after JwtRevoked model addition
    await (prisma as any).jwtRevoked.upsert({
      where: { jti },
      update: {}, // no-op — already revoked
      create: { jti, expiresAt },
    });
    cacheSet(jti, true);
  } catch (err) {
    console.error('[JTI BLOCKLIST] Failed to revoke jti:', (err as Error).message);
    throw err;
  }
}

/**
 * GC helper — drop already-expired entries. Call from a cron route if the
 * blocklist grows. Not strictly required: blocklist hits stop being correct
 * once exp is past, but the hot cache prevents repeated DB hits.
 */
export async function pruneExpired(): Promise<number> {
  try {
    // @ts-ignore - prisma client may need regen after JwtRevoked model addition
    const res = await (prisma as any).jwtRevoked.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return res.count;
  } catch (err) {
    console.error('[JTI BLOCKLIST] Prune failed:', (err as Error).message);
    return 0;
  }
}
