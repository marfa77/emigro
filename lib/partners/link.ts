/**
 * Sister-site outbound links (Prep2Go, UniPrep2Go).
 * Omit `noreferrer` so partner analytics still see Emigro as Referer.
 * Keep `noopener` for tabnabbing safety; add `sponsored` on paid/native placements.
 */

const SISTER_HOST_SUFFIXES = [
  "prep2go.study",
  "uniprep2go.study",
] as const;

export const PARTNER_LINK_REL = "noopener";
export const PARTNER_AD_REL = "noopener sponsored";
export const DEFAULT_EXTERNAL_REL = "noopener noreferrer";
export const DEFAULT_EXTERNAL_AD_REL = "noopener noreferrer sponsored";

function hostnameOf(href: string): string | null {
  try {
    return new URL(href).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isSisterSiteUrl(href: string): boolean {
  const host = hostnameOf(href);
  if (!host) return false;
  return SISTER_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

/** rel for outbound <a>. Sister sites keep Referer; others stay noreferrer. */
export function externalLinkRel(href: string, opts?: { sponsored?: boolean }): string {
  const sponsored = opts?.sponsored === true;
  if (isSisterSiteUrl(href)) {
    return sponsored ? PARTNER_AD_REL : PARTNER_LINK_REL;
  }
  return sponsored ? DEFAULT_EXTERNAL_AD_REL : DEFAULT_EXTERNAL_REL;
}

/**
 * News / citation source links: first-party sisters pass equity (dofollow);
 * third-party publishers stay nofollow.
 */
export function sourceLinkRel(href: string): string {
  if (isSisterSiteUrl(href)) return PARTNER_LINK_REL;
  return "noopener noreferrer nofollow";
}
