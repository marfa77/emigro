# @milan_4at + @como_4at + @milan_ua_chat soft expert

Скан `@milan_4at`, `@como_4at` и `@milan_ua_chat` → вопросы → writer + fact-check → ЛС draft-боту. В группы бот **не** пишет.

## Прод

| Что | Где |
|-----|-----|
| Скан каждые **12 ч** (07:00 + 19:00 UTC) | VPS `emigro-milan4at-scan.timer` |
| `/start` + пересылка вопросов | Vercel webhook `/api/telegram/milan4at-webhook` |

Деплой таймера: `bash deploy/milan4at-scan/deploy.sh`  
Webhook: `npm run milan4at:webhook` (после того как на Vercel есть `MILAN4AT_BOT_TOKEN`).

## Поток

1. Telethon (`parser/tg.session` / `TG_SESSION_STRING`) — окно ~13 ч на кроне, оба чата.
2. Фильтр: вопрос / Italy–Milano–Como, не барахолка / «ищу работу».
3. **Writer** — Claude Sonnet 4.5 (чат-тон + щелочка).
4. **Fact-check** — Gemini 2.5 Flash (pass / revise / fail).
5. Abuse (проституция/наркотики, в т.ч. завуалировано) — только **high confidence** → ЛС-алерт со ссылкой и `@user` для жалобы.
6. ЛС при pass/revise — **три** сообщения: ссылка → `factcheck: ok` → ответ.  
   Fail → `SKIP factcheck · …`.
7. В конце **всегда** статус в ЛС (даже если кандидатов 0): msgs · abuse · candidates · drafted.

## Команды

```bash
npm run milan4at:scan
npm run milan4at:scan -- --hours=13 --dry
npm run milan4at:poll          # локально; на проде — webhook
npm run milan4at:webhook
bash deploy/milan4at-scan/deploy.sh
```

## Env (не коммитить)

| Key | Where |
|-----|--------|
| `MILAN4AT_BOT_TOKEN` | Vercel + `/opt/emigro/.env` |
| `MILAN4AT_NOTIFY_CHAT_ID` | VPS `.env` (кто сделал `/start`, напр. `7393579917`) |
| `MILAN4AT_WEBHOOK_SECRET` | optional, Vercel |
| `OPENROUTER_API_KEY` | Vercel + VPS |
| `MILAN4AT_REPLY_MODEL` | optional, default `anthropic/claude-sonnet-4.5` |
| `MILAN4AT_FACTCHECK_MODEL` | optional, default `google/gemini-2.5-flash` |
| `TG_API_*` / session | `parser/.env` на VPS |

## Тон

- коротко, один человек («у меня» / «насколько помню»);
- без питча пустого чата Милана / Emigro;
- без выдуманных € и абсолютов.

## Код

- `parser/fetch_milan_4at.py`
- `scripts/milan-4at-scan.ts`
- `lib/milan-4at/*`
- `deploy/milan4at-scan/` + `deploy/systemd/emigro-milan4at-scan.*`
- `app/api/telegram/milan4at-webhook/route.ts`
