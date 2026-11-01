-- Italy Investor Visa stays in the catalogue, but RU/BY must not read as an open route.
-- Portal investorvisa.mise.gov.it: suspended for RU/BY citizens from 14.07.2023
-- (Committee decision, EU recommendation C(2022) 2028) and, from the MAECI note of
-- 20.03.2024, for non-EU nationals who also hold an RU or BY passport.
-- A residence permit in another country does not lift the suspension.

UPDATE emigro_programs
SET
  summary_en = 'Two-year investor residence: €250k innovative startup, €500k company, €1M philanthropy or €2M government bonds. Suspended for Russian and Belarusian citizens (14.07.2023), including non-EU dual nationals with an RU or BY passport (20.03.2024). Residence in another country does not restore eligibility.',
  summary_ru = 'Инвесторский ВНЖ на 2 года: €250k в инновационный стартап, €500k в компанию, €1M благотворительность или €2M гособлигации. Для граждан РФ и РБ программа приостановлена (14.07.2023; неграждане ЕС со вторым паспортом РФ или РБ — с 20.03.2024). ВНЖ другой страны, например Португалии, это право не возвращает.'
WHERE slug = 'italy-investor-visa';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Investor Visa Italy: programme suspended for Russian nationals, including non-EU dual nationals who also hold a Russian passport. Residence in another country does not restore eligibility.',
  notes_ru = 'Italy Investor Visa: программа приостановлена для граждан РФ, включая неграждан ЕС со вторым паспортом РФ. ВНЖ другой страны это право не возвращает.'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'italy-investor-visa'
  AND pe.passport_iso2 = 'RU';

UPDATE emigro_passport_eligibility pe
SET
  status = 'ineligible',
  notes_en = 'Investor Visa Italy: programme suspended for Belarusian nationals, including non-EU dual nationals who also hold a Belarusian passport. Residence in another country does not restore eligibility.',
  notes_ru = 'Italy Investor Visa: программа приостановлена для граждан BY, включая неграждан ЕС со вторым паспортом BY. ВНЖ другой страны это право не возвращает.'
FROM emigro_program_versions pv
JOIN emigro_programs p ON p.id = pv.program_id
WHERE pe.program_version_id = pv.id
  AND pv.is_published = true
  AND p.slug = 'italy-investor-visa'
  AND pe.passport_iso2 = 'BY';

UPDATE emigro_wizard_questions
SET
  help_en = 'Italy Investor Visa starts at €250,000, but it is suspended for Russian and Belarusian citizens. A residence permit in another EU country does not restore it.',
  help_ru = 'Инвесторская виза Италии формально от €250 000, но для граждан РФ и РБ она приостановлена. ВНЖ другой страны ЕС, например Португалии, это право не возвращает.'
WHERE question_key = 'willing_to_invest_eur'
  AND help_ru = 'Италия — инвесторская виза от €250 000 (инновационный стартап).';
