-- Czechia EU Blue Card salary threshold 2026: CZK 73,823/month from 1 May 2026 (was incorrectly CZK 67,500 / €33,000 yr)
-- Source: MPSV/MOI annual update (150% average gross remuneration)

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},34800]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000039';

UPDATE emigro_program_requirements
SET value_text = '150% средней зарплаты — CZK 73 823/мес брутто (~€2 900/мес, с 01.05.2026; до этого CZK 69 247–69 248)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000039'
  AND requirement_type = 'income'
  AND label_en = 'Blue Card salary threshold';

UPDATE emigro_program_sources
SET
  raw_excerpt = 'EU Blue Card — 150% average gross remuneration: CZK 73,823/month from 1 May 2026 (~€2,900/month).',
  last_verified = '2026-07-05'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000039'
  AND label_en = 'Blue Card threshold';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT
  'a0000000-0000-4000-8000-000000000009',
  'practical',
  'EU Blue Card salary threshold 2026',
  'Порог зарплаты EU Blue Card 2026',
  'EU Blue Card requires gross salary from CZK 73,823/month from 1 May 2026 (~€2,900/month; 150% average remuneration, MPSV/MOI).',
  'EU Blue Card: от CZK 73 823/мес брутто с 1 мая 2026 (~€2 900/мес; 150% средней, MPSV/MOI).',
  'https://imigration.gov.cz/en/third-country-nationals/employment/eu-blue-card/',
  '2026-07-05',
  6
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000009'
    AND title_en = 'EU Blue Card salary threshold 2026'
);
