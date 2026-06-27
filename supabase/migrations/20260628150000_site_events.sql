-- Site analytics: page views, sessions, attribution (Barakhlo pattern for Emigro)

CREATE TABLE IF NOT EXISTS public.site_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(128) NOT NULL,
  event_name VARCHAR(64) NOT NULL,
  page_path VARCHAR(512),
  referrer VARCHAR(512),
  utm_source VARCHAR(128),
  utm_medium VARCHAR(128),
  utm_campaign VARCHAR(128),
  utm_content VARCHAR(128),
  utm_term VARCHAR(128),
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent VARCHAR(512),
  ip_address VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_events_session_id ON public.site_events (session_id);
CREATE INDEX IF NOT EXISTS idx_site_events_event_name ON public.site_events (event_name);
CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON public.site_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_page_path ON public.site_events (page_path);

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
-- No public policies: service_role bypasses RLS for API inserts.

CREATE OR REPLACE FUNCTION public.emigro_is_bot_user_agent(p_ua TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    p_ua ILIKE ANY (ARRAY[
      '%googlebot%', '%bingbot%', '%yandexbot%', '%duckduckbot%', '%baiduspider%',
      '%slurp%', '%facebookexternalhit%', '%meta-externalagent%', '%twitterbot%',
      '%linkedinbot%', '%applebot%', '%semrushbot%', '%ahrefsbot%', '%mj12bot%',
      '%dotbot%', '%petalbot%', '%bytespider%', '%gptbot%', '%claudebot%',
      '%anthropic-ai%', '%headlesschrome%', '%lighthouse%', '%chrome-lighthouse%',
      '%phantomjs%', '%puppeteer%', '%playwright%', '%selenium%', '%wget/%',
      '%curl/%', '%python-requests%', '%scrapy%', '%httpx/%', '%go-http-client%'
    ]),
    FALSE
  );
$$;

-- Distinct session count (excludes bots and optional session blocklist)
CREATE OR REPLACE FUNCTION public.emigro_count_distinct_sessions(
  p_start TIMESTAMPTZ DEFAULT NULL,
  p_end TIMESTAMPTZ DEFAULT NULL,
  p_event_names TEXT[] DEFAULT ARRAY['session_start', 'page_view'],
  p_exclude_sessions TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT session_id)::BIGINT
  FROM public.site_events
  WHERE (p_start IS NULL OR created_at >= p_start)
    AND (p_end IS NULL OR created_at < p_end)
    AND event_name = ANY(p_event_names)
    AND (cardinality(p_exclude_sessions) = 0 OR NOT (session_id = ANY(p_exclude_sessions)))
    AND COALESCE(properties->>'is_bot', 'false') NOT IN ('true', '1')
    AND NOT public.emigro_is_bot_user_agent(user_agent);
$$;

CREATE OR REPLACE FUNCTION public.emigro_count_events(
  p_start TIMESTAMPTZ DEFAULT NULL,
  p_end TIMESTAMPTZ DEFAULT NULL,
  p_event_name TEXT DEFAULT NULL,
  p_exclude_sessions TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::BIGINT
  FROM public.site_events
  WHERE (p_start IS NULL OR created_at >= p_start)
    AND (p_end IS NULL OR created_at < p_end)
    AND (p_event_name IS NULL OR event_name = p_event_name)
    AND (cardinality(p_exclude_sessions) = 0 OR NOT (session_id = ANY(p_exclude_sessions)))
    AND COALESCE(properties->>'is_bot', 'false') NOT IN ('true', '1')
    AND NOT public.emigro_is_bot_user_agent(user_agent);
$$;

CREATE OR REPLACE FUNCTION public.emigro_top_site_values(
  p_field TEXT,
  p_start TIMESTAMPTZ DEFAULT NULL,
  p_end TIMESTAMPTZ DEFAULT NULL,
  p_event_name TEXT DEFAULT 'page_view',
  p_limit INT DEFAULT 5,
  p_exclude_sessions TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (value TEXT, cnt BIGINT)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    $q$
    SELECT %I::TEXT AS value, COUNT(*)::BIGINT AS cnt
    FROM public.site_events
    WHERE %I IS NOT NULL AND %I <> ''
      AND ($1 IS NULL OR created_at >= $1)
      AND ($2 IS NULL OR created_at < $2)
      AND ($3 IS NULL OR event_name = $3)
      AND (cardinality($4) = 0 OR NOT (session_id = ANY($4)))
      AND COALESCE(properties->>'is_bot', 'false') NOT IN ('true', '1')
      AND NOT public.emigro_is_bot_user_agent(user_agent)
    GROUP BY %I
    ORDER BY cnt DESC
    LIMIT $5
    $q$,
    p_field, p_field, p_field, p_field
  ) USING p_start, p_end, p_event_name, p_exclude_sessions, p_limit;
END;
$$;

CREATE OR REPLACE FUNCTION public.emigro_bot_session_count(
  p_start TIMESTAMPTZ DEFAULT NULL,
  p_end TIMESTAMPTZ DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT session_id)::BIGINT
  FROM public.site_events
  WHERE session_id IS NOT NULL
    AND (p_start IS NULL OR created_at >= p_start)
    AND (p_end IS NULL OR created_at < p_end)
    AND (
      COALESCE(properties->>'is_bot', 'false') IN ('true', '1')
      OR public.emigro_is_bot_user_agent(user_agent)
    );
$$;

CREATE OR REPLACE FUNCTION public.emigro_day_window(
  p_day_offset INT DEFAULT 0,
  p_tz TEXT DEFAULT 'UTC'
)
RETURNS TABLE (start_utc TIMESTAMPTZ, end_utc TIMESTAMPTZ, day_label TEXT)
LANGUAGE sql
STABLE
AS $$
  WITH local_day AS (
    SELECT ((NOW() AT TIME ZONE p_tz)::DATE - p_day_offset) AS d
  )
  SELECT
    (d::TIMESTAMP AT TIME ZONE p_tz) AS start_utc,
    ((d + 1)::TIMESTAMP AT TIME ZONE p_tz) AS end_utc,
    to_char(d, 'DD.MM') AS day_label
  FROM local_day;
$$;

CREATE OR REPLACE FUNCTION public.emigro_daily_visitor_trend(
  p_days INT DEFAULT 7,
  p_tz TEXT DEFAULT 'UTC',
  p_exclude_sessions TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (day_label TEXT, visitors BIGINT, page_views BIGINT)
LANGUAGE sql
STABLE
AS $$
  WITH days AS (
    SELECT generate_series(
      (NOW() AT TIME ZONE p_tz)::DATE - (p_days - 1),
      (NOW() AT TIME ZONE p_tz)::DATE,
      '1 day'::INTERVAL
    )::DATE AS d
  ),
  bounds AS (
    SELECT
      d,
      to_char(d, 'DD.MM') AS day_label,
      (d::TIMESTAMP AT TIME ZONE p_tz) AS start_utc,
      ((d + 1)::TIMESTAMP AT TIME ZONE p_tz) AS end_utc
    FROM days
  )
  SELECT
    b.day_label,
    public.emigro_count_distinct_sessions(b.start_utc, b.end_utc, ARRAY['session_start', 'page_view'], p_exclude_sessions),
    public.emigro_count_events(b.start_utc, b.end_utc, 'page_view', p_exclude_sessions)
  FROM bounds b
  ORDER BY b.d;
$$;
