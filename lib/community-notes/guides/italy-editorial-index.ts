/** Aggregates hand-curated Italy editorial blueprints for seed + daily cron. */
import { ARENDA_MILANO_GUIDE } from "@/lib/community-notes/guides/italy-arenda-milano-idealista";
import { BANK_IBAN_IT_GUIDE } from "@/lib/community-notes/guides/italy-bank-iban-nerezident";
import { CODICE_FISCALE_GUIDE } from "@/lib/community-notes/guides/italy-codice-fiscale-milano";
import { INPS_PIVA_GUIDE } from "@/lib/community-notes/guides/italy-inps-partita-iva-milano";
import { KLIMAT_MILANO_GUIDE } from "@/lib/community-notes/guides/italy-klimat-byt-milano-nord";
import { MEDITSINA_MILANO_GUIDE } from "@/lib/community-notes/guides/italy-meditsina-milano-ssn";
import { MILANO_RAJONY_GUIDE } from "@/lib/community-notes/guides/italy-milano-rajony-como";
import { PERMESSO_QUESTURA_GUIDE } from "@/lib/community-notes/guides/italy-permesso-questura-milano";
import { PERVYE_30_IT_GUIDE } from "@/lib/community-notes/guides/italy-pervye-30-dnej";
import { SHKOLY_SEMYA_IT_GUIDE } from "@/lib/community-notes/guides/italy-shkoly-semya-milano";
import { SIM_LUCE_GUIDE } from "@/lib/community-notes/guides/italy-sim-internet-luce-milano";
import { TRANSPORT_MILANO_GUIDE } from "@/lib/community-notes/guides/italy-transport-milano-atm";
import { VNJ_IT_GUIDE } from "@/lib/community-notes/guides/italy-vnj-nomade-elective";
import { ZAPIS_KONSULSTVO_IT_GUIDE } from "@/lib/community-notes/guides/italy-zapis-konsulstvo-pasport";
import { ZHELTYE_MILANO_GUIDE } from "@/lib/community-notes/guides/italy-zheltye-stranitsy-milano";
import type { SatelliteLaunchSlot } from "@/lib/satellite/launch-bar";
import type { ContentKind, NoteBodySection, CommunityNoteFaq } from "@/lib/community-notes/types";

export type ItalyEditorialGuide = {
  slug: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_sections: NoteBodySection[];
  body_paragraphs: string[];
  key_takeaways: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
  hashtags: string[];
  source_channel: string;
  source_label: string | null;
  pillar_guide_slug?: string;
};

export const ITALY_EDITORIAL_GUIDES: ItalyEditorialGuide[] = [
  PERVYE_30_IT_GUIDE,
  CODICE_FISCALE_GUIDE,
  SIM_LUCE_GUIDE,
  ARENDA_MILANO_GUIDE,
  PERMESSO_QUESTURA_GUIDE,
  VNJ_IT_GUIDE,
  BANK_IBAN_IT_GUIDE,
  MEDITSINA_MILANO_GUIDE,
  MILANO_RAJONY_GUIDE,
  TRANSPORT_MILANO_GUIDE,
  SHKOLY_SEMYA_IT_GUIDE,
  ZHELTYE_MILANO_GUIDE,
  ZAPIS_KONSULSTVO_IT_GUIDE,
  INPS_PIVA_GUIDE,
  KLIMAT_MILANO_GUIDE,
];

export const ITALY_GUIDE_SLOTS: Record<SatelliteLaunchSlot, string> = {
  first_30_days: "pervye-30-dnej-v-italii-satelit-2026",
  tax_id: "codice-fiscale-milano-2026",
  home_setup: "sim-internet-luce-milano-2026",
  rent: "arenda-milano-idealista-2026",
  residence_appointment: "permesso-questura-milano-2026",
  visa_route: "vnj-italiya-nomade-elective-2026",
  bank: "bank-iban-nerezident-italiya-2026",
  health: "meditsina-milano-ssn-tessera-2026",
  districts: "milano-rajony-arenda-metro-como-2026",
  transport: "transport-milano-atm-trenord-2026",
  schools_family: "shkoly-semya-milano-como-2026",
  yellow_pages: "zheltye-stranitsy-relokanta-milano-2026",
  consulate_docs: "zapis-konsulstvo-italiya-pasport-2026",
  work_ss: "inps-partita-iva-milano-2026",
  local_life: "klimat-byt-milano-nord-como-2026",
};

export type ItalySeedNote = Omit<
  ItalyEditorialGuide,
  "pillar_guide_slug" | "hashtags" | "source_channel" | "source_label"
> & {
  topic_tags: string[];
};

export function italyGuideToSeedNote(guide: ItalyEditorialGuide): ItalySeedNote {
  const { pillar_guide_slug: _p, hashtags: _h, source_channel: _s, source_label: _l, ...rest } = guide;
  return rest;
}

export const ITALY_EDITORIAL_SEED = ITALY_EDITORIAL_GUIDES.map(italyGuideToSeedNote);

export const ITALY_EDITORIAL_SLUGS = ITALY_EDITORIAL_GUIDES.map((g) => g.slug);
