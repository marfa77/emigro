-- News destinations: DB-driven (no deploy to add a country)
-- Ops: POST/PATCH /api/v1/admin/news-topics

CREATE TABLE IF NOT EXISTS emigro_news_topics (
  key TEXT PRIMARY KEY,
  url_segment TEXT NOT NULL UNIQUE,
  country_ru TEXT NOT NULL,
  country_en TEXT NOT NULL,
  flag TEXT NOT NULL DEFAULT '🌍',
  audience_ru TEXT NOT NULL,
  focus_hint_ru TEXT NOT NULL,
  corridor_slug TEXT,
  status TEXT NOT NULL DEFAULT 'news_only' CHECK (status IN ('active', 'news_only')),
  seo_tags TEXT[] NOT NULL DEFAULT '{}',
  rss_queries TEXT[] NOT NULL DEFAULT '{}',
  site_paths JSONB,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_news_topics_published_sort_idx
  ON emigro_news_topics (is_published, sort_order, key);

ALTER TABLE emigro_news_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news_topics" ON emigro_news_topics;
CREATE POLICY "public_read_news_topics" ON emigro_news_topics
  FOR SELECT USING (is_published = true);

-- Seed from former NEWS_TOPIC_REGISTRY (idempotent)
INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES
(
  'portugal', 'portugal', 'Португалия', 'Portugal', '🇵🇹',
  'русскоязычные заявители на ВНЖ и гражданство в Португалии',
  'D8, D7, AIMA, консульства, гражданство, CIPLE A2',
  'ru-speaking-to-portugal', 'active',
  ARRAY['Португалия ВНЖ','D8 цифровой кочевник','D7 пассивный доход','гражданство Португалии','CIPLE A2','AIMA','русскоязычные эмигранты'],
  ARRAY['Portugal residence visa AIMA','Portugal D8 digital nomad visa','Portugal D7 passive income visa','Portugal citizenship language requirement','Portugal immigration law','Португалия ВНЖ русские','Portugal VFS consulate visa'],
  '{"landing":"/ru/portugal","wizard":"/ru/portugal/wizard","guide":"/ru/portugal/digest"}'::jsonb,
  1
),
(
  'spain', 'spain', 'Испания', 'Spain', '🇪🇸',
  'русскоязычные, планирующие ВНЖ или гражданство в Испании',
  'ВНЖ, digital nomad, воссоединение, DELE/CCSE, сроки натурализации',
  NULL, 'news_only',
  ARRAY['Испания ВНЖ','гражданство Испании','DELE A2','релокация в Испанию','русскоязычные'],
  ARRAY['Spain immigration law residency','Spain digital nomad visa','Spain citizenship language requirement DELE','Spain golden visa transitional cases BOE residency','Испания ВНЖ иммиграция','Spain consulate visa residence permit'],
  NULL, 2
),
(
  'france', 'france', 'Франция', 'France', '🇫🇷',
  'русскоязычные, планирующие ВНЖ или гражданство во Франции',
  'talent passport, VLS-TS, натурализация, DELF, префектура',
  NULL, 'news_only',
  ARRAY['Франция ВНЖ','гражданство Франции','DELF','релокация во Францию','русскоязычные'],
  ARRAY['France immigration law residency','France talent passport visa','France citizenship naturalization language','France prefecture residence permit','Франция ВНЖ иммиграция','France visa policy update'],
  NULL, 3
),
(
  'italy', 'italy', 'Италия', 'Italy', '🇮🇹',
  'русскоязычные, планирующие ВНЖ или гражданство в Италии',
  'investor visa, electives residence, CELI B1, сроки гражданства',
  NULL, 'news_only',
  ARRAY['Италия ВНЖ','гражданство Италии','CELI B1','релокация в Италию','русскоязычные'],
  ARRAY['Italy immigration law residency','Italy investor visa residence permit','Italy citizenship language requirement CELI','Italy digital nomad visa','Италия ВНЖ иммиграция','Italy consulate visa update'],
  NULL, 4
),
(
  'germany', 'germany', 'Германия', 'Germany', '🇩🇪',
  'русскоязычные, планирующие ВНЖ или гражданство в Германии',
  'Blue Card, Chancenkarte, натурализация, сроки ВНЖ',
  NULL, 'news_only',
  ARRAY['Германия ВНЖ','гражданство Германии','Blue Card','релокация в Германию','русскоязычные'],
  ARRAY['Germany immigration law residency','Germany Blue Card visa update','Germany citizenship naturalization reform','Germany Chancenkarte skilled immigration','Германия ВНЖ иммиграция','Germany residence permit processing'],
  NULL, 5
),
(
  'netherlands', 'netherlands', 'Нидерланды', 'Netherlands', '🇳🇱',
  'русскоязычные, планирующие ВНЖ или гражданство в Нидерландах',
  'startup visa, highly skilled migrant, IND, натурализация',
  NULL, 'news_only',
  ARRAY['Нидерланды ВНЖ','гражданство Нидерландов','релокация в Нидерланды','русскоязычные'],
  ARRAY['Netherlands immigration law residency','Netherlands IND residence permit','Netherlands startup visa','Netherlands citizenship naturalization','Нидерланды ВНЖ иммиграция','Netherlands skilled migrant visa'],
  NULL, 6
),
(
  'scandinavia', 'scandinavia', 'Скандинавия и Север', 'Scandinavia & Nordic', '🇸🇪🇳🇴🇩🇰🇫🇮',
  'русскоязычные, интересующиеся ВНЖ и гражданством в Швеции, Норвегии, Дании, Финляндии',
  'миграционная политика Nordics, work permit, гражданство, сроки',
  NULL, 'news_only',
  ARRAY['Скандинавия ВНЖ','Швеция иммиграция','Норвегия ВНЖ','Финляндия релокация','русскоязычные'],
  ARRAY['Sweden immigration law residency citizenship','Norway immigration residence permit','Denmark immigration nationality reform','Finland work permit immigration','Nordic countries immigration policy Schengen','Скандинавия иммиграция ВНЖ'],
  NULL, 7
)
ON CONFLICT (key) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  country_ru = EXCLUDED.country_ru,
  country_en = EXCLUDED.country_en,
  flag = EXCLUDED.flag,
  audience_ru = EXCLUDED.audience_ru,
  focus_hint_ru = EXCLUDED.focus_hint_ru,
  corridor_slug = EXCLUDED.corridor_slug,
  status = EXCLUDED.status,
  seo_tags = EXCLUDED.seo_tags,
  rss_queries = EXCLUDED.rss_queries,
  site_paths = EXCLUDED.site_paths,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
