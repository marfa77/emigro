import { listGuides, type GuideFrontmatter } from "@/lib/guides/load";

/** High-intent pillar guides — homepage links, Yandex tracking, featured slots. */
export const PILLAR_GUIDE_SLUGS = [
  "belorusy-v-evropu-vnj-2026",
  "kuda-pereehat-iz-rossii-2026-evropa-vnj",
  "vnj-ispaniya-2026",
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  "vnj-germaniya-2026",
  "digital-nomad-portugaliya-ispaniya-italiya-2026",
  "kazahstantsy-v-evropu-vnj-2026",
  "relokatsiya-s-detmi-evropa-shkoly-vnj-2026",
  "nalogi-pri-pereezde-v-evropu-2026",
  "investitsionnyy-vnj-evropa-golden-visa-2026",
  "vnj-polsha-2026",
  "gruziya-dlya-rossiyan-2026",
  "bali-indoneziya-dlya-rossiyan-2026",
  "chernogoriya-vnj-dlya-rossiyan-2026",
  "germaniya-blue-card-chancenkarte-2026-sng",
] as const;

export function isPillarGuideSlug(slug: string): boolean {
  return (PILLAR_GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function listPillarGuides(): GuideFrontmatter[] {
  const bySlug = new Map(listGuides().map((g) => [g.slug, g]));
  return PILLAR_GUIDE_SLUGS.flatMap((slug) => {
    const guide = bySlug.get(slug);
    return guide ? [guide] : [];
  });
}
