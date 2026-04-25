-- =====================================================
-- Migration: 20260425_3020_rls_strict
-- Purpose : Replace Phase 1 permissive RLS policies with strict tenant
--           isolation using app.current_user_id GUC (set by API middleware
--           via setGUC() on every authenticated request).
--
-- PREREQUISITE: migration 20260425_3010_user_mfa must have run.
-- PREREQUISITE: API must set GUC before any tenant query — see
--               api-lib/middleware.ts setGUC() helper.
--
-- How it works:
--   The API calls `SELECT set_config('app.current_user_id', $1, true)`
--   (transaction-local) at the start of each authenticated request.
--   Each policy then checks that the row's restaurantId belongs to a
--   restaurant where the GUC user is a member.
--
-- Tables with restaurantId (direct check):
--   ingredients, recipes, suppliers, invoices, price_history, menu_sales,
--   devis, financial_entries, waste_logs, employees, shifts, seminaires
--
-- Notes:
--   - service_role (Supabase) bypasses RLS by default — admin ops safe.
--   - current_setting(..., true) returns '' on missing GUC (not an error).
--   - The subquery references restaurant_members which has its own RLS
--     disabled intentionally (it's the join table for access checks).
--   - All DROP + CREATE are idempotent (IF EXISTS / IF NOT EXISTS).
-- =====================================================

-- Disable RLS on restaurant_members so it can be used in sub-selects
-- from within other table policies without recursion.
ALTER TABLE restaurant_members DISABLE ROW LEVEL SECURITY;

-- Helper: subquery used in all policies below
-- current_setting('app.current_user_id', true) returns '' if not set → cast to 0 → no rows
-- This means unauthenticated DB connections (e.g. migrations) see 0 rows (fail-closed).

-- ─── 1. ingredients ───────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON ingredients;
DROP POLICY IF EXISTS tenant_isolation ON ingredients;
CREATE POLICY tenant_isolation ON ingredients
  USING (
    "restaurantId" IN (
      SELECT "restaurantId"
      FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId"
      FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 2. recipes ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON recipes;
DROP POLICY IF EXISTS tenant_isolation ON recipes;
CREATE POLICY tenant_isolation ON recipes
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 3. suppliers ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON suppliers;
DROP POLICY IF EXISTS tenant_isolation ON suppliers;
CREATE POLICY tenant_isolation ON suppliers
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 4. invoices ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON invoices;
DROP POLICY IF EXISTS tenant_isolation ON invoices;
CREATE POLICY tenant_isolation ON invoices
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 5. price_history ─────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON price_history;
DROP POLICY IF EXISTS tenant_isolation ON price_history;
CREATE POLICY tenant_isolation ON price_history
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 6. menu_sales ────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON menu_sales;
DROP POLICY IF EXISTS tenant_isolation ON menu_sales;
CREATE POLICY tenant_isolation ON menu_sales
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 7. devis ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON devis;
DROP POLICY IF EXISTS tenant_isolation ON devis;
CREATE POLICY tenant_isolation ON devis
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 8. financial_entries ─────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON financial_entries;
DROP POLICY IF EXISTS tenant_isolation ON financial_entries;
CREATE POLICY tenant_isolation ON financial_entries
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 9. waste_logs ────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON waste_logs;
DROP POLICY IF EXISTS tenant_isolation ON waste_logs;
CREATE POLICY tenant_isolation ON waste_logs
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 10. employees ────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON employees;
DROP POLICY IF EXISTS tenant_isolation ON employees;
CREATE POLICY tenant_isolation ON employees
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 11. shifts ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON shifts;
DROP POLICY IF EXISTS tenant_isolation ON shifts;
CREATE POLICY tenant_isolation ON shifts
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

-- ─── 12. seminaires ───────────────────────────────────────────────────
DROP POLICY IF EXISTS permissive_all ON seminaires;
DROP POLICY IF EXISTS tenant_isolation ON seminaires;
CREATE POLICY tenant_isolation ON seminaires
  USING (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  )
  WITH CHECK (
    "restaurantId" IN (
      SELECT "restaurantId" FROM restaurant_members
      WHERE "userId" = NULLIF(current_setting('app.current_user_id', true), '')::int
    )
  );

COMMENT ON TABLE restaurant_members IS 'Join table for user-restaurant access. RLS disabled — used in sub-selects by all tenant policies.';
