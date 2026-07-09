import { guidePath } from "@/lib/guides/load";

/** Primary pillar guide per corridor segment — for internal links from landing/digest/news. */
export const CORRIDOR_PILLAR_GUIDES: Record<
  string,
  { slug: string; anchor: string }
> = {
  spain: {
    slug: "vnj-ispaniya-2026",
    anchor: "Digital nomad Испания 2026 — полный гид",
  },
  portugal: {
    slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    anchor: "D8 и D7 Португалия 2026",
  },
  germany: {
    slug: "germaniya-blue-card-chancenkarte-2026-sng",
    anchor: "EU Blue Card и Chancenkarte 2026",
  },
  poland: {
    slug: "vnj-polsha-2026",
    anchor: "ВНЖ Польша 2026 — work permit и Blue Card",
  },
  czechia: {
    slug: "vnj-chehiya-2026",
    anchor: "ВНЖ Чехия 2026",
  },
};

export function corridorPillarGuideHref(segment: string): string | undefined {
  const entry = CORRIDOR_PILLAR_GUIDES[segment];
  return entry ? guidePath(entry.slug) : undefined;
}

export function corridorPillarGuideAnchor(segment: string): string | undefined {
  return CORRIDOR_PILLAR_GUIDES[segment]?.anchor;
}
