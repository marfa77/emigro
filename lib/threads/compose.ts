/**
 * Compose a Threads reply-chain from Emigro content.
 * Default: 2 posts — (1) country + hook + body packed, (2) Telegram subscribe CTA.
 */
import { THREADS_DEFAULT_TG_URL } from "@/lib/threads/config";
import type { ThreadsRepostDraft } from "@/lib/news/threads-repost-style";

/** Threads text limit per post. */
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
  /** Emigro article / guide URL (optional footnote on root if room). */
  pageUrl?: string;
  /** Telegram channel URL for the 2nd post. */
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

/** Single body post: flag/country + hook + slides packed (no micro-slicing). */
export function packThreadsRoot(params: ComposeThreadsChainParams): string {
  const header = countryHeader(params.flag, params.countryRu);
  const headline = params.headline.trim();
  const slides = params.slides.map((s) => s.trim()).filter(Boolean);

  const parts: string[] = [];
  if (header) parts.push(header);
  if (headline) parts.push(headline);
  if (slides.length) parts.push(slides.join("\n\n"));

  return clip(parts.join("\n\n"));
}

/** Second post only: soft Telegram subscribe + “there’s more there”. */
export function buildTelegramSubscribeCta(telegramUrl?: string): string {
  const tg = (telegramUrl || THREADS_DEFAULT_TG_URL).trim();
  return clip(
    [
      "В Telegram больше всего по релокации и визам — подпишитесь, если полезно:",
      "",
      tg,
    ].join("\n")
  );
}

/**
 * Build chain for Threads API: root (packed) + Telegram CTA reply.
 * Never emits one-slide-per-reply — that was too fine-grained.
 */
export function composeThreadsChain(params: ComposeThreadsChainParams): ThreadsChainItem[] {
  return [
    { text: packThreadsRoot(params), role: "root" },
    { text: buildTelegramSubscribeCta(params.telegramUrl), role: "cta" },
  ];
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
