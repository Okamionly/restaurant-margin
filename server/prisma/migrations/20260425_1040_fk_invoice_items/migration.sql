-- =====================================================
-- Migration: 20260425_1040_fk_invoice_items
-- Purpose : Add FK constraints from `*_items.ingredient_id` to
--           `ingredients.id` so orphaned references are prevented.
--
-- Why     : Both invoice_items and marketplace_order_items carry a
--           nullable `ingredient_id INTEGER` column that the code
--           uses to link parsed OCR items back to the ingredient
--           catalogue. Today there is NO foreign key — deleting an
--           ingredient leaves dangling pointers and breaks joins.
--
-- Safety  : ON DELETE SET NULL preserves historical invoice rows if
--           the underlying ingredient is ever hard-deleted. NOT
--           VALID + VALIDATE is used so the lock is only metadata on
--           large tables; existing dangling rows can be cleaned up
--           before the VALIDATE step.
-- =====================================================

-- 1. invoice_items → ingredients
--    NOT VALID first to avoid a full table scan under ACCESS EXCLUSIVE
--    lock. Then VALIDATE in a second statement under SHARE UPDATE
--    EXCLUSIVE (readers + writers OK).
ALTER TABLE invoice_items
  DROP CONSTRAINT IF EXISTS fk_invoice_items_ingredient;

ALTER TABLE invoice_items
  ADD CONSTRAINT fk_invoice_items_ingredient
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  ON DELETE SET NULL
  NOT VALID;

-- If dangling rows exist, clean them up before VALIDATE (they will be
-- set to NULL by the SET NULL cascade once validated).
UPDATE invoice_items ii
   SET ingredient_id = NULL
 WHERE ingredient_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM ingredients i WHERE i.id = ii.ingredient_id);

ALTER TABLE invoice_items
  VALIDATE CONSTRAINT fk_invoice_items_ingredient;

-- 2. marketplace_order_items → ingredients
ALTER TABLE marketplace_order_items
  DROP CONSTRAINT IF EXISTS fk_marketplace_order_items_ingredient;

ALTER TABLE marketplace_order_items
  ADD CONSTRAINT fk_marketplace_order_items_ingredient
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  ON DELETE SET NULL
  NOT VALID;

UPDATE marketplace_order_items moi
   SET ingredient_id = NULL
 WHERE ingredient_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM ingredients i WHERE i.id = moi.ingredient_id);

ALTER TABLE marketplace_order_items
  VALIDATE CONSTRAINT fk_marketplace_order_items_ingredient;

-- 3. Helpful indexes on the FK columns (lookup "all invoice items for
--    ingredient X"). Not strictly required by the FK itself.
CREATE INDEX IF NOT EXISTS idx_invoice_items_ingredient
  ON invoice_items(ingredient_id)
  WHERE ingredient_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_ingredient
  ON marketplace_order_items(ingredient_id)
  WHERE ingredient_id IS NOT NULL;
