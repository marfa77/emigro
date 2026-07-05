-- Czechia corridor seed (ru-speaking-to-czechia, 2026 thresholds)
-- Employee card, EU Blue Card, family, student, živnost (IT freelancer)

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('CZ', 'Czechia', 'Чехия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000009',
  'ru-speaking-to-czechia',
  'Russian-speaking → Czechia',
  'Русскоязычные → Чехия',
  'Relocation navigator for Russian-speaking applicants targeting Czechia residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Чехию.',
  'RU',
  'czechia',
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
  ('a0000000-0000-4000-8000-000000000009', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000009', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000009', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000009', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000009', 'CZ')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000035', 'czechia-employee-card', 'CZ', 'LABOR', 'Czechia Employee Card (zaměstnání)', 'Чехия — Employee Card (zaměstnání)', 'Employer-sponsored employee card (zaměstnanecká karta) with work permit from MPSV and temporary residence.', 'Employee Card от чешского работодателя с разрешением MPSV и временным pobytem.'),
  ('b0000000-0000-4000-8000-000000000036', 'czechia-eu-blue-card', 'CZ', 'LABOR', 'Czechia EU Blue Card', 'Чехия — EU Blue Card', 'Residence for university graduates with a qualified job meeting the Czech Blue Card salary threshold.', 'ВНЖ для выпускников вузов с квалифицированной работой и порогом зарплаты Blue Card.'),
  ('b0000000-0000-4000-8000-000000000037', 'czechia-family-reunification', 'CZ', 'BOND', 'Czechia Family Reunification', 'Чехия — воссоединение семьи', 'Join a spouse or family member legally residing in Czechia.', 'Присоединение к супругу или члену семьи с легальным статусом в Чехии.'),
  ('b0000000-0000-4000-8000-000000000038', 'czechia-student-visa', 'CZ', 'STUDY', 'Czechia Student Residence (studium)', 'Чехия — студенческий pobyt (studium)', 'Temporary residence for enrollment at a Czech university with proof of funds and accommodation.', 'Временный pobyt при зачислении в чешский вуз с подтверждением средств и жилья.'),
  ('b0000000-0000-4000-8000-000000000039', 'czechia-zivnost-freelancer', 'CZ', 'LABOR', 'Czechia Trade License / Živnost (IT)', 'Чехия — živnost / OSVČ (IT)', 'Residence based on trade license (živnostenský list) for freelancers, common IT/consulting route.', 'Pobyt на основании živnost (IT/консалтинг) с регистрацией OSVČ; популярный маршрут для фрилансеров.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000035', 1, true),
  ('a0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000036', 2, true),
  ('a0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000039', 3, true),
  ('a0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000037', 4, true),
  ('a0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000038', 5, false)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'b0000000-0000-4000-8000-000000000035', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},900]}]}'),
  ('c0000000-0000-4000-8000-000000000039', 'b0000000-0000-4000-8000-000000000036', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},33000]}]}'),
  ('c0000000-0000-4000-8000-000000000040', 'b0000000-0000-4000-8000-000000000037', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_cz"},"yes"]}]}'),
  ('c0000000-0000-4000-8000-000000000041', 'b0000000-0000-4000-8000-000000000038', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"wants_study_route"},"yes"]},{"==":[{"var":"has_university_admission"},"yes"]},{"or":[{">=":[{"var":"study_budget_eur"},6200]},{"==":[{"var":"can_show_study_funds"},"yes"]}]}]}'),
  ('c0000000-0000-4000-8000-000000000042', 'b0000000-0000-4000-8000-000000000039', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{"==":[{"var":"has_job_offer"},"yes"]},{"==":[{"var":"remote_income"},"yes"]}]},{">=":[{"var":"monthly_income_eur"},2500]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'documents', 'Employee card approval', 'Employee Card от MPSV', 'Zaměstnanecká karta — одобрение Ministerstva práce a sociálních věcí', 1),
  ('c0000000-0000-4000-8000-000000000038', 'income', 'Minimum salary', 'Минимальная зарплата', 'CZK 22 400/мес брутто (минимальная зарплата 2026) — ~€900; работодатель часто требует выше', 2),
  ('c0000000-0000-4000-8000-000000000038', 'documents', 'Employment contract', 'Трудовой договор', 'Pracovní smlouva с чешским работодателем', 3),
  ('c0000000-0000-4000-8000-000000000039', 'income', 'Blue Card salary threshold', 'Порог зарплаты Blue Card', '150% средней зарплаты — ~CZK 67 500/мес брутто (~€2 750/мес, 2026 ориентир)', 1),
  ('c0000000-0000-4000-8000-000000000039', 'documents', 'University degree', 'Диплом вуза', 'Higher education required for EU Blue Card route', 2),
  ('c0000000-0000-4000-8000-000000000039', 'documents', 'Employment contract', 'Трудовой договор', 'Pracovní smlouva на квалифицированную должность', 3),
  ('c0000000-0000-4000-8000-000000000040', 'family', 'Sponsor in Czechia', 'Спонсор в Чехии', 'Супруг(а), ребёнок или иной член семьи с pobytem', 1),
  ('c0000000-0000-4000-8000-000000000040', 'income', 'Maintenance', 'Содержание', 'Достаточный доход спонсора и жильё для семьи', 2),
  ('c0000000-0000-4000-8000-000000000041', 'documents', 'University enrollment', 'Зачисление', 'Potvrzení o studiu / letter of admission', 1),
  ('c0000000-0000-4000-8000-000000000041', 'savings', 'Proof of funds', 'Подтверждение средств', '≈CZK 149 100/год (~€6 200 на 2026 ориентир)', 2),
  ('c0000000-0000-4000-8000-000000000041', 'insurance', 'Health insurance', 'Медстраховка', 'Коммерческая страховка до enrollment в VZP', 3),
  ('c0000000-0000-4000-8000-000000000042', 'documents', 'Trade license', 'Živnostenský list', 'Registrace živnosti (IT/консалтинг) + OSVČ', 1),
  ('c0000000-0000-4000-8000-000000000042', 'income', 'Business income', 'Доход OSVČ', '≥€2 500/мес net/gross по договорам (ориентир для IT živnost)', 2),
  ('c0000000-0000-4000-8000-000000000042', 'documents', 'Tax registration', 'Регистрация', 'IČO, daň z příjmu, VZP contributions', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'Employee card fee', 'Сбор employee card', 'CZK 1 000 (administrative)', 1),
  ('c0000000-0000-4000-8000-000000000038', 'Residence permit fee', 'Сбор pobyt', 'CZK 2 500 (biometric card)', 2),
  ('c0000000-0000-4000-8000-000000000039', 'Blue Card fee', 'Сбор Blue Card', 'CZK 2 500 (biometric card)', 1),
  ('c0000000-0000-4000-8000-000000000039', 'Consular visa (if abroad)', 'Консульская виза', '€80 (long-stay visa, if applicable)', 2),
  ('c0000000-0000-4000-8000-000000000040', 'Application fees', 'Сборы за подачу', 'CZK 2 500 + CZK 1 000 stamp (indicative)', 1),
  ('c0000000-0000-4000-8000-000000000041', 'Residence fee', 'Сбор pobyt studium', 'CZK 2 500', 1),
  ('c0000000-0000-4000-8000-000000000041', 'Tuition', 'Обучение', '€0–€5 000/год (зависит от вуза и языка)', 2),
  ('c0000000-0000-4000-8000-000000000042', 'Residence fee', 'Сбор pobyt', 'CZK 2 500', 1),
  ('c0000000-0000-4000-8000-000000000042', 'Trade license / accounting', 'Živnost / бухгалтерия', 'CZK 1 000–4 000/мес (OSVČ)', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'document_prep', 'Employer MPSV application', 'Employee Card от работодателя', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000038', 'application', 'MOI residence application', 'Подача в Ministerstvo vnitra', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000038', 'residence', 'Biometric card issuance', 'Выдача карты pobyt', '2–6 weeks after decision', 3),
  ('c0000000-0000-4000-8000-000000000039', 'document_prep', 'Degree & contract dossier', 'Досье диплома и контракта', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000039', 'application', 'MOI Blue Card application', 'Подача Blue Card в MOI', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000039', 'residence', 'Blue Card biometric', 'Карта Blue Card', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000040', 'document_prep', 'Relationship proof', 'Подтверждение родства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000040', 'application', 'Family reunification', 'Подача на воссоединение', '2–4 months', 2),
  ('c0000000-0000-4000-8000-000000000040', 'residence', 'Family pobyt card', 'Семейный pobyt', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000041', 'document_prep', 'Admission & funds', 'Зачисление и средства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000041', 'application', 'MOI student pobyt', 'Подача pobyt studium', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000041', 'residence', 'Student card', 'Студенческая карта', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000042', 'document_prep', 'Živnost & IČO setup', 'Živnost и IČO', '1–3 weeks', 1),
  ('c0000000-0000-4000-8000-000000000042', 'application', 'MOI application', 'Подача в MOI', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000042', 'residence', 'Temporary residence card', 'Dočasný pobyt card', '2–6 weeks', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'https://imigration.gov.cz/en/third-country-nationals/employment/employee-card/', 'Employee card — work permit and residence for employment with Czech employer.', '2026-06-27', 'MOI — employee card', 'MOI — employee card'),
  ('c0000000-0000-4000-8000-000000000038', 'https://ipc.gov.cz/', 'Minimum wage and labour market conditions updated annually.', '2026-06-27', 'IPC — labour market', 'IPC — рынок труда'),
  ('c0000000-0000-4000-8000-000000000039', 'https://imigration.gov.cz/en/third-country-nationals/employment/eu-blue-card/', 'EU Blue Card — higher education + qualified employment above salary threshold.', '2026-06-27', 'MOI — EU Blue Card', 'MOI — EU Blue Card'),
  ('c0000000-0000-4000-8000-000000000039', 'https://ipc.gov.cz/en/information-for-foreigners/residence-in-the-czech-republic/eu-blue-card/', 'Blue Card salary threshold 1.5× average gross remuneration (updated annually).', '2026-06-27', 'Blue Card threshold', 'Порог Blue Card'),
  ('c0000000-0000-4000-8000-000000000040', 'https://imigration.gov.cz/en/third-country-nationals/family-reunification/', 'Family reunification for spouses and dependants of legal residents.', '2026-06-27', 'MOI — family reunification', 'MOI — воссоединение'),
  ('c0000000-0000-4000-8000-000000000041', 'https://imigration.gov.cz/en/third-country-nationals/study/', 'Temporary residence for study — enrollment and proof of means required.', '2026-06-27', 'MOI — student pobyt', 'MOI — pobyt studium'),
  ('c0000000-0000-4000-8000-000000000042', 'https://imigration.gov.cz/en/third-country-nationals/business/', 'Business residence including trade license (živnost) for self-employed.', '2026-06-27', 'MOI — business/živnost', 'MOI — živnost')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000038', 'RU', 'eligible', 'Employee card route open; apply via MOI or consulate where jurisdiction allows', 'Employee Card доступен; подача через MOI или консульство по юрисдикции'),
  ('c0000000-0000-4000-8000-000000000038', 'BY', 'partial', 'Preliminarily possible; verify consulate jurisdiction (often Warsaw/Vilnius routes)', 'Предварительно возможно; проверьте консульство (часто Варшава/Вильнюс)'),
  ('c0000000-0000-4000-8000-000000000038', 'UA', 'partial', 'UA citizens may also qualify for temporary protection — compare routes', 'Граждане UA могут также получить temporary protection — сравните маршруты'),
  ('c0000000-0000-4000-8000-000000000038', 'KZ', 'partial', 'Preliminarily possible; Schengen visa required — visa does not replace employee card', 'Предварительно возможно; нужна шенгенская виза — виза не заменяет employee card'),
  ('c0000000-0000-4000-8000-000000000039', 'RU', 'eligible', 'EU Blue Card route verified for qualified employment', 'EU Blue Card доступен при квалифицированной работе'),
  ('c0000000-0000-4000-8000-000000000039', 'BY', 'partial', 'Subject to consulate jurisdiction and sanctions screening', 'Зависит от консульства и санкционной проверки'),
  ('c0000000-0000-4000-8000-000000000039', 'UA', 'partial', 'Compare with temporary protection if eligible', 'Сравните с temporary protection при наличии права'),
  ('c0000000-0000-4000-8000-000000000039', 'KZ', 'partial', 'Preliminarily possible with employer sponsorship', 'Предварительно возможно при спонсорстве работодателя'),
  ('c0000000-0000-4000-8000-000000000040', 'RU', 'eligible', 'Family reunification for legal residents'' dependants', 'Воссоединение с резидентами Чехии'),
  ('c0000000-0000-4000-8000-000000000040', 'BY', 'partial', 'Subject to sponsor status and housing proof', 'Зависит от статуса спонсора и жилья'),
  ('c0000000-0000-4000-8000-000000000040', 'UA', 'eligible', 'Family route available; TP may be faster for eligible UA citizens', 'Семейный маршрут доступен; TP может быть быстрее для UA'),
  ('c0000000-0000-4000-8000-000000000040', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000041', 'RU', 'eligible', 'Student pobyt with university admission', 'Студенческий pobyt при зачислении'),
  ('c0000000-0000-4000-8000-000000000041', 'BY', 'partial', 'Verify consulate and enrollment', 'Проверьте консульство и зачисление'),
  ('c0000000-0000-4000-8000-000000000041', 'UA', 'partial', 'Student route available alongside TP options', 'Студенческий маршрут доступен параллельно с TP'),
  ('c0000000-0000-4000-8000-000000000041', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000042', 'RU', 'eligible', 'Živnost route common for IT; case-by-case at MOI', 'Živnost популярен в IT; оценка индивидуально в MOI'),
  ('c0000000-0000-4000-8000-000000000042', 'BY', 'partial', 'Verify trade license structure and tax registration', 'Проверьте živnost и налоги'),
  ('c0000000-0000-4000-8000-000000000042', 'UA', 'partial', 'Compare with temporary protection', 'Сравните с temporary protection'),
  ('c0000000-0000-4000-8000-000000000042', 'KZ', 'partial', 'Preliminarily possible for IT contractors', 'Предварительно возможно для IT-подрядчиков')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000009', 'citizenship', 'Naturalization (B1 Czech)', 'Натурализация (B1 чешский)', 'Standard naturalization: typically 5 years permanent residence; B1 Czech, clean record, and integration required.', 'Стандарт: 5 лет постоянного pobyt; нужен чешский B1, чистая репутация и интеграция.', 'https://imigration.gov.cz/en/third-country-nationals/permanent-residence/', '2026-06-27', 1),
  ('a0000000-0000-4000-8000-000000000009', 'exam', 'Czech B1 certificate', 'Сертификат B1', 'Czech B1 (CEFR) required for permanent residence and citizenship; plan 12–18 months from zero.', 'Для ПМЖ и гражданства нужен B1; с нуля — 12–18 месяцев.', 'https://www.czechpoint.cz/', '2026-06-27', 2),
  ('a0000000-0000-4000-8000-000000000009', 'timeline', 'Temporary → permanent residence', 'Dočasný → trvalý pobyt', 'Temporary pobyt (1–2 years) → permanent residence (trvalý pobyt) after 5 years continuous legal stay.', 'Dočasný pobyt (1–2 года) → trvalý pobyt после 5 лет непрерывного легального проживания.', NULL, '2026-06-27', 3),
  ('a0000000-0000-4000-8000-000000000009', 'practical', 'Foreign Police & MOI appointments', 'Запись MOI / cizinecká policie', 'Book MOI appointment early for biometrics and card pickup. Prague and Brno have long queues.', 'Записывайтесь в MOI заранее на биометрию и выдачу карты. В Праге и Брно длинные очереди.', 'https://imigration.gov.cz/', '2026-06-27', 4),
  ('a0000000-0000-4000-8000-000000000009', 'practical', 'Health insurance (VZP) & rodné číslo', 'VZP и rodné číslo', 'Commercial insurance before VZP enrollment. Rodné číslo (birth number) needed for employment and banking.', 'Коммерческая страховка до VZP. Rodné číslo нужен для работы и банка.', 'https://www.vzp.cz/', '2026-06-27', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000009', 'czechia-routes', 'Czechia route finder', 'Подбор маршрута — Чехия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000038', 'd0000000-0000-4000-8000-000000000009', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000039', 'd0000000-0000-4000-8000-000000000009', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000040', 'd0000000-0000-4000-8000-000000000009', 'capital', 'Passive income & savings', 'Пассивный доход и сбережения', 3),
  ('e0000000-0000-4000-8000-000000000041', 'd0000000-0000-4000-8000-000000000009', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000038', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000039', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000039', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000039', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000039', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000040', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000040', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000040', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000040', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000041', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000041', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000041', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000041', 'has_family_in_cz', 'single', 'Family member legally in Чехия?', 'Член семьи уже легально в стране (Чехия)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

-- News topic for Czechia
INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'czechia', 'czechia', 'Чехия', 'Czechia', '🇨🇿',
  'русскоязычные, планирующие ВНЖ или гражданство в Чехии',
  'employee card, EU Blue Card, živnost IT, воссоединение, MOI',
  'ru-speaking-to-czechia', 'active',
  ARRAY['Чехия ВНЖ','EU Blue Card Чехия','employee card Чехия','živnost IT Чехия','релокация в Чехию','русскоязычные'],
  ARRAY['Czech immigration law residency','Czech EU Blue Card salary threshold','Czech employee card zaměstnání','Czech temporary residence permit','Чехия ВНЖ иммиграция','Czech MOI residence card'],
  '{"landing":"/ru/czechia","wizard":"/ru/czechia/wizard","guide":"/ru/czechia/digest"}'::jsonb,
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-czechia');
