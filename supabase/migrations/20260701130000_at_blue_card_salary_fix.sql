-- Austria EU Blue Card salary threshold 2026: €55,678/year (was incorrectly €58,000)
-- Source: migration.gv.at / AMS BMAW annual update

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},55678]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000044';

UPDATE emigro_program_requirements
SET value_text = '€55 678/год брутто (~€3 977/мес на 14 выплат, 2026; shortage occupations ниже)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000044'
  AND requirement_type = 'income'
  AND label_en = 'Blue Card salary threshold';

UPDATE emigro_program_sources
SET
  raw_excerpt = 'EU Blue Card 2026 — minimum gross salary €55,678/year (~€3,977/month on 14 payments; migration.gv.at).',
  last_verified = '2026-07-01'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000044'
  AND label_en = 'Blue Card threshold';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT
  'a0000000-0000-4000-8000-000000000010',
  'practical',
  'EU Blue Card salary threshold 2026',
  'Порог зарплаты EU Blue Card 2026',
  'EU Blue Card requires gross salary from €55,678/year (~€3,977/month on 14 payments, 2026; migration.gv.at). Shortage occupations may have lower thresholds.',
  'EU Blue Card: от €55 678/год брутто (~€3 977/мес на 14 выплат, 2026; migration.gv.at). Для дефицитных профессий порог может быть ниже.',
  'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/eu-blue-card/',
  '2026-07-01',
  6
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000010'
    AND title_en = 'EU Blue Card salary threshold 2026'
);
