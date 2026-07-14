# Volatile guide fact-check (lazy server)

Automated **lazy** fact-check for guides with `review_tier: volatile` — thresholds, rates, deadlines, sanctions, EES dates. Does **not** rewrite content; flags problems and sends a digest to your **private Telegram DM**.

## What it checks (v1.1 — tuned 2026-07)

| Check | Severity | Description |
|-------|----------|-------------|
| Stale `date_modified` | warning / critical | Volatile guide not updated in **>90 days** (critical if >180) |
| FACTCHECK backlog patterns | critical | Known bad claims from [FACTCHECK_BACKLOG.md](./FACTCHECK_BACKLOG.md): Greece 7% nomad, France B1 citizenship, EES «апрель = старт», Tinkoff «без санкций» |
| Internal contradictions | warning | Same anchor (D7, D8, AIMA, воссоединение…) with conflicting numbers in **body + quick_answer** (not seo_title/seo_description) |
| quick_answer vs body | warning | Mismatch on month ranges **only when the same anchor** appears in both |
| community_signals | info | Recent Supabase signals — **off by default**; deduped by signal text, generic chat questions filtered |

### Noise reduction (audit c132f7b1)

- **Scan scope:** `body` + `quick_answer` only — YAML frontmatter (`seo_description` with €3 680/€920) no longer triggers false D7/D8 contradictions.
- **D7/D8 € thresholds:** Portugal-related slugs only (`vnj-portugaliya`, `d7-vs-*`, `portugaliya-vs-*`, `pervye-30-dnej-v-portugalii`, …) — not Montenegro/UAE/Italy guides.
- **Comparison guides** (`primary_intent: comparison`): skip €-contradiction checks (multi-country tables are expected).
- **Euro logic:** group by `/мес`, `/год`, insurance; ratio threshold **3.0**; proximity on adjacent lines.
- **community_signals:** one issue per unique signal text (not per guide); filters low-value questions (e.g. portaldasfinancas address change). Default **`--skip-community`**; pass **`--community`** to enable.
- **Telegram notify:** uses `sendOwnerTelegramDm`; skips DM when **>20 issues** and no critical/high-priority items (community_signals never ping).

Code: `lib/guides/volatile-factcheck.ts`, notify: `lib/guides/volatile-factcheck-notify.ts`.

## CLI

```bash
# Print report only (default; community_signals off)
npm run guides:volatile-factcheck

# Dry-run — no Telegram
npm run guides:volatile-factcheck -- --dry-run

# Send Telegram DM when actionable issues found
npm run guides:volatile-factcheck -- --notify

# One guide, JSON output
npm run guides:volatile-factcheck -- --slug=ees-shengenskaya-sistema-2026 --json

# Enable Supabase community_signals cross-check
npm run guides:volatile-factcheck -- --community
```

Review tiers: `npm run guides:review-tiers` · backlog: `docs/FACTCHECK_BACKLOG.md`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TELEGRAM_PRIVATE_CHAT_ID` | Yes (for `--notify`) | Owner DM id — same as YouTube shorts / leads / social stats |
| `EMIGRO_NEWS_BOT_TOKEN` | Yes (for `--notify`) | **Emigro news bot** token (`sendOwnerTelegramDm`) — not `TELEGRAM_BOT_TOKEN` |
| `TELEGRAM_BOT_TOKEN` | Legacy fallback | Used only if `EMIGRO_NEWS_BOT_TOKEN` unset; on VPS may point at another project (e.g. Pixaidy) — do **not** rely on it for owner DMs |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Enables `community_signals` cross-check |

Notifications use **`sendOwnerTelegramDm`** (same as YouTube Shorts, leads, daily subscriber stats): token priority is `EMIGRO_NEWS_BOT_TOKEN` → `TELEGRAM_BOT_TOKEN`.

### VPS `/opt/emigro/.env` (required for `--notify`)

```bash
EMIGRO_NEWS_BOT_TOKEN=...          # @Emigro_news bot — owner DMs
TELEGRAM_PRIVATE_CHAT_ID=...       # your numeric Telegram user id
```

Optional: `TELEGRAM_BOT_TOKEN` can stay set for legacy channel publish scripts, but volatile fact-check **must** have `EMIGRO_NEWS_BOT_TOKEN` so DMs come from the Emigro bot, not another token in `TELEGRAM_BOT_TOKEN`.

### How to get your Telegram chat id

1. Open [@userinfobot](https://telegram.me/userinfobot) or message the Emigro news bot and read webhook logs / `getUpdates`.
2. Copy the numeric **id** (e.g. `193093189`).
3. Send `/start` to the Emigro news bot from that account once.

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
