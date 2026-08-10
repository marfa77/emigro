# Emigro ES — SEO corridor (LATAM → España y Portugal)

Second site direction: **hispanohablantes → España y Portugal**. Primary product remains RU; `/` still redirects to `/ru`.

Frame: origins expand (UY, EC, PE, PY, CO, CL, then AR/MX/VE); destinations stay **ES then PT** — not a mini EU country grid.

## Content policy (locked)

- **Pillars only** — full guides (≥~1200 words, tables/FAQ/`official_sources`). No thin informational satellites.
- **One intent → one canonical pillar** (merge duplicates; 301 old slugs).
- **Images required** — dedicated cover map + `public/images/og/guide-{slug}.jpg` (1200×630) + hero on the guide page.
- Target set stays small; prefer shared thematic pillars over per-origin satellites.

## Active wedges

| | Uruguay | Ecuador | Perú | Paraguay | Colombia | Chile |
|--|---------|---------|------|----------|----------|-------|
| Corridor slug | `es-speaking-uruguay-to-spain` | `es-speaking-ecuador-to-spain` | `es-speaking-peru-to-spain` | `es-speaking-paraguay-to-spain` | `es-speaking-colombia-to-spain` | `es-speaking-chile-to-spain` |
| Passports | `UY` | `EC` | `PE` | `PY` | `CO` | `CL` |
| Why | Lowest SEO competition | Higher demand than UY; niche vs MX/AR/CO/VE | Higher demand; cleaner SERP than big-4 | Clean niche like UY (Cono Sur) | High demand; Schengen visa-free + art. 22 | Cono Sur; Convenio dualidad 1958 + art. 22 |
| Schengen corto | Often visa-free | Usually needs visa | Often visa-free (+ ETIAS later) | Often visa-free (+ ETIAS later) | Often visa-free (+ ETIAS later) | Often visa-free (+ ETIAS later) |
| Origin hub | `/es/uruguay` | `/es/ecuador` | `/es/peru` | `/es/paraguay` | `/es/colombia` | `/es/chile` |

Shared: family `es-speaking-latam-to-europe` → next AR/MX/VE; destination ES then PT.

Config: [`lib/es/corridor.ts`](../lib/es/corridor.ts) (`ES_PILLAR_GUIDE_SLUGS`, `ES_PATHS`).

## Product (shipped)

| Path | Role |
|------|------|
| `/es/wizard` (+ `/results`) | Hub evaluator: passports UY/EC/PE/PY/CO/CL → **Spain + Portugal** |
| `/es/spain` | Destination hub + wizard CTA |
| `/es/portugal` | Destination hub + D8/D7 pillar CTA |

Engine: reuses `ru-speaking-to-spain` / `ru-speaking-to-portugal` with `hub_audience=latam`. Passport rows: migrations `…_es_pt.sql` (UY/EC), `…_pe_py.sql` (PE/PY), `…_co.sql` (CO), `…_cl.sql` (CL).

## Canonical pillars (now)

| Slug | Role |
|------|------|
| `residencia-espana-desde-uruguay-2026` | Origin pillar UY |
| `residencia-espana-desde-ecuador-2026` | Origin pillar EC |
| `residencia-espana-desde-peru-2026` | Origin pillar PE |
| `residencia-espana-desde-paraguay-2026` | Origin pillar PY |
| `residencia-espana-desde-colombia-2026` | Origin pillar CO |
| `residencia-espana-desde-chile-2026` | Origin pillar CL |
| `visa-nomada-digital-espana-latam-2026` | Shared DN pillar |
| `visado-no-lucrativa-espana-latam-2026` | Shared NL pillar |
| `nacionalidad-espanola-latam-2026` | Shared nationality pillar (art. 22 / 2 años) |
| `ley-memoria-democratica-latam-2026` | LMD status (window closed Oct 2025) |
| `impuestos-beckham-espana-latam-2026` | Impatriados / Beckham |
| `portugal-d8-d7-latam-2026` | Portugal D8/D7 for LATAM |
| `primeros-30-dias-en-espana-2026` | Settle checklist |

## Nationality note (2026)

Ibero-American passports (UY/EC/PE/PY/CO/CL, …): Código Civil **art. 22** — request Spanish nationality after **~2 years** of legal continuous residence (vs 10 years general).

- Surfaced on origin pillars + `/es` + `/es/spain`
- Canonical pillar: [`nacionalidad-espanola-latam-2026`](../content/guides/es/nacionalidad-espanola-latam-2026.md)
- Portugal hub clarifies PT citizenship ≠ art. 22 (7y CPLP/BR vs 10y rest)
- Fact-check notes: student stay = **0%** for nationality (50% is long-term EU residence only); NL inicial = consulado (no turista→NL); DELE exemption = Spanish-official-language list (not PT/PH/BR)

## Images

```bash
npx tsx scripts/generate-guide-og-images.ts --locale=es
```

## Indexable surface

| Path | Role |
|------|------|
| `/es` | Hub LATAM → España y Portugal |
| `/es/wizard` | Route evaluator |
| `/es/uruguay` `/es/ecuador` `/es/peru` `/es/paraguay` `/es/colombia` `/es/chile` | Origin hubs |
| `/es/spain` `/es/portugal` | Destination hubs |
| `/es/guides` + `/es/guides/{slug}` | Pillars |
| `/es/contact`, privacy, terms | Trust |

## hreflang

`es` + optional `es-UY` / `es-EC` / `es-PE` / `es-PY` / `es-CO` / `es-CL` / `es-ES` / `es-PT` + `x-default`.

## Expansion

New origin = **1 hub + 1 origin pillar** (link shared thematic pillars). No satellite FAQ guides.

## Out of scope (for now)

Spain satellite in Spanish, EN locale, mass MT of RU guides, 20 EU corridor landings for ES.

## Monetization (in scope — convert)

Ship with every ES surface where it fits (see `.cursor/rules/monetization-first.mdc`):

| Product | Where |
|---------|--------|
| UniPrep2Go (CCSE) | Nacionalidad + origin residencia pillars, `/es/spain` |
| Prep2Go (CIPLE) | Portugal hub + `portugal-d8-d7-latam-2026` |
| Role Radar | DN / D8 work guides + `/es/role-radar` |
| Emigro Assist | `/es/assist`, wizard results, guide “Siguiente paso” |

Depth strip on `/es` and `/ru` shows live inventory (pillars, origins, RU stock) so Emigro does not read as a thin affiliate layer.

