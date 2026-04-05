-- Add time_entries table for employee punch clock / time tracking
CREATE TABLE IF NOT EXISTS "time_entries" (
  "id" SERIAL PRIMARY KEY,
  "employeeId" INTEGER NOT NULL,
  "date" TEXT NOT NULL,
  "punchIn" TIMESTAMP(3) NOT NULL,
  "punchOut" TIMESTAMP(3),
  "totalMinutes" INTEGER,
  "notes" TEXT,
  "restaurantId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "time_entries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE,
  CONSTRAINT "time_entries_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS "time_entries_restaurantId_date_idx" ON "time_entries" ("restaurantId", "date");
CREATE INDEX IF NOT EXISTS "time_entries_employeeId_date_idx" ON "time_entries" ("employeeId", "date");
