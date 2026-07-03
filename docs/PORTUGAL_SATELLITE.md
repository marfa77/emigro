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
2. Gemini / редактор → `community_notes` (`status=published`)
3. Страницы: `/notes/{slug}`, навигация по `/tag/{tag}`

Полный коридор, wizard и news остаются на `www.emigro.online/ru/portugal`.

## Типы контента и хэштеги

Парсер классифицирует сигналы: `news`, `lifehack`, `tip`, `guide`, `qa`.  
Хэштеги (`hashtags[]`) — из тем сообщения + inline `#теги`; на hub — pills `#nif`, `#aima`, `#лайфхак` и т.д.

```bash
npm run portugal:backfill-tags   # пересчёт тегов у опубликованных заметок
npm run portugal:community       # парсер → ingest → черновики
```

## DNS / субдомен

- CNAME `portugal` → `cname.vercel-dns.com` (Namecheap)
- Если локально `NXDOMAIN` — кэш роутера/провайдера; проверка: `dig portugal.emigro.online @8.8.8.8 +short`
- Fallback без DNS: `https://www.emigro.online/satellite/portugal`
