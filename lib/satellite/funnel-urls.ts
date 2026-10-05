/**
 * Satellite → www funnel URLs with UTM for attribution.
 * Keep campaign names stable so Vercel Analytics / site_events stay comparable.
 */
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import type { AssistPlanTier } from "@/lib/telegram/bot/types";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";

export type SatelliteFunnelPlacement =
  | "satellite_note"
  | "satellite_hub"
  | "satellite_hub_scenarios"
  | "satellite_hub_intake";

type UtmOpts = {
  countryKey: SatelliteCountryKey;
  placement: SatelliteFunnelPlacement;
  /** note slug or hub scenario id */
  content?: string;
};

function withUtm(rawUrl: string, campaign: string, opts: UtmOpts): string {
  const url = new URL(rawUrl);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "satellite");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_placement", opts.placement);
  if (opts.content) url.searchParams.set("utm_content", opts.content);
  return url.toString();
}

function satelliteConfig(countryKey: SatelliteCountryKey) {
  if (countryKey === "spain") return SPAIN_SATELLITE;
  if (countryKey === "italy") return ITALY_SATELLITE;
  if (countryKey === "thailand") return THAILAND_SATELLITE;
  return PORTUGAL_SATELLITE;
}

/** RU conversion closes in @emigro_chat_bot — same deep link as news. */
export function satelliteAssistUrl(opts: UtmOpts & { countrySegment?: string; hash?: string }): string {
  const hash = opts.hash ?? "assist-form";
  const tier: AssistPlanTier =
    hash.includes("route-check")
      ? "route-check"
      : hash.includes("accompaniment")
        ? "accompaniment"
        : "partner-match";
  return assistBotDeepLink({ country: opts.countrySegment ?? opts.countryKey, tier });
}

export function satelliteWizardUrl(opts: UtmOpts): string {
  const cfg = satelliteConfig(opts.countryKey);
  return withUtm(cfg.wizardUrl, `${opts.countryKey}_wizard`, opts);
}

export function satelliteHubUrl(opts: UtmOpts): string {
  const cfg = satelliteConfig(opts.countryKey);
  return withUtm(cfg.mainSiteUrl, `${opts.countryKey}_hub`, opts);
}

export function satellitePillarUrl(opts: UtmOpts): string {
  const cfg = satelliteConfig(opts.countryKey);
  return withUtm(cfg.pillarGuideUrl, `${opts.countryKey}_pillar`, opts);
}

export function satelliteDigestUrl(opts: UtmOpts): string {
  const cfg = satelliteConfig(opts.countryKey);
  return withUtm(cfg.digestUrl, `${opts.countryKey}_digest`, opts);
}
