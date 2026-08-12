# Threads API (Meta) — Emigro setup

Автопубликация **выключена** по умолчанию (`THREADS_AUTO_PUBLISH` ≠ `1`).  
Сейчас: обмен токенов + dry-run цепочки постов. Live — только когда явно разрешите.

Официально: [Get access tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/), [Long-lived tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens/), [Posts](https://developers.facebook.com/docs/threads/posts/).

## 1. Meta App

1. [developers.facebook.com](https://developers.facebook.com/) → создать / открыть приложение.
2. Use case: **Access the Threads API**.
3. App Dashboard → **App settings → Basic**:
   - **Threads App ID** → `THREADS_APP_ID`
   - **Threads App secret** → `THREADS_APP_SECRET` (только сервер / `.env`, не в клиент)
4. Добавить **Redirect URI** (например `https://www.emigro.online/api/threads/oauth/callback` или `https://localhost:3000/api/threads/oauth/callback` для теста) → `THREADS_REDIRECT_URI`
5. Permissions (минимум): `threads_basic`, `threads_content_publish`, `threads_manage_replies`
6. Добавить тестового пользователя Threads (пока app в Development) или пройти App Review для Live.

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

Скрипт сам сделает: **code → short-lived → long-lived** и напечатает long-lived.

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
npm run threads:refresh-token
```

```http
GET https://graph.threads.net/refresh_access_token
  ?grant_type=th_refresh_token
  &access_token=<LONG>
```

Обновлённый токен снова ~60 дней. Протухший short **нельзя** обменять — нужен новый OAuth code.

## 5. Формат цепочки (как договорились)

1. **Root:** `🇵🇹 Португалия` + headline (цифра / миф / было→стало)  
2. **Replies:** короткие слайды (≤500 символов каждый)  
3. **Последний:** «Если откликнулось — поддержите подпиской или лайком» + ссылка на страницу Emigro и/или Telegram  

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

## 6. Когда включим автопост

Двойной предохранитель:

1. `THREADS_AUTO_PUBLISH=1` в env  
2. CLI / код с `forcePublish: true` / `--force-publish`

Без обоих — только dry-run. Крон и webhook **пока не подключены**.

## Файлы

| Path | Role |
|------|------|
| `lib/threads/config.ts` | env, auth URL, publish gates |
| `lib/threads/tokens.ts` | code→short, short→long, refresh |
| `lib/threads/compose.ts` | country header + slides + CTA |
| `lib/threads/client.ts` | container → publish, reply chain |
| `scripts/threads-*.ts` | exchange / refresh / preview |

## Важно

- App secret и long-lived token — только сервер / VPS `.env`, не в git.
- Rate limit Meta: ~250 posts / 24h на user — между replies пауза (~1.5s в клиенте).
- Development mode: постит только тестовые / роли users, пока не Live.
