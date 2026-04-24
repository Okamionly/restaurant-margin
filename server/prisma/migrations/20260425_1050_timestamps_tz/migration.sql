-- =====================================================
-- Migration: 20260425_1050_timestamps_tz
-- Purpose : Convert legacy TIMESTAMP(3) WITHOUT TIME ZONE columns on
--           the six core tables to TIMESTAMPTZ so DST transitions,
--           cross-region clients, and JS Date serialisation stay
--           correct.
--
-- ⚠️ DESTRUCTIVE TYPE CHANGE ⚠️
--   This migration REWRITES the affected columns (Postgres cannot
--   change a type in-place when the storage differs). On large
--   tables this takes an ACCESS EXCLUSIVE lock for the duration of
--   the rewrite.
--
--   BEFORE RUNNING IN PROD:
--     1. Take a logical pg_dump of all 6 tables
--        (see docs/db-backup-runbook.md).
--     2. Run during low-traffic window.
--     3. Use a Supabase branch first to measure duration.
--     4. Have a rollback plan: pg_restore the dump if anything fails.
--
-- Why     : Legacy migrations (2026-03-24 init) used
--           TIMESTAMP(3) (a.k.a. "timestamp without time zone" in
--           Postgres). That stores wall-clock time without offset:
--             - a Date created at 02:30 local during a DST fallback
--               becomes ambiguous;
--             - clients in different timezones see different values
--               when reading the same row;
--             - Prisma Node.js client silently applies the process TZ
--               (server TZ) when parsing, leading to subtle off-by-one
--               bugs at month boundaries for CFO reports.
--
--           Newer migrations (invoice_sequences, ai_usage_logs)
--           already use TIMESTAMPTZ. This brings the legacy 6 tables
--           into alignment.
--
-- Strategy: USING <col> AT TIME ZONE 'UTC' — we assume all existing
--           timestamps are already UTC because that's what Prisma's
--           @default(now()) writes (Prisma sends UTC to Postgres
--           regardless of client TZ). If this assumption is wrong for
--           any subset, fix the relevant rows BEFORE running this
--           migration.
-- =====================================================

-- =============== users ===============
ALTER TABLE users
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC';

-- =============== restaurants ===============
ALTER TABLE restaurants
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE 'UTC';

-- =============== ingredients ===============
ALTER TABLE ingredients
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE 'UTC';

-- =============== recipes ===============
ALTER TABLE recipes
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE 'UTC';

-- =============== suppliers ===============
ALTER TABLE suppliers
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ USING "updatedAt" AT TIME ZONE 'UTC';

-- =============== invoices ===============
ALTER TABLE invoices
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ USING "createdAt" AT TIME ZONE 'UTC';

-- =====================================================
-- NOTE: column names are quoted (camelCase) because the original
-- Prisma-generated tables use quoted mixed case ("createdAt"), not
-- snake_case. Verify with: \d+ users   in psql before running.
-- =====================================================
