-- Poland corridor seed (ru-speaking-to-poland, 2026 thresholds)
-- Highest-demand CIS→EU route; work permit, EU Blue Card, family, student, B2B

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('PL', 'Poland', 'Польша')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000008',
  'ru-speaking-to-poland',
  'Russian-speaking → Poland',
  'Русскоязычные → Польша',
  'Relocation navigator for Russian-speaking applicants targeting Poland residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Польшу.',
  'RU',
  'poland',
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
  ('a0000000-0000-4000-8000-000000000008', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000008', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000008', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000008', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000008', 'PL')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000030', 'poland-work-permit', 'PL', 'LABOR', 'Poland Work Permit (Type A) + Temporary Residence', 'Польша — work permit (Type A) + временный pobyt', 'Employer-sponsored work permit and temporary residence card (karta pobytu czasowego).', 'Рабочий work permit от польского работодателя и карта временного pobyt.'),
  ('b0000000-0000-4000-8000-000000000031', 'poland-eu-blue-card', 'PL', 'LABOR', 'Poland EU Blue Card', 'Польша — EU Blue Card', 'Residence for university graduates with a qualified job meeting the Polish Blue Card salary threshold.', 'ВНЖ для выпускников вузов с квалифицированной работой и порогом зарплаты Blue Card.'),
  ('b0000000-0000-4000-8000-000000000032', 'poland-family-reunification', 'PL', 'BOND', 'Poland Family Reunification', 'Польша — воссоединение семьи', 'Join a spouse or family member legally residing in Poland.', 'Присоединение к супругу или члену семьи с легальным статусом в Польше.'),
  ('b0000000-0000-4000-8000-000000000033', 'poland-student-visa', 'PL', 'STUDY', 'Poland Student Residence (studia)', 'Польша — студенческий pobyt (studia)', 'Temporary residence for enrollment at a Polish university or language school with proof of funds.', 'Временный pobyt при зачислении в польский вуз или языковую школу с подтверждением средств.'),
  ('b0000000-0000-4000-8000-000000000034', 'poland-b2b-contract', 'PL', 'LABOR', 'Poland B2B / Mandate Contract (IT)', 'Польша — B2B / umowa zlecenie (IT)', 'Residence based on civil-law contract (B2B, zlecenie) with Polish client or employer; common IT route.', 'Pobyt на основании гражданско-правового договора (B2B, zlecenie) с польским заказчиком; популярный IT-маршрут.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000030', 1, true),
  ('a0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000031', 2, true),
  ('a0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000034', 3, true),
  ('a0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000032', 4, true),
  ('a0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000033', 5, false)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'b0000000-0000-4000-8000-000000000030', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"monthly_income_eur"},1080]}]}'),
  ('c0000000-0000-4000-8000-000000000034', 'b0000000-0000-4000-8000-000000000031', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_job_offer"},"yes"]},{">=":[{"var":"annual_salary_eur"},36240]}]}'),
  ('c0000000-0000-4000-8000-000000000035', 'b0000000-0000-4000-8000-000000000032', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_pl"},"yes"]}]}'),
  ('c0000000-0000-4000-8000-000000000036', 'b0000000-0000-4000-8000-000000000033', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"wants_study_route"},"yes"]},{"==":[{"var":"has_university_admission"},"yes"]},{"or":[{">=":[{"var":"study_budget_eur"},9600]},{"==":[{"var":"can_show_study_funds"},"yes"]}]}]}'),
  ('c0000000-0000-4000-8000-000000000037', 'b0000000-0000-4000-8000-000000000034', '2026-01', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{"==":[{"var":"has_job_offer"},"yes"]},{"==":[{"var":"remote_income"},"yes"]}]},{">=":[{"var":"monthly_income_eur"},2500]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'documents', 'Employer work permit', 'Work permit от работодателя', 'Type A permit (zezwolenie na pracę) от urząd pracy voivodeship', 1),
  ('c0000000-0000-4000-8000-000000000033', 'income', 'Minimum salary', 'Минимальная зарплата', 'PLN 4 666/мес брутто (минимальная зарплата 2026) — ~€1 080', 2),
  ('c0000000-0000-4000-8000-000000000033', 'documents', 'Employment contract', 'Трудовой договор', 'Umowa o pracę с польским работодателем', 3),
  ('c0000000-0000-4000-8000-000000000034', 'income', 'Blue Card salary threshold', 'Порог зарплаты Blue Card', '150% средней зарплаты — PLN 13 041/мес брутто (~€3 020/мес, 2026 ориентир)', 1),
  ('c0000000-0000-4000-8000-000000000034', 'documents', 'University degree', 'Диплом вуза', 'Higher education required for EU Blue Card route', 2),
  ('c0000000-0000-4000-8000-000000000034', 'documents', 'Employment contract', 'Трудовой договор', 'Umowa o pracę на квалифицированную должность', 3),
  ('c0000000-0000-4000-8000-000000000035', 'family', 'Sponsor in Poland', 'Спонсор в Польше', 'Супруг(а), ребёнок или иной член семьи с karta pobytu', 1),
  ('c0000000-0000-4000-8000-000000000035', 'income', 'Maintenance', 'Содержание', 'Достаточный доход спонсора и жильё для семьи', 2),
  ('c0000000-0000-4000-8000-000000000036', 'documents', 'University enrollment', 'Зачисление', 'Zaświadczenie o przyjęciu / letter of admission', 1),
  ('c0000000-0000-4000-8000-000000000036', 'savings', 'Proof of funds', 'Подтверждение средств', '≈PLN 877/мес × 12 (~€9 600/год на 2026 ориентир)', 2),
  ('c0000000-0000-4000-8000-000000000036', 'insurance', 'Health insurance', 'Медстраховка', 'NFZ или частная страховка на период учёбы', 3),
  ('c0000000-0000-4000-8000-000000000037', 'documents', 'B2B / mandate contract', 'Договор B2B / zlecenie', 'Umowa zlecenie или B2B с польским контрагентом (IT/услуги)', 1),
  ('c0000000-0000-4000-8000-000000000037', 'income', 'Contract income', 'Доход по договору', '≥€2 500/мес net/gross по договору (ориентир для IT B2B)', 2),
  ('c0000000-0000-4000-8000-000000000037', 'documents', 'Tax registration', 'Регистрация', 'NIP / działalność или umowa zlecenie с ZUS contributions', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'Work permit fee', 'Сбор work permit', 'PLN 50 (urząd pracy)', 1),
  ('c0000000-0000-4000-8000-000000000033', 'Residence card fee', 'Сбор karta pobytu', 'PLN 340 (standard)', 2),
  ('c0000000-0000-4000-8000-000000000034', 'Blue Card fee', 'Сбор Blue Card', 'PLN 340 (karta pobytu)', 1),
  ('c0000000-0000-4000-8000-000000000034', 'Consular visa (if abroad)', 'Консульская виза', '€80 (national D visa, if applicable)', 2),
  ('c0000000-0000-4000-8000-000000000035', 'Application fees', 'Сборы за подачу', 'PLN 340 + PLN 50 stamp duty (indicative)', 1),
  ('c0000000-0000-4000-8000-000000000036', 'Residence fee', 'Сбор pobyt studia', 'PLN 340', 1),
  ('c0000000-0000-4000-8000-000000000036', 'Tuition', 'Обучение', '€2 000–€8 000/год (зависит от вуза)', 2),
  ('c0000000-0000-4000-8000-000000000037', 'Residence fee', 'Сбор pobyt', 'PLN 340', 1),
  ('c0000000-0000-4000-8000-000000000037', 'ZUS / accounting', 'ZUS / бухгалтерия', 'PLN 200–800/мес (B2B/jdg)', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'document_prep', 'Employer labor market test', 'Work permit от работодателя', '2–8 weeks', 1),
  ('c0000000-0000-4000-8000-000000000033', 'application', 'Voivodeship residence application', 'Подача в Urząd Wojewódzki', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000033', 'residence', 'Karta pobytu issuance', 'Выдача karta pobytu', '2–6 weeks after decision', 3),
  ('c0000000-0000-4000-8000-000000000034', 'document_prep', 'Degree & contract dossier', 'Досье диплома и контракта', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000034', 'application', 'Voivodeship Blue Card application', 'Подача Blue Card в voivodeship', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000034', 'residence', 'Blue Card card', 'Карта Blue Card', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000035', 'document_prep', 'Relationship proof', 'Подтверждение родства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000035', 'application', 'Family reunification', 'Подача на воссоединение', '2–4 months', 2),
  ('c0000000-0000-4000-8000-000000000035', 'residence', 'Family karta pobytu', 'Семейный pobyt', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000036', 'document_prep', 'Admission & funds', 'Зачисление и средства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000036', 'application', 'Voivodeship student pobyt', 'Подача pobyt studia', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000036', 'residence', 'Student card', 'Студенческая карта', '2–6 weeks', 3),
  ('c0000000-0000-4000-8000-000000000037', 'document_prep', 'Contract & NIP setup', 'Договор и NIP', '1–3 weeks', 1),
  ('c0000000-0000-4000-8000-000000000037', 'application', 'Voivodeship application', 'Подача в voivodeship', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000037', 'residence', 'Temporary residence card', 'Karta pobytu czasowego', '2–6 weeks', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'https://www.gov.pl/web/udsc-en/temporary-residence-permit-for-work', 'Temporary residence permit for work — work permit + karta pobytu procedure.', '2026-06-27', 'gov.pl — work residence', 'gov.pl — pobyt для работы'),
  ('c0000000-0000-4000-8000-000000000033', 'https://www.gov.pl/web/family-social-policy/minimum-wage', 'Minimum wage PLN 4 666 gross/month from 1 January 2026.', '2026-06-27', 'Minimum wage 2026', 'Минимальная зарплата 2026'),
  ('c0000000-0000-4000-8000-000000000034', 'https://www.gov.pl/web/udsc-en/eu-blue-card', 'EU Blue Card — higher education + qualified employment above salary threshold.', '2026-06-27', 'gov.pl — EU Blue Card', 'gov.pl — EU Blue Card'),
  ('c0000000-0000-4000-8000-000000000034', 'https://www.gov.pl/web/family-social-policy', 'Blue Card salary threshold 150% of average remuneration (updated annually).', '2026-06-27', 'Blue Card threshold', 'Порог Blue Card'),
  ('c0000000-0000-4000-8000-000000000035', 'https://www.gov.pl/web/udsc-en/temporary-residence-permit-for-family-reunification', 'Family reunification for spouses and dependants of legal residents.', '2026-06-27', 'gov.pl — family reunification', 'gov.pl — воссоединение'),
  ('c0000000-0000-4000-8000-000000000036', 'https://www.gov.pl/web/udsc-en/temporary-residence-permit-for-studies', 'Temporary residence for studies — enrollment and proof of means required.', '2026-06-27', 'gov.pl — student pobyt', 'gov.pl — pobyt studia'),
  ('c0000000-0000-4000-8000-000000000037', 'https://www.gov.pl/web/udsc-en/temporary-residence-permit-for-work', 'Residence for work including civil-law contracts (umowa zlecenie / B2B).', '2026-06-27', 'gov.pl — work (incl. B2B)', 'gov.pl — работа (B2B)')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000033', 'RU', 'eligible', 'Work permit route open; apply via voivodeship or consulate where jurisdiction allows', 'Work permit доступен; подача через voivodeship или консульство по юрисдикции'),
  ('c0000000-0000-4000-8000-000000000033', 'BY', 'partial', 'Preliminarily possible; verify consulate jurisdiction and employer sponsorship', 'Предварительно возможно; проверьте консульство и спонсора'),
  ('c0000000-0000-4000-8000-000000000033', 'UA', 'partial', 'UA citizens may also qualify for temporary protection — compare routes', 'Граждане UA могут также получить temporary protection — сравните маршруты'),
  ('c0000000-0000-4000-8000-000000000033', 'KZ', 'partial', 'Preliminarily possible; Schengen visa required — visa does not replace work permit', 'Предварительно возможно; нужна шенгенская виза — виза не заменяет work permit'),
  ('c0000000-0000-4000-8000-000000000034', 'RU', 'eligible', 'EU Blue Card route verified for qualified employment', 'EU Blue Card доступен при квалифицированной работе'),
  ('c0000000-0000-4000-8000-000000000034', 'BY', 'partial', 'Subject to consulate jurisdiction', 'Зависит от консульства подачи'),
  ('c0000000-0000-4000-8000-000000000034', 'UA', 'partial', 'Compare with temporary protection if eligible', 'Сравните с temporary protection при наличии права'),
  ('c0000000-0000-4000-8000-000000000034', 'KZ', 'partial', 'Preliminarily possible with employer sponsorship', 'Предварительно возможно при спонсорстве работодателя'),
  ('c0000000-0000-4000-8000-000000000035', 'RU', 'eligible', 'Family reunification for legal residents'' dependants', 'Воссоединение с резидентами Польши'),
  ('c0000000-0000-4000-8000-000000000035', 'BY', 'partial', 'Subject to sponsor status and housing proof', 'Зависит от статуса спонсора и жилья'),
  ('c0000000-0000-4000-8000-000000000035', 'UA', 'eligible', 'Family route available; TP may be faster for eligible UA citizens', 'Семейный маршрут доступен; TP может быть быстрее для UA'),
  ('c0000000-0000-4000-8000-000000000035', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000036', 'RU', 'eligible', 'Student pobyt with university admission', 'Студенческий pobyt при зачислении'),
  ('c0000000-0000-4000-8000-000000000036', 'BY', 'partial', 'Verify consulate and enrollment', 'Проверьте консульство и зачисление'),
  ('c0000000-0000-4000-8000-000000000036', 'UA', 'partial', 'Student route available alongside TP options', 'Студенческий маршрут доступен параллельно с TP'),
  ('c0000000-0000-4000-8000-000000000036', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000037', 'RU', 'eligible', 'B2B/zlecenie route common for IT; case-by-case at voivodeship', 'B2B/zlecenie популярен в IT; оценка индивидуально в voivodeship'),
  ('c0000000-0000-4000-8000-000000000037', 'BY', 'partial', 'Verify contract structure and tax registration', 'Проверьте структуру договора и налоги'),
  ('c0000000-0000-4000-8000-000000000037', 'UA', 'partial', 'Compare with temporary protection', 'Сравните с temporary protection'),
  ('c0000000-0000-4000-8000-000000000037', 'KZ', 'partial', 'Preliminarily possible for IT contractors', 'Предварительно возможно для IT-подрядчиков')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000008', 'citizenship', 'Naturalization (B1 Polish)', 'Натурализация (B1 польский)', 'Standard naturalization: typically 3 years with Polish Card or 10 years continuous legal residence; B1 Polish and stable income required.', 'Стандарт: 3 года с Kartą Polaka или 10 лет легального проживания; нужен польский B1 и стабильный доход.', 'https://www.gov.pl/web/udsc-en/acquiring-polish-citizenship', '2026-06-27', 1),
  ('a0000000-0000-4000-8000-000000000008', 'exam', 'State Certificate B1', 'Госэкзамен B1', 'Polish B1 certificate (Państwowy egzamin) required for citizenship; plan 12–18 months from zero.', 'Для гражданства нужен B1 (Państwowy egzamin); с нуля — 12–18 месяцев.', 'https://certyfikatpolski.pl/', '2026-06-27', 2),
  ('a0000000-0000-4000-8000-000000000008', 'timeline', 'Temporary → permanent residence', 'Czasowy → stały pobyt', 'Temporary karta pobytu (1–3 years) → permanent residence (stały pobyt) after ~5 years continuous legal stay.', 'Karta pobytu czasowego (1–3 года) → stały pobyt после ~5 лет непрерывного легального проживания.', NULL, '2026-06-27', 3),
  ('a0000000-0000-4000-8000-000000000008', 'practical', 'PESEL and meldunek', 'PESEL и meldunek', 'Register address (zameldowanie) within 30 days. PESEL needed for tax, bank, and NFZ registration.', 'Регистрация адреса (zameldowanie) в течение 30 дней. PESEL нужен для налогов, банка и NFZ.', 'https://www.gov.pl/web/gov/zameldowanie', '2026-06-27', 4),
  ('a0000000-0000-4000-8000-000000000008', 'practical', 'Voivodeship wait times', 'Очереди Urząd Wojewódzki', 'Major cities (Warsaw, Kraków, Wrocław) have long queues for fingerprinting and card pickup — book early.', 'В крупных городах (Варшава, Краков, Вроцлав) длинные очереди на отпечатки и выдачу карты — записывайтесь заранее.', 'https://www.gov.pl/web/udsc-en', '2026-06-27', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000008', 'poland-routes', 'Poland route finder', 'Подбор маршрута — Польша')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000034', 'd0000000-0000-4000-8000-000000000008', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000035', 'd0000000-0000-4000-8000-000000000008', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000036', 'd0000000-0000-4000-8000-000000000008', 'capital', 'Passive income & savings', 'Пассивный доход и сбережения', 3),
  ('e0000000-0000-4000-8000-000000000037', 'd0000000-0000-4000-8000-000000000008', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000034', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000035', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside destination country', 'Зарплата или фриланс от работодателей/клиентов вне страны назначения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000035', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000035', 'has_job_offer', 'single', 'Signed job offer in destination country?', 'Подписанный оффер работы в стране назначения?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000035', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000036', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not salary', 'Пенсии, аренда, дивиденды — не зарплата', NULL, 1),
  ('e0000000-0000-4000-8000-000000000036', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000036', 'willing_to_invest_eur', 'number', 'Capital for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)', 'Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.', 'Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.', NULL, 3),
  ('e0000000-0000-4000-8000-000000000036', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000037', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000037', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2),
  ('e0000000-0000-4000-8000-000000000037', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение', NULL, 3),
  ('e0000000-0000-4000-8000-000000000037', 'has_family_in_pl', 'single', 'Family member legally in Польша?', 'Член семьи уже легально в стране (Польша)?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

-- News topic for Poland
INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'poland', 'poland', 'Польша', 'Poland', '🇵🇱',
  'русскоязычные, планирующие ВНЖ или гражданство в Польше',
  'work permit, EU Blue Card, B2B IT, воссоединение, Urząd Wojewódzki',
  'ru-speaking-to-poland', 'active',
  ARRAY['Польша ВНЖ','EU Blue Card Польша','work permit Польша','B2B IT Польша','релокация в Польшу','русскоязычные'],
  ARRAY['Poland immigration law residency','Poland EU Blue Card salary threshold','Poland work permit Type A','Poland temporary residence permit','Польша ВНЖ иммиграция','Poland voivodeship residence card'],
  '{"landing":"/ru/poland","wizard":"/ru/poland/wizard","guide":"/ru/poland/digest"}'::jsonb,
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-poland');
