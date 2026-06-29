#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { computeNewsScore, isSpainGoldenVisaBaitText } from "../lib/news/scoring";
import {
  validateSiteDigestQuality,
  validateTelegramDigestQuality,
  validateThreadsQuality,
  type SiteDigestForQuality,
} from "../lib/news/quality";
import type { NewsTopicConfig } from "../lib/news/topics";

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
    "1/3\nИспания Golden Visa через недвижимость ещё открыта: последний шанс подать заявку.\n\n2/3\nПокупатели рискуют остаться без ВНЖ, если не успеют сейчас. Источник: BOE\n\n3/3\nИсточники:\nBOE: https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074",
});
assert(
  threadsErrors.some((e) => e.includes("Golden Visa через недвижимость закрыта с 2025-04-03")),
  "Threads Spain Golden Visa scare framing must fail QA"
);

const genericThreadsErrors = validateThreadsQuality({
  topic: "spain",
  threadsText:
    "1/3\nИспания: BOE описывает переходные правила для ранее поданных заявок.\n\n2/3\nПодготовьте документы заранее и проконсультируйтесь с юристом.\n\n3/3\nИсточники:\nBOE: https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074",
});
assert(
  genericThreadsErrors.some((e) => e.includes("общий совет/шум")),
  "Threads generic checklist advice must fail QA"
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

const vercelConfig = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")) as {
  crons?: Array<{ path: string; schedule: string }>;
};
assert(
  vercelConfig.crons?.some((cron) => cron.path === "/api/cron/prep2go-news"),
  "Production cron must import Prep2Go news"
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
