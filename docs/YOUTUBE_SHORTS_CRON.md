# YouTube Shorts (@Emigro_news) — cron на production

**Прод:** VPS `37.27.0.210` + **systemd timer** (тот же сервер, что Portugal parser).

## Расписание

| Когда | Unit | Что |
|-------|------|-----|
| **Ежедневно 09:15 UTC** | `emigro-youtube-shorts.timer` | `deploy/youtube-shorts/run_daily.sh` → лайфхак → GCS → **YouTube API** |

Один ролик в день (guard по `last_success_date` в state). Очередь тем — `lib/news/youtube-short/topics.ts` (7 тем). **Опубликованные темы никогда не повторяются автоматически** — только явный `--topic=ID --force`. Флаг `--force` без `--topic` лишь обходит лимит «один ролик в день».

## Что делает прогон

1. Gemini пишет сценарий (крючок + суть + CTA с вопросом, 30–45 сек)
2. OpenAI TTS (`onyx`) → **B-roll** + Ken Burns + **крупные цифры** + субтитры + **BGM −20 dB** + SFX → `short.mp4`
3. Upload в `gs://prep2go/prep2go-podcast/emigro-shorts/tips/{country}/{topic_id}/` (одна папка на тему, перезапись)
4. **Auto-upload на [@Emigro_news](https://www.youtube.com/@Emigro_news)** — видео, превью, субтитры, плейлист
5. `short-youtube-upload-fields.txt` + `generation-report.json` с `youtube.shortsUrl`

## OAuth (один раз)

1. Google Cloud Console → включить **YouTube Data API v3**
2. OAuth client (Desktop или Web) с redirect `http://localhost:8765/callback`
3. Локально в `.env.local`:
   ```env
   EMIGRO_YOUTUBE_CLIENT_ID=...
   EMIGRO_YOUTUBE_CLIENT_SECRET=...
   ```
4. Авторизация под владельцем канала @Emigro_news:
   ```bash
   npm run youtube:oauth-setup
   ```
5. Скопировать `EMIGRO_YOUTUBE_REFRESH_TOKEN` на VPS в `/opt/emigro/.env`

## Переменные на VPS

`/opt/emigro/.env`:

```env
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
EMIGRO_YOUTUBE_SHORTS_ENABLED=1
PEXELS_API_KEY=...                    # optional, recommended for real B-roll

# Фоновая музыка: положите lo-fi MP3 в data/bgm/ (Pixabay / YouTube Audio Library)
# EMIGRO_BGM_ENABLED=1
# EMIGRO_BGM_VOLUME=0.1

EMIGRO_YOUTUBE_CLIENT_ID=...
EMIGRO_YOUTUBE_CLIENT_SECRET=...
EMIGRO_YOUTUBE_REFRESH_TOKEN=...
EMIGRO_YOUTUBE_UPLOAD_ENABLED=1
EMIGRO_YOUTUBE_UPLOAD_PRIVACY=public
# EMIGRO_YOUTUBE_PLAYLIST_ID=PLxxxx
```

GCS key: `/opt/emigro/data/gcs-upload-key.json` (ставится deploy-скриптом из `GOOGLE_SERVICE_ACCOUNT_JSON` локального `.env.local`).

`EMIGRO_YOUTUBE_UPLOAD_PRIVACY`: `public` (по умолчанию), `unlisted` или `private`.

## Деплой

```bash
npm run youtube-shorts:deploy
# или вместе с Portugal parser:
cd parser && ./deploy.sh
```

Первый раз — добавить ключи в `/opt/emigro/.env` на сервере.

## Ручной запуск

```bash
# VPS
systemctl start emigro-youtube-shorts.service
tail -f /opt/emigro/data/youtube-shorts/logs/scheduled-$(date +%Y%m%d).log

# Mac — без YouTube (только GCS)
npm run news:youtube-short:daily -- --no-youtube-upload

# Mac — legacy static slides (без B-roll)
npm run news:youtube-short -- --static --topic=nif-one-day --force

# Mac — конкретная тема (перезапись сегодняшнего output + GCS)
npm run news:youtube-short -- --topic=nif-one-day --force

# Повтор опубликованной темы — только явно:
npm run news:youtube-short -- --topic=lisbon-rent-2026 --force
```

## После прогона

URL ролика в логе и в `generation-report.json`:

```json
"youtube": {
  "videoId": "...",
  "shortsUrl": "https://www.youtube.com/shorts/..."
}
```

Артефакты в GCS (бэкап / ручная перезаливка):

```bash
gsutil ls gs://prep2go/prep2go-podcast/emigro-shorts/tips/portugal/
```
