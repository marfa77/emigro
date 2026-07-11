# Spain satellite — spain.emigro.online

Сателлит Emigro для практических заметок по Испании (Valencia и др.). Контент **не копируется** из Telegram — парсер собирает **сигналы**, редакция пишет текст.

## Деплой субдомена (Vercel)

Перед любым prod-деплоем: `npm run build` должен пройти локально. Чеклист: [DEPLOY.md](./DEPLOY.md).

1. Vercel → Project **emigro** → Settings → Domains → Add `spain.emigro.online` (уже добавлен)
2. DNS у регистратора **emigro.online** — добавить запись (как у Portugal):

   | Type  | Name   | Value                 | TTL  |
   |-------|--------|-----------------------|------|
   | CNAME | `spain` | `cname.vercel-dns.com` | Auto |

   Альтернатива (если регистратор не поддерживает CNAME на поддомен): `A` → `spain` → `76.76.21.21`

3. `middleware.ts` уже делает rewrite `spain.emigro.online` → `/satellite/spain/*`

Локально без DNS: `http://localhost:3000/satellite/spain`

### Проверка DNS

```bash
dig +short spain.emigro.online CNAME   # → cname.vercel-dns.com.
curl -sI https://spain.emigro.online/  # → HTTP 200
```

### Временный URL, пока DNS не настроен

Production по умолчанию редиректит `www.emigro.online/satellite/spain` → `spain.emigro.online` (301). Пока DNS не резолвится, субдомен недоступен.

**Обход:** в Vercel → Project **emigro** → Settings → Environment Variables добавить:

```
SPAIN_SATELLITE_USE_SUBDOMAIN=false
```

(Production scope) → Redeploy. Тогда работает:

`https://www.emigro.online/satellite/spain`

После настройки DNS удалите переменную или поставьте `true` и redeploy.

## База

Те же таблицы, что Portugal: `community_signals`, `community_notes` (фильтр по `country_key = 'spain'`).

```bash
npm run db:push
```

## Cron на VPS

См. [SPAIN_CRON.md](./SPAIN_CRON.md).

## URL и SEO

- **Canonical URL:** `https://spain.emigro.online` (production по умолчанию)
- `www.emigro.online/satellite/spain/*` → **301** на subdomain (когда `SPAIN_SATELLITE_USE_SUBDOMAIN` не `false`)
- Локально: `http://localhost:3000/satellite/spain`
- Pillar / wizard / digest на основном сайте: `https://www.emigro.online/ru/spain`

## Связанные файлы

| Что | Путь |
|-----|------|
| Satellite config | `lib/satellite/spain.ts` |
| Middleware rewrite | `middleware.ts` → `rewriteSpainSatellite` |
| URL helpers | `lib/site-url.ts` → `spainSatelliteUrl`, `spainSatellitePublicUrl` |
| Pages | `app/satellite/spain/*` |
