import { formatRevolutEndsOnLabel, isDateOnOrBefore } from "@/lib/partners/revolut-referral";

export const WISE_REFERRAL_PROVIDER_ID = "wise";
export const WISE_REFERRAL_CAMPAIGN = "wise_invite_irhc";
export const WISE_REFERRAL_PRODUCT = "personal";

export type WiseReferralPlacement = "guide_article" | "guide_sidebar" | "satellite_note";

export type WiseLiveOffer = {
  url: string;
  endsOn: string;
  enabled: boolean;
};

const GUIDE_SLUGS = [
  "bank-i-iban-dlya-rossiyan-v-evrope-2026",
  "pervye-30-dnej-v-portugalii-2026",
] as const;

const NOTE_SLUGS = [
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "bank-iban-nerezident-ispaniya-2026",
  "bank-iban-nerezident-italiya-2026",
  "pervyj-mesyac-portugaliya-checklist",
] as const;

export const WISE_DEFAULT_URL = "https://wise.com/invite/irhc/pavelv418";

const ALLOWED_WISE_HOSTS = new Set(["wise.com", "www.wise.com"]);

export function isAllowedWiseReferralUrl(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return false;
    if (!ALLOWED_WISE_HOSTS.has(url.hostname.toLowerCase())) return false;
    return url.pathname.toLowerCase().startsWith("/invite/");
  } catch {
    return false;
  }
}

export function defaultWiseLiveOffer(): WiseLiveOffer {
  const fromEnv = process.env.NEXT_PUBLIC_WISE_REFERRAL_URL?.trim() || process.env.WISE_REFERRAL_URL?.trim();
  return {
    url: fromEnv && isAllowedWiseReferralUrl(fromEnv) ? fromEnv : WISE_DEFAULT_URL,
    endsOn: "",
    enabled: true,
  };
}

export function mergeWiseLiveOffer(
  row: { url?: string | null; endsOn?: string | null; enabled?: boolean | null } | null
): WiseLiveOffer {
  const fallback = defaultWiseLiveOffer();
  const url = row?.url?.trim();
  const rawEnds = row?.endsOn?.trim();
  const endsOn = rawEnds ? rawEnds.slice(0, 10) : "";
  const dated = endsOn && /^\d{4}-\d{2}-\d{2}$/.test(endsOn) ? endsOn : "";
  return {
    url: url && isAllowedWiseReferralUrl(url) ? url : fallback.url,
    endsOn: dated && dated < "2099-01-01" ? dated : "",
    enabled: row?.enabled !== false,
  };
}

export function isWiseLiveOfferVisible(offer: WiseLiveOffer, now: Date = new Date()): boolean {
  if (!offer.enabled || !offer.url) return false;
  if (!offer.endsOn) return true;
  return isDateOnOrBefore(offer.endsOn, now);
}

export function wiseOfferForGuide(slug: string): boolean {
  return (GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function wiseOfferForNote(slug: string): boolean {
  return (NOTE_SLUGS as readonly string[]).includes(slug);
}

export function formatWiseEndsOnLabel(endsOn: string): string {
  return formatRevolutEndsOnLabel(endsOn);
}

export type WiseReferralStats = {
  active: boolean;
  endsOn: string;
  clicksToday: number;
  clicksYesterday: number;
  clicks7d: number;
  clicksCampaign: number;
  byContent: Array<[string, number]>;
};

export function emptyWiseReferralStats(): WiseReferralStats {
  return {
    active: false,
    endsOn: "",
    clicksToday: 0,
    clicksYesterday: 0,
    clicks7d: 0,
    clicksCampaign: 0,
    byContent: [],
  };
}

export function formatWiseReferralTelegramLine(stats: WiseReferralStats): string | null {
  if (!stats.active) return null;
  const tops = stats.byContent
    .slice(0, 3)
    .map(([slug, count]) => {
      const short = slug.length <= 28 ? slug : `${slug.slice(0, 25)}…`;
      return `<code>${escapeHtml(short)}</code>×${count}`;
    })
    .join(" · ");
  const delta = stats.clicksToday - stats.clicksYesterday;
  const deltaLabel = delta > 0 ? ` (+${delta} к вчера)` : delta < 0 ? ` (${delta} к вчера)` : " (= вчера)";
  const until = stats.endsOn ? ` до ${stats.endsOn}` : "";
  const pages = tops ? ` · ${tops}` : "";
  return (
    `<b>🌍 Wise ref</b>${until} сегодня <b>${stats.clicksToday}</b>${deltaLabel}` +
    ` · 7д ${stats.clicks7d} · всего ${stats.clicksCampaign}${pages}`
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
