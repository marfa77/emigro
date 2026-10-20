-- Supabase change (2026-10-30): new tables in public no longer get automatic
-- Data API grants. Existing production tables keep current grants.
--
-- Idempotent: keeps preview branches / `supabase db reset` working after cutover.
-- New tables created after this file still need explicit GRANTs in their own
-- migration (same pattern as Prep2Go supabase/MIGRATION_GRANTS.md).

grant usage on schema public to anon, authenticated, service_role;

do $$
declare
  r record;
begin
  for r in
    select c.relname as table_name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and not c.relispartition
  loop
    execute format('grant select on table public.%I to anon', r.table_name);
    execute format(
      'grant select, insert, update, delete on table public.%I to authenticated',
      r.table_name
    );
    execute format(
      'grant select, insert, update, delete on table public.%I to service_role',
      r.table_name
    );
  end loop;
end $$;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;

do $$
declare
  r record;
begin
  for r in
    select p.oid
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prokind in ('f', 'p')
  loop
    execute format(
      'grant execute on function %s to anon, authenticated, service_role',
      r.oid::regprocedure
    );
  end loop;
end $$;
