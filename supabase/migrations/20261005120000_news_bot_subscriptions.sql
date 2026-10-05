-- Country news DMs via @emigro_chat_bot. Subscribe only from the bot chat.

CREATE TABLE IF NOT EXISTS emigro_news_bot_subscriptions (
  telegram_user_id BIGINT NOT NULL,
  chat_id BIGINT NOT NULL,
  topic_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  username TEXT,
  first_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (telegram_user_id, topic_key)
);

CREATE INDEX IF NOT EXISTS emigro_news_bot_subscriptions_topic_active_idx
  ON emigro_news_bot_subscriptions (topic_key, status)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS emigro_news_bot_deliveries (
  telegram_user_id BIGINT NOT NULL,
  digest_id UUID NOT NULL REFERENCES emigro_news_digests (id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (telegram_user_id, digest_id)
);

CREATE INDEX IF NOT EXISTS emigro_news_bot_deliveries_sent_idx
  ON emigro_news_bot_deliveries (sent_at DESC);

ALTER TABLE emigro_news_bot_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_news_bot_deliveries ENABLE ROW LEVEL SECURITY;
