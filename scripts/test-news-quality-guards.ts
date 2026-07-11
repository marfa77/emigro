#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isGoogleGroundingRedirectUrl,
  isGoogleSourceName,
  sanitizeSourceLinks,
} from "../lib/news/article-resolve";
import { computeNewsScore, isSpainGoldenVisaBaitText } from "../lib/news/scoring";
import { buildThreadsFromSiteDigest } from "../lib/news/threads";
import {
  validateSiteDigestQuality,
  validateTelegramDigestQuality,
  validateThreadsQuality,
  type SiteDigestForQuality,
} from "../lib/news/quality";
import type { NewsTopicConfig } from "../lib/news/topics";

const emigroArticleUrl = "https://www.emigro.online/ru/news/spain-relocation-news-2026-06-27";
const telegramChannelUrl = "https://t.me/Emigro_news";
const threadsSourcesFooter = `Полная версия: ${emigroArticleUrl}\nКанал: ${telegramChannelUrl}`;

const sourceLinks = [
  { title: "BOE", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074" },
  { title: "Inclusion", url: "https://www.inclusion.gob.es/web/migraciones" },
  { title: "The Local Spain", url: "https://www.thelocal.es/2025/04/03/example" },
];

function baseSpainDigest(paragraph: string): SiteDigestForQuality {
  return {
    title: "Испания: BOE и Golden Visa",
    excerpt: "Разбор обновлений для заявителей на ВНЖ в Испании.",
    seo_title: "Испания Golden Visa: статус маршрута",
    seo_description: "Факты BOE о закрытии real estate Golden Visa в Испании.",
    key_takeaways: ["Проверьте BOE и переходные правила.", "Не планируйте новую покупку как гарантированный маршрут."],
    content_blocks: [
      {
        heading: "BOE и инвесторский ВНЖ",
        paragraphs: [paragraph],
        source_name: "BOE",
        source_url: sourceLinks[0].url,
      },
      {
        heading: "Digital Nomad",
        paragraphs: ["Digital Nomad Visa остаётся отдельным маршрутом для удалённой работы вне Испании."],
        source_name: "Inclusion",
        source_url: sourceLinks[1].url,
      },
      {
        heading: "Консульство",
        paragraphs: ["Заявителям стоит проверять требования консульства и сроки записи до подготовки документов."],
        source_name: "The Local Spain",
        source_url: sourceLinks[2].url,
      },
    ],
  };
}

const badGoldenVisa = validateSiteDigestQuality({
  topic: "spain",
  weekEnd: "2026-06-27",
  digest: baseSpainDigest("Golden Visa через недвижимость всё ещё открыта: покупатели могут срочно успеть подать."),
  selectedCount: 3,
  sourceLinks,
});
assert(
  badGoldenVisa.some((e) => e.includes("Golden Visa через недвижимость закрыта с 2025-04-03")),
  "Spain real-estate Golden Visa open/urgent framing must fail QA"
);
assert(
  badGoldenVisa.some((e) => e.includes("алармистскую формулировку")),
  "Alarmist Russian marker must fail QA"
);

const transitional = validateSiteDigestQuality({
  topic: "spain",
  weekEnd: "2026-06-27",
  digest: baseSpainDigest(
    "Golden Visa через недвижимость закрыта с 2025-04-03; обсуждаются только переходные правила для ранее поданных заявок."
  ),
  selectedCount: 3,
  sourceLinks,
});
assert.equal(transitional.length, 0, `Transitional Spain wording should pass QA: ${transitional.join("; ")}`);

const genericAdvice = validateSiteDigestQuality({
  topic: "spain",
  weekEnd: "2026-06-27",
  digest: baseSpainDigest(
    "BOE описывает переходные правила для ранее поданных заявок. Не является юридической консультацией: подготовьте документы заранее и проконсультируйтесь с юристом."
  ),
  selectedCount: 3,
  sourceLinks,
});
assert(
  genericAdvice.some((e) => e.includes("общий совет/шум")),
  "Generic legal boilerplate and checklist advice must fail QA"
);

const telegramErrors = validateTelegramDigestQuality({
  topic: "spain",
  weekEnd: "2026-06-27",
  digestHtml:
    '<b>Главное</b> Испания Golden Visa через недвижимость скоро закроется, последний шанс для покупателей подать.',
  sourceLinks,
});
assert(
  telegramErrors.some((e) => e.includes("Golden Visa через недвижимость закрыта с 2025-04-03")),
  "Telegram Spain Golden Visa scare framing must fail QA"
);

const threadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    `1/3\nИспания Golden Visa через недвижимость ещё открыта: последний шанс подать заявку.\n\n2/3\nПокупатели рискуют остаться без ВНЖ, если не успеют сейчас. Источник: BOE\n\n3/3\n${threadsSourcesFooter}`,
});
assert(
  threadsErrors.some((e) => e.includes("Golden Visa через недвижимость закрыта с 2025-04-03")),
  "Threads Spain Golden Visa scare framing must fail QA"
);

const genericThreadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    `1/3\nИспания: BOE описывает переходные правила для ранее поданных заявок.\n\n2/3\nПодготовьте документы заранее и проконсультируйтесь с юристом.\n\n3/3\n${threadsSourcesFooter}`,
});
assert(
  genericThreadsErrors.some((e) => e.includes("общий совет/шум")),
  "Threads generic checklist advice must fail QA"
);

const badGermanyCitizenship = validateSiteDigestQuality({
  topic: "germany",
  weekEnd: "2026-07-10",
  digest: {
    title: "Германия: BAMF и натурализация",
    excerpt: "Обзор правил BAMF.",
    seo_title: "Германия: гражданство",
    seo_description: "Сроки натурализации в Германии.",
    key_takeaways: ["Стандартный срок для гражданства — 8 лет законного проживания."],
    content_blocks: [
      {
        heading: "BAMF",
        paragraphs: ["BAMF определяет критерии натурализации в Германии."],
        source_name: "BAMF",
        source_url: "https://www.bamf.de/",
      },
    ],
  },
});
assert(
  badGermanyCitizenship.some((e) => e.includes("5 лет (StAG 2024)")),
  "Germany 8-year citizenship standard must fail QA"
);

const goodGermanyCitizenship = validateSiteDigestQuality({
  topic: "germany",
  weekEnd: "2026-07-10",
  digest: {
    title: "Германия: StAG 2024",
    excerpt: "Реформа гражданства BAMF.",
    seo_title: "Германия: гражданство",
    seo_description: "5 лет стандарт, 3 года ускорение.",
    key_takeaways: ["Стандартная натурализация — 5 лет; ускорение до 3 лет при C1."],
    content_blocks: [
      {
        heading: "BAMF",
        paragraphs: ["После реформы StAG 2024 стандарт — 5 лет вместо прежних 8 лет."],
        source_name: "BAMF",
        source_url: "https://www.bamf.de/",
      },
      {
        heading: "Blue Card",
        paragraphs: ["Blue Card остаётся маршрутом для квалифицированных специалистов."],
        source_name: "Make it in Germany",
        source_url: "https://www.make-it-in-germany.com/",
      },
      {
        heading: "Chancenkarte",
        paragraphs: ["Chancenkarte — поиск работы без оффера."],
        source_name: "Make it in Germany",
        source_url: "https://www.make-it-in-germany.com/en/visa-residence/",
      },
      {
        heading: "Консульство",
        paragraphs: ["Заявители сверяют требования в консульстве перед подачей."],
        source_name: "BAMF",
        source_url: "https://www.bamf.de/EN/Themen/MigrationAufenthalt/migrationaufenthalt-node.html",
      },
    ],
  },
  selectedCount: 4,
  sourceLinks: [
    { title: "BAMF", url: "https://www.bamf.de/" },
    { title: "Make it in Germany", url: "https://www.make-it-in-germany.com/" },
    { title: "BAMF migration", url: "https://www.bamf.de/EN/Themen/MigrationAufenthalt/migrationaufenthalt-node.html" },
  ],
});
assert.equal(goodGermanyCitizenship.length, 0, `Correct Germany 5/3 wording should pass QA: ${goodGermanyCitizenship.join("; ")}`);

const badScandinaviaPmj = validateSiteDigestQuality({
  topic: "scandinavia",
  weekEnd: "2026-07-05",
  digest: {
    title: "Швеция отменяет ПМЖ для беженцев",
    excerpt: "С 12 июля 2026 Швеция прекращает выдачу ПМЖ обладателям гуманитарных статусов.",
    seo_title: "Швеция: ПМЖ для беженцев",
    seo_description: "Отмена ПМЖ для беженцев с 12 июля.",
    key_takeaways: ["С 12 июля 2026 Швеция отменяет ПМЖ для беженцев и получателей защиты."],
    content_blocks: [
      {
        heading: "Швеция отменяет ПМЖ",
        paragraphs: [
          "С 12 июля 2026 в Швеции отменяется постоянный вид на жительство для беженцев и получателей субсидиарной защиты.",
        ],
        source_name: "The Local",
        source_url: "https://www.thelocal.se/",
      },
      {
        heading: "Migrationsverket",
        paragraphs: ["Migrationsverket обновило правила продления для protection-status категорий."],
        source_name: "Migrationsverket",
        source_url: "https://www.migrationsverket.se/",
      },
      {
        heading: "Дания",
        paragraphs: ["Дания уточнила правила для украинских мужчин 23-60."],
        source_name: "Nyidanmark",
        source_url: "https://www.nyidanmark.dk/",
      },
      {
        heading: "Финляндия",
        paragraphs: ["Migri возобновила рассмотрение заявлений на убежище от граждан Ирана."],
        source_name: "Migri",
        source_url: "https://migri.fi/",
      },
    ],
  },
});
assert(
  badScandinaviaPmj.some((e) => e.includes("уже выданные ПМЖ не отзываются")),
  "Scandinavia PMJ cancellation without grandfather clause must fail QA"
);

const goodScandinaviaPmj = validateSiteDigestQuality({
  topic: "scandinavia",
  weekEnd: "2026-07-05",
  digest: {
    title: "Швеция: новые ПМЖ для защитных категорий",
    excerpt:
      "С 12 июля 2026 при новых решениях беженцы получают пятилетний ВНЖ вместо ПМЖ; уже выданные ПМЖ сохраняются.",
    seo_title: "Швеция: ПМЖ и защита",
    seo_description: "Новые решения без ПМЖ; уже выданные не отзываются.",
    key_takeaways: [
      "С 12 июля 2026 при продлении protection-status категории получают пятилетний ВНЖ вместо ПМЖ; уже выданные ПМЖ не отзываются.",
      "Для гражданства с 12 июля ПМЖ не обязателен при обоснованных перспективах продления LTR.",
    ],
    content_blocks: [
      {
        heading: "Migrationsverket: protection-status renewals",
        paragraphs: [
          "С 12 июля 2026 при новых решениях беженцы и воссоединившиеся с ними родственники получают пятилетний ВНЖ вместо ПМЖ.",
          "Уже выданные ПМЖ не отзываются — меняются только новые решения.",
        ],
        source_name: "Migrationsverket",
        source_url: "https://www.migrationsverket.se/",
      },
      {
        heading: "Дания",
        paragraphs: ["Дания уточнила правила для украинских мужчин 23-60."],
        source_name: "Nyidanmark",
        source_url: "https://www.nyidanmark.dk/",
      },
      {
        heading: "Финляндия",
        paragraphs: ["Migri возобновила рассмотрение заявлений на убежище от граждан Ирана."],
        source_name: "Migri",
        source_url: "https://migri.fi/",
      },
      {
        heading: "Швеция: госорганы",
        paragraphs: ["С 13 июля шесть госорганов обязаны сообщать о резидентах без документов."],
        source_name: "The Local",
        source_url: "https://www.thelocal.se/",
      },
    ],
  },
});
assert.equal(goodScandinaviaPmj.length, 0, `Correct Scandinavia PMJ wording should pass QA: ${goodScandinaviaPmj.join("; ")}`);

const badPortugalEstrutura = validateSiteDigestQuality({
  topic: "portugal",
  weekEnd: "2026-07-06",
  digest: {
    title: "Португалия: AIMA и гражданство",
    excerpt: "Обзор задержек AIMA.",
    seo_title: "Португалия: AIMA",
    seo_description: "Спецгруппа AIMA завершает работу до августа 2026.",
    key_takeaways: ["Спецгруппа AIMA (Estrutura de Missão) завершает работу до августа 2026 года."],
    content_blocks: [
      {
        heading: "Спецгруппа AIMA завершает работу",
        paragraphs: [
          "Специальная рабочая группа AIMA (Estrutura de Missão) завершает свою работу и передаст 30 000 дел в общую очередь до августа 2026 года.",
        ],
        source_name: "Portugal Gov",
        source_url: "https://portugal.gov.pt/",
      },
      {
        heading: "Golden Visa",
        paragraphs: ["1260 инвесторов ARI подали жалобу омбудсмену на 10-летний срок по Nationality Law 2026."],
        source_name: "Observador",
        source_url: "https://observador.pt/",
      },
      {
        heading: "AIMA portal",
        paragraphs: ["С 1 июля 2026 портал AIMA принимает заявки на ПМЖ для граждан ЕС."],
        source_name: "The Portugal News",
        source_url: "https://www.theportugalnews.com/",
      },
    ],
  },
  selectedCount: 3,
  sourceLinks: [
    { title: "Portugal Gov", url: "https://portugal.gov.pt/" },
    { title: "Observador", url: "https://observador.pt/" },
    { title: "The Portugal News", url: "https://www.theportugalnews.com/" },
  ],
});
assert(
  badPortugalEstrutura.some((e) => e.includes("Estrutura de Missão AIMA прекратила работу 31.12.2025")),
  "Portugal Estrutura de Missão present-tense framing must fail QA"
);

assert(
  isSpainGoldenVisaBaitText("Spain Golden Visa real estate still open, last chance to apply"),
  "Scoring helper should identify stale Spain Golden Visa bait"
);

const topic: NewsTopicConfig = {
  key: "spain",
  urlSegment: "spain",
  countryRu: "Испания",
  countryEn: "Spain",
  flag: "🇪🇸",
  audienceRu: "русскоязычных заявителей",
  focusHintRu: "ВНЖ Испании",
  corridorSlug: "ru-speaking-to-spain",
  status: "active",
  seoTags: [],
  rssQueries: [],
};

const baitScore = computeNewsScore(
  "Spain Golden Visa real estate still open: last chance",
  "Buyers can still apply urgently.",
  "https://example.com/spain-golden-visa",
  "2026-06-26",
  topic,
  Date.UTC(2026, 5, 27)
);
const soberScore = computeNewsScore(
  "Spain digital nomad visa consulate process updated",
  "Remote workers should check consulate requirements.",
  "https://example.com/spain-digital-nomad",
  "2026-06-26",
  topic,
  Date.UTC(2026, 5, 27)
);
assert(baitScore < soberScore, "Stale Spain Golden Visa bait should score below a sober relevant item");

assert(
  isGoogleGroundingRedirectUrl("https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc123"),
  "Vertex AI grounding redirect must be detected"
);
assert(!isGoogleGroundingRedirectUrl("https://www.boe.es/example"), "Direct publisher URL must not be blocked");

const cleanedLinks = sanitizeSourceLinks([
  { title: "BOE", url: "https://www.boe.es/example" },
  { title: "Grounding", url: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc" },
  { title: "Google News", url: "https://www.reuters.com/example" },
  { title: "Reuters", url: "https://www.reuters.com/example" },
]);
assert.equal(cleanedLinks.length, 2, "Grounding redirect and Google-named sources must be stripped from source_links");
assert(
  cleanedLinks.every((l) => l.title === "BOE" || l.title === "Reuters"),
  "Only real publisher titles should remain after sanitizeSourceLinks"
);

assert(isGoogleSourceName("Google"), "Google label must be detected");
assert(isGoogleSourceName("Google News"), "Google News label must be detected");
assert(!isGoogleSourceName("Reuters"), "Real publisher must not be flagged as Google");

const googleSourceThreadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    `1/3\nИспания: обновление по ВНЖ.\n\n2/3\nDigital Nomad Visa — отдельный маршрут. Источник: Google\n\n3/3\n${threadsSourcesFooter}`,
});
assert(
  googleSourceThreadsErrors.some((e) => e.includes("Google") || e.includes("Источник")),
  "Threads with Google source label must fail QA"
);

const googleUrlThreadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    "1/3\nИспания: обновление по ВНЖ.\n\n2/3\nDigital Nomad Visa — отдельный маршрут.\n\n3/3\nBad: https://www.google.com/search?q=spain",
});
assert(
  googleUrlThreadsErrors.some((e) => e.includes("Google") || e.includes("emigro.online")),
  "Threads with google.com URL must fail QA"
);

const groundingThreadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    "1/3\nИспания: обновление по ВНЖ.\n\n2/3\nDigital Nomad Visa — отдельный маршрут.\n\n3/3\nBad: https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc",
});
assert(
  groundingThreadsErrors.some((e) => e.includes("grounding redirect") || e.includes("emigro.online")),
  "Threads with Vertex grounding redirect must fail QA"
);

const builtThreads = buildThreadsFromSiteDigest({
  topic,
  weekFrom: new Date("2026-06-23T00:00:00.000Z"),
  weekEnd: new Date("2026-06-27T00:00:00.000Z"),
  channelUrl: telegramChannelUrl,
  siteArticleUrl: emigroArticleUrl,
  title: "Испания: BOE и Golden Visa",
  excerpt: "Разбор обновлений для заявителей на ВНЖ в Испании.",
  keyTakeaways: ["Проверьте BOE."],
  contentBlocks: baseSpainDigest("BOE описывает переходные правила для ранее поданных заявок.").content_blocks,
  sourceLinks,
});
assert(!/vertexaisearch|grounding-api-redirect|google\.com/i.test(builtThreads), "Built threads must not contain Google URLs");
assert(builtThreads.includes("emigro.online"), "Built threads must link to Emigro article");
assert(builtThreads.includes("t.me/Emigro_news"), "Built threads must link to Telegram channel");
assert(!builtThreads.includes("boe.es"), "Built threads must not include external publisher URLs");
assert(!/^Источник:/im.test(builtThreads), "Built threads must not include source attribution lines");
assert(!/^Источники:/im.test(builtThreads), "Built threads must not include Источники block");
assert(!/^Emigro:\s*https?:\/\//im.test(builtThreads), "Built threads must not duplicate Emigro under sources");

const legacySourcesBlockErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    `1/3\nИспания: обновление по ВНЖ.\n\n2/3\nDigital Nomad Visa — отдельный маршрут.\n\n3/3\n${threadsSourcesFooter}\nИсточники:\nEmigro: ${emigroArticleUrl}`,
});
assert(
  legacySourcesBlockErrors.some((e) => e.includes("Источники")),
  "Threads with legacy Источники block must fail QA"
);

const vercelConfig = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")) as {
  crons?: Array<{ path: string; schedule: string }>;
};
assert(
  !vercelConfig.crons?.some((cron) => cron.path === "/api/cron/prep2go-news"),
  "Prep2Go news import must run on VPS (not Vercel cron)"
);
assert(
  !vercelConfig.crons?.some((cron) => cron.path === "/api/cron/weekly-news"),
  "Production cron must not run legacy Google News/RSS weekly generation"
);

const weeklyCronRoute = readFileSync(join(process.cwd(), "app/api/cron/weekly-news/route.ts"), "utf8");
assert(
  weeklyCronRoute.includes("importLatestPrep2GoNews") && !weeklyCronRoute.includes("generate-weekly"),
  "Legacy weekly cron endpoint must redirect to the Prep2Go importer"
);

console.log("news-quality-guards: ok");
