# Emigro ES — SEO corridor (LATAM → España y Portugal)

Second site direction: **hispanohablantes → España y Portugal**. Primary product remains RU; `/` still redirects to `/ru`.

Frame: origins expand (UY, EC, then PY/PE/AR/MX/CO/VE); destinations stay **ES then PT** — not a mini EU country grid.

## Content policy (locked)

- **Pillars only** — full guides (≥~1200 words, tables/FAQ/`official_sources`). No thin informational satellites.
- **One intent → one canonical pillar** (merge duplicates; 301 old slugs).
- **Images required** — dedicated cover map + `public/images/og/guide-{slug}.jpg` (1200×630) + hero on the guide page.
- Target set stays small (~6–8 pillars), not a RU-scale library.

## Active wedges

| | Uruguay → España | Ecuador → España |
|--|------------------|------------------|
| Corridor slug | `es-speaking-uruguay-to-spain` | `es-speaking-ecuador-to-spain` |
| Passports | `UY` | `EC` |
| Why | Lowest SEO competition | Higher demand than UY; less saturated than MX/AR/CO/VE |
| Differentiator | Often Schengen short-stay visa-free | Short Schengen stay usually needs visa |
| Origin hub | `/es/uruguay` | `/es/ecuador` |

Shared: family `es-speaking-latam-to-europe` → next PY/PE, then AR/MX/CO/VE; destination ES then PT.

Config: [`lib/es/corridor.ts`](../lib/es/corridor.ts) (`ES_PILLAR_GUIDE_SLUGS`, `ES_PATHS`).

## Product Phase 1 (shipped)

| Path | Role |
|------|------|
| `/es/wizard` (+ `/results`) | Hub evaluator: passports UY/EC → **Spain + Portugal** programs |
| `/es/spain` | Destination hub + wizard CTA |
| `/es/portugal` | Thin destination hub (D8/D7 framing) + wizard CTA |

Engine: reuses published `ru-speaking-to-spain` / `ru-speaking-to-portugal` program rules with `hub_audience=latam` filter. Passport rows for UY/EC: migration `20260810190000_latam_passport_eligibility_es_pt.sql`.

Out of Phase 1: Assist ES, `/es/spain/programs/*`, full DB `es-speaking-*` corridor packs, Portugal pillars, news/Telegram ES.

## Canonical pillars (now)

| Slug | Role |
|------|------|
| `residencia-espana-desde-uruguay-2026` | Origin pillar UY |
| `residencia-espana-desde-ecuador-2026` | Origin pillar EC |
| `visa-nomada-digital-espana-latam-2026` | Shared DN pillar (UY+EC; 301 from old per-passport DN) |
| `primeros-30-dias-en-espana-2026` | Settle checklist |

Later (still pillars only): España vs Portugal LATAM; Portugal D8/D7; optional no-lucrativa deep only if it cannot live inside residencia.

## Images

```bash
npx tsx scripts/generate-guide-og-images.ts --locale=es
```

Covers: `GUIDE_COVER_BY_SLUG` in [`lib/guides/covers.ts`](../lib/guides/covers.ts).  
UI: hero + featured image on [`app/es/guides/[slug]/page.tsx`](../app/es/guides/[slug]/page.tsx); cards on guides index.

## Indexable surface

| Path | Role |
|------|------|
| `/es` | Hub LATAM → España y Portugal |
| `/es/wizard` | Route evaluator (UY/EC) |
| `/es/uruguay` / `/es/ecuador` | Origin hubs |
| `/es/spain` / `/es/portugal` | Destination hubs |
| `/es/guides` | Pillar index (with covers) |
| `/es/guides/{slug}` | Pillars |
| `/es/contact`, privacy, terms | Trust |

## hreflang

`es` + optional `es-UY` / `es-EC` / `es-ES` / `es-PT` + `x-default` → same URL. No RU↔ES pairs until true translations.

## Expansion (content-only)

New origin = **1 hub + 1 origin pillar** (link shared DN + 30 días). No satellite FAQ guides.

## Out of scope (for now)

Full Assist ES, marketplace, Spain satellite in Spanish, EN locale, mass MT of RU guides, 20 EU corridor landings for ES.
