-- FIX 1: Soft Delete for Ingredients and Recipes
ALTER TABLE "ingredients" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;

-- FIX 4: Stock Level Warnings - minQuantity for InventoryItem
ALTER TABLE "inventory_items" ADD COLUMN IF NOT EXISTS "minQuantity" FLOAT DEFAULT 0;
