-- Data-quality foundations for source-backed corridor/program content.
-- Additive only: existing public pages keep working before these fields are populated.

ALTER TABLE emigro_program_sources
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'review_needed',
  ADD COLUMN IF NOT EXISTS source_confidence TEXT NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS owner TEXT;

ALTER TABLE emigro_corridor_digest_items
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'review_needed',
  ADD COLUMN IF NOT EXISTS source_confidence TEXT NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS owner TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'emigro_program_sources_review_status_check'
  ) THEN
    ALTER TABLE emigro_program_sources
      ADD CONSTRAINT emigro_program_sources_review_status_check
      CHECK (review_status IN ('review_needed', 'verified', 'stale', 'draft'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'emigro_program_sources_source_confidence_check'
  ) THEN
    ALTER TABLE emigro_program_sources
      ADD CONSTRAINT emigro_program_sources_source_confidence_check
      CHECK (source_confidence IN ('high', 'medium', 'low'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'emigro_corridor_digest_items_review_status_check'
  ) THEN
    ALTER TABLE emigro_corridor_digest_items
      ADD CONSTRAINT emigro_corridor_digest_items_review_status_check
      CHECK (review_status IN ('review_needed', 'verified', 'stale', 'draft'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'emigro_corridor_digest_items_source_confidence_check'
  ) THEN
    ALTER TABLE emigro_corridor_digest_items
      ADD CONSTRAINT emigro_corridor_digest_items_source_confidence_check
      CHECK (source_confidence IN ('high', 'medium', 'low'));
  END IF;
END $$;

COMMENT ON COLUMN emigro_program_sources.review_status IS 'Editorial review state for the cited program source.';
COMMENT ON COLUMN emigro_program_sources.source_confidence IS 'Confidence in source applicability: high, medium, or low.';
COMMENT ON COLUMN emigro_program_sources.owner IS 'Responsible editor or data owner for source verification.';
COMMENT ON COLUMN emigro_corridor_digest_items.review_status IS 'Editorial review state for the digest item.';
COMMENT ON COLUMN emigro_corridor_digest_items.source_confidence IS 'Confidence in source applicability: high, medium, or low.';
COMMENT ON COLUMN emigro_corridor_digest_items.owner IS 'Responsible editor or data owner for source verification.';

CREATE INDEX IF NOT EXISTS emigro_program_sources_review_status_idx
  ON emigro_program_sources (review_status, last_verified);

CREATE INDEX IF NOT EXISTS emigro_corridor_digest_items_review_status_idx
  ON emigro_corridor_digest_items (review_status, last_verified);
