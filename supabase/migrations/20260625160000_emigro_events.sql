-- Product analytics events (autopilot observability)
CREATE TABLE IF NOT EXISTS emigro_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'api',
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_events_name_created_idx ON emigro_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS emigro_events_created_idx ON emigro_events (created_at DESC);

ALTER TABLE emigro_events ENABLE ROW LEVEL SECURITY;
-- No public policies: service_role bypasses RLS for API/cron inserts.
