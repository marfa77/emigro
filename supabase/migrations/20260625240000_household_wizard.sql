-- Household composition in corridor wizards (who relocates with primary applicant)

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order, required) VALUES
  ('e0000000-0000-4000-8000-000000000004', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?',
   'Dependent in same application or reunification after your permit',
   'Иждивенец в заявке или воссоединение после вашего ВНЖ',
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000004', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL,
   'Несовершеннолетние — доп. пороги дохода и жилья', NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000004', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL,
   '0 если никто. Взрослые родственники — сложный кейс', NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000008', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL,
   'Иждивенец в заявке или воссоединение после вашего ВНЖ',
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000008', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, 'Несовершеннолетние — доп. пороги', NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000008', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, '0 если никто', NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000012', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL,
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000012', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, NULL, NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000012', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, NULL, NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000016', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL,
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000016', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, NULL, NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000016', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, NULL, NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000020', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL,
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000020', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, NULL, NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000020', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, NULL, NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000024', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL,
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000024', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, NULL, NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000024', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, NULL, NULL, 3, false),

  ('e0000000-0000-4000-8000-000000000028', 'relocating_with_spouse', 'single',
   'Spouse relocating with you?', 'Супруг(а) едет вместе с вами?', NULL, NULL,
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1, false),
  ('e0000000-0000-4000-8000-000000000028', 'relocating_children_count', 'number',
   'Children relocating', 'Сколько детей едет с вами?', NULL, NULL, NULL, 2, false),
  ('e0000000-0000-4000-8000-000000000028', 'relocating_parents_count', 'number',
   'Parents/grandparents relocating', 'Родители или бабушки/дедушки в поездке?', NULL, NULL, NULL, 3, false)
ON CONFLICT (module_id, question_key) DO NOTHING;

UPDATE emigro_wizard_questions
SET sort_order = 4
WHERE question_key LIKE 'has_family_in_%' AND sort_order = 1;
