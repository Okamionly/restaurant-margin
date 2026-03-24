-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "recipe_ingredients" ADD COLUMN     "wastePercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cookTimeMinutes" INTEGER,
ADD COLUMN     "laborCostPerHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "prepTimeMinutes" INTEGER;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'chef',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
