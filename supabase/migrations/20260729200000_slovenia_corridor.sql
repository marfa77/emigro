-- Slovenia corridor seed (ru-speaking-to-slovenia, 2026 thresholds)
-- Digital Nomad temporary residence (max 12 months, no extend, 6-month gap) + s.p. self-employment + family
-- Means: ≥ 2× avg monthly net SI (~€3,200 orient 2026; indexed via Official Gazette) — GOV.SI 2025-11-21

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('SI', 'Slovenia', 'Словения')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000017',
  'ru-speaking-to-slovenia',
  'Russian-speaking → Slovenia',
  'Русскоязычные → Словения',
  'Relocation navigator: Slovenia Digital Nomad (max 12 months, 2× avg net) and s.p. self-employment track.',
  'Навигатор: Digital Nomad до 12 мес (~€3 200/мес, 2× avg net), s.p. + family. Без ПМЖ на DN.',
  'RU',
  'slovenia',
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
  ('a0000000-0000-4000-8000-000000000017', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000017', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000017', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000017', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000017', 'SI')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000063', 'slovenia-digital-nomad', 'SI', 'LABOR', 'Slovenia Digital Nomad Temporary Residence', 'Словения — Digital Nomad', 'Remote work for employer/civil contract/self-employed outside SI. Means ≥ 2× avg monthly net (~€3,200/mo orient 2026). Max 12 months, no extension; 6-month gap before new DN. No PR on this ground. Favourable family reunification (GOV.SI).', 'Remote вне рынка труда SI. Средства ≥ 2× avg net (~€3 200/мес ориентир 2026). Макс. 12 мес без продления; 6 мес пауза. Без ПМЖ на DN. Облегчённый family reunification (GOV.SI).'),
  ('b0000000-0000-4000-8000-000000000064', 'slovenia-self-employed-sp', 'SI', 'CAPITAL', 'Slovenia s.p. / Self-Employment Residence', 'Словения — s.p. (самозанятость)', 'Register s.p. (sole trader) and apply temporary residence on self-employment. Local clients allowed. Normirani odhodki can yield ~4% PIT on turnover — social contributions (ZZZS) are separate and often dominate. Path toward longer stay / PR on non-DN grounds.', 'Регистрация s.p. + temporary residence на self-employment. Локальные клиенты ок. Normirani odhodki ≈ ~4% PIT от оборота — взносы ZZZS отдельно и часто больше. Трек к длинному stay / ПМЖ не на DN.'),
  ('b0000000-0000-4000-8000-000000000065', 'slovenia-family-reunification', 'SI', 'BOND', 'Slovenia Family Reunification (with DN/s.p.)', 'Словения — воссоединение семьи', 'Join a DN or other qualifying resident. For digital nomads GOV.SI notes a more favourable regime (immediate reunification without waiting tied to sponsor duration).', 'Присоединение к DN или иному резиденту. Для digital nomads GOV.SI отмечает облегчённый режим (сразу, без ожидания по сроку спонсора).')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000017', 'b0000000-0000-4000-8000-000000000063', 1, true),
  ('a0000000-0000-4000-8000-000000000017', 'b0000000-0000-4000-8000-000000000064', 2, true),
  ('a0000000-0000-4000-8000-000000000017', 'b0000000-0000-4000-8000-000000000065', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'b0000000-0000-4000-8000-000000000063', '2026-07', '{"and":[{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3200]}]}'),
  ('c0000000-0000-4000-8000-000000000067', 'b0000000-0000-4000-8000-000000000064', '2026-07', '{"or":[{">=":[{"var":"savings_eur"},5000]},{">=":[{"var":"willing_to_invest_eur"},5000]}]}'),
  ('c0000000-0000-4000-8000-000000000068', 'b0000000-0000-4000-8000-000000000065', '2026-07', '{"==":[{"var":"has_family_in_si"},"yes"]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'income', 'Means of subsistence', 'Средства к существованию', '≥ 2× average monthly net salary in SI (~€3,200/mo orient 2026; indexed via Official Gazette)', 1),
  ('c0000000-0000-4000-8000-000000000066', 'documents', 'Remote only', 'Только удалёнка', 'Employer/civil contract/self-employed outside SI; not entering Slovenian labour market', 2),
  ('c0000000-0000-4000-8000-000000000066', 'insurance', 'Health insurance', 'Медстраховка', 'Covering Slovenia for the intended stay', 3),
  ('c0000000-0000-4000-8000-000000000066', 'timeline', 'Maximum stay', 'Максимальный срок', 'Up to 12 months; cannot be extended; reapply 6 months after expiry (or switch purpose during validity)', 4),
  ('c0000000-0000-4000-8000-000000000067', 'documents', 's.p. registration', 'Регистрация s.p.', 'AJPES/business register entry; activity codes; Slovenian address', 1),
  ('c0000000-0000-4000-8000-000000000067', 'income', 'Funds / substance', 'Средства / substance', 'Practice often expects liquid buffer (~€5k–10k+) plus credible activity — verify upravna enota', 2),
  ('c0000000-0000-4000-8000-000000000067', 'timeline', 'Card validity', 'Срок карты', 'Typically 1 year renewable on self-employment ground (not DN)', 3),
  ('c0000000-0000-4000-8000-000000000068', 'family', 'Favourable DN reunification', 'Облегчённый reunification для DN', 'GOV.SI: DN may reunite immediately without waiting tied to sponsor residence duration', 1),
  ('c0000000-0000-4000-8000-000000000068', 'income', 'Family means', 'Средства семьи', 'Each dependant must meet conditions — exact uplifts not in short GOV.SI note; budget buffer', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'Residence fees', 'Сборы ВНЖ', 'Orient ~€50 in-country / ~€102 abroad + card fee — verify administrative unit / consulate', 1),
  ('c0000000-0000-4000-8000-000000000066', 'Translations / apostille', 'Переводы / апостиль', 'Often €200–500+', 2),
  ('c0000000-0000-4000-8000-000000000067', 's.p. + residence', 's.p. + ВНЖ', 's.p. registration tens of EUR; residence fees ~€150–300 orient + accountant', 1),
  ('c0000000-0000-4000-8000-000000000067', 'Accounting / ZZZS', 'Бухгалтерия / ZZZS', 'Accountant often €80–200+/mo; social contributions separate from PIT', 2),
  ('c0000000-0000-4000-8000-000000000068', 'Application fees', 'Сборы', 'Family reunification fees — verify upravna enota', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'document_prep', 'Income, remote proof, insurance, address', 'Доход, remote, страховка, адрес', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000066', 'application', 'Consulate or upravna enota (if legally in SI)', 'Консульство или upravna enota (если легально в SI)', 'Often 30–60 days — practice varies', 2),
  ('c0000000-0000-4000-8000-000000000066', 'residence', 'Biometrics + residence card', 'Биометрия + карта', 'After decision', 3),
  ('c0000000-0000-4000-8000-000000000067', 'document_prep', 'Register s.p. + funds/plan', 'Регистрация s.p. + средства/план', '1–3 weeks', 1),
  ('c0000000-0000-4000-8000-000000000067', 'application', 'Self-employment residence filing', 'Подача ВНЖ на self-employment', '1–3 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000067', 'residence', 'Card + ZZZS/accountant', 'Карта + ZZZS/бухгалтер', 'Ongoing', 3),
  ('c0000000-0000-4000-8000-000000000068', 'document_prep', 'Relationship + means', 'Родство + средства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000068', 'application', 'Family reunification filing', 'Подача family reunification', 'Weeks to months', 2),
  ('c0000000-0000-4000-8000-000000000068', 'residence', 'Family card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'https://www.gov.si/en/news/2025-11-21-temporary-residence-permit-for-digital-nomads/', 'DN from 21 Nov 2025: max 1 year, no extend, 6-month gap; means ≥ 2× avg net; favourable family reunification.', '2026-07-29', 'GOV.SI — Digital nomads', 'GOV.SI — Digital nomads'),
  ('c0000000-0000-4000-8000-000000000067', 'https://www.fu.gov.si/en/', 's.p. / normirani odhodki — verify FURS; social contributions via ZZZS separate from PIT.', '2026-07-29', 'FURS / tax', 'FURS / налоги'),
  ('c0000000-0000-4000-8000-000000000068', 'https://www.gov.si/en/news/2025-11-21-temporary-residence-permit-for-digital-nomads/', 'DN family reunification without waiting tied to sponsor residence duration.', '2026-07-29', 'GOV.SI — Family with DN', 'GOV.SI — Семья с DN')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000066', 'RU', 'eligible', 'Visa national: expect consulate path; in-country filing only if already legally residing', 'Нужна виза: консульство; внутри SI — только при уже легальном пребывании'),
  ('c0000000-0000-4000-8000-000000000066', 'BY', 'eligible', 'Verify visa requirement and consulate jurisdiction', 'Проверьте визовый режим и юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000066', 'UA', 'eligible', 'Verify entry regime; DN if remote/means met', 'Проверьте режим въезда; DN при remote/средствах'),
  ('c0000000-0000-4000-8000-000000000066', 'KZ', 'eligible', 'Verify entry regime', 'Проверьте режим въезда'),
  ('c0000000-0000-4000-8000-000000000067', 'RU', 'eligible', 's.p. + residence — plan consulate/legal stay; substance expected', 's.p. + ВНЖ — консульство/легальный stay; ждут substance'),
  ('c0000000-0000-4000-8000-000000000067', 'BY', 'eligible', 'Verify visa and business residence practice', 'Проверьте визу и практику бизнес-ВНЖ'),
  ('c0000000-0000-4000-8000-000000000067', 'UA', 'eligible', 'Verify entry and self-employment residence', 'Проверьте въезд и ВНЖ на self-employment'),
  ('c0000000-0000-4000-8000-000000000067', 'KZ', 'eligible', 'Verify entry regime', 'Проверьте режим въезда'),
  ('c0000000-0000-4000-8000-000000000068', 'RU', 'partial', 'Family after/with qualifying sponsor — DN has favourable regime', 'Семья со спонсором; у DN облегчённый режим'),
  ('c0000000-0000-4000-8000-000000000068', 'BY', 'partial', 'Family with qualifying sponsor', 'Семья со спонсором'),
  ('c0000000-0000-4000-8000-000000000068', 'UA', 'partial', 'Family with qualifying sponsor', 'Семья со спонсором'),
  ('c0000000-0000-4000-8000-000000000068', 'KZ', 'partial', 'Family with qualifying sponsor', 'Семья со спонсором')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000017', 'practical', 'Max 12 months, no DN extension', 'Макс. 12 мес, DN не продлевается', 'DN permit up to one year and cannot be extended. Reapply 6 months after expiry, or switch purpose during validity.', 'DN до года без продления. Повтор через 6 мес после окончания или смена основания во время действия.', 'https://www.gov.si/en/news/2025-11-21-temporary-residence-permit-for-digital-nomads/', '2026-07-29', 1),
  ('a0000000-0000-4000-8000-000000000017', 'practical', 'Means = 2× avg net', 'Средства = 2× avg net', 'Monthly funds ≥ twice average monthly net salary (~€3,200 orient 2026). Indexed — verify Gazette.', 'Ежемесячно ≥ 2× avg net (~€3 200 ориентир 2026). Индексируется — сверяйте Gazette.', 'https://www.gov.si/en/news/2025-11-21-temporary-residence-permit-for-digital-nomads/', '2026-07-29', 2),
  ('a0000000-0000-4000-8000-000000000017', 'tax', 's.p.: PIT ≠ full burden', 's.p.: PIT ≠ весь burden', 'Normirani odhodki can yield ~4% PIT on turnover; ZZZS/social contributions are separate.', 'Normirani odhodki ≈ ~4% PIT от оборота; взносы ZZZS отдельно.', 'https://www.fu.gov.si/en/', '2026-07-29', 3),
  ('a0000000-0000-4000-8000-000000000017', 'practical', 'No PR on DN ground', 'Нет ПМЖ на основании DN', 'Switch to employment, s.p. or other grounds for a settlement track.', 'Для settlement — работа, s.p. или иное основание.', 'https://www.gov.si/en/news/2025-11-21-temporary-residence-permit-for-digital-nomads/', '2026-07-29', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000017', 'a0000000-0000-4000-8000-000000000017', 'slovenia-routes', 'Slovenia route finder', 'Подбор маршрута — Словения')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000070', 'd0000000-0000-4000-8000-000000000017', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000071', 'd0000000-0000-4000-8000-000000000017', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000072', 'd0000000-0000-4000-8000-000000000017', 'capital', 'Savings / s.p. buffer', 'Сбережения / буфер s.p.', 3),
  ('e0000000-0000-4000-8000-000000000073', 'd0000000-0000-4000-8000-000000000017', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000070', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000071', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Slovenia', 'Зарплата или фриланс от работодателей/клиентов вне Словении', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000071', 'monthly_income_eur', 'number', 'Monthly income (EUR)', 'Месячный доход (EUR)', 'DN threshold ~€3,200/month (2× avg net, 2026 orient)', 'Порог DN ~€3 200/мес (2× avg net, ориентир 2026)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000071', 'has_job_offer', 'single', 'Signed job offer in Slovenia?', 'Подписанный оффер работы в Словении?', 'Local employment is a different route — not Digital Nomad', 'Локальная работа — другой маршрут, не Digital Nomad', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000072', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Useful buffer; s.p. track often expects substance (~€5k+)', 'Буфер; для s.p. часто ждут substance (~€5k+)', NULL, 1),
  ('e0000000-0000-4000-8000-000000000072', 'willing_to_invest_eur', 'number', 'Ready to put into s.p. / business (EUR)', 'Готовы вложить в s.p. / бизнес (EUR)', 'Matches self-employment program when ≥ €5,000', 'Матчит s.p. при ≥ €5 000', NULL, 2),
  ('e0000000-0000-4000-8000-000000000073', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000073', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, '0 если никто', NULL, 2),
  ('e0000000-0000-4000-8000-000000000073', 'has_family_in_si', 'single', 'Family member already with Slovenian stay?', 'Член семьи уже с ВНЖ в Словении?', 'Needed for family reunification program match', 'Нужно для матча программы воссоединения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'slovenia', 'slovenia', 'Словения', 'Slovenia', '🇸🇮',
  'русскоязычные, планирующие Digital Nomad или s.p. в Словении',
  'Digital Nomad ~€3200/mo max 12 months, s.p. normiranec, GOV.SI, Schengen',
  'ru-speaking-to-slovenia', 'active',
  ARRAY['Словения ВНЖ','Digital Nomad Словения','s.p. Словения','релокация в Словению','русскоязычные'],
  ARRAY['Slovenia digital nomad visa','Slovenia temporary residence digital nomads','Slovenia s.p. residence','Словения digital nomad','Slovenia nomad income threshold'],
  '{"landing":"/ru/slovenia","wizard":"/ru/slovenia/wizard","guide":"/ru/guides/vnj-sloveniya-2026-digital-nomad-sp"}'::jsonb,
  17
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-slovenia');
