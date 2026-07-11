-- Poland corridor: fix citizenship timeline — Karta Polaka (1 year on PMJ) vs general simplified (3 years PMJ, Art. 30)
-- Incorrect merge "3 years with Karta Polaka" conflated two separate legal bases.

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Naturalization tracks (verify gov.pl on filing date): (1) Karta Polaka — 1 year continuous residence on permanent stay (PMJ) obtained via Karta Polaka; (2) General simplified track (Art. 30, without Karta Polaka) — 3 years on PMJ + income + housing; (3) Standard — 10 years legal residence + PMJ + income + housing; (4) Marriage to Polish citizen — 3+ years married + 2 years on PMJ. B1 Polish and stable income required. Realistic 2026: wojewoda decision often 15–30 months after complete filing (statutory limit ~3 months). Plan language exam (B1) 12–18 months from zero.',
  body_ru = 'Основания натурализации (gov.pl на дату подачи): **(1) Karta Polaka** — **1 год** непрерывного проживания на **ПМЖ**, полученном по Kartą Polaka; **(2) общее упрощённое (ст. 30, без Karty Polaka)** — **3 года** на ПМЖ + доход + жильё; **(3) стандарт** — **10 лет** легального проживания + ПМЖ + доход + жильё; **(4) брак** с гражданином PL — **3+ года** брака + **2 года** на ПМЖ. Нужен B1 и стабильный доход. **Реалистично 2026:** решение wojewoda **15–30 мес.** (по закону до ~3 мес.). B1 с нуля — **12–18 мес.**',
  last_verified = '2026-07-11'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Naturalization (B1 Polish)';
