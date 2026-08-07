-- Hot path: hub / sitemap / tags filter by country + status, order by published_at.
-- Without this composite index, micro compute times out on select * of fat guide rows (57014).

CREATE INDEX IF NOT EXISTS community_notes_country_status_published_idx
  ON public.community_notes (country_key, status, published_at DESC NULLS LAST);

-- Slug lookups already use UNIQUE(slug); keep country filter cheap when present.
CREATE INDEX IF NOT EXISTS community_notes_country_slug_idx
  ON public.community_notes (country_key, slug);
