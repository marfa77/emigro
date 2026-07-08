/**
 * Legacy curated topic IDs (pre–community-note Shorts) map to note slugs on portugal.emigro.online.
 * If any slug in a group is published, in GCS, or on @Emigro_news, treat the whole group as done.
 *
 * Manual YouTube uploads (Jul 2026):
 * - nif-one-day ↔ «NIF за 1 день» ↔ nif-lissabon-chto-puutayut
 * - lisbon-rent-2026 ↔ «Аренда 2026: сколько стоит» ↔ arenda-lissabon-do-podpisi
 * - lisbon-free-museums-vnj ↔ «Музеи БЕСПЛАТНО с ВНЖ» ↔ lgoty-s-vnj-kulturnye-mesta-2026
 * - aima-3-mistakes ↔ «3 ошибки при записи в AIMA» (standalone; aima-agora-zapis-2026 stays in queue)
 */
export const TIP_TOPIC_EQUIVALENT_GROUPS: readonly (readonly string[])[] = [
  ["nif-one-day", "nif-lissabon-chto-puutayut"],
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
