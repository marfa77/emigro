-- Fix PL Blue Card and CZ employee card eligibility thresholds (2026)
-- PL Blue Card: ~€3 020/mo × 12 = €36 240/yr (was incorrectly €34 200)
-- CZ employee card: min wage ~€900/mo (was incorrectly €1 100)

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},36240]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000034';

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},900]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000038';

UPDATE emigro_program_sources
SET source_url = 'https://ipc.gov.cz/en/information-for-foreigners/residence-in-the-czech-republic/eu-blue-card/'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000039'
  AND source_url = 'https://ipc.gov.cz/en/for-the-foreigners/blue-card/';
