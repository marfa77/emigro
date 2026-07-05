-- Fact-check fix: KZ passport does NOT have Schengen visa-free entry.
-- Update passport eligibility notes that incorrectly referenced visa-free Schengen.

UPDATE emigro_passport_eligibility
SET
  notes_en = 'Preliminarily possible; Schengen visa required — visa does not replace work permit',
  notes_ru = 'Предварительно возможно; нужна шенгенская виза — виза не заменяет work permit'
WHERE passport_iso2 = 'KZ'
  AND notes_en LIKE '%Schengen visa-free entry%';
