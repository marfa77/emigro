# Emigro — стратегия community engagement

> **Статус:** план (без реализации в коде)  
> **Дата:** 2026-06-29  
> **Аудитория:** русскоязычные релоканты (RU/BY/UA/KZ), уже за границей или на этапе переезда  
> **Контекст продукта:** corridor-first навигатор, 10 EU-коридоров, wizard, SEO-гайды (47+), дайджесты, Facts API, Contributor API (Phase 2), Route Check €129 (Gumroad), marketplace партнёров

**Техническая база (уже на `main`, коммит `041a604`):**

| Возможность | Где в коде / API |
|-------------|------------------|
| 10 активных коридоров | `lib/corridor/registry.ts` — `CORRIDOR_REGISTRY`, флаги `active`, `wizardEnabled`, `assistEligible` |
| Facts API (RAG) | `GET /api/v1/facts/corridors`, `/facts/corridors/{slug}` — `lib/facts/build.ts` |
| Meta / discovery | `GET /api/v1/meta/corridors`, `/meta/contributor-guide`, `/meta/ingest-schema` |
| LLM-индекс | `/llms.txt`, `/llms-full.txt` — `lib/seo/llms-full.ts` |
| Telegram-сообщество | `/ru/community` — лендинг + `CommunityJoinButton`, событие `community_join_click` |
| Route Check | `/ru/assist` — €129 Gumroad, `assist_lead_submitted` |
| Партнёры | `/ru/partners`, `lib/providers/registry.ts`, recruitment banner |
| Contributor pipeline (документирован) | `docs/API_CONTRIBUTOR_GUIDE.md`, `POST /knowledge/proposals/batch`, `POST /knowledge/flags` (в схеме) |
| Аналитика | `lib/analytics/events.ts` — wizard, news, provider_click, community |

**Чего пока нет в продакшене:** UI feedback на статьях/программах, `knowledge/flags`, contributor dashboard, репутация пользователей, автоматический content pipeline из сигналов.

---

## 1. North Star и позиционирование

### Emigro community — это НЕ

- Общий форум «про эмиграцию» с тысячами тем и хаосом
- Telegram-чат ради чата (без связи с данными и маршрутами)
- Место, где «гарантированно дадут ВНЖ» или реклама без модерации
- Юридическая консультация (это явно на `/ru/community` в правилах)

### Emigro community — это

**Живой слой доверия вокруг corridor intelligence:** русскоязычные люди, которые уже прошли путь (или проходят его сейчас), превращают свой опыт в **сигналы**, которые улучшают гайды, программы, дайджесты и подбор партнёров — без того чтобы основатель вручную проверял каждый комментарий.

Формула позиционирования:

```
Community Emigro =
  Telegram (живые вопросы, срочные новости)
  + on-site сигналы (полезно / устарело / исправить)
  + contributor pipeline (официальные источники → proposals)
  + marketplace (квалифицированный intent → партнёры)
```

**North Star metric (12 мес):** *доля контент-единиц с актуальным `last_verified` и ≥1 community-сигналом за 90 дней* — измеряет, что сообщество реально кормит freshness, а не только трафик в чат.

**Для кого:** человек уже в Португалии/Германии/… или выбирает между двумя коридорами; ему нужны **практика** (банк, аренда, AIMA, консульство), а не абстрактная «миграционная теория».

**Отличие от конкурентов:** Transita и аналоги — breadth. Emigro — **глубина одного коридора + живой RU-слой + проверяемые факты** (`content_hash`, changelog, Facts API).

---

## 2. Engagement loops (маховики)

### Loop A — «Читатель → сигнал → обновление → доверие»

```
SEO-гайд / program page / digest
    → пользователь читает
    → «Полезно» / «Устарело» (1 клик, без логина)
    → агрегация в content_signals
    → при пороге: задача contributor / LLM-pipeline (official source)
    → approve → changelog + bump last_verified
    → бейдж «Обновлено 3 дня назад» на странице
    → выше CTR из Яндекса и выше trust в wizard
```

**Почему работает для RU-аудитории:** после 2022–2024 доверие к «статье 2023 года» нулевое; видимый changelog и дата верификации — конкурентное преимущество.

### Loop B — «Wizard → community → уточнение маршрута»

```
Прошёл wizard → результат «D8, но доход на грани»
    → CTA «Спросить в чате» (deep link с corridor + program slug)
    → ответы в Telegram → модератор/бот тегирует «подтверждено практикой»
    → сигнал привязывается к program_requirement (не как факт, а как practice_note)
    → следующий читатель видит «Участники сообщества: на практике AIMA просит X»
```

Связь с кодом: `wizard_completed`, `corridor_link_click`, `community_join_click` — уже есть; нужен только `source` с контекстом коридора.

### Loop C — «Contributor → attribution → мотивация → больше данных»

```
Агент/волонтёр читает API_CONTRIBUTOR_GUIDE
    → batch proposals с provenance
    → auto L0–L1 / human L2+
    → публичный changelog + имя в attribution
    → revshare (позже) от provider spend на entity
    → больше pipelines подключаются к gaps API
```

Уже описано в `docs/MONETIZATION.md` §4; community loop добавляет **очередь задач из user flags**, чтобы contributor не искал, что устарело.

### Loop D — «Marketplace ↔ community ↔ Route Check»

```
Provider_click / assist_lead
    → post-interaction оценка (опционально)
    → quality_score партнёра (MONETIZATION §3.3)
    → лучший match в Assist shortlist
    → довольный пользователь оставляет practice signal
    → Route Check PDF ссылается на актуальные program facts
```

Route Check €129 — **не B2C paywall**, а фильтр серьёзного intent и ручной QA маршрута; community-сигналы снижают нагрузку на founder при подборе партнёра.

### Составной flywheel

```
Трафик (Яндекс, чат, сарафан)
  → чтение corridor pack
  → лёгкие сигналы (без регистрации)
  → приоритизированная очередь обновлений
  → свежие facts в API / wizard
  → больше органики + больше доверия к Assist
  → больше provider revenue → contributor revshare
  → больше желающих обновлять данные
```

---

## 3. Roadmap по фазам (приоритет и обоснование)

Каждая фаза ~3–6 месяцев. Порядок: **сначала измеримые сигналы и связка Telegram ↔ сайт**, потом API/contributor scale, потом marketplace automation.

### Phase 0 — «Сигналы без платформы» (0–3 мес)

**Цель:** engagement с минимальной разработкой; founder не в bottleneck.

| # | Инициатива | Почему сейчас |
|---|------------|---------------|
| P0.1 | Стандартизировать Telegram: топики по коридорам, закреплённые ссылки на landing/digest | Уже есть `/ru/community`; 10 коридоров в registry — структура бесплатна |
| P0.2 | Deep links из wizard/results/news в чат с UTM + `corridor_slug` | Конвертирует читателей в участников с контекстом |
| P0.3 | Еженедельный «что изменилось» пост из digest cron → чат | Использует существующие дайджесты; даёт повод вернуться |
| P0.4 | Google Form / Typeform «Устарело на странице X» (временно) | Валидирует спрос до БД; поля: URL, причина, комментарий |
| P0.5 | Таблица ручной triage: сигнал → owner (founder / contributor / ignore) | Отрабатывает процесс до автоматизации |

**Не делаем:** репутация, публичные профили, форум на сайте.

### Phase 1 — «On-site feedback MVP» (3–6 мес)

**Цель:** один клик на сайте → `content_signals` → дашборд приоритетов.

| # | Инициатива | Почему после P0 |
|---|------------|-----------------|
| P1.1 | Виджет feedback на program pages + SEO-гайдах + digest | Высокий трафик, привязка к `natural_key` или `guide_slug` |
| P1.2 | `POST /api/v1/content/feedback` + Supabase `content_signals` | Независимо от тяжёлого knowledge review |
| P1.3 | Admin: очередь «топ устаревших» по corridor | Founder тратит 30 мин/нед, не 3 ч/день |
| P1.4 | Связка flag → `knowledge/flags` (из ARCHITECTURE) | User не обязан приносить source; contributor доносит |
| P1.5 | События: `content_feedback_submit`, `content_helpful_vote` | Расширение `lib/analytics/events.ts` |

### Phase 2 — «Contributor scale + открытый read API» (6–12 мес)

**Цель:** обновления контента без founder; LLM-агенты и волонтёры.

| # | Инициатива | Почему после P1 |
|---|------------|-----------------|
| P2.1 | Публичный read: facts + meta уже есть; документировать rate limits | `facts/corridors`, `meta/corridors` на main |
| P2.2 | Contributor tiers + API keys (invite) | Злоупотребления до масштаба некритичны на read |
| P2.3 | Dashboard «Needs update» из aggregated flags | Закрывает loop A→C |
| P2.4 | Changelog UI на program pages | Уже в ARCHITECTURE; trust для RU-аудитории |
| P2.5 | Первые 3–5 внешних contributor pipelines (Portugal, Spain) | Где максимум трафика и Assist |

### Phase 3 — «Marketplace + reputation lite» (12–18 мес)

**Цель:** community-сигналы влияют на partner matching и Route Check.

| # | Инициатива | Почему последним |
|---|------------|------------------|
| P3.1 | Post-click rating провайдера (1–5, опционально) | Нужен объём кликов; описано в MONETIZATION |
| P3.2 | `quality_score` в ranking shortlist | Без сигналов score бессмысленен |
| P3.3 | Route Check intake: auto-prefill из wizard session + facts API | Снижает ручную работу при €129 |
| P3.4 | Немонетарные награды contributor → монетарный revshare | Pool появляется с provider CPL |
| P3.5 | Corridor-scoped provider campaigns | `assistEligible` в registry уже готов |

**Почему именно такой порядок:** без Phase 0–1 вы не знаете, какие страницы реально устаревают. Без свежих facts marketplace продаёт лиды в устаревший маршрут → disputes и потеря доверия. Gamification и форум до сигналов — отвлечение.

---

## 4. Система feedback на статьях

### 4.1 Альтернативные подходы

| Подход | Плюсы | Минусы |
|--------|-------|--------|
| **A. Upvote/downvote** | Привычно, быстрый sentiment | Downvote без контекста; токсичность; не говорит *что* устарело |
| **B. Только «Информация устарела»** | Чёткий сигнал для pipeline | Нет позитивного reinforcement; слабая аналитика качества |
| **C. Гибрид (рекомендуется)** | «Полезно» + структурированное «Устарело» + опционально комментарий | Чуть сложнее UX |

**Рекомендация: подход C** — для SEO-гайдов и digest достаточно «Полезно / Устарело»; для program entities добавить привязку к `natural_key` и опциональное поле «что именно» (чекбоксы: сумма, срок, документы, ссылка, другое).

### 4.2 UX (макет поведения)

**Размещение:** конец статьи + sticky bar на mobile после 40% scroll (один раз за сессию).

**Состояния:**

1. **Idle:** «Была ли статья полезной?» → 👍 Полезно | 👎 Не помогло  
2. **После 👎 или всегда доступно:** ссылка «Сообщить об устаревании»  
3. **Модал «Устарело»:**
   - Что не так? (multi-select): `сроки`, `суммы`, `документы`, `закон изменился`, `ссылка битая`, `другое`
   - Комментарий (опционально, max 500)
   - Email (опционально — «сообщим об обновлении»)
   - Checkbox: «Могу приложить официальный источник» → раскрывает URL + excerpt (power user / budущий contributor)
4. **Thank you:** «Спасибо. Обновления: [changelog страницы] или [чат]»

**Для program pages** (wizard results, `/ru/{country}/programs/{slug}`):

- Показать `last_verified` из Facts API (уже есть в модели)
- Кнопка «Данные неверны?» → тот же flow, но `entity_type: program_requirement` если пользователь на конкретном поле (Phase 1.5)

**Анти-bottleneck правила:**

- 👍/👎 **не требуют** модерации и **не** создают задачу founder
- Только «Устарело» + порог (≥3 unique за 14 дней ИЛИ 1 с source URL) → очередь
- Авто-ответ при ≥5 «устарело» на одном slug: баннер «Проверяем актуальность» без ручного действия

### 4.3 Sketch data model

```sql
-- Лёгкие сигналы (статьи + страницы без natural_key)
content_signals (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  signal_type TEXT NOT NULL,  -- helpful | not_helpful | outdated_report
  target_kind TEXT NOT NULL,  -- guide | news | digest | program_page | corridor_landing
  target_slug TEXT NOT NULL,  -- guide filename или program slug
  corridor_slug TEXT,         -- ru-speaking-to-portugal, nullable
  natural_key TEXT,           -- nullable, для program entities
  reasons TEXT[],             -- enum array для outdated
  comment TEXT,
  source_url TEXT,            -- optional, от пользователя
  session_id TEXT,            -- fingerprint, dedupe
  user_id UUID,               -- nullable
  status TEXT DEFAULT 'open'  -- open | triaged | linked_proposal | dismissed | resolved
);

-- Агрегаты (materialized или cron)
content_signal_rollup (
  target_kind TEXT,
  target_slug TEXT,
  helpful_count INT,
  not_helpful_count INT,
  outdated_count_30d INT,
  priority_score FLOAT,       -- weighted formula
  last_signal_at TIMESTAMPTZ,
  PRIMARY KEY (target_kind, target_slug)
);

-- Связь с knowledge pipeline (уже в ARCHITECTURE)
knowledge_flags (
  id UUID,
  natural_key TEXT,
  reason TEXT,                -- outdated | incorrect | other
  comment TEXT,
  content_signal_id UUID,     -- FK optional
  status TEXT,
  spawned_proposal_id UUID
);
```

**Приоритет очереди:**

```
priority_score =
  3 * outdated_count_30d
  + 2 * (outdated with source_url)
  + 1 * not_helpful_count
  - 0.5 * helpful_count
  + corridor_weight  -- Portugal/Spain выше, если трафик выше
```

### 4.4 Pipeline без founder bottleneck

```
User signal (устарело)
    │
    ├─► L0 auto: dedupe, spam filter, битые URL
    │
    ├─► Если есть source_url + excerpt → POST knowledge/proposals (operation: update)
    │       └─► существующий L0–L4 review (ARCHITECTURE)
    │
    ├─► Если нет source → knowledge_flags → contributor task «Needs update»
    │       └─► contributor/LLM приносит official proof
    │
    └─► SEO-гайд (markdown, не entity):
            └─► задача editor: PR в content/guides/ru/
            └─► или LLM draft + human approve 5 мин (не founder — rotating contributor)
```

**Роли:**

| Роль | Нагрузка | Инструмент |
|------|----------|------------|
| User | 1 клик | Виджет |
| Auto | dedupe, rollup | Cron + API |
| Contributor | source-backed fix | API batch |
| Editor-volunteer | markdown guides | Git / CMS later |
| Founder | T3–T4 только, escrow disputes | Admin 30 мин/нед |

---

## 5. Open API + программа contributor

### 5.1 Что уже открыто

- `GET /api/v1/facts/corridors` — список коридоров с `program_count`, `last_verified`
- `GET /api/v1/facts/corridors/{slug}` — RAG-friendly pack
- `GET /api/v1/meta/corridors` — registry + enums
- `GET /api/v1/meta/contributor-guide` — машиночитаемый гайд
- `GET /llms-full.txt` — полный индекс для агентов

Write API: `Authorization: Bearer` — по invite (`API_CONTRIBUTOR_GUIDE.md`).

### 5.2 Альтернативы программы наград

| Модель | Описание | Когда |
|--------|----------|-------|
| **A. Сразу денежный revshare** | % от provider CPL | Нужен provider pool; риск микро-выплат и fraud |
| **B. Только немонетарное** | Бейджи, changelog, early access | Phase 2 старт |
| **C. Гибрид (рекомендуется)** | B → затем revshare при provider revenue | Соответствует `MONETIZATION.md` |

**Рекомендация: C** — немонетарное с первого approved proposal; revshare когда Portugal corridor приносит ≥N€ provider spend/мес.

### 5.3 Tiers contributor

| Tier | Кто | Права | Quality gate |
|------|-----|-------|--------------|
| **Reader** | все | read API, flags через UI | — |
| **Scout** | invite, прошёл quiz по CONTRIBUTOR_PROMPT | proposals `refresh`, T0 fields | L0 auto + 10 supervised |
| **Updater** | ≥5 approved updates | `update` T1–T2 | L1–L2 |
| **Maintainer** | corridor lead | approve T1 peer, assign tasks | reputation + manual vet |
| **Pipeline** | LLM service account | batch, rate limit | L0 strict; human sample 5% |

### 5.4 Немонетарные награды (Phase 2)

- Публичное имя в changelog (`contributor.display`)
- Бейдж на corridor landing: «Поддерживается сообществом»
- Приоритет в Telegram @mention при вопросах по коридору
- Early access к wizard beta / новым программам
- Листинг в `/ru/contributors` (opt-in)

### 5.5 Монетарные (Phase 3+)

Из `MONETIZATION.md`: author 60% / verifier 25% / updater 15% contributor pool; platform fee 25–35%.

### 5.6 Attribution

- Каждая published entity → `entity_contributions` (уже в ARCHITECTURE)
- API response `facts` может включать `attribution: [{ role, display }]`
- Запрет: продавать «гарантированное место» в данных

### 5.7 Abuse prevention

| Угроза | Митигация |
|--------|-----------|
| Spam proposals | L0: provenance обязателен; duplicate skip |
| Политически мотивированные правки | Только official sources для T2+ |
| API scraping | rate limit read; cache headers (`META_CACHE_HEADERS`) |
| Накрутка helpful | session dedupe; не влияет на деньги |
| Self-dealing provider | provider не редактирует eligibility (MONETIZATION §3.7) |
| LLM hallucination | `raw_excerpt` min 20 chars + URL 200 check |

---

## 6. Синергия marketplace и community

### 6.1 Позиционирование marketplace

Emigro — **не каталог юристов**, а **matching после corridor intelligence**:

```
Релокант (бесплатно: wizard, facts, гайды)
    ↔ Emigro (Route Check €129, shortlist, quality_score)
    ↔ Провайдер (CPL/CPC, verified badge)
```

Страницы: `/ru/partners` (recruitment), `/ru/assist` (Route Check), provider cards в `lib/providers/registry.ts`.

### 6.2 Как community-сигналы улучшают matching

| Сигнал | Использование |
|--------|---------------|
| `outdated` на program X | Понизить confidence wizard result; не слать lead на closed route |
| `practice_note` из Telegram | Теги для provider categories (translation, tax) |
| Post-provider rating | `quality_score` в ranking (MONETIZATION §3.3) |
| Corridor traffic | Приоритет recruitment в `PartnerRecruitmentBanner` |

### 6.3 Route Check quality

- Intake form уже на `/ru/assist` с `getAssistCountryOptions()` из registry
- Phase 3: PDF строится из `buildCorridorFacts(slug)` + wizard session
- Community: FAQ из топ-вопросов чата → блок в PDF «Что спрашивали в чате» (анонимизировано)

### 6.4 Этика (критично для legal vertical)

- UI: «Партнёры доступны для этого шага», не «лучший юрист»
- Sponsored placement label
- Community отзывы ≠ юридическая рекомендация

---

## 7. Gamification и репутация

### 7.1 Что делать

- **Публичный changelog** как «игра» прозрачности — кто обновил D8 income
- **Corridor helper** badge за 3+ approved flags с source
- **Streak** для contributor: неделя с ≥1 verified refresh (личный dashboard, не публичный leaderboard)
- **«Спроси в чате»** с deep link — социальное доказательство («127 человек в чате по Португалии»)

### 7.2 Чего НЕ делать

| Паттерн | Почему опасно |
|---------|---------------|
| Публичный leaderboard юристов | Этика + токсичная конкуренция |
| Karma за downvote других пользователей | Охота на ведьм |
| Очки за посты в Telegram | Спам, низкое качество |
| Уровни «Эксперт ВНЖ» без верификации | Юридический риск |
| NFT / crypto rewards | Аудитория не та; регуляторика |
| Обязательная регистрация для чтения | Ломает SEO и trust |

**Принцип:** репутация привязана к **верифицируемым действиям** (approved proposal, moderated helpful answer), не к объёму болтовни.

---

## 8. Метрики

### Phase 0 (Telegram + ручной triage)

| Тип | Метрика | Цель (ориентир) |
|-----|---------|-----------------|
| Leading | `community_join_click` / 1000 corridor PV | ≥2% |
| Leading | DAU/MAU Telegram | ≥15% |
| Leading | % join с wizard/news deep link | ≥40% |
| Lagging | Время от вопроса в чате до ссылки на Emigro page | <24ч |
| Lagging | Route Check заявки / мес | рост 10% m/m |

### Phase 1 (on-site feedback)

| Тип | Метрика | Цель |
|-----|---------|------|
| Leading | Feedback submit rate (статьи с >500 PV) | ≥1.5% |
| Leading | outdated / helpful ratio | мониторинг |
| Leading | Median time signal → triaged | <72ч |
| Lagging | % top-20 страниц с resolved signal за 30д | ≥25% |
| Lagging | Bounce rate на guide после баннера «обновляем» | не растёт |

### Phase 2 (contributor API)

| Тип | Метрика | Цель |
|-----|---------|------|
| Leading | Active contributors / corridor | ≥2 |
| Leading | Proposals approved / week | ≥5 (Portugal) |
| Leading | % updates from flags vs cold gaps | ≥30% |
| Lagging | `last_verified` age median (facts API) | <45 дней |
| Lagging | Duplicate proposal rate | <20% |

### Phase 3 (marketplace)

| Тип | Метрика | Цель |
|-----|---------|------|
| Leading | Provider quality_score median | ≥7/10 |
| Leading | Route Check NPS | ≥40 |
| Lagging | Provider dispute rate | <10% |
| Lagging | Contributor pool € / мес | >0 (pilot) |

**Instrument:** расширять `lib/analytics/events.ts`; дашборд — Metabase/Supabase; corridor dimension из `CORRIDOR_REGISTRY`.

---

## 9. Что НЕ строить пока (explicit deferrals)

| Отложить | До когда | Причина |
|----------|----------|---------|
| Полноценный форум на сайте | Phase 3+ | Telegram достаточно; дублирование модерации |
| Мобильное приложение | — | Web + Telegram покрывают аудиторию |
| Публичные профили пользователей | Phase 3 | GDPR, модерация |
| Денежные награды за upvote | — | Fraud, нет бюджета |
| Автоматический publish из Telegram | Phase 2+ | Нет official source |
| Provider self-serve portal + CPC auction | Phase 3 | Нужен объём лидов; manual CPL сначала |
| Мультиязычное community (EN) | После RU product-market fit | Corridor-first = RU |
| Discord / отдельные чаты по 10 странам | Phase 1 | Дробит аудиторию; топики в одном TG |
| AI-чатбот ответы без human escalation | — | Юридический риск |
| User-generated guides без review | — | SEO penalty + misinformation |
| Blockchain attribution | — | Нет product value |

---

## 10. Первые 30 дней — 7 действий

| # | Действие | Effort | Impact | Детали |
|---|----------|--------|--------|--------|
| 1 | Структура Telegram: топики по 5 приоритетным коридорам (PT, ES, DE, FR, PL) + закреп | S | H | Ссылки на `/ru/{segment}`, digest, wizard |
| 2 | Deep link helper: `CommunityJoinButton` + wizard results CTA с `?corridor=` | S | H | Расширить `source` в analytics |
| 3 | Временная форма «Устарело» (Typeform) + ссылка в footer гайдов | S | M | Валидирует volume до БД |
| 4 | Еженедельный digest → пост в чат (шаблон из cron output) | S | M | Автоматизируется из news pipeline |
| 5 | Документ triage SOP (1 стр): кто что делает с сигналом | S | H | Founder 30 мин/нед max |
| 6 | Набор 3 corridor scouts (PT, ES, DE): доступ read API + CONTRIBUTOR_PROMPT | M | H | Первые `refresh` proposals |
| 7 | Baseline метрики: dashboard `community_join_click`, wizard→chat funnel | M | M | Supabase events или Plausible |

**Effort:** S = <4ч, M = 1–2 дня.

**Фокус коридоров:** Portugal первый (`ru-speaking-to-portugal`) — максимальная глубина контента, Assist, Route Check.

---

## Приложение A — альтернатива формату community

| Формат | Плюсы | Минусы | Вердикт |
|--------|-------|--------|---------|
| **Telegram only** | Низкий порог, привычно RU | Сигналы не структурированы | База, не финал |
| **On-site forum** | SEO, структура | Модерация, пустой старт | Отложить |
| **Hybrid (рекомендуется)** | TG живость + site signals | Два места | **Выбрать** |

---

## Приложение B — связь с существующими документами

- `docs/CORRIDOR_STRATEGY.md` — corridor-first; community обслуживает коридоры, не наоборот
- `docs/MONETIZATION.md` — applicants free; contributor revshare от providers
- `docs/ARCHITECTURE.md` — knowledge flags, suggest correction, changelog
- `docs/API_CONTRIBUTOR_GUIDE.md` — write path для агентов
- `docs/YANDEX_SEO.md` — свежесть контента как ranking factor

---

## Резюме для команды

1. **Community Emigro = trust layer для corridor data**, не форум.
2. **Гибрид feedback (полезно + устарело)** → очередь → contributor API, founder только на T3+.
3. **Phase 0 почти без кода** — Telegram structure + deep links + ручной triage.
4. **Open read API уже на main** — масштабировать write через tiers и немонетарные награды.
5. **Marketplace synergy** через quality_score и актуальные facts, не через рекламу в чате.
6. **Избегать** leaderboard, pay-to-post, UGC без source.
