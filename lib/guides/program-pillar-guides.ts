/** Pillar guide slugs linked from program pages (program slug → guide slug). */
export const PROGRAM_PILLAR_GUIDES: Record<string, string> = {
  "spain-digital-nomad": "vnj-ispaniya-2026",
  "spain-non-lucrative": "vnj-ispaniya-2026",
  "portugal-d8-digital-nomad": "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  "portugal-d7-passive-income": "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  "germany-eu-blue-card": "germaniya-blue-card-chancenkarte-2026-sng",
  "germany-chancenkarte": "germaniya-blue-card-chancenkarte-2026-sng",
  "poland-work-permit": "vnj-polsha-2026",
  "poland-eu-blue-card": "vnj-polsha-2026",
};

export function getPillarGuideSlugForProgram(programSlug: string): string | undefined {
  return PROGRAM_PILLAR_GUIDES[programSlug];
}
