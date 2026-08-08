# Portugal news stories cron (Observador)

Daily VPS job that publishes short RU story tiles to `emigro_news_digests` (`format=story`) from **Observador** RSS only.

## What it does

1. Fetch `https://observador.pt/feed/`
2. Soft relevance filter + score (noise OK)
3. Cap: ≤3/day, ≤15/week
4. Fetch lead paragraph for candidates that passed score
5. One Gemini Flash batch → RU summary
6. Upsert published story + revalidate `/ru/news`

Does **not** touch weekly digests or Prep2Go.

## Commands

```bash
npm run news:portugal-stories -- --dry-run
npm run news:portugal-stories
npm run news:portugal-stories -- --max=2
```

## systemd (VPS `/opt/emigro`)

```bash
sudo cp deploy/systemd/emigro-portugal-news-stories.service /etc/systemd/system/
sudo cp deploy/systemd/emigro-portugal-news-stories.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now emigro-portugal-news-stories.timer
sudo systemctl list-timers | grep portugal-news-stories
```

Timer: **10:00 UTC** daily (after Prep2Go at 09:00).

## DB

Apply migration `supabase/migrations/20260808160000_emigro_news_digest_format.sql` (`format` column).

## Later

Add The Portugal News / portugal.gov.pt as extra feeds once Observador cadence looks good.
