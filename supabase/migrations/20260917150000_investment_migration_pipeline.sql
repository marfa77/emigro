-- Investment Migration is an additive Emigro lead vertical.
-- It extends Assist leads and records partner handoffs without creating a second CRM.

alter table if exists public.emigro_manual_leads
  alter column corridor_id drop not null;

alter table if exists public.emigro_manual_leads
  add column if not exists lead_type text not null default 'assist',
  add column if not exists source text,
  add column if not exists destination_iso2 text,
  add column if not exists selected_provider_ids text[] not null default '{}',
  add column if not exists lead_packet jsonb not null default '{}'::jsonb,
  add column if not exists consent_at timestamptz,
  add column if not exists consent_version text,
  add column if not exists attribution_expires_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists emigro_manual_leads_lead_type_created_idx
  on public.emigro_manual_leads (lead_type, created_at desc);

create index if not exists emigro_manual_leads_destination_created_idx
  on public.emigro_manual_leads (destination_iso2, created_at desc);

create table if not exists public.emigro_lead_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.emigro_manual_leads(id) on delete cascade,
  provider_id text not null,
  status text not null default 'reserved'
    check (status in ('reserved', 'introduced', 'accepted', 'rejected', 'expired', 'won', 'lost')),
  attribution_model text not null default 'introduced_lead',
  attribution_expires_at timestamptz,
  commission_terms jsonb not null default '{}'::jsonb,
  external_crm_id text,
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, provider_id)
);

create table if not exists public.emigro_lead_handoff_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.emigro_manual_leads(id) on delete cascade,
  assignment_id uuid references public.emigro_lead_assignments(id) on delete set null,
  event_type text not null
    check (event_type in (
      'lead_created',
      'provider_reserved',
      'consent_confirmed',
      'contact_shared',
      'provider_accepted',
      'provider_rejected',
      'deal_won',
      'deal_lost',
      'commission_recorded'
    )),
  actor_type text not null default 'system'
    check (actor_type in ('system', 'applicant', 'emigro', 'provider')),
  actor_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists emigro_lead_assignments_provider_status_idx
  on public.emigro_lead_assignments (provider_id, status, created_at desc);

create index if not exists emigro_lead_handoff_events_lead_created_idx
  on public.emigro_lead_handoff_events (lead_id, created_at);

alter table public.emigro_lead_assignments enable row level security;
alter table public.emigro_lead_handoff_events enable row level security;

comment on column public.emigro_manual_leads.lead_packet is
  'Structured qualifier snapshot. Never treat its route matches as legal advice.';

comment on column public.emigro_manual_leads.selected_provider_ids is
  'Providers selected for possible handoff; actual attribution begins in emigro_lead_assignments.';
