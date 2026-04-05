-- Add barcode field to ingredients table
ALTER TABLE "ingredients" ADD COLUMN IF NOT EXISTS "barcode" TEXT;

-- Index for fast barcode lookup per restaurant
CREATE INDEX IF NOT EXISTS "ingredients_restaurantId_barcode_idx" ON "ingredients" ("restaurantId", "barcode");
