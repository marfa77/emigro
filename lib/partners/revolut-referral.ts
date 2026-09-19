export const REVOLUT_REFERRAL_TIMEZONE = "Europe/Lisbon";
export const REVOLUT_REFERRAL_PROVIDER_ID = "revolut";

export type RevolutReferralKind = "personal" | "business";
export type RevolutReferralPlacement =
  | "guide_article"
  | "guide_sidebar"
  | "guide_inline"
  | "satellite_note"
  | "satellite_note_inline";

export type RevolutLiveOffer = {
  kind: RevolutReferralKind;
  url: string;
  endsOn: string;
  enabled: boolean;
};

export type RevolutLiveMap = Record<RevolutReferralKind, RevolutLiveOffer>;

type RevolutOfferConfig = {
  kind: RevolutReferralKind;
  endsOn: string;
  campaign: string;
  product: RevolutReferralKind;
  defaultUrl: string;
  envKeys: readonly string[];
};

export const REVOLUT_OFFERS: Record<RevolutReferralKind, RevolutOfferConfig> = {
  personal: {
    kind: "personal",
    endsOn: "2026-10-06",
    campaign: "revolut_sep2_26",
    product: "personal",
    defaultUrl: "https://revolut.com/referral/?referral-code=p_veselov!SEP2-26-AR-H2&geo-redirect",
    envKeys: ["NEXT_PUBLIC_REVOLUT_REFERRAL_URL", "REVOLUT_REFERRAL_URL"],
  },
  business: {
    kind: "business",
    endsOn: "2026-10-07",
    campaign: "revolut_biz_sep2_26",
    product: "business",
    defaultUrl:
      "https://business.revolut.com/signup?promo=C2B-SEP2-26-AR-H1&ext=p_veselov&context=C2B_REFERRAL",
    envKeys: ["NEXT_PUBLIC_REVOLUT_BUSINESS_REFERRAL_URL", "REVOLUT_BUSINESS_REFERRAL_URL"],
  },
};

/** @deprecated use REVOLUT_OFFERS.personal.endsOn */
export const REVOLUT_REFERRAL_ENDS_ON = REVOLUT_OFFERS.personal.endsOn;
/** @deprecated use REVOLUT_OFFERS.personal.campaign */
export const REVOLUT_REFERRAL_CAMPAIGN = REVOLUT_OFFERS.personal.campaign;

const PERSONAL_GUIDE_SLUGS = [
  "bank-i-iban-dlya-rossiyan-v-evrope-2026",
  "pervye-30-dnej-v-portugalii-2026",
] as const;

const PERSONAL_NOTE_SLUGS = [
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "bank-iban-nerezident-ispaniya-2026",
  "bank-iban-nerezident-italiya-2026",
  "pervyj-mesyac-portugaliya-checklist",
] as const;

const BUSINESS_GUIDE_SLUGS = [
  "bank-i-iban-dlya-rossiyan-v-evrope-2026",
  "pervye-30-dnej-v-portugalii-2026",
  "kak-otkryt-ip-za-rubezhom-rossiyane-2026",
  "nalogi-pri-pereezde-v-evropu-2026",
  "nalogovye-spetsrezhimy-es-2026",
  "vnj-estoniya-2026-digital-nomad-e-residency",
] as const;

const BUSINESS_NOTE_SLUGS = [
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "bank-iban-nerezident-ispaniya-2026",
  "bank-iban-nerezident-italiya-2026",
  "pervyj-mesyac-portugaliya-checklist",
  "inps-partita-iva-milano-2026",
  "alta-ss-hacienda-valencia-2026",
  "beckham-autonomo-mify-2026",
  "nif-porto-kak-poluchit-2026",
] as const;

export const REVOLUT_REFERRAL_GUIDE_SLUGS = PERSONAL_GUIDE_SLUGS;
export const REVOLUT_REFERRAL_NOTE_SLUGS = PERSONAL_NOTE_SLUGS;

export function lisbonCalendarDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REVOLUT_REFERRAL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isDateOnOrBefore(endsOn: string, now: Date = new Date()): boolean {
  return lisbonCalendarDate(now) <= endsOn;
}

export function isRevolutOfferActive(
  kind: RevolutReferralKind,
  now: Date = new Date(),
  endsOn: string = REVOLUT_OFFERS[kind].endsOn
): boolean {
  return isDateOnOrBefore(endsOn, now);
}

export function isAnyRevolutReferralActive(now: Date = new Date()): boolean {
  return isRevolutOfferActive("personal", now) || isRevolutOfferActive("business", now);
}

/** Personal offer — kept for older call sites. */
export function isRevolutReferralActive(now: Date = new Date()): boolean {
  return isRevolutOfferActive("personal", now);
}

export function revolutOfferUrl(kind: RevolutReferralKind): string {
  const offer = REVOLUT_OFFERS[kind];
  for (const key of offer.envKeys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return offer.defaultUrl;
}

export function revolutReferralUrl(): string {
  return revolutOfferUrl("personal");
}

const ALLOWED_REVOLUT_HOSTS = new Set(["revolut.com", "www.revolut.com", "business.revolut.com"]);

export function isAllowedRevolutReferralUrl(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return false;
    return ALLOWED_REVOLUT_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function defaultRevolutLiveOffer(kind: RevolutReferralKind): RevolutLiveOffer {
  const offer = REVOLUT_OFFERS[kind];
  return {
    kind,
    url: revolutOfferUrl(kind),
    endsOn: offer.endsOn,
    enabled: true,
  };
}

export function defaultRevolutLiveMap(): RevolutLiveMap {
  return {
    personal: defaultRevolutLiveOffer("personal"),
    business: defaultRevolutLiveOffer("business"),
  };
}

export function mergeRevolutLiveOffer(
  kind: RevolutReferralKind,
  row: { url?: string | null; endsOn?: string | null; enabled?: boolean | null } | null
): RevolutLiveOffer {
  const fallback = defaultRevolutLiveOffer(kind);
  const url = row?.url?.trim();
  const rawEnds = row?.endsOn?.trim();
  const endsOn = rawEnds ? rawEnds.slice(0, 10) : "";
  return {
    kind,
    url: url && isAllowedRevolutReferralUrl(url) ? url : fallback.url,
    endsOn: endsOn && /^\d{4}-\d{2}-\d{2}$/.test(endsOn) ? endsOn : fallback.endsOn,
    enabled: row?.enabled !== false,
  };
}

export function isRevolutLiveOfferVisible(offer: RevolutLiveOffer, now: Date = new Date()): boolean {
  return offer.enabled && Boolean(offer.url) && isDateOnOrBefore(offer.endsOn, now);
}

export function visibleRevolutOffers(
  kinds: RevolutReferralKind[],
  live: RevolutLiveMap,
  now: Date = new Date()
): RevolutReferralKind[] {
  return kinds.filter((kind) => isRevolutLiveOfferVisible(live[kind], now));
}

export function formatRevolutEndsOnLabel(endsOn: string): string {
  const [year, month, day] = endsOn.split("-").map(Number);
  if (!year || !month || !day) return endsOn;
  const months = ["янв.", "февр.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."];
  return `${day} ${months[month - 1]} ${year}`;
}

function uniqueKinds(kinds: RevolutReferralKind[]): RevolutReferralKind[] {
  return kinds.filter((kind, index) => kinds.indexOf(kind) === index);
}

export function revolutOffersForGuide(slug: string): RevolutReferralKind[] {
  const kinds: RevolutReferralKind[] = [];
  if ((PERSONAL_GUIDE_SLUGS as readonly string[]).includes(slug)) kinds.push("personal");
  if ((BUSINESS_GUIDE_SLUGS as readonly string[]).includes(slug)) kinds.push("business");
  return uniqueKinds(kinds);
}

export function revolutOffersForNote(slug: string): RevolutReferralKind[] {
  const kinds: RevolutReferralKind[] = [];
  if ((PERSONAL_NOTE_SLUGS as readonly string[]).includes(slug)) kinds.push("personal");
  if ((BUSINESS_NOTE_SLUGS as readonly string[]).includes(slug)) kinds.push("business");
  return uniqueKinds(kinds);
}

export function shouldShowRevolutReferralOnGuide(slug: string, now: Date = new Date()): boolean {
  return visibleRevolutOffers(revolutOffersForGuide(slug), defaultRevolutLiveMap(), now).length > 0;
}

export function shouldShowRevolutReferralOnNote(slug: string, now: Date = new Date()): boolean {
  return visibleRevolutOffers(revolutOffersForNote(slug), defaultRevolutLiveMap(), now).length > 0;
}

export type RevolutOfferClickStats = {
  clicksToday: number;
  clicksYesterday: number;
  clicks7d: number;
  clicksCampaign: number;
};

export type RevolutReferralStats = {
  active: boolean;
  endsOn: string;
  personalEndsOn: string;
  businessEndsOn: string;
  clicksToday: number;
  clicksYesterday: number;
  clicks7d: number;
  clicksCampaign: number;
  personal: RevolutOfferClickStats;
  business: RevolutOfferClickStats;
  byContent: Array<[string, number]>;
};

function emptyOfferClicks(): RevolutOfferClickStats {
  return { clicksToday: 0, clicksYesterday: 0, clicks7d: 0, clicksCampaign: 0 };
}

export function emptyRevolutReferralStats(): RevolutReferralStats {
  return {
    active: false,
    endsOn: REVOLUT_OFFERS.business.endsOn,
    personalEndsOn: REVOLUT_OFFERS.personal.endsOn,
    businessEndsOn: REVOLUT_OFFERS.business.endsOn,
    clicksToday: 0,
    clicksYesterday: 0,
    clicks7d: 0,
    clicksCampaign: 0,
    personal: emptyOfferClicks(),
    business: emptyOfferClicks(),
    byContent: [],
  };
}

export function formatRevolutReferralTelegramLine(stats: RevolutReferralStats): string | null {
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
  const pages = tops ? ` · ${tops}` : "";
  return (
    `<b>💳 Revolut ref</b> личка <b>${stats.personal.clicksToday}</b> до ${stats.personalEndsOn}` +
    ` · юрик <b>${stats.business.clicksToday}</b> до ${stats.businessEndsOn}` +
    ` · сегодня <b>${stats.clicksToday}</b>${deltaLabel} · 7д ${stats.clicks7d} · всего ${stats.clicksCampaign}${pages}`
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
