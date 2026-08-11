# Emigro FR — SEO corridor (Afrique francophone → France)

Third site direction: **francophones Afrique → France**. Primary product remains RU; `/es` is LATAM→ES/PT; `/` still redirects to `/ru`.

Frame: origins expand (MA, DZ, TN, SN, then CI/CM…); destination stays **France first** — not a mini EU country grid.

## Content policy (locked)

- **Pillars only** — full guides with tables/FAQ/`official_sources`. No thin satellites.
- **One intent → one canonical pillar**.
- **Images required** — cover map + `public/images/og/guide-{slug}.jpg`.
- Prefer shared thematic pillars (Talent, naturalisation, overview) over per-origin FAQ spam.

## Active wedges (Phase 1)

| | Maroc | Algérie | Tunisie | Sénégal |
|--|-------|---------|---------|---------|
| Corridor slug | `fr-speaking-maroc-to-france` | `fr-speaking-algerie-to-france` | `fr-speaking-tunisie-to-france` | `fr-speaking-senegal-to-france` |
| Passports | `MA` | `DZ` | `TN` | `SN` |
| Origin hub | `/fr/maroc` | `/fr/algerie` | `/fr/tunisie` | `/fr/senegal` |
| Schengen court | Visa usually required | Visa usually required | Visa usually required | Visa usually required |

Shared family: `fr-speaking-africa-to-europe`. Config: [`lib/fr/corridor.ts`](../lib/fr/corridor.ts).

## Canonical pillars

| Slug | Role |
|------|------|
| `residence-france-depuis-maroc-2026` | Origin MA |
| `residence-france-depuis-algerie-2026` | Origin DZ |
| `residence-france-depuis-tunisie-2026` | Origin TN |
| `residence-france-depuis-senegal-2026` | Origin SN |
| `residence-france-afrique-francophone-2026` | Shared overview |
| `passeport-talent-france-afrique-2026` | Shared Passeport Talent |
| `naturalisation-france-afrique-2026` | Shared naturalisation (~5 ans) |

## Nationality note

Do **not** market “naturalisation 2 ans” as a Maghreb-wide hook (unlike ES art. 22). Default FR naturalisation = **~5 years** résidence régulière; reductions exist (mariage, etc.) — verify service-public / Code civil.

## Product (Phase 2 — shipped)

| Path | Role |
|------|------|
| `/fr` | Hub Afrique → France |
| `/fr/maroc` … `/fr/senegal` | Origin hubs |
| `/fr/france` | Destination hub |
| `/fr/guides` + `[slug]` | Pillars |
| `/fr/wizard` + `/fr/wizard/results` | Full FR evaluator (MA/DZ/TN/SN → France) |
| `/fr/assist` | Assist FR (Route Check €129 + accompagnement) |
| `/fr/contact` | Trust / handoff |

## Monetization (in scope)

- UniPrep FR civic mock on naturalisation pillar (`france` topic).
- Assist CTAs → `/fr/assist` from guides, wizard results, hubs, footer.
- See `.cursor/rules/monetization-first.mdc`.

## Out of Phase 2 (later)

BE/CA/CH destinations, `/en` Gulf/India, more Afrique origins (CI/CM…).

## Wizard notes

- Definition: `lib/wizard/hub-definition-fr.ts` (`hub_audience=fr_africa`).
- Engine filters to `ru-speaking-to-france` programs; labels/links via `lib/fr/program-labels.ts`.
- Passport eligibility SQL: `supabase/migrations/20260811120000_fr_passport_eligibility_ma_dz_tn_sn.sql`.
- Do **not** market Maghreb naturalisation as a « 2 ans » hook.
