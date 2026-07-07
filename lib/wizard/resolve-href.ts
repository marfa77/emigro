import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { getCorridorBySegment } from "@/lib/corridor/registry";
import { firstCountryTopicKeyForWizardInterest } from "@/lib/guides/guide-display";

function withQueryParams(path: string, params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function appendInterest(href: string, interestKey?: string): string {
  if (!interestKey) return href;
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  if (!params.has("interest")) {
    params.set("interest", interestKey);
  }
  return withQueryParams(path, params);
}

/** Normalize any CTA href to a wizard URL — hub or corridor-specific. */
export function resolveGuideWizardHref(href: string | undefined, topicKeys?: string[]): string {
  const interestKey = firstCountryTopicKeyForWizardInterest(topicKeys);
  const raw = (href ?? HUB_WIZARD_PATH).trim();

  if (raw.includes("/wizard")) {
    return appendInterest(raw, interestKey);
  }

  if (raw === "/ru/ukraine") {
    return appendInterest(HUB_WIZARD_PATH, interestKey ?? "ukraine");
  }

  const landingMatch = /^\/ru\/([a-z]+)$/.exec(raw);
  if (landingMatch) {
    const segment = landingMatch[1];
    const corridor = getCorridorBySegment(segment);
    if (corridor?.wizardEnabled) {
      return appendInterest(`/ru/${segment}/wizard`, interestKey ?? segment);
    }
    return appendInterest(HUB_WIZARD_PATH, interestKey ?? segment);
  }

  if (raw === "/ru" || !raw.startsWith("/ru")) {
    return appendInterest(HUB_WIZARD_PATH, interestKey);
  }

  return appendInterest(HUB_WIZARD_PATH, interestKey);
}

export function isWizardHref(href: string): boolean {
  return /\/wizard(\/|$|\?)/.test(href) || href === HUB_WIZARD_PATH;
}
