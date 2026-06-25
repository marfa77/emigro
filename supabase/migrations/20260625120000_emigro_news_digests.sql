-- Weekly corridor news digests (CIPLE news_digests pattern, RU-first)

CREATE TABLE IF NOT EXISTS emigro_news_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  corridor_slug TEXT NOT NULL DEFAULT 'ru-speaking-to-portugal',
  topic_key TEXT NOT NULL DEFAULT 'portugal',
  country TEXT NOT NULL DEFAULT 'Португалия',
  locale TEXT NOT NULL DEFAULT 'ru',
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  source_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  telegram_html TEXT,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_news_digests_status_published_idx
  ON emigro_news_digests (status, published_at DESC);

CREATE INDEX IF NOT EXISTS emigro_news_digests_corridor_published_idx
  ON emigro_news_digests (corridor_slug, published_at DESC);

CREATE INDEX IF NOT EXISTS emigro_news_digests_tags_idx
  ON emigro_news_digests USING gin (tags);

ALTER TABLE emigro_news_digests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_news" ON emigro_news_digests;
CREATE POLICY "public_read_published_news" ON emigro_news_digests
  FOR SELECT USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );
