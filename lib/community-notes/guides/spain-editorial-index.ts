/** Aggregates hand-curated Spain editorial blueprints for seed + daily cron. */
import { ARENDA_VALENCIA_GUIDE } from "@/lib/community-notes/guides/spain-arenda-valencia-idealista";
import { BANK_IBAN_GUIDE } from "@/lib/community-notes/guides/spain-bank-iban-nerezident";
import { BECKHAM_GUIDE } from "@/lib/community-notes/guides/spain-beckham-autonomo-mify";
import { DNV_UGE_GUIDE } from "@/lib/community-notes/guides/spain-dnv-uge-konsulstvo";
import { NIE_EMPADRONAMIENTO_GUIDE } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_GUIDE } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { TIE_CITA_GUIDE } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
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
  NIE_EMPADRONAMIENTO_GUIDE,
  TIE_CITA_GUIDE,
  DNV_UGE_GUIDE,
  ARENDA_VALENCIA_GUIDE,
  BANK_IBAN_GUIDE,
  BECKHAM_GUIDE,
  PERVYE_30_GUIDE,
];

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
