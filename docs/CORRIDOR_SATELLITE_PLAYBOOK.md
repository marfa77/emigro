# Corridor satellite playbook — страна + город-фокус

**Запуск:** напишите страну или город → скилл `.cursor/skills/launch-satellite/`.  
Эталон качества: Portugal / Porto. Шаблон **файлов** (роуты): Spain / Valencia.  
**Не** выкатывать Spain-thin (7 коротких гайдов, без живого чата, «cron later»).

Гейт: `npm run satellite:assert-launch -- --country={country} --city={city}` должен PASS. Иначе сателлит не launched.

## Модель

1. **Один сателлит = одна страна** — `{country}.emigro.online`. Не плодить сателлит на второй город той же страны.
2. **Город-фокус** — owned-чат («{Город} и вокруг») + default `city` у заметок + примеры в гайдах.
3. Telegram third-party → **сигналы**, не копипаста. Owned: `@Emigro_news` (канал на все страны) + закрытый городской чат **как фишка** («для своих»: важное, общение, эксперты отвечают) через `@emigro_chat_bot?start={city}_chat`. Не парсить `@emigro_chat`.
4. Gold «100»: **15** гайдов жизни week 0 → month 6 (≥1200 слов), 3–6 чатов в `parser/groups.yaml`, group-bank + discussion prompts, **wizard → бот → городской чат**, Threads CTA, DNS, **VPS systemd в том же заходе**.

## Workflow (супербыстрый)

1. **Вы** пишете «Берлин» / «Польша» / «Валенсия».
2. **Agent** мапит город → страна; **дешёвый** черновик гайдов + поиск; **GPT Sol** ревью; уникальные WebP на все слоты сразу; parser/bank/systemd; assert.
3. **Вы** создаёте закрытую группу в Telegram и присылаете `chat_id` (бот не умеет создать группу) + DNS CNAME.

Живые: **portugal / porto** (gold), **spain / valencia** (не gold — gap). Дальше: Germany/Berlin, Poland/Warsaw, Czechia/Prague.

---

## Рейтинг коридоров

| # | Страна | Фокус | Satellite | Почему |
|---|--------|-------|-----------|--------|
| — | Португалия | Porto | **gold** | чат + bank + Threads + parser |
| — | Испания | Valencia | **v1** | 7 editorial; добить чат/bank |
| **1** | Германия | Berlin | нет | Blue Card, Termin |
| 2 | Польша | Warsaw | нет | wait times, BY/UA |
| 3 | Чехия | Prague | нет | Blue Card, Živnost |
| — | Грузия/Сербия | — | нет | хабы, не EU wizard |

---

## Чеклист репликации (зеркало Portugal)

### Фаза 0 — вход от пользователя

- [ ] Страна **или** город (agent мапит и сам ищет 3–6 TG handles)
- [ ] Город-фокус owned-чата (Porto / Valencia / Berlin…)
- [ ] Вы создаёте закрытую группу по карточке агента (имя, био, аватар, `@emigro_chat_bot` админ)
- [ ] VPS cron ok (тот же сервер, что Portugal/Barakhlo) — **в том же заходе**, не после v1
- [ ] Субдомен DNS: `{country}.emigro.online` (v1 можно path `/satellite/{country}`)

### Фаза 1 — Parser

- [ ] Каналы в `parser/groups.yaml` с `country_key: {country}`
- [ ] `python main.py --once --dry-run`
- [ ] Бэкфилл: `npm run {country}:backfill-month`

### Фаза 2 — Ingest + DB

- [ ] `community_signals.country_key = {country}`
- [ ] Ingest direct Supabase (`npm run {country}:daily`)
- [ ] Cursor sync: `lib/community-notes/sync-parser-state.ts`

### Фаза 3 — Daily cron (VPS)

- [ ] systemd: `emigro-{country}-community.timer` → `npm run {country}:daily`
- [ ] 07:00 UTC (как Portugal)
- [ ] **Не** дублировать Vercel cron для community

### Фаза 4 — Редакция

- [ ] Quality gate: `lib/community-notes/official-vs-practice.ts`
- [ ] Spotlight: `refreshDailySpotlight("{country}")`

### Фаза 5 — Satellite UI

- [ ] `lib/satellite/{country}.ts`
- [ ] `app/satellite/{country}/*`
- [ ] `middleware.ts` — rewrite субдомена
- [ ] `lib/satellite/city-chats.ts` — строка owned-чата (`{city}_chat`, `EMIGRO_{CITY}_CHAT_ID`)
- [ ] Wizard: `/ru/wizard` и `/ru/{country}/results` показывают CTA бота; после отчёта в Telegram — инвайт в **этот** чат, не в Porto

### Фаза 6 — Коридор (www)

- [ ] `components/{country}/{Country}FeaturedNotes.tsx`
- [ ] `CorridorLanding.tsx` — `is{Country}HubTopic`
- [ ] `lib/corridor/hub.ts` — `hasPractice: true`

### Фаза 7 — Guide fact-check

- [ ] `lib/guides/{country}-telegram-citations.ts`
- [ ] `scripts/{country}-guide-telegram-factcheck.ts`
- [ ] `npm run {country}:guide-factcheck`
- [ ] `docs/{COUNTRY}_GUIDE_FACTCHECK.md`

### Фаза 8 — Deploy

- [ ] 3–5 TG-цитат max на гайд
- [ ] `npm run build` → deploy по «деплой»

---

## Именование файлов

| Артефакт | Шаблон | Пример (Spain) |
|----------|--------|----------------|
| Citation helper | `lib/guides/{country}-telegram-citations.ts` | `spain-telegram-citations.ts` |
| Fact-check script | `scripts/{country}-guide-telegram-factcheck.ts` | `spain-guide-telegram-factcheck.ts` |
| Satellite config | `lib/satellite/{country}.ts` | `lib/satellite/spain.ts` |
| Hub lib | `lib/{country}/hub.ts` | `lib/spain/hub.ts` |
| Daily script | `scripts/{country}-community-daily.ts` | `spain-community-daily.ts` |
| npm | `{country}:daily`, `{country}:guide-factcheck` | `spain:daily` |
| Parser | `parser/groups.yaml` | `country_key: spain` |

---

## Portugal reference

| Layer | Files |
|-------|--------|
| Satellite | `lib/satellite/portugal.ts`, `lib/portugal/hub.ts` |
| Daily | `npm run portugal:daily`, `docs/PORTUGAL_CRON.md` |
| Fact-check | `scripts/portugal-guide-telegram-factcheck.ts` |
| Citations | `lib/guides/portugal-telegram-citations.ts` |
| Corridor UI | `components/portugal/PortugalFeaturedNotes.tsx` |

---

## Pillar-набор (Portugal → Spain)

| Portugal | Spain |
|----------|-------|
| `vnj-portugaliya-d8-d7-grazhdanstvo-2026` | `vnj-ispaniya-2026` |
| `pervye-30-dnej-v-portugalii-2026` | `pervye-30-dnej-v-ispanii-2026` |
| `portugaliya-vs-ispaniya-vnj-2026` | тот же + ES-сигналы |
| `d7-vs-digital-nomad-visa-sravnenie` | `digital-nomad-vizy-evropy-sravnenie-2026` |
| `grazhdanstvo-portugaliya-ispaniya-2026` | тот же |

---

## Spain — ключевые слова для поиска чатов

**Визы:** `digital nomad`, `UGE`, `extranjería`, `cita previa`, `TIE`, `NIE`, `non-lucrative`, `huellas`

**Налоги:** `Beckham`, `autónomo`, `IRPF`, `Hacienda`

**Быт:** `alquiler`, `Idealista`, `empadronamiento`, `padrón`, `banco`, `IBAN`

**Города:** Valencia, Barcelona, Madrid, Alicante, Málaga

**Мифы для fact-check:** Golden Visa открыта, «20% из Испании», срок TIE, очередь extranjería

---

## Spain — первая волна practice-заметок

1. TIE / cita extranjería (Madrid/BCN/Valencia)
2. UGE vs консульство — маршрут DNV
3. NIE + empadronamiento — порядок шагов
4. Аренда: Idealista, contrato, депозит
5. Beckham / autónomo — мифы из чатов
6. Банк и IBAN для нерезидента

---

## Citation rules

- TG = **secondary**; пороги и закон — только official.
- Фраза: «В локальных чатах эмигрантов (@…, @…) в 2025–2026 часто пишут, что…»
- 3–5 цитат на гайд; канал + период обязательны.
- Не выдумывать цитаты — только `community_signals` или verified seeds.

---

## Очередь после Spain

1. **Польша** — wait times, UoC, work permit
2. **Германия** — Blue Card, Termin, Ausländerbehörde
3. **Чехия** — BY/UA маршруты
4. Транзитные хабы (GE, RS) — отдельный playbook

---

## Следующий шаг

Напишите **страну или город** в чат агента (скилл `launch-satellite`). Список чужих TG-чатов присылать не нужно — агент ищет сам. От вас: создать закрытую группу по его карточке и прислать `chat_id`.
