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

## Product (Phase 1)

| Path | Role |
|------|------|
| `/fr` | Hub Afrique → France |
| `/fr/maroc` … `/fr/senegal` | Origin hubs |
| `/fr/france` | Destination hub |
| `/fr/guides` + `[slug]` | Pillars |
| `/fr/wizard` | Thin stub (full FR evaluator = Phase 2) |
| `/fr/contact` | Trust / Assist handoff |

## Monetization (in scope)

- UniPrep FR civic mock on naturalisation pillar (`france` topic).
- Assist: CTA to `/ru/assist` or `/es/assist` with FR note until `/fr/assist` ships.
- See `.cursor/rules/monetization-first.mdc`.

## Out of Phase 1

Full FR wizard + passport eligibility SQL, BE/CA/CH destinations, `/en` Gulf/India.
