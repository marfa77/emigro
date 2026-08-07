-- Fix UUID collision: Greece corridor modules reused e000…046–048 that already
-- belonged to Poland/Czechia/Austria *study* modules (20260629160000).
-- Result: Greece labor questions (incl. «оффер в Греции») were inserted into
-- Czechia study; Greece wizard was missing core/labor/capital modules.
--
-- Repair:
-- 1) delete polluted non-study questions from PL/CZ/AT study modules
-- 2) create Greece modules under fresh IDs e000…120–123
-- 3) insert Greece questions into those modules
-- Bond module e000…049 was free and already correct — leave it.

-- ── 1. Strip polluted questions from study modules ──────────────────────────

-- Poland study (…046): Greece core passport leaked in
DELETE FROM emigro_wizard_questions
WHERE module_id = 'e0000000-0000-4000-8000-000000000046'
  AND question_key = 'passport_iso2';

-- Czechia study (…047): Greece labor questions leaked in
DELETE FROM emigro_wizard_questions
WHERE module_id = 'e0000000-0000-4000-8000-000000000047'
  AND question_key IN (
    'remote_income',
    'monthly_income_eur',
    'has_job_offer',
    'annual_salary_eur'
  );

-- Austria study (…048): Greece capital questions leaked in
DELETE FROM emigro_wizard_questions
WHERE module_id = 'e0000000-0000-4000-8000-000000000048'
  AND question_key IN (
    'passive_income_eur',
    'savings_eur',
    'willing_to_invest_eur',
    'has_university_degree'
  );

-- ── 2. Greece modules with non-colliding IDs ────────────────────────────────

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000120', 'd0000000-0000-4000-8000-000000000011', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000121', 'd0000000-0000-4000-8000-000000000011', 'labor', 'Work & remote', 'Работа и удалёнка', 2),
  ('e0000000-0000-4000-8000-000000000122', 'd0000000-0000-4000-8000-000000000011', 'capital', 'Passive income & investment', 'Пассивный доход и инвестиции', 3)
ON CONFLICT (id) DO UPDATE SET
  wizard_id = EXCLUDED.wizard_id,
  module_key = EXCLUDED.module_key,
  title_en = EXCLUDED.title_en,
  title_ru = EXCLUDED.title_ru,
  sort_order = EXCLUDED.sort_order;

-- Bond …049 already exists for Greece; ensure sort_order / wizard link
UPDATE emigro_wizard_modules
SET
  wizard_id = 'd0000000-0000-4000-8000-000000000011',
  module_key = 'bond',
  title_en = 'Family',
  title_ru = 'Семья',
  sort_order = 4
WHERE id = 'e0000000-0000-4000-8000-000000000049';

-- ── 3. Greece questions on the new modules ──────────────────────────────────

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000120', 'passport_iso2', 'single', 'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать', '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000121', 'remote_income', 'single', 'Stable remote income from abroad?', 'Стабильный удалённый доход из-за рубежа?', 'Salary or freelance from employers/clients outside Greece', 'Зарплата или фриланс от работодателей/клиентов вне Греции', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000121', 'monthly_income_eur', 'number', 'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', 'Digital Nomad threshold €3 500 solo (+20%/+15% family)', 'Порог Digital Nomad €3 500 соло (+20%/+15% семья)', NULL, 2),
  ('e0000000-0000-4000-8000-000000000121', 'has_job_offer', 'single', 'Signed job offer in Greece?', 'Подписанный оффер работы в Греции?', 'Local employment is a different route — not Digital Nomad/FIP', 'Локальная работа — другой маршрут, не Digital Nomad/FIP', '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 3),
  ('e0000000-0000-4000-8000-000000000121', 'annual_salary_eur', 'number', 'Annual gross salary in offer (EUR)', 'Годовая брутто-зарплата в оффере (EUR)', NULL, NULL, NULL, 4),
  ('e0000000-0000-4000-8000-000000000122', 'passive_income_eur', 'number', 'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Pensions, rent, dividends — not remote salary (use Digital Nomad)', 'Пенсии, аренда, дивиденды — не зарплата удалёнки (для неё Digital Nomad)', NULL, 1),
  ('e0000000-0000-4000-8000-000000000122', 'savings_eur', 'number', 'Liquid savings (EUR)', 'Ликвидные сбережения (EUR)', 'FIP alternative to monthly passive income', 'Альтернатива месячному пассивному доходу для FIP', NULL, 2),
  ('e0000000-0000-4000-8000-000000000122', 'willing_to_invest_eur', 'number', 'Capital for Golden Visa (EUR)', 'Капитал для Golden Visa (EUR)', 'RE zones €250k–€800k or Elevate Greece startup €250k', 'Зоны недвижимости €250k–€800k или стартап Elevate Greece €250k', NULL, 3),
  ('e0000000-0000-4000-8000-000000000122', 'has_university_degree', 'single', 'Recognised university degree?', 'Признаваемый диплом вуза?', NULL, NULL, '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 4)
ON CONFLICT DO NOTHING;
