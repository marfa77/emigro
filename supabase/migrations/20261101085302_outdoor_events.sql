-- Events collected for @emigro_portugal. The channel posts three a day;
-- this table keeps the full upcoming list for the public calendar.

create table public.outdoor_events (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  slug text not null unique,
  country text not null default 'PT',
  city text,
  theme text not null,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  location text not null,
  address text,
  lat double precision,
  lng double precision,
  maps_url text,
  price_label text,
  source_url text not null,
  image_url text,
  source_id text not null,
  organizer text,
  telegram_message_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outdoor_events_start_idx on public.outdoor_events (start_at);
create index outdoor_events_city_idx on public.outdoor_events (city);

alter table public.outdoor_events enable row level security;

create policy outdoor_events_public_read
  on public.outdoor_events
  for select
  to anon, authenticated
  using (
    start_at > now() - interval '14 days'
    and start_at < now() + interval '120 days'
  );

grant select on table public.outdoor_events to anon, authenticated;
grant select, insert, update, delete on table public.outdoor_events to service_role;
