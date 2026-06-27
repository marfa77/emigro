ALTER TABLE emigro_news_digests
  ADD COLUMN IF NOT EXISTS telegram_message_ids INTEGER[] DEFAULT '{}';
