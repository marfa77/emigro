-- Estonia corridor seed (ru-speaking-to-estonia, 2026)
-- Digital Nomad Visa (telework D/C) + e-Residency/OÜ (not residence)
-- RU: MFA restricts almost all C/D visas (DNV not excepted). BY: no teleworking visas.
-- Income: €4,500/mo (e-Residency FAQ: gross of tax). Fees: D €120 / C €90. Second DNV up to 6 mo (548/730).

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('EE', 'Estonia', 'Эстония')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000018',
  'ru-speaking-to-estonia',
  'Russian-speaking → Estonia',
  'Русскоязычные → Эстония',
  'Navigator: Estonia Digital Nomad Visa (high income; RU/BY largely blocked) and e-Residency + OÜ (business ID, not residence).',
  'Навигатор: Digital Nomad Visa (€4 500/мес; РФ/BY почти закрыты) и e-Residency + OÜ (бизнес-ID, не ВНЖ).',
  'RU',
  'estonia',
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
  ('a0000000-0000-4000-8000-000000000018', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000018', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000018', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000018', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000018', 'EE')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000066', 'estonia-digital-nomad', 'EE', 'LABOR', 'Estonia Digital Nomad Visa', 'Эстония — Digital Nomad Visa', 'Long-stay D (up to 365 days) or C (90) for remote work for foreign employer / foreign company / clients mostly abroad. Income ≥ €4,500/mo (FAQ: gross of tax) with 6 months history. Not a residence permit; no PR path. Second separate DNV up to 6 months (548 days / 730). RU: MFA blocks almost all C/D visas (DNV not excepted). BY: teleworking visas not issued.', 'D до 365 дн. или C до 90 для remote на иностранного работодателя / foreign company / клиентов abroad. Доход ≥ €4 500/мес (FAQ: gross) + 6 мес истории. Не residence permit; без ПМЖ. Второй DNV до 6 мес (548/730). РФ: MFA почти все C/D (DNV не в исключениях). BY: teleworking визы не выдают.'),
  ('b0000000-0000-4000-8000-000000000067', 'estonia-e-residency-ou', 'EE', 'CAPITAL', 'Estonia e-Residency + OÜ', 'Эстония — e-Residency + OÜ', 'Government digital ID (€150) to start and run an Estonian private limited company (OÜ) online. No right to live in Estonia or Schengen stay. 0% CIT on undistributed profits; ~22% on distributions. Banking often needs Estonian nexus.', 'Цифровой ID (€150) для открытия и ведения OÜ онлайн. Без права жить в Эстонии и без Шенгена. 0% CIT на нераспределённую прибыль; ~22% на дивиденды. Банк EE IBAN часто требует nexus.'),
  ('b0000000-0000-4000-8000-000000000068', 'estonia-family-reunification', 'EE', 'BOND', 'Estonia Family (with DNV)', 'Эстония — семья (с DNV)', 'Spouse and minor children may apply for visas under the same conditions as the DNV-holder (case-by-case). Separate from DNV eligibility restrictions for RU/BY.', 'Супруг и несовершеннолетние дети могут подавать визы на тех же условиях, что DNV-holder (case-by-case). Отдельно от ограничений DNV для РФ/BY.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000018', 'b0000000-0000-4000-8000-000000000066', 1, true),
  ('a0000000-0000-4000-8000-000000000018', 'b0000000-0000-4000-8000-000000000067', 2, true),
  ('a0000000-0000-4000-8000-000000000018', 'b0000000-0000-4000-8000-000000000068', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'b0000000-0000-4000-8000-000000000066', '2026-07', '{"and":[{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},4500]}]}'),
  ('c0000000-0000-4000-8000-000000000070', 'b0000000-0000-4000-8000-000000000067', '2026-07', '{"or":[{">=":[{"var":"savings_eur"},2000]},{">=":[{"var":"willing_to_invest_eur"},2000]}]}'),
  ('c0000000-0000-4000-8000-000000000071', 'b0000000-0000-4000-8000-000000000068', '2026-07', '{"==":[{"var":"has_family_in_ee"},"yes"]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'income', 'Income threshold', 'Порог дохода', '≥ €4,500/month (e-Residency FAQ: gross of tax) + evidence for prior 6 months; €150/day sufficiency logic', 1),
  ('c0000000-0000-4000-8000-000000000069', 'documents', 'Remote work abroad', 'Удалёнка abroad', 'Foreign employer, own foreign-registered company, or freelance mostly for clients with PE abroad — Estonian OÜ alone does not qualify as the foreign company', 2),
  ('c0000000-0000-4000-8000-000000000069', 'insurance', 'Health insurance', 'Медстраховка', 'Valid for the stay in Estonia', 3),
  ('c0000000-0000-4000-8000-000000000069', 'timeline', 'Stay length', 'Срок', 'D up to 365 days; second separate DNV up to 6 months; max 548 days within 730; not a residence permit / no PR advantage', 4),
  ('c0000000-0000-4000-8000-000000000070', 'documents', 'e-Residency kit', 'e-Residency', 'Apply online, pay €150, pick up card; then register OÜ; contact person + legal address if no local office', 1),
  ('c0000000-0000-4000-8000-000000000070', 'timeline', 'Not residence', 'Не ВНЖ', 'No right to live in Estonia or Schengen mobility from e-Residency alone', 2),
  ('c0000000-0000-4000-8000-000000000071', 'family', 'Separate visa filings', 'Отдельные визы', 'Spouse/minor children may apply under same conditions as DNV-holder — case-by-case; work rights depend on their visa', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'State visa fee', 'Госпошлина визы', 'D €120 / C €90 (FAQ); children 6–11 often €60 on D', 1),
  ('c0000000-0000-4000-8000-000000000069', 'Translations / apostille', 'Переводы / апостиль', 'Often €200–500+', 2),
  ('c0000000-0000-4000-8000-000000000070', 'e-Residency + Year 1 OÜ', 'e-Residency + OÜ год 1', '€150 application + state fees + address/contact person + accountant — often €1.5k–3k+', 1),
  ('c0000000-0000-4000-8000-000000000071', 'Family visa fees', 'Сборы семьи', 'Separate D/C fees per person — verify MFA', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'document_prep', 'Income, remote proof, insurance', 'Доход, remote, страховка', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000069', 'application', 'Embassy / VFS / PPA if legally in EE', 'Консульство / VFS / PPA', 'Often ≥15 days, ~30 average', 2),
  ('c0000000-0000-4000-8000-000000000069', 'residence', 'Enter on visa; register address if required', 'Въезд; регистрация адреса при необходимости', 'After issuance', 3),
  ('c0000000-0000-4000-8000-000000000070', 'document_prep', 'e-Residency application', 'Заявка e-Residency', '~30 days background target', 1),
  ('c0000000-0000-4000-8000-000000000070', 'application', 'Pick up card + register OÜ', 'Карта + регистрация OÜ', 'Days to weeks after pickup', 2),
  ('c0000000-0000-4000-8000-000000000070', 'residence', 'Banking + accounting setup', 'Банк + бухгалтерия', 'Ongoing', 3),
  ('c0000000-0000-4000-8000-000000000071', 'document_prep', 'Family docs + means', 'Документы семьи + средства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000071', 'application', 'Separate visa applications', 'Отдельные визы', 'With / after sponsor DNV', 2),
  ('c0000000-0000-4000-8000-000000000071', 'residence', 'Enter together or join later', 'Въезд вместе или позже', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'https://www.e-resident.gov.ee/blog/posts/faqs-about-estonias-digital-nomad-visa/', 'DNV FAQ: €4,500 gross of tax; D €120 / C €90; second DNV up to 6 months; 548/730; not residence permit.', '2026-07-29', 'e-Residency — DNV FAQ', 'e-Residency — DNV FAQ'),
  ('c0000000-0000-4000-8000-000000000069', 'https://vm.ee/en/consular-visa-and-travel-information/visa-information/restrictions-accepting-visa-applications', 'RU: almost all C/D visas restricted. BY: teleworking visas not issued.', '2026-07-29', 'MFA — RU/BY visa restrictions', 'MFA — ограничения РФ/BY'),
  ('c0000000-0000-4000-8000-000000000070', 'https://www.e-resident.gov.ee/become-an-e-resident/', 'e-Residency application fee €150; business ID only.', '2026-07-29', 'e-Residency — apply', 'e-Residency — заявка'),
  ('c0000000-0000-4000-8000-000000000070', 'https://www.e-resident.gov.ee/start-a-company/', 'OÜ online; contact person / legal address common for non-residents.', '2026-07-29', 'e-Residency — start company', 'e-Residency — компания'),
  ('c0000000-0000-4000-8000-000000000071', 'https://www.e-resident.gov.ee/blog/posts/faqs-about-estonias-digital-nomad-visa/', 'Family may apply under same conditions as DNV-holder; case-by-case.', '2026-07-29', 'e-Residency — DNV family', 'e-Residency — семья DNV')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000069', 'RU', 'ineligible', 'MFA: restrictions on almost all Estonian C/D visas for Russian citizens; DNV/telework not in exception list', 'MFA: почти все визы C/D для граждан РФ ограничены; DNV/telework не в исключениях'),
  ('c0000000-0000-4000-8000-000000000069', 'BY', 'ineligible', 'MFA: Belarusian citizens are not issued visas for teleworking', 'MFA: гражданам BY не выдают визы на teleworking'),
  ('c0000000-0000-4000-8000-000000000069', 'UA', 'eligible', 'DNV if remote categories + €4,500 income met; apply via representation/VFS/PPA', 'DNV при remote-категориях и доходе €4 500; подача через представительство/VFS/PPA'),
  ('c0000000-0000-4000-8000-000000000069', 'KZ', 'eligible', 'DNV if remote categories + €4,500 income met', 'DNV при remote-категориях и доходе €4 500'),
  ('c0000000-0000-4000-8000-000000000070', 'RU', 'eligible', 'e-Residency is not a visa — still subject to programme KYC/background checks', 'e-Residency — не виза; остаётся KYC/проверка программы'),
  ('c0000000-0000-4000-8000-000000000070', 'BY', 'eligible', 'e-Residency is not a visa — KYC/background checks apply', 'e-Residency — не виза; KYC/проверка'),
  ('c0000000-0000-4000-8000-000000000070', 'UA', 'eligible', 'e-Residency + OÜ for remote company management', 'e-Residency + OÜ для удалённого управления компанией'),
  ('c0000000-0000-4000-8000-000000000070', 'KZ', 'eligible', 'e-Residency + OÜ for remote company management', 'e-Residency + OÜ для удалённого управления компанией'),
  ('c0000000-0000-4000-8000-000000000071', 'RU', 'ineligible', 'Family visas tied to DNV/visa rules — RU face same MFA visa restrictions', 'Семейные визы связаны с визовыми правилами — те же ограничения MFA для РФ'),
  ('c0000000-0000-4000-8000-000000000071', 'BY', 'ineligible', 'Teleworking-related family path blocked with BY telework visa ban', 'Семейный трек с teleworking BY заблокирован'),
  ('c0000000-0000-4000-8000-000000000071', 'UA', 'partial', 'Family visas under same conditions as DNV-holder — case-by-case', 'Семейные визы на условиях DNV-holder — case-by-case'),
  ('c0000000-0000-4000-8000-000000000071', 'KZ', 'partial', 'Family visas under same conditions as DNV-holder — case-by-case', 'Семейные визы на условиях DNV-holder — case-by-case')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000018', 'practical', 'RU/BY: DNV largely closed', 'РФ/BY: DNV почти закрыт', 'MFA restricts almost all C/D visas for RU; BY not issued teleworking visas.', 'MFA почти все C/D для РФ; BY — без teleworking виз.', 'https://vm.ee/en/consular-visa-and-travel-information/visa-information/restrictions-accepting-visa-applications', '2026-07-29', 1),
  ('a0000000-0000-4000-8000-000000000018', 'practical', 'Income €4,500 / 6 months', 'Доход €4 500 / 6 мес', 'FAQ: €4,500 gross of tax; sufficiency €150/day.', 'FAQ: €4 500 gross; достаточность €150/день.', 'https://www.e-resident.gov.ee/blog/posts/faqs-about-estonias-digital-nomad-visa/', '2026-07-29', 2),
  ('a0000000-0000-4000-8000-000000000018', 'practical', 'Second DNV up to 6 months', 'Второй DNV до 6 мес', 'Cannot renew the same visa; second application up to 6 months; max 548 days / 730.', 'Продлить ту же нельзя; вторая заявка до 6 мес; макс. 548/730.', 'https://www.e-resident.gov.ee/blog/posts/faqs-about-estonias-digital-nomad-visa/', '2026-07-29', 3),
  ('a0000000-0000-4000-8000-000000000018', 'tax', 'e-Residency ≠ tax residence', 'e-Residency ≠ налоговое резидентство', 'OÜ: 0% on undistributed profits; distributions ~22%. Living 183+ days triggers personal tax residence.', 'OÜ: 0% на нераспределённую прибыль; дивиденды ~22%. 183+ дня → личное налоговое резидентство.', 'https://www.e-resident.gov.ee/start-a-company/', '2026-07-29', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000018', 'a0000000-0000-4000-8000-000000000018', 'estonia-routes', 'Estonia route finder', 'Подбор маршрута — Эстония')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000074', 'd0000000-0000-4000-8000-000000000018', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000075', 'd0000000-0000-4000-8000-000000000018', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000076', 'd0000000-0000-4000-8000-000000000018', 'capital', 'Business / e-Residency buffer', 'Бизнес / буфер e-Residency', 3),
  ('e0000000-0000-4000-8000-000000000077', 'd0000000-0000-4000-8000-000000000018', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000074', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport — DNV is closed for RU/BY under MFA rules', 'Паспорт для подачи — DNV закрыт для РФ/BY по MFA', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000075', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Foreign employer / foreign company / clients mostly outside Estonia', 'Иностранный работодатель / foreign company / клиенты вне Эстонии', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000075', 'monthly_income_eur', 'number', 'Monthly income (EUR)', 'Месячный доход (EUR)', 'DNV threshold €4,500/month (FAQ: gross of tax)', 'Порог DNV €4 500/мес (FAQ: gross)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000075', 'has_job_offer', 'single', 'Signed job offer in Estonia?', 'Подписанный оффер работы в Эстонии?', 'Local employment is a different route — not Digital Nomad Visa', 'Локальная работа — другой маршрут, не DNV', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000076', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Useful for e-Residency + OÜ setup costs', 'Буфер на e-Residency + запуск OÜ', NULL, 1),
  ('e0000000-0000-4000-8000-000000000076', 'willing_to_invest_eur', 'number', 'Ready to put into OÜ / setup (EUR)', 'Готовы вложить в OÜ / запуск (EUR)', 'Matches e-Residency track when ≥ €2,000', 'Матчит e-Residency при ≥ €2 000', NULL, 2),
  ('e0000000-0000-4000-8000-000000000077', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000077', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, '0 если никто', NULL, 2),
  ('e0000000-0000-4000-8000-000000000077', 'has_family_in_ee', 'single', 'Family member already with Estonian stay?', 'Член семьи уже с пребыванием в Эстонии?', 'Needed for family program match', 'Нужно для матча семейной программы', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'estonia', 'estonia', 'Эстония', 'Estonia', '🇪🇪',
  'русскоязычные, интересующиеся Digital Nomad Visa или e-Residency / OÜ в Эстонии',
  'DNV €4500 RU/BY closed, e-Residency €150 OÜ 0% retained, MFA visa restrictions, Schengen D-visa',
  'ru-speaking-to-estonia', 'active',
  ARRAY['Эстония ВНЖ','Digital Nomad Эстония','e-Residency','OÜ Эстония','релокация в Эстонию'],
  ARRAY['Estonia digital nomad visa','Estonia e-Residency','Estonia OÜ tax','Эстония digital nomad','Estonia visa Russia Belarus'],
  '{"landing":"/ru/estonia","wizard":"/ru/estonia/wizard","guide":"/ru/guides/vnj-estoniya-2026-digital-nomad-e-residency"}'::jsonb,
  18
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-estonia');

-- Restore guide path after sync (function overwrites site_paths.guide to digest)
UPDATE emigro_news_topics
SET site_paths = jsonb_set(
  COALESCE(site_paths, '{}'::jsonb),
  '{guide}',
  '"/ru/guides/vnj-estoniya-2026-digital-nomad-e-residency"'::jsonb
)
WHERE key = 'estonia';
