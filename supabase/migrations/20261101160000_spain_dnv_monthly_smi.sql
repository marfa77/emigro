-- Spain digital nomad: UGE uses monthly SMI, not the 14-pay annualisation.
-- SMI 2026 = €1,221/month (RD 126/2026). Titular = 200% = €2,442.
-- First family member +75% = €915.75; each further member +25% = €305.25.
-- Employees work only for the foreign company. The 20% cap is the freelancer's
-- professional activity with Spanish companies, never a Spanish employment contract.

UPDATE emigro_program_versions
SET eligibility_rule = replace(eligibility_rule::text, '2849', '2442')::jsonb
WHERE id = 'c0000000-0000-4000-8000-000000000007'
  AND eligibility_rule::text LIKE '%2849%';

UPDATE emigro_programs
SET
  summary_en = 'Residence for remote workers with foreign income (Ley 28/2022). Employees work only for the foreign company; freelancers may put up to 20% of professional activity with Spanish companies, never as Spanish employment. Consulate or UGE if already legal in Spain.',
  summary_ru = 'ВНЖ для удалённых работников с зарубежным доходом (Ley 28/2022). Наёмный — только иностранная компания; autónomo — до 20% профессиональной деятельности с компаниями в Испании, не трудовой договор. Подача: консульство или UGE, если уже легально в Испании.'
WHERE slug = 'spain-digital-nomad';

UPDATE emigro_program_requirements
SET value_text = '€2 442 (200% месячного SMI €1 221, критерии UGE 2026; не prorrateo de 14 pagas)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND requirement_type = 'income'
  AND label_ru = 'Минимальный месячный доход';

UPDATE emigro_program_requirements
SET value_text = '+€915,75/мес. за первого члена семьи, +€305,25/мес. за каждого следующего (75%/25% месячного SMI €1 221)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND label_ru = 'Доплата за членов семьи';

UPDATE emigro_program_requirements
SET value_text = 'Наёмный: только иностранный работодатель. Autónomo: до 20% профессиональной деятельности с испанскими компаниями, никогда трудовой договор с компанией в Испании'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND label_ru = 'Лимит дохода из Испании';

UPDATE emigro_program_sources
SET
  source_url = 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/nomadas-digitales-faqs-espanol',
  raw_excerpt = 'FAQ UGE: titular = 200% del SMI mensual (€1 221 en 2026 → €2 442/mes). Familia: +75% y +25% del mismo SMI mensual. No el prorrateo de 14 pagas.',
  last_verified = '2026-11-01',
  label_en = 'UGE — FAQ teletrabajo',
  label_ru = 'UGE — FAQ teletrabajo'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND (
    source_url LIKE '%thelocal.es%'
    OR raw_excerpt LIKE '%2 849%'
    OR raw_excerpt LIKE '%2,849%'
    OR raw_excerpt LIKE '%€2,849%'
  );
