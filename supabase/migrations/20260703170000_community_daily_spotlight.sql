-- Daily spotlight: one featured note per day (Threads-ready copy)

CREATE TABLE IF NOT EXISTS public.community_daily_spotlight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_key TEXT NOT NULL DEFAULT 'portugal',
  spotlight_date DATE NOT NULL,
  note_slug TEXT NOT NULL,
  note_id UUID REFERENCES public.community_notes(id) ON DELETE SET NULL,
  content_kind TEXT NOT NULL DEFAULT 'tip',
  headline TEXT NOT NULL,
  threads_text TEXT NOT NULL,
  note_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_key, spotlight_date)
);

CREATE INDEX IF NOT EXISTS community_daily_spotlight_date_idx
  ON public.community_daily_spotlight (country_key, spotlight_date DESC);

ALTER TABLE public.community_daily_spotlight ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_community_daily_spotlight" ON public.community_daily_spotlight;
CREATE POLICY "public_read_community_daily_spotlight"
  ON public.community_daily_spotlight
  FOR SELECT
  USING (true);
