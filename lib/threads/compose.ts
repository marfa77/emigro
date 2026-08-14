/**
 * Compose a Threads reply-chain from Emigro content.
 * Default: 2 posts — (1) OG image + packed caption ≤500 UTF-8 bytes, (2) Telegram CTA.
 *
 * Meta counts emojis/flags as UTF-8 **bytes**, not JS string length.
 */
import { threadsTelegramBridgeUrl } from "@/lib/threads/config";
import type { ThreadsRepostDraft } from "@/lib/news/threads-repost-style";

/** Threads text limit (UTF-8 bytes). Leave a small safety margin. */
export const THREADS_TEXT_MAX_BYTES = 500;
const THREADS_TEXT_SAFE_BYTES = 490;

export type ThreadsChainItem = {
  text: string;
  role: "root" | "slide" | "cta";
  /** Public https URL — root becomes media_type=IMAGE when set. */
  imageUrl?: string;
  /** Threads header “Community or topic” (no emoji/flag). */
  topicTag?: string;
};

export type ComposeThreadsChainParams = {
  countryRu: string;
  flag?: string;
  headline: string;
  slides: string[];
  pageUrl?: string;
  telegramUrl?: string;
  /** Story OG / cover — attached to the first post. */
  imageUrl?: string;
  ctaMode?: "page" | "telegram" | "both";
};

export function threadsUtf8ByteLength(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

/** Clip to max UTF-8 bytes without splitting a multi-byte code point. */
export function clipThreadsText(text: string, maxBytes = THREADS_TEXT_SAFE_BYTES): string {
  const t = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (threadsUtf8ByteLength(t) <= maxBytes) return t;

  const ellipsis = "…";
  const budget = maxBytes - threadsUtf8ByteLength(ellipsis);
  let out = "";
  for (const ch of t) {
    const next = out + ch;
    if (threadsUtf8ByteLength(next) > budget) break;
    out = next;
  }
  // Prefer cutting at whitespace when close to the end.
  const soft = out.replace(/\s+\S*$/, "").trimEnd();
  if (soft.length >= Math.min(40, Math.floor(out.length * 0.6))) {
    return `${soft}${ellipsis}`;
  }
  return `${out.trimEnd()}${ellipsis}`;
}

function countryHeader(flag: string | undefined, countryRu: string): string {
  const name = countryRu.trim();
  const f = (flag || "").trim();
  return f ? `${f} ${name}` : name;
}

/**
 * Pack root caption under the byte limit.
 * Prefer whole slides; drop trailing slides rather than mid-word spam when possible.
 */
export function packThreadsRoot(params: ComposeThreadsChainParams): string {
  const flag = (params.flag || "").trim();
  const countryRu = params.countryRu.trim();
  const headline = params.headline.trim();
  const slides = params.slides.map((s) => s.trim()).filter(Boolean);

  const headlineHasCountry =
    countryRu.length >= 3 && headline.toLowerCase().includes(countryRu.toLowerCase());

  const lead = headlineHasCountry
    ? flag
      ? `${flag} ${headline}`
      : headline
    : [countryHeader(flag, countryRu), headline].filter(Boolean).join("\n\n");

  let body = lead;
  for (const slide of slides) {
    const candidate = `${body}\n\n${slide}`;
    if (threadsUtf8ByteLength(candidate) <= THREADS_TEXT_SAFE_BYTES) {
      body = candidate;
      continue;
    }
    // Try to fit a truncated last slide if we still have room.
    const sep = "\n\n";
    const used = threadsUtf8ByteLength(body) + threadsUtf8ByteLength(sep);
    const room = THREADS_TEXT_SAFE_BYTES - used;
    if (room >= 80) {
      body = `${body}${sep}${clipThreadsText(slide, room)}`;
    }
    break;
  }

  return clipThreadsText(body, THREADS_TEXT_SAFE_BYTES);
}

/** Second post: soft Telegram subscribe via Emigro bridge (nice OG, no telegram.me card). */
export function buildTelegramSubscribeCta(telegramUrl?: string): string {
  const url = (telegramUrl || threadsTelegramBridgeUrl()).trim();
  return clipThreadsText(
    ["В Telegram больше всего по релокации и визам — подпишитесь, если полезно:", "", url].join(
      "\n"
    )
  );
}

/** Absolute OG image URL for a news story (Next opengraph-image route). */
export function newsStoryThreadsImageUrl(slug: string, siteBase?: string): string {
  const base = (siteBase || process.env.EMIGRO_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.emigro.online")
    .replace(/\/$/, "");
  return `${base}/ru/news/${encodeURIComponent(slug)}/opengraph-image`;
}

/** Sanitize for Threads topic_tag: 1–50 chars, no `.` or `&`. */
export function sanitizeThreadsTopicTag(raw: string | undefined | null): string | undefined {
  const t = String(raw || "")
    .replace(/[.&]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50);
  return t.length >= 1 ? t : undefined;
}

/**
 * Build chain: root (text + country topic) + Telegram CTA reply.
 * Root never attaches IMAGE — caption stays clean.
 */
export function composeThreadsChain(params: ComposeThreadsChainParams): ThreadsChainItem[] {
  const topicTag = sanitizeThreadsTopicTag(params.countryRu);
  return [
    {
      text: packThreadsRoot(params),
      role: "root",
      ...(topicTag ? { topicTag } : {}),
    },
    { text: buildTelegramSubscribeCta(params.telegramUrl), role: "cta" },
  ];
}

export function composeThreadsChainFromRepost(params: {
  countryRu: string;
  flag?: string;
  draft: ThreadsRepostDraft;
  pageUrl?: string;
  telegramUrl?: string;
  /** Ignored — root posts are text-only. */
  imageUrl?: string;
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
      const bytes = threadsUtf8ByteLength(item.text);
      const img = item.imageUrl ? `\n[image] ${item.imageUrl}` : "";
      const topic = item.topicTag ? `\n[topic] ${item.topicTag}` : "";
      return `—— ${n} (${item.role}, ${bytes} bytes) ——${img}${topic}\n${item.text}`;
    })
    .join("\n\n");
}
