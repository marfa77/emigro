/**
 * Live inventory counts — prove Emigro is a stocked navigator, not a thin affiliate layer.
 * Prefer this over hardcoded marketing numbers.
 */

import { ES_ACTIVE_CORRIDORS, ES_PILLAR_GUIDE_SLUGS } from "@/lib/es/corridor";
import { FR_ACTIVE_CORRIDORS, FR_PILLAR_GUIDE_SLUGS } from "@/lib/fr/corridor";
import { listGuides } from "@/lib/guides/load";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";

export type EmigroInventory = {
  ruGuides: number;
  esPillars: number;
  esOriginHubs: number;
  esDestinations: number;
  frPillars: number;
  frOriginHubs: number;
  frDestinations: number;
  transitHubs: number;
};

export function getEmigroInventory(): EmigroInventory {
  const ruGuides = listGuides("ru").length;
  const esAll = listGuides("es");
  const esPillars = esAll.filter((g) =>
    (ES_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  ).length;
  const frAll = listGuides("fr");
  const frPillars = frAll.filter((g) =>
    (FR_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  ).length;

  return {
    ruGuides,
    esPillars,
    esOriginHubs: ES_ACTIVE_CORRIDORS.length,
    esDestinations: 2, // España + Portugal (locked frame)
    frPillars,
    frOriginHubs: FR_ACTIVE_CORRIDORS.length,
    frDestinations: 1, // France first
    transitHubs: TRANSIT_HUBS.length,
  };
}
