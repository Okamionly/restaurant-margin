-- ============================================================
-- Supplier Order Management Enhancement
-- Adds lifecycle statuses, expected delivery, reception tracking
-- A exécuter manuellement sur Supabase
-- ============================================================

-- Add new columns to marketplace_orders
ALTER TABLE marketplace_orders
  ADD COLUMN IF NOT EXISTS supplier_id INTEGER,
  ADD COLUMN IF NOT EXISTS expected_delivery TIMESTAMP,
  ADD COLUMN IF NOT EXISTS received_at TIMESTAMP;

-- Add new columns to marketplace_order_items
ALTER TABLE marketplace_order_items
  ADD COLUMN IF NOT EXISTS ingredient_id INTEGER,
  ADD COLUMN IF NOT EXISTS received_quantity DOUBLE PRECISION;

-- Add index for date-based queries
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_restaurant_created
  ON marketplace_orders (restaurant_id, created_at DESC);
