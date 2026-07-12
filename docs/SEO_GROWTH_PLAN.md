# SEO Growth Plan — Emigro 2026

**Date:** 2026-07-12  
**Context:** Task 048e3100 analysis — impressions growing, clicks flat, avg position ~35. Technical SEO is strong; growth levers are cluster linking, CTR titles/meta, and satellite enrichment.

## Executive summary

| Lever | Status | Impact |
|-------|--------|--------|
| **Cluster internal linking** (PT / ES / BY) | Implemented | Narrows crawl paths from corridor → pillar → checklist → satellite → Barakhlo |
| **CTR title/meta** (top-10 long-tail URLs) | Implemented | Hooks with 2026 numbers + RU/BY intent in `query-longtail.ts` + guide frontmatter |
| **Spain satellite parity** | Implemented | Homepage block, pillar links on notes, enriched hub meta |
| **Corridor FAQ 2026 numbers** | Implemented | PT (D8 €3 680 / D7 €920) and ES (DNV €2 849) on landing pages |

## Cluster map

### Portugal (PT)

```
/ru/portugal
  → pillar: /ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026
  → checklist: /ru/guides/pervye-30-dnej-v-portugalii-2026
  → satellite: portugal.emigro.online
  → Barakhlo Porto
```

### Spain (ES)

```
/ru/spain
  → pillar: /ru/guides/vnj-ispaniya-2026
  → checklist: /ru/guides/pervye-30-dnej-v-ispanii-2026
  → satellite: spain.emigro.online
  → Barakhlo Valencia
```

### Belarus (BY)

```
/ru/guides/belorusy-v-evropu-vnj-2026
  → /ru/poland, /ru/czechia
  → /ru/guides/podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026
  → /ru/wizard?interest=poland,czechia
```

### Comparison cross-links

- `portugaliya-vs-ispaniya-vnj-2026` ↔ `digital-nomad-portugaliya-ispaniya-italiya-2026` ↔ `d7-vs-digital-nomad-visa-sravnenie`
- Each links to both PT and ES pillar guides

## Priority URLs — CTR hooks (implemented)

| URL | Title hook |
|-----|------------|
| `/ru/guides/pervye-30-dnej-v-portugalii-2026` | NIF Португалия 2026 — 30 дней для RU/BY |
| `/ru/guides/belorusy-v-evropu-vnj-2026` | Белорусы ВНЖ Европа 2026 — без TP |
| `/ru/guides/podtverdit-dohod-…` | Доход из РФ для D8/D7 2026 — документы |
| `/ru/guides/d7-vs-digital-nomad-visa-sravnenie` | D7 vs D8 Португалия 2026 — что выбрать |
| `/ru/guides/portugaliya-vs-ispaniya-vnj-2026` | Португалия vs Испания ВНЖ 2026 — RU/BY |
| `/ru/guides/konsulskaya-podacha-…` | Консульская подача RU/BY/KZ 2026 — D-виза |
| `/ru/guides/dokumenty-dlya-pereezda-…` | Документы переезд РФ 2026 — апостиль, ВНЖ |
| `/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026` | D8 Португалия 2026: €3 680 + AIMA — RU/BY/UA |
| `/ru/guides/digital-nomad-portugaliya-ispaniya-italiya-2026` | DN PT vs ES vs IT 2026 — €2 849 vs €3 680 |
| `/ru/portugal`, `/ru/spain` | Corridor landings with 2026 threshold FAQ |

## Code touchpoints

- `lib/seo/cluster-links.ts` — cluster definitions + guide mapping
- `lib/seo/query-longtail.ts` — exact-match SEO targets
- `components/guides/GuideClusterLinks.tsx` — guide page cluster nav
- `app/ru/page.tsx` — PT + ES satellite blocks on homepage
- `lib/seo/corridor-page-seo.ts` — corridor FAQ with 2026 numbers

## Post-deploy checklist

- [ ] Run `npm run build` locally — confirm exit 0
- [ ] Deploy on «деплой»
- [ ] **IndexNow** — ping changed URLs (priority guides + corridor landings + satellite hubs)
- [ ] **Google Search Console** — Request indexing for top-10 priority URLs
- [ ] **Yandex Webmaster** — Re-crawl `/ru`, `/ru/portugal`, `/ru/spain`, pillar guides
- [ ] Monitor GSC: impressions vs CTR for updated titles (2–4 weeks)
- [ ] Run `npm run spain:daily` in production if ES satellite note count is still low

## Metrics to watch

| Metric | Baseline (Jul 2026) | Target |
|--------|---------------------|--------|
| Avg position (priority URLs) | ~35 | Top 10 for 3+ long-tail queries |
| CTR (high-impression pages) | Flat | +0.5–1.5 pp after title refresh |
| Clicks (PT/ES cluster) | Flat vs impressions | Grow with position improvement |

## Open items (not code)

- ES satellite content volume — depends on `spain:daily` cron in production
- IndexNow / GSC manual indexing — user action after deploy
- A/B monitoring of new titles in GSC Performance report
