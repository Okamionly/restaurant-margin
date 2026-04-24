-- =====================================================
-- Migration: 20260425_1030_indexes_recipe_ingredients
-- Purpose : Add missing FK indexes on recipe_ingredients and drop a
--           redundant single-column index on price_history.
--
-- Why     : recipe_ingredients is a hot junction table read on every
--           recipe detail page. Today it has only the (recipe_id,
--           ingredient_id) UNIQUE constraint, which gives a usable
--           index for `WHERE recipe_id = ?` but NOT for
--           `WHERE ingredient_id = ?` (trailing columns of compound
--           indexes can't seek). Listing "recipes using ingredient X"
--           triggers a full table scan on every call.
--
--           price_history has both `(ingredient_id)` AND
--           `(ingredient_id, date)` AND `(ingredient_id, created_at)`
--           indexes. The first is redundant — any of the compound
--           indexes can serve a single-column `ingredient_id` lookup.
--
-- Safety  : idempotent.
-- =====================================================

-- 1. Missing secondary indexes on recipe_ingredients.
CREATE INDEX IF NOT EXISTS idx_ri_ingredient_id
  ON recipe_ingredients(ingredient_id);

CREATE INDEX IF NOT EXISTS idx_ri_recipe_id
  ON recipe_ingredients(recipe_id);

-- 2. Drop redundant single-column index (no-op if it never existed).
--    Prisma named it price_history_ingredient_id_idx (see @@index
--    in schema.prisma).
DROP INDEX IF EXISTS price_history_ingredient_id_idx;

COMMENT ON INDEX idx_ri_ingredient_id IS 'FK index for "list recipes using ingredient X" queries.';
COMMENT ON INDEX idx_ri_recipe_id     IS 'FK index for "list ingredients of recipe X" queries.';
