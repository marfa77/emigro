# Emigro

Corridor-first relocation navigator. MVP-A: **Russian-speaking → Portugal**.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL)
- json-logic-js (eligibility rules)

## Setup

```bash
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

npm install
npm run dev
```

Open http://localhost:3000 → redirects to `/ru/portugal`.

## Database

Migrations live in `supabase/migrations/`. Tables are prefixed `emigro_` (shared Supabase project with Garmin wellness).

```bash
supabase link --project-ref wcwadwcjqutdxwbrkyai
npm run db:push
```

## MVP-A routes

| Path | Purpose |
|------|---------|
| `/ru/portugal` | Corridor landing |
| `/ru/portugal/wizard` | Multi-axis route finder |
| `/ru/portugal/results?session=…` | Eligibility compare + lead form |
| `/ru/portugal/programs/[slug]` | Program detail + sources |
| `/ru/portugal/digest` | Справочник коридора (CIPLE layer) |
| `/ru/news` | Еженедельные новости (все страны, RU, SEO) |
| `/ru/news?country=portugal` | Фильтр по стране |
| `/ru/news/feed.xml` | RSS (опционально `?country=`) |
| `/admin` | Ops hub: topics, digest, API |
| `/admin/topics` | News destinations (из БД) |
| `/admin/digest` | Справочник коридора (из БД) |

## News publishing

```bash
npm run news:import-prep2go                      # импорт Prep2Go → сайт + Telegram
npm run news:import-prep2go -- --topic=spain     # одна страна
npm run news:import-prep2go -- --dry-run --limit=3
npm run news:import-prep2go:daily                # daily mode: только свежая статья
```

- Production source: Prep2Go article → Gemini translation/adaptation → QA gates → `emigro_news_digests` → **@Emigro_news**.
- Google News/RSS weekly generation is legacy/manual only: `npm run news:weekly -- --dry-run`. It is not scheduled in production.
- Content must stay specific to the Prep2Go source article: no generic checklists, investor tips, SEO filler, unsupported risk language, or alarmist framing.
- Переопубликовать существующий выпуск: `npm run news:publish-threads -- <slug>`
- Cron: `GET /api/cron/prep2go-news` + `Authorization: Bearer $CRON_SECRET`
- Добавить страну: `POST /api/v1/admin/news-topics` + `EMIGRO_ADMIN_SECRET` (или SQL в `emigro_news_topics`)
- Справочник: `POST /api/v1/admin/corridors/ru-speaking-to-portugal/digest`

## API

- `GET /api/v1/corridors/ru-speaking-to-portugal`
- `GET /api/v1/corridors/ru-speaking-to-portugal/wizard`
- `POST /api/v1/corridors/ru-speaking-to-portugal/wizard/sessions`
- `POST /api/v1/corridors/ru-speaking-to-portugal/wizard/sessions/:id/evaluate`
- `POST /api/v1/corridors/ru-speaking-to-portugal/leads`

## Docs

See `docs/ARCHITECTURE.md`, `docs/CORRIDOR_STRATEGY.md`, `docs/SCHEMA_AND_API.md`.
