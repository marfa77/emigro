# Portugal satellite — cron на production

**Прод:** VPS + **systemd timer** (тот же сервер, что Barakhlo parser).  
**GitHub Actions schedule отключён** — workflow `portugal-community-daily.yml` только **ручной**.

## Расписание

| Когда | Unit | Что |
|-------|------|-----|
| **Ежедневно 07:00 UTC** (09:00 Lisbon летом) | `emigro-portugal-community.timer` | `parser/run_scheduled.sh` → `npm run portugal:daily` |

Timer с **`Persistent=true`** — пропуск догоняется после перезагрузки VPS.

## Что делает прогон

1. Синхронизация cursor Telethon из Supabase (`community_signals`)
2. Парсер `@chatlisboa`, `@por_tugal`, `@lepta` → JSON
3. Ingest в `community_signals` (direct Supabase, без Vercel HTTP)
4. До **1** Gemini-черновика → `community_notes` (`published`)
5. Обновление daily spotlight на hub

## Переменные на VPS

`/opt/emigro/parser/.env` (Telethon):

```env
TG_API_ID=
TG_API_HASH=
TG_SESSION_STRING=
PARSER_INCREMENTAL_LIMIT=60
PARSER_MAX_AGE_HOURS=36
```

`/opt/emigro/.env` (Node pipeline):

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_API_KEY=
EMIGRO_NEWS_FAST_MODEL=gemini-2.5-flash
```

`COMMUNITY_INGEST_API_KEY` на VPS **не нужен** — ingest идёт direct в Supabase из `npm run portugal:daily`.

## Деплой

```bash
cd parser && ./deploy.sh
```

Первый раз на сервере: `cd /opt/emigro/parser && source .venv/bin/activate && python main.py --auth`  
(или положить `TG_SESSION_STRING` в `.env`).

## Ручной запуск

```bash
# VPS
systemctl start emigro-portugal-community.service
tail -f /opt/emigro/parser/logs/scheduled-$(date +%Y%m%d).log

# Mac (из корня репо)
npm run portugal:daily
```

## GitHub Actions

Actions → **Portugal community daily** → **Run workflow** — только для экстренного прогона без VPS.

## Vercel cron

`/api/cron/portugal-community` **убран** из `vercel.json` — иначе двойная публикация черновиков.  
Сайт на Vercel только отдаёт страницы; pipeline живёт на VPS.
