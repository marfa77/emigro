-- Greece corridor seed (ru-speaking-to-greece, 2026 thresholds)
-- Digital Nomad, FIP, Golden Visa, family reunification

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('GR', 'Greece', 'Греция')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000011',
  'ru-speaking-to-greece',
  'Russian-speaking → Greece',
  'Русскоязычные → Греция',
  'Relocation navigator for Russian-speaking applicants targeting Greece residency routes (digital nomad, FIP, Golden Visa).',
  'Навигатор релокации для русскоязычных заявителей: Digital Nomad, FIP и Golden Visa в Греции.',
  'RU',
  'greece',
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
  ('a0000000-0000-4000-8000-000000000011', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000011', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000011', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000011', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000011', 'GR')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000045', 'greece-digital-nomad', 'GR', 'LABOR', 'Greece Digital Nomad Visa', 'Греция — Digital Nomad Visa', 'Residence for remote workers with foreign income; local Greek employment prohibited. Consular Type D required before entry (Law 5275/2026).', 'ВНЖ для удалённых работников с зарубежным доходом; работа на греческих работодателей/клиентов запрещена. С февраля 2026 — только Type D в консульстве до въезда (Law 5275/2026).'),
  ('b0000000-0000-4000-8000-000000000046', 'greece-fip', 'GR', 'CAPITAL', 'Greece FIP (Financially Independent Person)', 'Греция — FIP (финансово независимые)', 'Residence for financially independent persons with stable passive income; local work prohibited.', 'ВНЖ для финансово независимых с пассивным доходом; работа в Греции запрещена.'),
  ('b0000000-0000-4000-8000-000000000047', 'greece-golden-visa', 'GR', 'CAPITAL', 'Greece Golden Visa', 'Греция — Golden Visa', '5-year renewable residence via qualifying real-estate or startup investment; no minimum stay for the card.', 'ВНЖ на 5 лет через инвестицию в недвижимость или стартап Elevate Greece; для карты нет обязательного проживания.'),
  ('b0000000-0000-4000-8000-000000000048', 'greece-family-reunification', 'GR', 'BOND', 'Greece Family Reunification', 'Греция — воссоединение семьи', 'Join a spouse or family member legally residing in Greece.', 'Присоединение к супругу или члену семьи с легальным статусом в Греции.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000045', 1, true),
  ('a0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000046', 2, true),
  ('a0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000047', 3, true),
  ('a0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000048', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'b0000000-0000-4000-8000-000000000045', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3500]}]}'),
  ('c0000000-0000-4000-8000-000000000049', 'b0000000-0000-4000-8000-000000000046', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{">=":[{"var":"passive_income_eur"},3500]},{">=":[{"var":"savings_eur"},84000]}]}]}'),
  ('c0000000-0000-4000-8000-000000000050', 'b0000000-0000-4000-8000-000000000047', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"willing_to_invest_eur"},250000]}]}'),
  ('c0000000-0000-4000-8000-000000000051', 'b0000000-0000-4000-8000-000000000048', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_gr"},"yes"]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'income', 'Minimum monthly net income', 'Мин. месячный net-доход', '€3 500/мес (+20% супруг, +15% ребёнок)', 1),
  ('c0000000-0000-4000-8000-000000000048', 'documents', 'Remote work only + Type D', 'Только удалёнка + Type D', 'No work for Greek employers/clients; national Type D visa at consulate before entry (Law 5275/2026)', 2),
  ('c0000000-0000-4000-8000-000000000048', 'insurance', 'Health insurance', 'Медстраховка', 'Private cover valid in Greece for the full stay (orient €30 000+)', 3),
  ('c0000000-0000-4000-8000-000000000049', 'income', 'Passive income', 'Пассивный доход', '€3 500/мес (+20%/+15%); remote salary ≠ FIP — use Digital Nomad', 1),
  ('c0000000-0000-4000-8000-000000000049', 'savings', 'Savings alternative', 'Альтернатива — сбережения', 'Practice orient €84 000–€126 000 for the permit term — verify your consulate', 2),
  ('c0000000-0000-4000-8000-000000000049', 'documents', 'No work in Greece', 'Без работы в Греции', 'Local employment and Greek clients prohibited; ≥183 days/year for renewals', 3),
  ('c0000000-0000-4000-8000-000000000050', 'min_investment_eur', 'Investment tiers', 'Пороги инвестиций', 'RE: €800k Zone A (Attica, Thessaloniki RU, Mykonos, Santorini, islands >3 100); €400k other regions; €250k conversion/heritage. Startup Elevate Greece: €250k (Type B.6 — separate rules)', 1),
  ('c0000000-0000-4000-8000-000000000050', 'documents', 'Property / startup rules', 'Правила объекта / стартапа', 'Single property min ~120 m² for standard RE tiers; short-term rental banned on GV properties; startup: Elevate Greece + job creation', 2),
  ('c0000000-0000-4000-8000-000000000050', 'timeline', 'Stay requirement', 'Проживание', 'No min stay to keep the card; citizenship needs real residence (~7 years)', 3),
  ('c0000000-0000-4000-8000-000000000051', 'family', 'Sponsor in Greece', 'Спонсор в Греции', 'Spouse, child or other family member with valid Greek residence', 1),
  ('c0000000-0000-4000-8000-000000000051', 'income', 'Maintenance', 'Содержание', 'Sponsor income and housing sufficient for dependants', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'National visa (Type D)', 'Национальная виза Type D', '~€75 (consulate; may vary)', 1),
  ('c0000000-0000-4000-8000-000000000048', 'Residence permit fee', 'Сбор residence permit', '~€1 000 main + ~€150 family (indicative) + card fee', 2),
  ('c0000000-0000-4000-8000-000000000049', 'National visa (Type D)', 'Национальная виза Type D', '~€75', 1),
  ('c0000000-0000-4000-8000-000000000049', 'Residence permit fee', 'Сбор residence permit', '~€1 000 + €16 electronic card (indicative)', 2),
  ('c0000000-0000-4000-8000-000000000050', 'Golden Visa state fees', 'Гос. сборы Golden Visa', '~€2 000–3 000 (classic RE route; startup Type B.6 may differ, e.g. ~€2 500)', 1),
  ('c0000000-0000-4000-8000-000000000050', 'Legal / notary / transfer tax', 'Юрист / нотариус / налог', 'Often €10 000–35 000+ depending on zone and object', 2),
  ('c0000000-0000-4000-8000-000000000051', 'Application fees', 'Сборы за подачу', 'Indicative consular + residence fees — verify migration.gov.gr', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'document_prep', 'Apostilles, translations, housing', 'Апостили, переводы, жильё', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000048', 'application', 'Consular Type D (digital nomad)', 'Консульская Type D (digital nomad)', '10 days–3 months', 2),
  ('c0000000-0000-4000-8000-000000000048', 'residence', 'Residence permit in Greece', 'Residence permit в Греции', 'Up to ~3 months after biometrics; card ~2 years', 3),
  ('c0000000-0000-4000-8000-000000000049', 'document_prep', 'Income / savings dossier', 'Досье дохода / сбережений', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000049', 'application', 'Consular Type D (FIP)', 'Консульская Type D (FIP)', 'Often ~10 days–few weeks if complete', 2),
  ('c0000000-0000-4000-8000-000000000049', 'residence', 'Residence permit (3 years)', 'Residence permit (3 года)', '~3 months to card; blue paper meanwhile', 3),
  ('c0000000-0000-4000-8000-000000000050', 'document_prep', 'Investment closing', 'Закрытие инвестиции', '1–3 months', 1),
  ('c0000000-0000-4000-8000-000000000050', 'application', 'Golden Visa / B.6 filing', 'Подача Golden Visa / B.6', 'Often 3–6 months (law target ~90 days for complete RE packs)', 2),
  ('c0000000-0000-4000-8000-000000000050', 'residence', '5-year card (or B.6 renewals)', 'Карта 5 лет (или продления B.6)', 'After approval; digital cards expanding under Law 5275/2026', 3),
  ('c0000000-0000-4000-8000-000000000051', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000051', 'application', 'Family reunification filing', 'Подача на воссоединение', '2–6 months', 2),
  ('c0000000-0000-4000-8000-000000000051', 'residence', 'Family residence card', 'Семейная карта', '2–8 weeks after decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'https://migration.gov.gr/', 'Digital nomad residence; Law 5275/2026 requires national Type D before in-country residence application.', '2026-07-28', 'Ministry of Migration — Greece', 'Минмиграции Греции'),
  ('c0000000-0000-4000-8000-000000000048', 'https://www.aade.gr/', 'Art. 5C income-tax reduction (50% for up to 7 years) for qualifying new tax residents — not the 7% pensioner flat rate.', '2026-07-28', 'AADE — tax', 'AADE — налоги'),
  ('c0000000-0000-4000-8000-000000000048', 'https://www.mfa.gr/en/visas/', 'National visas issued by Greek consular authorities.', '2026-07-28', 'MFA Greece — visas', 'МИД Греции — визы'),
  ('c0000000-0000-4000-8000-000000000049', 'https://migration.gov.gr/', 'Financially independent person residence category — passive means, no local work.', '2026-07-28', 'Ministry of Migration — FIP', 'Минмиграции — FIP'),
  ('c0000000-0000-4000-8000-000000000049', 'https://www.mfa.gr/en/visas/', 'Consular Type D for financially independent applicants.', '2026-07-28', 'MFA Greece — visas', 'МИД Греции — визы'),
  ('c0000000-0000-4000-8000-000000000050', 'https://www.enterprisegreece.gov.gr/', 'Investor residence (Golden Visa) zoning and qualifying investments.', '2026-07-28', 'Enterprise Greece', 'Enterprise Greece'),
  ('c0000000-0000-4000-8000-000000000050', 'https://migration.gov.gr/', 'Investor residence permits; Law 5100/2024 thresholds; Law 5275/2026 procedural updates.', '2026-07-28', 'Ministry of Migration — investor', 'Минмиграции — инвестор'),
  ('c0000000-0000-4000-8000-000000000051', 'https://migration.gov.gr/', 'Family reunification for dependants of legal residents.', '2026-07-28', 'Ministry of Migration — family', 'Минмиграции — семья')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000048', 'RU', 'eligible', 'Digital nomad route open; apply Type D at Greek consulate of residence jurisdiction', 'Digital Nomad доступен; Type D в греческом консульстве вашей юрисдикции'),
  ('c0000000-0000-4000-8000-000000000048', 'BY', 'partial', 'Possible; verify consulate jurisdiction and income trail', 'Возможно; проверьте консульскую юрисдикцию и след дохода'),
  ('c0000000-0000-4000-8000-000000000048', 'UA', 'partial', 'Possible; compare with temporary protection if eligible', 'Возможно; сравните с temporary protection при наличии права'),
  ('c0000000-0000-4000-8000-000000000048', 'KZ', 'partial', 'Possible with documented remote income', 'Возможно при подтверждённом удалённом доходе'),
  ('c0000000-0000-4000-8000-000000000049', 'RU', 'eligible', 'FIP for passive income / savings; local work prohibited', 'FIP при пассивном доходе/сбережениях; работа в GR запрещена'),
  ('c0000000-0000-4000-8000-000000000049', 'BY', 'partial', 'Subject to consulate and means of support proof', 'Зависит от консульства и подтверждения средств'),
  ('c0000000-0000-4000-8000-000000000049', 'UA', 'partial', 'Compare with TP / other EU routes', 'Сравните с TP и другими маршрутами ЕС'),
  ('c0000000-0000-4000-8000-000000000049', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000050', 'RU', 'eligible', 'Golden Visa / investor routes open to non-EU nationals including RU', 'Golden Visa / инвесторские маршруты открыты для non-EU, включая RU'),
  ('c0000000-0000-4000-8000-000000000050', 'BY', 'eligible', 'Investor route open; source-of-funds scrutiny applies', 'Инвесторский маршрут открыт; проверяют источник средств'),
  ('c0000000-0000-4000-8000-000000000050', 'UA', 'eligible', 'Investor route open', 'Инвесторский маршрут открыт'),
  ('c0000000-0000-4000-8000-000000000050', 'KZ', 'eligible', 'Investor route open', 'Инвесторский маршрут открыт'),
  ('c0000000-0000-4000-8000-000000000051', 'RU', 'eligible', 'Family reunification for dependants of Greek residents', 'Воссоединение с резидентами Греции'),
  ('c0000000-0000-4000-8000-000000000051', 'BY', 'partial', 'Depends on sponsor status and housing', 'Зависит от статуса спонсора и жилья'),
  ('c0000000-0000-4000-8000-000000000051', 'UA', 'partial', 'Family route available; TP may be faster if eligible', 'Семейный маршрут доступен; TP может быть быстрее'),
  ('c0000000-0000-4000-8000-000000000051', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000011', 'practical', 'Law 5275/2026 — DN consular only', 'Law 5275/2026 — DN только через консульство', 'From Feb 2026 digital nomad residence applications require a national Type D visa before entry; tourist→in-country filing closed.', 'С февраля 2026 подача Digital Nomad только после Type D в консульстве; схема «турист → на месте» закрыта.', 'https://migration.gov.gr/', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000011', 'tax', '50% nomad tax vs 7% pensioners', '50% для nomads vs 7% для пенсионеров', 'Remote workers may claim 50% income-tax reduction for up to 7 years (AADE). Flat 7% applies to foreign pensions — not digital nomads.', 'Удалёнщики: 50% скидка на подоходный до 7 лет (AADE). Плоские 7% — для иностранных пенсий, не для nomads.', 'https://www.aade.gr/', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000011', 'citizenship', 'Naturalization ~7 years', 'Натурализация ~7 лет', 'Standard naturalization orient 7 years legal residence with language/civics exam; Golden Visa does not shorten the clock without real stay.', 'Ориентир 7 лет легального проживания + язык/civics; Golden Visa не ускоряет паспорт без реального проживания.', 'https://migration.gov.gr/', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000011', 'practical', 'AFM before banking/rent', 'AFM до банка и аренды', 'Greek tax number (AFM) is required for leases and bank accounts; can be obtained via tax representative before arrival.', 'Налоговый номер AFM нужен для аренды и счёта; можно оформить через представителя до приезда.', 'https://www.aade.gr/', '2026-07-28', 4),
  ('a0000000-0000-4000-8000-000000000011', 'investment', 'Golden Visa zones 2026', 'Зоны Golden Visa 2026', '€800k Attica/Thessaloniki RU/Mykonos/Santorini/islands >3 100; €400k other regions; €250k conversion/heritage or Elevate Greece startup (B.6).', '€800k Аттика/Салоники/Миконос/Санторини/острова >3 100; €400k остальные регионы; €250k конверсия/heritage или стартап Elevate Greece (B.6).', 'https://www.enterprisegreece.gov.gr/', '2026-07-28', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000011', 'greece-routes', 'Greece route finder', 'Подбор маршрута — Греция')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000046', 'd0000000-0000-4000-8000-000000000011', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000047', 'd0000000-0000-4000-8000-000000000011', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000048', 'd0000000-0000-4000-8000-000000000011', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000049', 'd0000000-0000-4000-8000-000000000011', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000046', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000047', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Greece', 'Зарплата или фриланс от работодателей/клиентов вне Греции', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000047', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', 'Digital Nomad threshold €3 500 solo (+20%/+15% family)', 'Порог Digital Nomad €3 500 соло (+20%/+15% семья)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000047', 'has_job_offer', 'single', 'Signed job offer in Greece?', 'Подписанный оффер работы в Греции?', 'Local employment is a different route — not Digital Nomad/FIP', 'Локальная работа — другой маршрут, не Digital Nomad/FIP', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000047', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000048', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not remote salary (use Digital Nomad)', 'Пенсии, аренда, дивиденды — не зарплата удалёнки (для неё Digital Nomad)', NULL, 1),
  ('e0000000-0000-4000-8000-000000000048', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'FIP alternative to monthly passive income', 'Альтернатива месячному пассивному доходу для FIP', NULL, 2),
  ('e0000000-0000-4000-8000-000000000048', 'willing_to_invest_eur', 'number', 'Capital for Golden Visa (EUR)', 'Капитал для Golden Visa (EUR)', 'RE zones €250k–€800k or Elevate Greece startup €250k', 'Зоны недвижимости €250k–€800k или стартап Elevate Greece €250k', NULL, 3),
  ('e0000000-0000-4000-8000-000000000048', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4),
  ('e0000000-0000-4000-8000-000000000049', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000049', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода DN/FIP', NULL, 2),
  ('e0000000-0000-4000-8000-000000000049', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Взрослые родственники — часто отдельное воссоединение / Golden Visa parents', NULL, 3),
  ('e0000000-0000-4000-8000-000000000049', 'has_family_in_gr', 'single', 'Family member legally in Greece?', 'Член семьи уже легально в Греции?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'greece', 'greece', 'Греция', 'Greece', '🇬🇷',
  'русскоязычные, планирующие ВНЖ в Греции (digital nomad, FIP, Golden Visa)',
  'Digital Nomad Law 5275/2026, FIP, Golden Visa зоны, AFM, AADE 50%, Elevate Greece',
  'ru-speaking-to-greece', 'active',
  ARRAY['Греция ВНЖ','Digital Nomad Греция','FIP Греция','Golden Visa Греция','релокация в Грецию','русскоязычные'],
  ARRAY['Greece digital nomad visa Law 5275','Greece Golden Visa investment thresholds','Greece FIP residence permit','Greece immigration residence permit','Греция ВНЖ digital nomad','Greece AADE tax residency'],
  '{"landing":"/ru/greece","wizard":"/ru/greece/wizard","guide":"/ru/guides/vnj-gretsiya-2026-digital-nomad-fip-golden-visa"}'::jsonb,
  11
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-greece');
