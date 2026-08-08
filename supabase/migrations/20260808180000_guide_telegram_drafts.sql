-- Guide Telegram channel drafts (owner approval before @Emigro_news publish)
CREATE TABLE IF NOT EXISTS guide_telegram_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  html TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'skipped', 'skipped_critical')),
  factcheck_notes TEXT,
  channel_message_ids INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS guide_telegram_drafts_status_created_idx
  ON guide_telegram_drafts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS guide_telegram_drafts_slug_idx
  ON guide_telegram_drafts (slug);

ALTER TABLE guide_telegram_drafts ENABLE ROW LEVEL SECURITY;

-- Service role only (no public policies)
