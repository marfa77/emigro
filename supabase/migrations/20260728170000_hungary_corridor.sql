-- Hungary corridor seed (ru-speaking-to-hungary, 2026 thresholds)
-- White Card (digital nomad), Guest Investor, family reunification
-- Note: White Card does NOT allow family reunification (OIF) — family program is for other sponsors

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('HU', 'Hungary', 'Венгрия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000013',
  'ru-speaking-to-hungary',
  'Russian-speaking → Hungary',
  'Русскоязычные → Венгрия',
  'Relocation navigator for Russian-speaking applicants targeting Hungary residency routes (White Card digital nomad, Guest Investor).',
  'Навигатор релокации для русскоязычных: White Card (digital nomad) и Guest Investor в Венгрии.',
  'RU',
  'hungary',
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
  ('a0000000-0000-4000-8000-000000000013', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000013', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000013', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000013', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000013', 'HU')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000052', 'hungary-white-card', 'HU', 'LABOR', 'Hungary White Card (Digital Nomad)', 'Венгрия — White Card (Digital Nomad)', 'Residence for remote workers with foreign net income ≥ €3 000/month (6 months evidence). Max 1+1 years. No family reunification, no national residence card, cannot switch to another residence purpose (OIF). In-country filing only for visa-free nationals.', 'ВНЖ для удалёнщиков с зарубежным net-доходом ≥ €3 000/мес (доказательства 6 мес.). Макс. 1+1 год. Нет family reunification, нет national residence card, нельзя сменить purpose (OIF). Подача изнутри — только visa-free.'),
  ('b0000000-0000-4000-8000-000000000053', 'hungary-guest-investor', 'HU', 'CAPITAL', 'Hungary Guest Investor', 'Венгрия — Guest Investor', '10-year renewable residence via €250 000 MNB real-estate fund share (hold ≥5 years, ≥40% residential HU) or €1 000 000 higher-education donation. Work allowed. Direct property purchase no longer qualifies (from 2025).', 'Карта до 10+10 лет: фонд MNB от €250 000 (hold ≥5 лет, ≥40% жилой недвижимости HU) или донейшн €1 000 000 вузу. Работа разрешена. Прямая покупка жилья с 2025 не квалифицирует.'),
  ('b0000000-0000-4000-8000-000000000054', 'hungary-family-reunification', 'HU', 'BOND', 'Hungary Family Reunification', 'Венгрия — воссоединение семьи', 'Join a spouse or family member with a qualifying Hungarian residence. White Card holders cannot sponsor family reunification (OIF).', 'Присоединение к супругу или члену семьи с подходящим венгерским ВНЖ. Держатели White Card не могут спонсировать family reunification (OIF).')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000052', 1, true),
  ('a0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000053', 2, true),
  ('a0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000054', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'b0000000-0000-4000-8000-000000000052', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3000]}]}'),
  ('c0000000-0000-4000-8000-000000000056', 'b0000000-0000-4000-8000-000000000053', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"willing_to_invest_eur"},250000]}]}'),
  ('c0000000-0000-4000-8000-000000000057', 'b0000000-0000-4000-8000-000000000054', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_hu"},"yes"]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'income', 'Minimum monthly net income', 'Мин. месячный net-доход', '€3 000/мес net for ≥6 months before entry and throughout stay (OIF)', 1),
  ('c0000000-0000-4000-8000-000000000055', 'documents', 'Remote work only + dead-end track', 'Только удалёнка + тупиковый трек', 'No HU employer/shareholding; no family reunification; no national residence card; cannot apply for another residence purpose during/after White Card (OIF)', 2),
  ('c0000000-0000-4000-8000-000000000055', 'insurance', 'Health insurance', 'Медстраховка', 'Comprehensive health cover / ability to pay healthcare costs in Hungary', 3),
  ('c0000000-0000-4000-8000-000000000055', 'timeline', 'Maximum stay', 'Макс. срок', 'Up to 1 year + one extension of 1 year; extension needs ≥90 days presence in any 180-day window', 4),
  ('c0000000-0000-4000-8000-000000000056', 'min_investment_eur', 'Investment options', 'Варианты инвестиций', '€250 000 MNB RE fund share (hold ≥5y, ≥40% residential HU) OR €1 000 000 donation to qualifying higher-ed public trust. Direct home purchase does not qualify (from 2025)', 1),
  ('c0000000-0000-4000-8000-000000000056', 'documents', 'Work allowed', 'Работа разрешена', 'Guest investor may work and run a business in Hungary without the White Card remote-only limits (OIF)', 2),
  ('c0000000-0000-4000-8000-000000000056', 'timeline', 'Card validity', 'Срок карты', 'Up to 10 years, extendable once for another 10 years if investment still held (donation: extend without new investment)', 3),
  ('c0000000-0000-4000-8000-000000000057', 'family', 'Sponsor in Hungary', 'Спонсор в Венгрии', 'Spouse/child of a qualifying resident — White Card sponsors are excluded from family reunification (OIF)', 1),
  ('c0000000-0000-4000-8000-000000000057', 'income', 'Maintenance', 'Содержание', 'Sponsor income and housing sufficient for dependants', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'Admin fee', 'Админ. сбор', 'Often ~HUF 24 000 (Enter Hungary) or ~€110 at consulate — verify OIF fee schedule', 1),
  ('c0000000-0000-4000-8000-000000000055', 'Lawyer (optional)', 'Юрист (опционально)', 'Often €500–1 500+', 2),
  ('c0000000-0000-4000-8000-000000000056', 'Investment', 'Инвестиция', '€250 000 fund or €1 000 000 donation', 1),
  ('c0000000-0000-4000-8000-000000000056', 'Program / legal / brokerage', 'Программа / юрист / brokerage', 'Commercial packs often cite €25k admin + family fees + brokerage — verify contracts and OIF fees', 2),
  ('c0000000-0000-4000-8000-000000000057', 'Application fees', 'Сборы за подачу', 'Indicative OIF / Enter Hungary fees — verify oif.gov.hu', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'document_prep', 'Remote work letter, 6-month bank statements, housing', 'Письмо remote, выписки 6 мес., жильё', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000055', 'application', 'Consulate (typical RU/BY) or Enter Hungary if visa-free', 'Консульство (типично RU/BY) или Enter Hungary если visa-free', 'Official procedural ~21–30 days (+ biometrics within 15 days of e-file)', 2),
  ('c0000000-0000-4000-8000-000000000055', 'residence', 'Card up to 1 year; one renewal', 'Карта до 1 года; одно продление', 'After approval; D entry visa window if filed abroad', 3),
  ('c0000000-0000-4000-8000-000000000056', 'document_prep', 'Fund / donation + due diligence', 'Фонд / донейшн + due diligence', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000056', 'application', 'Guest investor visa then residence in HU', 'Guest investor visa → residence в HU', 'Visa ~weeks; residence file only in Hungary after entry; investment proof within visa / 6 months visa-free', 2),
  ('c0000000-0000-4000-8000-000000000056', 'residence', '10-year card (postal)', 'Карта 10 лет (почта)', 'Biometrics within 15 days of Enter Hungary submission', 3),
  ('c0000000-0000-4000-8000-000000000057', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000057', 'application', 'Family reunification filing', 'Подача на воссоединение', '2–6 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000057', 'residence', 'Family residence card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'https://oif.gov.hu/factsheets/white-card-residency-for-digital-nomads', 'White Card: €3 000 net/month ≥6 months; 1+1 years; no family reunification; no national residence card; cannot apply for other purpose during/after; in-country filing for visa-free nationals.', '2026-07-28', 'OIF — White Card', 'OIF — White Card'),
  ('c0000000-0000-4000-8000-000000000055', 'https://enterhungary.gov.hu/', 'Electronic filing platform; biometrics within 15 days for application to be deemed received.', '2026-07-28', 'Enter Hungary', 'Enter Hungary'),
  ('c0000000-0000-4000-8000-000000000056', 'https://oif.gov.hu/factsheets/residence-permit-for-guest-investor', 'Guest investor: €250k MNB fund or €1M donation; 10+10 years; work allowed; residence application in Hungary only.', '2026-07-28', 'OIF — Guest Investor', 'OIF — Guest Investor'),
  ('c0000000-0000-4000-8000-000000000057', 'https://oif.gov.hu/factsheets/residence-permit-for-the-purpose-of-family-reunification', 'Family reunification excluded when sponsor holds a White Card.', '2026-07-28', 'OIF — family reunification', 'OIF — воссоединение семьи')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000055', 'RU', 'eligible', 'White Card open; typically consular filing (not visa-free in-country)', 'White Card доступен; обычно консульская подача (не visa-free in-country)'),
  ('c0000000-0000-4000-8000-000000000055', 'BY', 'partial', 'Possible; verify consulate jurisdiction', 'Возможно; проверьте консульскую юрисдикцию'),
  ('c0000000-0000-4000-8000-000000000055', 'UA', 'partial', 'Possible; compare visa-free status for in-country filing', 'Возможно; сравните visa-free статус для подачи изнутри'),
  ('c0000000-0000-4000-8000-000000000055', 'KZ', 'partial', 'Possible with documented remote income', 'Возможно при подтверждённом удалённом доходе'),
  ('c0000000-0000-4000-8000-000000000056', 'RU', 'eligible', 'Guest Investor open with source-of-funds scrutiny', 'Guest Investor доступен; проверяют источник средств'),
  ('c0000000-0000-4000-8000-000000000056', 'BY', 'eligible', 'Investor route open; AML/KYC applies', 'Инвесторский маршрут открыт; AML/KYC'),
  ('c0000000-0000-4000-8000-000000000056', 'UA', 'eligible', 'Investor route open', 'Инвесторский маршрут открыт'),
  ('c0000000-0000-4000-8000-000000000056', 'KZ', 'eligible', 'Investor route open', 'Инвесторский маршрут открыт'),
  ('c0000000-0000-4000-8000-000000000057', 'RU', 'partial', 'Only if sponsor is NOT on White Card', 'Только если спонсор НЕ на White Card'),
  ('c0000000-0000-4000-8000-000000000057', 'BY', 'partial', 'Depends on sponsor category', 'Зависит от категории спонсора'),
  ('c0000000-0000-4000-8000-000000000057', 'UA', 'partial', 'Depends on sponsor category', 'Зависит от категории спонсора'),
  ('c0000000-0000-4000-8000-000000000057', 'KZ', 'partial', 'Depends on sponsor category', 'Зависит от категории спонсора')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000013', 'practical', 'White Card is a dead-end track', 'White Card — тупиковый трек', 'OIF: no family reunification, no national residence card, and no application for another residence purpose during or after White Card.', 'OIF: нет family reunification, нет national residence card и нельзя подать на другую цель residence во время/после White Card.', 'https://oif.gov.hu/factsheets/white-card-residency-for-digital-nomads', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000013', 'practical', 'In-country filing = visa-free only', 'Подача изнутри = только visa-free', 'First White Card application inside Hungary is for visa-free nationals. Most RU/BY applicants use a Hungarian consulate abroad.', 'Первая подача White Card внутри HU — для visa-free. Большинство RU/BY подают в консульстве за рубежом.', 'https://oif.gov.hu/factsheets/white-card-residency-for-digital-nomads', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000013', 'investment', 'Guest Investor: fund or €1M donation', 'Guest Investor: фонд или €1M донейшн', '€250k MNB RE fund (≥5y hold, ≥40% residential HU) or €1M higher-ed donation. Direct home purchase no longer qualifies. Work is allowed.', '€250k фонд MNB (≥5 лет, ≥40% жилой HU) или €1M донейшн вузу. Прямая покупка жилья не квалифицирует. Работа разрешена.', 'https://oif.gov.hu/factsheets/residence-permit-for-guest-investor', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000013', 'tax', '15% flat PIT (orient)', '15% flat PIT (ориентир)', 'Hungary personal income tax is a flat 15% for residents — model worldwide income carefully if you hit 183 days / centre of interests.', 'Подоходный налог — плоские 15% для резидентов; при 183 днях / центре интересов считайте мировой доход с бухгалтером.', 'https://nav.gov.hu/', '2026-07-28', 4),
  ('a0000000-0000-4000-8000-000000000013', 'practical', 'Enter Hungary biometrics in 15 days', 'Enter Hungary: биометрия за 15 дней', 'E-filed applications are deemed received only after fee payment and biometrics/signature within 15 days.', 'E-заявление считается принятым только после оплаты и биометрии/подписи в течение 15 дней.', 'https://enterhungary.gov.hu/', '2026-07-28', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000013', 'hungary-routes', 'Hungary route finder', 'Подбор маршрута — Венгрия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000054', 'd0000000-0000-4000-8000-000000000013', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000055', 'd0000000-0000-4000-8000-000000000013', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000056', 'd0000000-0000-4000-8000-000000000013', 'capital', 'Investment', 'Инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000057', 'd0000000-0000-4000-8000-000000000013', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000054', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000055', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Hungary', 'Зарплата или фриланс от работодателей/клиентов вне Венгрии', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000055', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', 'White Card threshold €3 000 net (6 months evidence)', 'Порог White Card €3 000 net (доказательства 6 мес.)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000055', 'has_job_offer', 'single', 'Signed job offer in Hungary?', 'Подписанный оффер работы в Венгрии?', 'Local employment is a different route — not White Card', 'Локальная работа — другой маршрут, не White Card', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000055', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000056', 'willing_to_invest_eur', 'number', 'Capital for Guest Investor (EUR)', 'Капитал для Guest Investor (EUR)', 'Fund route from €250 000 or donation €1 000 000', 'Фонд от €250 000 или донейшн €1 000 000', NULL, 1),
  ('e0000000-0000-4000-8000-000000000056', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Optional buffer; not an official White Card OIF threshold', 'Опциональная подушка; не официальный порог White Card в OIF', NULL, 2),
  ('e0000000-0000-4000-8000-000000000056', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000057', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', 'White Card cannot sponsor spouse — use Guest Investor or other status', 'White Card не спонсирует супруга — Guest Investor или другой статус', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000057', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', 'White Card has no family reunification (except child born in HU)', 'У White Card нет family reunification (кроме ребёнка, рождённого в HU)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000057', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто', NULL, 3),
  ('e0000000-0000-4000-8000-000000000057', 'has_family_in_hu', 'single', 'Family member legally in Hungary (not White Card)?', 'Член семьи уже легально в Венгрии (не White Card)?', 'Sponsor must be a category that allows family reunification', 'Спонсор должен быть в категории, допускающей воссоединение', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'hungary', 'hungary', 'Венгрия', 'Hungary', '🇭🇺',
  'русскоязычные, планирующие ВНЖ в Венгрии (White Card, Guest Investor)',
  'White Card €3000, dead-end track, Guest Investor €250k fund, Enter Hungary, OIF, 15% PIT',
  'ru-speaking-to-hungary', 'active',
  ARRAY['Венгрия ВНЖ','White Card Венгрия','Guest Investor Венгрия','Digital Nomad Венгрия','релокация в Венгрию','русскоязычные'],
  ARRAY['Hungary White Card digital nomad','Hungary Guest Investor residence permit','Hungary OIF Enter Hungary','Венгрия White Card','Hungary Golden Visa fund 250000'],
  '{"landing":"/ru/hungary","wizard":"/ru/hungary/wizard","guide":"/ru/guides/vnj-vengriya-2026-white-card-guest-investor"}'::jsonb,
  13
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-hungary');
