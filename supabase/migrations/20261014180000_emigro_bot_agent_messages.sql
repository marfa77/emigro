-- Owner marketing agent in @emigro_chat_bot: short dialogue memory.

CREATE TABLE IF NOT EXISTS emigro_bot_agent_messages (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  text TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_bot_agent_messages_user_idx
  ON emigro_bot_agent_messages (telegram_user_id, created_at DESC);

ALTER TABLE emigro_bot_agent_messages ENABLE ROW LEVEL SECURITY;
