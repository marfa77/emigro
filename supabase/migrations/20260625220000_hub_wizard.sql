-- Global hub wizard sessions (cross-corridor evaluation)

CREATE TABLE IF NOT EXISTS emigro_hub_wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answers JSONB NOT NULL DEFAULT '{}',
  passport_iso2 TEXT,
  results JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_hub_wizard_sessions_created_idx
  ON emigro_hub_wizard_sessions (created_at DESC);

ALTER TABLE emigro_hub_wizard_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_hub_sessions" ON emigro_hub_wizard_sessions;
CREATE POLICY "anon_insert_hub_sessions" ON emigro_hub_wizard_sessions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_hub_sessions" ON emigro_hub_wizard_sessions;
CREATE POLICY "anon_read_hub_sessions" ON emigro_hub_wizard_sessions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "anon_update_hub_sessions" ON emigro_hub_wizard_sessions;
CREATE POLICY "anon_update_hub_sessions" ON emigro_hub_wizard_sessions
  FOR UPDATE USING (true);
