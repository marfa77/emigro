# Gold satellite guides — жизнь 0–6 месяцев

Аудитория сателлита: **только приехал** и **уже живёт 4–6 месяцев**. Не «куда валить» (это www/wizard) и не год 2–5 (гражданство).

Писать **15 полных гайдов** по слотам. Сначала **CORE 8** (без них это брошюра ВНЖ), потом remaining life 7. Не 15 заглушек под счётчик слов.

CORE: `first_30_days`, `tax_id`, `home_setup`, `rent`, `residence_appointment`, `bank`, `health`, `districts`.

Производство: **дешёвый черновик → GPT Sol** (`gpt-5.6-sol-medium`) + поиск + уникальный WebP на **каждый** слот в том же батче. См. [guides-pipeline.md](guides-pipeline.md).

Гейт: `npm run satellite:assert-launch`. Слот без slug или `content_kind !== "guide"` → FAIL. Нет блока «к 4–6 месяцу» или Nota Emigro → FAIL, даже при 1500 словах. Не добивать объём водой.

## Количество и глубина (зафиксировано)

| | Gold | Не gold |
|--|------|---------|
| Гайдов | **15** слотов | 7 Spain / «cron later» |
| Слов | **≥1200**, цель **1500** (не раздувать >2200 водой) | 600–900, `tip` вместо guide |
| Секции | **≥6**, glossary first, official → practice → gap → mistakes/timeline | FAQ-паддинг |
| FAQ | ≥4, из них ≥2 «По правилам / На практике» | 2 общих вопроса |
| Takeaways | ≥4, ≥2 с `Официально:` / `На практике:` | список без меток |
| Источники | ≥2 gov/official | блоги юристов как единственный source |
| Гео | город-фокус в примерах и офисах | «вся страна» без адреса |
| Поиск | WebSearch + официальный URL в Nota | «как в Португалии» без fetch |
| Картинки | уникальный `{slug}.webp` ≥20KB + `COMMITTED_NOTE_OG_SLUGS` **сразу** | DEFAULT_OG, cron later, один Pexels на все |

`validateNoteDraft` floor остаётся 600 (лента). Launch gold — `SATELLITE_LAUNCH_BAR`.

Полный paste пользователя не сокращать. Fact-check — overlay **Nota Emigro**, не вырезать разделы.

## Карта жизни (обязательные слоты)

Фазы: **неделя 0–1** → **месяц 1–3** → **месяц 4–6**. `first_30_days` — оглавление со ссылками на остальные 14, не единственный гайд «про всё».

| Слот | Фаза | Сторона жизни | Portugal gold | Новый сателлит закрывает |
|------|------|---------------|---------------|--------------------------|
| `first_30_days` | 0–1 | оркестратор | `pervyj-mesyac-portugaliya-checklist` | порядок 72ч → неделя 4 |
| `tax_id` | 0–1 | документы | `nif-porto-kak-poluchit-2026` | ID / налоговый номер в городе-фокусе |
| `home_setup` | 0–1 | связь и ЖКХ | `vybor-internet-provaydera-portugaliya-2026` | SIM + интернет + свет/газ |
| `rent` | 0–1 | жильё | `arenda-dolgosrok-porto-braga-2026` | договор, залог, red flags |
| `residence_appointment` | 1–3 | статус | `aima-agora-zapis-2026` | cita / Termin / AIMA |
| `visa_route` | 1–3 | статус | `prodlenie-vnzh-portugaliya-aima-2026` + pillar www | главный RU-маршрут, не путать каналы |
| `bank` | 1–3 | деньги | `kak-otkryt-bankovskiy-schet-portugalia-2026` | IBAN vs Revolut, KYC RU/BY |
| `health` | 1–3 | здоровье | `meditsina-norte-sns-chastnaya-stomatologiya-2026` | гос/частное, стоматолог, emergency |
| `districts` | 1–3 | где жить | `porto-rajony-arenda-shkoly-parki-sport-2026` | 5–8 районов, кому куда |
| `transport` | 1–3 | передвижение | `mashina-portugaliya-kupit-arenda-import-2026` | без машины + первое авто/права |
| `schools_family` | 1–3 | семья | `porto-vs-braga-semya-mezhdunarodnaya-shkola-2026` | школы; без детей — слот всё равно есть |
| `yellow_pages` | 1–3 | сервисы | `zheltye-stranitsy-relokanta-portugaliya-2026` | мастер, gestoría, не гражданство |
| `consulate_docs` | 4–6 | документы паспорта | `zapis-v-konsulstvo-portugaliya-2026` | запись, загран, апостиль |
| `work_ss` | 4–6 | работа / взносы | `social-security-contributions-portugal-risk-2026` | NISS/SS, договор, налоговый час |
| `local_life` | 4–6 | ритм | `klimat-norte-zhara-vlazhnost-plesen-zima-2026` | климат жилья, неделя, регион |

`mustAnswer` по каждому слоту — в `SATELLITE_LAUNCH_SLOT_META`. Тело гайда **обязано** закрыть эти вопросы, не только упомянуть в FAQ.

Spain v1 закрыл часть бумаг и оборвался: нет районов, здоровья, ЖКХ, транспорта, семьи, консульства, SS, ритма. Это **долг**, не шаблон.

## Не публиковать как v1 (есть у Portugal — потом)

- Покупка квартиры / земли / стройка
- Фестивали, клубы, вино как отдельные гайды
- Гражданство 2–5 лет и exam-only (UniPrep на www)
- Thin household: возврат товара, разовая новость транспорта, один FAQ из `first_30_days`

Питомцы, аптечка, «как выбросить мусор» — FAQ внутри `local_life` / `home_setup`, не отдельная заметка.

## Тело (каждый из 15)

1. **Glossary** first (≥5 терминов страны).
2. **Official** — портал, пороги, с `official_links`.
3. **Practice** — офисы города-фокуса, сроки из чатов (сигналы, не копипаста).
4. **Gap** — сайт vs очередь.
5. **Mistakes or timeline**.
6. Короткий блок **«К 4–6 месяцу»** (что откладывают и чем это бьёт).
7. **FAQ** ≥4.
8. **Nota Emigro (fact-check)** — OK / soft / fixed + источник. Не угадывать молча.
9. CTA: wizard / Assist по смыслу; чат «для своих» на странице заметки.

## Файлы

```
lib/community-notes/guides/{country}-{slug}.ts
lib/community-notes/guides/{country}-editorial-index.ts
scripts/{country}-upsert-editorial.ts
```

Индекс:

```ts
export const GERMANY_EDITORIAL_GUIDES = [ /* ровно 15 guide */ ];
export const GERMANY_GUIDE_SLOTS = {
  first_30_days: "…",
  tax_id: "…",
  home_setup: "…",
  rent: "…",
  residence_appointment: "…",
  visa_route: "…",
  bank: "…",
  health: "…",
  districts: "…",
  transport: "…",
  schools_family: "…",
  yellow_pages: "…",
  consulate_docs: "…",
  work_ss: "…",
  local_life: "…",
};
```

`content_kind: "guide"` (не `tip` — аренда Spain была tip, assert валит). `city` = фокус.

## Images

`npm run {country}:generate-note-images` (clone Spain script; works off editorial seed, not only DB). For **all 15** slugs in the Sol-accepted batch — not later.

- Commit `public/images/community-notes/{slug}.webp` (≥20 KB, unique hash per slug)
- Add slug to `COMMITTED_NOTE_OG_SLUGS`
- `git add` with the guide. Untracked WebP → next Git deploy 404s the cards.

## SEO + AEO (тот же шип — не «мета потом»)

Primary query = `SATELLITE_LAUNCH_SLOT_META[slot].primaryQuery` (демонимы/город + 2026 + хук). `aeoQuestion` — вопрос, на который отвечает `quick_answer` и FAQ.

В том же батче, что тело:

- `seo_title` 24–58, год + гео + хук, сильнее конкурента по SERP
- `seo_description` 140–165
- `excerpt` ≥80, не клон description
- `quick_answer` ≥180 (сниппет для ChatGPT)
- ≥4 FAQ; ≥2 с «По правилам» / «На практике»
- ≥3 `topic_tags`; ≥2 https `official_links`

Runtime: `ai:description` в `<head>`, `data-llm="facts|commercial"`, satellite `/llms` с `utm_source=llm`. Гейт: `satelliteGuideSeoAeoGaps`.

- Хаб: Assist + wizard.
- Prep2Go только PT language. UniPrep не на bank/rent.
- Чат: **для своих** — важное, общение, эксперты (`CityChatPitch`).

Картинки: см. секцию Images выше. Не дублировать DEFAULT_OG.

Group-bank: ≥15 слагов, city-life first, 1 discussion / 3 days.
