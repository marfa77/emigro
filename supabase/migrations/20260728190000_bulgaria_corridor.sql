-- Bulgaria corridor seed (ru-speaking-to-bulgaria, 2026 thresholds)
-- Digital Nomad (1+1 years), EOOD/business, family reunification
-- Eurozone from 01.01.2026; DN income = 50× min wage (~€31 010 in Jan 2026)

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('BG', 'Bulgaria', 'Болгария')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000015',
  'ru-speaking-to-bulgaria',
  'Russian-speaking → Bulgaria',
  'Русскоязычные → Болгария',
  'Relocation navigator for Russian-speaking applicants targeting Bulgaria (Type D → residence: Digital Nomad, EOOD/business, family).',
  'Навигатор релокации: Type D → ВНЖ — Digital Nomad, EOOD/бизнес, семья. Евро с 01.01.2026, 10% flat tax.',
  'RU',
  'bulgaria',
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
  ('a0000000-0000-4000-8000-000000000015', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000015', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000015', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000015', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000015', 'BG')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000058', 'bulgaria-digital-nomad', 'BG', 'LABOR', 'Bulgaria Digital Nomad Residence', 'Болгария — Digital Nomad', 'Remote IT/services for non-BG clients. Prior calendar-year income ≥ 50× min monthly wage (~€31 010 as of Jan 2026). Type D then continuous residence. Card 1 year + one renewal (~2 years max on this ground — AmCham).', 'Remote IT/услуги для клиентов вне BG. Доход за прошлый календарный год ≥ 50× min wage (~€31 010 на янв. 2026). Type D → continuous residence. Карта 1 год + одно продление (~2 года макс. на этом основании — AmCham).'),
  ('b0000000-0000-4000-8000-000000000059', 'bulgaria-eood', 'BG', 'CAPITAL', 'Bulgaria EOOD / Business Residence', 'Болгария — EOOD / бизнес', 'Register EOOD (min capital €1 from 2026) and apply Type D + residence as manager/owner. Consulates expect real substance (capital/plan/clients), not a shell. Path toward permanent residence after years of continuous stay. CIT 10%.', 'Регистрация EOOD (капитал от €1 с 2026) → Type D + ВНЖ как manager/owner. Консульства ждут substance (капитал/план/клиенты), не оболочку. Путь к ПМЖ после лет непрерывного stay. CIT 10%.'),
  ('b0000000-0000-4000-8000-000000000060', 'bulgaria-family-reunification', 'BG', 'BOND', 'Bulgaria Family Reunification', 'Болгария — воссоединение семьи', 'Join a spouse or family member with qualifying Bulgarian residence or citizenship via Type D + residence permit.', 'Присоединение к супругу или члену семьи с подходящим болгарским ВНЖ или гражданством через Type D + residence permit.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000058', 1, true),
  ('a0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000059', 2, true),
  ('a0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000060', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'b0000000-0000-4000-8000-000000000058', '2026-07', '{"and":[{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},2600]}]}'),
  ('c0000000-0000-4000-8000-000000000062', 'b0000000-0000-4000-8000-000000000059', '2026-07', '{"or":[{">=":[{"var":"savings_eur"},1000]},{">=":[{"var":"willing_to_invest_eur"},1000]}]}'),
  ('c0000000-0000-4000-8000-000000000063', 'b0000000-0000-4000-8000-000000000060', '2026-07', '{"==":[{"var":"has_family_in_bg"},"yes"]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'income', 'Prior-year income', 'Доход за прошлый год', 'Average annual income ≥ 50 gross minimum monthly wages (~€31 010 as of Jan 2026; floats with min wage)', 1),
  ('c0000000-0000-4000-8000-000000000061', 'documents', 'Remote only + Type D', 'Только удалёнка + Type D', 'No Bulgarian clients/local freelancing. Three categories (foreign employer / >25% foreign company / 1y freelance). Type D always required.', 2),
  ('c0000000-0000-4000-8000-000000000061', 'insurance', 'Health insurance', 'Медстраховка', 'Valid in Bulgaria (and Schengen as required by consulate)', 3),
  ('c0000000-0000-4000-8000-000000000061', 'timeline', 'Maximum on DN ground', 'Макс. на основании DN', '1 year + one renewal ≈ 2 years (AmCham); then switch ground (often EOOD)', 4),
  ('c0000000-0000-4000-8000-000000000062', 'min_investment_eur', 'Company substance', 'Substance компании', 'Legal min capital €1; for visa practice often €1 000–5 000+ plus credible business plan and bank activity', 1),
  ('c0000000-0000-4000-8000-000000000062', 'documents', 'Commercial Register + Type D', 'Торговый регистр + Type D', 'EOOD registered; Type D on business ground; address within ~5 days; residence within ~14 days of entry', 2),
  ('c0000000-0000-4000-8000-000000000062', 'timeline', 'Card validity', 'Срок карты', 'Usually 1 year continuous residence, renewable; PR after years of continuous stay (≤30 months abroad in 5-year window)', 3),
  ('c0000000-0000-4000-8000-000000000063', 'family', 'Sponsor in Bulgaria', 'Спонсор в Болгарии', 'Spouse/child of qualifying resident or citizen', 1),
  ('c0000000-0000-4000-8000-000000000063', 'income', 'Maintenance', 'Содержание', 'Sponsor income and housing sufficient for dependants', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'Type D + residence fees', 'Type D + сборы ВНЖ', 'Orient Type D ~€100 + residence card fees — verify MFA / Migration', 1),
  ('c0000000-0000-4000-8000-000000000061', 'Lawyer / translations', 'Юрист / переводы', 'Often €500–1 500+ (apostille + certified BG translation)', 2),
  ('c0000000-0000-4000-8000-000000000062', 'EOOD registration', 'Регистрация EOOD', 'State fees often tens of EUR e-file + notary/lawyer', 1),
  ('c0000000-0000-4000-8000-000000000062', 'Ongoing accounting', 'Бухгалтерия', 'Often €50–150+/month depending on activity', 2),
  ('c0000000-0000-4000-8000-000000000063', 'Application fees', 'Сборы за подачу', 'Type D + Migration fees — verify mfa.bg / mvr.bg', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'document_prep', 'Income proof, contracts, housing, insurance', 'Доход, контракты, жильё, страховка', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000061', 'application', 'Type D at consulate', 'Type D в консульстве', 'Often 1–2 months (AmCham orient)', 2),
  ('c0000000-0000-4000-8000-000000000061', 'residence', 'Migration filing after entry + ID card', 'Подача в Migration после въезда + ID', 'Residence review often 2–4 weeks; then ID card 3/10/30 days', 3),
  ('c0000000-0000-4000-8000-000000000062', 'document_prep', 'Register EOOD + business plan', 'Регистрация EOOD + бизнес-план', '1–3 weeks', 1),
  ('c0000000-0000-4000-8000-000000000062', 'application', 'Type D business ground', 'Type D по бизнесу', 'Often 1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000062', 'residence', 'Address 5 days + residence 14 days', 'Адрес 5 дн. + ВНЖ 14 дн.', 'After entry; card ~1 year renewable', 3),
  ('c0000000-0000-4000-8000-000000000063', 'document_prep', 'Relationship & housing proof', 'Родство и жильё', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000063', 'application', 'Type D family + Migration', 'Type D семья + Migration', '2–4 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000063', 'residence', 'Family residence card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'https://amcham.bg/2026/01/16/bulgaria-launches-a-digital-nomad-residence-permit/', 'DN: 50× min wage (~€31 010 Jan 2026); 1+1 years; three categories; Type D required.', '2026-07-28', 'AmCham — Digital Nomad', 'AmCham — Digital Nomad'),
  ('c0000000-0000-4000-8000-000000000061', 'https://www.mvr.bg/migration', 'Migration Directorate — residence permits after Type D entry.', '2026-07-28', 'Migration Directorate', 'Migration Directorate'),
  ('c0000000-0000-4000-8000-000000000062', 'https://www.registryagency.bg/', 'Commercial Register — EOOD registration; euro capital from 01.01.2026.', '2026-07-28', 'Registry Agency', 'Registry Agency'),
  ('c0000000-0000-4000-8000-000000000062', 'https://www.nra.bg/', 'NRA — 10% CIT / PIT; compliance for managers.', '2026-07-28', 'NRA — taxes', 'NRA — налоги'),
  ('c0000000-0000-4000-8000-000000000063', 'https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria', 'Type D family grounds via Bulgarian consulates.', '2026-07-28', 'MFA Bulgaria — visas', 'MFA Bulgaria — визы')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000061', 'RU', 'eligible', 'DN open if income and remote criteria met; Type D at consulate', 'DN доступен при доходе и remote; Type D в консульстве'),
  ('c0000000-0000-4000-8000-000000000061', 'BY', 'eligible', 'DN open; verify consulate jurisdiction', 'DN доступен; проверьте консульскую юрисдикцию'),
  ('c0000000-0000-4000-8000-000000000061', 'UA', 'eligible', 'DN open', 'DN доступен'),
  ('c0000000-0000-4000-8000-000000000061', 'KZ', 'eligible', 'DN open', 'DN доступен'),
  ('c0000000-0000-4000-8000-000000000062', 'RU', 'eligible', 'EOOD route open; substance and source-of-funds scrutiny', 'EOOD доступен; проверяют substance и источник средств'),
  ('c0000000-0000-4000-8000-000000000062', 'BY', 'eligible', 'EOOD route open', 'EOOD доступен'),
  ('c0000000-0000-4000-8000-000000000062', 'UA', 'eligible', 'EOOD route open', 'EOOD доступен'),
  ('c0000000-0000-4000-8000-000000000062', 'KZ', 'eligible', 'EOOD route open', 'EOOD доступен'),
  ('c0000000-0000-4000-8000-000000000063', 'RU', 'partial', 'Depends on sponsor status', 'Зависит от статуса спонсора'),
  ('c0000000-0000-4000-8000-000000000063', 'BY', 'partial', 'Depends on sponsor status', 'Зависит от статуса спонсора'),
  ('c0000000-0000-4000-8000-000000000063', 'UA', 'partial', 'Depends on sponsor status', 'Зависит от статуса спонсора'),
  ('c0000000-0000-4000-8000-000000000063', 'KZ', 'partial', 'Depends on sponsor status', 'Зависит от статуса спонсора')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000015', 'practical', 'DN max ~2 years on this ground', 'DN макс. ~2 года на этом основании', 'AmCham: Digital Nomad residence is 1 year + one prolongation. Plan EOOD or employment for year 3+.', 'AmCham: Digital Nomad — 1 год + одно продление. На 3+ год планируйте EOOD или работу.', 'https://amcham.bg/2026/01/16/bulgaria-launches-a-digital-nomad-residence-permit/', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000015', 'practical', 'Address 5 days / residence 14 days', 'Адрес 5 дней / ВНЖ 14 дней', 'After Type D entry: declare address (~5 days) and file continuous residence (~14 days) at Migration.', 'После въезда по Type D: адрес (~5 дней) и подача на continuous residence (~14 дней) в Migration.', 'https://www.mvr.bg/migration', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000015', 'investment', 'EOOD €1 ≠ automatic visa', 'EOOD €1 ≠ автоматическая виза', 'Legal minimum capital is €1 (euro 2026), but consulates look for real business substance.', 'Юридический минимум капитала €1 (евро 2026), но консульства смотрят на реальный бизнес.', 'https://www.registryagency.bg/', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000015', 'tax', '10% flat PIT/CIT', '10% flat PIT/CIT', 'Residents typically face 10% personal and corporate tax; dividends 5%. Model worldwide income if 183+ days.', 'У резидентов обычно 10% PIT и CIT; дивиденды 5%. При 183+ днях считайте мировой доход.', 'https://www.nra.bg/', '2026-07-28', 4),
  ('a0000000-0000-4000-8000-000000000015', 'practical', 'Citizenship often needs renunciation', 'Гражданство часто требует отказа от паспорта', 'Naturalisation usually needs ≥5 years on permanent/long-term residence + Bulgarian language; many non-EU must renounce prior citizenship.', 'Натурализация обычно ≥5 лет на permanent/long-term + болгарский; многие non-EU отказываются от прежнего гражданства.', 'https://www.justice.government.bg/', '2026-07-28', 5)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000015', 'bulgaria-routes', 'Bulgaria route finder', 'Подбор маршрута — Болгария')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000062', 'd0000000-0000-4000-8000-000000000015', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000063', 'd0000000-0000-4000-8000-000000000015', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000064', 'd0000000-0000-4000-8000-000000000015', 'capital', 'Business & capital', 'Бизнес и капитал', 3),
  ('e0000000-0000-4000-8000-000000000065', 'd0000000-0000-4000-8000-000000000015', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000062', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000063', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Bulgaria', 'Зарплата или фриланс от работодателей/клиентов вне Болгарии', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000063', 'monthly_income_eur', 'number', 'Monthly income (EUR)', 'Месячный доход (EUR)', 'DN threshold ≈ €2 600/month (~€31 010/year prior calendar year)', 'Порог DN ≈ €2 600/мес (~€31 010/год за прошлый календарный год)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000063', 'has_job_offer', 'single', 'Signed job offer in Bulgaria?', 'Подписанный оффер работы в Болгарии?', 'Local employment is a different route — not Digital Nomad', 'Локальная работа — другой маршрут, не Digital Nomad', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000063', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000064', 'willing_to_invest_eur', 'number', 'Capital for EOOD / business (EUR)', 'Капитал для EOOD / бизнеса (EUR)', 'Legal min €1; for visa substance often €1 000–5 000+', 'Юр. минимум €1; для визы обычно €1 000–5 000+', NULL, 1),
  ('e0000000-0000-4000-8000-000000000064', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Buffer for Type D / first months', 'Подушка для Type D / первых месяцев', NULL, 2),
  ('e0000000-0000-4000-8000-000000000064', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000065', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000065', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, '0 если никто', NULL, 2),
  ('e0000000-0000-4000-8000-000000000065', 'relocating_parents_count', 'number', 'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто', NULL, 3),
  ('e0000000-0000-4000-8000-000000000065', 'has_family_in_bg', 'single', 'Family member legally in Bulgaria?', 'Член семьи уже легально в Болгарии?', 'Resident or citizen who can sponsor reunification', 'Резидент или гражданин для воссоединения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'bulgaria', 'bulgaria', 'Болгария', 'Bulgaria', '🇧🇬',
  'русскоязычные, планирующие ВНЖ в Болгарии (Digital Nomad, EOOD, Type D)',
  'Digital Nomad €31010 1+1, EOOD €1 capital, 10% tax, euro 2026, Type D Migration',
  'ru-speaking-to-bulgaria', 'active',
  ARRAY['Болгария ВНЖ','Digital Nomad Болгария','EOOD Болгария','Type D Болгария','релокация в Болгарию','русскоязычные'],
  ARRAY['Bulgaria digital nomad visa','Bulgaria EOOD residence permit','Bulgaria Type D visa','Болгария ВНЖ digital nomad','Bulgaria 10 percent flat tax'],
  '{"landing":"/ru/bulgaria","wizard":"/ru/bulgaria/wizard","guide":"/ru/guides/vnj-bolgariya-2026-type-d-digital-nomad-eood"}'::jsonb,
  15
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-bulgaria');
