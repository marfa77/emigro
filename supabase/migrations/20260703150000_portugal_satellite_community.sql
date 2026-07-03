-- Portugal Telegram ingest: signals queue + editorial notes (minimal)

CREATE TABLE IF NOT EXISTS public.community_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_username TEXT NOT NULL,
  channel_title TEXT,
  message_id BIGINT NOT NULL,
  post_url TEXT,
  text TEXT NOT NULL,
  topic_hints TEXT[] NOT NULL DEFAULT '{}',
  city TEXT NOT NULL DEFAULT 'lisbon',
  country_key TEXT NOT NULL DEFAULT 'portugal',
  posted_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'published', 'dismissed')),
  note_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (channel_username, message_id)
);

CREATE INDEX IF NOT EXISTS community_signals_status_posted_idx
  ON public.community_signals (status, posted_at DESC);

CREATE INDEX IF NOT EXISTS community_signals_channel_posted_idx
  ON public.community_signals (channel_username, posted_at DESC);

CREATE TABLE IF NOT EXISTS public.community_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  country_key TEXT NOT NULL DEFAULT 'portugal',
  city TEXT NOT NULL DEFAULT 'lisbon',
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  quick_answer TEXT NOT NULL,
  body_paragraphs TEXT[] NOT NULL DEFAULT '{}',
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  official_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_channel TEXT,
  source_label TEXT,
  topic_tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_notes_status_published_idx
  ON public.community_notes (status, published_at DESC);

ALTER TABLE public.community_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_community_notes" ON public.community_notes;
CREATE POLICY "public_read_published_community_notes"
  ON public.community_notes
  FOR SELECT
  USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- Parser channels (reference; live config in parser/groups.yaml):
-- @chatlisboa, @por_tugal
