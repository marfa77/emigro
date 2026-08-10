-- LATAM wizard: add CL passport eligibility on Spain + Portugal programs (copy from RU).

INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru)
SELECT
  pe.program_version_id,
  latam.passport_iso2,
  pe.status,
  'LATAM third-country national — same program rules as other non-EU passports; confirm consulate jurisdiction and short-stay / ETIAS rules',
  'Ciudadano LATAM — mismas reglas del programa que otros no UE; confirme jurisdicción consular y régimen Schengen corto / ETIAS'
FROM emigro_passport_eligibility pe
JOIN emigro_program_versions pv ON pv.id = pe.program_version_id AND pv.is_published = true
JOIN emigro_programs p ON p.id = pv.program_id AND p.is_active = true
JOIN emigro_corridor_programs cp ON cp.program_id = p.id
JOIN emigro_corridors c ON c.id = cp.corridor_id
CROSS JOIN (VALUES ('CL')) AS latam(passport_iso2)
WHERE pe.passport_iso2 = 'RU'
  AND c.slug IN ('ru-speaking-to-spain', 'ru-speaking-to-portugal')
ON CONFLICT (program_version_id, passport_iso2) DO NOTHING;
