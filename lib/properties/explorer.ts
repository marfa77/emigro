import type { ExplorerProject } from "@/components/properties/CatalogExplorer";
import { SIDE_LABEL, STATUS_LABEL, STATUS_TONE, formatEur, type CatalogProject } from "@/lib/properties/catalog";
import { portugalNovostroykiPath } from "@/lib/satellite/paths";
import type { Typology } from "@/lib/properties/types";

const TYPOLOGY_ORDER: Typology[] = ["T0", "T1", "T2", "T3", "T4", "T5"];

export function ppmLabel(p: CatalogProject): string {
  if (p.ppmMin == null) return "—";
  const lo = p.ppmMin.toLocaleString("ru-RU");
  const hi = p.ppmMax!.toLocaleString("ru-RU");
  return p.ppmMin === p.ppmMax ? `${lo} €` : `${lo}–${hi} €`;
}

/** Plain, serializable row for the client explorer. */
export function toExplorerProject(p: CatalogProject): ExplorerProject {
  return {
    slug: p.slug,
    pin: p.pin,
    name: p.name,
    tagline: p.tagline,
    href: portugalNovostroykiPath(p.slug),
    side: p.side,
    status: p.status,
    statusLabel: STATUS_LABEL[p.status],
    statusTone: STATUS_TONE[p.status],
    sideLabel: SIDE_LABEL[p.side],
    lat: p.lat,
    lng: p.lng,
    parkM: p.parkM,
    walkMin: p.walkMin,
    band: p.band,
    completion: p.completion,
    typologies: p.typologies,
    fromByTypology: p.fromByTypology,
    fromLabels: TYPOLOGY_ORDER.filter((t) => p.fromByTypology[t] != null).map((t) => ({
      typology: t,
      label: formatEur(p.fromByTypology[t]),
    })),
    ppmLabel: ppmLabel(p),
    onSale: p.onSale,
    unknownCount: p.unknowns.length,
    conflictCount: p.conflicts.length,
  };
}
