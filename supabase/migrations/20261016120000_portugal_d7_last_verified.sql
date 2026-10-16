-- D7 page showed last_verified 2026-06-27. Thresholds unchanged: D7 ~€920 (1× RMMG),
-- D8 ~€3 680 (4× RMMG) per Decreto-Lei 139/2025, already in the D8/D7 pillar.
update emigro_program_sources
set last_verified = '2026-10-16'
where program_version_id in (
  select v.id
  from emigro_program_versions v
  join emigro_programs p on p.id = v.program_id
  where p.slug = 'portugal-d7-passive-income'
);
