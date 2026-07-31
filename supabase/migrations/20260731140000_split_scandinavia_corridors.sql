-- Split Scandinavia corridor into Sweden / Norway / Finland / Denmark
-- Soft thresholds for NO/FI; reuse SE work permit + DK pay limit content

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('SE', 'Sweden', 'Швеция'),
  ('NO', 'Norway', 'Норвегия'),
  ('DK', 'Denmark', 'Дания'),
  ('FI', 'Finland', 'Финляндия')
ON CONFLICT DO NOTHING;

-- Archive legacy multi-country corridor + news topic
UPDATE emigro_corridors SET publish_status = 'draft' WHERE slug = 'ru-speaking-to-scandinavia';
SELECT emigro_sync_corridor_news_topic('ru-speaking-to-scandinavia');
UPDATE emigro_news_topics
SET status = 'news_only', corridor_slug = NULL, site_paths = NULL, updated_at = now()
WHERE key = 'scandinavia';

-- Free slugs for re-seed with new UUIDs (keep legacy rows inactive)
UPDATE emigro_programs
SET slug = slug || '-legacy-scandinavia', is_active = false
WHERE slug IN ('sweden-work-permit', 'denmark-work-permit', 'nordic-family-reunification')
  AND id IN (
    'b0000000-0000-4000-8000-000000000019',
    'b0000000-0000-4000-8000-000000000020',
    'b0000000-0000-4000-8000-000000000021'
  );

-- Corridor: ru-speaking-to-sweden
INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000030',
  'ru-speaking-to-sweden',
  'Russian-speaking → Sweden',
  'Русскоязычные → Швеция',
  'Relocation navigator for Russian-speaking applicants targeting Swedish residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Швеции.',
  'RU',
  'sweden',
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  publish_status = EXCLUDED.publish_status,
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  audience_description_en = EXCLUDED.audience_description_en,
  audience_description_ru = EXCLUDED.audience_description_ru;

INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES
  ('a0000000-0000-4000-8000-000000000030', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000030', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000030', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000030', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000030', 'SE')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000100', 'sweden-work-permit', 'SE', 'LABOR', 'Sweden Work Permit', 'Швеция — work permit', 'Work and residence permit with Swedish employer meeting minimum salary.', 'Рабочий и вид на жительство с шведским работодателем и минимальной зарплатой.'),
  ('b0000000-0000-4000-8000-000000000101', 'sweden-family-reunification', 'SE', 'BOND', 'Sweden Family Reunification', 'Швеция — воссоединение семьи', 'Join a spouse or family member legally residing in Sweden.', 'Присоединение к супругу или члену семьи с легальным статусом в Швеции.'),
  ('b0000000-0000-4000-8000-000000000102', 'sweden-eu-blue-card', 'SE', 'LABOR', 'Sweden EU Blue Card', 'Швеция — EU Blue Card', 'EU Blue Card for highly qualified employment meeting Swedish salary threshold.', 'EU Blue Card для высококвалифицированной работы с порогом зарплаты Migrationsverket.')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  summary_en = EXCLUDED.summary_en,
  summary_ru = EXCLUDED.summary_ru,
  program_type = EXCLUDED.program_type,
  destination_iso2 = EXCLUDED.destination_iso2,
  is_active = true;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured)
SELECT 'a0000000-0000-4000-8000-000000000030', p.id, v.sort_order, true
FROM (VALUES
  ('sweden-work-permit', 1),
  ('sweden-family-reunification', 2),
  ('sweden-eu-blue-card', 3)
) AS v(slug, sort_order)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule)
SELECT v.id::uuid, p.id, '2026-07', v.rule::jsonb
FROM (VALUES
  ('c0000000-0000-4000-8000-000000000100', 'sweden-work-permit', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},3050]}]}'::text),
  ('c0000000-0000-4000-8000-000000000101', 'sweden-family-reunification', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_se"},"yes"]}]}'::text),
  ('c0000000-0000-4000-8000-000000000102', 'sweden-eu-blue-card', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},4750]}]}'::text)
) AS v(id, slug, rule)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000100', 'income', 'Minimum monthly salary', 'Минимальная месячная зарплата', 'SEK 34,470/month (~€3,050) — 90% of SCB median from 1 Jun 2026; renewals of pre-reform permits until 1 Dec 2026 may use 80% (SEK 30,640)', 1),
  ('c0000000-0000-4000-8000-000000000100', 'documents', 'Employment terms', 'Условия трудоустройства', 'Insurance, pension, and collective agreement compliance', 2),
  ('c0000000-0000-4000-8000-000000000100', 'insurance', 'Health coverage', 'Медпокрытие', 'Employer occupational insurance; comprehensive health insurance mandatory if cumulative legal stay <12 months (from 1 Jun 2026)', 3),
  ('c0000000-0000-4000-8000-000000000101', 'family', 'Sponsor in Sweden', 'Спонсор в Швеции', 'Spouse, partner, or qualifying family member with legal residence', 1),
  ('c0000000-0000-4000-8000-000000000101', 'income', 'Maintenance requirement', 'Требование содержания', 'Housing and income rules — verify current Migrationsverket thresholds', 2),
  ('c0000000-0000-4000-8000-000000000102', 'income', 'Blue Card salary', 'Зарплата Blue Card', 'Orient SEK 53,625/month (~€4,750) — verify current Migrationsverket Blue Card threshold', 1),
  ('c0000000-0000-4000-8000-000000000102', 'documents', 'Higher education / qualification', 'Высшее образование / квалификация', 'Recognised degree or equivalent high qualification for the role', 2),
  ('c0000000-0000-4000-8000-000000000102', 'documents', 'Swedish job offer', 'Оффер в Швеции', 'Binding employment meeting Blue Card criteria', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000100', 'Application fee', 'Сбор за подачу', 'SEK 2,200 (~€200)', 1),
  ('c0000000-0000-4000-8000-000000000100', 'Family co-applicants', 'Семья-со заявители', 'Additional fees per person', 2),
  ('c0000000-0000-4000-8000-000000000101', 'Application fees', 'Сборы за подачу', 'SEK fees per applicant — verify Migrationsverket', 1),
  ('c0000000-0000-4000-8000-000000000102', 'Application fee', 'Сбор за подачу', 'SEK fees — verify Migrationsverket', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000100', 'document_prep', 'Employer offer & union terms', 'Оффер и union terms', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000100', 'application', 'Migrationsverket online', 'Подача в Migrationsverket', '4–10 months', 2),
  ('c0000000-0000-4000-8000-000000000100', 'residence', 'Work permit & residence', 'Work permit и ВНЖ', '2–4 weeks after approval', 3),
  ('c0000000-0000-4000-8000-000000000101', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000101', 'application', 'Migrationsverket application', 'Подача в Migrationsverket', '4–12 months', 2),
  ('c0000000-0000-4000-8000-000000000101', 'residence', 'Family residence permit', 'Семейный ВНЖ', '2–8 weeks', 3),
  ('c0000000-0000-4000-8000-000000000102', 'document_prep', 'Degree & contract', 'Диплом и контракт', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000102', 'application', 'Migrationsverket Blue Card', 'Подача Blue Card', '2–8 months', 2),
  ('c0000000-0000-4000-8000-000000000102', 'residence', 'Blue Card issuance', 'Выдача Blue Card', '2–4 weeks after approval', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000100', 'https://www.migrationsverket.se/English/Private-individuals/Working-in-Sweden/Employed/How-to-apply.html', 'Work permit — salary at least 90% of SCB median (SEK 34,470 from 16 Jun 2026); comprehensive health insurance if stay <12 months.', '2026-07-31', 'Migrationsverket — work permit', 'Migrationsverket — work permit'),
  ('c0000000-0000-4000-8000-000000000100', 'https://www.migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html', 'Salary requirements — 90% median from 1 Jun 2026; transitional 80% for pre-reform renewals until 1 Dec 2026.', '2026-07-31', 'Migrationsverket — salary requirements', 'Migrationsverket — salary requirements'),
  ('c0000000-0000-4000-8000-000000000101', 'https://www.migrationsverket.se/English/Private-individuals/Moving-to-a-close-relative-in-Sweden.html', 'Moving to a close relative in Sweden — family reunification rules.', '2026-07-31', 'Migrationsverket — family', 'Migrationsverket — family'),
  ('c0000000-0000-4000-8000-000000000102', 'https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/eu-blue-cards.html', 'EU Blue Card Sweden — salary and qualification requirements (verify current SEK threshold).', '2026-07-31', 'Migrationsverket — EU Blue Card', 'Migrationsverket — EU Blue Card')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000100', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000100', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000100', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000100', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000101', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000101', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000101', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000101', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000102', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000102', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000102', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000102', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000030', 'citizenship', 'Swedish citizenship timeline', 'Срок гражданства Швеции', 'Sweden: 8 years habitual residence from 6 Jun 2026 (plus income ~SEK 20k/mo and language/civics). Language tests apply.', 'Швеция: **8 лет** с 06.06.2026 (+ доход ~SEK 20 000/мес и язык/общество). Нужны языковые экзамены.', 'https://www.migrationsverket.se/', '2026-07-31', 1),
  ('a0000000-0000-4000-8000-000000000030', 'exam', 'Swedish language', 'Шведский язык', 'Citizenship requires Swedish language proof (SFI and higher levels / civic knowledge).', 'Для гражданства нужен шведский (SFI и выше) и знания общества.', NULL, '2026-07-31', 2),
  ('a0000000-0000-4000-8000-000000000030', 'timeline', 'Work permit → permanent residence', 'Work permit → ПМЖ', 'Sweden: permanent residence often after ~4 years on work permit. Processing backlogs vary.', 'Швеция: ПМЖ обычно после ~4 лет work permit. Очереди различаются.', NULL, '2026-07-31', 3),
  ('a0000000-0000-4000-8000-000000000030', 'practical', 'Personnummer', 'Personnummer', 'Swedish personnummer is essential for banking, tax, and healthcare.', 'Personnummer нужен для банка, налогов и healthcare.', NULL, '2026-07-31', 4),
  ('a0000000-0000-4000-8000-000000000030', 'practical', 'Collective agreements', 'Коллективные договоры', 'Swedish work permits require terms at least as good as collective agreement or industry practice.', 'Шведский work permit требует условий не хуже коллективного договора или отраслевой практики.', 'https://www.migrationsverket.se/', '2026-07-31', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000030', 'a0000000-0000-4000-8000-000000000030', 'sweden-routes', 'Sweden route finder', 'Подбор маршрута — Швеция')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000100', 'd0000000-0000-4000-8000-000000000030', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000101', 'd0000000-0000-4000-8000-000000000030', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000102', 'd0000000-0000-4000-8000-000000000030', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000103', 'd0000000-0000-4000-8000-000000000030', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000100', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000101', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000101', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000101', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000101', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000102', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000102', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000102', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000102', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000103', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000103', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000103', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000103', 'has_family_in_se', 'single', 'Family member legally in Швеция?', 'Член семьи уже легально в стране (Швеция)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'sweden', 'sweden', 'Швеция', 'Sweden', '🇸🇪',
  'русскоязычные, планирующие ВНЖ в стране: Швеция',
  'Sweden work permit, EU Blue Card, family reunification',
  'ru-speaking-to-sweden', 'active',
  ARRAY['Швеция ВНЖ', 'релокация Швеция'],
  ARRAY['Sweden residence permit', 'Sweden work permit'],
  '{"landing":"/ru/sweden","wizard":"/ru/sweden/wizard","guide":"/ru/sweden/digest"}'::jsonb,
  7
)
ON CONFLICT (key) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  country_ru = EXCLUDED.country_ru,
  country_en = EXCLUDED.country_en,
  flag = EXCLUDED.flag,
  audience_ru = EXCLUDED.audience_ru,
  focus_hint_ru = EXCLUDED.focus_hint_ru,
  corridor_slug = EXCLUDED.corridor_slug,
  status = EXCLUDED.status,
  seo_tags = EXCLUDED.seo_tags,
  rss_queries = EXCLUDED.rss_queries,
  site_paths = EXCLUDED.site_paths,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-sweden');

-- Corridor: ru-speaking-to-norway
INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000031',
  'ru-speaking-to-norway',
  'Russian-speaking → Norway',
  'Русскоязычные → Норвегия',
  'Relocation navigator for Russian-speaking applicants targeting Norwegian residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Норвегии.',
  'RU',
  'norway',
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  publish_status = EXCLUDED.publish_status,
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  audience_description_en = EXCLUDED.audience_description_en,
  audience_description_ru = EXCLUDED.audience_description_ru;

INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES
  ('a0000000-0000-4000-8000-000000000031', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000031', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000031', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000031', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000031', 'NO')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000103', 'norway-skilled-worker', 'NO', 'LABOR', 'Norway Skilled Worker', 'Норвегия — skilled worker', 'Residence for skilled workers with a Norwegian job offer and relevant education/experience.', 'ВНЖ для квалифицированных работников с оффером в Норвегии и релевантным образованием/опытом.'),
  ('b0000000-0000-4000-8000-000000000104', 'norway-family-reunification', 'NO', 'BOND', 'Norway Family Reunification', 'Норвегия — воссоединение семьи', 'Join a spouse or family member legally residing in Norway.', 'Присоединение к супругу или члену семьи с легальным статусом в Норвегии.'),
  ('b0000000-0000-4000-8000-000000000105', 'norway-eu-blue-card', 'NO', 'LABOR', 'Norway EU Blue Card', 'Норвегия — EU Blue Card', 'EU Blue Card route for highly qualified employment in Norway (soft — verify UDI).', 'EU Blue Card для высококвалифицированной работы в Норвегии (soft — сверяйте UDI).')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  summary_en = EXCLUDED.summary_en,
  summary_ru = EXCLUDED.summary_ru,
  program_type = EXCLUDED.program_type,
  destination_iso2 = EXCLUDED.destination_iso2,
  is_active = true;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured)
SELECT 'a0000000-0000-4000-8000-000000000031', p.id, v.sort_order, true
FROM (VALUES
  ('norway-skilled-worker', 1),
  ('norway-family-reunification', 2),
  ('norway-eu-blue-card', 3)
) AS v(slug, sort_order)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule)
SELECT v.id::uuid, p.id, '2026-07', v.rule::jsonb
FROM (VALUES
  ('c0000000-0000-4000-8000-000000000103', 'norway-skilled-worker', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},3500]}]}'::text),
  ('c0000000-0000-4000-8000-000000000104', 'norway-family-reunification', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_no"},"yes"]}]}'::text),
  ('c0000000-0000-4000-8000-000000000105', 'norway-eu-blue-card', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},4500]}]}'::text)
) AS v(id, slug, rule)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000103', 'income', 'Salary / collective agreement', 'Зарплата / тариф', 'Income per collective agreement or UDI practice — orient soft NOK threshold; сверяйте udi.no', 1),
  ('c0000000-0000-4000-8000-000000000103', 'documents', 'Job offer + skills', 'Оффер + квалификация', 'Relevant education and/or experience matching the role', 2),
  ('c0000000-0000-4000-8000-000000000103', 'documents', 'Norwegian employer', 'Работодатель в NO', 'Offer from employer registered in Norway', 3),
  ('c0000000-0000-4000-8000-000000000104', 'family', 'Sponsor in Norway', 'Спонсор в Норвегии', 'Spouse, partner, or qualifying family member', 1),
  ('c0000000-0000-4000-8000-000000000104', 'income', 'Maintenance requirement', 'Требование содержания', 'Sponsor income/housing — verify UDI family rules', 2),
  ('c0000000-0000-4000-8000-000000000105', 'income', 'Blue Card salary', 'Зарплата Blue Card', 'Soft orient — verify current UDI / EEA Blue Card salary for Norway', 1),
  ('c0000000-0000-4000-8000-000000000105', 'documents', 'Higher qualification', 'Высшая квалификация', 'Recognised higher education or equivalent for the role', 2),
  ('c0000000-0000-4000-8000-000000000105', 'documents', 'Job offer', 'Оффер', 'Binding offer meeting Blue Card criteria', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000103', 'UDI application fee', 'Сбор UDI', 'NOK fees — verify udi.no', 1),
  ('c0000000-0000-4000-8000-000000000104', 'Application fees', 'Сборы за подачу', 'NOK fees — verify udi.no', 1),
  ('c0000000-0000-4000-8000-000000000105', 'UDI application fee', 'Сбор UDI', 'NOK fees — verify udi.no', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000103', 'document_prep', 'Offer & documentation', 'Оффер и документы', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000103', 'application', 'UDI / police application', 'Подача UDI / полиция', '2–8 months', 2),
  ('c0000000-0000-4000-8000-000000000103', 'residence', 'Residence card', 'Карта ВНЖ', '2–6 weeks after approval', 3),
  ('c0000000-0000-4000-8000-000000000104', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000104', 'application', 'UDI family application', 'Подача UDI (семья)', '4–12 months', 2),
  ('c0000000-0000-4000-8000-000000000104', 'residence', 'Family residence permit', 'Семейный ВНЖ', '2–8 weeks', 3),
  ('c0000000-0000-4000-8000-000000000105', 'document_prep', 'Degree & contract', 'Диплом и контракт', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000105', 'application', 'UDI Blue Card filing', 'Подача Blue Card', '2–8 months', 2),
  ('c0000000-0000-4000-8000-000000000105', 'residence', 'Blue Card issuance', 'Выдача Blue Card', '2–6 weeks after approval', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000103', 'https://www.udi.no/en/want-to-apply/work-immigration/', 'UDI — work immigration / skilled worker. Verify current salary and documentation rules.', '2026-07-31', 'UDI — work immigration', 'UDI — work immigration'),
  ('c0000000-0000-4000-8000-000000000104', 'https://www.udi.no/en/want-to-apply/family-immigration/', 'UDI — family immigration. Verify current requirements.', '2026-07-31', 'UDI — family', 'UDI — family'),
  ('c0000000-0000-4000-8000-000000000105', 'https://www.udi.no/', 'UDI — verify whether EU Blue Card / skilled worker schemes apply to your case.', '2026-07-31', 'UDI Norway', 'UDI Норвегия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000103', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000103', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000103', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000103', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000104', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000104', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000104', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000104', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000105', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000105', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000105', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000105', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000031', 'citizenship', 'Norwegian citizenship timeline', 'Срок гражданства Норвегии', 'Norway: typically ~7–8 years legal residence plus language/civics requirements — verify UDI.', 'Норвегия: обычно ~7–8 лет легального проживания + язык/общество — сверяйте UDI.', 'https://www.udi.no/', '2026-07-31', 1),
  ('a0000000-0000-4000-8000-000000000031', 'exam', 'Norwegian language', 'Норвежский язык', 'Citizenship and some permits require Norwegian language proof (Norskprøve levels — verify UDI).', 'Для гражданства и части ВНЖ нужен норвежский (Norskprøve — сверяйте UDI).', NULL, '2026-07-31', 2),
  ('a0000000-0000-4000-8000-000000000031', 'timeline', 'Work → permanent residence', 'Работа → ПМЖ', 'Permanent residence depends on continuous legal stay and permit type — verify UDI.', 'ПМЖ зависит от непрерывного статуса и типа permit — сверяйте UDI.', NULL, '2026-07-31', 3),
  ('a0000000-0000-4000-8000-000000000031', 'practical', 'D-number / national ID', 'D-номер / ID', 'Norwegian ID / D-number is needed for banking, tax, and healthcare registration.', 'Норвежский ID / D-номер нужны для банка, налогов и healthcare.', NULL, '2026-07-31', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000031', 'a0000000-0000-4000-8000-000000000031', 'norway-routes', 'Norway route finder', 'Подбор маршрута — Норвегия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000104', 'd0000000-0000-4000-8000-000000000031', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000105', 'd0000000-0000-4000-8000-000000000031', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000106', 'd0000000-0000-4000-8000-000000000031', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000107', 'd0000000-0000-4000-8000-000000000031', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000104', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000105', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000105', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000105', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000105', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000106', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000106', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000106', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000106', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000107', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000107', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000107', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000107', 'has_family_in_no', 'single', 'Family member legally in Норвегия?', 'Член семьи уже легально в стране (Норвегия)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'norway', 'norway', 'Норвегия', 'Norway', '🇳🇴',
  'русскоязычные, планирующие ВНЖ в стране: Норвегия',
  'UDI skilled worker, EU Blue Card, family reunification — сверяйте UDI',
  'ru-speaking-to-norway', 'active',
  ARRAY['Норвегия ВНЖ', 'релокация Норвегия'],
  ARRAY['Norway residence permit', 'Norway work permit'],
  '{"landing":"/ru/norway","wizard":"/ru/norway/wizard","guide":"/ru/norway/digest"}'::jsonb,
  8
)
ON CONFLICT (key) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  country_ru = EXCLUDED.country_ru,
  country_en = EXCLUDED.country_en,
  flag = EXCLUDED.flag,
  audience_ru = EXCLUDED.audience_ru,
  focus_hint_ru = EXCLUDED.focus_hint_ru,
  corridor_slug = EXCLUDED.corridor_slug,
  status = EXCLUDED.status,
  seo_tags = EXCLUDED.seo_tags,
  rss_queries = EXCLUDED.rss_queries,
  site_paths = EXCLUDED.site_paths,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-norway');

-- Corridor: ru-speaking-to-finland
INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000032',
  'ru-speaking-to-finland',
  'Russian-speaking → Finland',
  'Русскоязычные → Финляндия',
  'Relocation navigator for Russian-speaking applicants targeting Finnish residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Финляндии.',
  'RU',
  'finland',
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  publish_status = EXCLUDED.publish_status,
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  audience_description_en = EXCLUDED.audience_description_en,
  audience_description_ru = EXCLUDED.audience_description_ru;

INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES
  ('a0000000-0000-4000-8000-000000000032', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000032', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000032', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000032', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000032', 'FI')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000106', 'finland-work-permit', 'FI', 'LABOR', 'Finland Work / Specialist Permit', 'Финляндия — work / specialist', 'Residence for employed specialists with a Finnish job offer (Migri work streams — soft thresholds).', 'ВНЖ для наёмных специалистов с оффером в Финляндии (потоки Migri — soft-пороги).'),
  ('b0000000-0000-4000-8000-000000000107', 'finland-family-reunification', 'FI', 'BOND', 'Finland Family Reunification', 'Финляндия — воссоединение семьи', 'Join a spouse or family member legally residing in Finland.', 'Присоединение к супругу или члену семьи с легальным статусом в Финляндии.'),
  ('b0000000-0000-4000-8000-000000000108', 'finland-startup', 'FI', 'LABOR', 'Finland Startup Residence', 'Финляндия — startup residence', 'Residence for founders with an eligible startup (Business Finland eligibility — soft).', 'ВНЖ для фаундеров со startup (eligibility Business Finland — soft).')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  summary_en = EXCLUDED.summary_en,
  summary_ru = EXCLUDED.summary_ru,
  program_type = EXCLUDED.program_type,
  destination_iso2 = EXCLUDED.destination_iso2,
  is_active = true;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured)
SELECT 'a0000000-0000-4000-8000-000000000032', p.id, v.sort_order, true
FROM (VALUES
  ('finland-work-permit', 1),
  ('finland-family-reunification', 2),
  ('finland-startup', 3)
) AS v(slug, sort_order)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule)
SELECT v.id::uuid, p.id, '2026-07', v.rule::jsonb
FROM (VALUES
  ('c0000000-0000-4000-8000-000000000106', 'finland-work-permit', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},2800]}]}'::text),
  ('c0000000-0000-4000-8000-000000000107', 'finland-family-reunification', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_fi"},"yes"]}]}'::text),
  ('c0000000-0000-4000-8000-000000000108', 'finland-startup', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"savings_eur"},10000]}]}'::text)
) AS v(id, slug, rule)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000106', 'income', 'Salary (soft)', 'Зарплата (soft)', 'Meet Migri / collective agreement levels for the role — verify migri.fi', 1),
  ('c0000000-0000-4000-8000-000000000106', 'documents', 'Finnish job offer', 'Оффер в Финляндии', 'Employment contract meeting work or specialist residence criteria', 2),
  ('c0000000-0000-4000-8000-000000000106', 'insurance', 'Health insurance', 'Медстраховка', 'Coverage as required for the permit type', 3),
  ('c0000000-0000-4000-8000-000000000107', 'family', 'Sponsor in Finland', 'Спонсор в Финляндии', 'Spouse, partner, or qualifying family member', 1),
  ('c0000000-0000-4000-8000-000000000107', 'income', 'Means of support', 'Средства содержания', 'Sponsor income/housing — verify Migri family rules', 2),
  ('c0000000-0000-4000-8000-000000000108', 'documents', 'Startup eligibility', 'Eligibility стартапа', 'Business Finland positive eligibility statement (soft — verify current process)', 1),
  ('c0000000-0000-4000-8000-000000000108', 'income', 'Means of support', 'Средства', 'Sufficient funds for stay — soft orient; verify migri.fi', 2),
  ('c0000000-0000-4000-8000-000000000108', 'documents', 'Business plan', 'Бизнес-план', 'Scalable startup model accepted under the scheme', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000106', 'Migri application fee', 'Сбор Migri', 'EUR fees — verify migri.fi', 1),
  ('c0000000-0000-4000-8000-000000000107', 'Application fees', 'Сборы за подачу', 'EUR fees — verify migri.fi', 1),
  ('c0000000-0000-4000-8000-000000000108', 'Migri + BF fees', 'Сборы Migri / BF', 'EUR — verify migri.fi / Business Finland', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000106', 'document_prep', 'Offer & docs', 'Оффер и документы', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000106', 'application', 'Enter Finland / Migri', 'Подача Migri', '1–6 months', 2),
  ('c0000000-0000-4000-8000-000000000106', 'residence', 'Residence card', 'Карта ВНЖ', '2–6 weeks after decision', 3),
  ('c0000000-0000-4000-8000-000000000107', 'document_prep', 'Relationship & housing', 'Родство и жильё', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000107', 'application', 'Migri family application', 'Подача Migri (семья)', '4–12 months', 2),
  ('c0000000-0000-4000-8000-000000000107', 'residence', 'Family residence permit', 'Семейный ВНЖ', '2–8 weeks', 3),
  ('c0000000-0000-4000-8000-000000000108', 'document_prep', 'BF eligibility & plan', 'Eligibility BF и план', '1–3 months', 1),
  ('c0000000-0000-4000-8000-000000000108', 'application', 'Migri startup residence', 'Подача startup ВНЖ', '1–4 months', 2),
  ('c0000000-0000-4000-8000-000000000108', 'residence', 'Residence card', 'Карта ВНЖ', '2–6 weeks after decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000106', 'https://migri.fi/en/working-in-finland', 'Migri — working in Finland. Verify current work and specialist residence streams.', '2026-07-31', 'Migri — work', 'Migri — работа'),
  ('c0000000-0000-4000-8000-000000000107', 'https://migri.fi/en/moving-to-finland-to-be-with-a-family-member', 'Migri — family member residence. Verify current requirements.', '2026-07-31', 'Migri — family', 'Migri — семья'),
  ('c0000000-0000-4000-8000-000000000108', 'https://migri.fi/en/startup-residence-permit', 'Migri — startup residence permit. Soft thresholds — verify current rules.', '2026-07-31', 'Migri — startup', 'Migri — startup')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000106', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000106', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000106', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000106', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000107', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000107', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000107', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000107', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000108', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000108', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000108', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000108', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000032', 'citizenship', 'Finnish citizenship timeline', 'Срок гражданства Финляндии', 'Finland: typically ~5 years legal residence plus language requirements — verify Migri.', 'Финляндия: обычно ~5 лет легального проживания + язык — сверяйте Migri.', 'https://migri.fi/', '2026-07-31', 1),
  ('a0000000-0000-4000-8000-000000000032', 'exam', 'Finnish / Swedish language', 'Финский / шведский язык', 'Citizenship requires Finnish or Swedish language proof at required level.', 'Для гражданства нужен финский или шведский на требуемом уровне.', NULL, '2026-07-31', 2),
  ('a0000000-0000-4000-8000-000000000032', 'timeline', 'Work → permanent residence', 'Работа → ПМЖ', 'Permanent residence after continuous legal stay — verify Migri for your permit type.', 'ПМЖ после непрерывного легального статуса — сверяйте Migri для вашего типа ВНЖ.', NULL, '2026-07-31', 3),
  ('a0000000-0000-4000-8000-000000000032', 'practical', 'Personal identity code', 'Henkilötunnus', 'Finnish personal identity code is required for banking, tax, and public services.', 'Финский персональный код нужен для банка, налогов и госуслуг.', NULL, '2026-07-31', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000032', 'a0000000-0000-4000-8000-000000000032', 'finland-routes', 'Finland route finder', 'Подбор маршрута — Финляндия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000108', 'd0000000-0000-4000-8000-000000000032', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000109', 'd0000000-0000-4000-8000-000000000032', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000110', 'd0000000-0000-4000-8000-000000000032', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000111', 'd0000000-0000-4000-8000-000000000032', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000108', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000109', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000109', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000109', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000109', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000110', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000110', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000110', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000110', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000111', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000111', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000111', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000111', 'has_family_in_fi', 'single', 'Family member legally in Финляндия?', 'Член семьи уже легально в стране (Финляндия)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'finland', 'finland', 'Финляндия', 'Finland', '🇫🇮',
  'русскоязычные, планирующие ВНЖ в стране: Финляндия',
  'Migri work/specialist, startup residence, family — soft, сверяйте migri.fi',
  'ru-speaking-to-finland', 'active',
  ARRAY['Финляндия ВНЖ', 'релокация Финляндия'],
  ARRAY['Finland residence permit', 'Finland work permit'],
  '{"landing":"/ru/finland","wizard":"/ru/finland/wizard","guide":"/ru/finland/digest"}'::jsonb,
  9
)
ON CONFLICT (key) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  country_ru = EXCLUDED.country_ru,
  country_en = EXCLUDED.country_en,
  flag = EXCLUDED.flag,
  audience_ru = EXCLUDED.audience_ru,
  focus_hint_ru = EXCLUDED.focus_hint_ru,
  corridor_slug = EXCLUDED.corridor_slug,
  status = EXCLUDED.status,
  seo_tags = EXCLUDED.seo_tags,
  rss_queries = EXCLUDED.rss_queries,
  site_paths = EXCLUDED.site_paths,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-finland');

-- Corridor: ru-speaking-to-denmark
INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000033',
  'ru-speaking-to-denmark',
  'Russian-speaking → Denmark',
  'Русскоязычные → Дания',
  'Relocation navigator for Russian-speaking applicants targeting Danish residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Дании.',
  'RU',
  'denmark',
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  publish_status = EXCLUDED.publish_status,
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  audience_description_en = EXCLUDED.audience_description_en,
  audience_description_ru = EXCLUDED.audience_description_ru;

INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES
  ('a0000000-0000-4000-8000-000000000033', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000033', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000033', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000033', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000033', 'DK')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000109', 'denmark-work-permit', 'DK', 'LABOR', 'Denmark Pay Limit Scheme', 'Дания — pay limit scheme', 'Work residence for employees with salary above the Danish pay limit.', 'Рабочий ВНЖ при зарплате выше датского pay limit.'),
  ('b0000000-0000-4000-8000-000000000110', 'denmark-family-reunification', 'DK', 'BOND', 'Denmark Family Reunification', 'Дания — воссоединение семьи', 'Join a spouse or family member legally residing in Denmark.', 'Присоединение к супругу или члену семьи с легальным статусом в Дании.'),
  ('b0000000-0000-4000-8000-000000000111', 'denmark-fast-track', 'DK', 'LABOR', 'Denmark Fast-track Scheme', 'Дания — Fast-track', 'Work residence via SIRI Fast-track for certified employers (soft — verify nyidanmark.dk).', 'Рабочий ВНЖ через SIRI Fast-track у сертифицированных работодателей (soft — сверяйте nyidanmark.dk).')
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  summary_en = EXCLUDED.summary_en,
  summary_ru = EXCLUDED.summary_ru,
  program_type = EXCLUDED.program_type,
  destination_iso2 = EXCLUDED.destination_iso2,
  is_active = true;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured)
SELECT 'a0000000-0000-4000-8000-000000000033', p.id, v.sort_order, true
FROM (VALUES
  ('denmark-work-permit', 1),
  ('denmark-family-reunification', 2),
  ('denmark-fast-track', 3)
) AS v(slug, sort_order)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule)
SELECT v.id::uuid, p.id, '2026-07', v.rule::jsonb
FROM (VALUES
  ('c0000000-0000-4000-8000-000000000109', 'denmark-work-permit', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},74000]}]}'::text),
  ('c0000000-0000-4000-8000-000000000110', 'denmark-family-reunification', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_dk"},"yes"]}]}'::text),
  ('c0000000-0000-4000-8000-000000000111', 'denmark-fast-track', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},50000]}]}'::text)
) AS v(id, slug, rule)
JOIN emigro_programs p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000109', 'income', 'Pay limit salary', 'Зарплата pay limit', 'DKK 552,000/year (~€74,000 gross, 2026 pay limit)', 1),
  ('c0000000-0000-4000-8000-000000000109', 'documents', 'Danish job offer', 'Оффер в Дании', 'Contract meeting SIRI / pay limit criteria', 2),
  ('c0000000-0000-4000-8000-000000000109', 'insurance', 'Health insurance', 'Медстраховка', 'Danish labour market coverage', 3),
  ('c0000000-0000-4000-8000-000000000110', 'family', 'Sponsor in Denmark', 'Спонсор в Дании', 'Spouse, partner, or qualifying family member', 1),
  ('c0000000-0000-4000-8000-000000000110', 'income', 'Maintenance & housing', 'Содержание и жильё', 'SIRI family rules — housing, attachment, and income criteria (verify nyidanmark.dk)', 2),
  ('c0000000-0000-4000-8000-000000000111', 'documents', 'Certified employer', 'Сертифицированный работодатель', 'Danish employer certified for Fast-track — soft; verify SIRI list', 1),
  ('c0000000-0000-4000-8000-000000000111', 'income', 'Scheme salary', 'Зарплата схемы', 'Meet Fast-track track salary / education criteria — soft orient; verify nyidanmark.dk', 2),
  ('c0000000-0000-4000-8000-000000000111', 'documents', 'Job offer', 'Оффер', 'Contract under Fast-track scheme tracks', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000109', 'SIRI application fee', 'Сбор SIRI', 'DKK 4,405 (~€590)', 1),
  ('c0000000-0000-4000-8000-000000000109', 'Biometrics', 'Биометрия', 'Included in fee (indicative)', 2),
  ('c0000000-0000-4000-8000-000000000110', 'Application fees', 'Сборы за подачу', 'DKK fees — verify SIRI', 1),
  ('c0000000-0000-4000-8000-000000000111', 'SIRI application fee', 'Сбор SIRI', 'DKK fees — verify SIRI', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000109', 'document_prep', 'Employer case & contract', 'Кейс работодателя и контракт', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000109', 'application', 'SIRI online application', 'Подача в SIRI', '3–7 months', 2),
  ('c0000000-0000-4000-8000-000000000109', 'residence', 'Residence permit', 'ВНЖ', '2–4 weeks', 3),
  ('c0000000-0000-4000-8000-000000000110', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000110', 'application', 'SIRI family application', 'Подача SIRI (семья)', '4–12 months', 2),
  ('c0000000-0000-4000-8000-000000000110', 'residence', 'Family residence permit', 'Семейный ВНЖ', '2–8 weeks', 3),
  ('c0000000-0000-4000-8000-000000000111', 'document_prep', 'Employer certification & contract', 'Сертификация работодателя и контракт', '1–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000111', 'application', 'SIRI Fast-track', 'Подача Fast-track', 'Often faster than standard — verify SIRI', 2),
  ('c0000000-0000-4000-8000-000000000111', 'residence', 'Residence permit', 'ВНЖ', '1–4 weeks after approval', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000109', 'https://nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme', 'Pay Limit Scheme — minimum annual salary DKK 552,000 (2026).', '2026-07-31', 'SIRI — pay limit scheme', 'SIRI — pay limit scheme'),
  ('c0000000-0000-4000-8000-000000000110', 'https://nyidanmark.dk/en-GB/You-want-to-apply/Family', 'Family reunification in Denmark — spouse and family schemes.', '2026-07-31', 'SIRI — family', 'SIRI — family'),
  ('c0000000-0000-4000-8000-000000000111', 'https://nyidanmark.dk/en-GB/You-want-to-apply/Work/Fast-track-scheme', 'SIRI Fast-track scheme — certified employers. Soft thresholds — verify current tracks.', '2026-07-31', 'SIRI — Fast-track', 'SIRI — Fast-track')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000109', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000109', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000109', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000109', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000110', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000110', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000110', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000110', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000111', 'RU', 'eligible', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000111', 'BY', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000111', 'UA', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа'),
  ('c0000000-0000-4000-8000-000000000111', 'KZ', 'partial', 'Verify current national authority rules', 'Сверяйте актуальные правила национального органа')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000033', 'citizenship', 'Danish citizenship timeline', 'Срок гражданства Дании', 'Denmark: typically ~9 years legal residence plus language/civics — verify SIRI / Interior.', 'Дания: обычно ~9 лет легального проживания + язык/общество — сверяйте SIRI.', 'https://nyidanmark.dk/', '2026-07-31', 1),
  ('a0000000-0000-4000-8000-000000000033', 'exam', 'Danish language', 'Датский язык', 'Citizenship requires Danish language proof (e.g. Prøve i Dansk 3 / PD3).', 'Для гражданства нужен датский (например PD3).', NULL, '2026-07-31', 2),
  ('a0000000-0000-4000-8000-000000000033', 'timeline', 'Work → permanent residence', 'Работа → ПМЖ', 'Permanent residence depends on scheme and continuous stay — verify SIRI.', 'ПМЖ зависит от схемы и непрерывного статуса — сверяйте SIRI.', NULL, '2026-07-31', 3),
  ('a0000000-0000-4000-8000-000000000033', 'practical', 'CPR number', 'CPR', 'Denmark CPR number is essential for banking, tax, and healthcare.', 'CPR нужен для банка, налогов и healthcare.', NULL, '2026-07-31', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000033', 'a0000000-0000-4000-8000-000000000033', 'denmark-routes', 'Denmark route finder', 'Подбор маршрута — Дания')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000112', 'd0000000-0000-4000-8000-000000000033', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000113', 'd0000000-0000-4000-8000-000000000033', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000114', 'd0000000-0000-4000-8000-000000000033', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000115', 'd0000000-0000-4000-8000-000000000033', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000112', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000113', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000113', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000113', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000113', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000114', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000114', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000114', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000114', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000115', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000115', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000115', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000115', 'has_family_in_dk', 'single', 'Family member legally in Дания?', 'Член семьи уже легально в стране (Дания)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'denmark', 'denmark', 'Дания', 'Denmark', '🇩🇰',
  'русскоязычные, планирующие ВНЖ в стране: Дания',
  'Pay limit scheme, Fast-track, family reunification',
  'ru-speaking-to-denmark', 'active',
  ARRAY['Дания ВНЖ', 'релокация Дания'],
  ARRAY['Denmark residence permit', 'Denmark work permit'],
  '{"landing":"/ru/denmark","wizard":"/ru/denmark/wizard","guide":"/ru/denmark/digest"}'::jsonb,
  10
)
ON CONFLICT (key) DO UPDATE SET
  url_segment = EXCLUDED.url_segment,
  country_ru = EXCLUDED.country_ru,
  country_en = EXCLUDED.country_en,
  flag = EXCLUDED.flag,
  audience_ru = EXCLUDED.audience_ru,
  focus_hint_ru = EXCLUDED.focus_hint_ru,
  corridor_slug = EXCLUDED.corridor_slug,
  status = EXCLUDED.status,
  seo_tags = EXCLUDED.seo_tags,
  rss_queries = EXCLUDED.rss_queries,
  site_paths = EXCLUDED.site_paths,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-denmark');

