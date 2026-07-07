-- Wizard users who requested Telegram report delivery

CREATE TABLE IF NOT EXISTS emigro_wizard_telegram_users (
  telegram_user_id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT,
  is_premium BOOLEAN,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_count INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS emigro_wizard_telegram_users_last_seen_idx
  ON emigro_wizard_telegram_users (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS emigro_wizard_telegram_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL REFERENCES emigro_wizard_telegram_users (telegram_user_id) ON DELETE CASCADE,
  wizard_session_id UUID NOT NULL,
  wizard_mode TEXT NOT NULL CHECK (wizard_mode IN ('hub', 'corridor')),
  source TEXT NOT NULL DEFAULT 'bot_start' CHECK (source IN ('bot_start', 'login_widget')),
  passport_iso2 TEXT,
  top_recommendation TEXT,
  match_count INT,
  report_sent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (telegram_user_id, wizard_session_id)
);

CREATE INDEX IF NOT EXISTS emigro_wizard_telegram_deliveries_session_idx
  ON emigro_wizard_telegram_deliveries (wizard_session_id);

CREATE INDEX IF NOT EXISTS emigro_wizard_telegram_deliveries_created_idx
  ON emigro_wizard_telegram_deliveries (created_at DESC);

ALTER TABLE emigro_wizard_telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_wizard_telegram_deliveries ENABLE ROW LEVEL SECURITY;
