-- Poland 2026: conservative inflated wait-time estimates (user feedback vs official norms)
-- Policy: lead with realistic range; statutory deadline in parentheses

UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 4–14 mo. (Warsaw 8–14; Kraków 4–10; Wrocław 4–8; smaller 2–6); law: 60 d–3 mo.'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 6–14 mo. (Warsaw 8–14; Kraków 5–10); law: 60 d–3 mo.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000034'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = 'Realistic 2026: 6–12 mo. (Mazowieckie 8–14); law: 60 d–3 mo.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000035'
AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET duration_text = '2–4 mo. after decision (card pickup queue; biometrics slot 1–3 mo. in major cities)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000035',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'residence';

UPDATE emigro_program_timeline_steps
SET duration_text = '3–10 weeks (urząd pracy backlog varies)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000033'
AND step_type = 'document_prep';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Under the Foreigners Act (UoC), voivodeship decisions should be issued within 60 days (up to 3 months in some cases). In practice in 2026, major offices systematically exceed these deadlines. Realistic ranges: Mazowieckie (Warsaw) 8–14 months; Małopolskie (Kraków) 4–10 months; Dolnośląskie (Wrocław) 4–8 months; smaller voivodeships 2–6 months. Biometrics appointment slots in Warsaw/Kraków often add 1–3 months before filing. Card pickup after decision: 2–4 months. Book early; respond to eDoręczenia within 7 days.',
  body_ru = 'По ustawie o cudzoziemcach (UoC) решение voivodeship — до 60 дней (в ряде случаев до 3 месяцев). **Реалистично 2026:** Mazowieckie (Варшава) **8–14 мес.**; Małopolskie (Краков) **4–10 мес.**; Dolnośląskie (Вроцлав) **4–8 мес.**; менее загруженные воеводства **2–6 мес.** Слоты на биометрию в Варшаве/Кракове часто добавляют **1–3 мес.** до подачи. Выдача карты после решения — **2–4 мес.** Отвечайте на eDoręczenia в срок (обычно 7 дней).',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Voivodeship wait times';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Register address (zameldowanie) within 30 days of moving in. Realistic 2026: 2–6 weeks end-to-end — urząd gminy appointment wait (1–4 weeks in cities), landlord consent (zgoda właściciela) often 1–3 weeks, then same-day meldunek. PESEL usually issued at meldunek; separate application adds 1–3 weeks.',
  body_ru = 'Zameldowanie — в течение 30 дней после заселения (срок по закону). **Реалистично 2026: 2–6 нед.** — запись в urząd gminy (**1–4 нед.** в городах), **zgoda właściciela** часто **1–3 нед.**, затем meldunek в день визита. PESEL обычно при meldunek; отдельная заявка +**1–3 нед.**',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'PESEL and meldunek';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Standard naturalization: typically 3 years with Polish Card or 10 years continuous legal residence; B1 Polish and stable income required. Realistic 2026: wojewoda decision often 12–24 months after complete filing (statutory limit ~3 months). Plan language exam (B1) 12–18 months from zero.',
  body_ru = 'Стандарт: 3 года с Kartą Polaka или 10 лет легального проживания; нужен польский B1 и стабильный доход. **Реалистично 2026:** решение wojewoda после подачи **12–24 мес.** (по закону до ~3 мес.). Экзамен B1 с нуля — закладывайте **12–18 мес.**',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Naturalization (B1 Polish)';

INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order)
SELECT 'a0000000-0000-4000-8000-000000000008', 'practical', 'Consulate D-visa appointment backlog', 'Очереди на D-визу в консульстве PL',
  'National visa D (work/study) via e-Konsulat: realistic 2026 end-to-end 2–5 months — appointment wait 2–8 weeks (small posts) to 2–4 months (Istanbul, Yerevan, Tbilisi, high-demand slots); processing after filing 4–8 weeks (law: 15–30 days). Start 3+ months before planned travel.',
  'D-виза (work/study) через e-Konsulat: **реалистично 2026: 2–5 мес.** — запись **2–8 нед.** (малые посты) до **2–4 мес.** (Стамбул, Ереван, Тбилиси, дефицит слотов); рассмотрение после подачи **4–8 нед.** (по закону **15–30 дн.**). Начинайте за **3+ мес.** до планируемого въезда.',
  'https://www.gov.pl/web/diplomacy/visas', '2026-07-07', 7
WHERE NOT EXISTS (
  SELECT 1 FROM emigro_corridor_digest_items
  WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008' AND title_en = 'Consulate D-visa appointment backlog'
);
