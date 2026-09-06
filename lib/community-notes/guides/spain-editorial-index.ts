/** Aggregates hand-curated Spain editorial blueprints for seed + daily cron. */
import { ALTA_SS_HACIENDA_GUIDE } from "@/lib/community-notes/guides/spain-alta-ss-hacienda-valencia";
import { ARENDA_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-arenda-valencia-idealista";
import { BANK_IBAN_GUIDE } from "@/lib/community-notes/guides/spain-bank-iban-nerezident";
import { DNV_UGE_GUIDE } from "@/lib/community-notes/guides/spain-dnv-uge-konsulstvo";
import { KLIMAT_BYT_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-klimat-byt-valencia";
import { MEDITSINA_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-meditsina-valencia-sip";
import { NIE_EMPADRONAMIENTO_GUIDE } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_GUIDE } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { SHKOLY_SEMYA_GUIDE } from "@/lib/community-notes/guides/spain-shkoly-semya-valencia";
import { SIM_INTERNET_LUZ_GUIDE } from "@/lib/community-notes/guides/spain-sim-internet-luz-valencia";
import { TIE_CITA_GUIDE } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
import { TRANSPORT_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-transport-valencia-metro-emt";
import { VALENCIA_RAJONY_GUIDE } from "@/lib/community-notes/guides/spain-valencia-rajony";
import { ZAPIS_KONSULSTVO_ES_GUIDE } from "@/lib/community-notes/guides/spain-zapis-konsulstvo-pasport";
import { ZHELTYE_STRANITSY_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-zheltye-stranitsy-valencia";
import type { SatelliteLaunchSlot } from "@/lib/satellite/launch-bar";
import type { ContentKind, NoteBodySection, CommunityNoteFaq } from "@/lib/community-notes/types";

export type SpainEditorialGuide = {
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

export const SPAIN_EDITORIAL_GUIDES: SpainEditorialGuide[] = [
  PERVYE_30_GUIDE,
  NIE_EMPADRONAMIENTO_GUIDE,
  SIM_INTERNET_LUZ_GUIDE,
  ARENDA_VALENCIA_GUIDE,
  TIE_CITA_GUIDE,
  BANK_IBAN_GUIDE,
  MEDITSINA_VALENCIA_GUIDE,
  VALENCIA_RAJONY_GUIDE,
  DNV_UGE_GUIDE,
  TRANSPORT_VALENCIA_GUIDE,
  SHKOLY_SEMYA_GUIDE,
  ZHELTYE_STRANITSY_VALENCIA_GUIDE,
  ZAPIS_KONSULSTVO_ES_GUIDE,
  ALTA_SS_HACIENDA_GUIDE,
  KLIMAT_BYT_VALENCIA_GUIDE,
];

/** All 15 gold life slots. Beckham myths stay a side note, not a launch slot. */
export const SPAIN_GUIDE_SLOTS: Record<SatelliteLaunchSlot, string> = {
  first_30_days: "pervye-30-dnej-v-ispanii-satelit-2026",
  tax_id: "nie-empadronamiento-poryadok-2026",
  home_setup: "sim-internet-luz-valencia-2026",
  rent: "arenda-valencia-idealista-2026",
  residence_appointment: "tie-cita-extranjeria-valencia-2026",
  visa_route: "dnv-uge-konsulstvo-2026",
  bank: "bank-iban-nerezident-ispaniya-2026",
  health: "meditsina-valencia-sip-sns-chastnaya-2026",
  districts: "valencia-rajony-arenda-shkoly-metro-2026",
  transport: "transport-valencia-metro-emt-coche-2026",
  schools_family: "shkoly-semya-valencia-2026",
  yellow_pages: "zheltye-stranitsy-relokanta-valencia-2026",
  consulate_docs: "zapis-konsulstvo-ispanija-pasport-2026",
  work_ss: "alta-ss-hacienda-valencia-2026",
  local_life: "klimat-byt-valencia-4-6-mes-2026",
};

export type SpainSeedNote = Omit<
  SpainEditorialGuide,
  "pillar_guide_slug" | "hashtags" | "source_channel" | "source_label"
> & {
  topic_tags: string[];
};

/** Map full editorial guides to Supabase seed rows. */
export function spainGuideToSeedNote(guide: SpainEditorialGuide): SpainSeedNote {
  const { pillar_guide_slug: _p, hashtags: _h, source_channel: _s, source_label: _l, ...rest } = guide;
  return rest;
}

export const SPAIN_EDITORIAL_SEED = SPAIN_EDITORIAL_GUIDES.map(spainGuideToSeedNote);

export const SPAIN_EDITORIAL_SLUGS = SPAIN_EDITORIAL_GUIDES.map((g) => g.slug);
