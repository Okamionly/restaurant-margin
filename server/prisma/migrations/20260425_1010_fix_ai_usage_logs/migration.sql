-- =====================================================
-- Migration: 20260425_1010_fix_ai_usage_logs
-- Purpose : Bring ai_usage_logs table in sync with Prisma schema.
--
-- Why     : The 2026-04-23 migration created ai_usage_logs without
--           `restaurant_id`, `success`, `error_code` columns that
--           schema.prisma declares. Prisma Client fails on write with
--           "column does not exist". CRITICAL DRIFT FIX.
--
-- Safety  : idempotent (IF NOT EXISTS), DEFAULT TRUE on success so
--           historical rows are treated as successful (they completed).
-- =====================================================

-- 1. Add missing columns.
ALTER TABLE ai_usage_logs
  ADD COLUMN IF NOT EXISTS restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS success       BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS error_code    TEXT;

-- 2. Index on restaurant_id for per-tenant cost queries.
CREATE INDEX IF NOT EXISTS idx_ai_usage_restaurant_id
  ON ai_usage_logs(restaurant_id);

-- 3. Index on (restaurant_id, created_at) for "cost by restaurant over
--    time" dashboards.
CREATE INDEX IF NOT EXISTS idx_ai_usage_restaurant_created
  ON ai_usage_logs(restaurant_id, created_at);

COMMENT ON COLUMN ai_usage_logs.restaurant_id IS 'Scoping restaurant for per-tenant cost reporting. NULL for system-level calls.';
COMMENT ON COLUMN ai_usage_logs.success       IS 'Whether the AI call returned without error. Default TRUE for historical rows.';
COMMENT ON COLUMN ai_usage_logs.error_code    IS 'Vendor error code (e.g. anthropic rate_limit_error) when success=false.';
