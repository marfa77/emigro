-- Poland minimum wage 2026: PLN 4 806 gross/month from 1 Jan 2026
-- Rozporządzenie Rady Ministrów z 11.09.2025 (Dz.U. 2025 poz. 1242) — was PLN 4 666 in 2025

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},1113]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000033';

UPDATE emigro_program_requirements
SET value_text = 'PLN 4 806/мес брутто (минимальная зарплата 2026, Dz.U. 2025 poz. 1242) — ~€1 113'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000033'
  AND requirement_type = 'income'
  AND label_en = 'Minimum salary';

UPDATE emigro_program_sources
SET
  raw_excerpt = 'Minimum wage PLN 4 806 gross/month from 1 January 2026 (Rozporządzenie Rady Ministrów z 11.09.2025, Dz.U. 2025 poz. 1242).',
  last_verified = '2026-07-07'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000033'
  AND source_url = 'https://www.gov.pl/web/family-social-policy/minimum-wage';
