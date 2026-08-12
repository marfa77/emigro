/**
 * Compose a Threads reply-chain from Emigro content.
 * Post 1: country header + hook. Middle: slides. Last: CTA + page or Telegram link.
 */
import { THREADS_DEFAULT_TG_URL } from "@/lib/threads/config";
import type { ThreadsRepostDraft } from "@/lib/news/threads-repost-style";

const MAX_CHARS = 500;

export type ThreadsChainItem = {
  text: string;
  role: "root" | "slide" | "cta";
};

export type ComposeThreadsChainParams = {
  countryRu: string;
  flag?: string;
  headline: string;
  slides: string[];
  /** Emigro article / guide URL (preferred on last slide). */
  pageUrl?: string;
  /** Telegram channel URL; used if no pageUrl or as secondary line. */
  telegramUrl?: string;
  ctaMode?: "page" | "telegram" | "both";
};

function clip(text: string, max = MAX_CHARS): string {
  const t = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function countryHeader(flag: string | undefined, countryRu: string): string {
  const name = countryRu.trim();
  const f = (flag || "").trim();
  return f ? `${f} ${name}` : name;
}

function buildCta(params: ComposeThreadsChainParams): string {
  const mode = params.ctaMode ?? (params.pageUrl ? "page" : "telegram");
  const tg = (params.telegramUrl || THREADS_DEFAULT_TG_URL).trim();
  const page = (params.pageUrl || "").trim();

  const lines: string[] = [
    "Если откликнулось — поддержите подпиской или лайком.",
    "",
  ];

  if (mode === "page" || mode === "both") {
    if (page) lines.push(page, "");
  }
  if (mode === "telegram" || mode === "both") {
    lines.push(`Канал в Telegram: ${tg}`);
  }
  if (mode === "page" && !page && tg) {
    lines.push(`Канал в Telegram: ${tg}`);
  }

  return clip(lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n").trim());
}

/**
 * Build numbered chain texts ready for Threads API (root + replies).
 */
export function composeThreadsChain(params: ComposeThreadsChainParams): ThreadsChainItem[] {
  const header = countryHeader(params.flag, params.countryRu);
  const headline = params.headline.trim();
  const slides = params.slides.map((s) => s.trim()).filter(Boolean).slice(0, 5);

  const root = clip(`${header}\n\n${headline}`);
  const items: ThreadsChainItem[] = [{ text: root, role: "root" }];

  for (const slide of slides) {
    items.push({ text: clip(slide), role: "slide" });
  }

  items.push({ text: buildCta(params), role: "cta" });
  return items;
}

export function composeThreadsChainFromRepost(params: {
  countryRu: string;
  flag?: string;
  draft: ThreadsRepostDraft;
  pageUrl?: string;
  telegramUrl?: string;
  ctaMode?: "page" | "telegram" | "both";
}): ThreadsChainItem[] {
  return composeThreadsChain({
    countryRu: params.countryRu,
    flag: params.flag,
    headline: params.draft.headline,
    slides: params.draft.slides,
    pageUrl: params.pageUrl,
    telegramUrl: params.telegramUrl,
    ctaMode: params.ctaMode,
  });
}

/** Human preview for dry-run / DM. */
export function formatThreadsChainPreview(items: ThreadsChainItem[]): string {
  return items
    .map((item, i) => {
      const n = `${i + 1}/${items.length}`;
      return `—— ${n} (${item.role}) ——\n${item.text}`;
    })
    .join("\n\n");
}
