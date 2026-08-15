/**
 * Compose a Threads reply-chain from Emigro content.
 *
 * Meta limit: **500 characters**. Cyrillic / Latin = 1 each.
 * Emojis (and regional-indicator flags) count as their UTF-8 **byte** length.
 *
 * Default chain: root (as much as fits) → overflow replies → Telegram CTA.
 * Never silently drop slides — overflow becomes the next reply posts.
 */
import { threadsTelegramBridgeUrl } from "@/lib/threads/config";

/** Minimal draft shape (avoids import cycle with threads-repost-style). */
export type ThreadsComposeDraft = {
  headline: string;
  slides: string[];
};

/** Threads text limit (Meta characters, emoji-as-bytes). Leave a small safety margin. */
export const THREADS_TEXT_MAX_CHARS = 500;
/** @deprecated alias — prefer THREADS_TEXT_MAX_CHARS (Meta counts chars, not raw UTF-8). */
export const THREADS_TEXT_MAX_BYTES = THREADS_TEXT_MAX_CHARS;
const THREADS_TEXT_SAFE = 490;

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
  /** Story OG / cover — ignored for text-only root. */
  imageUrl?: string;
  ctaMode?: "page" | "telegram" | "both";
};

/** True for code points Meta treats like emoji (byte-cost). */
function isThreadsEmojiCodePoint(cp: number): boolean {
  return (
    (cp >= 0x1f1e0 && cp <= 0x1f1ff) || // regional indicators (flags)
    (cp >= 0x1f300 && cp <= 0x1faff) || // misc pictographs / supplemental
    (cp >= 0x1f000 && cp <= 0x1f02f) ||
    (cp >= 0x2600 && cp <= 0x27bf) || // misc symbols
    (cp >= 0xfe00 && cp <= 0xfe0f) || // variation selectors
    cp === 0x200d || // ZWJ
    cp === 0x20e3 // combining enclosing keycap
  );
}

/**
 * Meta Threads character cost: normal chars = 1, emoji/flags = UTF-8 bytes.
 * Cyrillic counts as 1 (not 2 bytes).
 */
export function threadsTextCost(text: string): number {
  let cost = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (isThreadsEmojiCodePoint(cp)) {
      cost += Buffer.byteLength(ch, "utf8");
    } else {
      cost += 1;
    }
  }
  return cost;
}

/** @deprecated use threadsTextCost — kept for older call sites. */
export function threadsUtf8ByteLength(text: string): number {
  return threadsTextCost(text);
}

/** Clip to max Meta cost without splitting a code point. */
export function clipThreadsText(text: string, maxCost = THREADS_TEXT_SAFE): string {
  const t = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (threadsTextCost(t) <= maxCost) return t;

  const ellipsis = "…";
  const budget = maxCost - threadsTextCost(ellipsis);
  let out = "";
  for (const ch of t) {
    const next = out + ch;
    if (threadsTextCost(next) > budget) break;
    out = next;
  }
  const soft = out.replace(/\s+\S*$/, "").trimEnd();
  if (soft.length >= Math.min(40, Math.floor(out.length * 0.6))) {
    return `${soft}${ellipsis}`;
  }
  return `${out.trimEnd()}${ellipsis}`;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Country/flag live in topic_tag — strip them from the body headline.
 */
export function stripCountryFromHeadline(
  headline: string,
  countryRu?: string,
  flag?: string
): string {
  let h = headline.trim();
  const f = (flag || "").trim();
  if (f) {
    h = h.replace(new RegExp(`^${escapeRegExp(f)}\\s*`), "").trim();
  }
  const country = (countryRu || "").trim();
  if (country.length >= 2) {
    h = h
      .replace(new RegExp(`^${escapeRegExp(country)}\\s*[:—\\-]\\s*`, "i"), "")
      .replace(new RegExp(`^${escapeRegExp(country)}\\s+`, "i"), "")
      .trim();
  }
  if (h && h !== headline.trim()) {
    h = h.charAt(0).toLocaleUpperCase("ru-RU") + h.slice(1);
  }
  return h || headline.trim();
}

/**
 * Split full body into ≤SAFE segments. Never drops content (except within a
 * single unbreakable segment longer than SAFE, which is clipped once).
 */
export function splitThreadsBodySegments(
  parts: string[],
  maxCost = THREADS_TEXT_SAFE
): string[] {
  const segments: string[] = [];
  let current = "";

  const pushCurrent = () => {
    const t = current.trim();
    if (t) segments.push(t);
    current = "";
  };

  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;

    // Whole part fits alone after current — append.
    const candidate = current ? `${current}\n\n${part}` : part;
    if (threadsTextCost(candidate) <= maxCost) {
      current = candidate;
      continue;
    }

    // Flush current, then fit `part` (possibly split further by sentences/words).
    pushCurrent();

    if (threadsTextCost(part) <= maxCost) {
      current = part;
      continue;
    }

    // Oversized single part: hard-clip into consecutive chunks.
    let rest = part;
    while (rest) {
      const chunk = clipThreadsText(rest, maxCost);
      segments.push(chunk);
      if (chunk.endsWith("…") && threadsTextCost(rest) > maxCost) {
        // Advance past what we took (approx by character walk matching cost).
        let taken = "";
        const budget = maxCost - threadsTextCost("…");
        for (const ch of rest) {
          const next = taken + ch;
          if (threadsTextCost(next) > budget) break;
          taken = next;
        }
        const soft = taken.replace(/\s+\S*$/, "").trimEnd();
        const advance = (soft.length >= Math.min(40, Math.floor(taken.length * 0.6))
          ? soft
          : taken
        ).length;
        rest = rest.slice(Math.max(advance, 1)).trim();
      } else {
        rest = "";
      }
    }
  }

  pushCurrent();
  return segments;
}

/**
 * Pack root + overflow replies under Meta’s character limit.
 * No country/flag in body (those go to topic_tag).
 */
export function packThreadsRoot(params: ComposeThreadsChainParams): string {
  const segments = packThreadsBodySegments(params);
  return segments[0] || clipThreadsText(params.headline);
}

export function packThreadsBodySegments(params: ComposeThreadsChainParams): string[] {
  const headline = stripCountryFromHeadline(
    params.headline,
    params.countryRu,
    params.flag
  );
  const slides = params.slides.map((s) => s.trim()).filter(Boolean);
  return splitThreadsBodySegments([headline, ...slides]);
}

/** Second post (or last): soft Telegram subscribe via Emigro bridge. */
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
  const base = (
    siteBase ||
    process.env.EMIGRO_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.emigro.online"
  ).replace(/\/$/, "");
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
 * Build chain: root (+ overflow slide replies) + Telegram CTA.
 * Root never attaches IMAGE — caption stays clean.
 */
export function composeThreadsChain(params: ComposeThreadsChainParams): ThreadsChainItem[] {
  const topicTag = sanitizeThreadsTopicTag(params.countryRu);
  const segments = packThreadsBodySegments(params);
  const items: ThreadsChainItem[] = segments.map((text, i) => ({
    text,
    role: i === 0 ? ("root" as const) : ("slide" as const),
    ...(i === 0 && topicTag ? { topicTag } : {}),
  }));
  if (items.length === 0) {
    items.push({
      text: clipThreadsText(params.headline || params.countryRu || "Emigro"),
      role: "root",
      ...(topicTag ? { topicTag } : {}),
    });
  }
  items.push({ text: buildTelegramSubscribeCta(params.telegramUrl), role: "cta" });
  return items;
}

export function composeThreadsChainFromRepost(params: {
  countryRu: string;
  flag?: string;
  draft: ThreadsComposeDraft;
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
      const cost = threadsTextCost(item.text);
      const img = item.imageUrl ? `\n[image] ${item.imageUrl}` : "";
      const topic = item.topicTag ? `\n[topic] ${item.topicTag}` : "";
      return `—— ${n} (${item.role}, ${cost}/${THREADS_TEXT_MAX_CHARS}) ——${img}${topic}\n${item.text}`;
    })
    .join("\n\n");
}
