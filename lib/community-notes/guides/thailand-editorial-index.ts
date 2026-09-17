/** Aggregates the 15 hand-curated Thailand satellite guides for seed and daily operations. */
import { ARENDA_PHUKET_DOLGOSROK_GUIDE } from "@/lib/community-notes/guides/thailand-arenda-phuket";
import { THAILAND_BANK_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-bank-account-phuket";
import { KONSULSTVO_RF_BANGKOK_DOCS_GUIDE } from "@/lib/community-notes/guides/thailand-consulate-docs";
import { MEDITSINA_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-healthcare-phuket";
import { IMMIGRATION_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-immigration-phuket";
import { KLIMAT_MUSSON_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-local-life-phuket";
import { PERVYE_30_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-pervye-30-dnej-phuket";
import { PHUKET_DISTRICTS_GUIDE } from "@/lib/community-notes/guides/thailand-phuket-districts";
import { SHKOLY_SEMYA_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-schools-family-phuket";
import { SERVISY_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-services-phuket";
import { SIM_INTERNET_UTILITIES_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-sim-internet-utilities-phuket";
import { THAILAND_TAX_ID_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-tax-id-phuket";
import { TRANSPORT_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-transport-phuket";
import { VIZA_DTV_LTR_GUIDE } from "@/lib/community-notes/guides/thailand-visa-routes";
import { THAILAND_WORK_SS_GUIDE } from "@/lib/community-notes/guides/thailand-work-social-security";
import type { SatelliteLaunchSlot } from "@/lib/satellite/launch-bar";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export type ThailandEditorialGuide = {
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

export const THAILAND_EDITORIAL_GUIDES: ThailandEditorialGuide[] = [
  PERVYE_30_PHUKET_GUIDE,
  THAILAND_TAX_ID_PHUKET_GUIDE,
  SIM_INTERNET_UTILITIES_PHUKET_GUIDE,
  ARENDA_PHUKET_DOLGOSROK_GUIDE,
  IMMIGRATION_PHUKET_GUIDE,
  THAILAND_BANK_PHUKET_GUIDE,
  MEDITSINA_PHUKET_GUIDE,
  PHUKET_DISTRICTS_GUIDE,
  VIZA_DTV_LTR_GUIDE,
  TRANSPORT_PHUKET_GUIDE,
  SHKOLY_SEMYA_PHUKET_GUIDE,
  SERVISY_PHUKET_GUIDE,
  KONSULSTVO_RF_BANGKOK_DOCS_GUIDE,
  THAILAND_WORK_SS_GUIDE,
  KLIMAT_MUSSON_PHUKET_GUIDE,
];

export const THAILAND_GUIDE_SLOTS: Record<SatelliteLaunchSlot, string> = {
  first_30_days: "pervye-30-dnej-phuket-2026",
  tax_id: "tax-id-tin-phuket-2026",
  home_setup: "sim-internet-svet-voda-phuket-2026",
  rent: "arenda-phuket-dolgosrok-2026",
  residence_appointment: "immigration-phuket-tm30-90-days-2026",
  visa_route: "viza-dtv-ltr-thailand-2026",
  bank: "bank-schet-phuket-inostrancu-2026",
  health: "meditsina-phuket-strahovka-bolnicy-2026",
  districts: "phuket-rajony-arenda-shkoly-bolnicy-2026",
  transport: "transport-phuket-baik-avto-2026",
  schools_family: "shkoly-semya-phuket-2026",
  yellow_pages: "servisy-phuket-relokant-2026",
  consulate_docs: "konsulstvo-rf-bangkok-dokumenty-2026",
  work_ss: "rabota-work-permit-social-security-thailand-2026",
  local_life: "klimat-musson-byt-phuket-2026",
};

export type ThailandSeedNote = Omit<
  ThailandEditorialGuide,
  "pillar_guide_slug" | "hashtags" | "source_channel" | "source_label"
>;

export function thailandGuideToSeedNote(guide: ThailandEditorialGuide): ThailandSeedNote {
  const { pillar_guide_slug: _pillar, hashtags: _hashtags, source_channel: _source, source_label: _label, ...rest } =
    guide;
  return rest;
}

export const THAILAND_EDITORIAL_SEED = THAILAND_EDITORIAL_GUIDES.map(thailandGuideToSeedNote);
export const THAILAND_EDITORIAL_SLUGS = THAILAND_EDITORIAL_GUIDES.map((guide) => guide.slug);
