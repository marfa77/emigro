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
2. Редактор пишет `community_notes` (SQL / будущий admin UI)
3. `status=published` → страница `/notes/{slug}` на сателлите

Полный коридор, wizard и news остаются на `www.emigro.online/ru/portugal`.
