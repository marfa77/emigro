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
| norway | The Local NO |
| austria | The Local AT |
| poland | Notes from Poland |
| czechia | Radio Prague International |
| cyprus | Cyprus Mail |
| hungary | Hungary Today |
| croatia | Total Croatia News |
| estonia | ERR News |

## Cadence

- Timer: **10:00 UTC** (`emigro-portugal-news-stories.timer`)
- Per country: ≤3/day, ≤15/week
- Cheap: RSS → **relocator filter** → lead → Flash batch

Does **not** touch weekly digests / Prep2Go. Still digest-only (no story RSS wired): Finland, Greece, Malta, Bulgaria, Slovenia.

## Telegram «молния» (@Emigro_news)

После публикации на сайте **лучшие** story (строго визы / ВНЖ / гражданство / work permit / asylum — не жильё и не налоги) уходят в канал:

- Формат: `⚡ #молния · 🇵🇹 Португалия` + заголовок + excerpt + ссылка на Emigro
- Gate: immigration keywords + score ≥ 14 (как у плиток; отбор — по смыслу «виза/ВНЖ»)
- Лимит: **≤5 постов/день** на весь канал (не на страну)
- Нужен `EMIGRO_NEWS_BOT_TOKEN` (или `TELEGRAM_BOT_TOKEN`) на VPS

Дайджесты Prep2Go по-прежнему публикуются отдельно своим пайплайном.

## Editorial voice

Story copy uses the same Emigro voice as community notes (`lib/community-notes/editorial-voice.ts` via `lib/news/story-editorial-voice.ts`): warm «опытный релокант за кофе», not telegraphic chat/lepta attribution style.

## Commands

```bash
npm run news:stories -- --dry-run
npm run news:stories
npm run news:stories -- --topic=norway,austria,poland --max=2
```

## systemd

```bash
bash deploy/portugal-news-stories/deploy.sh
```

`CRON_SECRET` must be set in `/opt/emigro/.env` for post-publish revalidate.
