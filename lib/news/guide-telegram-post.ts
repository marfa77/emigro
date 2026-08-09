/**
 * Soft channel posts from SEO pillar guides (content/guides/ru).
 * House style must match dozens of existing @Emigro_news guide posts:
 * sharp title-thesis → dense facts/numbers → link. No first-person memoir.
 */
import { listGuides, type GuideFrontmatter } from "@/lib/guides/load";
import { guidePath } from "@/lib/guides/paths";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { publicSiteUrl } from "@/lib/site-url";

export function guidePublicUrl(slug: string): string {
  const u = new URL(guidePath(slug), publicSiteUrl());
  u.searchParams.set("utm_source", "emigro");
  u.searchParams.set("utm_medium", "telegram");
  u.searchParams.set("utm_campaign", "guide_promo");
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

/** Prefer fresher / volatile-first ordering for the queue. */
export function listGuidePromoCandidates(excludeSlugs: Set<string>): GuideFrontmatter[] {
  return listGuides()
    .filter((g) => g.slug && !excludeSlugs.has(g.slug))
    .filter((g) => !g.slug.startsWith("_"))
    .sort((a, b) => {
      const vol = Number(b.review_tier === "volatile") - Number(a.review_tier === "volatile");
      if (vol !== 0) return vol;
      const da = Date.parse(a.date_modified || a.date_published || "") || 0;
      const db = Date.parse(b.date_modified || b.date_published || "") || 0;
      return db - da;
    });
}

const HOUSE_STYLE = `
Формат @Emigro_news для постов-гайдов (как уже десятки постов в канале):

1) headline — одна строка: страна/тема + резкий тезис через тире.
   Примеры тона:
   - «Нидерланды: первые 30 дней — без BSN не существуете официально»
   - «Греция 2026: закрыли лазейку "приехал туристом — оформился на месте"»
   - «Golden Visa 2021-2022: почему "ноябрь 2026 = автоматический паспорт" — опасное заблуждение»

2) body — 2–4 плотных абзаца: цифры, пороги, порядок шагов, ловушки.
   Только факты из входа (title / excerpt / quick_answer). На «вы».
   Каждый абзац — польза: число, правило или порядок действий. Без воды.

3) Без CTA-крика и без «читайте гайд / наш визард». Ссылка ставится кодом в конце.

ЗАПРЕЩЕНО:
- первое лицо («я», «мне», «мы с вами сидели», «помню то утро», «потягивал кофе»)
- мемуары, сцены из кафе, «путь в …», мотивационный блог
- «Представьте:», «Давайте разберёмся», «что нужно знать релокантам»
- «наш визард», «сравните в визарде», «актуальную информацию можно найти», «не забудьте сверить»
- выдуманные цифры/даты сверх фактов входа
- АКЦИЯ, гарантируем ВНЖ, капс
`.trim();

export async function writeGuideTelegramPost(guide: GuideFrontmatter): Promise<{
  html: string;
  format: string;
}> {
  const { geminiFastJson } = await import("@/lib/news/gemini");

  const format = "kanal_gajd";

  const system = `Ты редактор канала @Emigro_news. Пишешь пост по SEO-гайду Emigro строго в house style канала.

${HOUSE_STYLE}

Верни JSON: headline, paragraphs (2–4 строки), format_used="${format}". Без HTML, без URL, без эмодзи.`;

  const user = JSON.stringify({
    title: guide.title,
    excerpt: guide.excerpt || guide.seo_description || "",
    quick_answer: guide.quick_answer || "",
    tags: (guide.tags ?? []).slice(0, 8),
    seo_description: guide.seo_description || "",
  });

  const schema = {
    type: "OBJECT",
    properties: {
      headline: { type: "STRING" },
      paragraphs: { type: "ARRAY", items: { type: "STRING" } },
      format_used: { type: "STRING" },
    },
    required: ["headline", "paragraphs", "format_used"],
  };

  const result = await geminiFastJson<{
    headline: string;
    paragraphs: string[];
    format_used: string;
  }>(system, user, schema, 4096, { thinkingBudget: 0 });

  const headline = String(result.headline || "").trim();
  const paragraphs = (result.paragraphs ?? []).map((p) => String(p).trim()).filter(Boolean).slice(0, 4);

  if (!headline || paragraphs.length === 0) throw new Error("guide promo draft incomplete");

  // Reject first-person memoir slips before DM
  const joined = [headline, ...paragraphs].join("\n");
  if (/\b(я|мне|меня|мной|помню|сидел|сидела|потягивал|кафе в)\b/i.test(joined)) {
    throw new Error("guide promo rejected: first-person / memoir tone");
  }
  if (/визард|можно найти в нашем|актуальн\w+ информац/i.test(joined)) {
    throw new Error("guide promo rejected: soft CTA fluff");
  }

  const href = guidePublicUrl(guide.slug).replace(/"/g, "&quot;");
  const html = [
    `<b>${escapeTelegramHtml(headline.slice(0, 180))}</b>`,
    "",
    ...paragraphs.map((p) => escapeTelegramHtml(p.slice(0, 500))),
    "",
    `<a href="${href}">${escapeTelegramHtml(guide.title.slice(0, 90))}</a>`,
  ].join("\n");

  return { html: html.slice(0, 3500), format: String(result.format_used || format) };
}
