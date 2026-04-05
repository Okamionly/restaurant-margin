CREATE TABLE IF NOT EXISTS "menu_calendar" (
  "id" SERIAL PRIMARY KEY,
  "restaurantId" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "mealType" TEXT NOT NULL DEFAULT 'lunch',
  "recipeId" INTEGER NOT NULL REFERENCES "recipes"("id"),
  "category" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "idx_menu_calendar" ON "menu_calendar" ("restaurantId", "date");
