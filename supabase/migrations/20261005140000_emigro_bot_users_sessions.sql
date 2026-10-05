-- Product identity + one live FSM session for @emigro_chat_bot.

CREATE TABLE IF NOT EXISTS emigro_bot_users (
  telegram_user_id BIGINT PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  country_hint TEXT,
  blocked_at TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_bot_users_last_seen_idx
  ON emigro_bot_users (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS emigro_bot_sessions (
  telegram_user_id BIGINT PRIMARY KEY REFERENCES emigro_bot_users (telegram_user_id) ON DELETE CASCADE,
  app TEXT NOT NULL CHECK (app IN ('assist', 'property', 'news', 'city')),
  step TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_bot_sessions_expires_idx
  ON emigro_bot_sessions (expires_at);

ALTER TABLE emigro_bot_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_bot_sessions ENABLE ROW LEVEL SECURITY;
