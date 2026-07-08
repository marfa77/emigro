/**
 * Legacy curated topic IDs (pre–community-note Shorts) map to note slugs on portugal.emigro.online.
 * If any slug in a group is published or has a short.mp4 artifact, treat the whole group as done.
 */
export const TIP_TOPIC_EQUIVALENT_GROUPS: readonly (readonly string[])[] = [
  ["aima-3-mistakes", "aima-agora-zapis-2026"],
  ["lisbon-rent-2026", "arenda-lissabon-do-podpisi"],
  ["lisbon-free-museums-vnj", "lgoty-s-vnj-kulturnye-mesta-2026"],
];

export function expandEquivalentTopicSlugs(slugs: Iterable<string>): Set<string> {
  const expanded = new Set(slugs);
  for (const group of TIP_TOPIC_EQUIVALENT_GROUPS) {
    if (group.some((slug) => expanded.has(slug))) {
      for (const slug of group) expanded.add(slug);
    }
  }
  return expanded;
}
