-- Distinguish weekly digests from single-story tiles (Portugal stories v1).
-- Existing rows default to digest; do not rewrite content.

ALTER TABLE emigro_news_digests
  ADD COLUMN IF NOT EXISTS format TEXT NOT NULL DEFAULT 'digest'
  CHECK (format IN ('digest', 'story'));

CREATE INDEX IF NOT EXISTS emigro_news_digests_format_published_idx
  ON emigro_news_digests (format, status, published_at DESC);
