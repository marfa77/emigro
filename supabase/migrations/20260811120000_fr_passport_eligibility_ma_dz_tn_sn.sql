-- FR Afrique wizard: MA/DZ/TN/SN passport eligibility on France programs (copy from RU).

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru)
SELECT
  pe.program_version_id,
  fr.passport_iso2,
  pe.status,
  'Francophone Africa third-country national — same France program rules as other non-EU passports; confirm consulate jurisdiction and Schengen short-stay visa',
  'Passeport Afrique francophone — mêmes règles FR que les autres hors UE ; confirmez consulat et visa Schengen court séjour'
FROM emigro_passport_eligibility pe
JOIN emigro_program_versions pv ON pv.id = pe.program_version_id AND pv.is_published = true
JOIN emigro_programs p ON p.id = pv.program_id AND p.is_active = true
JOIN emigro_corridor_programs cp ON cp.program_id = p.id
JOIN emigro_corridors c ON c.id = cp.corridor_id
CROSS JOIN (VALUES ('MA'), ('DZ'), ('TN'), ('SN')) AS fr(passport_iso2)
WHERE pe.passport_iso2 = 'RU'
  AND c.slug = 'ru-speaking-to-france'
ON CONFLICT (program_version_id, passport_iso2) DO NOTHING;
