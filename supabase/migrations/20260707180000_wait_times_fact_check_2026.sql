-- Fact-check 2026: conservative wait-time estimates across corridors
-- Policy: show realistic 2026 ranges; keep official norm in parentheses

-- ── Portugal (D8, D7, family, student) ─────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (consulate slot + review)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000001',
  'c0000000-0000-4000-8000-000000000002',
  'c0000000-0000-4000-8000-000000000003'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '6–18 mo. AIMA appointment + 2–4 mo. card (Lisbon often 12–18; norm: 90 d issuance)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000001',
  'c0000000-0000-4000-8000-000000000002',
  'c0000000-0000-4000-8000-000000000003'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '6–18 mo. AIMA appointment + 2–4 mo. card (Lisbon often 12–18)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000028'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'After arrival, first-time biometric appointments at AIMA typically take 6–18 months in 2026 (Lisbon area often 12–18; Porto 8–14; regional delegations 6–12). Card issuance after biometrics: often 2–4 months (statutory max 90 days for renewals; 6 months for first issuance). Book as early as possible; status is protected while waiting if registered in the portal.',
  body_ru = 'После приезда запись на первичную биометрию в AIMA в 2026 обычно занимает **6–18 месяцев** (Лиссабон/большая область — **12–18**; Порту — **8–14**; региональные отделения — **6–12**). Выдача карты после биометрии — **2–4 месяца** (по закону до 90 дней на продление; до 6 мес. на первичную выдачу). Записывайтесь как можно раньше; при регистрации в портале статус защищён на время ожидания.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000001'
  AND title_en = 'AIMA appointments';

-- ── Spain (DNV, NLV, family, student) ─────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (consulate; UGE faster if already in ES)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000007',
  'c0000000-0000-4000-8000-000000000008',
  'c0000000-0000-4000-8000-000000000009'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 mo. end-to-end (cita previa 1–3 mo. + card 6–10 wk; Madrid/BCN often 4–8 mo.)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000007',
  'c0000000-0000-4000-8000-000000000008',
  'c0000000-0000-4000-8000-000000000009'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 mo. end-to-end (Madrid/BCN often 4–8 mo.)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000029'
AND step_type = 'residence';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000002', 'practical', 'TIE appointment backlog', 'Очереди на TIE',
  'TIE fingerprint appointments (cita previa) in 2026: typically 4–12 weeks to book in less saturated provinces; Madrid, Barcelona and Valencia often 2–4 months for a slot, with end-to-end card-in-hand 4–8 months in saturated cities. The 30-day post-arrival deadline is tight — document failed booking attempts. Regularisation programme adds pressure through 2026.',
  'Запись на TIE (cita previa, отпечатки) в 2026: в менее загруженных провинциях **4–12 недель** до слота; Madrid, Barcelona, Valencia — **2–4 месяца** на запись, полный цикл до карты **4–8 месяцев**. 30-дневный срок после въезда жёсткий — сохраняйте скриншоты неудачных попыток записи. Программа легализации 2026 усиливает нагрузку.',
  'https://sede.administracionespublicas.gob.es/', '2026-07-07', 6
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000002' AND title_en = 'TIE appointment backlog'
);

-- ── France ───────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (consulate backlog varies)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000010',
  'c0000000-0000-4000-8000-000000000011'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 months after arrival (Paris/IDF often 4–8; OFII 2–6 wk)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000010'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–6 months after arrival (province faster)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000011'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–10 months (consulate + OFII)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000012'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 months (Paris/IDF often longer)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000012'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'After arrival: OFII registration and medical visit within 3 months (typically 2–6 weeks). Carte de séjour at prefecture: 3–8 months in 2026 — Paris/Île-de-France often 4–8 months; provinces often 2–4 months. Book prefecture appointments early; récépissé covers legal stay while waiting.',
  body_ru = 'После приезда: регистрация OFII и медосмотр в течение 3 месяцев (обычно **2–6 недель**). Carte de séjour в префектуре: **3–8 месяцев** в 2026 — Paris/Île-de-France **4–8**, провинции **2–4**. Записывайтесь заранее; récépissé подтверждает легальный статус на время ожидания.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000003'
  AND title_en = 'Prefecture appointments';

-- ── Italy ────────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (nulla osta + consulate)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000013',
  'c0000000-0000-4000-8000-000000000014',
  'c0000000-0000-4000-8000-000000000015'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 months (questura appointment + permesso; Milan/Rome longer)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000013',
  'c0000000-0000-4000-8000-000000000014',
  'c0000000-0000-4000-8000-000000000015'
)
AND step_type = 'residence';

-- ── Germany ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (consulate visa; 6–16 wk typical)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000016',
  'c0000000-0000-4000-8000-000000000017'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 mo. ABH Termin queue + 4–12 wk card (Berlin 5–8 mo.; Munich 6–12 mo.)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000016'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '2–6 weeks card after Termin (ABH queue 3–8 mo. in major cities)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000017'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–8 months (consulate)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000018'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 mo. ABH queue + 4–12 wk card'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000018'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 mo. ABH queue + 4–12 wk card (Berlin/Munich longer)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000030'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Ausländerbehörde appointment waits in 2026: Berlin LEA 20–30 weeks (5–8 months) just for initial Termin; Munich KVR up to 8–12 months; Hamburg 12–16 weeks; Frankfurt 8–12 weeks; smaller cities 4–12 weeks. Apply for renewal 8–12 weeks before permit expiry; Fiktionsbescheinigung if permit expires during processing. Card issuance after Termin: typically 4–12 weeks.',
  body_ru = 'Очереди Ausländerbehörde в 2026: Berlin LEA **20–30 недель (5–8 мес.)** только на первый Termin; Munich KVR до **8–12 месяцев**; Hamburg **12–16 нед.**; Frankfurt **8–12 нед.**; малые города **4–12 нед.** Продление подавайте за **8–12 нед.** до истечения permit; при просрочке — **Fiktionsbescheinigung**. Карта после Termin: **4–12 недель**.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000005'
  AND title_en = 'Ausländerbehörde wait times';

-- ── Netherlands (IND is relatively fast; slight buffer) ──────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–10 weeks (IND; reliable vs EU peers)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000019',
  'c0000000-0000-4000-8000-000000000020'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–6 months (IND + MVV if applicable)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000021'
AND step_type = 'application';

-- ── Scandinavia ──────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–6 months (Migrationsverket backlog varies)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000022'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '2–5 months (SIRI processing)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000023'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 months (national authority varies by country)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000024'
AND step_type = 'application';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Work permit processing in 2026: Sweden Migrationsverket typically 2–6 months (backlogs vary); Denmark SIRI 2–5 months; Norway UDI often 3–6 months for skilled workers. Personnummer/CPR after arrival: 1–4 weeks. Plan for longer waits in peak seasons.',
  body_ru = 'Рассмотрение work permit в 2026: Sweden Migrationsverket **2–6 месяцев**; Denmark SIRI **2–5 месяцев**; Norway UDI для skilled workers **3–6 месяцев**. Personnummer/CPR после приезда: **1–4 недели**. В пиковые сезоны закладывайте верхнюю границу.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000007'
  AND category = 'timeline';

-- ── Czechia ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '3–6 mo. (Prague MOI queues; law: 60 d after complete filing)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000038',
  'c0000000-0000-4000-8000-000000000039',
  'c0000000-0000-4000-8000-000000000041',
  'c0000000-0000-4000-8000-000000000042'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 months (family reunification; law up to 270 d)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000040'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 mo. after decision (card pickup)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000038',
  'c0000000-0000-4000-8000-000000000039',
  'c0000000-0000-4000-8000-000000000040',
  'c0000000-0000-4000-8000-000000000041',
  'c0000000-0000-4000-8000-000000000042'
)
AND step_type = 'residence';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000009', 'practical', 'MOI appointment queues', 'Очереди MOI',
  'Statutory decision deadlines: 60 days for most in-country applications (from 2026 for Single Permit). In practice Prague MOI appointment queues add 2–4 months before filing; total realistic wait 3–6 months for employee card/Blue Card. Brno and regional offices often faster.',
  'По закону решение — **60 дней** для большинства подач внутри страны (Single Permit с 2026). На практике очередь на Termín в Prague MOI добавляет **2–4 месяца** до подачи; реалистично **3–6 месяцев** на employee card/Blue Card. Brno и региональные отделения быстрее.',
  'https://imigration.gov.cz/', '2026-07-07', 6
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000009' AND title_en = 'MOI appointment queues'
);

-- ── Austria ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '3–6 mo. (MA35 Vienna queues; law often 1–3 mo. after filing)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000043',
  'c0000000-0000-4000-8000-000000000044',
  'c0000000-0000-4000-8000-000000000046',
  'c0000000-0000-4000-8000-000000000047'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–8 months (family reunification)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000045'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 mo. after decision'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000043',
  'c0000000-0000-4000-8000-000000000044',
  'c0000000-0000-4000-8000-000000000045',
  'c0000000-0000-4000-8000-000000000046',
  'c0000000-0000-4000-8000-000000000047'
)
AND step_type = 'residence';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000010', 'practical', 'MA35 / Magistrat wait times', 'Очереди MA35 / Magistrat',
  'MA35 Vienna and other major-city immigration offices: appointment waits often 2–4 months in 2026; processing after complete filing typically 1–3 months (statutory). Salzburg, Graz, Linz — shorter queues but fewer vacancies. Book Termin immediately after visa entry.',
  'MA35 Vienna и крупные города: запись на Termin **2–4 месяца** в 2026; рассмотрение после полной подачи **1–3 месяца** (по регламенту). Salzburg, Graz, Linz — короче очереди, но меньше вакансий. Бронируйте Termin сразу после въезда.',
  'https://www.oead.at/', '2026-07-07', 6
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000010' AND title_en = 'MA35 / Magistrat wait times'
);

-- ── Poland (sync residence card step; application already updated) ───────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 mo. after decision (card pickup queue)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000035',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 months (family reunification; Mazowieckie often 12+ mo.)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000035'
AND step_type = 'application';

-- ── Portugal Golden Visa ─────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '6–18 months (AIMA ARI backlog; separate queue from D7/D8)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000025'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–6 months after biometrics'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
AND step_type = 'residence';
