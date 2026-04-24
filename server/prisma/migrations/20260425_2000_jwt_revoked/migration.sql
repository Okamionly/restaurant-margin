-- Migration: jwt_revoked blocklist
-- Date : 2026-04-25
-- Purpose: revocation of JWT access tokens by their `jti` claim. Inserted on
--          POST /api/auth/logout. Auth middleware checks every verified token
--          against this table and rejects if its jti is present.
--          `expires_at` is set to the JWT's exp claim so a periodic vacuum
--          job can prune already-expired entries.

CREATE TABLE IF NOT EXISTS jwt_revoked (
  jti         TEXT PRIMARY KEY,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jwt_revoked_expires_at ON jwt_revoked(expires_at);

COMMENT ON TABLE jwt_revoked IS 'Blocklist of revoked JWT tokens (by jti claim) — checked on every authenticated request';
COMMENT ON COLUMN jwt_revoked.jti IS 'JWT ID claim (uuid v4 generated at sign time)';
COMMENT ON COLUMN jwt_revoked.expires_at IS 'JWT exp claim — entries can be GCed after this date';
