# Volatile guide fact-check (lazy server)

Automated **lazy** fact-check for guides with `review_tier: volatile` — thresholds, rates, deadlines, sanctions, EES dates. Does **not** rewrite content; flags problems and sends a digest to your **private Telegram DM**.

## What it checks (v1)

| Check | Severity | Description |
|-------|----------|-------------|
| Stale `date_modified` | warning / critical | Volatile guide not updated in **>90 days** (critical if >180) |
| FACTCHECK backlog patterns | critical | Known bad claims from [FACTCHECK_BACKLOG.md](./FACTCHECK_BACKLOG.md): Greece 7% nomad, France B1 citizenship, EES «апрель = старт», Tinkoff «без санкций» |
| Internal contradictions | warning | Same anchor (D7, D8, AIMA, воссоединение…) with conflicting numbers in one file |
| quick_answer vs body | warning | Mismatch on month ranges |
| community_signals | info | Recent Supabase signals for mapped country (PT/ES/FR…) — optional cross-check |

Code: `lib/guides/volatile-factcheck.ts`, notify: `lib/guides/volatile-factcheck-notify.ts`.

## CLI

```bash
# Print report only (default)
npm run guides:volatile-factcheck

# Dry-run — no Telegram
npm run guides:volatile-factcheck -- --dry-run

# Send Telegram DM when issues found
npm run guides:volatile-factcheck -- --notify

# One guide, JSON output
npm run guides:volatile-factcheck -- --slug=ees-shengenskaya-sistema-2026 --json

# Skip Supabase community_signals
npm run guides:volatile-factcheck -- --skip-community
```

Review tiers: `npm run guides:review-tiers` · backlog: `docs/FACTCHECK_BACKLOG.md`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TELEGRAM_PRIVATE_CHAT_ID` | Yes (for `--notify`) | Owner DM id — same as news digest / YouTube shorts / lead alerts |
| `TELEGRAM_ADMIN_CHAT_ID` | Fallback | First id from comma-separated admin list if private id unset |
| `TELEGRAM_BOT_TOKEN` or `EMIGRO_NEWS_BOT_TOKEN` | Yes (for `--notify`) | Bot token that may message you (start the bot in DM first) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Enables `community_signals` cross-check |

### How to get your Telegram chat id

1. Open [@userinfobot](https://t.me/userinfobot) or message your bot and read webhook logs / `getUpdates`.
2. Copy the numeric **id** (e.g. `193093189`).
3. Set on VPS `/opt/emigro/.env`:

```bash
TELEGRAM_PRIVATE_CHAT_ID=193093189   # already set for news / admin DMs
TELEGRAM_BOT_TOKEN=...               # or EMIGRO_NEWS_BOT_TOKEN
```

4. Send `/start` to the bot from that account once.

No extra env vars — reuses `TELEGRAM_PRIVATE_CHAT_ID` (falls back to first `TELEGRAM_ADMIN_CHAT_ID`).

## Example Telegram message

```
⚠️ Volatile guides — fact-check

Дата: 2026-07-14
Проверено volatile: 46
Найдено: 3

1. [критично] EES в Шенгене 2026: что изменилось для россиян и релокантов
   EES: апрель 2026 описан как «старт», а не завершение rollout
   «…апрель 2026 — старт системы EES…»
   → Уточнить: фазовый старт 12.10.2025, полный rollout 10.04.2026
   https://www.emigro.online/ru/guides/ees-shengenskaya-sistema-2026

2. [внимание] Воссоединение семьи в Европе 2026
   date_modified устарел: 2026-03-01 (135 дн., порог 90)
   …
```

Max **5 issues** per message; full list via CLI.

## VPS cron (systemd)

Weekly **Monday 08:00 UTC** — after Portugal/Prep2Go daily jobs.

```bash
sudo cp deploy/systemd/emigro-volatile-guides-factcheck.{service,timer} /etc/systemd/system/
sudo chmod +x deploy/volatile-guides-factcheck/run_scheduled.sh
sudo systemctl daemon-reload
sudo systemctl enable --now emigro-volatile-guides-factcheck.timer
systemctl list-timers emigro-volatile-guides-factcheck.timer
```

Logs: `/opt/emigro/deploy/volatile-guides-factcheck/logs/`.

Manual on VPS:

```bash
cd /opt/emigro && npm run guides:volatile-factcheck -- --notify
```

## Workflow

1. Timer runs `guides:volatile-factcheck --notify`.
2. If issues → DM to `TELEGRAM_PRIVATE_CHAT_ID` (owner alerts).
3. Editor fixes guide → updates `date_modified` → append row to `docs/FACTCHECK_BACKLOG.md` if pattern was new.
4. Portugal/Spain pillar guides: still use `npm run portugal:guide-factcheck` / `spain:guide-factcheck` for TG citation mining.
