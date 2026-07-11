# Satellite SEO / GEO / AEO-AUO / LLM Audit — Portugal vs Spain

**Date:** 2026-07-11  
**Scope:** `portugal.emigro.online` vs `spain.emigro.online` — metadata, sitemaps, robots, internal links, hreflang, schema.org, LLM discoverability, geo targeting.  
**Out of scope:** editorial pipeline, cron, Supabase ingest (see `SATELLITE_REQUIREMENTS_CHECKLIST.md`).

## Executive scores

| Dimension | Portugal (PT) | Spain (ES) | Notes |
|-----------|:-------------:|:----------:|-------|
| **SEO metadata** | 92% | 90% | Both: title, description, canonical, OG, Twitter on hub/notes/tags. PT had Lisbon leak in hub schema (fixed). |
| **GEO targeting** | 88% → 94% | 93% | PT focus Porto/Norte; ES focus Valencia. Tag `about: Place` added for parity. |
| **AEO / AUO (LLM)** | 95% | 92% | Full stack: llms.txt, llms-full, llm-sitemap, `/llms` routes, sr-only blocks, FAQ schema. |
| **Internal linking** | 90% → 95% | 78% → 92% | ES lacked `CorridorIntelLinks` satellite card (fixed). Main `/ru` hub still PT-only link. |
| **Content index depth** | 95% | 70% | PT: daily cron + 7+ pillar guides live. ES: 7 seed guides; hub empty-state until `spain:daily`. |
| **Overall** | **93%** | **86%** | PT = gold reference; ES structurally complete, content volume is main gap. |

---

## Findings table

| # | Criterion | PT | ES | Priority | Status |
|---|-----------|:--:|:--:|----------|--------|
| 1 | Hub `metadata`: title, description, keywords | ✅ | ✅ | — | Pass |
| 2 | Hub canonical on subdomain (`metadataBase` + `alternates.canonical`) | ✅ | ✅ | — | Pass |
| 3 | Hub OG + Twitter (summary_large_image) | ✅ | ✅ | — | Pass |
| 4 | Layout default title template (`%s \| Emigro PT/ES`) | ✅ | ✅ | — | Pass |
| 5 | Note pages: dynamic metadata via `buildCommunityNoteMetadata` | ✅ | ✅ | — | Pass |
| 6 | Tag pages: metadata + canonical + OG/Twitter | ✅ | ✅ | — | Pass |
| 7 | `hreflang` (`ru-RU`, `ru`, `x-default` → self) | ✅ | ✅ | P3 | Pass (single-locale; no cross-country hreflang needed) |
| 8 | `robots.ts`: allow `/`, AI crawlers, sitemap refs | ✅ | ✅ | — | Pass (shared) |
| 9 | `sitemap.xml`: hub + `/llms` + notes + tags | ✅ | ✅ | — | Pass (dynamic counts) |
| 10 | `sitemap.xml` priority: hub 0.9, news notes 0.85 | ✅ | ✅ | — | Pass |
| 11 | `llm-sitemap.xml`: hub, notes, tags, `/llms` | ✅ | ✅ | — | Pass |
| 12 | Global `llms.txt` mentions both satellites | ✅ | ✅ | — | Pass |
| 13 | Global `llms-full.txt` lists both satellites + all notes/tags | ✅ | ✅ | — | Pass (Spain present) |
| 14 | Per-satellite `/llms` route (`buildPortugalLlmsTxt` / `buildSpainLlmsTxt`) | ✅ | ✅ | — | Pass |
| 15 | Hub `sr-only` `ai:description` block | ✅ | ✅ | — | Pass |
| 16 | Note `sr-only` ai:description + facts list | ✅ | ✅ | — | Pass |
| 17 | Tag `sr-only` ai:description | ✅ | ✅ | — | Pass |
| 18 | Hub schema `CollectionPage` + `about: Place` | ✅ (fixed) | ✅ | P1 | **Fixed** — PT was Lisbon, now Porto/Norte |
| 19 | Note schema `Article`/`NewsArticle` + `about: Place` + geo coords | ✅ | ✅ | — | Pass |
| 20 | Note `FAQPage` schema when faq ≥ 1 | ✅ | ✅ | — | Pass |
| 21 | Note `BreadcrumbList` + `SpeakableSpecification` | ✅ | ✅ | — | Pass |
| 22 | Tag schema `CollectionPage` + `ItemList` | ✅ | ✅ | — | Pass |
| 23 | Tag schema `about: Place` | ✅ (fixed) | ✅ (fixed) | P2 | **Fixed** — added Place on tag pages |
| 24 | GEO in hub copy (city/country in description) | ✅ | ✅ | — | Pass |
| 25 | GEO gates in `editorial-quality.ts` | ✅ | ✅ | — | Pass (PT: Porto/Norte; ES: Valencia/Madrid) |
| 26 | Note schema default city: Porto vs Valencia | ✅ | ✅ | — | Pass (`seo-page.ts`) |
| 27 | Corridor ↔ satellite: `CorridorHubNav` practice tab | ✅ | ✅ | — | Pass |
| 28 | Corridor landing `FeaturedNotes` block | ✅ | ✅ | — | Pass |
| 29 | `CorridorIntelLinks` satellite card | ✅ | ❌→✅ | P1 | **Fixed** — ES had "Практика — скоро" |
| 30 | Satellite header hub link on subdomain | ✅ | ❌→✅ | P1 | **Fixed** — ES used `/ru/spain` on subdomain |
| 31 | Satellite footer cross-link sibling country | ✅ (fixed) | ✅ | P3 | **Fixed** — PT footer now links ES |
| 32 | Main `/ru` hub links to satellites | PT only | — | P2 | Open — add spain.emigro.online |
| 33 | Published note volume (indexable URLs) | High | Low (~7) | P1 | ES content gap |
| 34 | `llms-full` PT geo label | ❌→✅ | ✅ | P2 | **Fixed** — "Лиссабон" → "Norte (Порту)" |
| 35 | PT tag meta/geo copy (Lisboa leak) | ❌→✅ | ✅ | P2 | **Fixed** |
| 36 | Spain hub empty-state fallback to corridor | — | ✅ | — | Pass |
| 37 | Prep2Go promo on notes | ✅ | — | P3 | PT-only sponsor (intentional) |

---

## Portugal vs Spain — key gaps

### Portugal (gold, minor fixes applied)

- **Strengths:** Mature note corpus, daily spotlight, Prep2Go integration, strong corridor backlinks from pillar guides, complete LLM layer.
- **Was wrong:** Hub `CollectionPage.about` said Lisbon while product positioning is Porto/Norte; tag pages and `llms-full` echoed Lisboa.
- **Remaining:** `/ru` homepage promotes only PT satellite; some legacy notes mention Lisbon (content-level, not template).

### Spain (structural parity, content lag)

- **Strengths:** Full code parity for SEO/LLM routes, 7 hand-curated editorial guides, `SpainFeaturedNotes` on `/ru/spain`, Valencia geo in schema and gates.
- **Was wrong:** `CorridorIntelLinks` still showed "Практика — скоро" for Spain; header logo linked to `/ru/spain` on `spain.emigro.online` (404 risk).
- **Remaining:** Low published note count until `npm run spain:daily` runs in production; no Prep2Go; main `/ru` hub missing ES satellite link.

---

## Sitemap counts (structure)

Both satellites share the same sitemap generator (`app/sitemap.ts`):

| URL pattern | PT | ES | Priority |
|-------------|----|----|----------|
| Hub `/` | 1 | 1 | 0.9 |
| `/llms` | 1 | 1 | 0.5 |
| `/notes/{slug}` | N_pt | N_es | 0.75–0.85 |
| `/tag/{tag}` | T_pt | T_es | 0.65 |

`llm-sitemap.xml` mirrors note/tag/hub URLs for both countries plus global LLM endpoints.

---

## GEO targeting summary

| Signal | Portugal | Spain |
|--------|----------|-------|
| Primary city | Porto (`cityRu: Порту`) | Valencia (`cityRu: Валенсия`) |
| Region emphasis | Norte (Porto, Braga, Minho) | Comunitat Valenciana + Madrid/Barcelona in copy |
| Schema `about: Place` hub | Porto, PT, Norte | Valencia, ES, Comunitat Valenciana |
| `editorial-quality.ts` gate | португал/porto/norte/брага | испан/valencia/nie/tie/extranjer |
| `seo-page.ts` default coords | 41.15°N Porto | 39.47°N Valencia |

---

## AEO / AUO (Answer Engine Optimization)

| Asset | PT | ES |
|-------|----|----|
| `/.well-known` via `llms.txt` | ✅ (global mentions PT hub) | ✅ (global mentions ES hub) |
| `/llms-full.txt` rows | ✅ all PT notes/tags | ✅ all ES notes/tags |
| `/llm-sitemap.xml` | ✅ | ✅ |
| `{host}/llms` | ✅ `buildPortugalLlmsTxt` | ✅ `buildSpainLlmsTxt` |
| `sr-only` `h2: ai:description` | hub, notes, tags | hub, notes, tags |
| Structured FAQ (`FAQPage` JSON-LD) | per note | per note |
| `SpeakableSpecification` | per note | per note |
| AI crawler allowlist in `robots.ts` | shared | shared |

---

## Fixes applied (this audit)

1. **PT hub schema** — `about: Place` Lisbon → Porto/Norte (`app/satellite/portugal/page.tsx`).
2. **PT tag pages** — meta, schema `about`, ai:description: Lisboa → Norte/Porto.
3. **ES + PT tag schema** — added `about: Place` (Valencia / Porto).
4. **`llms-full.ts`** — PT hub row + `llms.txt` section: Lisboa → Norte/Порту.
5. **`CorridorIntelLinks`** — Spain satellite card + compact nav link (was "скоро").
6. **`SpainSatelliteLayout`** — header logo uses `spainHubPath()` on subdomain.
7. **`PortugalSatelliteLayout`** — footer cross-link to Spain hub (parity with ES footer).

---

## Prioritized backlog (not fixed)

| P | Item | Owner |
|---|------|-------|
| P1 | Run `spain:daily` / seed publish so hub is not empty in prod | ops |
| P1 | Add `spain.emigro.online` link on `/ru` homepage (parity with PT) | frontend |
| P2 | Country-specific OG images (PT teal / ES amber) instead of `DEFAULT_OG_IMAGE` | design |
| P2 | `CollectionPage` on hub: add `mainEntity` ItemList like tag pages | frontend |
| P3 | `hreflang` cross-link PT↔ES only if bilingual pages appear | — |
| P3 | Prep2Go promo for ES notes (if sponsor extends) | product |

---

## Verification commands

```bash
npm run build
curl -s https://portugal.emigro.online/ | rg 'CollectionPage|ai:description|Porto'
curl -s https://spain.emigro.online/llms
curl -s https://www.emigro.online/llms-full.txt | rg 'spain.emigro|portugal.emigro'
curl -s https://www.emigro.online/llm-sitemap.xml | rg 'spain.emigro'
```

---

## References

- `app/satellite/{portugal,spain}/` — page templates
- `lib/community-notes/seo-page.ts` — shared metadata + schema builders
- `lib/community-notes/editorial-quality.ts` — geo quality gates
- `lib/seo/llms-full.ts` — global LLM index
- `app/sitemap.ts`, `app/llm-sitemap.xml/route.ts`, `app/robots.ts`
