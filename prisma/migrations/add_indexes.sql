-- Add performance indexes for common query patterns
-- Generated: 2026-04-05
-- NOTE: Run manually or via prisma migrate. These are CREATE INDEX IF NOT EXISTS for safety.

-- Ingredient: index on (restaurantId, category) for filtered ingredient lists
CREATE INDEX IF NOT EXISTS "ingredients_restaurantId_category_idx" ON "ingredients" ("restaurantId", "category");

-- Ingredient: index on (supplierId) for supplier-based ingredient lookups
CREATE INDEX IF NOT EXISTS "ingredients_supplierId_idx" ON "ingredients" ("supplierId");

-- Invoice: composite index on (restaurantId, status) for filtered invoice queries
CREATE INDEX IF NOT EXISTS "invoices_restaurantId_status_idx" ON "invoices" ("restaurantId", "status");
