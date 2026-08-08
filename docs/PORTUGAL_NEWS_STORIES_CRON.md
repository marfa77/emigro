# Country news stories cron (Observador + The Local)

Daily VPS job that publishes short RU story tiles (`format=story`) for:

| Topic | Source |
|-------|--------|
| portugal | Observador RSS |
| netherlands | DutchNews RSS |
| spain | The Local ES |
| germany | The Local DE |
| france | The Local FR |

## Cadence

- Timer: **10:00 UTC** daily (`emigro-portugal-news-stories.timer` — name kept for continuity)
- Per country: ≤3/day, ≤15/week
- Cheap path: RSS → score → lead → one Flash batch

Does **not** touch weekly digests / Prep2Go.

## Commands

```bash
npm run news:stories -- --dry-run
npm run news:stories
npm run news:stories -- --topic=netherlands,spain --max=2
npm run news:portugal-stories   # portugal only alias
```

## systemd

```bash
bash deploy/portugal-news-stories/deploy.sh
# or full: cd parser && ./deploy.sh
```

Manual: `systemctl start emigro-portugal-news-stories.service`  
Logs: `/opt/emigro/deploy/portugal-news-stories/logs/`

Set `CRON_SECRET` in `/opt/emigro/.env` so post-publish revalidate works.
