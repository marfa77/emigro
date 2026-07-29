-- Cyprus corridor seed (ru-speaking-to-cyprus, 2026 thresholds)
-- Digital Nomad, Category F (FIP), family reunification
-- Non-Dom is tax status only — covered in digest, not as a residence program

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('CY', 'Cyprus', 'Кипр')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000012',
  'ru-speaking-to-cyprus',
  'Russian-speaking → Cyprus',
  'Русскоязычные → Кипр',
  'Relocation navigator for Russian-speaking applicants targeting Cyprus residency routes (digital nomad, Category F) and Non-Dom tax context.',
  'Навигатор релокации для русскоязычных: Digital Nomad, Category F и контекст Non-Dom на Кипре.',
  'RU',
  'cyprus',
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
  ('a0000000-0000-4000-8000-000000000012', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000012', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000012', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000012', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000012', 'CY')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000049', 'cyprus-digital-nomad', 'CY', 'LABOR', 'Cyprus Digital Nomad Visa', 'Кипр — Digital Nomad Visa', 'Temporary residence for remote workers with foreign net income ≥ €3 500/month; work for Cypriot employers/clients prohibited. Max ~3 years (1+2). Quota applies. Cyprus RP ≠ Schengen.', 'Временный ВНЖ для удалёнщиков с зарубежным net-доходом ≥ €3 500/мес; работа на кипрских работодателей/клиентов запрещена. Макс. ~3 года (1+2). Есть квота. Кипрский ВНЖ ≠ Шенген.'),
  ('b0000000-0000-4000-8000-000000000050', 'cyprus-category-f', 'CY', 'CAPITAL', 'Cyprus Category F (FIP)', 'Кипр — Category F (финансово независимые)', 'Permanent residency for guaranteed passive income from abroad (formal min ~€9 568/year); local work prohibited. Processing backlog often years.', 'Permanent residency при гарантированном пассивном доходе из-за рубежа (формально от ~€9 568/год); работа на Кипре запрещена. Бэклог рассмотрения часто годы.'),
  ('b0000000-0000-4000-8000-000000000051', 'cyprus-family-reunification', 'CY', 'BOND', 'Cyprus Family Reunification', 'Кипр — воссоединение семьи', 'Join a spouse or family member legally residing in Cyprus.', 'Присоединение к супругу или члену семьи с легальным статусом на Кипре.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000049', 1, true),
  ('a0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000050', 2, true),
  ('a0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000051', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'b0000000-0000-4000-8000-000000000049', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3500]}]}'),
  ('c0000000-0000-4000-8000-000000000053', 'b0000000-0000-4000-8000-000000000050', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{">=":[{"var":"passive_income_eur"},797]},{">=":[{"var":"savings_eur"},30000]}]}]}'),
  ('c0000000-0000-4000-8000-000000000054', 'b0000000-0000-4000-8000-000000000051', '2026-07', '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_cy"},"yes"]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'income', 'Minimum monthly net income', 'Мин. месячный net-доход', '€3 500/мес net (+20% супруг, +15% ребёнок); evidence 3–6 months', 1),
  ('c0000000-0000-4000-8000-000000000052', 'documents', 'Remote work only', 'Только удалёнка', 'No work for Cypriot employers/clients; apply at Migration Department Nicosia within ~3 months of entry', 2),
  ('c0000000-0000-4000-8000-000000000052', 'insurance', 'Health insurance', 'Медстраховка', 'Private cover valid in Cyprus (orient €30 000+)', 3),
  ('c0000000-0000-4000-8000-000000000052', 'timeline', 'Maximum stay', 'Макс. срок', '1 year + renewal up to +2 years (≈3 years total); quota (gov.cy cites 500)', 4),
  ('c0000000-0000-4000-8000-000000000053', 'income', 'Passive income', 'Пассивный доход', 'Formal min €9 568/year (~€797/мес) + €4 613/year per dependant; practice often €15–20k/year solo', 1),
  ('c0000000-0000-4000-8000-000000000053', 'savings', 'Savings alternative', 'Альтернатива — сбережения', 'Formal orient €30 000+ on deposit — officers may expect more with family', 2),
  ('c0000000-0000-4000-8000-000000000053', 'documents', 'No work in Cyprus', 'Без работы на Кипре', 'Local employment prohibited; permanent status but multi-year backlog common', 3),
  ('c0000000-0000-4000-8000-000000000054', 'family', 'Sponsor in Cyprus', 'Спонсор на Кипре', 'Spouse, child or other family member with valid Cyprus residence', 1),
  ('c0000000-0000-4000-8000-000000000054', 'income', 'Maintenance', 'Содержание', 'Sponsor income and housing sufficient for dependants', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'Residence + Aliens Registry', 'ВНЖ + Aliens Registry', '€70 temporary residence + €70 Aliens Registry (first registration)', 1),
  ('c0000000-0000-4000-8000-000000000052', 'Lawyer / accountant', 'Юрист / бухгалтер', 'Often €1 000–2 000+ for dossier (optional)', 2),
  ('c0000000-0000-4000-8000-000000000053', 'State fee (family)', 'Госпошлина (семья)', '€500 for the whole family + €70 ARC per person', 1),
  ('c0000000-0000-4000-8000-000000000053', 'Lawyer', 'Юрист', 'Often €1 500–3 000+ given backlog complexity', 2),
  ('c0000000-0000-4000-8000-000000000054', 'Application fees', 'Сборы за подачу', 'Indicative Migration Department fees — verify gov.cy', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'document_prep', 'Apostilles, translations, lease 6+ months', 'Апостили, переводы, аренда 6+ мес', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000052', 'application', 'File at Migration Department (Nicosia)', 'Подача в Migration Department (Никосия)', '5–7 weeks decision (official orient)', 2),
  ('c0000000-0000-4000-8000-000000000052', 'residence', 'Card 1 year → renew up to +2 years', 'Карта 1 год → продление до +2 лет', 'After approval; max ≈3 years total', 3),
  ('c0000000-0000-4000-8000-000000000053', 'document_prep', 'Passive income / savings dossier', 'Досье пассива / сбережений', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000053', 'application', 'Category F filing (CRMD)', 'Подача Category F (CRMD)', 'Filing receipt may allow stay; decision often years (backlog)', 2),
  ('c0000000-0000-4000-8000-000000000053', 'residence', 'Permanent status; card renewals', 'Permanent статус; продления карты', 'After approval — plastic card renewals per CRMD rules', 3),
  ('c0000000-0000-4000-8000-000000000054', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000054', 'application', 'Family reunification filing', 'Подача на воссоединение', '2–6 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000054', 'residence', 'Family residence card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'https://www.gov.cy/mip-md/en/documents/digital-nomads-and-family-members/', 'Digital nomads: net income €3 500/month; family add-ons; temporary residence up to 1+2 years; quota noted on official page.', '2026-07-28', 'Migration Department — Digital Nomad', 'Migration Department — Digital Nomad'),
  ('c0000000-0000-4000-8000-000000000052', 'https://www.gov.cy/mip-md/', 'Civil Registry and Migration Department — residence procedures.', '2026-07-28', 'Migration Department Cyprus', 'Migration Department Кипр'),
  ('c0000000-0000-4000-8000-000000000053', 'https://www.gov.cy/mip-md/', 'Category F permanent residence for financially independent persons — passive means from abroad; local work prohibited.', '2026-07-28', 'Migration Department — Category F', 'Migration Department — Category F'),
  ('c0000000-0000-4000-8000-000000000054', 'https://www.gov.cy/mip-md/', 'Family members of legal residents — reunification / dependent residence.', '2026-07-28', 'Migration Department — family', 'Migration Department — семья')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000052', 'RU', 'eligible', 'Digital nomad open; in-country filing possible after legal entry; Cyprus RP ≠ Schengen', 'Digital Nomad доступен; подача изнутри после легального въезда; ВНЖ ≠ Шенген'),
  ('c0000000-0000-4000-8000-000000000052', 'BY', 'partial', 'Possible with documented remote income; verify entry basis and quota', 'Возможно при подтверждённом удалённом доходе; проверьте основание въезда и квоту'),
  ('c0000000-0000-4000-8000-000000000052', 'UA', 'partial', 'Possible; compare with other EU Schengen routes if travel flexibility matters', 'Возможно; сравните с шенгенскими маршрутами ЕС, если важны поездки'),
  ('c0000000-0000-4000-8000-000000000052', 'KZ', 'partial', 'Possible with documented remote income', 'Возможно при подтверждённом удалённом доходе'),
  ('c0000000-0000-4000-8000-000000000053', 'RU', 'eligible', 'Category F for passive income/savings; expect long backlog; no local work', 'Category F при пассиве/сбережениях; ожидайте долгий бэклог; без локальной работы'),
  ('c0000000-0000-4000-8000-000000000053', 'BY', 'partial', 'Subject to means proof and CRMD backlog', 'Зависит от подтверждения средств и бэклога CRMD'),
  ('c0000000-0000-4000-8000-000000000053', 'UA', 'partial', 'Compare with Schengen FIP routes if needed', 'Сравните с FIP в Шенгене при необходимости'),
  ('c0000000-0000-4000-8000-000000000053', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно'),
  ('c0000000-0000-4000-8000-000000000054', 'RU', 'eligible', 'Family reunification for dependants of Cyprus residents', 'Воссоединение с резидентами Кипра'),
  ('c0000000-0000-4000-8000-000000000054', 'BY', 'partial', 'Depends on sponsor status and housing', 'Зависит от статуса спонсора и жилья'),
  ('c0000000-0000-4000-8000-000000000054', 'UA', 'partial', 'Family route available', 'Семейный маршрут доступен'),
  ('c0000000-0000-4000-8000-000000000054', 'KZ', 'partial', 'Preliminarily possible', 'Предварительно возможно')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000012', 'practical', 'Cyprus RP ≠ Schengen', 'Кипрский ВНЖ ≠ Шенген', 'A Cyprus residence permit does not grant visa-free entry to the Schengen Area — get a separate Schengen visa for EU travel.', 'Кипрский residence permit не даёт безвизового въезда в Шенген — для поездок по ЕС нужна отдельная шенгенская виза.', 'https://www.gov.cy/mip-md/', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000012', 'tax', 'Non-Dom ≠ residence', 'Non-Dom ≠ ВНЖ', 'Non-domiciled is a tax status (0% SDC on dividends/interest up to 17 years) for tax residents — not a residence permit. Pair with DN or Category F (or other legal stay).', 'Non-domiciled — налоговый статус (0% SDC на дивиденды/проценты до 17 лет) для налоговых резидентов, не ВНЖ. Нужен DN, Category F или иной легальный статус.', 'https://www.tax.gov.cy/', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000012', 'tax', '50% employment relief 17 years', '50% на трудовой доход 17 лет', 'Qualifying new residents with employment income > €55 000/year may claim 50% income-tax exemption for up to 17 years — claim via tax return, not automatic.', 'Новые резиденты с трудовым доходом > €55 000/год могут заявить 50% exemption до 17 лет — через декларацию, не «само».', 'https://www.tax.gov.cy/', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000012', 'practical', 'Category F backlog', 'Бэклог Category F', 'Category F is permanent in status, but CRMD processing backlog often stretches to years — plan cash buffer and legal stay basis meanwhile.', 'Category F бессрочен по статусу, но бэклог CRMD часто годы — закладывайте подушку и основание пребывания на время ожидания.', 'https://www.gov.cy/mip-md/', '2026-07-28', 4),
  ('a0000000-0000-4000-8000-000000000012', 'practical', 'DN max ~3 years + quota', 'DN макс. ~3 года + квота', 'Official DN: first card 1 year, renewal up to +2 years (≈3 total). Quota cited on gov.cy (500) — verify before filing.', 'Официально DN: карта 1 год, продление до +2 лет (≈3 всего). На gov.cy указана квота (500) — сверяйте перед подачей.', 'https://www.gov.cy/mip-md/en/documents/digital-nomads-and-family-members/', '2026-07-28', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000012', 'cyprus-routes', 'Cyprus route finder', 'Подбор маршрута — Кипр')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000050', 'd0000000-0000-4000-8000-000000000012', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000051', 'd0000000-0000-4000-8000-000000000012', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000052', 'd0000000-0000-4000-8000-000000000012', 'capital', 'Passive income', 'Пассивный доход', 3),
  ('e0000000-0000-4000-8000-000000000053', 'd0000000-0000-4000-8000-000000000012', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000050', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000051', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Cyprus', 'Зарплата или фриланс от работодателей/клиентов вне Кипра', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000051', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', 'Digital Nomad threshold €3 500 solo (+20%/+15% family)', 'Порог Digital Nomad €3 500 соло (+20%/+15% семья)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000051', 'has_job_offer', 'single', 'Signed job offer in Cyprus?', 'Подписанный оффер работы на Кипре?', 'Local employment is a different route — not Digital Nomad / Category F', 'Локальная работа — другой маршрут, не Digital Nomad / Category F', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000051', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000052', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Category F formal min ≈ €797/мес (€9 568/year); pensions, rent, dividends — not remote salary', 'Category F формально ≈ €797/мес (€9 568/год); пенсии, аренда, дивиденды — не зарплата удалёнки', NULL, 1),
  ('e0000000-0000-4000-8000-000000000052', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Category F alternative to monthly passive income (formal orient €30 000+)', 'Альтернатива месячному пассиву для Category F (формально от €30 000)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000052', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000053', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, 'Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000053', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги дохода DN / Category F', NULL, 2),
  ('e0000000-0000-4000-8000-000000000053', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто. Category F обычно не включает родителей', NULL, 3),
  ('e0000000-0000-4000-8000-000000000053', 'has_family_in_cy', 'single', 'Family member legally in Cyprus?', 'Член семьи уже легально на Кипре?', 'Resident or citizen who can sponsor reunification — if you join them', 'Резидент или гражданин для воссоединения — если вы едете к ним', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'cyprus', 'cyprus', 'Кипр', 'Cyprus', '🇨🇾',
  'русскоязычные, планирующие ВНЖ на Кипре (digital nomad, Category F, Non-Dom)',
  'Digital Nomad €3500, Category F backlog, Non-Dom 0% SDC, GESY, TIN, Schengen caveat',
  'ru-speaking-to-cyprus', 'active',
  ARRAY['Кипр ВНЖ','Digital Nomad Кипр','Category F Кипр','Non-Dom Кипр','релокация на Кипр','русскоязычные'],
  ARRAY['Cyprus digital nomad visa','Cyprus Category F residence','Cyprus non-dom tax residency','Cyprus Migration Department residence','Кипр ВНЖ digital nomad','Cyprus GESY TIN'],
  '{"landing":"/ru/cyprus","wizard":"/ru/cyprus/wizard","guide":"/ru/guides/vnj-kipr-2026-digital-nomad-fip-non-dom"}'::jsonb,
  12
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-cyprus');
