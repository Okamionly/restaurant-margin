CREATE TABLE IF NOT EXISTS "customer_feedback" (
  "id" SERIAL PRIMARY KEY,
  "restaurantId" INTEGER NOT NULL,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "comment" TEXT,
  "source" TEXT DEFAULT 'app',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "idx_feedback_restaurant" ON "customer_feedback" ("restaurantId", "createdAt");
