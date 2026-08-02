import { guidePath } from "@/lib/guides/paths";

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
    slug: "vnj-germaniya-2026",
    anchor: "EU Blue Card и Chancenkarte 2026",
  },
  italy: {
    slug: "vnj-italiya-2026-digital-nomad",
    anchor: "Digital Nomad Италия 2026 — виза, Permesso, налоги",
  },
  poland: {
    slug: "vnj-polsha-2026",
    anchor: "ВНЖ Польша 2026 — work permit и Blue Card",
  },
  czechia: {
    slug: "vnj-chehiya-2026",
    anchor: "ВНЖ Чехия 2026",
  },
  greece: {
    slug: "vnj-gretsiya-2026-digital-nomad-fip-golden-visa",
    anchor: "ВНЖ Греция 2026 — Digital Nomad, FIP, Golden Visa",
  },
  cyprus: {
    slug: "vnj-kipr-2026-digital-nomad-fip-non-dom",
    anchor: "ВНЖ Кипр 2026 — Digital Nomad, Category F, Non-Dom",
  },
  hungary: {
    slug: "vnj-vengriya-2026-white-card-guest-investor",
    anchor: "ВНЖ Венгрия 2026 — White Card, Guest Investor",
  },
  malta: {
    slug: "vnj-malta-2026-nomad-mprp-non-dom",
    anchor: "ВНЖ Мальта 2026 — NRP, MPRP, Non-Dom",
  },
  bulgaria: {
    slug: "vnj-bolgariya-2026-type-d-digital-nomad-eood",
    anchor: "ВНЖ Болгария 2026 — Type D, Digital Nomad, EOOD",
  },
  croatia: {
    slug: "vnj-horvatiya-2026-digital-nomad",
    anchor: "ВНЖ Хорватия 2026 — Digital Nomad, 18 месяцев",
  },
  slovenia: {
    slug: "vnj-sloveniya-2026-digital-nomad-sp",
    anchor: "ВНЖ Словения 2026 — Digital Nomad + s.p.",
  },
  estonia: {
    slug: "vnj-estoniya-2026-digital-nomad-e-residency",
    anchor: "Эстония 2026 — Digital Nomad Visa + e-Residency",
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
