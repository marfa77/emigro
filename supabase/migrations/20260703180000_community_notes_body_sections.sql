-- Rich editorial structure for satellite notes (SEO/AEO/LLM)

ALTER TABLE public.community_notes
  ADD COLUMN IF NOT EXISTS body_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_takeaways TEXT[] NOT NULL DEFAULT '{}';
