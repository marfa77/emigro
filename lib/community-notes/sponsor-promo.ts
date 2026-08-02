import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import type { CommunityNote } from "@/lib/community-notes/types";

import { barakhloMarketUrl } from "@/lib/barakhlo/markets";

const PREP2GO_BASE = "https://www.prep2go.study";
export const BARAKHLO_LISBON_URL = barakhloMarketUrl("portugal");

/** Notes where Prep2Go CIPLE promo is relevant. */
export function shouldShowPrep2GoPromo(note: CommunityNote): boolean {
  const primary = note.topic_tags.find((t) => t !== "portugal") ?? "";
  if (primary === "ciple") return true;
  if (note.category.toLowerCase().includes("ciple")) return true;
  if (note.hashtags.some((t) => normalizeHashtag(t) === "ciple")) return true;
  return /\b(ciple|caple)\b/i.test(`${note.title} ${note.slug}`);
}

/** Notes where PixID visa/passport photo promo is relevant (document-photo moment only). */
export function shouldShowPixIdPromo(note: CommunityNote): boolean {
  if (note.hashtags.some((t) => /^(foto|photo|passport-photo|биометр)/i.test(normalizeHashtag(t)))) {
    return true;
  }
  const blob = `${note.title} ${note.slug}`;
  return /(zagran|passport|passaporte|foto[-_]|photo[-_]|биометр|biometric|tie-cita|huellas|foto\s+на|фото\s+на)/i.test(
    blob
  );
}

export function prep2GoPromoUrl(noteSlug: string, path = "/"): string {
  const url = new URL(path, PREP2GO_BASE);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "satellite");
  url.searchParams.set("utm_campaign", "ciple_note");
  url.searchParams.set("utm_content", noteSlug);
  return url.toString();
}

export function barakhloPromoUrl(context: string, segment = "portugal", medium: "hub" | "satellite" = "hub"): string {
  const url = new URL(barakhloMarketUrl(segment));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", segment);
  if (context !== "hub") url.searchParams.set("utm_content", context);
  return url.toString();
}

export function isServiceDiscoveryNote(noteSlug: string, category: string): boolean {
  return /poisk-mestnyh|uslug|master|маник|ветерин/i.test(`${noteSlug} ${category}`);
}
