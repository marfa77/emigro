-- Fact-check 2026-09-29: FR VLS-TS visiteur SMIC (revalorised 01.06.2026) + DE Chancenkarte source refresh.

update emigro_program_requirements
set value_text = '€22,404/year (SMIC annuel from 01.06.2026) — €1,867.02/month passive or equivalent savings'
where id = '70bfecc1-1a7a-442e-9118-b58b7696877d';

update emigro_program_sources
set source_url = 'https://www.service-public.fr/particuliers/vosdroits/F2300',
    raw_excerpt = 'SMIC from 01.06.2026 (arrêté 22.05.2026): €12.31/h gross, €1,867.02/month gross, €22,404.20/year gross.',
    label_en = 'Service-Public — SMIC',
    label_ru = 'Service-Public — SMIC',
    last_verified = '2026-09-29'
where id = '5d2e5db2-3b45-41a7-aab3-6580f1ce4be0';

update emigro_program_sources
set last_verified = '2026-09-29'
where id = '19e6f427-06fe-4bdd-976f-35ed5eaa2819';

update emigro_program_requirements
set value_text = '€13,092 (€1,091/month net × 12 months, 2026)'
where id = '5bf38b05-59cf-4131-8449-90089fe7440d';

update emigro_program_sources
set raw_excerpt = 'Opportunity Card — proof of funds at least €1,091/month (2026), i.e. €13,092 for 12 months (blocked account or Verpflichtungserklärung); points-based eligibility.',
    last_verified = '2026-09-29'
where id = '56052864-f7fd-4fc6-ac7f-43f9b87de01b';
