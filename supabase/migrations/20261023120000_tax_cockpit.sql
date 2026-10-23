-- Tax Year Cockpit + session app enum widen + bot product events.

ALTER TABLE emigro_bot_sessions DROP CONSTRAINT IF EXISTS emigro_bot_sessions_app_check;
ALTER TABLE emigro_bot_sessions
  ADD CONSTRAINT emigro_bot_sessions_app_check
  CHECK (app IN ('assist', 'property', 'news', 'city', 'invest', 'tax', 'wizard'));

CREATE TABLE IF NOT EXISTS emigro_tax_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL REFERENCES emigro_bot_users (telegram_user_id) ON DELETE CASCADE,
  tax_year INT NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (telegram_user_id, tax_year)
);

CREATE TABLE IF NOT EXISTS emigro_tax_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_id UUID NOT NULL REFERENCES emigro_tax_ledgers (id) ON DELETE CASCADE,
  country_iso2 CHAR(2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manual', 'ticket', 'import')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS emigro_tax_presence_ledger_idx
  ON emigro_tax_presence (ledger_id, country_iso2);

CREATE TABLE IF NOT EXISTS emigro_bot_events (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_bot_events_user_time_idx
  ON emigro_bot_events (telegram_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS emigro_bot_events_name_time_idx
  ON emigro_bot_events (event_name, created_at DESC);

ALTER TABLE emigro_tax_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_tax_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_bot_events ENABLE ROW LEVEL SECURITY;
