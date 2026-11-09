# Claude — читай это до любой правки Emigro

Полный онбординг: [docs/CLAUDE_ONBOARDING.md](docs/CLAUDE_ONBOARDING.md).

Живые пароли **не в этом файле и не в git**. Три хранилища: локальный `.env.local`, Vercel env проекта `emigro`, VPS `/opt/emigro/.env`. Читать оттуда. В чат, коммит и markdown значения не копировать.

Пока не прочитан онбординг, нельзя: пушить в `main`, трогать VPS, публиковать гайд, постить в Telegram или Threads, менять схему БД.

Нельзя никогда:

- `git reset --hard` по путям фермы Threads и `farm_protect.sh unlock` — ферма на `37.27.0.210` неприкосновенна, кроме чата farm HQ.
- `git push origin main` и `vercel --prod` / `npm run deploy:cli` за один и тот же коммит.
- Деплой, если `npm run deploy:check` не зелёный.
- Секреты в git (`.env`, `.env.local`, `.env.production`, `parser/.env`, токены, service account JSON).
- Сокращать pillar-гайд, выдумывать пороги закона, публиковать без Nota fact-check.
- Письма, посты, ответы в Telegram/Slack/почте без явного «отправляй» от Павла.
- Править Cursor state (`~/.cursor`, transcripts, Application Support).
