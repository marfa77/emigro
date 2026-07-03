-- Enrich Spain Digital Nomad program card: family thresholds, submission paths, official SMI source.

UPDATE emigro_programs
SET
  summary_en = 'Residence for remote workers with foreign income (Ley 28/2022 teletrabajo); max 20% income from Spain; consulate or UGE route.',
  summary_ru = 'ВНЖ для удалённых работников с зарубежным доходом (Ley 28/2022 teletrabajo); не более 20% дохода из Испании; подача через консульство за рубежом или UGE в Испании.'
WHERE slug = 'spain-digital-nomad';

UPDATE emigro_program_requirements
SET value_text = 'Контракт ≥3 мес., инвойсы или письмо работодателя; компания-работодатель существует ≥1 год (для наёмных)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND requirement_type = 'documents'
  AND label_ru = 'Подтверждение удалённой работы';

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order)
SELECT 'c0000000-0000-4000-8000-000000000007', v.type, v.label_en, v.label_ru, v.value_text, v.sort_order
FROM (VALUES
  ('income', 'Family income add-on', 'Доплата за членов семьи', '+€916/мес. за первого иждивенца, +€305/мес. за каждого следующего (75%/25% SMI)', 4),
  ('documents', 'Spain income cap', 'Лимит дохода из Испании', 'Не более 20% дохода от испанских клиентов или работодателя', 5),
  ('documents', 'Criminal record', 'Справка о несудимости', 'Апостиль + sworn translation на испанский; действует ~3 месяца', 6),
  ('documents', 'Submission route', 'Маршрут подачи', 'Консульство (виза D, 1 год) или UGE (если уже легально в Испании); TIE после одобрения', 7)
) AS v(type, label_en, label_ru, value_text, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_program_requirements r
  WHERE r.program_version_id = 'c0000000-0000-4000-8000-000000000007'
    AND r.label_ru = v.label_ru
);

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order)
SELECT 'c0000000-0000-4000-8000-000000000007', v.label_en, v.label_ru, v.amount_text, v.sort_order
FROM (VALUES
  ('TIE issuance fee', 'Сбор TIE (tarjeta extranjero)', '€16–20', 3),
  ('Legal assistance (optional)', 'Юридическое сопровождение', '€800–2 500', 4)
) AS v(label_en, label_ru, amount_text, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_program_costs c
  WHERE c.program_version_id = 'c0000000-0000-4000-8000-000000000007'
    AND c.label_ru = v.label_ru
);

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order)
SELECT 'c0000000-0000-4000-8000-000000000007', v.step_type, v.title_en, v.title_ru, v.duration_text, v.sort_order
FROM (VALUES
  ('language_requirement', 'NIE, autónomo & Beckham window', 'NIE, autónomo и окно Beckham', 'В течение 6 мес. после NIE — выбор налогового режима; фрилансерам — alta autónomo', 4)
) AS v(step_type, title_en, title_ru, duration_text, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_program_timeline_steps t
  WHERE t.program_version_id = 'c0000000-0000-4000-8000-000000000007'
    AND t.sort_order = 4
);

UPDATE emigro_program_sources
SET
  source_url = 'https://www.boe.es/eli/es/rd/2026/02/18/126/con',
  raw_excerpt = 'Real Decreto 126/2026 — SMI 2026 €1 221/мес (14 pagas). DNV threshold: €1 221 × 14 ÷ 12 × 2 = €2 849/мес.',
  last_verified = '2026-07-03',
  label_en = 'BOE — SMI 2026',
  label_ru = 'BOE — SMI 2026'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000007'
  AND source_url LIKE '%thelocal.es%';

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru)
SELECT
  'c0000000-0000-4000-8000-000000000007',
  'https://extranjeros.inclusion.gob.es/es/informacioninteres/informacionprocedimientos/ciudadanosnocomunitarios/residencia/trabajadores-altamente-cualificados-y-teletrabajadores-de-caracter-internacional/',
  'Secretaría de Estado de Migraciones — procedimiento teletrabajo de carácter internacional (digital nomad / remote work).',
  '2026-07-03',
  'inclusion.gob.es — teletrabajo',
  'inclusion.gob.es — teletrabajo'
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_program_sources s
  WHERE s.program_version_id = 'c0000000-0000-4000-8000-000000000007'
    AND s.source_url LIKE '%inclusion.gob.es%teletrabajo%'
);
