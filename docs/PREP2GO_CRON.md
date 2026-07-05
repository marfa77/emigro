# Prep2Go news import — cron на production

**Прод:** VPS + **systemd timer** (тот же сервер, что Portugal parser).  
**Vercel cron отключён** — `/api/cron/prep2go-news` убран из `vercel.json`.

## Расписание

| Когда | Unit | Что |
|-------|------|-----|
| **Ежедневно 09:00 UTC** (11:00 Moscow / 10:00 Lisbon летом) | `emigro-prep2go-news.timer` | `deploy/prep2go-news/run_scheduled.sh` → `npm run news:import-prep2go -- --daily` |

Timer с **`Persistent=true`** — пропуск догоняется после перезагрузки VPS.

YouTube Shorts (`emigro-youtube-shorts.timer`, 09:15 UTC) стартует **после** импорта новостей.

## Что делает прогон

1. Читает свежий digest из Prep2Go Supabase (`news_digests`, проект CIPLE A2) или RSS fallback
2. Gemini-перевод → `emigro_news_digests` (Emigro Supabase)
3. Публикация в Telegram `@Emigro_news` (если токен задан)
4. Revalidate кэша страниц новостей на Vercel (через `CRON_SECRET` / admin secret)

## Переменные на VPS

`/opt/emigro/.env`:

```env
# Emigro Supabase (write target)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Prep2Go source (CIPLE A2 Supabase — read-only)
PREP2GO_SUPABASE_URL=
PREP2GO_SUPABASE_SERVICE_ROLE_KEY=
# или PREP2GO_SUPABASE_ANON_KEY=

# Gemini translation
GOOGLE_API_KEY=
EMIGRO_NEWS_FAST_MODEL=gemini-2.5-flash
EMIGRO_NEWS_MODEL=gemini-2.5-pro

# Telegram @Emigro_news
EMIGRO_NEWS_BOT_TOKEN=
# EMIGRO_NEWS_TELEGRAM_CHANNEL=@Emigro_news

# Cache revalidation on Vercel (optional but recommended)
CRON_SECRET=
# EMIGRO_ADMIN_SECRET=  # fallback for revalidate
```

`CRON_SECRET` на VPS нужен только для HTTP revalidate после импорта — не для auth systemd job.

## Деплой

```bash
cd parser && ./deploy.sh
```

## Ручной запуск

```bash
# VPS
systemctl start emigro-prep2go-news.service
tail -f /opt/emigro/deploy/prep2go-news/logs/scheduled-$(date +%Y%m%d).log

# Mac (из корня репо)
npm run news:import-prep2go:daily
# или
npm run news:import-prep2go -- --daily
```

## Vercel cron

`/api/cron/prep2go-news` **убран** из `vercel.json` — иначе двойной импорт.  
Route остаётся для ручного/legacy вызова; **production pipeline живёт на VPS**.  
На Vercel остаётся только `/api/cron/social-subscribers`.
