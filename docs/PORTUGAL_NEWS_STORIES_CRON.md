# Country news stories + Telegram #молния (separate crons)

## 1) Site tiles — `news:stories`

Daily VPS job → short RU story tiles (`format=story`) **only** for corridors with a publisher RSS (no Google News). **Does not post to Telegram.**

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

Once per ISO week → soft editorial post (not banner ad) about one of:

| Week mod 4 | Product |
|------------|---------|
| 0 | Route Check €129 |
| 1 | джоб-бот Role Radar |
| 2 | Barakhlo |
| 3 | Emigro Assist |

- Timer: **Mon–Fri 09:00 UTC** + up to **8h** random delay (`emigro-news-soft-promo.timer`)
- Script rolls `1/remaining weekdays` so the day is random; skips if already posted this week
- Gemini Flash picks a fresh format each time (сцена / совет / вопрос / чеклист…)
- State: `deploy/news-soft-promo/.last-iso-week`

```bash
npm run news:soft-promo -- --dry-run --force
bash deploy/news-soft-promo/deploy.sh
```

## Commands

```bash
# Site only
npm run news:stories -- --dry-run
npm run news:stories

# Telegram queue (1 post)
npm run news:lightning -- --dry-run
npm run news:lightning
```

## systemd deploy

```bash
bash deploy/portugal-news-stories/deploy.sh
bash deploy/news-lightning/deploy.sh
```

`CRON_SECRET` must be set in `/opt/emigro/.env` for post-publish revalidate (stories).

Still digest-only (no story RSS): Finland, Greece, Malta, Bulgaria, Slovenia.
