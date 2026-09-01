# Yandex & Alice AI — SEO checklist

Emigro targets Russian-speaking users on **Yandex Search** and **Alice AI**, not Google.

## 1. Yandex Metrika (обязательно для ПФ и обхода)

1. Create counter: [metrika.yandex.ru](https://metrika.yandex.ru/) → **Добавить счётчик** → site `https://www.emigro.online`
2. Copy **numeric ID** (e.g. `12345678`) from **Настройки → Счётчик**
3. Set in Vercel: `NEXT_PUBLIC_YANDEX_METRIKA_ID=<id>` and redeploy
4. The app loads Metrika in `app/layout.tsx` via `components/analytics/YandexMetrika.tsx` (SPA hits on route change)
5. Link to Webmaster (step below) → **Индексирование → Обход по счётчикам → ВКЛ**

Counter is **not** loaded when `NEXT_PUBLIC_YANDEX_METRIKA_ID` is empty (safe for local dev).

## 2. Yandex Webmaster (обязательно)

1. Add site: [webmaster.yandex.ru](https://webmaster.yandex.ru/)
2. Verify ownership via meta tag:
   - Copy code from **Настройки → Подтверждение прав → Meta-тег**
   - Set `NEXT_PUBLIC_YANDEX_VERIFICATION=<code>` in Vercel env
   - The app reads this env in `rootMetadata()` and renders the Yandex verification meta tag only when the value is present
   - Do not commit or invent the token; the value must come from Yandex Webmaster
   - Redeploy
3. Submit sitemap: `https://www.emigro.online/sitemap.xml`
4. **Привязка Метрики:** Настройки → Привязка к Яндекс.Метрике → добавить ID счётчика → подтвердить в Метрике (если аккаунты разные)
5. **Обход по счётчикам:** Индексирование → Обход по счетчикам → включить тумблер
6. Enable **IndexNow** in Webmaster (uses the same key as `INDEXNOW_KEY`)

## 3. IndexNow (Yandex first)

| Endpoint | Role |
|----------|------|
| `https://yandex.com/indexnow` | **Primary** — Russian audience |
| `https://api.indexnow.org/indexnow` | Secondary (free) |
| `https://www.bing.com/indexnow` | Secondary (free) |

Key file: `public/{INDEXNOW_KEY}.txt` (must contain only the key string).

After deploy or content publish:

```bash
npm run seo:indexnow
```

Check **Yandex Webmaster → Индексирование → IndexNow** for submission status.

## 4. Alice AI visibility

Alice cites pages that already rank well in Yandex organic (top ~30). There is no separate "Alice sitemap".

**Actionable in product:**

- Quality Russian content with clear H1/H2 and direct answers (answer-first)
- FAQ / Article schema where appropriate
- Do **not** block `YandexAdditionalBot` in `robots.txt` (configured in `app/robots.ts`)
- Monitor: **Webmaster → Эффективность → Видимость сайта в Алисе AI**
  - [alice visibility tool](https://webmaster.yandex.ru/site/efficiency/alice/)

`llms.txt` and `llms-full.txt` are maintained for AI agents; Yandex does not officially require them, but they help structure discovery.

## 5. robots.txt & host

- `app/robots.ts` allows all Yandex bots explicitly
- `Host` directive points to production domain (Yandex-specific)
- Sitemap URL in robots

## 6. Google Search Console (recommended for ranking)

### www

1. Prefer a **Domain** property `emigro.online` (covers www + satellites) or URL-prefix `https://www.emigro.online`
2. Verify via DNS (Domain) or HTML meta → Vercel: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<code>`
3. Submit sitemap: `https://www.emigro.online/sitemap.xml`
4. Enable sitemap ping: `PING_GOOGLE_SITEMAP=1` in Vercel env (also runs on `npm run seo:indexnow`)
5. Request indexing for pillar URLs (guides, top programs) via URL Inspection

### Satellites (required — www sitemap does **not** list them)

`Crawled - currently not indexed` + `No referring sitemaps detected` on `portugal.` / `spain.` means Google fetched the page but the host sitemap was never associated in GSC.

`Duplicate without user-selected canonical` on the hub = slash mismatch between Googlebot (`…/`) and Next’s HTML canonical (no slash). We emit matching sitemap locs + an HTTP `Link: rel=canonical` on the hub; submit the satellite sitemap in GSC and Request indexing on `https://portugal.emigro.online`.

1. In the **same Domain property** (or separate URL-prefix properties for each subdomain), submit:
   - `https://portugal.emigro.online/sitemap.xml`
   - `https://spain.emigro.online/sitemap.xml`
2. Wait until Sitemaps shows **Success** and discovered URL counts (~hub + notes + tags with ≥4 notes). If GSC shows **Temporary processing error**, remove + re-add the sitemap (live map is ~hub + notes + thick tags only — `/llms` is not listed; empty/noindex Cyrillic tags are excluded).
3. URL Inspection → confirm **User-declared canonical** → **Request indexing** on hub + 3–5 pillar notes.
4. Do **not** expect `llm-sitemap.xml` to index satellites — it is for LLM discovery via `llms.txt`, not a Google Sitemap.
5. **Bing / IndexNow:** `npm run seo:indexnow` loads live host sitemaps and pings Yandex → api.indexnow.org → Bing. Key file must resolve on each host (`/{INDEXNOW_KEY}.txt`). Acceptance (HTTP 200/202) ≠ immediate `site:` results — check Bing Webmaster URL submission after 24–72h.

Audience remains Yandex-first; Google is secondary but useful for long-tail ranking.

## 7. Post-deploy routine

1. `npm run build` — verify no errors
2. `npm run seo:indexnow` — ping all sitemap URLs to Yandex
3. Yandex Webmaster — recrawl important URLs manually if urgent
4. Check Alice visibility dashboard weekly after content pushes
