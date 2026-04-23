-- CFO finance infrastructure migration
-- Date : 2026-04-23
-- Adds : invoice_sequences (FR-compliant invoice numbering art. 242 nonies A CGI)
--        ai_usage_logs (cost instrumentation Anthropic/OpenAI API calls)
--        nps_responses (NPS J+14 tracking from CCO build)

-- =====================================================
-- Table: invoice_sequences
-- Purpose: atomic sequential invoice numbering per year (FAC-YYYY-NNNNNN)
-- =====================================================
CREATE TABLE IF NOT EXISTS invoice_sequences (
  id           SERIAL PRIMARY KEY,
  year         INTEGER NOT NULL UNIQUE,
  last_number  INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_sequences_year ON invoice_sequences(year);

COMMENT ON TABLE invoice_sequences IS 'Sequential invoice numbering per year (art. 242 nonies A CGI FR)';
COMMENT ON COLUMN invoice_sequences.year IS 'Fiscal year (e.g. 2026)';
COMMENT ON COLUMN invoice_sequences.last_number IS 'Last used sequence number (monotonically increasing)';

-- =====================================================
-- Table: ai_usage_logs
-- Purpose: instrument cost of every Claude/AI API call per user
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,
  model        TEXT NOT NULL,
  tokens_in    INTEGER NOT NULL DEFAULT 0,
  tokens_out   INTEGER NOT NULL DEFAULT 0,
  cost_usd     NUMERIC(10, 6) NOT NULL DEFAULT 0,
  cost_eur     NUMERIC(10, 6) NOT NULL DEFAULT 0,
  duration_ms  INTEGER,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_action ON ai_usage_logs(action);

COMMENT ON TABLE ai_usage_logs IS 'Cost instrumentation for every Claude/AI API call';
COMMENT ON COLUMN ai_usage_logs.action IS 'Action identifier (e.g. ai_chat, recipe_suggestion, food_cost_analysis)';
COMMENT ON COLUMN ai_usage_logs.model IS 'Model used (e.g. claude-sonnet-4-5, claude-haiku-4-5)';
COMMENT ON COLUMN ai_usage_logs.cost_usd IS 'Computed cost in USD based on Anthropic pricing';

-- =====================================================
-- Table: nps_responses (from CCO build, consolidated here)
-- Purpose: NPS J+14 tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS nps_responses (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score       SMALLINT NOT NULL CHECK (score >= 0 AND score <= 10),
  comment     TEXT,
  segment     TEXT GENERATED ALWAYS AS (
    CASE
      WHEN score >= 9 THEN 'promoter'
      WHEN score >= 7 THEN 'passive'
      ELSE 'detractor'
    END
  ) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nps_user_id ON nps_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_nps_created_at ON nps_responses(created_at);

COMMENT ON TABLE nps_responses IS 'NPS J+14 in-app responses (CCO)';
COMMENT ON COLUMN nps_responses.segment IS 'Auto-computed: promoter (9-10), passive (7-8), detractor (0-6)';

-- =====================================================
-- Rollback (for reference)
-- =====================================================
-- DROP TABLE IF EXISTS invoice_sequences;
-- DROP TABLE IF EXISTS ai_usage_logs;
-- DROP TABLE IF EXISTS nps_responses;
