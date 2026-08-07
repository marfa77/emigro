/** Role Radar — sister Telegram job digest for senior IT leaders. */

export const ROLE_RADAR_LANDING_PATH = "/ru/role-radar";
export const ROLE_RADAR_BOT_BASE = "https://t.me/letsfinddreamjob_bot";

/** Guide slugs with clear work / Blue Card / skilled-worker intent. */
export const ROLE_RADAR_GUIDE_SLUGS = new Set([
  "rabota-v-evrope-dlya-rossiyan-2026",
  "vnj-germaniya-2026",
  "vnj-niderlandy-2026-highly-skilled",
  "vnj-shvetsiya-2026-work-permit-grazhdanstvo",
  "velikobritaniya-2026-skilled-worker-global-talent-ilr",
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
  return topicKey === "germany";
}
