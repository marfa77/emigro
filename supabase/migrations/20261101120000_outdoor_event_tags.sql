-- Several type tags per event. Written when the collector stores the row.

alter table public.outdoor_events
  add column if not exists tags text[] not null default '{}';

create index if not exists outdoor_events_tags_idx
  on public.outdoor_events using gin (tags);
