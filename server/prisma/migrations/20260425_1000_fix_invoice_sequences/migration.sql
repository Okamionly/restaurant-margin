-- =====================================================
-- Migration: 20260425_1000_fix_invoice_sequences
-- Purpose : Bring invoice_sequences table in sync with Prisma schema.
--
-- Why     : The 2026-04-23 migration (CFO finance infra) created the
--           invoice_sequences table WITHOUT the `key` and `prefix`
--           columns that schema.prisma declares. The result: Prisma
--           Client crashes on the very first read (P2022: column does
--           not exist). This migration is a CRITICAL DRIFT FIX.
--
-- Safety  : idempotent (IF NOT EXISTS / IF NOT EXISTS on index).
--           Backfills existing rows with FAC-<year> / FAC before
--           enforcing NOT NULL.
-- =====================================================

-- 1. Add the two missing columns (nullable for now so backfill works).
ALTER TABLE invoice_sequences
  ADD COLUMN IF NOT EXISTS key    TEXT,
  ADD COLUMN IF NOT EXISTS prefix TEXT;

-- 2. Backfill existing rows: derive key from year, set prefix to FAC.
--    If multiple rows share the same year this will violate the UNIQUE
--    index added below; that is intentional (surface the inconsistency).
UPDATE invoice_sequences
   SET key    = 'FAC-' || year::TEXT,
       prefix = 'FAC'
 WHERE key IS NULL
    OR prefix IS NULL;

-- 3. Enforce NOT NULL now that every row has a value.
ALTER TABLE invoice_sequences
  ALTER COLUMN key    SET NOT NULL,
  ALTER COLUMN prefix SET NOT NULL;

-- 4. UNIQUE index on `key` to match Prisma `@unique`.
CREATE UNIQUE INDEX IF NOT EXISTS invoice_sequences_key_key
  ON invoice_sequences(key);

-- 5. Composite index on (prefix, year) to match Prisma `@@index`.
CREATE INDEX IF NOT EXISTS invoice_sequences_prefix_year_idx
  ON invoice_sequences(prefix, year);

COMMENT ON COLUMN invoice_sequences.key    IS 'Logical key, e.g. FAC-2026 (unique per prefix/year combo).';
COMMENT ON COLUMN invoice_sequences.prefix IS 'Document prefix, e.g. FAC (facture), DEV (devis), AVO (avoir).';
