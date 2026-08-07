/** Role Radar — sister Telegram bot: job digests matched to an uploaded CV. */

export const ROLE_RADAR_LANDING_PATH = "/ru/role-radar";
export const ROLE_RADAR_BOT_BASE = "https://t.me/letsfinddreamjob_bot";

/**
 * Guide slugs with work / skilled / job-offer intent.
 * Includes EU work pillars and settle hubs where readers hunt employment or remote roles.
 */
export const ROLE_RADAR_GUIDE_SLUGS = new Set([
  "rabota-v-evrope-dlya-rossiyan-2026",
  "vnj-germaniya-2026",
  "vnj-niderlandy-2026-highly-skilled",
  "vnj-shvetsiya-2026-work-permit-grazhdanstvo",
  "vnj-norvegiya-2026",
  "velikobritaniya-2026-skilled-worker-global-talent-ilr",
  "oae-dlya-rossiyan-2026",
  "yuar-dlya-rossiyan-ukraintsev-belorusov-kazahstantsev-2026",
  "vnj-serbiya-dlya-rossiyan-2026",
  "armeniya-dlya-rossiyan-2026",
  "gruziya-dlya-rossiyan-2026",
  "chernogoriya-vnj-dlya-rossiyan-2026",
  "kazahstan-dlya-rossiyan-2026",
]);

/** Settle / transit hub slugs (`/ru/[country]`) with employment or remote job intent. */
export const ROLE_RADAR_HUB_SLUGS = new Set([
  "uae",
  "south-africa",
  "serbia",
  "armenia",
  "georgia",
  "montenegro",
  "kazakhstan",
]);

export const ROLE_RADAR_PROGRAM_SLUGS = new Set([
  "germany-eu-blue-card",
  "germany-chancenkarte",
]);

export function roleRadarBotHref(start = "web"): string {
  const payload = (start || "web").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 64) || "web";
  return `${ROLE_RADAR_BOT_BASE}?start=${payload}`;
}

export function withRoleRadarLandingUtm(
  medium: string,
  opts?: { content?: string; campaign?: string }
): string {
  const params = new URLSearchParams({
    utm_source: "emigro",
    utm_medium: medium,
    utm_campaign: opts?.campaign || "role_radar",
  });
  if (opts?.content) params.set("utm_content", opts.content);
  return `${ROLE_RADAR_LANDING_PATH}?${params.toString()}`;
}

export function shouldShowRoleRadarOnGuide(slug: string): boolean {
  return ROLE_RADAR_GUIDE_SLUGS.has(slug);
}

export function shouldShowRoleRadarOnProgram(slug: string): boolean {
  return ROLE_RADAR_PROGRAM_SLUGS.has(slug);
}

export function shouldShowRoleRadarOnCorridor(topicKey: string): boolean {
  return topicKey === "germany" || topicKey === "netherlands" || topicKey === "sweden";
}

export function shouldShowRoleRadarOnHub(hubSlug: string): boolean {
  return ROLE_RADAR_HUB_SLUGS.has(hubSlug);
}
