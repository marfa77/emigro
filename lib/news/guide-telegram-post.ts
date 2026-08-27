/**
 * Soft channel posts from SEO pillar guides (content/guides/ru).
 * House style must match dozens of existing @Emigro_news guide posts:
 * sharp title-thesis → dense facts/numbers → link. No first-person memoir.
 *
 * Writer: OpenRouter (Claude Sonnet by default) — not Gemini Flash.
 */
import { openrouterJson } from "@/lib/llm/openrouter";
import { listGuides, type GuideFrontmatter } from "@/lib/guides/load";
import { guidePath } from "@/lib/guides/paths";
import { CHANNEL_STYLE_BANNED_RU } from "@/lib/news/editorial";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { THREADS_REPOST_STYLE, stripRepostMd } from "@/lib/news/threads-repost-style";
import { publicSiteUrl } from "@/lib/site-url";

export const DEFAULT_GUIDE_PROMO_MODEL = "anthropic/claude-sonnet-4.5";

export function guidePromoModel(): string {
  return (process.env.EMIGRO_GUIDE_PROMO_MODEL || DEFAULT_GUIDE_PROMO_MODEL).trim();
}

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
Пост пишется в Telegram, но владелец копирует его в Threads — пиши сразу под этот dual-use.

${THREADS_REPOST_STYLE}

Дополнительно для гайдов:
- headline = слайд 1 карусели
- paragraphs = слайды 2–N (ровно 3–5 коротких абзацев)
- В каждом абзаце — польза: число, правило или ловушка из quick_answer / title / excerpt
`.trim();

type GuidePromoLlm = {
  headline: string;
  paragraphs: string[];
  format_used: string;
};

/** Unicode-aware word edge — JS `\b` does not treat Cyrillic as word chars. */
function hasRuWord(text: string, pattern: string): boolean {
  return new RegExp(`(?<![\\p{L}\\p{N}_])(?:${pattern})(?![\\p{L}\\p{N}_])`, "iu").test(text);
}

/** Reject memoir, CTA fluff, LLM stamps, telegraphic lecture voice. */
export function guideTelegramVoiceErrors(text: string): string[] {
  const t = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const errors: string[] = [];
  if (hasRuWord(t, "я|мне|меня|мной|помню|сидел|сидела|потягивал") || /кафе в/i.test(t)) {
    errors.push("first-person / memoir tone");
  }
  if (/визард|можно найти в нашем|актуальн\w+ информац/i.test(t)) {
    errors.push("soft CTA fluff");
  }
  const banned = new RegExp(CHANNEL_STYLE_BANNED_RU, "i").exec(t);
  if (banned) errors.push(`LLM stamp «${banned[0]}»`);
  if (/(?:^|\n)\s*(что делать|зачем(?: вам это сейчас)?|главное для тех)\s*:/im.test(text)) {
    errors.push("telegraphic voice labels");
  }
  if (/представьте:|давайте разбер/i.test(t)) {
    errors.push("lecture / blogger opener");
  }
  return errors;
}

export async function writeGuideTelegramPost(guide: GuideFrontmatter): Promise<{
  html: string;
  format: string;
  model: string;
}> {
  if (!(process.env.OPENROUTER_API_KEY || "").trim()) {
    throw new Error("OPENROUTER_API_KEY required for guide Telegram posts");
  }

  const format = "kanal_gajd_threads";
  const model = guidePromoModel();

  const system = `Ты редактор канала @Emigro_news. Пишешь пост по SEO-гайду Emigro строго в house style (Telegram → Threads).

${HOUSE_STYLE}

Верни JSON: headline, paragraphs (3–5 строк), format_used="${format}". Без HTML, без URL, без эмодзи.`;

  const user = JSON.stringify({
    title: guide.title,
    excerpt: guide.excerpt || guide.seo_description || "",
    quick_answer: guide.quick_answer || "",
    tags: (guide.tags ?? []).slice(0, 8),
    seo_description: guide.seo_description || "",
  });

  const { data: result, model: used } = await openrouterJson<GuidePromoLlm>(
    model,
    system,
    user,
    4096,
    { temperature: 0.35 }
  );

  const headline = stripRepostMd(String(result.headline || ""));
  const paragraphs = (result.paragraphs ?? [])
    .map((p) => stripRepostMd(String(p || "")))
    .filter(Boolean)
    .slice(0, 5);

  if (!headline || paragraphs.length === 0) throw new Error("guide promo draft incomplete");

  const joined = [headline, ...paragraphs].join("\n");
  const voice = guideTelegramVoiceErrors(joined);
  if (voice.length) throw new Error(`guide promo rejected: ${voice.join("; ")}`);

  const href = guidePublicUrl(guide.slug).replace(/"/g, "&quot;");
  // Blank line between every block (headline / paras / link) — not a wall of text.
  const blocks = [
    `<b>${escapeTelegramHtml(headline.slice(0, 180))}</b>`,
    ...paragraphs.map((p) => escapeTelegramHtml(p.slice(0, 500))),
    `<a href="${href}">${escapeTelegramHtml(guide.title.slice(0, 90))}</a>`,
  ];
  const html = blocks.join("\n\n");

  return {
    html: html.slice(0, 3500),
    format: String(result.format_used || format),
    model: used || model,
  };
}
