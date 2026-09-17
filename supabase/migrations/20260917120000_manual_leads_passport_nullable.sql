-- Assist accepts free-form relocation/property leads before a passport is collected.
-- Keep passport eligibility in the wizard; do not reject an otherwise valid Assist lead.
alter table if exists public.emigro_manual_leads
  alter column passport_iso2 drop not null;
