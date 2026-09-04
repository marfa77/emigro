# Threads API (Meta) — Emigro **brand** account

Постинг **только из `@emigro2eu`**, не из личного Threads/Instagram.
Barakhlo делает так же: отдельный `@barakhlo_portugal` и `THREADS_PT_*` в `.env`.
У Emigro один бренд-аккаунт → обычные `THREADS_*` (не смешивать с личным токеном).
Live publish и `threads:whoami` падают, если `/me` ≠ `emigro2eu`.

Автопубликация **выключена** по умолчанию (`THREADS_AUTO_PUBLISH` ≠ `1`), кроме:

- **#молния после ✅ Threads** в Telegram (webhook на Vercel);
- **ежедневный крон на VPS** — **три потока**: гайды (`emigro-threads-daily`), сателлиты PT (`emigro-threads-satellites`), новости только через ✅ в Telegram (lightning webhook).

Telegram остаётся одним постом. Threads — reply-chain.

Официально: [Get access tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/), [Long-lived tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens/), [Posts](https://developers.facebook.com/docs/threads/posts/).

## 1. Meta App

1. [developers.facebook.com](https://developers.facebook.com/) → создать / открыть приложение.
2. Use case: **Access the Threads API**.
3. App Dashboard → **App settings → Basic**:
   - **Threads App ID** → `THREADS_APP_ID`
   - **Threads App secret** → `THREADS_APP_SECRET` (только сервер / `.env`, не в клиент)
4. Добавить **Redirect URI** (например `https://www.emigro.online/api/threads/oauth/callback` или `https://localhost:3000/api/threads/oauth/callback` для теста) → `THREADS_REDIRECT_URI`
5. Permissions (минимум): `threads_basic`, `threads_content_publish`, `threads_manage_replies`, `threads_read_replies`, `threads_manage_insights`
6. Добавить **тестового пользователя** = Instagram/Threads **бренда Emigro** (пока app в Development) или пройти App Review для Live.
   Логинься в Authorization Window **как `@emigro2eu`** (инкогнито, не личный профиль). Проверка: `npm run threads:whoami`.

## 2. Короткий токен (~1 час)

### Вариант A — Authorization Window (рекомендуется)

```bash
npm run threads:exchange-token -- --auth-url
```

Откройте URL → логин Threads → allow. В redirect придёт `?code=...`.

Затем (в течение часа):

```bash
npm run threads:exchange-token -- --code=AQBx...
```

Скрипт сам сделает: **code → short-lived → long-lived**. С `--write` запишет в `.env` / `parser/.env` (как Barakhlo):

```bash
npm run threads:exchange-token -- --code=AQBx... --write
npm run threads:whoami
```

Вручную short-lived:

```http
POST https://graph.threads.net/oauth/access_token
client_id=<THREADS_APP_ID>
client_secret=<THREADS_APP_SECRET>
grant_type=authorization_code
redirect_uri=<тот же, что в auth URL>
code=<CODE>
```

Ответ: `{ "access_token": "<SHORT>", "user_id": "..." }` — short живёт **~1 час**.

### Вариант B — Graph API Explorer / Access Token Tool

В App Dashboard для Threads сгенерировать User Token с нужными scopes → это short-lived. Дальше обмен как ниже.

## 3. Обмен short → long (~60 дней)

```bash
npm run threads:exchange-token -- --short=<SHORT_LIVED_TOKEN>
```

Эквивалент:

```http
GET https://graph.threads.net/access_token
  ?grant_type=th_exchange_token
  &client_secret=<THREADS_APP_SECRET>
  &access_token=<SHORT_LIVED_TOKEN>
```

Ответ: `{ "access_token": "<LONG>", "token_type": "bearer", "expires_in": 5184000 }` (~60 дней).

В `.env` / VPS:

```bash
THREADS_APP_ID=
THREADS_APP_SECRET=
THREADS_USER_ID=          # из ответа /me или user_id при обмене
THREADS_ACCESS_TOKEN=     # LONG-lived
THREADS_REDIRECT_URI=
THREADS_AUTO_PUBLISH=0    # оставить 0 — ничего не постить
```

Проверка user id:

```bash
# после установки THREADS_ACCESS_TOKEN
npx tsx -e 'import { fetchThreadsMe } from "./lib/threads"; fetchThreadsMe().then(console.log)'
```

## 4. Refresh long-lived

Пока токен **не протух** и ему **≥ 24 часа**:

```bash
npm run threads:refresh-token -- --write
```

На VPS это делает `emigro-threads-refresh.timer` (понедельник 05:15 UTC). После refresh скопируй тот же `THREADS_ACCESS_TOKEN` в **Vercel Production** — иначе молнии с webhook продолжат старый токен.

```http
GET https://graph.threads.net/refresh_access_token
  ?grant_type=th_refresh_token
  &access_token=<LONG>
```

Обновлённый токен снова ~60 дней. Протухший short **нельзя** обменять — нужен новый OAuth code.

## 5. Формат цепочки (как договорились)

1. **Root:** headline (цифра / миф / было→стало). Страна — в `topic_tag`, не флагом в теле.  
2. **Replies:** короткие слайды (≤500 символов каждый)  
3. **Последний:** CTA без `t.me/+` — визард `/ru/wizard` или `/ru/{country}/wizard`, Assist `/ru/assist`, быт Порту `telegram.me/emigro_chat_bot?start=porto_chat_*`. UTM: `utm_source=threads`, `utm_campaign=emigro_threads`.

### Модерация ответов (анти-спам)

По умолчанию на каждый пост цепочки:

- `enable_reply_approvals=true` — чужие ответы **скрыты**, пока ты не апрувнешь в приложении Threads (или через API `pending_replies` / `manage_pending_reply`)
- `reply_control=everyone` — кто *может* попытаться ответить (апрув всё равно нужен)

Env:

```bash
THREADS_ENABLE_REPLY_APPROVALS=1   # default; поставь 0 только если хочешь открытые комменты
THREADS_REPLY_CONTROL=everyone     # или accounts_you_follow | mentioned_only | followers_only
```

Scopes для управления очередью ответов: `threads_manage_replies`, `threads_read_replies`.

Preview без постинга:

```bash
npm run threads:preview -- --from-repost
npm run threads:preview -- --country=Португалия --flag=🇵🇹 \
  --headline="…" --slide="…" --slide="…" --page=https://www.emigro.online/ru/...
```

## 6. Три потока в Threads (не один weekday-mix)

| Поток | Что | Когда | Кто триггерит |
|-------|-----|-------|----------------|
| **1. Гайды (основной)** | SEO-гайды как в личном акке, CTA = бесплатный визард коридора | каждый Lisbon-день, утро как Barakhlo (`Asia/Dubai`) | `emigro-threads-daily.timer` → `threads:daily` |
| **2. Сателлиты PT** | заметки Португалии / Porto chat — сверху, не вместо гайда | каждые **2** дня, ~14:30 Dubai | `emigro-threads-satellites.timer` → `threads:satellites` |
| **3. Новости** | релевантные RU immigration — только после ✅ в личке | когда есть молния | `news:lightning` DM → webhook ✅ Threads |

Визард/Assist-банки остаются для ручного `--kind=`; крон их больше не чередует вместо гайдов. Воскресный gated-news слот убран — новости не съедают день гайда.

State:

| Поток | Файл |
|-------|------|
| Гайды | `parser/out/emigro-threads-posted.json` |
| Сателлиты | `parser/out/emigro-threads-satellites.json` |
| Новости | маркеры в Supabase `threads_text` (`__lightning_*`) |

```bash
npm run threads:assert-banks
npm run threads:daily -- --dry-run          # поток 1
npm run threads:satellites -- --dry-run     # поток 2
npm run threads:daily -- --force-publish    # только @emigro2eu + THREADS_AUTO_PUBLISH=1
npm run threads:satellites -- --force-publish
```

Крон:

| Unit | Когда |
|------|--------|
| `emigro-threads-daily.timer` | утро как Barakhlo (`Asia/Dubai` peaks +15–25 мин), `Persistent=true` — **гайды** |
| `emigro-threads-satellites.timer` | ~14:30 Asia/Dubai + jitter, gap 2 дня в state — **сателлиты PT** |
| `emigro-threads-replies.timer` | каждые ~20 мин + `RandomizedDelaySec=8min` (черновик → DM, не пост) |
| `emigro-threads-refresh.timer` | пн 05:15 UTC |
| lightning (Vercel + `emigro-news-lightning.timer`) | DM ✅ — **новости** |
```bash
bash deploy/threads-daily/deploy.sh
bash deploy/threads-replies/deploy.sh
```

На VPS: `THREADS_AUTO_PUBLISH=1` **после** `threads:whoami` = `@emigro2eu`.

Молнии по-прежнему через ✅ Threads в DM (Vercel). Дневной крон их не трогает.

## 7. Комменты: черновик → Telegram ✅ → пост

Как у Barakhlo poll, но публикация **только после ✅ в том же owner DM**, что и #молния (news-bot webhook). Не из `@pv.inform`.

1. Крон `emigro-threads-replies.timer` читает conversation + `pending_replies` на последних 12 корневых постах `@emigro2eu`.
2. Пропуск: наш username, уже ответили, пусто/эмодзи, спам/оскорбления, stale >24ч.
3. Gemini Flash пишет короткий RU ответ (сосед, не юрист). Виза/страна → `/ru/wizard`. Запутанный кейс → Assist. Быт Порту → `portoChatDeepLink("thr")`, никогда `t.me/+`.
4. DM владельцу: пост + коммент + черновик + кнопки.
5. ✅ → Graph `reply_to_id` (`threads_manage_replies`), whoami обязан быть `@emigro2eu`, `THREADS_AUTO_PUBLISH=1`.
6. State: `parser/out/emigro-threads-replies.json` (gitignore) — не спрашиваем и не постим дважды.

```bash
npm run threads:replies -- --dry-run     # default: fetch + draft, no DM, no post
npm run threads:replies -- --ask-owner   # timer: DM only
```

`--force-publish` на CLI **запрещён**. Живой ответ только callback `tr:ok:`.

Callback (тот же news-bot, `TELEGRAM_PRIVATE_CHAT_ID`):

| data | Действие |
|------|----------|
| `tr:ok:{commentId}` | опубликовать черновик из DM |
| `tr:no:{commentId}` | пропуск, больше не спрашивать |

Черновик берётся из текста DM (`наш ответ:` … `—` + `<code>tr:{id}</code>`). Vercel не читает VPS state-файл.

## 8. Когда включим автопост

Двойной предохранитель:

1. `THREADS_AUTO_PUBLISH=1` в env  
2. CLI / код с `forcePublish: true` / `--force-publish` (крон передаёт это сам)

Без обоих — только dry-run.

## Файлы

| Path | Role |
|------|------|
| `lib/threads/config.ts` | env, auth URL, publish gates |
| `lib/threads/tokens.ts` | code→short, short→long, refresh, persist `.env` |
| `lib/threads/compose.ts` | country header + slides + CTA |
| `lib/threads/client.ts` | container → publish, reply chain |
| `lib/threads/banks/` | prewritten p1/p2 (no URLs) |
| `lib/threads/banks.ts` | Assist / wizard / Porto-chat URL + 500-char check |
| `lib/threads/calendar.ts` | main = guide every day; satellite gap |
| `lib/threads/inventory.ts` | live guides + PT satellites |
| `lib/threads/daily-pipeline.ts` | stream 1 — guides |
| `lib/threads/satellite-pipeline.ts` | stream 2 — PT satellites |
| `lib/threads/replies.ts` | comment poll, LLM draft, Telegram ✅ |
| `scripts/threads-*.ts` | exchange / refresh / whoami / daily / replies / preview |
| `deploy/threads-replies/` | VPS poll timer (DM only) |
| `deploy/threads-daily/` | VPS systemd (Barakhlo-style) |

## Важно

- App secret и long-lived token — только сервер / VPS `.env`, не в git.
- Rate limit Meta: ~250 posts / 24h на user — между replies пауза (~1.5s в клиенте).
- Development mode: постит только тестовые / роли users, пока не Live.
