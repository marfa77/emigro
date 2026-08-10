# Emigro ES — SEO corridor (LATAM → España y Portugal)

Second site direction: **hispanohablantes → España y Portugal**. Primary product remains RU; `/` still redirects to `/ru`.

Frame: origins expand (UY, EC, PE, PY, then CO/AR/MX/VE); destinations stay **ES then PT** — not a mini EU country grid.

## Content policy (locked)

- **Pillars only** — full guides (≥~1200 words, tables/FAQ/`official_sources`). No thin informational satellites.
- **One intent → one canonical pillar** (merge duplicates; 301 old slugs).
- **Images required** — dedicated cover map + `public/images/og/guide-{slug}.jpg` (1200×630) + hero on the guide page.
- Target set stays small (~6–8 pillars), not a RU-scale library.

## Active wedges

| | Uruguay | Ecuador | Perú | Paraguay |
|--|---------|---------|------|----------|
| Corridor slug | `es-speaking-uruguay-to-spain` | `es-speaking-ecuador-to-spain` | `es-speaking-peru-to-spain` | `es-speaking-paraguay-to-spain` |
| Passports | `UY` | `EC` | `PE` | `PY` |
| Why | Lowest SEO competition | Higher demand than UY; niche vs MX/AR/CO/VE | Higher demand; cleaner SERP than big-4 | Clean niche like UY (Cono Sur) |
| Schengen corto | Often visa-free | Usually needs visa | Often visa-free (+ ETIAS later) | Often visa-free (+ ETIAS later) |
| Origin hub | `/es/uruguay` | `/es/ecuador` | `/es/peru` | `/es/paraguay` |

Shared: family `es-speaking-latam-to-europe` → next CO (user drafts), then AR/MX/VE; destination ES then PT.

Config: [`lib/es/corridor.ts`](../lib/es/corridor.ts) (`ES_PILLAR_GUIDE_SLUGS`, `ES_PATHS`).

## Product (shipped)

| Path | Role |
|------|------|
| `/es/wizard` (+ `/results`) | Hub evaluator: passports UY/EC/PE/PY → **Spain + Portugal** |
| `/es/spain` | Destination hub + wizard CTA |
| `/es/portugal` | Thin destination hub (D8/D7 framing) + wizard CTA |

Engine: reuses `ru-speaking-to-spain` / `ru-speaking-to-portugal` with `hub_audience=latam`. Passport rows: migrations `…_es_pt.sql` (UY/EC) and `…_pe_py.sql` (PE/PY).

## Canonical pillars (now)

| Slug | Role |
|------|------|
| `residencia-espana-desde-uruguay-2026` | Origin pillar UY |
| `residencia-espana-desde-ecuador-2026` | Origin pillar EC |
| `residencia-espana-desde-peru-2026` | Origin pillar PE |
| `residencia-espana-desde-paraguay-2026` | Origin pillar PY |
| `visa-nomada-digital-espana-latam-2026` | Shared DN pillar |
| `nacionalidad-espanola-latam-2026` | Shared nationality pillar (art. 22 / 2 años) |
| `primeros-30-dias-en-espana-2026` | Settle checklist |

Later: Colombia pillars (user drafts); España vs Portugal LATAM; Portugal D8/D7; no lucrativa / Beckham.

## Nationality note (2026)

Ibero-American passports (UY/EC/PE/PY, …): Código Civil **art. 22** — request Spanish nationality after **~2 years** of legal continuous residence (vs 10 years general).

- Surfaced on origin pillars + `/es` + `/es/spain`
- Canonical pillar: [`nacionalidad-espanola-latam-2026`](../content/guides/es/nacionalidad-espanola-latam-2026.md)
- Portugal hub clarifies PT citizenship ≠ art. 22
- Fact-check notes: student stay = **0%** for nationality (50% is long-term EU residence only); DELE exemption = Spanish-official-language list (not PT/PH/BR)

## Images

```bash
npx tsx scripts/generate-guide-og-images.ts --locale=es
```

## Indexable surface

| Path | Role |
|------|------|
| `/es` | Hub LATAM → España y Portugal |
| `/es/wizard` | Route evaluator |
| `/es/uruguay` `/es/ecuador` `/es/peru` `/es/paraguay` | Origin hubs |
| `/es/spain` `/es/portugal` | Destination hubs |
| `/es/guides` + `/es/guides/{slug}` | Pillars |
| `/es/contact`, privacy, terms | Trust |

## hreflang

`es` + optional `es-UY` / `es-EC` / `es-PE` / `es-PY` / `es-ES` / `es-PT` + `x-default`.

## Expansion

New origin = **1 hub + 1 origin pillar** (link shared DN + 30 días). No satellite FAQ guides.

## Out of scope (for now)

Assist ES, marketplace, Spain satellite in Spanish, EN locale, mass MT of RU guides, 20 EU corridor landings for ES.
