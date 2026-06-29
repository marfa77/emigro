#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { runPrep2GoFactCheck } from "../lib/news/fact-check";
import type { Prep2GoArticle } from "../lib/news/prep2go-fetch";
import type { NewsTopicConfig } from "../lib/news/topics";
import type { SiteDigestForQuality } from "../lib/news/quality";

const topic: NewsTopicConfig = {
  key: "spain",
  urlSegment: "spain",
  countryRu: "Испания",
  countryEn: "Spain",
  flag: "🇪🇸",
  audienceRu: "русскоязычных заявителей",
  focusHintRu: "ВНЖ и гражданство Испании",
  corridorSlug: "ru-speaking-to-spain",
  status: "active",
  seoTags: [],
  rssQueries: [],
};

const sourceLinks = [
  { title: "BOE", url: "https://www.boe.es/example" },
  { title: "Migration Ministry", url: "https://www.inclusion.gob.es/example" },
  { title: "The Local Spain", url: "https://www.thelocal.es/example" },
];

const scandinaviaTopic: NewsTopicConfig = {
  key: "scandinavia",
  urlSegment: "scandinavia",
  countryRu: "Скандинавия",
  countryEn: "Scandinavia",
  flag: "🇸🇪",
  audienceRu: "русскоязычных заявителей",
  focusHintRu: "ВНЖ и гражданство Скандинавии",
  corridorSlug: "ru-speaking-to-scandinavia",
  status: "active",
  seoTags: [],
  rssQueries: [],
};

function article(overrides: Partial<Prep2GoArticle> = {}): Prep2GoArticle {
  return {
    title: "Spain immigration update",
    link: "https://www.prep2go.study/news/spain-citizenship-residency-news-2026-06-27",
    pubDate: "2026-06-27",
    excerpt:
      "On April 3, 2025, Spain closed the real-estate Golden Visa route. The article also explains a five years residence threshold.",
    topicKey: "spain",
    weekEnd: "2026-06-27",
    prep2goSlug: "spain-citizenship-residency-news-2026-06-27",
    keyTakeaways: ["Spain closed the real-estate Golden Visa route on April 3, 2025."],
    sections: [
      {
        heading: "Golden Visa closed",
        paragraphs: [
          "The real-estate Golden Visa route closed on April 3, 2025.",
          "The article describes a five years residence threshold and does not introduce new eligibility advice.",
        ],
        bullets: [],
      },
    ],
    sources: sourceLinks.map((s) => ({ title: s.title, url: s.url })),
    ...overrides,
  };
}

function digest(paragraph: string): SiteDigestForQuality {
  return {
    title: "Испания: статус Golden Visa",
    excerpt: "BOE зафиксировал закрытие маршрута через недвижимость.",
    seo_title: "Испания Golden Visa: статус маршрута",
    seo_description: "Что изменилось для инвесторского ВНЖ Испании.",
    key_takeaways: ["Golden Visa через недвижимость закрыта с 3 апреля 2025 года."],
    content_blocks: [
      {
        heading: "Маршрут через недвижимость закрыт",
        paragraphs: [paragraph],
        source_name: "BOE",
        source_url: sourceLinks[0].url,
      },
    ],
  };
}

function plainDigest(paragraph: string, title = "Миграционное обновление"): SiteDigestForQuality {
  return {
    title,
    excerpt: paragraph,
    seo_title: title,
    seo_description: paragraph,
    key_takeaways: [paragraph],
    content_blocks: [
      {
        heading: title,
        paragraphs: [paragraph],
        source_name: "Prep2Go",
        source_url: sourceLinks[0].url,
      },
    ],
  };
}

async function deterministicCheck(
  siteDigest: SiteDigestForQuality,
  sourceArticle = article(),
  topicConfig: NewsTopicConfig = topic
) {
  return runPrep2GoFactCheck({
    stage: "site",
    article: sourceArticle,
    topic: topicConfig,
    weekStart: "2026-06-20",
    weekEnd: "2026-06-27",
    sourceLinks,
    siteDigest,
    useLlm: false,
  });
}

async function main(): Promise<void> {
  const supported = await deterministicCheck(
    digest("Golden Visa через недвижимость закрыта с 3 апреля 2025 года; в статье также указан порог 5 лет резиденции.")
  );
  assert.equal(supported.ok, true, `Supported date and number should pass: ${supported.criticalErrors.join("; ")}`);

  const unsupportedDateNumber = await deterministicCheck(
    digest("Golden Visa через недвижимость закрыта с 4 апреля 2025 года; для заявителей теперь действует порог 10 лет.")
  );
  assert(
    unsupportedDateNumber.criticalErrors.some((e) => e.includes("Неподтвержденная дата")),
    "Unsupported date must fail fact-check"
  );
  assert(
    unsupportedDateNumber.criticalErrors.some((e) => e.includes("Неподтвержденное число")),
    "Unsupported number/duration must fail fact-check"
  );

  const proposedSource = article({
    excerpt: "Parliament is debating a proposed bill that would change residence rules.",
    keyTakeaways: ["The bill is proposed and has not been adopted."],
    sections: [
      {
        heading: "Bill proposed",
        paragraphs: ["The proposed bill would change residence rules if adopted by parliament."],
        bullets: [],
      },
    ],
  });
  const proposedMismatch = await deterministicCheck(
    digest("Парламент принял закон, и новые правила уже вступили в силу."),
    proposedSource
  );
  assert(
    proposedMismatch.criticalErrors.some((e) => e.includes("Статус закона/программы искажен")),
    "Proposed-vs-adopted mismatch must fail fact-check"
  );

  const swedenSource = article({
    title: "Sweden long-term resident permits update",
    excerpt:
      "Under proposition 2025/26:262, from 12 July 2026 protection-status holders such as refugees and subsidiary protection holders receive temporary five-year permits on renewal instead of indefinite or permanent permits.",
    topicKey: "scandinavia",
    keyTakeaways: [
      "The change affects protection-status holders on renewals from 12 July 2026.",
      "Labour migrants and family reunification permanent residence are not currently affected.",
    ],
    sections: [
      {
        heading: "Protection-status renewals",
        paragraphs: [
          "From 12 July 2026, protection-status holders, including refugees and people with subsidiary protection, receive temporary five-year permits on renewal instead of indefinite or permanent permits.",
          "The proposition does not currently affect permanent residence for labour migrants or family reunification cases.",
        ],
        bullets: [],
      },
    ],
  });
  const broadSwedenFraming = await deterministicCheck(
    plainDigest(
      "Швеция вводит пятилетний ВНЖ для всех иностранцев: это улучшение даёт стабильность резидентам с 12 июля 2026 года.",
      "Швеция: пятилетний ВНЖ"
    ),
    swedenSource,
    scandinaviaTopic
  );
  assert(
    broadSwedenFraming.criticalErrors.some(
      (e) => e.includes("missing_critical_qualifier") || e.includes("misleading_framing")
    ),
    "Broad/improvement Sweden framing must fail fact-check"
  );

  const correctedSwedenFraming = await deterministicCheck(
    plainDigest(
      "В Швеции с 12 июля 2026 года для держателей статуса защиты, включая беженцев и получателей субсидиарной защиты, продление станет временным пятилетним разрешением вместо постоянного. Трудовые мигранты и ПМЖ по воссоединению семьи сейчас не затронуты.",
      "Швеция: продления для держателей защиты"
    ),
    swedenSource,
    scandinaviaTopic
  );
  assert.equal(
    correctedSwedenFraming.ok,
    true,
    `Corrected Sweden framing should pass: ${correctedSwedenFraming.criticalErrors.join("; ")}`
  );

  const salaryThresholdSource = article({
    excerpt:
      "From July 1, 2026, new work permit applications must meet a salary threshold of 2500 евро. Renewals filed before that date remain under transitional rules.",
    keyTakeaways: ["The 2500 евро salary threshold applies to new work permit applications from July 1, 2026."],
    sections: [
      {
        heading: "Salary threshold",
        paragraphs: [
          "From July 1, 2026, new work permit applications must meet a salary threshold of 2500 евро.",
          "Renewals filed before that date remain under transitional rules.",
        ],
        bullets: [],
      },
    ],
  });
  const missingSalaryQualifiers = await deterministicCheck(
    plainDigest("Для рабочей визы теперь нужен доход не ниже 2500 евро.", "Порог дохода для рабочей визы"),
    salaryThresholdSource
  );
  assert(
    missingSalaryQualifiers.criticalErrors.some((e) => e.includes("effective_date")),
    "Salary threshold claim without effective date must fail fact-check"
  );
  assert(
    missingSalaryQualifiers.criticalErrors.some((e) => e.includes("application_scope")),
    "Salary threshold claim without application scope must fail fact-check"
  );

  const genericAdvice = await deterministicCheck(
    digest("Маршрут закрыт с 3 апреля 2025 года. Подготовьте документы заранее и проконсультируйтесь с юристом.")
  );
  assert(
    genericAdvice.criticalErrors.some((e) => e.includes("generic advice")),
    "Generic advice extrapolation must fail fact-check"
  );

  const staleSpainGoldenVisa = await deterministicCheck(
    digest("Golden Visa через недвижимость всё ещё открыта: покупатели могут подать заявку.")
  );
  assert(
    staleSpainGoldenVisa.criticalErrors.some((e) => e.includes("eligibility") || e.includes("праве подать")),
    "Stale Spain Golden Visa open/apply claim must fail fact-check"
  );

  console.log("news-fact-check: ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
