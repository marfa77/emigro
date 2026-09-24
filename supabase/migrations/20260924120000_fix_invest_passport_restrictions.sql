-- Fact-check 2026-09-24: align CAPITAL program passport rows with official suspensions
-- and with lib/investment/registry.ts restrictedPassports (Greece GV, Malta MPRP, Italy Investor).
--
-- Greece: Circular 1/2026 (Ministry of Migration) still recalls suspension of new applications
-- under Arts. 96–100A for RU/BY nationals (renewals separately lifted earlier).
-- Malta: Residency Malta MPRP FAQ — applications from RU and BY currently not eligible.
-- Italy: investorvisa.mise.gov.it — suspension for RU/BY (incl. dual where one is RU/BY).

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Ministry of Migration: suspension of new Golden Visa / investor residence applications for Russian nationals remains in force (renewals are a separate track).',
  notes_ru = 'Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан РФ сохраняется (продления — отдельный трек).'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'greece-golden-visa'
  AND pe.passport_iso2 = 'RU';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Ministry of Migration: suspension of new Golden Visa / investor residence applications for Belarusian nationals remains in force (renewals are a separate track).',
  notes_ru = 'Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан BY сохраняется (продления — отдельный трек).'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'greece-golden-visa'
  AND pe.passport_iso2 = 'BY';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Residency Malta MPRP FAQ: applications from the Russian Federation are currently not eligible.',
  notes_ru = 'Residency Malta FAQ (MPRP): заявки от граждан РФ сейчас не принимают.'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'malta-mprp'
  AND pe.passport_iso2 = 'RU';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Residency Malta MPRP FAQ: applications from the Republic of Belarus are currently not eligible.',
  notes_ru = 'Residency Malta FAQ (MPRP): заявки от граждан BY сейчас не принимают.'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'malta-mprp'
  AND pe.passport_iso2 = 'BY';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Investor Visa Italy: programme suspended for Russian nationals (including dual nationality where one passport is RU).',
  notes_ru = 'Italy Investor Visa: программа приостановлена для граждан РФ (включая двойное гражданство с паспортом РФ).'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'italy-investor-visa'
  AND pe.passport_iso2 = 'RU';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Investor Visa Italy: programme suspended for Belarusian nationals (including dual nationality where one passport is BY).',
  notes_ru = 'Italy Investor Visa: программа приостановлена для граждан BY (включая двойное гражданство с паспортом BY).'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'italy-investor-visa'
  AND pe.passport_iso2 = 'BY';

-- Ensure rows exist even if an older seed omitted them.
INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru)
SELECT pv.id, v.passport_iso2, 'ineligible', v.notes_en, v.notes_ru
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
JOIN (
  VALUES
    ('greece-golden-visa', 'RU',
      'Ministry of Migration: suspension of new Golden Visa / investor residence applications for Russian nationals remains in force (renewals are a separate track).',
      'Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан РФ сохраняется (продления — отдельный трек).'),
    ('greece-golden-visa', 'BY',
      'Ministry of Migration: suspension of new Golden Visa / investor residence applications for Belarusian nationals remains in force (renewals are a separate track).',
      'Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан BY сохраняется (продления — отдельный трек).'),
    ('malta-mprp', 'RU',
      'Residency Malta MPRP FAQ: applications from the Russian Federation are currently not eligible.',
      'Residency Malta FAQ (MPRP): заявки от граждан РФ сейчас не принимают.'),
    ('malta-mprp', 'BY',
      'Residency Malta MPRP FAQ: applications from the Republic of Belarus are currently not eligible.',
      'Residency Malta FAQ (MPRP): заявки от граждан BY сейчас не принимают.'),
    ('italy-investor-visa', 'RU',
      'Investor Visa Italy: programme suspended for Russian nationals (including dual nationality where one passport is RU).',
      'Italy Investor Visa: программа приостановлена для граждан РФ (включая двойное гражданство с паспортом РФ).'),
    ('italy-investor-visa', 'BY',
      'Investor Visa Italy: programme suspended for Belarusian nationals (including dual nationality where one passport is BY).',
      'Italy Investor Visa: программа приостановлена для граждан BY (включая двойное гражданство с паспортом BY).')
) AS v(slug, passport_iso2, notes_en, notes_ru) ON TRUE
WHERE p.slug = v.slug
  AND pv.is_published = true
  AND NOT EXISTS (
    SELECT 1
    FROM emigro_passport_eligibility pe
    WHERE pe.program_version_id = pv.id
      AND pe.passport_iso2 = v.passport_iso2
  );
