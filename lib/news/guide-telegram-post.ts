/**
 * Soft channel posts from SEO pillar guides (content/guides/ru).
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

export async function writeGuideTelegramPost(guide: GuideFrontmatter): Promise<{
  html: string;
  format: string;
}> {
  const { geminiFastJson } = await import("@/lib/news/gemini");

  const formats = [
    "сцена_из_жизни",
    "короткий_совет",
    "чеклист_из_3",
    "вопрос_к_читателю",
    "разбор_ошибки",
  ] as const;
  const format = formats[Math.floor(Math.random() * formats.length)] ?? "короткий_совет";

  const system = `Ты редактор @Emigro_news. Напиши мягкий пост по SEO-гайду Emigro — не рекламный баннер.
Голос: опытный релокант за кофе, на «вы». Формат: ${format}.
Запрещено: АКЦИЯ, гарантируем ВНЖ, капс, выдуманные цифры сверх фактов.
Верни JSON: hook, body (2–4 коротких абзаца), cta (1 фраза без URL). Без HTML.`;

  const user = JSON.stringify({
    title: guide.title,
    excerpt: guide.excerpt || guide.seo_description || "",
    quick_answer: guide.quick_answer || "",
    tags: (guide.tags ?? []).slice(0, 6),
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
  const cta = String(result.cta || "").trim() || "Полный разбор — в гайде.";
  if (!hook || paragraphs.length === 0) throw new Error("guide promo draft incomplete");

  const href = guidePublicUrl(guide.slug).replace(/"/g, "&quot;");
  const html = [
    `📘 <b>${escapeTelegramHtml(hook.slice(0, 160))}</b>`,
    "",
    ...paragraphs.map((p) => escapeTelegramHtml(p.slice(0, 380))),
    "",
    escapeTelegramHtml(cta.slice(0, 140)),
    `<a href="${href}">${escapeTelegramHtml(guide.title.slice(0, 80))}</a>`,
  ].join("\n");

  return { html: html.slice(0, 3500), format: String(result.format_used || format) };
}
