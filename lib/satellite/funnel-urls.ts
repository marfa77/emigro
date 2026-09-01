/**
 * Satellite → www funnel URLs with UTM for attribution.
 * Keep campaign names stable so Vercel Analytics / site_events stay comparable.
 */
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";

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
  return countryKey === "spain" ? SPAIN_SATELLITE : PORTUGAL_SATELLITE;
}

/** Absolute Assist URL on www (Route Check / accompaniment intake). */
export function satelliteAssistUrl(opts: UtmOpts & { countrySegment?: string }): string {
  const countryKey = opts.countryKey;
  const segment = opts.countrySegment ?? countryKey;
  const url = new URL("https://www.emigro.online/ru/assist");
  url.searchParams.set("country", segment);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "satellite");
  url.searchParams.set("utm_campaign", `${countryKey}_assist`);
  url.searchParams.set("utm_placement", opts.placement);
  if (opts.content) url.searchParams.set("utm_content", opts.content);
  url.hash = "assist-form";
  return url.toString();
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
