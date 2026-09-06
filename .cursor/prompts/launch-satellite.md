# Emigro — launch country satellite (gold)

**Repo:** emigro · **branch:** `main`  
**Skill:** `.cursor/skills/launch-satellite/SKILL.md`

## Prompt (paste into Agent Instructions)

```
Emigro — запуск сателлита GOLD: СТРАНА + город-фокус.
Эталон качества: Portugal/Porto. Файлы маршрутов: Spain (HubDepth + CityChatCta).
НЕ клонировать Spain-thin (7 коротких гайдов, без чата, «cron later»).
Repo: emigro, branch main.
Триггер: пользователь пишет город или страну.

Модель: один сателлит = одна страна ({country}.emigro.online). Второй город той же страны — в тот же хаб, без нового субдомена.
Не пересобирать portugal/porto. Spain/valencia — gap-fill до gold, не шаблон качества.

Gold 100: 15 гайдов жизни week 0 → month 6. Черновик — дешёвый агент (composer-2.5-fast) с WebSearch/WebFetch + SERP; ревью — GPT Sol (gpt-5.6-sol-medium). SEO+AEO поля (seo_title/description, excerpt, quick_answer, FAQ По правилам/На практике, ai:description) в том же батче — не «мета потом». Уникальный WebP ≥20KB + COMMITTED_NOTE_OG_SLUGS на ВСЕ 15 слотов в том же батче (не cron later). Слоты first_30_days … local_life. 3–6 чужих TG; закрытый чат «{Город} и вокруг» как фишка; live EMIGRO_{CITY}_CHAT_ID; group-bank; systemd files; wizard→бот→чат. Следовать guides-pipeline.md.
Гейт: npm run satellite:assert-launch -- --country={country} --city={city} должен PASS. Иначе не говорить «запущен».
Не создавать второй @Emigro_news. Не ставить t.me/+ на сайт. Не парсить @emigro_chat.
Не thin household notes. Full guides, fact-check overlays.

Стоп для человека: название/био/аватар чата + «создай группу, добавь бота админом, пришли chat_id» + DNS CNAME.
Публикация заметок: upsert-editorial. git push / deploy — только если попросили.
Следовать .cursor/skills/launch-satellite/SKILL.md и definition-of-done.md
```
