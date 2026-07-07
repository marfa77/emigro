-- Poland voivodeship: UoC legal deadlines (60 days / up to 3 months) vs systemic practice delays
-- Mazowieckie (Warsaw): 12+ months common; voivodeships routinely exceed statutory limits

UPDATE emigro_program_timeline_steps
SET duration_text = 'Law (UoC): 60 d–3 mo.; Mazowieckie often 12+ mo. in practice'
WHERE program_version_id IN (
  'c0000000-0000-4000-8000-000000000033',
  'c0000000-0000-4000-8000-000000000034',
  'c0000000-0000-4000-8000-000000000036',
  'c0000000-0000-4000-8000-000000000037'
)
AND step_type = 'application';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Under the Foreigners Act (UoC), decisions on most residence procedures must be issued within 60 days (up to 3 months in some cases). In practice, voivodeships systematically exceed these deadlines — a structural problem, not isolated delays. Mazowieckie (Warsaw) often takes 12+ months, frequently without a clear reason. Less busy voivodeships may be closer to the statutory range, but there are no guarantees. Book biometrics and card pickup early.',
  body_ru = 'По ustawie o cudzoziemcach (UoC) решение по большинству процедур — до 60 дней (в ряде случаев до 3 месяцев). На практике воеводства массово нарушают регламент — системная проблема, а не единичные задержки. Mazowieckie (Варшава): реальное ожидание нередко год и больше, часто без объяснимой причины. В менее загруженных воеводствах бывает ближе к закону, но гарантий нет. Запись на отпечатки и выдачу карты — заранее.',
  last_verified = '2026-07-07'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000008'
  AND title_en = 'Voivodeship wait times';
