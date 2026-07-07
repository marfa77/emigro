-- Poland voivodeship review: official 1–3 mo. is a floor; Warsaw/Mazowieckie often 6–12+ mo. (2025+ backlog)

UPDATE emigro_program_timeline_steps
SET duration_text = 'from 1–3 mo. (Warsaw often 6–12+ mo.)'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'application';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Official voivodeship review is often quoted at 1–3 months, but Mazowieckie (Warsaw) and Małopolskie (Kraków) are heavily backlogged — real waits can reach 6–12+ months, especially since 2025. Less busy voivodeships may be closer to the official range. Book biometrics and card pickup early.',
  body_ru = 'Официально рассмотрение в urząd wojewódzki часто указывают как 1–3 месяца, но Мазовецкое (Варшава) и Малопольское (Краков) перегружены — на практике с 2025 года сроки нередко доходят до 6–12+ месяцев. В менее загруженных воеводствах бывает ближе к официальной планке. Запись на отпечатки и выдачу карты — заранее.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Voivodeship wait times';
