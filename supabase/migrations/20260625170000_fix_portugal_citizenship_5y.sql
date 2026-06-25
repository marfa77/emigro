-- Fix outdated "5 years to citizenship" copy after Nationality Law (signed 2026-05-03)

UPDATE emigro_corridor_digest_items
SET
  title_en = 'A2 Portuguese for citizenship',
  title_ru = 'A2 португальский для гражданства',
  body_en = 'Citizenship still requires A2 (CAPLE/CIPLE). After the Nationality Law was signed on 3 May 2026, most new applicants need 10 years of legal residence, not 5. Transitional rules depend on filing date — verify with a lawyer.',
  body_ru = 'Для натурализации по-прежнему нужен A2 (CAPLE/CIPLE). После подписания Nationality Law (3 мая 2026) для большинства новых заявителей требуется 10 лет легального проживания, а не 5. Переходные правила зависят от даты подачи — уточняйте с юристом.',
  last_verified = '2026-06-25'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000001'
  AND category = 'citizenship';

UPDATE emigro_corridor_digest_items
SET
  body_en = 'Typical path: residence permit → renewals → legal residence period (for many applicants 10 years from 2026) → A2/CIPLE → citizenship application (12–24 months processing). AIMA backlogs are a separate admin risk; they do not replace the statutory residence requirement.',
  body_ru = 'Типичный путь: ВНЖ → продления → легальный срок проживания (для многих — 10 лет с 2026) → A2/CIPLE → заявление на гражданство (рассмотрение 12–24 мес.). Задержки AIMA — отдельный админ-риск; они не заменяют требование закона.',
  last_verified = '2026-06-25'
WHERE corridor_id = 'a0000000-0000-4000-8000-000000000001'
  AND category = 'timeline';

UPDATE emigro_program_timeline_steps
SET
  title_en = 'A2 Portuguese for citizenship',
  title_ru = 'A2 португальский для гражданства',
  duration_text = 'Долгосрочно — пересчитайте срок после закона 2026'
WHERE program_version_id = 'c0000000-0000-4000-8000-000000000001'
  AND step_type = 'language_requirement';
