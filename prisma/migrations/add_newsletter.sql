CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "subscribedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "unsubscribed" BOOLEAN DEFAULT FALSE
);
