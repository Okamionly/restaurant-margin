-- =====================================================
-- Migration: 20260425_1060_rls_tenant
-- Purpose : Enable Row Level Security on every tenant-scoped table so
--           a future application-level bug that forgets to filter by
--           restaurant_id cannot leak data across tenants.
--
-- ⚠️ SAFETY PHASING ⚠️
--   Phase 1 (this migration, SAFE TO DEPLOY):
--     - ENABLE ROW LEVEL SECURITY on 12 tables
--     - Attach a permissive policy `USING (true)` that allows every
--       query, exactly as today. Behaviour is IDENTICAL to pre-RLS,
--       but the table is now "armed" — if the policy is dropped or
--       replaced without a replacement, reads start returning 0 rows
--       (fail-closed), not leaking across tenants.
--
--   Phase 2 (SEPARATE MIGRATION after E2E test cross-tenant):
--     - DROP the permissive policy
--     - CREATE a strict policy that joins to restaurant_members using
--       a GUC (`app.current_user_id`) set by the API on every request.
--     - The API must `SELECT set_config('app.current_user_id', $1, true)`
--       in a transaction before any data query.
--     - SEE COMMENTED BLOCK AT BOTTOM for the strict policies.
--
-- TEST INTENSIVELY BEFORE ENABLING STRICT POLICIES. A policy bug
-- makes data invisible to the owner, not just to other tenants.
-- =====================================================

-- --- Phase 1: enable + permissive -------------------------------

-- 1. ingredients
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON ingredients;
CREATE POLICY permissive_all ON ingredients USING (true) WITH CHECK (true);

-- 2. recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON recipes;
CREATE POLICY permissive_all ON recipes USING (true) WITH CHECK (true);

-- 3. suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON suppliers;
CREATE POLICY permissive_all ON suppliers USING (true) WITH CHECK (true);

-- 4. invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON invoices;
CREATE POLICY permissive_all ON invoices USING (true) WITH CHECK (true);

-- 5. price_history
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON price_history;
CREATE POLICY permissive_all ON price_history USING (true) WITH CHECK (true);

-- 6. menu_sales
ALTER TABLE menu_sales ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON menu_sales;
CREATE POLICY permissive_all ON menu_sales USING (true) WITH CHECK (true);

-- 7. devis
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON devis;
CREATE POLICY permissive_all ON devis USING (true) WITH CHECK (true);

-- 8. financial_entries
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON financial_entries;
CREATE POLICY permissive_all ON financial_entries USING (true) WITH CHECK (true);

-- 9. waste_logs
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON waste_logs;
CREATE POLICY permissive_all ON waste_logs USING (true) WITH CHECK (true);

-- 10. employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON employees;
CREATE POLICY permissive_all ON employees USING (true) WITH CHECK (true);

-- 11. shifts
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON shifts;
CREATE POLICY permissive_all ON shifts USING (true) WITH CHECK (true);

-- 12. seminaires
ALTER TABLE seminaires ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON seminaires;
CREATE POLICY permissive_all ON seminaires USING (true) WITH CHECK (true);

-- =====================================================
-- Phase 2 — STRICT POLICIES (TODO, keep commented until validated)
--
-- The API must set a GUC on every request before querying:
--
--   await prisma.$executeRawUnsafe(
--     `SELECT set_config('app.current_user_id', $1, true)`,
--     String(req.user.id)
--   );
--
-- Then replace `permissive_all` with policies like below. Example
-- for `ingredients` (same shape for the other 11 tables, substituting
-- the table name):
--
--   DROP POLICY permissive_all ON ingredients;
--   CREATE POLICY tenant_isolation ON ingredients
--     USING (
--       restaurant_id IN (
--         SELECT restaurant_id
--         FROM restaurant_members
--         WHERE user_id = current_setting('app.current_user_id', true)::int
--       )
--     )
--     WITH CHECK (
--       restaurant_id IN (
--         SELECT restaurant_id
--         FROM restaurant_members
--         WHERE user_id = current_setting('app.current_user_id', true)::int
--       )
--     );
--
-- ⚠️ TEST INTENSIVELY BEFORE ENABLING STRICT POLICIES ⚠️
--   - E2E test cross-tenant: user A must get 0 rows from user B's data
--   - E2E test same-tenant : user A sees own data
--   - Load test           : GUC + subquery adds ~0.5-2ms per query
--   - Backoffice admin    : service_role bypasses RLS automatically
--                           (Supabase default) — verify this.
-- =====================================================
