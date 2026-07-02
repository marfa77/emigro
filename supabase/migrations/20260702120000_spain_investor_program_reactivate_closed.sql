-- Spain investor residence: program fully closed from 2025-04-03 (Ley Orgánica 1/2025).
-- Was is_active=false while still linked in emigro_corridor_programs → sitemap 200 URL but page 404.

UPDATE emigro_programs
SET
  is_active = true,
  title_en = 'Spain Residence by Investment (closed)',
  title_ru = 'Испания — ВНЖ через инвестиции (закрыто)',
  summary_en = 'Investment-residence route abolished from 2025-04-03 (Ley Orgánica 1/2025). New applications for autorización de residencia por inversión are no longer accepted.',
  summary_ru = 'Маршрут ВНЖ через инвестиции отменён с 3 апреля 2025 (Ley Orgánica 1/2025). Новые заявки на autorización de residencia por inversión не принимаются.'
WHERE slug = 'spain-residence-by-investment';

UPDATE emigro_program_versions
SET eligibility_rule = '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"willing_to_invest_eur"},999999999]}]}'
WHERE id = 'c0000000-0000-4000-8000-000000000026';

UPDATE emigro_program_requirements
SET
  label_en = 'Program status',
  label_ru = 'Статус программы',
  value_text = 'Закрыта с 3 апреля 2025 г. (Ley Orgánica 1/2025). Статьи 63–67 Ley 14/2013 отменены — новые заявки не принимаются.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND requirement_type = 'min_investment_eur';

UPDATE emigro_program_requirements
SET
  label_en = 'Former routes (historical)',
  label_ru = 'Бывшие маршруты (история)',
  value_text = 'До закрытия: недвижимость €500k+, акции/фонды €1M, облигации, депозит €2M — все формы закрыты для новых заявок.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND requirement_type = 'documents';

UPDATE emigro_program_requirements
SET
  label_en = 'Existing holders',
  label_ru = 'Действующие держатели',
  value_text = 'Уже выданные autorizaciones сохраняются при соблюдении условий; продление — по переходным правилам, сверяйте с BOE и UGE.'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND requirement_type = 'timeline';

UPDATE emigro_program_timeline_steps
SET
  title_en = 'Program closed — verify BOE',
  title_ru = 'Программа закрыта — сверьте BOE',
  duration_text = 'Новые заявки не принимаются'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND step_type = 'document_prep';

UPDATE emigro_program_timeline_steps
SET
  title_en = 'Alternative routes',
  title_ru = 'Альтернативные маршруты',
  duration_text = 'Digital nomad, non-lucrative, family reunification'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND step_type = 'application';

UPDATE emigro_program_timeline_steps
SET
  title_en = 'Investment guide',
  title_ru = 'Инвестиционный гид',
  duration_text = 'См. PT ARI и IT Investor Visa'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026'
  AND step_type = 'residence';

UPDATE emigro_program_sources
SET
  source_url = 'https://www.boe.es/buscar/act.php?id=BOE-A-2025-3404',
  raw_excerpt = 'Ley Orgánica 1/2025 — derogates Ley 14/2013 arts. 63–67; new investment-residence authorisations closed from 2025-04-03.',
  last_verified = '2026-07-02',
  label_en = 'Ley Orgánica 1/2025 (BOE)',
  label_ru = 'Ley Orgánica 1/2025 (BOE)'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026';

UPDATE emigro_passport_eligibility
SET
  status = 'ineligible',
  notes_en = 'New investment-residence applications closed from 2025-04-03',
  notes_ru = 'Новые заявки на инвестиционный ВНЖ не принимаются с 3 апреля 2025'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000026';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Investment-residence route fully closed from 2025-04-03 (Ley Orgánica 1/2025). Existing authorisations may renew under transitional rules — verify BOE. Alternatives: digital nomad, non-lucrative, family reunification.',
  body_ru = 'Маршрут ВНЖ через инвестиции полностью закрыт с 3 апреля 2025 (Ley Orgánica 1/2025). Действующие autorizaciones могут продлеваться по переходным правилам — сверяйте BOE. Альтернативы: digital nomad, non-lucrative, воссоединение.',
  last_verified = '2026-07-02'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000002'
  AND title_en = 'Golden visa reform';
