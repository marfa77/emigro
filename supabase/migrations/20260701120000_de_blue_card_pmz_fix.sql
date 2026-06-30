-- Germany Blue Card → Niederlassungserlaubnis: §18c AufenthG (from 01.03.2024)
-- B1: 21 months; A1: 27 months (was incorrectly 21–33)

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Blue Card holders may qualify for Niederlassungserlaubnis after 21–27 months (B1 — 21, A1 — 27; §18c AufenthG, from 01.03.2024) with pension contributions.',
  body_ru = 'Держатели Blue Card могут получить Niederlassungserlaubnis через 21–27 мес. (B1 — 21, A1 — 27; §18c AufenthG, с 01.03.2024) при взносах в RV.',
  last_verified = '2026-07-01'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000005'
  AND category = 'timeline'
  AND title_en = 'Blue Card → permanent residence';
