# @chatporto soft expert (owner drafts)

Скан `@chatporto` → самый интересный вопрос за сутки → soft-expert ответ + ссылка на гайд → **ЛС вам**. В группу бот **не** пишет — публикуете от себя.

Аналог Italy `@milan_4at`, но короче: мега-экспертиза с телефона (автобус / на бегу), 1–2 фразы, щелочка «у меня / поле плывёт», без абсолютов и без «поищи в чате». Чтобы лайкали и заходили в профиль. **1×/сутки**.

## Прод

| Что | Где |
|-----|-----|
| Скан **1×/сутки** 10:00 UTC | VPS `emigro-chatporto-scan.timer` |
| Лок «уже слали сегодня» | `scripts/output/chatporto-day-lock.json` |

Деплой: `bash deploy/chatporto-scan/deploy.sh`

## Поток

1. Telethon читает `@chatporto` (окно ~26 ч).
2. Фильтр: вопрос / Porto–Norte быт; не барахолка / вакансии.
3. Берёт **один** лучший по score (топики NIF, аренда, районы, SNS, AIMA…).
4. Writer (Claude) → fact-check (Gemini) → 1–2 фразы ≤~180 символов, автобусный тон.
5. ЛС **четырьмя** сообщениями (удобно копировать):
   1. ссылка на вопрос в `@chatporto`
   2. `factcheck: ok …`
   3. ответ в чат (без Emigro в тексте)
   4. ссылка на гайд `portugal.emigro.online`

## Команды

```bash
npm run chatporto:scan -- --dry
npm run chatporto:scan
npm run chatporto:scan -- --force   # второй черновик в тот же день
bash deploy/chatporto-scan/deploy.sh
```

## Env

| Key | Where |
|-----|--------|
| `CHATPORTO_NOTIFY_CHAT_ID` | VPS `.env` → `@Pv_porto` (`8388568247`). Иначе `TELEGRAM_PRIVATE_CHAT_ID` |
| `EMIGRO_NEWS_BOT_TOKEN` | VPS — ЛС через `@emigro_chat_bot`. С аккаунта **@Pv_porto** один раз нажать **/start** у бота, иначе `chat not found` |
| `CHATPORTO_CHANNEL` | optional, default `chatporto` |
| `OPENROUTER_API_KEY` | VPS |
| `TG_API_*` / session | `parser/.env` |

Сессия Telethon должна быть участником `@chatporto`.
