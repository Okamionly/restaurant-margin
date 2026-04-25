-- =====================================================
-- Migration: 20260425_3050_clients_crm
-- Purpose  : Create clients table for CRM Wave 3.
--            Replaces localStorage-based client storage with server-side
--            Postgres rows scoped by restaurantId (multi-tenant, multi-device).
--
-- Idempotent: uses CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS.
-- RLS       : Phase 1 permissive policy (consistent with 20260425_1060_rls_tenant).
-- =====================================================

-- ── Table ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  id              SERIAL PRIMARY KEY,
  "restaurantId"  INTEGER       NOT NULL
                    REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT          NOT NULL,
  email           TEXT,
  phone           TEXT,
  notes           TEXT,
  tags            TEXT[]        NOT NULL DEFAULT '{}',
  "totalOrders"   INTEGER       NOT NULL DEFAULT 0,
  "totalSpentEur" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "lastOrderAt"   TIMESTAMPTZ,
  "deletedAt"     TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS clients_restaurantId_name_idx
  ON clients ("restaurantId", name);

CREATE INDEX IF NOT EXISTS clients_restaurantId_email_idx
  ON clients ("restaurantId", email);

CREATE INDEX IF NOT EXISTS clients_restaurantId_idx
  ON clients ("restaurantId");

-- ── Auto-update updatedAt ──────────────────────────────────────────────────
-- Reuse the trigger function if already created by another migration;
-- otherwise create it here.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clients_set_updated_at ON clients;
CREATE TRIGGER clients_set_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS — Phase 1 (permissive, consistent with 20260425_1060_rls_tenant) ──

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS permissive_all ON clients;
CREATE POLICY permissive_all ON clients USING (true) WITH CHECK (true);

-- =====================================================
-- Phase 2 strict policy (TODO — activate after E2E cross-tenant tests):
--
--   DROP POLICY permissive_all ON clients;
--   CREATE POLICY tenant_isolation ON clients
--     USING (
--       "restaurantId" IN (
--         SELECT "restaurantId"
--         FROM restaurant_members
--         WHERE "userId" = current_setting('app.current_user_id', true)::int
--       )
--     )
--     WITH CHECK (
--       "restaurantId" IN (
--         SELECT "restaurantId"
--         FROM restaurant_members
--         WHERE "userId" = current_setting('app.current_user_id', true)::int
--       )
--     );
-- =====================================================
