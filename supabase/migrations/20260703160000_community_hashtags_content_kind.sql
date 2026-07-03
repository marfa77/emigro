-- Hashtags + content kind (news / lifehack / tip / guide / qa)

ALTER TABLE public.community_signals
  ADD COLUMN IF NOT EXISTS content_kind TEXT NOT NULL DEFAULT 'tip'
    CHECK (content_kind IN ('news', 'lifehack', 'tip', 'guide', 'qa')),
  ADD COLUMN IF NOT EXISTS hashtags TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.community_notes
  ADD COLUMN IF NOT EXISTS content_kind TEXT NOT NULL DEFAULT 'guide'
    CHECK (content_kind IN ('news', 'lifehack', 'tip', 'guide', 'qa')),
  ADD COLUMN IF NOT EXISTS hashtags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS community_signals_hashtags_idx
  ON public.community_signals USING gin (hashtags);

CREATE INDEX IF NOT EXISTS community_notes_hashtags_idx
  ON public.community_notes USING gin (hashtags);

CREATE INDEX IF NOT EXISTS community_notes_content_kind_published_idx
  ON public.community_notes (content_kind, published_at DESC);
