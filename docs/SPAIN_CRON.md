# Spain satellite — cron на production

**Прод:** VPS + **systemd timer** (тот же сервер, что Portugal/Barakhlo parser).  
**GitHub Actions schedule** — пока не настроен; ручной прогон через `npm run spain:daily`.

## Расписание

| Когда | Unit | Что |
|-------|------|-----|
| **Ежедневно 07:30 UTC** (после Portugal 07:00) | `emigro-spain-community.timer` | `parser/run_scheduled_spain.sh` → `npm run spain:daily` |

Timer с **`Persistent=true`** — пропуск догоняется после перезагрузки VPS.

## Что делает прогон

1. Синхронизация cursor Telethon из Supabase (`community_signals`)
2. Парсер `@spain_granitsa`, `@spainchats`, `@valenforum`, `@valenciarusia`, `@migranty_barselona` → JSON
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
SPAIN_SATELLITE_USE_SUBDOMAIN=true
```

`COMMUNITY_INGEST_API_KEY` на VPS **не нужен** — ingest идёт direct в Supabase из `npm run spain:daily`.

## Деплой

```bash
cd parser && ./deploy.sh
```

Unit-файлы: `deploy/systemd/emigro-spain-community.{service,timer}`.

Ручная установка на VPS (если без `deploy.sh`):

```bash
sudo cp /opt/emigro/deploy/systemd/emigro-spain-community.service /etc/systemd/system/
sudo cp /opt/emigro/deploy/systemd/emigro-spain-community.timer /etc/systemd/system/
sudo chmod +x /opt/emigro/parser/run_scheduled_spain.sh
sudo systemctl daemon-reload
sudo systemctl enable --now emigro-spain-community.timer
systemctl list-timers --all | grep emigro-spain
```

Первый раз на сервере: `cd /opt/emigro/parser && source .venv/bin/activate && python main.py --auth`  
(или положить `TG_SESSION_STRING` в `.env` — та же Telethon-сессия, что для Portugal).

## Каналы (parser/groups.yaml)

| Channel | Focus |
|---------|--------|
| `@spain_granitsa` | Граница, extranjería, TIE, DNV/UGE — general ES (~5k) |
| `@spainchats` | Country-wide relocants Q&A (~12k) |
| `@valenforum` | Valencia forum, аренда, быт (~4.8k) |
| `@valenciarusia` | Valencia ВНЖ и жизнь без рекламы (~4.2k) |
| `@migranty_barselona` | Barcelona extranjería practice (~3.7k) |

## Ручной запуск

```bash
# VPS
systemctl start emigro-spain-community.service
tail -f /opt/emigro/parser/logs/scheduled-spain-$(date +%Y%m%d).log

# Mac (из корня репо)
npm run spain:daily

# Только ingest + spotlight, без черновиков
npm run spain:daily -- --skip-drafts

# Fact-check перед правкой гайдов
npm run spain:guide-factcheck
npm run spain:guide-factcheck -- --guide=vnj-ispaniya --seed-only
```

## Vercel cron

Community pipeline для Spain **не** дублируется на Vercel — только VPS, как Portugal.

Сайт на Vercel отдаёт страницы `spain.emigro.online` / `/satellite/spain`.

## Связанные документы

- `docs/SPAIN_GUIDE_FACTCHECK.md` — цитаты в pillar-гайдах
- `docs/CORRIDOR_SATELLITE_PLAYBOOK.md` — чеклист репликации
