-- Soft promo / digest drafts may publish as HTML or plain Threads-style text
ALTER TABLE guide_telegram_drafts
  ADD COLUMN IF NOT EXISTS publish_mode TEXT NOT NULL DEFAULT 'html';

ALTER TABLE guide_telegram_drafts
  DROP CONSTRAINT IF EXISTS guide_telegram_drafts_publish_mode_check;

ALTER TABLE guide_telegram_drafts
  ADD CONSTRAINT guide_telegram_drafts_publish_mode_check
  CHECK (publish_mode IN ('html', 'threads'));

ALTER TABLE guide_telegram_drafts
  ADD COLUMN IF NOT EXISTS meta JSONB NOT NULL DEFAULT '{}'::jsonb;
