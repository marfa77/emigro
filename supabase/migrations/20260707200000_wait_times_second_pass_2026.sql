-- Second pass 2026: further conservative wait-time bump (+25–50% / +1–3 mo upper bound)
-- Policy: user feedback — Jul 7 estimates still too optimistic; lead with pessimistic realistic end
-- Note in copy: "по отзывам релокантов 2026 сроки часто ещё длиннее"

-- ── Portugal (D8, D7, family, student, Golden Visa) ─────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '8–24 mo. AIMA appointment + 3–6 mo. card (Lisbon often 15–24; norm: 90 d issuance)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000001',
  'c0000000-0000-4000-8000-000000000002',
  'c0000000-0000-4000-8000-000000000003'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '8–24 mo. AIMA appointment + 3–6 mo. card (Lisbon often 15–24)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000028'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '8–24 months (AIMA ARI backlog; separate queue from D7/D8)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000025'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 months after biometrics'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'After arrival, first-time biometric appointments at AIMA typically take 8–24 months in 2026 (Lisbon area often 15–24; Porto 10–18; regional delegations 8–16). Card issuance after biometrics: often 3–6 months (statutory max 90 days for renewals; 6 months for first issuance). Relocator feedback in 2026 suggests waits are often longer still — book as early as possible; status is protected while waiting if registered in the portal.',
  body_ru = 'После приезда запись на первичную биометрию в AIMA в 2026 обычно занимает **8–24 месяца** (Лиссабон/большая область — **15–24**; Порту — **10–18**; региональные отделения — **8–16**). Выдача карты после биометрии — **3–6 месяцев** (по закону до 90 дней на продление; до 6 мес. на первичную выдачу). **По отзывам релокантов 2026 сроки часто ещё длиннее** — записывайтесь как можно раньше; при регистрации в портале статус защищён на время ожидания.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000001'
  AND title_en = 'AIMA appointments';

-- ── Spain (DNV, NLV, family, student) ───────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 mo. end-to-end (cita previa 2–4 mo. + card 8–12 wk; Madrid/BCN often 6–12 mo.)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000007',
  'c0000000-0000-4000-8000-000000000008',
  'c0000000-0000-4000-8000-000000000009'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 mo. end-to-end (Madrid/BCN often 6–12 mo.)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000029'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'TIE fingerprint appointments (cita previa) in 2026: typically 6–16 weeks to book in less saturated provinces; Madrid, Barcelona and Valencia often 3–6 months for a slot, with end-to-end card-in-hand 6–12 months in saturated cities. Relocator feedback suggests waits often exceed these ranges. The 30-day post-arrival deadline is tight — document failed booking attempts.',
  body_ru = 'Запись на TIE (cita previa, отпечатки) в 2026: в менее загруженных провинциях **6–16 недель** до слота; Madrid, Barcelona, Valencia — **3–6 месяцев** на запись, полный цикл до карты **6–12 месяцев**. **По отзывам релокантов 2026 сроки часто ещё длиннее.** 30-дневный срок после въезда жёсткий — сохраняйте скриншоты неудачных попыток записи.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000002'
  AND title_en = 'TIE appointment backlog';

-- ── France ───────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 months after arrival (Paris/IDF often 6–12; OFII 3–8 wk)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000010'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 months after arrival (province faster)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000011'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 months (Paris/IDF often longer)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000012'
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'After arrival: OFII registration and medical visit within 3 months (typically 3–8 weeks). Carte de séjour at prefecture: 4–12 months in 2026 — Paris/Île-de-France often 6–12 months; provinces often 3–6 months. Relocator feedback suggests waits often longer. Book prefecture appointments early; récépissé covers legal stay while waiting.',
  body_ru = 'После приезда: регистрация OFII и медосмотр в течение 3 месяцев (обычно **3–8 недель**). Carte de séjour в префектуре: **4–12 месяцев** в 2026 — Paris/Île-de-France **6–12**, провинции **3–6**. **По отзывам релокантов 2026 сроки часто ещё длиннее.** Записывайтесь заранее; récépissé подтверждает легальный статус на время ожидания.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000003'
  AND title_en = 'Prefecture appointments';

-- ── Italy ────────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 months (questura appointment + permesso; Milan/Rome longer)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000013',
  'c0000000-0000-4000-8000-000000000014',
  'c0000000-0000-4000-8000-000000000015'
)
AND step_type = 'residence';

-- ── Germany ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 months (consulate visa; 8–20 wk typical)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000016',
  'c0000000-0000-4000-8000-000000000017'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 mo. ABH Termin queue + 6–16 wk card (Berlin 6–14 mo.; Munich 8–14 mo.)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000016'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '6–16 wk card after Termin (ABH queue 4–12 mo. in major cities)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000017'
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '5–10 months (consulate)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000018'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 mo. ABH queue + 6–16 wk card'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000018',
  'c0000000-0000-4000-8000-000000000030'
)
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Ausländerbehörde appointment waits in 2026: Berlin LEA 24–36 weeks (6–14 months) just for initial Termin; Munich KVR up to 8–14 months; Hamburg 16–20 weeks; Frankfurt 12–16 weeks; smaller cities 6–16 weeks. Relocator feedback suggests waits often longer. Apply for renewal 8–12 weeks before permit expiry; Fiktionsbescheinigung if permit expires during processing. Card issuance after Termin: typically 6–16 weeks.',
  body_ru = 'Очереди Ausländerbehörde в 2026: Berlin LEA **24–36 недель (6–14 мес.)** только на первый Termin; Munich KVR до **8–14 месяцев**; Hamburg **16–20 нед.**; Frankfurt **12–16 нед.**; малые города **6–16 нед.** **По отзывам релокантов 2026 сроки часто ещё длиннее.** Продление подавайте за **8–12 нед.** до истечения permit; при просрочке — **Fiktionsbescheinigung**. Карта после Termin: **6–16 недель**.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000005'
  AND title_en = 'Ausländerbehörde wait times';

-- ── Netherlands (slight buffer) ──────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '5–14 weeks (IND; reliable vs EU peers)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000019',
  'c0000000-0000-4000-8000-000000000020'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–7 months (IND + MVV if applicable)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000021'
AND step_type = 'application';

-- ── Scandinavia ──────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '3–8 months (Migrationsverket backlog varies)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000022'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–7 months (SIRI processing)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000023'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–10 months (national authority varies by country)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000024'
AND step_type = 'application';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Work permit processing in 2026: Sweden Migrationsverket typically 3–8 months (backlogs vary); Denmark SIRI 3–7 months; Norway UDI often 4–8 months for skilled workers. Personnummer/CPR after arrival: 1–4 weeks. Relocator feedback suggests peak-season waits often at upper bound or longer.',
  body_ru = 'Рассмотрение work permit в 2026: Sweden Migrationsverket **3–8 месяцев**; Denmark SIRI **3–7 месяцев**; Norway UDI для skilled workers **4–8 месяцев**. Personnummer/CPR после приезда: **1–4 недели**. **По отзывам релокантов 2026 в пиковые сезоны сроки часто ещё длиннее** — закладывайте верхнюю границу.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000007'
  AND category = 'timeline';

-- ── Czechia ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 mo. (Prague MOI queues; law: 60 d after complete filing)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000038',
  'c0000000-0000-4000-8000-000000000039',
  'c0000000-0000-4000-8000-000000000041',
  'c0000000-0000-4000-8000-000000000042'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '5–12 months (family reunification; law up to 270 d)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000040'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–5 mo. after decision (card pickup)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000038',
  'c0000000-0000-4000-8000-000000000039',
  'c0000000-0000-4000-8000-000000000040',
  'c0000000-0000-4000-8000-000000000041',
  'c0000000-0000-4000-8000-000000000042'
)
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Statutory decision deadlines: 60 days for most in-country applications (from 2026 for Single Permit). In practice Prague MOI appointment queues add 3–5 months before filing; total realistic wait 4–9 months for employee card/Blue Card. Brno and regional offices often faster. Relocator feedback suggests Prague waits often at upper bound.',
  body_ru = 'По закону решение — **60 дней** для большинства подач внутри страны (Single Permit с 2026). На практике очередь на Termín в Prague MOI добавляет **3–5 месяцев** до подачи; реалистично **4–9 месяцев** на employee card/Blue Card. Brno и региональные отделения быстрее. **По отзывам релокантов 2026 в Prague сроки часто ещё длиннее.**',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000009'
  AND title_en = 'MOI appointment queues';

-- ── Austria ──────────────────────────────────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = '4–9 mo. (MA35 Vienna queues; law often 1–3 mo. after filing)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000043',
  'c0000000-0000-4000-8000-000000000044',
  'c0000000-0000-4000-8000-000000000046',
  'c0000000-0000-4000-8000-000000000047'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '5–12 months (family reunification)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000045'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–5 mo. after decision'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000043',
  'c0000000-0000-4000-8000-000000000044',
  'c0000000-0000-4000-8000-000000000045',
  'c0000000-0000-4000-8000-000000000046',
  'c0000000-0000-4000-8000-000000000047'
)
AND step_type = 'residence';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'MA35 Vienna and other major-city immigration offices: appointment waits often 3–6 months in 2026; processing after complete filing typically 1–3 months (statutory). Salzburg, Graz, Linz — shorter queues but fewer vacancies. Relocator feedback suggests Vienna waits often longer. Book Termin immediately after visa entry.',
  body_ru = 'MA35 Vienna и крупные города: запись на Termin **3–6 месяцев** в 2026; рассмотрение после полной подачи **1–3 месяца** (по регламенту). Salzburg, Graz, Linz — короче очереди, но меньше вакансий. **По отзывам релокантов 2026 в Vienna сроки часто ещё длиннее.** Бронируйте Termin сразу после въезда.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000010'
  AND title_en = 'MA35 / Magistrat wait times';

-- ── Poland (second pass — worst offender) ────────────────────────────────────
UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 6–18 mo. (Warsaw 12–18+; Kraków 6–12; Wrocław 5–10; smaller 3–8); law: 60 d–3 mo.'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 8–18 mo. (Warsaw 12–18+; Kraków 6–12); law: 60 d–3 mo.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000034'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 8–15 mo. (Mazowieckie 12–18+; family reunification); law: 60 d–3 mo.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000035'
AND step_type = 'application';

-- residence card pickup for all PL programs:
UPDATE emigro_program_timeline_steps
SET duration_text = '3–5 mo. after decision (card pickup queue; biometrics slot 2–4 mo. in major cities)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000035',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '4–12 weeks (urząd pracy backlog varies)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000033'
AND step_type = 'document_prep';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Under the Foreigners Act (UoC), voivodeship decisions should be issued within 60 days (up to 3 months in some cases). In practice in 2026, major offices systematically exceed these deadlines. Realistic ranges: Mazowieckie (Warsaw) 12–18+ months; Małopolskie (Kraków) 6–12 months; Dolnośląskie (Wrocław) 5–10 months; smaller voivodeships 3–8 months. Biometrics appointment slots in Warsaw/Kraków often add 2–4 months before filing. Card pickup after decision: 3–5 months. Relocator feedback in 2026 suggests waits are often longer still. Book early; respond to eDoręczenia within 7 days.',
  body_ru = 'По ustawie o cudzoziemcach (UoC) решение voivodeship — до 60 дней (в ряде случаев до 3 месяцев). **Реалистично 2026:** Mazowieckie (Варшава) **12–18+ мес.**; Małopolskie (Краков) **6–12 мес.**; Dolnośląskie (Вроцлав) **5–10 мес.**; менее загруженные воеводства **3–8 мес.** Слоты на биометрию в Варшаве/Кракове часто добавляют **2–4 мес.** до подачи. Выдача карты после решения — **3–5 мес.** **По отзывам релокантов 2026 сроки часто ещё длиннее.** Отвечайте на eDoręczenia в срок (обычно 7 дней).',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Voivodeship wait times';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Standard naturalization: typically 3 years with Polish Card or 10 years continuous legal residence; B1 Polish and stable income required. Realistic 2026: wojewoda decision often 15–30 months after complete filing (statutory limit ~3 months). Plan language exam (B1) 12–18 months from zero.',
  body_ru = 'Стандарт: 3 года с Kartą Polaka или 10 лет легального проживания; нужен польский B1 и стабильный доход. **Реалистично 2026:** решение wojewoda после подачи **15–30 мес.** (по закону до ~3 мес.). Экзамен B1 с нуля — закладывайте **12–18 мес.**',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Naturalization (B1 Polish)';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'National visa D (work/study) via e-Konsulat: realistic 2026 end-to-end 3–6 months — appointment wait 3–10 weeks (small posts) to 3–5 months (Istanbul, Yerevan, Tbilisi, high-demand slots); processing after filing 6–10 weeks (law: 15–30 days). Start 4+ months before planned travel.',
  body_ru = 'D-виза (work/study) через e-Konsulat: **реалистично 2026: 3–6 мес.** — запись **3–10 нед.** (малые посты) до **3–5 мес.** (Стамбул, Ереван, Тбилиси, дефицит слотов); рассмотрение после подачи **6–10 нед.** (по закону **15–30 дн.**). Начинайте за **4+ мес.** до планируемого въезда.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Consulate D-visa appointment backlog';
