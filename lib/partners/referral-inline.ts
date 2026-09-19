import { DEFAULT_EXTERNAL_AD_REL } from "@/lib/partners/link";
import {
  REVOLUT_OFFERS,
  REVOLUT_REFERRAL_PROVIDER_ID,
  visibleRevolutOffers,
  type RevolutLiveMap,
  type RevolutReferralKind,
} from "@/lib/partners/revolut-referral";
import {
  isAllowedWiseReferralUrl,
  isWiseLiveOfferVisible,
  WISE_REFERRAL_CAMPAIGN,
  WISE_REFERRAL_PRODUCT,
  WISE_REFERRAL_PROVIDER_ID,
  type WiseLiveOffer,
} from "@/lib/partners/wise-referral";

export type ReferralInlineProvider = "revolut" | "wise";

export type ReferralInlineTarget = {
  provider: ReferralInlineProvider;
  product: string;
  campaign: string;
  url: string;
  phrase: string;
};

export type ReferralInlineLiveUrls = {
  revolutPersonal?: string;
  revolutBusiness?: string;
  wise?: string;
};

const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "button", "code", "pre", "script", "style", "svg", "th"]);
const VOID_TAGS = new Set(["br", "hr", "img", "input", "link", "meta", "source", "wbr"]);
const LINK_CLASS = "text-corridor-700 underline decoration-corridor-300 underline-offset-2 hover:text-corridor-900";

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function sortTargets(targets: ReferralInlineTarget[]): ReferralInlineTarget[] {
  return [...targets].sort((a, b) => b.phrase.length - a.phrase.length);
}

export function referralInlineTargets(input: {
  revolut?: { offers: RevolutReferralKind[]; live: RevolutLiveMap } | null;
  wise?: { live: WiseLiveOffer } | null;
}): ReferralInlineTarget[] {
  const targets: ReferralInlineTarget[] = [];
  const revolut = input.revolut;
  if (revolut) {
    const visible = visibleRevolutOffers(revolut.offers, revolut.live);
    if (visible.includes("personal")) {
      targets.push({
        provider: "revolut",
        product: "personal",
        campaign: REVOLUT_OFFERS.personal.campaign,
        url: revolut.live.personal.url,
        phrase: "Revolut",
      });
    }
    if (visible.includes("business")) {
      targets.push({
        provider: "revolut",
        product: "business",
        campaign: REVOLUT_OFFERS.business.campaign,
        url: revolut.live.business.url,
        phrase: "Revolut Business",
      });
    }
  }
  const wise = input.wise?.live;
  if (wise && isWiseLiveOfferVisible(wise)) {
    targets.push({
      provider: "wise",
      product: WISE_REFERRAL_PRODUCT,
      campaign: WISE_REFERRAL_CAMPAIGN,
      url: wise.url,
      phrase: "Wise",
    });
  }
  return sortTargets(targets);
}

export function liveUrlsFromTargets(targets: ReferralInlineTarget[]): ReferralInlineLiveUrls {
  const live: ReferralInlineLiveUrls = {};
  for (const target of targets) {
    if (target.provider === "wise") live.wise = target.url;
    if (target.provider === "revolut" && target.product === "personal") live.revolutPersonal = target.url;
    if (target.provider === "revolut" && target.product === "business") live.revolutBusiness = target.url;
  }
  return live;
}

export function classifyReferralUrl(raw: string): Omit<ReferralInlineTarget, "url" | "phrase"> | null {
  const href = raw.trim();
  if (!href) return null;
  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase();
    if (isAllowedWiseReferralUrl(href)) {
      return {
        provider: "wise",
        product: WISE_REFERRAL_PRODUCT,
        campaign: WISE_REFERRAL_CAMPAIGN,
      };
    }
    if (host === "business.revolut.com") {
      return {
        provider: "revolut",
        product: "business",
        campaign: REVOLUT_OFFERS.business.campaign,
      };
    }
    if (
      (host === "revolut.com" || host === "www.revolut.com") &&
      (url.pathname.toLowerCase().includes("/referral") || url.searchParams.has("referral-code"))
    ) {
      return {
        provider: "revolut",
        product: "personal",
        campaign: REVOLUT_OFFERS.personal.campaign,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function partnerReferralAnchorAttrs(href: string): {
  rel: string;
  dataset: Record<string, string>;
} | null {
  const classified = classifyReferralUrl(href);
  if (!classified) return null;
  return {
    rel: DEFAULT_EXTERNAL_AD_REL,
    dataset: {
      "data-partner-referral": classified.provider,
      "data-partner-product": classified.product,
      "data-partner-campaign": classified.campaign,
    },
  };
}

function wrapHtml(label: string, target: ReferralInlineTarget): string {
  return (
    `<a href="${escapeAttr(target.url)}" target="_blank" rel="${DEFAULT_EXTERNAL_AD_REL}"` +
    ` class="${LINK_CLASS}" data-partner-referral="${target.provider}"` +
    ` data-partner-product="${target.product}" data-partner-campaign="${target.campaign}">${label}</a>`
  );
}

function wrapMarkdown(label: string, target: ReferralInlineTarget): string {
  return `[${label}](${target.url})`;
}

function replaceMentions(
  text: string,
  targets: ReferralInlineTarget[],
  wrap: (label: string, target: ReferralInlineTarget) => string
): string {
  if (!text || targets.length === 0) return text;
  const pattern = new RegExp(`\\b(?:${targets.map((target) => escapeRegExp(target.phrase)).join("|")})\\b`, "g");
  return text.replace(pattern, (match) => {
    const target = targets.find((item) => item.phrase === match);
    return target ? wrap(match, target) : match;
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tagInfo(token: string): { name: string; closing: boolean; selfClosing: boolean } | null {
  if (!token.startsWith("<") || token.startsWith("<!") || token.startsWith("<?")) return null;
  const match = token.match(/^<\/?([a-zA-Z0-9]+)/);
  if (!match) return null;
  const name = match[1].toLowerCase();
  const closing = token.startsWith("</");
  const selfClosing = closing ? false : VOID_TAGS.has(name) || /\/\s*>$/.test(token);
  return { name, closing, selfClosing };
}

/** Link brand mentions in HTML. Skips headings, existing links, and table headers. */
export function injectReferralInlineLinks(html: string, targets: ReferralInlineTarget[]): string {
  const ordered = sortTargets(targets);
  if (!html || ordered.length === 0) return html;

  const stack: string[] = [];
  return html
    .split(/(<[^>]+>)/g)
    .map((token) => {
      if (token.startsWith("<")) {
        const info = tagInfo(token);
        if (info && !info.selfClosing) {
          if (info.closing) {
            for (let i = stack.length - 1; i >= 0; i -= 1) {
              if (stack[i] === info.name) {
                stack.splice(i);
                break;
              }
            }
          } else {
            stack.push(info.name);
          }
        }
        return token;
      }
      if (!token || stack.some((name) => SKIP_TAGS.has(name))) return token;
      return replaceMentions(token, ordered, wrapHtml);
    })
    .join("");
}

/** Link brand mentions in markdown, leaving existing `[text](url)` spans alone. */
export function injectReferralMarkdownLinks(text: string, targets: ReferralInlineTarget[]): string {
  const ordered = sortTargets(targets);
  if (!text || ordered.length === 0) return text;
  return text
    .split(/(\[[^\]]+\]\([^)]+\))/g)
    .map((part) => {
      if (part.startsWith("[")) return part;
      return replaceMentions(part, ordered, wrapMarkdown);
    })
    .join("");
}

export function mapReferralMarkdownTree<T>(value: T, targets: ReferralInlineTarget[]): T {
  if (!targets.length || value == null) return value;
  if (typeof value === "string") return injectReferralMarkdownLinks(value, targets) as T;
  if (Array.isArray(value)) return value.map((item) => mapReferralMarkdownTree(item, targets)) as T;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) {
      if (key === "heading" || key === "columns" || key === "q" || key === "official_links") {
        next[key] = item;
      } else {
        next[key] = mapReferralMarkdownTree(item, targets);
      }
    }
    return next as T;
  }
  return value;
}

export function applyNoteReferralLinks<T extends {
  quick_answer: string;
  key_takeaways: string[];
  body_paragraphs: string[];
  body_sections: unknown;
  faq: unknown;
}>(note: T, targets: ReferralInlineTarget[]): T {
  if (!targets.length) return note;
  const linked = mapReferralMarkdownTree(
    {
      quick_answer: note.quick_answer,
      key_takeaways: note.key_takeaways,
      body_paragraphs: note.body_paragraphs,
      body_sections: note.body_sections,
      faq: note.faq,
    },
    targets
  );
  return { ...note, ...linked };
}

export { REVOLUT_REFERRAL_PROVIDER_ID, WISE_REFERRAL_PROVIDER_ID };
