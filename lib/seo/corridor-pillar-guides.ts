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
    anchor: "D8 и D7 Португалия 2026 — полный гид + практика AIMA",
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
  indonesia: {
    slug: "bali-indoneziya-dlya-rossiyan-2026",
    anchor: "Бали для россиян 2026 — E33G Remote Worker",
  },
  montenegro: {
    slug: "chernogoriya-vnj-dlya-rossiyan-2026",
    anchor: "Черногория ВНЖ для россиян 2026",
  },
  uae: {
    slug: "oae-dlya-rossiyan-2026",
    anchor: "ОАЭ для россиян 2026 — резиденция и банки",
  },
  thailand: {
    slug: "tailand-dlya-rossiyan-2026",
    anchor: "Таиланд для россиян 2026 — LTR, Elite, DTV",
  },
  georgia: {
    slug: "gruziya-dlya-rossiyan-2026",
    anchor: "Грузия для россиян 2026 — въезд и налоги",
  },
};

export function corridorPillarGuideHref(segment: string): string | undefined {
  const entry = CORRIDOR_PILLAR_GUIDES[segment];
  return entry ? guidePath(entry.slug) : undefined;
}

export function corridorPillarGuideAnchor(segment: string): string | undefined {
  return CORRIDOR_PILLAR_GUIDES[segment]?.anchor;
}
