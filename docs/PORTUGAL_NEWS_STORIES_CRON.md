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

Spaced posts to `@Emigro_news` so nothing dumps in a batch at 10:00.

- Timer: **11 / 13 / 15 / 17 / 19 UTC** (`emigro-news-lightning.timer`)
- **1 post per tick**, FIFO from recent story tiles
- Gate: visa / ВНЖ / гражданство / work permit / asylum (not housing/tax/crime)
- Cap: **≤5 / day** channel-wide
- Needs `EMIGRO_NEWS_BOT_TOKEN` on VPS

Format:

```
⚡ #молния · 🇵🇹 Португалия
Заголовок
Excerpt
Читать на Emigro
```

Non-immigration stories are marked `__skip_lightning__` so the queue does not re-check them forever.

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
