-- Add whatsappPhone column to suppliers table
ALTER TABLE "suppliers" ADD COLUMN IF NOT EXISTS "whatsappPhone" TEXT;
