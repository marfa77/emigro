-- Corridor publish lifecycle → auto-sync emigro_news_topics for site visibility
-- draft: not on site as corridor (news_only)
-- in_development: landing + news, badge «в разработке»
-- active: full corridor (wizard, programs, digest)

ALTER TABLE emigro_corridors
  ADD COLUMN IF NOT EXISTS url_segment TEXT,
  ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft';

ALTER TABLE emigro_corridors DROP CONSTRAINT IF EXISTS emigro_corridors_publish_status_check;
ALTER TABLE emigro_corridors
  ADD CONSTRAINT emigro_corridors_publish_status_check
  CHECK (publish_status IN ('draft', 'in_development', 'active'));

CREATE UNIQUE INDEX IF NOT EXISTS emigro_corridors_url_segment_idx
  ON emigro_corridors (url_segment)
  WHERE url_segment IS NOT NULL;

-- Extend news topic status
ALTER TABLE emigro_news_topics DROP CONSTRAINT IF EXISTS emigro_news_topics_status_check;
ALTER TABLE emigro_news_topics
  ADD CONSTRAINT emigro_news_topics_status_check
  CHECK (status IN ('active', 'news_only', 'in_development'));

CREATE OR REPLACE FUNCTION emigro_sync_corridor_news_topic(p_corridor_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  c RECORD;
  topic_key TEXT;
  paths JSONB;
BEGIN
  SELECT slug, url_segment, publish_status INTO c
  FROM emigro_corridors
  WHERE slug = p_corridor_slug;

  IF NOT FOUND OR c.url_segment IS NULL OR c.url_segment = '' THEN
    RETURN;
  END IF;

  topic_key := c.url_segment;

  IF c.publish_status = 'draft' THEN
    UPDATE emigro_news_topics
    SET
      status = 'news_only',
      corridor_slug = NULL,
      site_paths = NULL,
      updated_at = now()
  WHERE key = topic_key OR corridor_slug = p_corridor_slug;
    RETURN;
  END IF;

  IF c.publish_status = 'in_development' THEN
    paths := jsonb_build_object(
      'landing', '/ru/' || c.url_segment,
      'guide', '/ru/' || c.url_segment || '/digest'
    );
    UPDATE emigro_news_topics
    SET
      status = 'in_development',
      corridor_slug = p_corridor_slug,
      url_segment = c.url_segment,
      site_paths = paths,
      updated_at = now()
    WHERE key = topic_key;
    IF NOT FOUND THEN
      UPDATE emigro_news_topics
      SET
        status = 'in_development',
        corridor_slug = p_corridor_slug,
        site_paths = paths,
        updated_at = now()
      WHERE corridor_slug = p_corridor_slug;
    END IF;
    RETURN;
  END IF;

  IF c.publish_status = 'active' THEN
    paths := jsonb_build_object(
      'landing', '/ru/' || c.url_segment,
      'wizard', '/ru/' || c.url_segment || '/wizard',
      'guide', '/ru/' || c.url_segment || '/digest'
    );
    UPDATE emigro_news_topics
    SET
      status = 'active',
      corridor_slug = p_corridor_slug,
      url_segment = c.url_segment,
      site_paths = paths,
      updated_at = now()
    WHERE key = topic_key;
    IF NOT FOUND THEN
      UPDATE emigro_news_topics
      SET
        status = 'active',
        corridor_slug = p_corridor_slug,
        site_paths = paths,
        updated_at = now()
      WHERE corridor_slug = p_corridor_slug;
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION emigro_trg_corridor_publish_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.publish_status IS DISTINCT FROM OLD.publish_status OR NEW.url_segment IS DISTINCT FROM OLD.url_segment THEN
    PERFORM emigro_sync_corridor_news_topic(NEW.slug);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS emigro_corridor_publish_sync ON emigro_corridors;
CREATE TRIGGER emigro_corridor_publish_sync
  AFTER INSERT OR UPDATE OF publish_status, url_segment ON emigro_corridors
  FOR EACH ROW
  EXECUTE FUNCTION emigro_trg_corridor_publish_sync();

-- Backfill url_segment + publish_status for existing corridors
UPDATE emigro_corridors SET url_segment = 'portugal', publish_status = 'active' WHERE slug = 'ru-speaking-to-portugal';
UPDATE emigro_corridors SET url_segment = 'spain', publish_status = 'active' WHERE slug = 'ru-speaking-to-spain';
UPDATE emigro_corridors SET url_segment = 'france', publish_status = 'active' WHERE slug = 'ru-speaking-to-france';
UPDATE emigro_corridors SET url_segment = 'italy', publish_status = 'active' WHERE slug = 'ru-speaking-to-italy';
UPDATE emigro_corridors SET url_segment = 'germany', publish_status = 'active' WHERE slug = 'ru-speaking-to-germany';
UPDATE emigro_corridors SET url_segment = 'netherlands', publish_status = 'active' WHERE slug = 'ru-speaking-to-netherlands';
UPDATE emigro_corridors SET url_segment = 'scandinavia', publish_status = 'active' WHERE slug = 'ru-speaking-to-scandinavia';

-- Sync all corridors to news topics (trigger may not fire on UPDATE if values unchanged)
SELECT emigro_sync_corridor_news_topic(slug) FROM emigro_corridors WHERE url_segment IS NOT NULL;
