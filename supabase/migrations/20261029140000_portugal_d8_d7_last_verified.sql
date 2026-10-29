-- D8 (and residual D7) guide table still showed Проверено 2026-06-27 on the pillar.
-- Thresholds unchanged: D8 ~€3 680 (4× RMMG), D7 ~€920 (1× RMMG) per Decreto-Lei 139/2025.
update emigro_program_sources
set last_verified = '2026-10-29'
where program_version_id in (
  select v.id
  from emigro_program_versions v
  join emigro_programs p on p.id = v.program_id
  where p.slug in ('portugal-d8-digital-nomad', 'portugal-d7-passive-income')
);
