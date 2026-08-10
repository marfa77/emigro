# Emigro ES — SEO corridor (Spanish-speaking → Europe)

Second site direction: **hispanohablantes → Europa**. Primary product remains RU; `/` still redirects to `/ru`.

## Active wedges

| | Uruguay → España | Ecuador → España |
|--|------------------|------------------|
| Corridor slug | `es-speaking-uruguay-to-spain` | `es-speaking-ecuador-to-spain` |
| Passports | `UY` | `EC` |
| Why | Lowest SEO competition, clean passport story | Higher demand than UY; still far less saturated than MX/AR/CO/VE |
| Differentiator | Often Schengen short-stay visa-free | Short Schengen stay usually needs visa |
| Origin hub | `/es/uruguay` | `/es/ecuador` |

Shared:

| Field | Value |
|-------|--------|
| Expansion family | `es-speaking-latam-to-europe` |
| Audience language | `es` |
| Destination | `ES` (then `PT`) |
| Next origins | PY, PE, then AR/MX/CO/VE |

Config: [`lib/es/corridor.ts`](../lib/es/corridor.ts)

## Indexable surface

| Path | Role |
|------|------|
| `/es` | Hub LATAM → Europa |
| `/es/uruguay` | Origin hub UY |
| `/es/ecuador` | Origin hub EC |
| `/es/spain` | Destination hub (LATAM framing) |
| `/es/guides` | Guide index |
| `/es/guides/{slug}` | Pillars |
| `/es/contact`, `/es/privacy`, `/es/terms` | Trust |

Content: `content/guides/es/`. Loaders: `listGuides("es")`, `guidePath(slug, "es")`.

## hreflang

ES pages emit `es` + optional `es-UY` / `es-EC` / `es-ES` + `x-default` → same URL.

Do **not** invent RU↔ES `hreflang` pairs until true translation equivalents exist.

## Guide SEO (ES)

Same Emigro frontmatter as RU ([SEO_GUIDE_STANDARD.md](./SEO_GUIDE_STANDARD.md)), with:

- `corridor_slugs: [es-speaking-uruguay-to-spain]` or `[es-speaking-ecuador-to-spain]`
- Keywords in Spanish
- `official_sources` required
- Canonical under `https://www.emigro.online/es/guides/{slug}`

## Expansion (content-only)

To add Paraguay (example):

1. `content/guides/es/residencia-espana-desde-paraguay-2026.md`
2. `/es/paraguay` (copy Ecuador/Uruguay hub)
3. Reuse `/es/spain` + 30-days guide
4. Sitemap + `es-PY` hreflang
5. No new locale machinery

## Out of scope (this phase)

Full ES wizard, Assist, marketplace, Spain satellite in Spanish, EN locale, mass MT of RU guides.
