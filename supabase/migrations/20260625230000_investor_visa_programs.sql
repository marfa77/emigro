-- Investor / Golden Visa programs (PT, ES, IT) — 2026 thresholds, no real-estate routes

INSERT INTO emigro_requirement_types (code, label_en, label_ru) VALUES
  ('min_investment_eur', 'Minimum investment', 'Минимальная инвестиция'),
  ('citizenship', 'Citizenship path', 'Путь к гражданству'),
  ('timeline', 'Timeline note', 'Сроки')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000022', 'portugal-golden-visa', 'PT', 'CAPITAL',
   'Portugal Golden Visa (ARI)',
   'Португалия — Golden Visa (ARI)',
   'Residence by qualifying capital investment (funds, company, research, culture). Real-estate route closed since Oct 2023.',
   'ВНЖ через капитальные инвестиции (фонды, компания, НИОКР, культура). Маршрут через недвижимость закрыт с октября 2023.'),
  ('b0000000-0000-4000-8000-000000000023', 'spain-residence-by-investment', 'ES', 'CAPITAL',
   'Spain Residence by Investment',
   'Испания — ВНЖ через инвестиции',
   'Golden visa via €1M+ business/fund/bonds or €2M bank deposit. Real-estate route closed April 2024.',
   'Golden visa при инвестиции €1M+ (бизнес/фонды/облигации) или депозите €2M. Недвижимость закрыта с апреля 2024.'),
  ('b0000000-0000-4000-8000-000000000024', 'italy-investor-visa', 'IT', 'CAPITAL',
   'Italy Investor Visa',
   'Италия — инвесторская виза',
   'Two-year investor residence: €250k innovative startup, €500k company, €1M philanthropic, or €2M government bonds.',
   'Инвесторский ВНЖ на 2 года: €250k в инновационный стартап, €500k в компанию, €1M благотворительность или €2M гособлигации.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000022', 4, false),
  ('a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000023', 4, false),
  ('a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000024', 4, false)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000025', 'b0000000-0000-4000-8000-000000000022', '2026-06',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"willing_to_invest_eur"},500000]}]}'),
  ('c0000000-0000-4000-8000-000000000026', 'b0000000-0000-4000-8000-000000000023', '2026-06',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"willing_to_invest_eur"},1000000]}]}'),
  ('c0000000-0000-4000-8000-000000000027', 'b0000000-0000-4000-8000-000000000024', '2026-06',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{">=":[{"var":"willing_to_invest_eur"},250000]}]}')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000025', 'min_investment_eur', 'Qualifying investment', 'Квалифицирующая инвестиция', 'от €500 000: CMVM-фонд / капитал компании (5 рабочих мест) / €1,5M перевод в PT / €500k НИОКР / €250k культура', 1),
  ('c0000000-0000-4000-8000-000000000025', 'documents', 'Real estate', 'Недвижимость', 'Покупка жилья для ARI/GV — закрыта (Law 56/2023)', 2),
  ('c0000000-0000-4000-8000-000000000025', 'timeline', 'Physical presence', 'Физическое присутствие', '7 дней/год для продления ARI (ориентир)', 3),
  ('c0000000-0000-4000-8000-000000000025', 'citizenship', 'Citizenship horizon', 'Горизонт гражданства', '10 лет легального проживания для большинства заявителей (реформа мая 2026)', 4),
  ('c0000000-0000-4000-8000-000000000026', 'min_investment_eur', 'Investment options', 'Варианты инвестиций', '€1M: акции испанской компании / инвестфонд / гособлигации; или €2M депозит в испанском банке', 1),
  ('c0000000-0000-4000-8000-000000000026', 'documents', 'Real estate', 'Недвижимость', 'Инвестиции в недвижимость для autorización de residencia — закрыты (апр. 2024)', 2),
  ('c0000000-0000-4000-8000-000000000026', 'timeline', 'Residence card', 'Карта резидента', 'Первичный срок 3 года, продление при сохранении инвестиции', 3),
  ('c0000000-0000-4000-8000-000000000027', 'min_investment_eur', 'Investment tiers', 'Уровни инвестиций', '€250k инновационный стартап; €500k итальянская компания; €1M благотворительность; €2M гособлигации', 1),
  ('c0000000-0000-4000-8000-000000000027', 'documents', 'Nulla osta', 'Nulla osta', 'Предварительное одобрение Комитета по инвесторской визе (2–4 мес.)', 2),
  ('c0000000-0000-4000-8000-000000000027', 'timeline', 'Validity', 'Срок', 'Виза 2 года, продление при сохранении инвестиции', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000025', 'Government & legal (indicative)', 'Госпошлины и юристы', '€5 000–15 000 + инвестиция', 1),
  ('c0000000-0000-4000-8000-000000000025', 'Fund fees (annual)', 'Комиссии фонда', '1–2% / год (зависит от фонда)', 2),
  ('c0000000-0000-4000-8000-000000000026', 'Legal & due diligence', 'Юристы и due diligence', '€8 000–25 000', 1),
  ('c0000000-0000-4000-8000-000000000027', 'Committee & consular fees', 'Комитет и консульство', '€2 000–8 000 + инвестиция', 1)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000025', 'document_prep', 'Investment structure & NIF', 'Структура инвестиции и NIF', '1–3 месяца', 1),
  ('c0000000-0000-4000-8000-000000000025', 'application', 'ARI application via AIMA', 'Подача ARI в AIMA', '3–12 месяцев', 2),
  ('c0000000-0000-4000-8000-000000000025', 'residence', 'Golden Visa card', 'Карта Golden Visa', '2–6 месяцев после одобрения', 3),
  ('c0000000-0000-4000-8000-000000000026', 'document_prep', 'Investment proof & background', 'Доказательство инвестиции и бэкграунд', '2–4 месяца', 1),
  ('c0000000-0000-4000-8000-000000000026', 'application', 'Consulate / UGE submission', 'Подача в консульство / UGE', '2–6 месяцев', 2),
  ('c0000000-0000-4000-8000-000000000026', 'residence', 'TIE investor', 'TIE инвестора', '2–4 месяца', 3),
  ('c0000000-0000-4000-8000-000000000027', 'document_prep', 'Nulla osta dossier', 'Досье для nulla osta', '1–2 месяца', 1),
  ('c0000000-0000-4000-8000-000000000027', 'application', 'Investor Committee approval', 'Одобрение Investor Committee', '2–4 месяца', 2),
  ('c0000000-0000-4000-8000-000000000027', 'residence', 'Investor residence permit', 'Инвесторский ВНЖ', '2–3 месяца', 3)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000025',
   'https://aima.gov.pt/en/residence-permit/residence-permit-for-investment-activity-ari',
   'ARI — residence for investment activity; qualifying routes include regulated investment funds and company capital (real estate route abolished).',
   '2026-06-25', 'AIMA — ARI / Golden Visa', 'AIMA — ARI / Golden Visa'),
  ('c0000000-0000-4000-8000-000000000025',
   'https://vistos.mne.gov.pt/en/national-visas/general-information/residence-visa-for-investment-purposes',
   'National visa for investment purposes — gateway before ARI residence permit.',
   '2026-06-25', 'MNE investment visa', 'MNE — инвестиционная виза'),
  ('c0000000-0000-4000-8000-000000000026',
   'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074',
   'Law 14/2013 — entrepreneurs and investors; real-estate investment option removed by subsequent reforms (2024).',
   '2026-06-25', 'Ley de Emprendedores (BOE)', 'Ley de Emprendedores'),
  ('c0000000-0000-4000-8000-000000000027',
   'https://www.investorvisa.it/',
   'Italy investor visa — minimum €250,000 in innovative startup; committee nulla osta required.',
   '2026-06-25', 'Italy Investor Visa portal', 'Портал Italy Investor Visa')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000025', 'RU', 'eligible', 'Capital must be traceable; enhanced due diligence', 'Капитал с прозрачным происхождением; усиленная проверка'),
  ('c0000000-0000-4000-8000-000000000025', 'BY', 'partial', 'Check consulate and source-of-funds', 'Проверить консульство и источник средств'),
  ('c0000000-0000-4000-8000-000000000025', 'UA', 'partial', 'Check consulate jurisdiction', 'Уточнить юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000025', 'KZ', 'partial', 'Check consulate jurisdiction', 'Уточнить юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000026', 'RU', 'eligible', 'Apply where consulate accepts; strict AML', 'Подача где принимают; строгий AML'),
  ('c0000000-0000-4000-8000-000000000026', 'BY', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000026', 'UA', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000026', 'KZ', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000027', 'RU', 'eligible', 'Nulla osta via Investor Visa Committee', 'Nulla osta через Investor Visa Committee'),
  ('c0000000-0000-4000-8000-000000000027', 'BY', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000027', 'UA', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000027', 'KZ', 'partial', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Wizard: investment amount question (hub uses hub-capital module in code; corridor wizards in DB)
INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000003', 'willing_to_invest_eur', 'number',
   'Capital available for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)',
   'Golden Visa / investor visa — not passive income (D7). Real estate GV routes closed in PT/ES.',
   'Golden Visa / инвесторская виза — не пассивный доход (D7). GV через недвижимость в PT/ES закрыт.',
   NULL, 3),
  ('e0000000-0000-4000-8000-000000000007', 'willing_to_invest_eur', 'number',
   'Capital available for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)',
   'Spain investor residence — €1M+ options; real estate closed 2024.',
   'Испания — инвестиционный ВНЖ от €1M; недвижимость закрыта с 2024.',
   NULL, 3),
  ('e0000000-0000-4000-8000-000000000015', 'willing_to_invest_eur', 'number',
   'Capital available for investment route (EUR)', 'Капитал для инвестиционного маршрута (EUR)',
   'Italy investor visa from €250,000 (innovative startup).',
   'Италия — инвесторская виза от €250 000 (инновационный стартап).',
   NULL, 3)
ON CONFLICT (module_id, question_key) DO NOTHING;

-- Digest: Portugal ARI overview
INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'practical', 'Golden Visa (ARI) — 2026 options',
   'Golden Visa (ARI) — варианты 2026',
   'Real-estate ARI is closed. Active routes include €500k regulated funds, €500k company capital (5 jobs), €1.5M transfer, research and cultural options. Citizenship path extended to 10 years for most applicants (May 2026).',
   'ARI через недвижимость закрыт. Действуют €500k в регулируемые фонды, €500k в капитал компании (5 рабочих мест), €1,5M перевод, НИОКР и культура. Путь к гражданству — 10 лет для большинства (май 2026).',
   'https://aima.gov.pt/en/residence-permit/residence-permit-for-investment-activity-ari', '2026-06-25', 6)
ON CONFLICT DO NOTHING;
