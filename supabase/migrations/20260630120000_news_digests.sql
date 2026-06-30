-- Prep2Go weekly news briefings (shared with prep2go.study; Emigro reads, CIPLE GV cron writes)
CREATE TABLE IF NOT EXISTS public.news_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  topic_key TEXT NOT NULL,
  country TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_takeaways TEXT[] NOT NULL DEFAULT '{}'::text[],
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  source_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  telegram_html TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_digests_status_published_at_idx
  ON public.news_digests (status, published_at DESC);

CREATE INDEX IF NOT EXISTS news_digests_topic_published_at_idx
  ON public.news_digests (topic_key, published_at DESC);

CREATE INDEX IF NOT EXISTS news_digests_tags_idx
  ON public.news_digests USING gin (tags);

ALTER TABLE public.news_digests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published news digests are readable" ON public.news_digests;
CREATE POLICY "Published news digests are readable"
  ON public.news_digests
  FOR SELECT
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
