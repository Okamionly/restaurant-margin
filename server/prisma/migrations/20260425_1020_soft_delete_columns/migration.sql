-- =====================================================
-- Migration: 20260425_1020_soft_delete_columns
-- Purpose : Add deleted_at soft-delete column to 6 tables whose code
--           already filters on `deletedAt: null`.
--
-- Why     : API queries in server/src and api/index.ts include
--           `WHERE deletedAt IS NULL` systematically, but schema.prisma
--           does not declare the column and the Postgres schema does
--           not have it. Prisma currently translates those filters to
--           a column that does not exist. SILENT DRIFT FIX.
--
-- Note    : A previous ad-hoc SQL file (prisma/migrations/
--           add_soft_delete_and_min_quantity.sql) used the camelCase
--           column name "deletedAt". That file was NEVER run against
--           production Supabase. This migration is the canonical one,
--           using snake_case to follow the rest of the schema.
-- =====================================================

-- 1. Add deleted_at on the six soft-deletable tables.
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE recipes     ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE suppliers   ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE invoices    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE devis       ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE seminaires  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Partial indexes matching the hot-path query
--    (WHERE deleted_at IS NULL). Postgres skips deleted rows entirely
--    so index scans stay small as soft-deleted data grows.
CREATE INDEX IF NOT EXISTS idx_ingredients_not_deleted
  ON ingredients(restaurant_id, name)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_recipes_not_deleted
  ON recipes(restaurant_id, name)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_not_deleted
  ON suppliers(restaurant_id, name)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_not_deleted
  ON invoices(restaurant_id, created_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_devis_not_deleted
  ON devis(restaurant_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_seminaires_not_deleted
  ON seminaires(restaurant_id, date)
  WHERE deleted_at IS NULL;

COMMENT ON COLUMN ingredients.deleted_at IS 'Soft delete timestamp. NULL = active.';
COMMENT ON COLUMN recipes.deleted_at     IS 'Soft delete timestamp. NULL = active.';
COMMENT ON COLUMN suppliers.deleted_at   IS 'Soft delete timestamp. NULL = active.';
COMMENT ON COLUMN invoices.deleted_at    IS 'Soft delete timestamp. NULL = active.';
COMMENT ON COLUMN devis.deleted_at       IS 'Soft delete timestamp. NULL = active.';
COMMENT ON COLUMN seminaires.deleted_at  IS 'Soft delete timestamp. NULL = active.';
