/**
 * Soft weekly product drafts for @Emigro_news — not hard-sell ads.
 * One product per ISO week; Gemini writes a different editorial format each time.
 * Channel publish only after owner DM approve (see run-weekly-soft-promo).
 */
import { barakhloMarketUrl } from "@/lib/barakhlo/markets";
import { ROLE_RADAR_BOT_BASE, ROLE_RADAR_LANDING_PATH } from "@/lib/role-radar";
import { publicSiteUrl } from "@/lib/site-url";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

export type SoftPromoProductId = "route_check" | "job_bot" | "barakhlo" | "assist";

export type SoftPromoProduct = {
  id: SoftPromoProductId;
  labelRu: string;
  /** Facts the LLM may use — no invented prices. */
  factsRu: string[];
  /** Canonical link shown in the post */
  url: string;
  linkLabelRu: string;
};

function utm(url: string, content: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "emigro");
  u.searchParams.set("utm_medium", "telegram");
  u.searchParams.set("utm_campaign", "soft_promo");
  u.searchParams.set("utm_content", content);
  return u.toString();
}

export function softPromoProducts(): SoftPromoProduct[] {
  const site = publicSiteUrl();
  return [
    {
      id: "route_check",
      labelRu: "Route Check (Emigro Assist)",
      factsRu: [
        "Route Check — структурированный разбор кейса: созвон с командой Emigro + PDF (маршрут, таймлайн, бюджет, риски).",
        "Цена Route Check: €129.",
        "Это не юрконсультация и не гарантия визы; юридические услуги — у партнёра, которого вы выбираете.",
        "Оплата после согласования слота (PayPal, Stars, USDT/USDC, карта).",
      ],
      url: utm(`${site}/ru/assist`, "route_check"),
      linkLabelRu: "Route Check на Emigro",
    },
    {
      id: "job_bot",
      labelRu: "джоб-бот Role Radar",
      factsRu: [
        "Telegram-бот подбирает вакансии под загруженное CV.",
        "Полезен, когда ищете work permit / Blue Card / удалёнку с прицелом на Европу.",
        "Сестра Emigro, не «гарантия оффера».",
      ],
      url: utm(`${ROLE_RADAR_BOT_BASE}?start=emigro_news`, "job_bot"),
      linkLabelRu: "Открыть джоб-бот",
    },
    {
      id: "barakhlo",
      labelRu: "Barakhlo",
      factsRu: [
        "Доска объявлений для релокантов: вещи, сдача/поиск жилья-смежное, услуги в городе.",
        "Есть рынки по городам (Лиссабон, Валенсия и др.).",
        "Не магазин Emigro — communitу-доска barakhlo.online.",
      ],
      url: utm(barakhloMarketUrl("portugal"), "barakhlo"),
      linkLabelRu: "Barakhlo",
    },
    {
      id: "assist",
      labelRu: "Emigro Assist",
      factsRu: [
        "Помощь с навигацией по маршруту: Route Check €129 или сопровождение переписки €100/час.",
        "Подбор профильных партнёров под кейс.",
        "Не юридическая фирма Emigro; без обещаний одобрения визы.",
      ],
      url: utm(`${site}/ru/assist`, "assist"),
      linkLabelRu: "Emigro Assist",
    },
  ];
}

/** Rotate product by ISO week number. */
export function softPromoProductForWeek(d = new Date()): SoftPromoProduct {
  const products = softPromoProducts();
  const week = isoWeekNumber(d);
  return products[week % products.length]!;
}

export function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function isoWeekKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-W${String(isoWeekNumber(d)).padStart(2, "0")}`;
}

/** Formats Gemini may pick — soft editorial, not banner ads. */
export const SOFT_PROMO_FORMATS = [
  "сцена_из_жизни",
  "короткий_совет",
  "вопрос_к_читателю",
  "чеклист_из_3_пунктов",
  "разбор_ошибки",
  "заметка_в_блокнот",
  "диалог_с_собой",
] as const;

export type SoftPromoDraft = {
  html: string;
  format: string;
  productId: SoftPromoProductId;
};

export async function writeSoftPromoPost(product: SoftPromoProduct): Promise<SoftPromoDraft> {
  const { geminiFastJson } = await import("@/lib/news/gemini");
  const format =
    SOFT_PROMO_FORMATS[Math.floor(Math.random() * SOFT_PROMO_FORMATS.length)] ?? "короткий_совет";

  const system = `Ты редактор канала @Emigro_news для русскоязычных релокантов.
Напиши мягкий пост про продукт Emigro — не рекламный баннер.

Голос: «опытный релокант за кофе» — на «вы», тепло, без канцелярита и без hard-sell.
Формат на эту неделю: ${format}. Каждый раз структура должна ощущаться по-другому.

ЖЁСТКО ЗАПРЕЩЕНО:
- «🔥 АКЦИЯ», «спешите», «только сегодня», «гарантируем ВНЖ», капс, много эмодзи
- фразы «наш сервис предлагает», «воспользуйтесь уникальной возможностью»
- выдуманные цены, скидки, кейсы, цифры сверх фактов ниже
- обещания одобрения визы

МОЖНО: сцена, вопрос, короткая польза, ирония 1 фраза, честный дисклеймер если уместно.

Верни JSON: hook (1 предложение), body (2–4 коротких абзаца строками), cta (1 спокойная фраза без URL).
Без HTML и markdown. Длина body суммарно ~350–700 символов.`;

  const user = JSON.stringify({
    product: product.labelRu,
    facts: product.factsRu,
    format,
  });

  const schema = {
    type: "OBJECT",
    properties: {
      hook: { type: "STRING" },
      body: { type: "ARRAY", items: { type: "STRING" } },
      cta: { type: "STRING" },
      format_used: { type: "STRING" },
    },
    required: ["hook", "body", "cta", "format_used"],
  };

  const result = await geminiFastJson<{
    hook: string;
    body: string[];
    cta: string;
    format_used: string;
  }>(system, user, schema, 4096, { thinkingBudget: 0 });

  const hook = String(result.hook || "").trim();
  const paragraphs = (result.body ?? []).map((p) => String(p).trim()).filter(Boolean).slice(0, 4);
  const cta = String(result.cta || "").trim() || "Если откликается — ссылка ниже.";
  if (!hook || paragraphs.length === 0) {
    throw new Error("soft promo draft incomplete");
  }

  const href = product.url.replace(/"/g, "&quot;");
  const html = [
    `<b>${escapeTelegramHtml(hook.slice(0, 180))}</b>`,
    "",
    ...paragraphs.map((p) => escapeTelegramHtml(p.slice(0, 400))),
    "",
    escapeTelegramHtml(cta.slice(0, 160)),
    `<a href="${href}">${escapeTelegramHtml(product.linkLabelRu)}</a>`,
  ].join("\n");

  if (html.length < 120) {
    throw new Error("soft promo draft too short");
  }

  return {
    html: html.slice(0, 3500),
    format: String(result.format_used || format),
    productId: product.id,
  };
}

/** Role Radar landing on site (optional secondary mention — not used in post by default). */
export function roleRadarLandingUrl(): string {
  return `${publicSiteUrl()}${ROLE_RADAR_LANDING_PATH}`;
}
