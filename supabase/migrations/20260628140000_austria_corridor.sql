-- Austria corridor seed (ru-speaking-to-austria, 2026 thresholds)
-- Red-White-Red card, EU Blue Card, family, student, freelancer

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('AT', 'Austria', 'Австрия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000010',
  'ru-speaking-to-austria',
  'Russian-speaking → Austria',
  'Русскоязычные → Австрия',
  'Relocation navigator for Russian-speaking applicants targeting Austria residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Австрию.',
  'RU',
  'austria',
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
  ('a0000000-0000-4000-8000-000000000010', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000010', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000010', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000010', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000010', 'AT')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000040', 'austria-rwr-card', 'AT', 'LABOR', 'Austria Red-White-Red Card (RWR)', 'Австрия — Red-White-Red Card (RWR)', 'Skilled worker residence (Red-White-Red Card) for qualified employment meeting Austrian salary and labour-market criteria.', 'RWR Card для квалифицированных специалists с работой и порогом зарплаты по категории RWR.'),
  ('b0000000-0000-4000-8000-000000000041', 'austria-eu-blue-card', 'AT', 'LABOR', 'Austria EU Blue Card', 'Австрия — EU Blue Card', 'Residence for university graduates with a qualified job meeting the Austrian EU Blue Card salary threshold.', 'ВНЖ для выпускников вузов с квалифицированной работой и порогом зарплаты Blue Card.'),
  ('b0000000-0000-4000-8000-000000000042', 'austria-family-reunification', 'AT', 'BOND', 'Austria Family Reunification', 'Австрия — воссоединение семьи', 'Join a spouse or family member legally residing in Austria.', 'Присоединение к супругу или члену семьи с легальным статусом в Австрии.'),
  ('b0000000-0000-4000-8000-000000000043', 'austria-student-visa', 'AT', 'STUDY', 'Austria Student Residence (studium)', 'Австрия — студенческий ВНЖ (studium)', 'Temporary residence for enrollment at an Austrian university with proof of funds and accommodation.', 'Временный ВНЖ при зачислении в австрийский вуз с подтверждением средств и жилья.'),
  ('b0000000-0000-4000-8000-000000000044', 'austria-freelancer-self-employed', 'AT', 'LABOR', 'Austria Self-Employed / Freelancer (Neue Selbständige)', 'Австрия — самозанятость / фриланс (Neue Selbständige)', 'Residence for self-employed key workers or freelancers with viable business plan and local economic benefit.', 'ВНЖ для самозанятых и фрилансеров с бизнес-планом и экономической пользой для AT.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000040', 1, true),
  ('a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000041', 2, true),
  ('a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000044', 3, true),
  ('a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000042', 4, true),
  ('a0000000-0000-4000-8000-000000000010', 'b0000000-0000-4000-8000-000000000043', 5, false)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'b0000000-0000-4000-8000-000000000040', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},2835]}]}'),
  ('c0000000-0000-4000-8000-000000000044', 'b0000000-0000-4000-8000-000000000041', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},58000]}]}'),
  ('c0000000-0000-4000-8000-000000000045', 'b0000000-0000-4000-8000-000000000042', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_at"},"yes"]}]}'),
  ('c0000000-0000-4000-8000-000000000046', 'b0000000-0000-4000-8000-000000000043', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"wants_study_route"},"yes"]},{"==":[{"var":"has_university_admission"},"yes"]},{"or":[{">=":[{"var":"study_budget_eur"},12000]},{"==":[{"var":"can_show_study_funds"},"yes"]}]}]}'),
  ('c0000000-0000-4000-8000-000000000047', 'b0000000-0000-4000-8000-000000000044', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{"==":[{"var":"has_job_offer"},"yes"]},{"==":[{"var":"remote_income"},"yes"]}]},{">=":[{"var":"monthly_income_eur"},2500]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'documents', 'RWR Card approval', 'Одобрение RWR Card', 'Antrag beim AMS / migration.gv.at — points-based or shortage occupation route', 1),
  ('c0000000-0000-4000-8000-000000000043', 'income', 'Minimum salary (Other Key Workers)', 'Минимальная зарплата (Other Key Workers)', '€2 835/мес брутто (2026 ориентир для категории Other Key Workers)', 2),
  ('c0000000-0000-4000-8000-000000000043', 'documents', 'Employment contract', 'Трудовой договор', 'Dienstverhältnis с австрийским работодателем', 3),
  ('c0000000-0000-4000-8000-000000000044', 'income', 'Blue Card salary threshold', 'Порог зарплаты Blue Card', '€58 000/год брутто (~€4 833/мес, 2026 ориентир; shortage occupations ниже)', 1),
  ('c0000000-0000-4000-8000-000000000044', 'documents', 'University degree', 'Диплом вуза', 'Higher education required for EU Blue Card route', 2),
  ('c0000000-0000-4000-8000-000000000044', 'documents', 'Employment contract', 'Трудовой договор', 'Arbeitsvertrag на квалифицированную должность', 3),
  ('c0000000-0000-4000-8000-000000000045', 'family', 'Sponsor in Austria', 'Спонсор в Австрии', 'Супруг(а), ребёнок или иной член семьи с Aufenthaltstitel', 1),
  ('c0000000-0000-4000-8000-000000000045', 'income', 'Maintenance', 'Содержание', 'Достаточный доход спонсора и жильё для семьи', 2),
  ('c0000000-0000-4000-8000-000000000046', 'documents', 'University enrollment', 'Зачисление', 'Zulassungsbescheid / letter of admission', 1),
  ('c0000000-0000-4000-8000-000000000046', 'savings', 'Proof of funds', 'Подтверждение средств', '≈€12 000/год (~€1 000/мес на 2026 ориентир)', 2),
  ('c0000000-0000-4000-8000-000000000046', 'insurance', 'Health insurance', 'Медстраховка', 'Kommerzielle или studentische Versicherung на период учёбы', 3),
  ('c0000000-0000-4000-8000-000000000047', 'documents', 'Business plan / Gewerbe', 'Бизнес-план / Gewerbe', 'Nachweis wirtschaftlicher Nutzen + Gewerbeanmeldung или freelance contracts', 1),
  ('c0000000-0000-4000-8000-000000000047', 'income', 'Self-employment income', 'Доход самозанятого', '≥€2 500/мес net/gross по контрактам (ориентир для IT/consulting)', 2),
  ('c0000000-0000-4000-8000-000000000047', 'documents', 'Tax registration', 'Регистрация', 'UID, Finanzamt, SVS contributions', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'RWR Card fee', 'Сбор RWR Card', '€160 (Bundesverwaltungsabgabe, indicative)', 1),
  ('c0000000-0000-4000-8000-000000000043', 'Residence permit fee', 'Сбор Aufenthaltstitel', '€120–160 (Magistrat/Bezirkshauptmannschaft)', 2),
  ('c0000000-0000-4000-8000-000000000044', 'Blue Card fee', 'Сбор Blue Card', '€160 + €120 residence card', 1),
  ('c0000000-0000-4000-8000-000000000044', 'Consular visa (if abroad)', 'Консульская виза', '€80 (D visa, if applicable)', 2),
  ('c0000000-0000-4000-8000-000000000045', 'Application fees', 'Сборы за подачу', '€120–160 + €160 RWR/family stamp (indicative)', 1),
  ('c0000000-0000-4000-8000-000000000046', 'Residence fee', 'Сбор student residence', '€120–160', 1),
  ('c0000000-0000-4000-8000-000000000046', 'Tuition', 'Обучение', '€750–1 500/семестр (зависит от вуза; EU students lower at public unis)', 2),
  ('c0000000-0000-4000-8000-000000000047', 'Residence fee', 'Сбор self-employed', '€160 + €120', 1),
  ('c0000000-0000-4000-8000-000000000047', 'Accounting / SVS', 'SVS / бухгалтерия', '€300–800/мес (Selbständige)', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'document_prep', 'AMS labour market check', 'Проверка AMS / RWR points', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000043', 'application', 'Magistrat residence application', 'Подача в Magistrat / Bezirkshauptmannschaft', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000043', 'residence', 'Aufenthaltstitel issuance', 'Выдача Aufenthaltstitel', '2–6 weeks after decision', 3),
  ('c0000000-0000-4000-8000-000000000044', 'document_prep', 'Degree & contract dossier', 'Досье диплома и контракта', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000044', 'application', 'Blue Card application', 'Подача EU Blue Card', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000044', 'residence', 'Blue Card card', 'Карта Blue Card', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000045', 'document_prep', 'Relationship proof', 'Подтверждение родства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000045', 'application', 'Family reunification', 'Подача на воссоединение', '2–4 months', 2),
  ('c0000000-0000-4000-8000-000000000045', 'residence', 'Family Aufenthaltstitel', 'Семейный Aufenthaltstitel', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000046', 'document_prep', 'Admission & funds', 'Зачисление и средства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000046', 'application', 'Student residence application', 'Подача student residence', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000046', 'residence', 'Student card', 'Студенческая карта', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000047', 'document_prep', 'Gewerbe & business plan', 'Gewerbe и бизнес-план', '1–3 weeks', 1),
  ('c0000000-0000-4000-8000-000000000047', 'application', 'Magistrat application', 'Подача в Magistrat', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000047', 'residence', 'Self-employed permit', 'Aufenthaltstitel Selbständige', '2–6 weeks', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/red-white-red-card/', 'Red-White-Red Card — skilled workers, shortage occupations, and key workers routes.', '2026-06-27', 'migration.gv.at — RWR Card', 'migration.gv.at — RWR Card'),
  ('c0000000-0000-4000-8000-000000000043', 'https://www.oesterreich.gv.at/en/topics/working_in_austria', 'Minimum salary thresholds for RWR categories updated annually.', '2026-06-27', 'RWR salary thresholds', 'Пороги RWR'),
  ('c0000000-0000-4000-8000-000000000044', 'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/eu-blue-card/', 'EU Blue Card — higher education + qualified employment above salary threshold.', '2026-06-27', 'migration.gv.at — EU Blue Card', 'migration.gv.at — EU Blue Card'),
  ('c0000000-0000-4000-8000-000000000044', 'https://www.ams.at/', 'Blue Card salary threshold updated annually by AMS/BMAW.', '2026-06-27', 'Blue Card threshold', 'Порог Blue Card'),
  ('c0000000-0000-4000-8000-000000000045', 'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/family-reunification/', 'Family reunification for spouses and dependants of legal residents.', '2026-06-27', 'migration.gv.at — family', 'migration.gv.at — воссоединение'),
  ('c0000000-0000-4000-8000-000000000046', 'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/students/', 'Student residence — enrollment and proof of means required.', '2026-06-27', 'migration.gv.at — students', 'migration.gv.at — студенты'),
  ('c0000000-0000-4000-8000-000000000047', 'https://www.migration.gv.at/en/types-of-residence/all-types-of-residence/self-employed-key-workers/', 'Self-employed key workers including Neue Selbständige route.', '2026-06-27', 'migration.gv.at — self-employed', 'migration.gv.at — самозанятость')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000043', 'RU', 'eligible', 'RWR Card route open; apply via AMS and local authority', 'RWR Card доступен; подача через AMS и местный Magistrat'),
  ('c0000000-0000-4000-8000-000000000043', 'BY', 'partial', 'Preliminarily possible; verify consulate jurisdiction', 'Предварительно возможно; проверьте консульство'),
  ('c0000000-0000-4000-8000-000000000043', 'UA', 'partial', 'UA citizens may also qualify for temporary protection — compare routes', 'Граждане UA могут также получить temporary protection — сравните маршруты'),
  ('c0000000-0000-4000-8000-000000000043', 'KZ', 'partial', 'Preliminarily possible; Schengen visa-free entry does not replace work permit', 'Предварительно возможно; безвиз не заменяет work permit'),
  ('c0000000-0000-4000-8000-000000000044', 'RU', 'eligible', 'EU Blue Card route verified for qualified employment', 'EU Blue Card доступен при квалифицированной работе'),
  ('c0000000-0000-4000-8000-000000000044', 'BY', 'partial', 'Subject to consulate jurisdiction', 'Зависит от консульства подачи'),
  ('c0000000-0000-4000-8000-000000000044', 'UA', 'partial', 'Compare with temporary protection if eligible', 'Сравните с temporary protection при наличии права'),
  ('c0000000-0000-4000-8000-000000000044', 'KZ', 'partial', 'Preliminarily possible with employer sponsorship', 'Предварительно возможно при спонсорстве работодателя'),
  ('c0000000-0000-4000-8000-000000000045', 'RU', 'eligible', 'Family reunification for legal residents'' dependants', 'Воссоединение с резидентами Австрии'),
  ('c0000000-0000-4000-8000-000000000045', 'BY', 'partial', 'Subject to sponsor status and housing proof', 'Зависит от статуса спонсора и жилья'),
  ('c0000000-0000-4000-8000-000000000045', 'UA', 'eligible', 'Family route available; TP may be faster for eligible UA citizens', 'Семейный маршрут доступен; TP может быть быстрее для UA'),
  ('c0000000-0000-4000-8000-000000000045', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000046', 'RU', 'eligible', 'Student residence with university admission', 'Студенческий ВНЖ при зачислении'),
  ('c0000000-0000-4000-8000-000000000046', 'BY', 'partial', 'Verify consulate and enrollment', 'Проверьте консульство и зачисление'),
  ('c0000000-0000-4000-8000-000000000046', 'UA', 'partial', 'Student route available alongside TP options', 'Студенческий маршрут доступен параллельно с TP'),
  ('c0000000-0000-4000-8000-000000000046', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000047', 'RU', 'eligible', 'Self-employed route case-by-case; economic benefit required', 'Selbständige — индивидуальная оценка; нужна экономическая польза'),
  ('c0000000-0000-4000-8000-000000000047', 'BY', 'partial', 'Verify Gewerbe structure and tax registration', 'Проверьте Gewerbe и налоги'),
  ('c0000000-0000-4000-8000-000000000047', 'UA', 'partial', 'Compare with temporary protection', 'Сравните с temporary protection'),
  ('c0000000-0000-4000-8000-000000000047', 'KZ', 'partial', 'Preliminarily possible for IT consultants', 'Предварительно возможно для IT-консультантов')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000010', 'citizenship', 'Naturalization (B1 German)', 'Натурализация (B1 немецкий)', 'Standard naturalization: typically 10 years legal residence; B1 German, stable income, and integration required.', 'Стандарт: 10 лет легального проживания; нужен немецкий B1, стабильный доход и интеграция.', 'https://www.oesterreich.gv.at/en/topics/citizenship', '2026-06-27', 1),
  ('a0000000-0000-4000-8000-000000000010', 'exam', 'ÖSD / Goethe B1', 'Экзамен B1 (ÖSD/Goethe)', 'German B1 required for permanent residence and citizenship; plan 12–18 months from zero.', 'Для ПМЖ и гражданства нужен B1; с нуля — 12–18 месяцев.', 'https://www.oead.at/', '2026-06-27', 2),
  ('a0000000-0000-4000-8000-000000000010', 'timeline', 'Temporary → permanent residence', 'Временный → постоянный ВНЖ', 'Temporary Aufenthaltstitel (1–2 years) → permanent residence (Daueraufenthalt) after 5 years continuous legal stay.', 'Временный Aufenthaltstitel (1–2 года) → Daueraufenthalt после 5 лет непрерывного легального проживания.', NULL, '2026-06-27', 3),
  ('a0000000-0000-4000-8000-000000000010', 'practical', 'Meldezettel registration', 'Meldezettel (регистрация адреса)', 'Register address (Meldezettel) within 3 days of moving. Required for bank, insurance, and residence procedures.', 'Регистрация адреса (Meldezettel) в течение 3 дней. Нужна для банка, страховки и ВНЖ.', 'https://www.oesterreich.gv.at/', '2026-06-27', 4),
  ('a0000000-0000-4000-8000-000000000010', 'practical', 'SVS & health insurance', 'SVS и медстраховка', 'Self-employed register with SVS; employees join Gebietskrankenkasse. Insurance mandatory from day one of employment.', 'Самозанятые — SVS; наёмные — GKK. Страховка обязательна с первого дня работы.', 'https://www.svs.at/', '2026-06-27', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000010', 'austria-routes', 'Austria route finder', 'Подбор маршрута — Австрия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000042', 'd0000000-0000-4000-8000-000000000010', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000043', 'd0000000-0000-4000-8000-000000000010', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000044', 'd0000000-0000-4000-8000-000000000010', 'capital', 'Passive income & savings', 'Пассивный доход и сбережения', 3),
  ('e0000000-0000-4000-8000-000000000045', 'd0000000-0000-4000-8000-000000000010', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000042', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000043', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000043', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000043', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000043', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000044', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000044', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000044', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000044', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000045', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000045', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000045', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000045', 'has_family_in_at', 'single', 'Family member legally in Австрия?', 'Член семьи уже легально в стране (Австрия)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

-- News topic for Austria
INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'austria', 'austria', 'Австрия', 'Austria', '🇦🇹',
  'русскоязычные, планирующие ВНЖ или гражданство в Австрии',
  'Red-White-Red Card, EU Blue Card, самозанятость, воссоединение, AMS',
  'ru-speaking-to-austria', 'active',
  ARRAY['Австрия ВНЖ','EU Blue Card Австрия','RWR Card Австрия','самозанятость Австрия','релокация в Австрию','русскоязычные'],
  ARRAY['Austria immigration law residency','Austria EU Blue Card salary threshold','Austria Red-White-Red Card','Austria temporary residence permit','Австрия ВНЖ иммиграция','Austria AMS residence card'],
  '{"landing":"/ru/austria","wizard":"/ru/austria/wizard","guide":"/ru/austria/digest"}'::jsonb,
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-austria');
