import { corridorDigestPath, corridorLandingPath, corridorWizardPath, programPath } from "@/lib/corridor/paths";
import { guidePath, listGuides } from "@/lib/guides/load";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { getActiveNewsTopics, newsIndexPath } from "@/lib/news/topics";
import { newsArticleUrl, portugalSatellitePublicUrl, publicSiteUrl } from "@/lib/site-url";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";

type LlmsRow = { path: string; description: string };

function row(path: string, description: string): LlmsRow {
  return { path, description };
}

function llmsPathFromUrl(url: string): string {
  const origin = publicSiteUrl();
  return url.startsWith(origin) ? url.slice(origin.length) || "/" : url;
}

/** Build the short llms.txt (overview) from live data. */
export async function buildLlmsTxt(): Promise<string> {
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const guides = listGuides();
  const satelliteHub = llmsPathFromUrl(portugalSatellitePublicUrl("/"));
  const satelliteLlms = llmsPathFromUrl(portugalSatellitePublicUrl("/llms"));

  const transitHubLines = TRANSIT_HUBS.map(
    (hub) => `- ${hub.countryRu}: ${hub.path} — ${hub.tagline}`
  ).join("\n");

  const corridorLines = fullCorridors
    .map((t) => {
      const programs = ["D7, D8, воссоединение семьи", "digital nomad, non-lucrative", "VLS-TS, talent passport", "lavoro subordinato, elective residence", "Blue Card, Chancenkarte", "highly skilled migrant", "Швеция, Дания", "work permit, EU Blue Card, B2B IT", "employee card, EU Blue Card, živnost IT", "RWR Card, EU Blue Card, самозанятость"];
      const idx = ["portugal", "spain", "france", "italy", "germany", "netherlands", "scandinavia", "poland", "czechia", "austria"].indexOf(t.urlSegment);
      const hint = idx >= 0 ? programs[idx] : t.urlSegment;
      return `- ${t.countryRu}: ${t.sitePaths!.landing} — ${hint}`;
    })
    .join("\n");

  return `# Emigro

> Русскоязычный навигатор релокации в Европу. Wizard подбора маршрута ВНЖ, справочники по ${fullCorridors.length} EU-коридорам (${fullCorridors.map((t) => t.countryRu).join(", ")}), отдельный слой транзитных хабов, SEO-гайды и еженедельные новости. Основная аудитория — граждане РФ, РБ, UA, KZ. Поисковый фокус: Яндекс и Алиса AI.

## Основные страницы

- Хаб: /ru
- Глобальный wizard: /ru/wizard
- SEO-гайды (${guides.length}+ pillar-статей): /ru/guides
- Новости: /ru/news
- Новости по стране: /ru/news?country=portugal|spain|france|italy|germany|netherlands|scandinavia|poland|czechia|austria
- Хаб для граждан Украины: /ru/ukraine
- Срочный выезд из РФ: /ru/guides/kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby
- Легализация после выезда: /ru/guides/legalizatsiya-v-evrope-posle-vyezda-iz-rossii-2026
- Учебные визы Европы: /ru/guides/uchebnaya-viza-v-evropu-2026-student-visa
- Доход и деньги из России для ВНЖ: /ru/guides/podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026
- Консульская юрисдикция РФ/BY/KZ: /ru/guides/konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya
- Документы, апостиль, несудимость: /ru/guides/dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost

## Транзитные хабы (первый шаг, не EU-коридоры)

${transitHubLines}

## Коридоры (landing → wizard → digest → programs)

${corridorLines}

## Portugal satellite (практика, Лиссабон)

- Hub: ${satelliteHub} — заметки, лайфхаки, #aima #nif #аренда
- llms: ${satelliteLlms} — индекс для AI-агентов

Пример структуры коридора:
- Landing: /ru/portugal
- Wizard: /ru/portugal/wizard
- Справочник (digest): /ru/portugal/digest
- Программы: /ru/portugal/programs/{slug}

## Ключевые темы (ru-RU)

ВНЖ без работы, цифровой кочевник, пассивный доход, Blue Card, Chancenkarte, воссоединение семьи, отказ в визе, бюджет релокации, релокация с детьми, гражданство Португалии, CIPLE A2, AIMA, срочный выезд из России, безвизовые хабы, Бали временный хаб, Индонезия удалённая работа, транзитные хабы Грузия Турция Черногория Казахстан, легализация после выезда, учебная виза в Европу, доход из России для ВНЖ, консульская подача РФ/BY/KZ, апостиль, справка о несудимости

## Аудитория

- Язык: русский (ru-RU)
- Паспорта: RU, BY, UA, KZ
- Поиск: Яндекс, Алиса AI (не Google)

## Для AI-агентов

- Полный индекс: /llms-full.txt
- API contributor guide: GET /api/v1/meta/contributor-guide
- Ingest schema: GET /api/v1/meta/ingest-schema
- Meta enums: GET /api/v1/meta/requirement-types, /meta/program-types, /meta/countries, /meta/step-types, /meta/outcomes, /meta/corridors
- Facts API (RAG): GET /api/v1/facts/corridors, /facts/corridors/{slug}, /facts/programs/{slug}

## API

- POST /api/v1/hub/wizard/sessions
- POST /api/v1/hub/wizard/sessions/{id}/evaluate
- GET /api/v1/corridors/{slug}
- POST /api/v1/corridors/{slug}/wizard/sessions
- GET /api/v1/facts/corridors — список активных коридоров с метаданными
- GET /api/v1/facts/corridors/{slug} — факты коридора (программы, digest, last_verified)
- GET /api/v1/facts/programs/{slug} — факты программы (требования, источники, last_verified)

## Правила цитирования

1. Не юридическая консультация — направлять к консульству и лицензированным специалистам
2. Факты — с официальных источников (консульства, миграционные службы)
3. Новости содержат source_links с URL первоисточников
`;
}

const NEWS_URL_LIMIT = 200;

/** Build llms-full.txt body from the same sources as sitemap.ts. */
export async function buildLlmsFullText(): Promise<string> {
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const developingCorridors = topics.filter(
    (t) => t.status === "in_development" && t.corridorSlug && t.sitePaths?.landing
  );
  const guides = listGuides();
  const digests = await getPublishedNewsDigests();
  const recentNews = digests.slice(0, NEWS_URL_LIMIT);
  const portugalNotes = await getPublishedCommunityNotes("portugal");
  const tagSet = new Set<string>();
  for (const note of portugalNotes) {
    for (const t of note.hashtags) tagSet.add(normalizeHashtag(t));
  }

  const rows: LlmsRow[] = [
    row("/llms.txt", "Краткий обзор Emigro для AI-агентов"),
    row("/llms-full.txt", "Полный индекс URL Emigro для AI-агентов"),
    row("/ru", "Главная — хаб всех коридоров и транзитных направлений"),
    row("/ru/wizard", "Глобальный wizard подбора страны и маршрута ВНЖ"),
    row("/ru/guides", `SEO-гайды (${guides.length} pillar-статей по ВНЖ, хабам, бюджету)`),
    row("/ru/news", "Еженедельные новости по всем странам"),
    row("/ru/community", "Сообщество релокантов Emigro"),
    row("/ru/partners", "Партнёры и сервисы на маршруте"),
    row("/ru/contact", "Контакты Emigro"),
    row(llmsPathFromUrl(portugalSatellitePublicUrl("/")), "Portugal satellite — практика релокации в Лиссабоне"),
    row(llmsPathFromUrl(portugalSatellitePublicUrl("/llms")), "Portugal satellite llms index"),
    ...TRANSIT_HUBS.map((hub) =>
      row(hub.path, `${hub.countryRu} — транзитный хаб: ${hub.quickAnswer.slice(0, 120)}…`)
    ),
    ...topics.map((t) => row(newsIndexPath(t.urlSegment), `Новости: ${t.countryRu}`)),
  ];

  for (const topic of developingCorridors) {
    const slug = topic.corridorSlug!;
    rows.push(
      row(corridorLandingPath(slug), `${topic.countryRu} — коридор (в разработке)`),
      row(corridorDigestPath(slug), `Справочник ${topic.countryRu}`)
    );
  }

  for (const topic of fullCorridors) {
    const slug = topic.corridorSlug!;
    rows.push(
      row(corridorLandingPath(slug), `${topic.countryRu} — коридор релокации Emigro`),
      row(corridorWizardPath(slug), `Wizard ${topic.countryRu}`),
      row(corridorDigestPath(slug), `Справочник ВНЖ ${topic.countryRu}`)
    );
    const corridor = await getCorridorBySlug(slug);
    for (const p of corridor?.programs ?? []) {
      rows.push(row(programPath(slug, p.slug), `${topic.countryRu}: ${p.title_ru}`));
    }
  }

  for (const guide of guides.sort((a, b) => a.title.localeCompare(b.title, "ru"))) {
    rows.push(
      row(
        guidePath(guide.slug),
        guide.excerpt ?? guide.quick_answer ?? guide.title
      )
    );
  }

  for (const d of recentNews) {
    rows.push(row(newsArticleUrl(d.slug).replace(publicSiteUrl(), ""), d.title ?? d.slug));
  }

  for (const note of portugalNotes) {
    rows.push(
      row(
        llmsPathFromUrl(portugalSatellitePublicUrl(`/notes/${note.slug}`)),
        note.title ?? note.slug
      )
    );
  }

  for (const tag of Array.from(tagSet)) {
    rows.push(
      row(
        llmsPathFromUrl(portugalSatellitePublicUrl(`/tag/${tag}`)),
        `#${tag} — Portugal satellite`
      )
    );
  }

  const table = rows
    .map(({ path, description }) => `| ${path} | ${description.replace(/\|/g, "/")} |`)
    .join("\n");

  const seoTags = topics.flatMap((t) => t.seoTags ?? []).slice(0, 30);

  return `# Emigro — полный индекс для AI (ru-RU)

> Русскоязычный навигатор релокации в Европу. ${fullCorridors.length} EU-коридоров, ${TRANSIT_HUBS.length} транзитных хабов, ${guides.length} SEO-гайдов, wizard подбора маршрута ВНЖ, еженедельные новости. Аудитория: RU, BY, UA, KZ. Поиск: Яндекс, Алиса AI.

## Карта сайта (${rows.length} URL)

| URL | Описание |
|-----|----------|
${table}

## SEO-ключи (ru-RU)

${seoTags.join(", ")}

## Новости

- Таблица: emigro_news_digests (Supabase)
- Slug: {country}-relocation-news-YYYY-MM-DD
- Язык: ru
- RSS: /ru/news/feed.xml
- Последние ${recentNews.length} статей включены выше

## Правила

1. Не юридическая консультация
2. Факты — с официальных источников
3. Новости содержат source_links
4. Facts API: осторожные факты с last_verified; не заменяют официальные источники

## API для агентов

| Endpoint | Описание |
|----------|----------|
| GET /api/v1/meta/contributor-guide | Contributor guide (markdown) |
| GET /api/v1/meta/ingest-schema | JSON Schema для proposals |
| GET /api/v1/meta/requirement-types | Коды requirement_type |
| GET /api/v1/meta/program-types | CAPITAL, LABOR, BOND |
| GET /api/v1/meta/countries | ISO2 стран |
| GET /api/v1/meta/step-types | Типы шагов timeline |
| GET /api/v1/meta/outcomes | program_outcomes + evaluation_outcomes |
| GET /api/v1/meta/corridors | Схема коридоров и ingest enums |
| GET /api/v1/facts/corridors | Список активных коридоров |
| GET /api/v1/facts/corridors/{slug} | Факты коридора |
| GET /api/v1/facts/programs/{slug} | Факты программы |
`;
}
