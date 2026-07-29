-- Malta corridor seed (ru-speaking-to-malta, 2026 thresholds)
-- NRP (digital nomad — RU/BY ineligible), MPRP (permanent residence by investment), family
-- Non-Dom is tax-only (digest), not a residence program

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('MT', 'Malta', 'Мальта')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000014',
  'ru-speaking-to-malta',
  'Russian-speaking → Malta',
  'Русскоязычные → Мальта',
  'Relocation navigator for Russian-speaking applicants targeting Malta (Nomad Residence Permit, MPRP). NRP is currently closed to RU/BY passports.',
  'Навигатор релокации: Nomad Residence Permit и MPRP. NRP сейчас закрыт для паспортов РФ/BY.',
  'RU',
  'malta',
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
  ('a0000000-0000-4000-8000-000000000014', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000014', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000014', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000014', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000014', 'MT')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000055', 'malta-nrp', 'MT', 'LABOR', 'Malta Nomad Residence Permit', 'Мальта — Nomad Residence Permit (NRP)', 'Remote work for non-Maltese employers/clients. Gross income ≥ €42 000/year + guaranteed income for ≥5 months. Card 1 year, renew up to max ~4 years. Applications from RU and BY currently not eligible (Residency Malta).', 'Удалёнка на работодателей/клиентов вне Мальты. Gross ≥ €42 000/год + гарантированный доход ≥5 мес. Карта 1 год, продление до макс. ~4 лет. Заявки от РФ и BY сейчас не принимают (Residency Malta).'),
  ('b0000000-0000-4000-8000-000000000056', 'malta-mprp', 'MT', 'CAPITAL', 'Malta Permanent Residence Programme (MPRP)', 'Мальта — MPRP', 'Immediate permanent residence. Assets €500k (€150k liquid) or €650k (€75k liquid) + rent ≥ €14k/year or purchase ≥ €375k + admin €60k + contribution €37k + donation €2k (L.N. 146/2025). No minimum stay for MPRP status; citizenship is a separate naturalisation track.', 'Сразу permanent residence. Активы €500k (€150k ликвид) или €650k (€75k ликвид) + аренда ≥ €14k/год или покупка ≥ €375k + admin €60k + contribution €37k + donation €2k (L.N. 146/2025). Нет минимума дней для статуса MPRP; паспорт — отдельная натурализация.'),
  ('b0000000-0000-4000-8000-000000000057', 'malta-family-reunification', 'MT', 'BOND', 'Malta Family Reunification', 'Мальта — воссоединение семьи', 'Join a spouse or family member with a qualifying Maltese residence (NRP or MPRP dependants follow programme rules).', 'Присоединение к супругу или члену семьи с подходящим мальтийским ВНЖ (dependants NRP/MPRP — по правилам программы).')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000055', 1, true),
  ('a0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000056', 2, true),
  ('a0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000057', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'b0000000-0000-4000-8000-000000000055', '2026-07', '{"and":[{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3500]}]}'),
  ('c0000000-0000-4000-8000-000000000059', 'b0000000-0000-4000-8000-000000000056', '2026-07', '{"or":[{">=":[{"var":"savings_eur"},500000]},{">=":[{"var":"willing_to_invest_eur"},177000]}]}'),
  ('c0000000-0000-4000-8000-000000000060', 'b0000000-0000-4000-8000-000000000057', '2026-07', '{"==":[{"var":"has_family_in_mt"},"yes"]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'income', 'Minimum gross annual income', 'Мин. годовой gross-доход', '€42 000/year + guaranteed income for ≥5 months from application date (Residency Malta)', 1),
  ('c0000000-0000-4000-8000-000000000058', 'documents', 'Remote only + nationality limits', 'Только удалёнка + лимиты по гражданству', 'No work for Malta-based employers. RU and BY applications currently not eligible. Max stay ~4 years (1+3 renewals).', 2),
  ('c0000000-0000-4000-8000-000000000058', 'insurance', 'Health insurance', 'Медстраховка', 'Valid in Malta for full permit year; Agency publishes minimum benefits table', 3),
  ('c0000000-0000-4000-8000-000000000058', 'timeline', 'Maximum stay', 'Макс. срок', '1 year card; renew up to three times → max ~4 years; renewal needs ≥5 months Malta presence evidence', 4),
  ('c0000000-0000-4000-8000-000000000059', 'min_investment_eur', 'Property + fees + assets', 'Недвижимость + сборы + активы', 'Rent ≥ €14 000/year or buy ≥ €375 000 (hold ≥5y) + admin €60 000 + contribution €37 000 + donation €2 000; assets €500k (€150k liquid) or €650k (€75k liquid)', 1),
  ('c0000000-0000-4000-8000-000000000059', 'documents', 'Licensed agent + due diligence', 'Лицензированный агент + DD', 'File via Residency Malta licensed agent; temporary residence may be available during full DD (L.N. 146/2025)', 2),
  ('c0000000-0000-4000-8000-000000000059', 'timeline', 'Card validity', 'Срок карты', 'Permanent residence; card typically 5 years renewable; annual compliance first 5 years', 3),
  ('c0000000-0000-4000-8000-000000000060', 'family', 'Sponsor in Malta', 'Спонсор на Мальте', 'Spouse/child of a qualifying resident or citizen — check NRP/MPRP dependant rules', 1),
  ('c0000000-0000-4000-8000-000000000060', 'income', 'Maintenance', 'Содержание', 'Sponsor income and housing sufficient for dependants', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'Agency fee', 'Сбор Agency', '€300 non-refundable per person + €100 residency card (Identità)', 1),
  ('c0000000-0000-4000-8000-000000000058', 'Lawyer / agent (optional)', 'Юрист / агент (опционально)', 'Often €1 000–2 500+', 2),
  ('c0000000-0000-4000-8000-000000000059', 'Government fees', 'Гос. сборы', '€60 000 admin + €37 000 contribution + €2 000 donation (+ €7 500 some adult dependants)', 1),
  ('c0000000-0000-4000-8000-000000000059', 'Property (5y rent or purchase)', 'Недвижимость (5 лет аренды или покупка)', '≥ €70 000 rent total or ≥ €375 000 purchase (+ stamp duty on buy)', 2),
  ('c0000000-0000-4000-8000-000000000060', 'Application fees', 'Сборы за подачу', 'Per Residency Malta / Identità schedule — verify residencymalta.gov.mt', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'document_prep', 'Income, remote contracts, housing, insurance', 'Доход, remote-контракты, жильё, страховка', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000058', 'application', 'Online file + due diligence', 'Онлайн-подача + due diligence', 'Often ~weeks–2 months (market orient; Agency discretionary)', 2),
  ('c0000000-0000-4000-8000-000000000058', 'residence', 'Biometrics in Malta + card', 'Биометрия на Мальте + карта', 'Card often 3–4 weeks after biometrics; pick up in person', 3),
  ('c0000000-0000-4000-8000-000000000059', 'document_prep', 'Agent DD + source of funds', 'DD агента + источник средств', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000059', 'application', 'Full Agency due diligence', 'Полный due diligence Agency', 'Often 3–6+ months', 2),
  ('c0000000-0000-4000-8000-000000000059', 'residence', 'Invest after Approval in Principle + cards', 'Инвестиция после Approval in Principle + карты', 'Contribution/property within 8 months of AIP; cards ~weeks after biometrics', 3),
  ('c0000000-0000-4000-8000-000000000060', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000060', 'application', 'Family / dependant filing', 'Подача семьи / dependants', '2–6 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000060', 'residence', 'Family residence card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'https://nomad.residencymalta.gov.mt/topic/eligibility/', 'NRP: €42k gross/year; RU/BY currently not eligible; remote work categories.', '2026-07-28', 'Residency Malta — NRP eligibility', 'Residency Malta — NRP eligibility'),
  ('c0000000-0000-4000-8000-000000000058', 'https://nomad.residencymalta.gov.mt/new-faqs/', 'Fees €300/person + €100 card; renew max 4 years; renewal ≥5 months presence.', '2026-07-28', 'Residency Malta — NRP FAQs', 'Residency Malta — NRP FAQs'),
  ('c0000000-0000-4000-8000-000000000059', 'https://residencymalta.gov.mt/wp-content/uploads/2025/07/L.N-146-of-2025.pdf', 'L.N. 146/2025: admin €60k; contribution €37k unified rent/purchase.', '2026-07-28', 'L.N. 146 of 2025', 'L.N. 146 of 2025'),
  ('c0000000-0000-4000-8000-000000000059', 'https://residencymalta.gov.mt/', 'MPRP administered by Residency Malta Agency via licensed agents.', '2026-07-28', 'Residency Malta Agency', 'Residency Malta Agency'),
  ('c0000000-0000-4000-8000-000000000060', 'https://residencymalta.gov.mt/', 'Family / dependant rules under NRP and MPRP programme documentation.', '2026-07-28', 'Residency Malta — family', 'Residency Malta — семья')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000058', 'RU', 'ineligible', 'Residency Malta: applications from the Russian Federation currently not eligible', 'Residency Malta: заявки от РФ сейчас не принимают'),
  ('c0000000-0000-4000-8000-000000000058', 'BY', 'ineligible', 'Residency Malta: applications from Belarus currently not eligible', 'Residency Malta: заявки от BY сейчас не принимают'),
  ('c0000000-0000-4000-8000-000000000058', 'UA', 'eligible', 'NRP open if income and remote criteria met', 'NRP доступен при доходе и remote-критериях'),
  ('c0000000-0000-4000-8000-000000000058', 'KZ', 'eligible', 'NRP open if income and remote criteria met', 'NRP доступен при доходе и remote-критериях'),
  ('c0000000-0000-4000-8000-000000000059', 'RU', 'eligible', 'MPRP open; strict due diligence and source of funds', 'MPRP доступен; строгий DD и источник средств'),
  ('c0000000-0000-4000-8000-000000000059', 'BY', 'eligible', 'MPRP open; AML/KYC applies', 'MPRP доступен; AML/KYC'),
  ('c0000000-0000-4000-8000-000000000059', 'UA', 'eligible', 'MPRP open', 'MPRP доступен'),
  ('c0000000-0000-4000-8000-000000000059', 'KZ', 'eligible', 'MPRP open', 'MPRP доступен'),
  ('c0000000-0000-4000-8000-000000000060', 'RU', 'partial', 'Depends on sponsor status and programme', 'Зависит от статуса спонсора и программы'),
  ('c0000000-0000-4000-8000-000000000060', 'BY', 'partial', 'Depends on sponsor status and programme', 'Зависит от статуса спонсора и программы'),
  ('c0000000-0000-4000-8000-000000000060', 'UA', 'partial', 'Depends on sponsor status and programme', 'Зависит от статуса спонсора и программы'),
  ('c0000000-0000-4000-8000-000000000060', 'KZ', 'partial', 'Depends on sponsor status and programme', 'Зависит от статуса спонсора и программы')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000014', 'practical', 'NRP closed for RU/BY', 'NRP закрыт для РФ/BY', 'Residency Malta currently rejects Nomad Residence Permit applications from Russia and Belarus. Use MPRP or another country for DN.', 'Residency Malta сейчас отклоняет NRP от РФ и Беларуси. Для DN — MPRP или другая страна.', 'https://nomad.residencymalta.gov.mt/topic/eligibility/', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000014', 'practical', 'NRP renewal needs 5 months in Malta', 'Продление NRP: 5 месяцев на Мальте', 'Renewal requires bank evidence of ≥5 months cumulative presence in Malta over the previous 12 months.', 'Для renewal нужны банковские доказательства ≥5 месяцев присутствия на Мальте за предыдущие 12 месяцев.', 'https://nomad.residencymalta.gov.mt/new-faqs/', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000014', 'investment', 'MPRP unified €37k contribution', 'MPRP: единый contribution €37k', 'L.N. 146/2025: €37 000 contribution whether you rent or buy; admin €60 000 (€15k + €45k).', 'L.N. 146/2025: contribution €37 000 и при аренде, и при покупке; admin €60 000 (€15k + €45k).', 'https://residencymalta.gov.mt/wp-content/uploads/2025/07/L.N-146-of-2025.pdf', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000014', 'tax', 'Non-Dom ≠ residence permit', 'Non-Dom ≠ ВНЖ', 'Remittance-basis non-dom is a tax status after tax residence — not issued with NRP/MPRP automatically.', 'Non-dom на remittance basis — налоговый статус после налогового резидентства, не выдаётся автоматом с NRP/MPRP.', 'https://cfr.gov.mt/', '2026-07-28', 4),
  ('a0000000-0000-4000-8000-000000000014', 'practical', 'MPRP ≠ passport in 5 years without days', 'MPRP ≠ паспорт за 5 лет без дней', 'Permanent residence has no minimum stay; naturalisation still needs real residence years, language, and character checks.', 'У permanent residence нет минимума дней; натурализация всё равно требует годы реального проживания, язык и good character.', 'https://residencymalta.gov.mt/', '2026-07-28', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000014', 'malta-routes', 'Malta route finder', 'Подбор маршрута — Мальта')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000058', 'd0000000-0000-4000-8000-000000000014', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000059', 'd0000000-0000-4000-8000-000000000014', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000060', 'd0000000-0000-4000-8000-000000000014', 'capital', 'Investment', 'Инвестиции', 3),
  ('e0000000-0000-4000-8000-000000000061', 'd0000000-0000-4000-8000-000000000014', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000058', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with — NRP is closed for RU/BY', 'Паспорт для подачи — NRP закрыт для РФ/BY', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000059', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Malta', 'Зарплата или фриланс от работодателей/клиентов вне Мальты', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000059', 'monthly_income_eur', 'number', 'Monthly gross income (EUR)', 'Месячный gross-доход (EUR)', 'NRP threshold ≈ €3 500/month (€42 000/year gross)', 'Порог NRP ≈ €3 500/мес (€42 000/год gross)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000059', 'has_job_offer', 'single', 'Signed job offer in Malta?', 'Подписанный оффер работы на Мальте?', 'Local employment needs a different route — not NRP', 'Локальная работа — другой маршрут, не NRP', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000059', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000060', 'willing_to_invest_eur', 'number', 'Capital for MPRP (EUR)', 'Капитал для MPRP (EUR)', 'Orient €177k+ rent route or €500k+ purchase route (fees + property)', 'Ориентир €177k+ аренда или €500k+ покупка (сборы + недвижимость)', NULL, 1),
  ('e0000000-0000-4000-8000-000000000060', 'savings_eur', 'number', 'Liquid / total assets (EUR)', 'Ликвид / активы (EUR)', 'MPRP needs €500k assets (€150k liquid) or €650k (€75k liquid)', 'MPRP: активы €500k (€150k ликвид) или €650k (€75k ликвид)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000060', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000061', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', 'Include dependants in first NRP filing when possible', 'Включайте dependants в первую заявку NRP, если возможно', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000061', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, '0 если никто', NULL, 2),
  ('e0000000-0000-4000-8000-000000000061', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', 'MPRP can include parents/grandparents in some cases', 'MPRP иногда включает родителей/бабушек и дедушек', NULL, 3),
  ('e0000000-0000-4000-8000-000000000061', 'has_family_in_mt', 'single', 'Family member legally in Malta?', 'Член семьи уже легально на Мальте?', 'Resident or citizen who can sponsor reunification', 'Резидент или гражданин для воссоединения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'malta', 'malta', 'Мальта', 'Malta', '🇲🇹',
  'русскоязычные, планирующие ВНЖ на Мальте (NRP, MPRP, Non-Dom)',
  'NRP €42000 RU/BY closed, MPRP €37k contribution L.N.146, Non-Dom remittance, Residency Malta',
  'ru-speaking-to-malta', 'active',
  ARRAY['Мальта ВНЖ','Nomad Residence Permit','MPRP Мальта','Non-Dom Мальта','релокация на Мальту','русскоязычные'],
  ARRAY['Malta Nomad Residence Permit','Malta MPRP permanent residence','Malta Residency Agency digital nomad','Мальта MPRP','Malta non-dom tax'],
  '{"landing":"/ru/malta","wizard":"/ru/malta/wizard","guide":"/ru/guides/vnj-malta-2026-nomad-mprp-non-dom"}'::jsonb,
  14
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-malta');
