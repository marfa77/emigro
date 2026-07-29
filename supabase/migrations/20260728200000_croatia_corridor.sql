-- Croatia corridor seed (ru-speaking-to-croatia, 2026 thresholds)
-- Digital Nomad temporary stay (max 18 months) + family reunification after principal approved
-- Income: 2.5× avg monthly net prior year = €3,622.50 (Official Gazette 3/26); family +10% of avg net each

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('HR', 'Croatia', 'Хорватия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2, url_segment, publish_status)
VALUES (
  'a0000000-0000-4000-8000-000000000016',
  'ru-speaking-to-croatia',
  'Russian-speaking → Croatia',
  'Русскоязычные → Хорватия',
  'Relocation navigator for Russian-speaking applicants targeting Croatia (Digital Nomad temporary stay up to 18 months, family after principal).',
  'Навигатор: Digital Nomad temporary stay до 18 мес (€3 622,50/мес или сбережения), семья после одобрения спонсора. Без прямого ПМЖ.',
  'RU',
  'croatia',
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
  ('a0000000-0000-4000-8000-000000000016', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000016', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000016', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000016', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000016', 'HR')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000061', 'croatia-digital-nomad', 'HR', 'LABOR', 'Croatia Digital Nomad Temporary Stay', 'Хорватия — Digital Nomad', 'Remote work for employer/own company outside Croatia. Income ≥ €3,622.50/month (2.5× avg net) or savings €43,470 (12 mo) / €65,205 (18 mo). Max 18 months; 6-month gap before new DN application. No PR path on this ground. Foreign-sourced PIT exemption while on DN.', 'Remote на работодателя/свою компанию вне HR. Доход ≥ €3 622,50/мес (2,5× avg net) или сбережения €43 470 (12) / €65 205 (18). Макс. 18 мес; 6 мес пауза перед новой DN. Без ПМЖ на этом основании. Освобождение PIT на foreign income.'),
  ('b0000000-0000-4000-8000-000000000062', 'croatia-family-reunification', 'HR', 'BOND', 'Croatia Family Reunification (with DN)', 'Хорватия — воссоединение семьи (с DN)', 'Join a digital nomad who already holds temporary stay. Applications filed before the principal is approved are rejected. Means of subsistence +10% of avg net salary per dependant.', 'Присоединение к digital nomad с уже одобренным temporary stay. Заявки до одобрения спонсора отклоняются. Содержание +10% avg net на зависимого.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000016', 'b0000000-0000-4000-8000-000000000061', 1, true),
  ('a0000000-0000-4000-8000-000000000016', 'b0000000-0000-4000-8000-000000000062', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'b0000000-0000-4000-8000-000000000061', '2026-07', '{"and":[{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3623]}]}'),
  ('c0000000-0000-4000-8000-000000000065', 'b0000000-0000-4000-8000-000000000062', '2026-07', '{"==":[{"var":"has_family_in_hr"},"yes"]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'income', 'Means of subsistence', 'Средства к существованию', '≥ €3,622.50/month (2.5× avg net; OG 3/26) via regular income/payslips 6 months OR €43,470 (12 mo) / €65,205 (18 mo) balance', 1),
  ('c0000000-0000-4000-8000-000000000064', 'documents', 'Remote only', 'Только удалёнка', 'Employer/own company not registered in HR; no work/services for Croatian employers', 2),
  ('c0000000-0000-4000-8000-000000000064', 'insurance', 'Health insurance', 'Медстраховка', 'Covering Croatia for the intended stay', 3),
  ('c0000000-0000-4000-8000-000000000064', 'timeline', 'Maximum stay', 'Максимальный срок', 'Up to 18 months; extension only if initial grant <18 (max +6 toward ceiling); then 6-month gap before new DN', 4),
  ('c0000000-0000-4000-8000-000000000065', 'family', 'Principal already approved', 'Спонсор уже одобрен', 'Family filings before DN approval of the principal are rejected (MUP)', 1),
  ('c0000000-0000-4000-8000-000000000065', 'income', 'Family uplift', 'Надбавка на семью', '+10% of average monthly net salary per additional family member / life partner', 2)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'Temporary stay + card', 'Temporary stay + карта', 'Police: ~€46.45 grant + ~€9.29 admin + ~€31.85 card; mission: ~€55.74 + optional visa D ~€93 — verify MUP', 1),
  ('c0000000-0000-4000-8000-000000000064', 'Translations / apostille', 'Переводы / апостиль', 'Often €200–500+', 2),
  ('c0000000-0000-4000-8000-000000000065', 'Application fees', 'Сборы', 'Family reunification fees — verify MUP / police station', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'document_prep', 'Income, remote proof, insurance, address', 'Доход, remote, страховка, адрес', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000064', 'application', 'Online / consulate / police (if visa-free)', 'Online / консульство / полиция (если безвиз)', 'Weeks to months — practice varies', 2),
  ('c0000000-0000-4000-8000-000000000064', 'residence', 'Register address + biometric card', 'Регистрация адреса + biometric card', 'Address soon after entry; card after biometrics', 3),
  ('c0000000-0000-4000-8000-000000000065', 'document_prep', 'Relationship proof after principal approved', 'Родство после одобрения спонсора', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000065', 'application', 'Family reunification filing', 'Подача family reunification', '1–3 months (varies)', 2),
  ('c0000000-0000-4000-8000-000000000065', 'residence', 'Family card', 'Семейная карта', 'After decision', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', 'DN: max 18 months; €3,622.50/month or €43,470 / €65,205; family +10% avg net; visa nationals cannot file at police.', '2026-07-28', 'MUP — Digital nomads', 'MUP — Digital nomads'),
  ('c0000000-0000-4000-8000-000000000065', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', 'Family may join only after DN temporary stay granted; earlier filings rejected.', '2026-07-28', 'MUP — Family with DN', 'MUP — Семья с DN')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000064', 'RU', 'eligible', 'Visa required to enter: expect consulate/online path; police filing rejected; D visa often after approval', 'Нужна виза для въезда: консульство/online; полиция отклоняет; после approve часто visa D'),
  ('c0000000-0000-4000-8000-000000000064', 'BY', 'eligible', 'Verify visa requirement and consulate jurisdiction', 'Проверьте визовый режим и юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000064', 'UA', 'eligible', 'Verify entry regime; DN open if remote/income met', 'Проверьте режим въезда; DN при remote/доходе'),
  ('c0000000-0000-4000-8000-000000000064', 'KZ', 'eligible', 'Verify entry regime', 'Проверьте режим въезда'),
  ('c0000000-0000-4000-8000-000000000065', 'RU', 'partial', 'Only after principal DN approved', 'Только после одобрения DN спонсора'),
  ('c0000000-0000-4000-8000-000000000065', 'BY', 'partial', 'Only after principal DN approved', 'Только после одобрения DN спонсора'),
  ('c0000000-0000-4000-8000-000000000065', 'UA', 'partial', 'Only after principal DN approved', 'Только после одобрения DN спонсора'),
  ('c0000000-0000-4000-8000-000000000065', 'KZ', 'partial', 'Only after principal DN approved', 'Только после одобрения DN спонсора')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000016', 'practical', 'Max 18 months then 6-month gap', 'Макс. 18 мес, затем 6 мес пауза', 'Temporary stay up to 18 months. New DN application only 6 months after expiry.', 'Temporary stay до 18 мес. Новая DN только через 6 месяцев после окончания.', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', '2026-07-28', 1),
  ('a0000000-0000-4000-8000-000000000016', 'practical', 'RU: do not file at police', 'RU: не подавать в полиции', 'Visa nationals: police applications are rejected. Use consulate or online; expect D visa after approval if needed.', 'Visa nationals: полиция отклоняет. Консульство или online; после approve часто нужна visa D.', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', '2026-07-28', 2),
  ('a0000000-0000-4000-8000-000000000016', 'tax', 'Foreign income PIT exemption', 'Освобождение PIT на foreign income', 'While on DN status, foreign-sourced income is exempt from Croatian PIT; no local HR clients.', 'На статусе DN foreign income освобождён от хорватского PIT; без местных HR-клиентов.', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', '2026-07-28', 3),
  ('a0000000-0000-4000-8000-000000000016', 'practical', 'No PR on DN ground', 'Нет ПМЖ на основании DN', 'Switch to employment, business, study or other family grounds for a settlement track.', 'Для settlement — смена статуса: работа, бизнес, учёба или иное family.', 'https://mup.gov.hr/aliens-281621/temporary-stay-of-digital-nomads-286853/286853', '2026-07-28', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000016', 'a0000000-0000-4000-8000-000000000016', 'croatia-routes', 'Croatia route finder', 'Подбор маршрута — Хорватия')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000066', 'd0000000-0000-4000-8000-000000000016', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000067', 'd0000000-0000-4000-8000-000000000016', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000068', 'd0000000-0000-4000-8000-000000000016', 'capital', 'Savings buffer', 'Сбережения', 3),
  ('e0000000-0000-4000-8000-000000000069', 'd0000000-0000-4000-8000-000000000016', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000066', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000067', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Croatia', 'Зарплата или фриланс от работодателей/клиентов вне Хорватии', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000067', 'monthly_income_eur', 'number', 'Monthly income (EUR)', 'Месячный доход (EUR)', 'DN threshold €3,622.50/month (2026 MUP)', 'Порог DN €3 622,50/мес (MUP 2026)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000067', 'has_job_offer', 'single', 'Signed job offer in Croatia?', 'Подписанный оффер работы в Хорватии?', 'Local employment is a different route — not Digital Nomad', 'Локальная работа — другой маршрут, не Digital Nomad', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000068', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'Alternative: €43,470 for 12 months or €65,205 for 18 months', 'Альтернатива: €43 470 на 12 мес или €65 205 на 18 мес', NULL, 1),
  ('e0000000-0000-4000-8000-000000000069', 'relocating_with_spouse', 'single', 'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000069', 'relocating_children_count', 'number', 'Children relocating with you', 'Сколько детей едет с вами?', NULL, '0 если никто', NULL, 2),
  ('e0000000-0000-4000-8000-000000000069', 'has_family_in_hr', 'single', 'Family member already with Croatian stay?', 'Член семьи уже с ВНЖ в Хорватии?', 'Needed for family reunification program match', 'Нужно для матча программы воссоединения', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_news_topics (
  key, url_segment, country_ru, country_en, flag, audience_ru, focus_hint_ru,
  corridor_slug, status, seo_tags, rss_queries, site_paths, sort_order
) VALUES (
  'croatia', 'croatia', 'Хорватия', 'Croatia', '🇭🇷',
  'русскоязычные, планирующие Digital Nomad temporary stay в Хорватии',
  'Digital Nomad €3622.50/mo max 18 months, 0% foreign PIT, 6-month gap, MUP, Schengen',
  'ru-speaking-to-croatia', 'active',
  ARRAY['Хорватия ВНЖ','Digital Nomad Хорватия','MUP digital nomad','релокация в Хорватию','русскоязычные'],
  ARRAY['Croatia digital nomad visa','Croatia temporary stay digital nomads','Croatia MUP digital nomad 2026','Хорватия digital nomad','Croatia nomad income threshold'],
  '{"landing":"/ru/croatia","wizard":"/ru/croatia/wizard","guide":"/ru/guides/vnj-horvatiya-2026-digital-nomad"}'::jsonb,
  16
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

SELECT emigro_sync_corridor_news_topic('ru-speaking-to-croatia');
