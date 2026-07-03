import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import type { CommunityNote } from "@/lib/community-notes/types";
import { getProviderById } from "@/lib/providers/registry";

const PREP2GO_BASE = "https://www.prep2go.study";
export const BARAKHLO_LISBON_URL = "https://www.barakhlo.online/portugal/lisbon";

/** Notes where Prep2Go CIPLE promo is relevant. */
export function shouldShowPrep2GoPromo(note: CommunityNote): boolean {
  const primary = note.topic_tags.find((t) => t !== "portugal") ?? "";
  if (primary === "ciple") return true;
  if (note.category.toLowerCase().includes("ciple")) return true;
  if (note.hashtags.some((t) => normalizeHashtag(t) === "ciple")) return true;
  return /\b(ciple|caple)\b/i.test(`${note.title} ${note.slug}`);
}

export function prep2GoPromoUrl(noteSlug: string): string {
  const url = new URL(PREP2GO_BASE);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "satellite");
  url.searchParams.set("utm_campaign", "ciple_note");
  url.searchParams.set("utm_content", noteSlug);
  return url.toString();
}

export function barakhloPromoUrl(context: "hub" | string): string {
  const url = new URL(BARAKHLO_LISBON_URL);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "satellite");
  url.searchParams.set("utm_campaign", "portugal_lisbon");
  if (context !== "hub") url.searchParams.set("utm_content", context);
  return url.toString();
}

export function getPrep2GoProvider() {
  return getProviderById("prep2go");
}
