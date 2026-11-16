# Bing batch 2 follow-up — long-tail sync + news country meta

## Approach

`generateMetadata` on guide pages uses `getLongTailByGuideSlug()` **before** frontmatter (`app/ru/guides`, `app/es/guides`, `app/fr/guides`). Batch-2 `seo_title` / `seo_description` in markdown were ignored for five slugs that have `QUERY_LONG_TAIL_TARGETS` rows. **Fix:** align long-tail rows with frontmatter (same as batch-2 proposals). No global precedence change — other long-tail pages unchanged.

**Армения** (`armeniya-dlya-rossiyan-2026`) has no long-tail row; it already served frontmatter after batch 2.

## Live-expected guide meta (5 URLs)

| URL | Title (incl. ` \| Emigro` where applicable) | Meta description |
|-----|---------------------------------------------|------------------|
| https://www.emigro.online/ru/guides/gruziya-dlya-rossiyan-2026 | Грузия для россиян 2026: безвиз 365 дней \| Emigro | Грузия 2026: безвиз для РФ до 365 дней, медстраховка от 30 000 лари, Right to Work с 1 марта, ВНЖ за недвижимость от $150 000. СИДН с РФ нет. |
| https://www.emigro.online/es/guides/nacionalidad-espanola-latam-2026 | Nacionalidad española LATAM: 2 años, art. 22 \| Emigro | Nacionalidad española para iberoamericanos: 2 años de residencia legal continuada (art. 22). CCSE; DELE A2 suele no exigirse. Los estudios no computan. |
| https://www.emigro.online/es/guides/residencia-espana-desde-paraguay-2026 | Emigrar a España desde Paraguay 2026 \| Emigro | Cómo emigrar a España desde Paraguay 2026: Schengen 90/180 no es residencia. Nómada (~€2.849/mes), no lucrativa en Asunción y nacionalidad en 2 años (art. 22). |
| https://www.emigro.online/es/guides/residencia-espana-desde-ecuador-2026 | Emigrar a España desde Ecuador 2026 \| Emigro | Ecuador necesita visado Schengen o nacional para España. Residencia 2026: nómada digital (~€2.849/mes), no lucrativa y nacionalidad en 2 años (art. 22). |
| https://www.emigro.online/fr/guides/passeport-talent-france-afrique-2026 | Passeport Talent France 2026: seuil €39.582 \| Emigro | Passeport Talent France 2026 pour le Maghreb et le Sénégal: salarié qualifié souvent ≥ 39 582 € brut/an, catégories et VLS-TS. Confirmez sur service-public. |

## Live-expected news filter meta (all active `?country=`)

| URL pattern | Title | Description |
|-------------|-------|-------------|
| `/ru/news?country=portugal` | Новости Португалия — ВНЖ и гражданство | Еженедельные обзоры по релокации в Португалии. Не юридическая консультация — ориентиры с источниками. |
| `/ru/news?country=france` | Новости Франция — ВНЖ и гражданство | Еженедельные обзоры по релокации во Франции. … |
| (other active topics) | Новости {countryRu} — ВНЖ и гражданство | Еженедельные обзоры по релокации {ruCountryIn}. … |

Canonical remains `https://www.emigro.online/ru/news`.

## IndexNow / recrawl (this PR)

```
https://www.emigro.online/ru/guides/gruziya-dlya-rossiyan-2026
https://www.emigro.online/es/guides/nacionalidad-espanola-latam-2026
https://www.emigro.online/es/guides/residencia-espana-desde-paraguay-2026
https://www.emigro.online/es/guides/residencia-espana-desde-ecuador-2026
https://www.emigro.online/fr/guides/passeport-talent-france-afrique-2026
https://www.emigro.online/ru/news?country=portugal
https://www.emigro.online/ru/news?country=france
https://www.emigro.online/ru/news?country=spain
https://www.emigro.online/ru/news?country=italy
https://www.emigro.online/ru/news?country=germany
https://www.emigro.online/ru/news?country=netherlands
```