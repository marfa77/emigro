# Corridor satellite playbook — репликация Portugal для других коридоров

Эталон: `docs/PORTUGAL_SATELLITE.md`, `docs/PORTUGAL_CRON.md`, `docs/PORTUGAL_GUIDE_FACTCHECK.md`.

## Принципы

1. Telegram → **сигналы** (`community_signals`), не копипаста.
2. Редакция → **заметки** (`community_notes`) с секциями `official | practice | gap`.
3. Pillar-гайды на www — **вторичные цитаты** из чатов через fact-check helper.
4. Один `country_key` на коридор; VPS cron — один timer на страну.

## Workflow

1. **Agent** рекомендует страну (рейтинг ниже).
2. **Вы** присылаете 3–6 Telegram handles.
3. **Agent** собирает satellite: parser → signals → fact-check → цитаты в гайдах → блок на коридоре.

---

## Рейтинг коридоров (Jul 2026)

| # | Страна | Гайды | Pillar | Satellite | Почему |
|---|--------|-------|--------|-----------|--------|
| — | Португалия | 26 | ✓✓✓ | **есть** | эталон |
| **1** | **Испания** | 23 | ✓ | нет | полный коридор, PT vs ES, Barakhlo Валенсия |
| 2 | Германия | 23 | ✓ | нет | Blue Card, Termin |
| 3 | Польша | 7 | ✓ | нет | wait times, BY/UA |
| 4 | Чехия | 4 | ✓ | нет | Blue Card, Živnost |
| — | Грузия/Сербия | 1–2 | transit | нет | хабы, не EU wizard |

**Рекомендация:** начать с **Испании**. Альтернатива #2 — **Польша**, если приоритет work permit / очереди UoC.

---

## Чеклист репликации (зеркало Portugal)

### Фаза 0 — вход от пользователя

- [ ] 3–6 Telegram handles (релокантские чаты, не `@emigro_chat`)
- [ ] Город-фокус satellite (напр. Valencia для ES)
- [ ] VPS cron ok (тот же сервер, что Portugal/Barakhlo)
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
| `d7-vs-digital-nomad-visa-sravnenie` | `digital-nomad-portugaliya-ispaniya-italiya-2026` |
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

Пришлите список каналов:

```
@channel_name — Valencia, general relocants
@channel_name — DNV / extranjería focus
```

После списка — собираем Spain satellite по чеклисту выше.
