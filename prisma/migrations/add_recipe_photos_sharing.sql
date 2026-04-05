-- Add photo gallery and sharing support to recipes
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "photos" TEXT[] DEFAULT '{}';
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "shareToken" TEXT;

-- Unique index on shareToken for fast public lookups
CREATE UNIQUE INDEX IF NOT EXISTS "recipes_shareToken_key" ON "recipes"("shareToken");
