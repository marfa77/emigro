# Bing/Yandex SEO batch 2 — 16 Nov 2026

Post–PR #24 title/description updates (IndexNow / GSC / Yandex resubmit).

## Guide & pillar meta

| URL | Old title | New title | Old description | New description |
|-----|-----------|-----------|-----------------|-----------------|
| https://www.emigro.online/ru/guides/gruziya-dlya-rossiyan-2026 | Грузия для россиян 2026 — ВНЖ $150k, IT permit \| Emigro | Грузия для россиян 2026: безвиз 365 дней \| Emigro | Грузия 2026: медстраховка на въезд, work permit с 1.03, ВНЖ по недвижимости от $150 000… | Грузия 2026: безвиз для РФ до 365 дней, медстраховка от 30 000 лари, Right to Work с 1 марта, ВНЖ за недвижимость от $150 000. СИДН с РФ нет. |
| https://www.emigro.online/ru/guides/armeniya-dlya-rossiyan-2026 | Армения 2026 — ВНЖ, ИП 1%, банки для RU/UA/KZ/BY \| Emigro | Армения для россиян 2026: безвиз 180 дней \| Emigro | Армения 2026: безвиз 180 дней (не 183 налоговых)… | Армения 2026: безвиз 180 дней за год (лимит не обнуляется выездом), работа для граждан ЕАЭС без permit, IT-ИП 1% оборота, ВНЖ на практике 30–60 дней. |
| https://www.emigro.online/es/guides/nacionalidad-espanola-latam-2026 | Nacionalidad española LATAM 2026 — 2 años \| Emigro | Nacionalidad española LATAM: 2 años, art. 22 \| Emigro | Nacionalidad española ~2 años (art. 22) para iberoamericanos… | Nacionalidad española para iberoamericanos: 2 años de residencia legal continuada (art. 22). CCSE; DELE A2 suele no exigirse. Los estudios no computan. |
| https://www.emigro.online/es/guides/residencia-espana-desde-paraguay-2026 | Residencia España Paraguay 2026 — 2 años \| Emigro | Emigrar a España desde Paraguay 2026 \| Emigro | Cómo emigrar a España desde Paraguay 2026: Schengen ≠ residencia… | Cómo emigrar a España desde Paraguay 2026: Schengen 90/180 no es residencia. Nómada (~€2.849/mes), no lucrativa en Asunción y nacionalidad en 2 años (art. 22). |
| https://www.emigro.online/es/guides/residencia-espana-desde-ecuador-2026 | Residencia España Ecuador 2026 — Schengen \| Emigro | Emigrar a España desde Ecuador 2026 \| Emigro | Cómo emigrar a España desde Ecuador 2026: visado Schengen ≠ residencia… | Ecuador necesita visado Schengen o nacional para España. Residencia 2026: nómada digital (~€2.849/mes), no lucrativa y nacionalidad en 2 años (art. 22). |
| https://www.emigro.online/fr/guides/passeport-talent-france-afrique-2026 | Passeport Talent France 2026 — Afrique \| Emigro | Passeport Talent France 2026: seuil €39.582 \| Emigro | Passeport Talent pour Maghreb/Sénégal : seuils ~€39.582… | Passeport Talent France 2026 pour le Maghreb et le Sénégal: salarié qualifié souvent ≥ 39 582 € brut/an, catégories et VLS-TS. Confirmez sur service-public. |

## News

| URL | Old title | New title | Notes |
|-----|-----------|-----------|-------|
| https://www.emigro.online/ru/news/sweden-story-2026-08-31-ea8jvq | Выборы Швеции 2026: программы партий для иностранцев… | Выборы в Швеции 2026: 31 августа | Override in git + `scripts/apply-bing-seo-batch2-news.ts` for Supabase |
| https://www.emigro.online/ru/news?country=* | Same as `/ru/news` | Новости {страна} — ВНЖ и гражданство | Distinct title/description; canonical remains `/ru/news` |
| `*story*` with seo_title `Пересмотр шенгенских виз…` | Identical across AT/NO/FR/DE | `Пересмотр шенгенских виз: {страна}` | Runtime disambiguation + DB script |

## Changed URLs (IndexNow)

```
https://www.emigro.online/ru/guides/gruziya-dlya-rossiyan-2026
https://www.emigro.online/ru/guides/armeniya-dlya-rossiyan-2026
https://www.emigro.online/es/guides/nacionalidad-espanola-latam-2026
https://www.emigro.online/es/guides/residencia-espana-desde-paraguay-2026
https://www.emigro.online/es/guides/residencia-espana-desde-ecuador-2026
https://www.emigro.online/fr/guides/passeport-talent-france-afrique-2026
https://www.emigro.online/ru/news/sweden-story-2026-08-31-ea8jvq
https://www.emigro.online/ru/news
https://www.emigro.online/ru/news?country=portugal
https://www.emigro.online/ru/news?country=germany
https://www.emigro.online/ru/news?country=netherlands
https://www.emigro.online/ru/news?country=austria
https://www.emigro.online/ru/news?country=france
https://www.emigro.online/ru/news?country=norway
https://www.emigro.online/ru/news?country=sweden
https://www.emigro.online/ru/guides/prodlenie-vnzh-portugaliya-aima-2026
https://www.emigro.online/ru/guides/vnj-germaniya-2026
https://www.emigro.online/ru/guides/vnj-austria-2026
https://www.emigro.online/ru/guides/kazahstan-dlya-rossiyan-2026
https://www.emigro.online/ru/guides/vnj-italiya-2026-digital-nomad
https://www.emigro.online/ru/guides/vnj-kipr-2026-digital-nomad-fip-non-dom
https://www.emigro.online/ru/guides/chernogoriya-vnj-dlya-rossiyan-2026
```

After deploy, run on a machine with production Supabase credentials:

`npx tsx scripts/apply-bing-seo-batch2-news.ts`