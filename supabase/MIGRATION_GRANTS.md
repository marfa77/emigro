# Data API grants (required from 2026-10-30)

Supabase no longer auto-grants Data API access on new `public` tables.
Existing tables keep their grants. Preview branches and `supabase db reset`
rely on `migrations/ensure_data_api_grants.sql` for tables
created **before** that migration.

## Checklist for every new table

In the **same** migration as `create table`:

1. Create the table
2. Enable RLS + policies (if client roles can touch it)
3. Add grants (trim to what you need)

```sql
create table if not exists public.your_table (
  id uuid primary key default gen_random_uuid()
  -- ...
);

alter table public.your_table enable row level security;
-- create policy ...

-- Read-only for anonymous clients (omit if not needed)
grant select on public.your_table to anon;

-- CRUD for signed-in users (still subject to RLS)
grant select, insert, update, delete on public.your_table to authenticated;

-- Server / service role
grant select, insert, update, delete on public.your_table to service_role;
```

### Internal-only tables (cron logs, digests, etc.)

If only the service role should use the table via the Data API:

```sql
grant select, insert, update, delete on public.your_table to service_role;
-- no grants to anon / authenticated
```

Still enable RLS (or keep the table out of exposed schemas) so a leaked anon key cannot read it if grants are added later by mistake.

### RPCs

```sql
grant execute on function public.your_function() to anon, authenticated, service_role;
-- or only to the roles that should call it
```

## Do not

- Rely on dashboard auto-grants after 2026-10-30
- Edit already-applied historical migrations to add grants (checksum drift); use a new migration instead
- Grant write to `anon` unless you have a deliberate public-write design + RLS
