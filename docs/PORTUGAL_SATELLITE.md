# Portugal satellite — portugal.emigro.online

Сателлит Emigro для практических заметок по Лиссабону. Контент **не копируется** из Telegram — парсер собирает **сигналы**, редакция пишет текст.

## Деплой субдомена (Vercel)

1. Vercel → Project **emigro** → Settings → Domains → Add `portugal.emigro.online`
2. DNS у регистратора: `CNAME portugal → cname.vercel-dns.com` (или значение из Vercel)
3. `middleware.ts` уже делает rewrite `portugal.emigro.online` → `/satellite/portugal/*`

Локально без DNS: `http://localhost:3000/satellite/portugal`

## База

```bash
npm run db:push
```

Таблицы: `community_signals` (сырые сигналы), `community_notes` (опубликованные заметки).  
До первой публикации заметок сайт показывает fallback из `lib/community-notes/seed.ts`.

## Парсер (как Barakhlo)

```bash
cd parser
cp .env.example .env
# TG_API_ID, TG_API_HASH — my.telegram.org
# COMMUNITY_INGEST_API_KEY — тот же ключ на Vercel

pip install -r requirements.txt
python main.py --auth          # один раз
python main.py --once --dry-run  # проверка
python main.py --once            # POST → /api/v1/ingest/community-signals
python main.py --since-days 30 --json-out out/signals-month.json  # месяц истории
```

Месячный бэкфил (из корня emigro):

```bash
npm run portugal:backfill-month              # 30 дней → signals → до 5 черновиков Gemini
npm run portugal:backfill-month -- --days=14 --skip-drafts
```

Каналы в `parser/groups.yaml`: `@chatlisboa`, `@por_tugal`.

## Ingest API

```
POST /api/v1/ingest/community-signals
X-Api-Key: $COMMUNITY_INGEST_API_KEY

{ "signals": [{ "message_id", "channel_username", "text", "posted_at", ... }] }
```

Env на Vercel: `COMMUNITY_INGEST_API_KEY` (или временно `EMIGRO_ADMIN_SECRET`).

## Редакционный цикл

1. Парсер → `community_signals` (`status=new`)
2. Gemini / редактор → `community_notes` (`status=published`)
3. Страницы: `/notes/{slug}`, навигация по `/tag/{tag}`

Полный коридор, wizard и news остаются на `www.emigro.online/ru/portugal`.

## Типы контента и хэштеги

Парсер классифицирует сигналы: `news`, `lifehack`, `tip`, `guide`, `qa`.  
Хэштеги (`hashtags[]`) — из тем сообщения + inline `#теги`; на hub — pills `#nif`, `#aima`, `#лайфхак` и т.д.

```bash
npm run portugal:backfill-tags   # пересчёт тегов у опубликованных заметок
npm run portugal:community       # парсер → ingest → черновики
npm run portugal:daily           # ежедневный инкремент
npm run portugal:backfill-month  # 30 дней истории
```

## Ежедневный cron

**GitHub Actions** (`portugal-community-daily.yml`) — **07:00 UTC**: парсер → ingest → до 2 черновиков.

Secrets: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_API_KEY`, `TG_API_ID`, `TG_API_HASH`, `TG_SESSION_STRING`, `COMMUNITY_INGEST_API_KEY`.

**Vercel cron** — `GET /api/cron/portugal-community` **09:30 UTC** (fallback drafts из ingested signals).

VPS: `parser/run_daily.sh` — только парсер → POST ingest API.

**Spotlight** — плитка «Лучшее за сегодня» на hub: Threads-текст + кнопка копирования. Обновляется после daily cron (`refreshDailySpotlight`). Ручной прогон: `npm run portugal:spotlight`.

## DNS / субдомен

- CNAME `portugal` → `cname.vercel-dns.com` (Namecheap)
- **Canonical URL** по умолчанию: `https://www.emigro.online/satellite/portugal` (пока DNS субдомена не настроен)
- После настройки DNS: `PORTUGAL_SATELLITE_USE_SUBDOMAIN=true` на Vercel
- Fallback без DNS: `https://www.emigro.online/satellite/portugal`

## Ремонт данных

```bash
npm run portugal:repair   # архив off-topic, починка category/links/hashtags
npm run portugal:spotlight
```
