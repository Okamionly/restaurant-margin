-- Step 1: Create Restaurant and RestaurantMember tables
CREATE TABLE "restaurants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "cuisineType" TEXT,
    "phone" TEXT,
    "coversPerDay" INTEGER NOT NULL DEFAULT 80,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "restaurant_members" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    CONSTRAINT "restaurant_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "restaurant_members_userId_restaurantId_key" ON "restaurant_members"("userId", "restaurantId");

-- Step 2: Create a default restaurant for existing data (if users exist)
INSERT INTO "restaurants" ("name", "ownerId", "updatedAt")
SELECT 'Mon Restaurant', "id", CURRENT_TIMESTAMP
FROM "users"
ORDER BY "id" ASC
LIMIT 1;

-- Step 3: Add all existing users as members of the default restaurant
INSERT INTO "restaurant_members" ("userId", "restaurantId", "role")
SELECT u."id", r."id", CASE WHEN u."role" = 'admin' THEN 'owner' ELSE 'member' END
FROM "users" u
CROSS JOIN "restaurants" r
WHERE r."id" = (SELECT MIN("id") FROM "restaurants");

-- Step 4: Add restaurantId as NULLABLE first to all 8 tables
ALTER TABLE "suppliers" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "ingredients" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "recipes" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "inventory_items" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "invoices" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "price_history" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "menu_sales" ADD COLUMN "restaurantId" INTEGER;
ALTER TABLE "conversations" ADD COLUMN "restaurantId" INTEGER;

-- Step 5: Backfill existing rows with default restaurant ID
UPDATE "suppliers" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "ingredients" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "recipes" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "inventory_items" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "invoices" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "price_history" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "menu_sales" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;
UPDATE "conversations" SET "restaurantId" = (SELECT MIN("id") FROM "restaurants") WHERE "restaurantId" IS NULL;

-- Step 6: Set NOT NULL constraint (safe now because all rows have a value)
ALTER TABLE "suppliers" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "ingredients" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "inventory_items" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "price_history" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "menu_sales" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "conversations" ALTER COLUMN "restaurantId" SET NOT NULL;

-- Step 7: Add foreign key constraints
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "restaurant_members" ADD CONSTRAINT "restaurant_members_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_sales" ADD CONSTRAINT "menu_sales_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
