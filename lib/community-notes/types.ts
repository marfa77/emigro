export type CommunityNoteFaq = { q: string; a: string };
export type CommunityNoteLink = { title: string; url: string };
export type ContentKind = "news" | "lifehack" | "tip" | "guide" | "qa";

export type GlossaryTerm = {
  /** Portuguese term (PT-PT) */
  pt: string;
  /** Russian explanation */
  ru: string;
  /** Optional disambiguation or organ name */
  context?: string;
};

/** Inline figure for guide sections (hosted under /images/…). */
export type NoteBodyImage = {
  src: string;
  alt: string;
  caption?: string;
  /** Producer / rights line, e.g. "Taylor's" */
  credit?: string;
  /** Link to the source page on the producer site */
  creditUrl?: string;
  /**
   * How the image fills the gallery frame.
   * `contain` — full subject visible (bottles, floor plans); default `cover` crops to landscape.
   */
  fit?: "cover" | "contain";
};

/** Interactive map pin for guide sections (Google Maps). */
export type NoteBodyMapMarker = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  subtitle?: string;
  url?: string;
};

export type NoteBodyMap = {
  center: { lat: number; lng: number };
  zoom?: number;
  markers: NoteBodyMapMarker[];
};

/** Comparison / catalog table inside a guide section. */
export type NoteBodyTable = {
  columns: string[];
  rows: string[][];
};

export type NoteBodySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  images?: NoteBodyImage[];
  map?: NoteBodyMap;
  table?: NoteBodyTable;
  /** official = portal rules; practice = chat/field experience; gap = where they diverge; glossary = PT-PT terms; action_guide = пошагово для новичка */
  section_kind?: "official" | "practice" | "gap" | "glossary" | "action_guide";
};

export type CommunityNote = {
  id: string;
  slug: string;
  country_key: string;
  city: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  key_takeaways: string[];
  faq: CommunityNoteFaq[];
  official_links: CommunityNoteLink[];
  source_channel: string | null;
  source_label: string | null;
  topic_tags: string[];
  hashtags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CommunitySignal = {
  id: string;
  channel_username: string;
  channel_title: string | null;
  message_id: number;
  post_url: string | null;
  text: string;
  topic_hints: string[];
  content_kind: ContentKind;
  hashtags: string[];
  city: string;
  country_key: string;
  posted_at: string;
  status: "new" | "reviewed" | "published" | "dismissed";
  note_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CommunitySignalIngest = {
  message_id: number;
  channel_username: string;
  channel_title?: string;
  post_url?: string;
  text: string;
  topic_hints?: string[];
  content_kind?: ContentKind;
  hashtags?: string[];
  city?: string;
  country_key?: string;
  posted_at: string;
};
