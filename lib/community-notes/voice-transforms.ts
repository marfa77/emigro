/**
 * Lightweight programmatic voice transforms — no Gemini.
 * Strips channel attribution, trims takeaways, preserves facts.
 */
import { applyBlueprintFixes } from "@/lib/community-notes/article-blueprint";
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { LITERARY_GLOSSARY_INTRO_DEFAULT } from "@/lib/community-notes/glossary";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import type { CommunityNote, NoteBodySection } from "@/lib/community-notes/types";

const CHANNEL_ATTRIB_RE = /@[\w\d_]+|\([a-z_]+,\s*20\d{2}[^)]*\)/gi;
const BUREAUCRACY_RE = /в соответствии с|важно отметить|на фоне изменений/gi;

export function stripChannelAttribution(text: string): string {
  return text
    .replace(CHANNEL_ATTRIB_RE, "")
    .replace(BUREAUCRACY_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

function transformSections(sections: NoteBodySection[]): NoteBodySection[] {
  return sections.map((section) => {
    if (isGlossarySection(section)) {
      const intro = section.paragraphs?.[0]?.trim();
      const needsIntro =
        !intro || intro.startsWith("Ключевые термины") || intro.length < 40;
      return {
        ...section,
        paragraphs: needsIntro ? [LITERARY_GLOSSARY_INTRO_DEFAULT] : section.paragraphs?.map(stripChannelAttribution),
        bullets: section.bullets?.map(stripChannelAttribution),
      };
    }
    const paragraphs = (section.paragraphs ?? []).map(stripChannelAttribution);
    const hasGlavnoe = paragraphs.some((p) => /главное\s*:/i.test(p));
    if (!hasGlavnoe && paragraphs.length > 0) {
      const last = paragraphs[paragraphs.length - 1] ?? "";
      if (last.length > 30 && !last.endsWith(".")) {
        paragraphs[paragraphs.length - 1] = `${last}.`;
      }
    }
    return {
      ...section,
      paragraphs,
      bullets: section.bullets?.map(stripChannelAttribution),
    };
  });
}

/** Apply voice transforms in-place; returns changed note fields. */
export function applyVoiceTransforms(note: CommunityNote): {
  quick_answer: string;
  key_takeaways: string[];
  body_sections: NoteBodySection[];
  body_paragraphs: string[];
  faq: CommunityNote["faq"];
  changed: boolean;
} {
  const quick_answer = stripChannelAttribution(note.quick_answer);
  const key_takeaways = note.key_takeaways.slice(0, 4).map(stripChannelAttribution);
  let body_sections = transformSections(note.body_sections);
  const faq = note.faq.map((f) => ({
    q: stripChannelAttribution(f.q),
    a: stripChannelAttribution(f.a),
  }));

  const fixed = applyBlueprintFixes({
    content_kind: note.content_kind,
    quick_answer,
    key_takeaways,
    body_sections,
    faq,
  });
  if (fixed.changed) {
    body_sections = fixed.body_sections;
  }

  const body_paragraphs = flattenBodySections(body_sections);
  const changed =
    quick_answer !== note.quick_answer ||
    JSON.stringify(key_takeaways) !== JSON.stringify(note.key_takeaways.slice(0, 4)) ||
    note.key_takeaways.length > 4 ||
    JSON.stringify(body_sections) !== JSON.stringify(note.body_sections) ||
    fixed.changed;

  return { quick_answer, key_takeaways, body_sections, body_paragraphs, faq, changed: changed || note.key_takeaways.length > 4 };
}
