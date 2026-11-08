/**
 * Cheap guide posts for Emigro Threads (user, 2026-11-07).
 * Root = short fact from a live site guide (gemini-2.5-flash).
 * Related reply with the guide URL every other post.
 * No bank viral stamp — owner DM approval remains the publish gate.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { getGuideCountryTopicKeys } from "@/lib/guides/guide-display";
import { listGuides, type GuideFrontmatter } from "@/lib/guides/load";
import { listGuidePromoCandidates } from "@/lib/news/guide-telegram-post";
import { geminiFastJson } from "@/lib/news/gemini";
import { threadsGuidePageUrl } from "@/lib/threads/banks";
import {
  clipThreadsText,
  formatThreadsChainPreview,
  sanitizeThreadsTopicTag,
  type ThreadsChainItem,
} from "@/lib/threads/compose";

export type GuideShortAccount = "assist" | "invest" | "portugal" | "italy";

export type GuideShortPlan = {
  kind: "guide";
  slug: string;
  countryRu: string;
  withLink: boolean;
  items: ThreadsChainItem[];
  preview: string;
};

const COUNTRY_RU: Record<string, string> = {
  portugal: "Португалия",
  spain: "Испания",
  italy: "Италия",
  greece: "Греция",
  hungary: "Венгрия",
  malta: "Мальта",
  europe: "Европа",
};

function countryRuOf(guide: GuideFrontmatter): string {
  const key = getGuideCountryTopicKeys(guide.topic_keys)[0] || "europe";
  return COUNTRY_RU[key] || "Европа";
}

function hay(guide: GuideFrontmatter): string {
  return [
    guide.slug,
    guide.title,
    guide.primary_intent,
    ...(guide.tags ?? []),
    ...(guide.topic_keys ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesAccount(guide: GuideFrontmatter, account: GuideShortAccount): boolean {
  const h = hay(guide);
  const topics = new Set((guide.topic_keys ?? []).map((t) => t.toLowerCase()));
  const countries = getGuideCountryTopicKeys(guide.topic_keys).map((t) => t.toLowerCase());
  const slug = (guide.slug || "").toLowerCase();
  if (account === "assist") {
    // Investment-only pages belong on @emigro_invest.
    if (topics.has("investment") && /investitsion|golden/.test(h)) return false;
    return true;
  }
  if (account === "invest") {
    if (/investitsion|golden[-_]?visa|guest[-_]?investor|white[-_]?card-guest|mprp/.test(slug)) {
      return true;
    }
    if (!topics.has("investment")) return false;
    // Many DN/work guides wrongly carry topic "investment".
    if (
      /digital[-_]?nomad|type[-_]?d|eood|elective|nomad/.test(slug) &&
      !/golden|invest|guest|mprp/.test(slug)
    ) {
      return false;
    }
    return /golden|инвест|guest investor|mprp|\bari\b|фонд/.test(h);
  }
  if (account === "portugal") {
    if (/portugaliya|portugal/.test(slug)) return true;
    return countries.length === 1 && countries[0] === "portugal";
  }
  if (/italiya|italy/.test(slug)) return true;
  return countries.length === 1 && countries[0] === "italy";
}

export function listGuidesForAccount(
  account: GuideShortAccount,
  usedSlugs: Iterable<string>
): GuideFrontmatter[] {
  const used = new Set(usedSlugs);
  const pool =
    account === "assist"
      ? listGuidePromoCandidates(used)
      : listGuides()
          .filter((g) => g.slug && !g.slug.startsWith("_") && !used.has(g.slug))
          .sort((a, b) => {
            const vol = Number(b.review_tier === "volatile") - Number(a.review_tier === "volatile");
            if (vol !== 0) return vol;
            const da = Date.parse(a.date_modified || a.date_published || "") || 0;
            const db = Date.parse(b.date_modified || b.date_published || "") || 0;
            return db - da;
          });
  const matched = pool.filter((g) => matchesAccount(g, account));
  if (matched.length > 0) return matched;
  // Wrap: ignore used set once, keep account filter.
  const fresh = listGuides().filter(
    (g) => g.slug && !g.slug.startsWith("_") && matchesAccount(g, account)
  );
  return fresh;
}

/** Link on 2nd, 4th, 6th… published guide short (через раз). */
export function shouldAttachGuideLink(publishedCount: number): boolean {
  return publishedCount % 2 === 1;
}

function guideSourceBlob(guide: GuideFrontmatter): string {
  const mdPath = resolve(process.cwd(), "content/guides/ru", `${guide.slug}.md`);
  let body = "";
  if (existsSync(mdPath)) {
    body = readFileSync(mdPath, "utf8")
      .replace(/^---[\s\S]*?---\n?/, "")
      .replace(/[#>*`\[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1800);
  }
  return [
    `title: ${guide.title}`,
    guide.quick_answer ? `quick_answer: ${guide.quick_answer}` : "",
    guide.excerpt ? `excerpt: ${guide.excerpt}` : "",
    guide.seo_description ? `seo: ${guide.seo_description}` : "",
    body ? `body: ${body}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function writeShortRoot(guide: GuideFrontmatter, account: GuideShortAccount): Promise<string> {
  const fallback = clipThreadsText(
    (guide.quick_answer || guide.excerpt || guide.seo_description || guide.title).trim(),
    320
  );
  try {
    const raw = await geminiFastJson<{ text: string }>(
      `Ты пишешь короткий пост для Threads аккаунта Emigro (@emigro_${account === "assist" ? "assist" : account === "invest" ? "invest" : account}).
Русский. Один абзац, 1–3 предложения, до 280 символов.
Только факт из гайда: число, срок, порог, правило или частая ловушка.
Без «я», мемуаров, эмодзи, хештегов, CTA, визарда, Telegram, «подпишись», ссылок.
Не выдумывай цифры и даты — только то, что есть во входе.`,
      `Гайд ${guide.slug}:\n${guideSourceBlob(guide)}`,
      {
        type: "OBJECT",
        properties: { text: { type: "STRING" } },
        required: ["text"],
      },
      512,
      { thinkingBudget: 0 }
    );
    const text = clipThreadsText(String(raw.text || "").trim(), 320);
    if (text.length < 40) return fallback;
    if (/https?:\/\/|t\.me\/|визард|подпишись/i.test(text)) return fallback;
    return text;
  } catch (err) {
    console.warn(
      "[guide-short] LLM failed, using quick_answer:",
      err instanceof Error ? err.message : err
    );
    return fallback;
  }
}

export async function composeGuideShortPlan(opts: {
  account: GuideShortAccount;
  usedSlugs: Iterable<string>;
  publishedCount: number;
  campaignContent?: string;
}): Promise<GuideShortPlan | null> {
  const candidates = listGuidesForAccount(opts.account, opts.usedSlugs);
  if (candidates.length === 0) return null;
  const guide = candidates[0]!;
  const withLink = shouldAttachGuideLink(opts.publishedCount);
  const root = await writeShortRoot(guide, opts.account);
  const topic = sanitizeThreadsTopicTag(countryRuOf(guide));
  const items: ThreadsChainItem[] = [
    {
      text: root,
      role: "root",
      ...(topic ? { topicTag: topic } : {}),
    },
  ];
  if (withLink) {
    const content =
      opts.campaignContent ||
      `gshort-${opts.account}-${guide.slug}`.replace(/[^a-z0-9_-]+/gi, "").slice(0, 40);
    const url = threadsGuidePageUrl(guide.slug, content);
    items.push({
      text: clipThreadsText(`Гайд со сроками и источниками:\n${url}`),
      role: "cta",
    });
  }
  return {
    kind: "guide",
    slug: guide.slug,
    countryRu: countryRuOf(guide),
    withLink,
    items,
    preview: formatThreadsChainPreview(items),
  };
}
