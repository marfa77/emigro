import type { ContentKind } from "@/lib/community-notes/types";

/** Curated tip/lifehack topics sourced from portugal.emigro.online (community_notes). */
export type TipShortFormat = "mistakes" | "list" | "howto" | "comparison" | "fact";

export type TipShortTopic = {
  /** Note slug on portugal.emigro.online */
  id: string;
  /** YouTube title seed */
  title: string;
  /** Hook pattern — Gemini adapts but keeps this energy */
  hookSeed: string;
  format: TipShortFormat;
  country: string;
  topic_key: string;
  guide_slug?: string;
  /** Canonical note URL on portugal.emigro.online */
  note_url?: string;
  /** Full note body for Gemini (from community_notes) */
  note_context?: string;
  content_kind?: ContentKind;
  /** Factual seeds for the script writer */
  facts: string[];
  tags: string[];
};
