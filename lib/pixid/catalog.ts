/**
 * PixID.studio — sister product for compliant passport / visa / ID photos.
 * Deep-links use /idphoto?document=… (exact display names from PixID requirements.csv).
 */

export const PIXID_BASE = "https://www.pixid.studio";
export const PIXID_IDPHOTO_PATH = "/idphoto";

/** Emigro topic → PixID document preset (visa / residence photo for that corridor). */
export const PIXID_DOCUMENT_BY_TOPIC: Record<string, string> = {
  portugal: "Portugal Visa",
  spain: "Spain Visa (Schengen)",
  germany: "Germany Visa (Schengen)",
  france: "France Visa (Schengen)",
  italy: "Italy Visa (Schengen)",
  netherlands: "Netherlands Visa (Schengen)",
  greece: "Greece Passport",
  austria: "Austria Visa",
  norway: "Norway Visa",
  poland: "Poland Passport",
  croatia: "Croatia Passport",
  malta: "Malta Passport",
  finland: "Finland Passport",
  estonia: "Estonia Passport",
};

export type PixIdUtm = {
  medium: string;
  campaign: string;
  content?: string;
};

export function withPixIdUtm(path: string, utm: PixIdUtm): string {
  const url = new URL(path.startsWith("http") ? path : `${PIXID_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  return url.toString();
}

export function pixIdDocumentForTopic(topicKey?: string): string | undefined {
  if (!topicKey) return undefined;
  return PIXID_DOCUMENT_BY_TOPIC[topicKey];
}

/** Money URL for a corridor topic (optional document preset). */
export function pixIdPhotoUrl(opts: {
  topicKey?: string;
  medium: string;
  campaign: string;
  content?: string;
}): string {
  const url = new URL(PIXID_IDPHOTO_PATH, PIXID_BASE);
  const document = pixIdDocumentForTopic(opts.topicKey);
  if (document) url.searchParams.set("document", document);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", opts.medium);
  url.searchParams.set("utm_campaign", opts.campaign);
  if (opts.content) url.searchParams.set("utm_content", opts.content);
  return url.toString();
}
