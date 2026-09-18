/**
 * Dubai Offer Verdict (uaeproperty.vip) — sister due-diligence tool.
 * Compares a Dubai broker ask with DLD-registered sold prices.
 * Not a property lead partner: never auto-assign investment leads here.
 */

export const DUBAI_OFFER_VERDICT = {
  id: "dubai-offer-verdict",
  name: "Dubai Offer Verdict",
  domain: "uaeproperty.vip",
  url: "https://uaeproperty.vip",
  blogGoldenVisa: "https://www.uaeproperty.vip/blog/golden-visa-dubai-property",
  role: "dld_due_diligence" as const,
  countries: ["uae"] as const,
} as const;

export function dubaiOfferVerdictUrl(opts: {
  medium: string;
  campaign: string;
  content?: string;
}): string {
  const url = new URL(DUBAI_OFFER_VERDICT.url);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", opts.medium);
  url.searchParams.set("utm_campaign", opts.campaign);
  if (opts.content) url.searchParams.set("utm_content", opts.content);
  return url.toString();
}

export function showsDubaiOfferVerdict(country: string | undefined | null): boolean {
  return country?.trim().toLowerCase() === "uae";
}
