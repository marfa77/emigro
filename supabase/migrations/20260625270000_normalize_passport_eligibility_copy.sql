-- Replace vague public passport notes with verified-state copy.
-- This is intentionally a data migration: older seed migrations may already be applied in production.

UPDATE emigro_passport_eligibility
SET
  notes_en = 'Preliminarily possible, subject to consulate jurisdiction and place of submission',
  notes_ru = 'Предварительно возможно, но зависит от консульства подачи и юрисдикции'
WHERE status = 'partial'
  AND (
    notes_en = 'Check consulate jurisdiction'
    OR notes_ru IN (
      'Уточнить юрисдикцию консульства',
      'Уточнить юрисдикцию консульства и актуальную политику'
    )
  );

UPDATE emigro_passport_eligibility
SET
  notes_en = 'Official program requirements verified; apply via consulate/VFS where available',
  notes_ru = 'Официальные требования программы проверены; подача через консульство/VFS где доступно'
WHERE status = 'eligible'
  AND (
    notes_en = 'Apply via consulate/VFS where available'
    OR notes_ru = 'Подача через консульство/VFS где доступно'
  );
