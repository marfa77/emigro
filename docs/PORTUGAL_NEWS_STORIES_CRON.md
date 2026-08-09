# Country news stories + Telegram #молния (separate crons)

## 1) Site tiles — `news:stories`

Daily VPS job → short RU story tiles (`format=story`) **only** for corridors with a publisher RSS (no Google News). **Does not post to Telegram.**

Pipeline: Gemini Flash (dry facts) → OpenRouter voice (`EMIGRO_STORY_VOICE_MODEL`, default `anthropic/claude-haiku-4.5`). Needs `OPENROUTER_API_KEY` in `/opt/emigro/.env` (falls back to Flash voice if missing).

| Topic | Source |
|-------|--------|
| portugal | Observador |
| netherlands | DutchNews |
| spain | The Local ES |
| germany | The Local DE |
| france | The Local FR |
| italy | The Local IT |
| sweden | The Local SE |
| denmark | The Local DK |
| norway | The Local NO |
| austria | The Local AT |
| poland | Notes from Poland |
| czechia | Radio Prague International |
| cyprus | Cyprus Mail |
| hungary | Hungary Today |
| croatia | Total Croatia News |
| estonia | ERR News |

- Timer: **10:00 UTC** (`emigro-portugal-news-stories.timer`)
- Per country: ≤3/day, ≤15/week

## 2) Channel «молния» — `news:lightning` (separate)

Spaced **approval requests** to your Telegram DM (not auto-dump into the channel).

- Timer: **11 / 13 / 15 / 17 / 19 UTC** (`emigro-news-lightning.timer`)
- **1 candidate per tick** after keyword + Gemini Flash gates
- DM: draft + buttons **✅ В канал** / **❌ Пропуск** (fallback `/молния_да` `/молния_нет`)
- Cap: **≤5 published / day** to `@Emigro_news` (pending approvals also reserve a slot)
- Needs `EMIGRO_NEWS_BOT_TOKEN`, `TELEGRAM_PRIVATE_CHAT_ID`, `GOOGLE_API_KEY`
- News-bot webhook: `npx tsx scripts/set-news-bot-webhook.ts` → `/api/telegram/news-webhook`

Pending marker: `threads_text=__lightning_pending__` + draft in `telegram_html`.

## 3) Soft promo (weekly) — `news:soft-promo`

Once per ISO week → soft editorial draft → **owner DM ✅/❌** → `@Emigro_news` (no auto-publish).

| Week mod 4 | Product |
|------------|---------|
| 0 | Route Check €129 |
| 1 | джоб-бот Role Radar |
| 2 | Barakhlo |
| 3 | Emigro Assist |

- Timer: **Mon–Fri 09:00 UTC** + up to **8h** random delay (`emigro-news-soft-promo.timer`)
- Script rolls `1/remaining weekdays` so the day is random; skips if already queued this week
- Gemini Flash picks a fresh format each time (сцена / совет / вопрос / чеклист…)
- Draft in `guide_telegram_drafts` (`soft-promo-{week}-{product}`), same `gd:ok:` / `gd:no:` as guides
- State: `deploy/news-soft-promo/.last-iso-week` (written when DM is sent)

```bash
npm run news:soft-promo -- --dry-run --force
bash deploy/news-soft-promo/deploy.sh
```

## 4) Guide promo (daily) — `news:guide-promo`

SEO pillars only (`content/guides/ru/*`) → fact-check → owner DM ✅/❌ → `@Emigro_news` (no auto-publish).
Post copy = channel house style (title-thesis + dense facts), not creative first-person scenes.
Writer: OpenRouter `EMIGRO_GUIDE_PROMO_MODEL` (default `anthropic/claude-sonnet-4.5`), not Gemini Flash.
No repeats: queue skips any slug already `published` / `skipped*` in `guide_telegram_drafts`. Seed channel archive with `npx tsx scripts/seed-guide-telegram-from-channel.ts`.

- Table: `guide_telegram_drafts` (Approach A; callbacks `gd:ok:<uuid>` / `gd:no:<uuid>`)
- Critical fact-check → DM alert + try next guide (≤5 tries/run)
- Caps: ≤1 **published**/day from this table; ≤1 **pending** at a time (shared with soft promo)
- Timer: **12:30 UTC** + up to **2h** random (`emigro-news-guide-promo.timer`)
- Same news-bot webhook as lightning: `/api/telegram/news-webhook`

**Channel rule:** lightning, soft promo, and guide posts all require owner approve before `@Emigro_news`.

```bash
npm run news:guide-promo -- --dry-run
npm run news:guide-promo
bash deploy/news-guide-promo/deploy.sh
```

Spec: `docs/superpowers/specs/2026-08-08-guide-telegram-approval-design.md`

## Commands

```bash
# Site only
npm run news:stories -- --dry-run
npm run news:stories

# Telegram queue (1 post)
npm run news:lightning -- --dry-run
npm run news:lightning

# Guide soft post → DM approve
npm run news:guide-promo -- --dry-run
npm run news:guide-promo
```

## systemd deploy

```bash
bash deploy/portugal-news-stories/deploy.sh
bash deploy/news-lightning/deploy.sh
bash deploy/news-guide-promo/deploy.sh
```

`CRON_SECRET` must be set in `/opt/emigro/.env` for post-publish revalidate (stories).

Still digest-only (no story RSS): Finland, Greece, Malta, Bulgaria, Slovenia.
