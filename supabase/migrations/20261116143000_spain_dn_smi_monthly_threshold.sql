-- Spain digital nomad: 200% of monthly SMI (art. 74 bis), not 14-paga prorated monthly.
-- SMI 2026: RD 126/2026 / BOE-A-2026-3815 — €1.221/month → titular €2.442/month.

UPDATE emigro_program_versions
SET rule_json = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},2442]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000007';

UPDATE emigro_program_requirements
SET value_text = '€2.442 (200% SMI mensual 2026, RD 126/2026 / requisitos UGE/consulados (marco art. 74 bis))'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND requirement_type = 'income'
  AND label_en = 'Minimum monthly income';

UPDATE emigro_program_requirements
SET value_text = '+€916/мес. за первого иждивенца, +€305/мес. за каждого следующего (75%/25% SMI mensual 2026, RD 126/2026)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND requirement_type = 'income'
  AND label_en = 'Family income add-on';

UPDATE emigro_program_sources
SET
  source_url = 'https://www.boe.es/eli/es/rd/2026/02/18/126/con',
  raw_excerpt = 'Real Decreto 126/2026: SMI €1.221/mes. requisitos UGE/consulados (marco art. 74 bis) teletrabajo: titular 200% SMI mensual = €2.442/mes; familiares 75%/25% SMI mensual.',
  last_verified = '2026-11-16'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND (source_url LIKE '%boe.es%' OR source_url LIKE '%thelocal%');

UPDATE emigro_program_sources
SET
  raw_excerpt = 'Real Decreto 126/2026: SMI €1.221/mes. requisitos UGE/consulados (marco art. 74 bis): titular 200% SMI mensual = €2.442/mes.',
  last_verified = '2026-11-16'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND raw_excerpt LIKE '%2 849%';