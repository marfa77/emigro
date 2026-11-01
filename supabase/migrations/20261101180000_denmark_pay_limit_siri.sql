-- Denmark work schemes, SIRI fact-check 2026-11-01.
-- Updates live rows by slug. Does not rewrite historical INSERTs.
-- Fee: DKK 6,810 (Euro 912.87 on the 01-01-2026 fee overview), not DKK 4,405.
-- Pay Limit processing: usually 1 month, up to 3 months. Not a 3–7 month SIRI statistic.
-- Supplementary Pay Limit and Positive List are separate schemes.

UPDATE emigro_programs
SET
  title_ru = 'Pay Limit Scheme — рабочий ВНЖ Дании',
  summary_en = 'Work residence with a Danish employer at or above the Pay Limit. Remote work for a foreign employer does not qualify.',
  summary_ru = 'Рабочий ВНЖ при оффере датского работодателя и зарплате не ниже DKK 552 000 в год (2026). Удалённая работа на иностранную компанию этот маршрут не открывает.'
WHERE slug = 'denmark-work-permit';

UPDATE emigro_programs
SET
  title_ru = 'Fast-track — рабочий ВНЖ Дании',
  summary_en = 'Work residence when the Danish employer is SIRI-certified. Track salary follows the Fast-track track, including Pay Limit and Supplementary Pay Limit.',
  summary_ru = 'Рабочий ВНЖ, если датский работодатель сертифицирован SIRI. Зарплатный порог зависит от трека: pay limit DKK 552 000, supplementary pay limit DKK 446 000 или другой трек Fast-track.'
WHERE slug = 'denmark-fast-track';

UPDATE emigro_program_versions v
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]}]}'::jsonb
FROM emigro_programs p
WHERE v.program_id = p.id
  AND p.slug = 'denmark-fast-track';

UPDATE emigro_passport_eligibility e
SET
  status = 'partial',
  notes_en = 'SIRI decides the work-permit application. Biometrics and the visa depend on the country of legal residence and the specific Danish mission.',
  notes_ru = 'Заявление на рабочий ВНЖ рассматривает SIRI. Биометрию сдают в датском представительстве или визовом центре по месту законного проживания. Виза и въезд зависят от страны проживания и конкретного представительства.'
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
WHERE e.program_version_id = v.id
  AND p.slug IN ('denmark-work-permit', 'denmark-fast-track');

DELETE FROM emigro_program_requirements r
USING emigro_program_versions v, emigro_programs p
WHERE r.program_version_id = v.id
  AND v.program_id = p.id
  AND p.slug IN ('denmark-work-permit', 'denmark-fast-track');

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order)
SELECT v.id, x.requirement_type, x.label_en, x.label_ru, x.value_text, x.sort_order
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    ('denmark-work-permit', 'income', 'Pay limit salary', 'Зарплата Pay Limit', 'DKK 552 000 в год в 2026 году (DKK 46 000 в месяц). Не менее 30 часов в неделю.', 1),
    ('denmark-work-permit', 'documents', 'Danish employer', 'Оффер датского работодателя', 'Работа у работодателя в Дании. Удалённая работа на иностранную компанию этот маршрут не открывает.', 2),
    ('denmark-work-permit', 'documents', 'Salary composition', 'Что входит в DKK 552 000', 'Гарантированная денежная зарплата, пенсионные взносы и оплачиваемые отпускные. Жильё, автомобиль, телефон и похожие льготы не входят.', 3),
    ('denmark-work-permit', 'documents', 'Danish bank account', 'Датский банковский счёт', 'Зарплата на счёт в датском банке на имя заявителя. Счёт открывают в течение 180 дней.', 4),
    ('denmark-work-permit', 'documents', 'Permit and job change', 'Срок разрешения и смена работы', 'Контракт от 4 лет: обычно 4 года. Короче: срок работы плюс 6 месяцев поиска без права работать. Новый работодатель — новое разрешение.', 5),
    ('denmark-fast-track', 'documents', 'Certified employer', 'Сертифицированный работодатель', 'Работодатель в Дании сертифицирован SIRI для Fast-track.', 1),
    ('denmark-fast-track', 'income', 'Track salary', 'Трек и зарплата', 'Pay limit track: DKK 552 000. Supplementary track: DKK 446 000 (2026). Другие треки — по странице SIRI.', 2),
    ('denmark-fast-track', 'documents', 'Processing time', 'Сроки SIRI по трекам', 'Pay limit, short-term, researcher, educational: обычно 1 месяц, до 2. Supplementary track: обычно 2 месяца, до 4.', 3)
) AS x(slug, requirement_type, label_en, label_ru, value_text, sort_order)
  ON x.slug = p.slug
WHERE p.slug IN ('denmark-work-permit', 'denmark-fast-track');

DELETE FROM emigro_program_costs c
USING emigro_program_versions v, emigro_programs p
WHERE c.program_version_id = v.id
  AND v.program_id = p.id
  AND p.slug IN ('denmark-work-permit', 'denmark-fast-track');

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order)
SELECT v.id, 'SIRI application fee', 'Сбор SIRI', 'DKK 6 810 (~€912)', 1
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
WHERE p.slug IN ('denmark-work-permit', 'denmark-fast-track');

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order)
SELECT v.id, 'Biometrics', 'Биометрия', 'Отдельный шаг по месту законного проживания, обычно в течение 14 дней после подачи', 2
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
WHERE p.slug = 'denmark-work-permit';

DELETE FROM emigro_program_timeline_steps t
USING emigro_program_versions v, emigro_programs p
WHERE t.program_version_id = v.id
  AND v.program_id = p.id
  AND p.slug IN ('denmark-work-permit', 'denmark-fast-track');

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order)
SELECT v.id, x.step_type, x.title_en, x.title_ru, x.duration_text, x.sort_order
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    ('denmark-work-permit', 'document_prep', 'Preparation', 'Подготовка работодателем и заявителем', 'Зависит от кейса', 1),
    ('denmark-work-permit', 'application', 'SIRI decision', 'Рассмотрение SIRI', 'Обычно 1 месяц', 2),
    ('denmark-work-permit', 'application', 'Further information', 'Если SIRI запросит дополнительные сведения', 'До 3 месяцев', 3),
    ('denmark-work-permit', 'residence', 'Biometrics and card', 'Биометрия, въезд и карта', 'Отдельно от срока решения SIRI', 4),
    ('denmark-fast-track', 'document_prep', 'Certification and contract', 'Сертификация работодателя и контракт', 'Зависит от кейса', 1),
    ('denmark-fast-track', 'application', 'Fast-track main tracks', 'Fast-track: pay limit и соседние треки', 'Обычно 1 месяц, до 2 месяцев', 2),
    ('denmark-fast-track', 'application', 'Supplementary track', 'Fast-track: supplementary pay limit track', 'Обычно 2 месяца, до 4 месяцев', 3),
    ('denmark-fast-track', 'residence', 'Biometrics and card', 'Биометрия, въезд и карта', 'Отдельно от срока решения SIRI', 4)
) AS x(slug, step_type, title_en, title_ru, duration_text, sort_order)
  ON x.slug = p.slug
WHERE p.slug IN ('denmark-work-permit', 'denmark-fast-track');

UPDATE emigro_program_sources s
SET
  raw_excerpt = 'Pay Limit Scheme: оффер в Дании, DKK 552 000 в 2026 году, сбор DKK 6 810. Обычно 1 месяц, до 3 месяцев если нужны дополнительные сведения.',
  last_verified = '2026-11-01',
  label_en = 'SIRI — Pay Limit Scheme',
  label_ru = 'SIRI — Pay Limit Scheme'
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
WHERE s.program_version_id = v.id
  AND p.slug = 'denmark-work-permit';

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru)
SELECT v.id, x.source_url, x.raw_excerpt, '2026-11-01', x.label_en, x.label_ru
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    (
      'denmark-work-permit',
      'https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Case-processing-times-in-SIRI',
      'Pay Limit: обычно 1 месяц, до 3 месяцев. Supplementary Pay Limit: обычно 2 месяца, до 5. Positive List higher education: 1/3. Skilled work: 3/4. Fast-track pay limit track: 1/2. Fast-track supplementary track: 2/4.',
      'SIRI — processing times',
      'SIRI — сроки рассмотрения'
    ),
    (
      'denmark-fast-track',
      'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Fast-track',
      'Fast-track: сертифицированный работодатель SIRI. Pay limit track от DKK 552 000, supplementary track от DKK 446 000 (2026). Сбор DKK 6 810.',
      'SIRI — Fast-track',
      'SIRI — Fast-track'
    )
) AS x(slug, source_url, raw_excerpt, label_en, label_ru)
  ON x.slug = p.slug
WHERE p.slug IN ('denmark-work-permit', 'denmark-fast-track')
  AND NOT EXISTS (
    SELECT 1 FROM emigro_program_sources existing
    WHERE existing.program_version_id = v.id
      AND existing.source_url = x.source_url
  );

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru)
VALUES
  (
    'b0000000-0000-4000-8000-000000000112',
    'denmark-supplementary-pay-limit',
    'DK',
    'LABOR',
    'Denmark Supplementary Pay Limit Scheme',
    'Supplementary Pay Limit — рабочий ВНЖ Дании',
    'Separate SIRI scheme for a Danish job offer at or above DKK 446,000 (2026), with extra conditions.',
    'Отдельная схема SIRI: оффер в Дании и зарплата не ниже DKK 446 000 в год (2026). Порог ниже Pay Limit, но схема доступна только при дополнительных условиях.'
  ),
  (
    'b0000000-0000-4000-8000-000000000113',
    'denmark-positive-list',
    'DK',
    'LABOR',
    'Denmark Positive List',
    'Positive List — рабочий ВНЖ Дании',
    'Work residence when the job is on a SIRI Positive List. No DKK 552,000 Pay Limit threshold.',
    'Отдельный рабочий маршрут, если должность входит в Positive List SIRI. Порог DKK 552 000 для этой схемы не требуется.'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_ru = EXCLUDED.title_ru,
  title_en = EXCLUDED.title_en,
  summary_ru = EXCLUDED.summary_ru,
  summary_en = EXCLUDED.summary_en,
  program_type = EXCLUDED.program_type,
  destination_iso2 = EXCLUDED.destination_iso2,
  is_active = true;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured)
SELECT 'a0000000-0000-4000-8000-000000000033', p.id, v.sort_order, true
FROM (
  VALUES
    ('denmark-work-permit', 1),
    ('denmark-supplementary-pay-limit', 2),
    ('denmark-positive-list', 3),
    ('denmark-family-reunification', 4),
    ('denmark-fast-track', 5)
) AS v(slug, sort_order)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT (corridor_id, program_id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  is_featured = true;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule)
SELECT v.id::uuid, p.id, '2026-11', v.rule::jsonb
FROM (
  VALUES
    (
      'c0000000-0000-4000-8000-000000000112',
      'denmark-supplementary-pay-limit',
      '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},59800]}]}'
    ),
    (
      'c0000000-0000-4000-8000-000000000113',
      'denmark-positive-list',
      '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]}]}'
    )
) AS v(id, slug, rule)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT (id) DO UPDATE SET eligibility_rule = EXCLUDED.eligibility_rule;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order)
SELECT v.id, x.requirement_type, x.label_en, x.label_ru, x.value_text, x.sort_order
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    ('denmark-supplementary-pay-limit', 'income', 'Supplementary salary', 'Зарплата Supplementary Pay Limit', 'DKK 446 000 в год, DKK 37 166,67 в месяц (2026). Отдельная схема, не снижение Pay Limit.', 1),
    ('denmark-supplementary-pay-limit', 'documents', 'Job advert', 'Оффер и публикация вакансии', 'Оффер в Дании. Вакансия на Jobnet и в EURES не менее 2 недель и не более 6 месяцев до подачи.', 2),
    ('denmark-supplementary-pay-limit', 'documents', 'Working hours', 'Рабочее время', 'По общему правилу 37–40 часов в неделю. Годовой минимум при этом сохраняется.', 3),
    ('denmark-positive-list', 'documents', 'Two lists', 'Два списка SIRI', 'Higher education или skilled work. Должность должна быть в актуальном списке. Порога DKK 552 000 нет.', 1),
    ('denmark-positive-list', 'income', 'Danish standards', 'Зарплата и датские стандарты', 'Зарплата не ниже датских стандартов. Для skilled work SIRI сверяет статистику Danmarks Statistik.', 2),
    ('denmark-positive-list', 'documents', 'Processing', 'Сроки двух списков', 'Higher education: обычно 1 месяц, до 3. Skilled work: обычно 3 месяца, до 4. Сбор DKK 6 810.', 3)
) AS x(slug, requirement_type, label_en, label_ru, value_text, sort_order)
  ON x.slug = p.slug
WHERE p.slug IN ('denmark-supplementary-pay-limit', 'denmark-positive-list')
  AND NOT EXISTS (
    SELECT 1 FROM emigro_program_requirements existing
    WHERE existing.program_version_id = v.id
      AND existing.label_en = x.label_en
  );

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order)
SELECT v.id, 'SIRI application fee', 'Сбор SIRI', 'DKK 6 810 (~€912)', 1
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
WHERE p.slug IN ('denmark-supplementary-pay-limit', 'denmark-positive-list')
  AND NOT EXISTS (
    SELECT 1 FROM emigro_program_costs existing
    WHERE existing.program_version_id = v.id
      AND existing.label_en = 'SIRI application fee'
  );

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order)
SELECT v.id, x.step_type, x.title_en, x.title_ru, x.duration_text, x.sort_order
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    ('denmark-supplementary-pay-limit', 'document_prep', 'Preparation', 'Подготовка работодателем и заявителем', 'Зависит от кейса', 1),
    ('denmark-supplementary-pay-limit', 'application', 'SIRI decision', 'Рассмотрение SIRI', 'Обычно 2 месяца', 2),
    ('denmark-supplementary-pay-limit', 'application', 'Further information', 'Если SIRI запросит дополнительные сведения', 'До 5 месяцев', 3),
    ('denmark-supplementary-pay-limit', 'residence', 'Biometrics and card', 'Биометрия, въезд и карта', 'Отдельно от срока решения SIRI', 4),
    ('denmark-positive-list', 'document_prep', 'Preparation', 'Подготовка работодателем и заявителем', 'Зависит от кейса', 1),
    ('denmark-positive-list', 'application', 'Higher education list', 'Positive List, высшее образование', 'Обычно 1 месяц, до 3 месяцев', 2),
    ('denmark-positive-list', 'application', 'Skilled work list', 'Positive List, skilled work', 'Обычно 3 месяца, до 4 месяцев', 3),
    ('denmark-positive-list', 'residence', 'Biometrics and card', 'Биометрия, въезд и карта', 'Отдельно от срока решения SIRI', 4)
) AS x(slug, step_type, title_en, title_ru, duration_text, sort_order)
  ON x.slug = p.slug
WHERE p.slug IN ('denmark-supplementary-pay-limit', 'denmark-positive-list')
  AND NOT EXISTS (
    SELECT 1 FROM emigro_program_timeline_steps existing
    WHERE existing.program_version_id = v.id
      AND existing.title_en = x.title_en
  );

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru)
SELECT v.id, x.source_url, x.raw_excerpt, '2026-11-01', x.label_en, x.label_ru
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (
  VALUES
    (
      'denmark-supplementary-pay-limit',
      'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Pay-Limit-Schemes/Supplementary-Pay-Limit-scheme',
      'Supplementary Pay Limit: DKK 446 000 (2026), Jobnet и EURES, полная занятость. Обычно 2 месяца, до 5. Сбор DKK 6 810.',
      'SIRI — Supplementary Pay Limit',
      'SIRI — Supplementary Pay Limit'
    ),
    (
      'denmark-positive-list',
      'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Positive-List-Higher-Education',
      'Positive List, высшее образование: должность в списке, обычно 1 месяц, до 3. Сбор DKK 6 810.',
      'SIRI — Positive List higher education',
      'SIRI — Positive List, высшее образование'
    ),
    (
      'denmark-positive-list',
      'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists/Positive-List-for-skilled-work',
      'Positive List, skilled work: обычно 3 месяца, до 4. Сбор DKK 6 810. Зарплата по датским стандартам.',
      'SIRI — Positive List skilled work',
      'SIRI — Positive List, skilled work'
    )
) AS x(slug, source_url, raw_excerpt, label_en, label_ru)
  ON x.slug = p.slug
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_program_sources existing
  WHERE existing.program_version_id = v.id
    AND existing.source_url = x.source_url
);

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru)
SELECT v.id, iso.passport_iso2, 'partial',
  'SIRI decides the work-permit application. Biometrics and the visa depend on the country of legal residence and the specific Danish mission.',
  'Заявление на рабочий ВНЖ рассматривает SIRI. Биометрию сдают в датском представительстве или визовом центре по месту законного проживания. Виза и въезд зависят от страны проживания и конкретного представительства.'
FROM emigro_program_versions v
JOIN emigro_programs p ON p.id = v.program_id
JOIN (VALUES ('RU'), ('BY'), ('UA'), ('KZ')) AS iso(passport_iso2) ON true
WHERE p.slug IN ('denmark-supplementary-pay-limit', 'denmark-positive-list')
ON CONFLICT (program_version_id, passport_iso2) DO UPDATE SET
  status = EXCLUDED.status,
  notes_en = EXCLUDED.notes_en,
  notes_ru = EXCLUDED.notes_ru;

UPDATE emigro_wizard_modules
SET title_en = 'Work for a Danish employer', title_ru = 'Работа у датского работодателя'
WHERE id = 'e0000000-0000-4000-8000-000000000113';

UPDATE emigro_wizard_questions
SET help_ru = 'Pay Limit, Supplementary Pay Limit, Positive List и Fast-track требуют оффер датского работодателя. Удалённый доход на иностранную компанию сам по себе эти схемы не открывает.',
    help_en = 'Pay Limit, Supplementary Pay Limit, Positive List and Fast-track need a Danish employer. Remote income for a foreign company does not open these schemes.'
WHERE module_id = 'e0000000-0000-4000-8000-000000000113'
  AND question_key = 'remote_income';

UPDATE emigro_news_topics
SET focus_hint_ru = 'Pay Limit, Supplementary Pay Limit, Positive List, Fast-track',
    updated_at = now()
WHERE key = 'denmark';
