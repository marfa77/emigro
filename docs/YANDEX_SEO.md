# Yandex & Alice AI — SEO checklist

Emigro targets Russian-speaking users on **Yandex Search** and **Alice AI**, not Google.

## 1. Yandex Webmaster (обязательно)

1. Add site: [webmaster.yandex.ru](https://webmaster.yandex.ru/)
2. Verify ownership via meta tag:
   - Copy code from **Настройки → Подтверждение прав → Meta-тег**
   - Set `NEXT_PUBLIC_YANDEX_VERIFICATION=<code>` in Vercel env
   - Redeploy
3. Submit sitemap: `https://www.emigro.online/sitemap.xml`
4. Enable **IndexNow** in Webmaster (uses the same key as `INDEXNOW_KEY`)

## 2. IndexNow (Yandex first)

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

## 3. Alice AI visibility

Alice cites pages that already rank well in Yandex organic (top ~30). There is no separate "Alice sitemap".

**Actionable in product:**

- Quality Russian content with clear H1/H2 and direct answers (answer-first)
- FAQ / Article schema where appropriate
- Do **not** block `YandexAdditionalBot` in `robots.txt` (configured in `app/robots.ts`)
- Monitor: **Webmaster → Эффективность → Видимость сайта в Алисе AI**
  - [alice visibility tool](https://webmaster.yandex.ru/site/efficiency/alice/)

`llms.txt` and `llms-full.txt` are maintained for AI agents; Yandex does not officially require them, but they help structure discovery.

## 4. robots.txt & host

- `app/robots.ts` allows all Yandex bots explicitly
- `Host` directive points to production domain (Yandex-specific)
- Sitemap URL in robots

## 5. Google (optional, secondary)

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — only if you use Search Console
- `PING_GOOGLE_SITEMAP=1` — opt-in Google sitemap ping on news publish (off by default)

## 6. Post-deploy routine

1. `npm run build` — verify no errors
2. `npm run seo:indexnow` — ping all sitemap URLs to Yandex
3. Yandex Webmaster — recrawl important URLs manually if urgent
4. Check Alice visibility dashboard weekly after content pushes
