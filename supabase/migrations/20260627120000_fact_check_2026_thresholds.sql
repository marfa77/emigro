-- Fact-check 2026 immigration thresholds (official sources, June 2026)

-- Portugal D7: RMMG €920 (Decreto-Lei 139/2025, effective 2026-01-01)
UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{">=":[{"var":"passive_income_eur"},920]},{">=":[{"var":"savings_eur"},11040]}]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000002';

UPDATE emigro_program_requirements
SET value_text = '€920/month (1× RMMG 2026) or equivalent savings'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000002'
  AND requirement_type = 'income';

UPDATE emigro_program_requirements
SET value_text = '€11,040+ (12 months at RMMG 2026)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000002'
  AND requirement_type = 'savings';

-- Portugal D8: 4× RMMG €920 = €3,680/month
UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3680]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000001';

UPDATE emigro_program_requirements
SET value_text = '€3,680 (4× RMMG €920, Decreto-Lei 139/2025)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000001'
  AND requirement_type = 'income';

UPDATE emigro_program_sources
SET
  raw_excerpt = 'D8 visa — income at least four times the Portuguese minimum wage (RMMG €920 in 2026 = €3,680/month).',
  last_verified = '2026-06-27',
  source_url = 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/139-2025-992879809'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000001';

UPDATE emigro_program_sources
SET
  raw_excerpt = 'D7 visa — passive income at least equal to RMMG (€920/month in 2026).',
  last_verified = '2026-06-27',
  source_url = 'https://www.dgert.gov.pt/retribuicao-minima-mensal-garantida-para-2026'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000002';

-- Italy digital nomad: 3× healthcare exemption base (€8,263.30) = €24,789.93/year
UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},2066]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000013';

UPDATE emigro_program_requirements
SET value_text = '€24,790/year (~€2,066/month; 3× healthcare exemption base €8,263.30)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000013'
  AND requirement_type = 'income';

UPDATE emigro_program_sources
SET
  source_url = 'https://www.integrazionemigranti.gov.it/en-gb/Ricerca-news/Dettaglio-news/id/3835/Who-are-the-digital-nomads-How-can-they-enter-Italy-',
  raw_excerpt = 'Minimum annual income not less than 3× healthcare expenditure exemption (€8,263.30) = €24,789 for solo applicant (Decreto Ministero Interno 29 Feb 2024).',
  last_verified = '2026-06-27'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000013';

-- Spain DNV: confirm BOE SMI 2026 source on existing €2,849 threshold
UPDATE emigro_program_sources
SET
  source_url = 'https://www.boe.es/eli/es/rd/2026/02/18/126/con',
  raw_excerpt = 'Real Decreto 126/2026: SMI €1,221/month (14 payments). DNV requires 200% annualized SMI = €2,849/month (€1,221 × 14 ÷ 12 × 2).',
  last_verified = '2026-06-27'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND source_url LIKE '%thelocal%';

-- Sweden work permit: confirm SEK 34,470 (90% median, updated 2026-06-16)
UPDATE emigro_program_sources
SET
  source_url = 'https://www.migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html',
  raw_excerpt = 'Salary must be at least 90% of median salary at application date. From 16 June 2026: median SEK 38,300 → minimum SEK 34,470/month.',
  last_verified = '2026-06-27'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000022';

-- Portugal citizenship: Lei Orgânica n.º 1/2026 in force 19 May 2026
UPDATE emigro_corridor_digest_items
SET
  body_en = 'Citizenship still requires A2 (CAPLE/CIPLE). Lei Orgânica n.º 1/2026 entered into force on 19 May 2026: most non-EU/non-CPLP applicants need 10 years of legal residence (7 years for EU/CPLP nationals). Pending applications before 19 May remain under prior rules.',
  body_ru = 'Для натурализации по-прежнему нужен A2 (CAPLE/CIPLE). Lei Orgânica n.º 1/2026 вступила в силу 19 мая 2026: для большинства заявителей вне EU/CPLP — 10 лет легального проживания (7 лет для граждан EU/CPLP). Заявки, поданные до 19 мая, остаются по прежним правилам.',
  last_verified = '2026-06-27'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000001'
  AND category = 'citizenship';

UPDATE emigro_program_requirements
SET value_text = '10 лет легального проживания для большинства заявителей (Lei Orgânica 1/2026, с 19.05.2026); 7 лет для EU/CPLP'
WHERE program_version_id IN (
  SELECT pv.id FROM emigro_program_versions pv
  JOIN emigro_programs p ON p.id = pv.program_id
  WHERE p.slug = 'portugal-golden-visa'
)
AND requirement_type = 'citizenship';
