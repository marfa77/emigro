-- Unified Emigro dashboard: durable social snapshots and uncapped daily surface rollups.

create table if not exists public.emigro_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  metric_group text not null,
  label text not null,
  value numeric,
  status text not null default 'ok' check (status in ('ok', 'unavailable', 'error')),
  error text,
  metadata jsonb not null default '{}'::jsonb,
  snapshot_date date not null default (now() at time zone 'UTC')::date,
  captured_at timestamptz not null default now(),
  unique (metric_key, snapshot_date)
);

create index if not exists emigro_metric_snapshots_group_date_idx
  on public.emigro_metric_snapshots (metric_group, snapshot_date desc);

alter table public.emigro_metric_snapshots enable row level security;

create or replace function public.emigro_event_surface(
  p_page_path text,
  p_properties jsonb
)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(p_properties->>'hostname', '')) like 'portugal.%'
      or coalesce(p_page_path, '') like '/satellite/portugal%' then 'portugal'
    when lower(coalesce(p_properties->>'hostname', '')) like 'spain.%'
      or coalesce(p_page_path, '') like '/satellite/spain%' then 'spain'
    when lower(coalesce(p_properties->>'hostname', '')) like 'italy.%'
      or coalesce(p_page_path, '') like '/satellite/italy%' then 'italy'
    when lower(coalesce(p_properties->>'hostname', '')) like 'thailand.%'
      or coalesce(p_page_path, '') like '/satellite/thailand%' then 'thailand'
    else 'core'
  end
$$;

create or replace function public.emigro_dashboard_daily_series(
  p_days integer default 30,
  p_tz text default 'UTC'
)
returns table (
  day_label text,
  surface text,
  visitors bigint,
  page_views bigint,
  wizard_started bigint,
  wizard_completed bigint,
  assist_clicks bigint,
  community_clicks bigint,
  investment_leads bigint
)
language sql
stable
as $$
  with days as (
    select generate_series(
      (now() at time zone p_tz)::date - (greatest(p_days, 1) - 1),
      (now() at time zone p_tz)::date,
      interval '1 day'
    )::date as d
  ),
  surfaces(surface) as (
    values ('core'), ('portugal'), ('spain'), ('italy'), ('thailand')
  ),
  events as (
    select
      (created_at at time zone p_tz)::date as d,
      public.emigro_event_surface(page_path, properties) as surface,
      session_id,
      event_name
    from public.site_events
    where created_at >= (
      ((now() at time zone p_tz)::date - (greatest(p_days, 1) - 1))::timestamp
      at time zone p_tz
    )
      and coalesce(properties->>'is_bot', 'false') not in ('true', '1')
      and not public.emigro_is_bot_user_agent(user_agent)
  )
  select
    to_char(days.d, 'DD.MM') as day_label,
    surfaces.surface,
    count(distinct events.session_id) filter (
      where events.event_name in ('session_start', 'page_view')
    )::bigint as visitors,
    count(*) filter (where events.event_name = 'page_view')::bigint as page_views,
    count(distinct events.session_id) filter (
      where events.event_name = 'wizard_started'
    )::bigint as wizard_started,
    count(*) filter (where events.event_name = 'wizard_completed')::bigint as wizard_completed,
    count(*) filter (where events.event_name = 'assist_cta_click')::bigint as assist_clicks,
    count(*) filter (where events.event_name = 'community_join_click')::bigint as community_clicks,
    count(*) filter (where events.event_name = 'investment_lead_submitted')::bigint as investment_leads
  from days
  cross join surfaces
  left join events on events.d = days.d and events.surface = surfaces.surface
  group by days.d, surfaces.surface
  order by days.d, surfaces.surface;
$$;

create index if not exists site_events_created_event_idx
  on public.site_events (created_at desc, event_name);

create index if not exists community_signals_country_status_posted_idx
  on public.community_signals (country_key, status, posted_at desc);

create index if not exists community_notes_country_status_published_idx
  on public.community_notes (country_key, status, published_at desc);
