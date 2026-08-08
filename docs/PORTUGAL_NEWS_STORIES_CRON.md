# Country news stories cron (direct RSS only)

Daily VPS job → short RU story tiles (`format=story`) **only** for corridors with a publisher RSS (no Google News).

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

## Cadence

- Timer: **10:00 UTC** (`emigro-portugal-news-stories.timer`)
- Per country: ≤3/day, ≤15/week
- Cheap: RSS → **relocator filter** → lead → Flash batch

Does **not** touch weekly digests / Prep2Go. Other corridors stay digest-only until they get a direct feed.

## Commands

```bash
npm run news:stories -- --dry-run
npm run news:stories
npm run news:stories -- --topic=italy,sweden --max=2
```

## systemd

```bash
bash deploy/portugal-news-stories/deploy.sh
```

`CRON_SECRET` must be set in `/opt/emigro/.env` for post-publish revalidate.
