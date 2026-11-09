# Emigro — онбординг для ведения сервиса

Дата среза: 2026-11-08. Оператор: Павел. Репозиторий: `git@github.com:marfa77/emigro.git`. Рабочая копия: `/Users/pavelveselov/Projects/emigro`.

Этот файл — операционная карта. **Значения паролей здесь нет специально.** Они уже лежат в трёх хранилищах. Копирование в markdown, чат или коммит = утечка на GitHub при следующем пуше. Клод читает значение в момент работы и не печатает его.

Короткий вход, который Claude Code подхватывает сам: [`CLAUDE.md`](../CLAUDE.md) в корне.

---

## 0. Кто такой Emigro

Бесплатный для заявителя навигатор по маршрутам ВНЖ и гражданства. Коридоры: русскоязычные (RU/BY/UA/KZ) → Европа и другие страны; LATAM → Испания/Португалия (`/es`); франкофония Maghreb/SN → Франция (`/fr`).

Деньги — не с заявителя за «открыть результат», а с сестринских продуктов и Assist (см. §12). Юридических советов сайт не даёт. Порог, срок, адрес консульства без официального источника не публиковать.

Не путать с однофамильцами: Emigro.co (необанк), Emigro UG / Intermigro, Emigro Consulting (Доха), Emigro Pay, K-pop PIXID, recruiting PIXID. Бренд-вотч смотрит домены продуктов и Threads-хендлы, не фамилию оператора.

Стек: Next.js 14 App Router, Tailwind, Supabase Postgres (`emigro_*` таблицы, проект общий с Garmin wellness), json-logic-js. Прод сайта — Vercel. Кроны контента и Threads — systemd на VPS.

---

## 1. Жёсткие запреты

1. **Ферма Threads.** Хост `37.27.0.210`, каталог `/opt/emigro/lib/threads`, банки, daily/invest юниты. `deploy_vps_from_git.sh` их пропускает. `git reset --hard` по этим путям запрещён. `farm_protect.sh unlock` — только из чата farm HQ. Банк на 100 дней не переписывать; точечные правки Sol — только если Павел явно про ферму.
2. **Один прод-деплой.** `npm run deploy:check` → коммит → `git push origin main` → ждать Ready (`npm run deploy:status`). Не запускать `vercel --prod` / `npm run deploy:cli` в том же заходе. Два билда одного коммита гоняются и падают по таймауту.
3. **Сломанный билд не пушить.** Известные TS-ошибки «починить на проде» нельзя.
4. **Гайды целиком.** Черновик из чата или `_user-drafts` публиковать один к одному. Не делать «выжимку». Ошибки фактов — короткой **Nota Emigro (fact-check)** и мягкими сносками, не вырезанием разделов.
5. **Фактчек до коммита.** Пороги €/IPREM/SMI, Шенген ≠ ВНЖ, адреса консульств, двойное гражданство, CCSE/DELE, что идёт в стаж гражданства. Источник первый: BOE, exteriores.gob.es, Justicia, Cervantes, портал страны. Блог юриста — вторичен. Не выдумывать норму.
   Жёсткие провалы LATAM→ES: estancia por estudios = **0%** для национальности art. 22 (50% — только larga duración-UE); no lucrativa inicial = **консульство**, не турист→NL; nómada digital = **UGE и/или консульство**; «6/10 месяцев» отсутствия — не правило art. 22; уличный адрес консульства сверять с живой страницей.
6. **Монетизация в том же шипе**, что новый хаб или pillar. Пустой блок «Sin Assist todavía» не оставлять.
7. **Тонкие бытовые заметки Португалии** отдельными `/notes` не публиковать (возврат товара, одна новость про бесплатный STCP, сломанный Via Verde, смена morada NIF одним абзацем). Сложить в системный гайд или отказ.
8. **Исходящие.** Черновик показать. Отправлять только после «отправляй» / «send» / «да, отправь». Касается почты, Telegram, Slack, WhatsApp, комментариев PR.
9. **Cursor.** Не чистить `~/.cursor`, транскрипты, кэши Application Support.
10. **Секреты.** Не коммитить `.env`, `.env.local`, `.env.production`, `parser/.env`, `*.pem`, service account JSON, session Telegram (`parser/tg.session`). `.env.production` в репозитории **не** в `.gitignore` — не добавлять его в коммит и не открывать в чат.

---

## 2. Карта поверхностей

Канон сайта: `https://www.emigro.online` (`emigro.online` → www). Локально `http://localhost:3000` редиректит на `/ru`.

| Хост | Что это |
|------|---------|
| `www.emigro.online` | Хабы, визарды, pillar-гайды, новости, Assist, invest |
| `porto.emigro.online` | Канон сателлита Португалии: хаб, `/notes`, теги, календарь |
| `portugal.emigro.online` | Legacy, 301 на тот же path на porto |
| `spain.emigro.online` | Сателлит Испании (Валенсия) |
| `italy.emigro.online` | Сателлит Италии |
| `thailand.emigro.online` | Сателлит Таиланда |
| `www.emigro.online/satellite/{country}/*` | 301 на поддомен |

Локали и входы:

| Путь | Аудитория |
|------|-----------|
| `/ru` | Русскоязычные. Золотой origin-хаб: `/ru/rossiyane`. Ещё `/ru/ukraine` |
| `/ru/[country]` | Коридор страны: лендинг, wizard, results, programs, digest |
| `/ru/guides/[slug]` | Pillar-гайды |
| `/ru/wizard`, `/ru/portugal` | Общий и португальский визард |
| `/ru/news`, `/ru/news/feed.xml` | Новости |
| `/ru/assist`, `/ru/route-check` | Assist: подбор €0, Route Check €129, сопровождение €100/ч |
| `/ru/invest` | Инвестиционные маршруты |
| `/ru/role-radar` | Лендинг Role Radar |
| `/es`, `/es/{uy,ec,pe,cl,py,co,…}`, `/es/guides`, `/es/wizard`, `/es/assist` | LATAM → ES/PT, испанский регистр |
| `/fr`, `/fr/{maroc,algerie,tunisie,senegal,france}` | Франкофония |
| `/en/assist`, `/en/invest` | Английские входы Assist/invest |
| `/admin` | Ops: topics, digest, leads, stats, referrals, corridors. Логин = `EMIGRO_ADMIN_SECRET` |
| `/llms.txt` | Слой для не-Google агентов. Для Google это не рычаг ранжирования |

Четыре сателлита в `llms.txt` обязательны: PT, ES, IT, TH.

Сестринские продукты (не этот репозиторий):

| Продукт | Куда ведём | Когда |
|---------|------------|--------|
| UniPrep2Go | `https://uniprep2go.study` | Гражданство / CCSE / civics / Anki. Не на банк/налог/Beckham |
| Prep2Go | `https://www.prep2go.study` | CIPLE, DELE, timed mocks. PT-поверхности. NL: `inburgering.prep2go.study` |
| Role Radar | `https://t.me/letsfinddreamjob_bot`, лендинг `/ru/role-radar` | Работа, DN, удалёнка |
| Emigro Assist | `/ru/assist`, `/es/assist`, `/fr/assist` | Результат визарда и «следующий шаг» |

UTM: `utm_source=emigro`, medium по поверхности, campaign, content = slug. Для `/llms.txt`: `utm_source=llm&utm_medium=llms.txt`.

---

## 3. Репозиторий и локальный запуск

```bash
cd /Users/pavelveselov/Projects/emigro
cp .env.example .env.local   # если локального файла ещё нет
npm install
npm run dev                  # http://localhost:3000
```

Ветка прода: `main`. Vercel Git собирает Production с `main`.

Полезные каталоги:

| Путь | Зачем |
|------|--------|
| `app/` | Роуты App Router |
| `content/guides/{ru,es,fr}/` | Markdown pillar-гайдов |
| `lib/` | Движок, SEO, сателлиты, Threads, новости |
| `lib/satellite/{portugal,spain,italy,thailand}.ts` | Хосты и источники сигналов |
| `supabase/migrations/` | Единственный способ менять схему |
| `deploy/systemd/` | Юниты и таймеры VPS |
| `deploy/*/run_scheduled.sh` | Что реально запускает таймер |
| `parser/` | Telegram-парсер Португалии. Секреты в `parser/.env`, сессия `parser/tg.session` |
| `docs/` | Операционные доки (этот файл — вход) |
| `.cursor/rules/` | Правила шипа: фактчек, полный гайд, SEO, деплой, ферма |
| `public/` | OG, картинки заметок, IndexNow `{key}.txt` |

Проверки перед шипом индексной страницы:

```bash
npm run deploy:check          # portugal:assert-note-assets + next build
npm run check:aeo             # паритет AEO
npm run validate:site-consistency
```

Картинки community-note должны быть в git. Иначе следующий Git-деплой отдаёт 404: `npm run portugal:assert-note-assets` это ловит.

---

## 4. Явки — где лежат пароли

Три хранилища. Одно и то же имя переменной на Vercel и на VPS может расходиться. Перед кроном смотреть **то хранилище, где крутится процесс**.

| Хранилище | Путь / место | Кто читает |
|-----------|----------------|------------|
| Локальный ноут | `/Users/pavelveselov/Projects/emigro/.env.local` (gitignored) | `npm run dev`, ручные скрипты |
| Vercel Production | проект `emigro`, team `team_9d1721TQ0bhrn7oMmjTqd9L2`, project `prj_1FFYkvhu4plKh2ARgkewZgwFwIF9` | Сайт, Vercel crons |
| VPS | `/opt/emigro/.env` (chmod 600), парсер `parser/.env` | systemd-таймеры, Threads, новости, YouTube |
| Пример без значений | `.env.example`, `parser/.env.example` | Только имена |
| Дашборды | Supabase, Meta, Telegram, Google, Yandex | Ротация и выпуск новых ключей |

Как взять значение, не светя его в чат:

```bash
# локально — смотреть у себя в терминале, в ответ пользователю не вставлять
grep '^ИМЯ_ПЕРЕМЕННОЙ=' .env.local

# Vercel — интерактивно, вывод не пересылать в git
npx vercel env pull .env.vercel.tmp --environment=production
# после работы файл удалить, не коммитить

# VPS
ssh -i ~/.ssh/id_ed25519_github root@37.27.0.210
# на сервере: grep '^ИМЯ=' /opt/emigro/.env
```

SSH-ключ ноутбука: `~/.ssh/id_ed25519_github`. На VPS git ходит ключом `/root/.ssh/id_ed25519_github`. Пользователь SSH: `root`. Хост: `37.27.0.210`. Каталог: `/opt/emigro`. Репозиторий на сервере: `git@github.com:marfa77/emigro.git`.

Публичные идентификаторы (это не секреты, они уже в репозитории):

| Что | Значение |
|-----|----------|
| Supabase project ref | `wcwadwcjqutdxwbrkyai` |
| Supabase URL | `https://wcwadwcjqutdxwbrkyai.supabase.co` |
| Регион БД | `ap-south-1` |
| Дашборд | https://supabase.com/dashboard/project/wcwadwcjqutdxwbrkyai |
| Prep2Go Supabase (источник новостей, другой проект) | `zvydotrkmfzmamvyrfhv` |
| GA4 | `G-9PYSNNXYLY` |
| Яндекс.Метрика | `110252231` |
| GSC property | `sc-domain:emigro.online` |
| Vercel project / team | `prj_1FFYkvhu4plKh2ARgkewZgwFwIF9` / `team_9d1721TQ0bhrn7oMmjTqd9L2` |
| GitHub | `marfa77/emigro` |

IndexNow-ключи публичные по задумке: файл `public/{INDEXNOW_KEY}.txt` обязан отдаваться сайтом. Актуальные строки — в `.env.example` (`INDEXNOW_KEY`, `INDEXNOW_LEGACY_KEY`). Legacy-ключ не удалять: Bing www может быть привязан к нему.

### 4.1 Инвентарь переменных

Пустая ячейка в `.env.example` значит «значение только в хранилище». Ниже — зачем ключ и где он обязан быть.

**База и сайт**

| Переменная | Где нужна | Зачем |
|------------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + VPS + local | URL проекта `wcwadwcjqutdxwbrkyai` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | Публичный ключ клиента |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + VPS | Серверная запись. В браузер и в гайд не попадает |
| `SUPABASE_DB_PASSWORD` | local (и там, где гоняют `db:backup`) | Dashboard → Project Settings → Database. Для `npm run db:backup` |
| `NEXT_PUBLIC_SITE_URL` | local `http://localhost:3000`; на проде канон | |
| `EMIGRO_PUBLIC_SITE_URL` | VPS/сервер | `https://www.emigro.online`, когда публичный URL ещё localhost |
| `CRON_SECRET` | Vercel + VPS | `Authorization: Bearer` на `/api/cron/*` и revalidate |
| `EMIGRO_ADMIN_SECRET` | Vercel | Логин `/admin` и `Authorization: Bearer` на `/api/v1/admin/*`. Fallback для revalidate |
| `COMMUNITY_INGEST_API_KEY` | Vercel и `parser/.env` одним значением | `POST /api/v1/ingest/community-signals` |
| `EMIGRO_ANALYTICS_TIMEZONE` | Vercel | Границы «сегодня». Сейчас `Europe/Lisbon` |
| `PORTUGAL_SATELLITE_USE_SUBDOMAIN` | Vercel `true` (зашито в `vercel.json`) | Локально можно `false` |
| `SPAIN_SATELLITE_USE_SUBDOMAIN` | то же | |
| `THAILAND_SATELLITE_USE_SUBDOMAIN` | Vercel | |
| Италия | флаг поддомена в `lib/site-url` | Не выключать на проде |

**LLM**

| Переменная | Зачем |
|------------|--------|
| `GOOGLE_API_KEY` | Gemini: новости, фактчек, черновики. Модели по умолчанию `gemini-2.5-pro` / `gemini-2.5-flash` |
| `OPENROUTER_API_KEY` | Голос историй, SEO-аудит, Milan/ChatPorto (Claude Sonnet / Haiku через OpenRouter) |
| `OPENAI_API_KEY` | YouTube Shorts / Whisper-контур, если включён |
| `EMIGRO_SEO_AUDIT_MODEL` | По умолчанию Grok через OpenRouter |

**Telegram**

Три роли. Токены по возможности разные. Не подставлять news-токен в chat-бота.

| Переменная | Куда |
|------------|------|
| `EMIGRO_CHAT_BOT_TOKEN` | `@emigro_chat_bot`. Визард `?start=`, `/stats`. Алиас legacy: `EMIGRO_BOT_TOKEN` |
| `EMIGRO_NEWS_BOT_TOKEN` | Публикация в `@Emigro_news`. Legacy fallback: `TELEGRAM_BOT_TOKEN` |
| `EMIGRO_NEWS_TELEGRAM_CHANNEL` | `@Emigro_news` |
| `TELEGRAM_ADMIN_CHAT_ID` | Кто может `/stats`. Числовые id через запятую |
| `TELEGRAM_PRIVATE_CHAT_ID` | Личка владельца: лиды, фактчек, шорты, соцстат. Шлёт news-бот |
| `TELEGRAM_WEBHOOK_SECRET` | Заголовок `X-Telegram-Bot-Api-Secret-Token` на `POST /api/telegram/webhook` |
| `EMIGRO_PORTO_CHAT_ID`, `EMIGRO_VALENCIA_CHAT_ID`, `EMIGRO_MILAN_CHAT_ID`, `EMIGRO_PHUKET_CHAT_ID`, `EMIGRO_BERLIN_CHAT_ID` | id городских чатов. Не класть сюда инвайт `t.me/+…` |
| `EMIGRO_VALENCIA_NEWS_CHAT` | `@valencia_echat` |
| `EMIGRO_ITALY_NEWS_CHANNEL` | Сейчас Milan-чат `@milan_echat`. `@emigro_Italy` на паузе |
| `MILAN4AT_BOT_TOKEN`, `MILAN4AT_WEBHOOK_SECRET`, `MILAN4AT_NOTIFY_CHAT_ID` | Отдельный бот черновиков `@milan_4at`. В чат группы бот не пишет |
| `CHATPORTO_NOTIFY_CHAT_ID` | Куда DM по `@chatporto`. В примере указан id; сверять с живым `.env`, не с комментарием |
| `EMIGRO_NEWS_LIGHTNING` | `#молния` выключена, пока не `1`. На VPS таймер тоже может быть выключен |
| `EMIGRO_GUIDE_TELEGRAM_AUTO_PUBLISH` | Автопост гайда в канал выключен, пока не `1` |

После смены токена chat-бота: `npx tsx scripts/set-telegram-webhook.ts`.

**Threads (Meta) — три личности, токены не смешивать**

| Набор | Аккаунт | Куда писать |
|-------|---------|-------------|
| `THREADS_APP_ID`, `THREADS_APP_SECRET`, `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN`, `THREADS_REDIRECT_URI`, `THREADS_USERNAME` | бренд `@emigro_assist` | Только VPS, когда `threads:whoami` совпал с `THREADS_USERNAME`. `THREADS_AUTO_PUBLISH=1` только там |
| `THREADS_INVESTMENT_*` | `@emigro_invest` | Отдельные ключи. В первичные `THREADS_*` не копировать |
| `THREADS_PT_SAT_*` | `@emigro_portugal` | Сателлит PT |
| `THREADS_IT_SAT_*` | `@emigro_italy` | Сателлит IT |

Длинный токен ~60 дней. Обновление: `npm run threads:refresh-token -- --write` на VPS. Таймер `emigro-threads-refresh` — понедельник 05:15 UTC.

Лимит бренда: не больше 1 root-поста в лиссабонский день (guide + satellite + lightning, файл day-budget). Ответы на комменты: `THREADS_ENABLE_REPLY_APPROVALS` по умолчанию 0. Таймер `emigro-threads-replies` должен оставаться **masked** — автоответов нет.

**Google / Yandex / соцстат**

| Переменная | Зачем |
|------------|--------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` или `GOOGLE_APPLICATION_CREDENTIALS` | Search Console в `/admin/stats`. На VPS для шортов часто файл `/opt/emigro/data/gcs-upload-key.json` |
| `GSC_SITE_PROPERTY` | `sc-domain:emigro.online` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | meta Search Console |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Карта в заметках. Без ключа — embed |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | `110252231` |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | meta Вебмастера. Не выдумывать |
| `INDEXNOW_KEY`, `INDEXNOW_LEGACY_KEY` | публичные ключи, файлы в `public/` |
| `PING_GOOGLE_SITEMAP` | `1` |
| `EMIGRO_YOUTUBE_CLIENT_ID/SECRET/REFRESH_TOKEN` | Загрузка Shorts на `@Emigro_news`. Выпуск: `npm run youtube:oauth-setup` |
| `EMIGRO_YOUTUBE_SHORTS_ENABLED`, `EMIGRO_YOUTUBE_UPLOAD_ENABLED` | Пока не `1` — не грузить |
| `PEXELS_API_KEY` | B-roll шортов. Без ключа — градиент |
| `FACEBOOK_ACCESS_TOKEN` | Соцстат, по желанию |
| `YOUTUBE_API_KEY` | Счётчик подписчиков, если нет OAuth |

**Prep2Go как источник новостей** (читать, не писать в их БД): `PREP2GO_SUPABASE_URL`, `PREP2GO_SUPABASE_SERVICE_ROLE_KEY` или anon. Пишем только в `emigro_news_digests` своего проекта.

**Парсер Telegram** (`parser/.env`): `TG_API_ID`, `TG_API_HASH` с https://my.telegram.org , плюс `COMMUNITY_INGEST_API_KEY`. Сессия `parser/tg.session` — секрет, в git не класть.

### 4.2 Куда ходить человеком

У Клода нет пароля от этих кабинетов, пока Павел не залогинен в браузере или в CLI. Не просить прислать пароль в чат. Просить открыть кабинет или положить ключ в нужное хранилище.

| Кабинет | URL | Что там |
|---------|-----|---------|
| GitHub | https://github.com/marfa77/emigro | `main`, Actions |
| Vercel | проект emigro, team id выше | домены, env, деплои |
| Supabase | дашборд `wcwadwcjqutdxwbrkyai` | SQL только SELECT; схема — миграциями |
| Google AI Studio | https://aistudio.google.com/ | `GOOGLE_API_KEY` |
| OpenRouter | https://openrouter.ai/ | `OPENROUTER_API_KEY` |
| Telegram BotFather | `@BotFather` | токены ботов |
| my.telegram.org | https://my.telegram.org | `TG_API_ID` / hash парсера |
| Meta for Developers | приложение Threads | app id/secret, redirect URI |
| Search Console | property `sc-domain:emigro.online` | покрытие, sitemap |
| Яндекс.Вебмастер | https://webmaster.yandex.ru/ | IndexNow, обход по счётчикам |
| Яндекс.Метрика | счётчик `110252231` | |
| GA4 | `G-9PYSNNXYLY` | |

Домены на Vercel-проекте `emigro`: `www.emigro.online`, `emigro.online`, `porto.emigro.online`, `portugal.emigro.online`, `spain.emigro.online`, `italy.emigro.online`, `thailand.emigro.online`. Новый хост — Settings → Domains, потом код сателлита. Чеклист запуска: `docs/SATELLITE_REQUIREMENTS_CHECKLIST.md`, скилл `.cursor/skills/launch-satellite`.

---

## 5. Деплой сайта

Правило из `docs/DEPLOY.md` и `.cursor/rules/vercel-deploy.mdc`.

Обычный путь:

```bash
npm run deploy:check
# коммит — только если Павел просил
git push origin main
npm run deploy:status    # ждать Ready. Building не перебивать
```

Дальше открыть **живой** URL, не preview и не зелёную галочку Vercel. Сверить title, meta, текст. Если сателлит читает те же данные — открыть и его.

Аварийный CLI (Git-интеграция лежит, или Павел просит деплой без нового пуша этого же коммита):

```bash
npm run deploy:status     # если Production уже Building — стоп
npm run deploy:cli        # локальный build, затем vercel --prod
```

`staticPageGenerationTimeout` в `next.config.mjs` = 180 с. Если в логах снова `static-page-generation-timeout` на `/ru/[country]`, поднимать таймаут или резать SSG. Не спамить редеплоями.

CLI: `vercel` ≥ 58. В `.vercel/project.json` есть `projectId` и `orgId`. Каталог `.vercel` в git не коммитить.

Игнор билда: `scripts/vercel-ignore-build.sh` (см. `vercel.json`).

После шипа денег-URL: IndexNow `npm run seo:indexnow`, переобход в GSC и Яндекс.Вебмастере. Памятка: `docs/YANDEX_SEO.md`.

---

## 6. VPS

```bash
ssh -i ~/.ssh/id_ed25519_github root@37.27.0.210
cd /opt/emigro
```

Деплой кода на VPS с ноутбука — `scripts/deploy_vps_from_git.sh` (с `main`, не rsync всей машины). Скрипт **не затирает** `.env`, `parser/.env`, `parser/out`, `node_modules`, `.next`, `.cursor` и всё дерево фермы Threads. Если на сервере есть `/opt/farm-lock/LOCKED`, юниты `emigro-threads-*` в systemd не перезаписываются.

На VPS после выкладки скрипт делает `npm ci`. Логи таймеров: `deploy/<имя>/logs/`.

Полезное:

```bash
systemctl list-timers 'emigro-*'
systemctl status emigro-prep2go-news.timer
journalctl -u emigro-prep2go-news.service -n 80 --no-pager
tail -f /opt/emigro/deploy/prep2go-news/logs/scheduled-$(date +%Y%m%d).log
```

Ручной прогон — `systemctl start emigro-<имя>.service`, не править таймер «на пять минут раньше» без просьбы.

**Не включать:** `emigro-volatile-guides-factcheck` (выключен 2026-10-19), `emigro-threads-replies` (masked).

### 6.1 Vercel crons (сайт)

В `vercel.json`, авторизация Bearer `CRON_SECRET`:

| Путь | Расписание (UTC) |
|------|------------------|
| `/api/cron/portugal-community` | 06:05 ежедневно |
| `/api/cron/portugal-note-images` | 07:30 |
| `/api/cron/spain-note-images` | 07:45 |
| `/api/cron/news-bot-push` | каждый час в :20 |
| `/api/cron/stats-snapshot` | 06:20 |

Prep2Go-импорт **убран** из Vercel cron, чтобы не было двойного импорта. Живой пайплайн — VPS.

### 6.2 Systemd (контент и соцсети)

Часы как в unit-файле.

| Timer | Когда | Что |
|-------|--------|-----|
| `emigro-portugal-community` | 07:00 UTC | Заметки Португалии |
| `emigro-spain-community` | 07:30 UTC | Испания |
| `emigro-italy-community` | 06:30 UTC | Италия |
| `emigro-thailand-community` | 06:00 UTC | Таиланд |
| `emigro-prep2go-news` | 09:00 UTC | Импорт новости Prep2Go → Gemini → черновик владельцу → `@Emigro_news` после ✅ |
| `emigro-youtube-shorts` | 09:15 UTC | Shorts после импорта новостей |
| `emigro-portugal-news-stories` | 10:00 UTC | Сториз |
| `emigro-news-lightning` | 11, 13, 15, 17, 19 UTC | `#молния`, если флаг включён. Не сваливать пачкой в 10:00 |
| `emigro-news-soft-promo` | Пн–Пт 09:00 UTC | Скрипт сам держит ≤1 пост в неделю |
| `emigro-news-guide-promo` | 12:30 UTC | Промо гайда |
| `emigro-chatporto-scan` | 10:00 UTC | Скан `@chatporto` → черновик в личку, в группу не постит |
| `emigro-milan4at-scan` | 07:00 и 19:00 UTC | Скан Milan/Como |
| `emigro-portugal-porto` | 10, 14, 18 Lisbon | Канал Порту |
| `emigro-portugal-outdoor` | несколько слотов Lisbon | Ивенты |
| `emigro-geo2go-events` | 11:30 Lisbon | |
| `emigro-valencia-outdoor` | 12:30 | |
| `emigro-italy-lepta` | будни 09–17:30, выходные 11 и 16:30 Rome | |
| `emigro-italy-education` | 09, 13, 17:30 Rome | |
| `emigro-italy-outdoor` | 10:30 Rome | |
| `emigro-outdoor-digest` | Пт 08:00 | Дайджест выходных |
| `emigro-threads-daily` | разное утро Asia/Dubai, см. unit | Бренд `@emigro_assist`. Ферма. Не переписывать |
| `emigro-threads-satellites` | 14:30 Asia/Dubai | |
| `emigro-threads-pt-sat` | ~11:00 Lisbon | `@emigro_portugal` |
| `emigro-threads-it-sat` | ~12:00 Rome | `@emigro_italy` |
| `emigro-threads-investment` | 12:00 Asia/Dubai | `@emigro_invest` |
| `emigro-threads-sos` | Вт 12:00 Lisbon | |
| `emigro-threads-refresh` | Пн 05:15 UTC | Ротация длинного токена |
| `emigro-threads-replies` | masked | Не включать |
| `emigro-volatile-guides-factcheck` | disabled | Не включать |

Доки кронов: `docs/PREP2GO_CRON.md`, `docs/PORTUGAL_CRON.md`, `docs/SPAIN_CRON.md`, `docs/THAILAND_CRON.md`, `docs/YOUTUBE_SHORTS_CRON.md`, `docs/PORTUGAL_NEWS_STORIES_CRON.md`, `docs/THREADS_API.md`.

---

## 7. База

Проект Supabase `wcwadwcjqutdxwbrkyai`. Таблицы с префиксом `emigro_`. Рядом в том же проекте живёт Garmin wellness — чужие таблицы не трогать.

```bash
supabase link --project-ref wcwadwcjqutdxwbrkyai
npm run db:backup -- --tag before-что-то   # нужен SUPABASE_DB_PASSWORD
npm run db:push
npm run db:types                            # если менялась схема
```

Схема и сиды — только файл в `supabase/migrations/` + `db:push`. SQL Editor на проде для `UPDATE`/`DELETE` не использовать. `SELECT` для диагностики можно. Срочный hotfix в дашборде сразу оформить миграцией, иначе git и прод разъедутся.

PITR не куплен. Потеря суток считается терпимой. Снимки: `docs/BACKUPS.md`. Каталог `backups/` в git не коммитить.

Prep2Go (`zvydotrkmfzmamvyrfhv`) — чужой проект, только чтение `news_digests`.

---

## 8. Как публиковать гайд

1. Тело пользователя сохранить целиком (все части, таблицы, чеклисты, бюджеты).
2. Фронтматтер Emigro: `seo_title`, `seo_description` ~145–160 (плохо >170), `excerpt`, `quick_answer`, `official_sources` ≥ 3, дата, CTA.
3. Claim inventory: пороги, Шенген vs ВНЖ, консульство vs страна, экзамены, гражданство.
4. Официальная страница в браузере. Сомнительное — Nota со статусом OK / soft / fixed и ссылкой. Непроверенное честно перечислить в Note, не додумывать.
5. SERP по первичному запросу (страна + residencia / nómada / nacionalidad / год). Title сильнее конкурентов: демоним, 2026, хук (2 años, nómada, Шенген). Для LATAM не копировать «2 años» на русские гайды гражданства Испании (там 10 лет).
6. Один видимый recap: `quick_answer`. Второй блок «Коротко для проверки маршрута» не добавлять. FAQPage только если на странице ≥ 5 настоящих вопросов.
7. CTA после тела: UniPrep на гражданство ES, Prep2Go на PT, Role Radar на работу/DN, Assist на визард и «следующий шаг». Копирайт на языке поверхности (`es` / `ru`).
8. Кластер: pillar ↔ первые 30 дней ↔ коридор ↔ сателлит. Если есть канон, частичное сравнение не плодить (`docs/GUIDE_CANNIBALIZATION.md`).
9. `npm run deploy:check`. Коммит по просьбе. Пуш. Дождаться Ready. Открыть живой URL.

Стандарт: `docs/SEO_GUIDE_STANDARD.md`, `docs/AEO.md`, `docs/ES_SEO_CORRIDOR.md`, `docs/GUIDE_REVIEW_TIERS.md`.

Контент новостей из Prep2Go: держаться фактов исходной статьи. Не добавлять универсальные чеклисты, инвесторские советы и алармизм. Автопубликации в канал нет: черновик в личку, канал после подтверждения владельца.

---

## 9. Админка и API

`/admin/login` сверяет введённое с `EMIGRO_ADMIN_SECRET` (cookie сессии после логина). Тот же секрет — Bearer для:

- `POST /api/v1/admin/news-topics`
- `POST /api/v1/admin/corridors/{slug}/digest`
- остальные `/api/v1/admin/**`

Кроны: `Authorization: Bearer $CRON_SECRET`.

Публичное чтение коридора (пример MVP):

- `GET /api/v1/corridors/ru-speaking-to-portugal`
- wizard sessions, evaluate, leads — см. `README.md` и `docs/SCHEMA_AND_API.md`

Ingest сигналов: `POST /api/v1/ingest/community-signals` с `COMMUNITY_INGEST_API_KEY`.

---

## 10. Боты, каналы, чаты

Публичные поверхности (не секреты):

| Имя | Роль |
|-----|------|
| `@Emigro_news` | Канал новостей |
| `@emigro_chat` | Обсуждение, привязано к каналу. CTA ведут сюда. Отдельной «вступай в группу» ссылкой не подменять |
| `@emigro_chat_bot` | Визард deep link, не URL дискуссии |
| `@emigro_assist` | Threads бренда |
| `@emigro_invest` | Threads инвестиций |
| `@emigro_portugal`, `@emigro_italy` | Threads сателлитов |
| `@milan_echat` | Итальянские посты (Lepta, education, outdoor) |
| `@valencia_echat` | События Валенсии |
| `@chatporto` | Чужой чат. Бот только читает и шлёт черновик владельцу |
| `@milan_4at` и связанные чаты | Soft-expert, черновик в личку, в группу не пишет |
| `@letsfinddreamjob_bot` | Role Radar |

Черновик человеку. В канал, чат, Threads и почту — только после явного «отправляй».

Такс-кокпит (личный контур Павла, не публичный продукт): `docs/TAX_COCKPIT.md`, команды `npm run tax:report`, `npm run tax:ask`. Не смешивать с гайдами сайта.

---

## 11. SEO / GEO / AEO — минимум на каждый шип

- Уникальные title/description. В первых ~40 символах title: запрос, 2026, демоним или имя визы или порог.
- Description совпадает с телом. Нет закрытой ES Golden Visa, нет IT Investor для RU, нет «паушаль 6–12%», нет «паспорт PT за 5 лет» как нормы по умолчанию.
- `dateModified` на фактчеке. Дата статьи — не дата проверки каждого порога.
- Паспорт аудитории в тексте (RU/BY/UA/KZ, ISO LATAM, Maghreb), не «для иностранцев».
- Город продукта сателлита: Порту/Норте, Валенсия, и т.д. Лиссабон на PT-сателлит не протекает.
- D7/D8/NLV inicial = консульство. ES nómada = UGE и/или консульство.
- Hreflang локали. Сателлит: self + `x-default`.
- Answer first: `quick_answer` в первом экране, 50–150 слов, цифры и орган (AIMA, BOE, IND).
- `robots.txt` не блокирует GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, YandexAdditionalBot, Google-Extended.
- FAQPage / HowTo только если разметка совпадает с видимым текстом.

---

## 12. Монетизация

Заявитель не платит за визард, сравнение и дорожную карту. На странице всё равно есть следующий шаг.

Приоритет CTA:

1. UniPrep2Go — гражданство, CCSE, язык.
2. Prep2Go — PT и DELE.
3. Role Radar — работа и DN.
4. Assist — результат визарда и «следующий шаг». Route Check €129, час сопровождения €100, подбор партнёра €0.

Не вешать UniPrep на страницы только про банк, налог или Beckham. Хелпер: `shouldShowUniPrepOnGuide`.

Политика партнёров (лиды): `docs/MONETIZATION.md`. Коротко: пилот бесплатный, контакт передаём после согласия человека, не скрейп логина из Telegram, не обещать объём лидов.

---

## 13. Что читать по задаче

| Задача | Файл |
|--------|------|
| Архитектура коридора (часть доков всё ещё «design phase» — живой код главнее) | `docs/ARCHITECTURE.md`, `docs/SCHEMA_AND_API.md` |
| Деплой | `docs/DEPLOY.md` |
| Бэкап | `docs/BACKUPS.md` |
| Португалия / Испания / Таиланд сателлит | `docs/PORTUGAL_SATELLITE.md`, `docs/SPAIN_SATELLITE.md`, `docs/THAILAND_SATELLITE.md` |
| Запуск новой страны | `.cursor/skills/launch-satellite/SKILL.md`, `docs/SATELLITE_REQUIREMENTS_CHECKLIST.md` |
| Threads | `docs/THREADS_API.md`, `docs/THREADS_INVESTMENT_VERTICAL.md`. Код на VPS может быть новее git |
| Фактчек очередь | `docs/FACTCHECK_BACKLOG.md`, `docs/FACTCHECK_OFFICIAL_SOURCES.md` |
| Аудит | `docs/AUDIT.md` |

Если док спорит с кодом или с `vercel.json` / unit-файлом — верить коду и unit-файлу, док поправить в том же заходе.

---

## 14. Как вести смену

1. Прочитать этот файл и `CLAUDE.md`.
2. Не печатать секреты. Нужен ключ — прочитать хранилище в шелле и использовать в команде.
3. Узкая правка. Чужой рефакторинг не пришивать.
4. Гайд / SEO / сателлит — чеклисты §8 и §11 в том же шипе.
5. Билд зелёный до пуша. Один прод. Потом живой URL.
6. Ферму не трогать, если задача не про ферму и не из farm HQ.
7. Наружу ничего не отправлять без «отправляй».
8. В конце смены: что изменено, какой URL проверен, что осталось непроверенным по фактам.
