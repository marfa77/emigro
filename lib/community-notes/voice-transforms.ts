/**
 * Lightweight programmatic voice transforms — no Gemini.
 * Ensures «Главное» close; trims bureaucracy; does NOT inject telegraphic
 * «Что делать:» / «Зачем:» stubs (those kill narrative Emigro voice).
 */
import { applyBlueprintFixes } from "@/lib/community-notes/article-blueprint";
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { improveEditorialText } from "@/lib/community-notes/editorial-readability";
import { LITERARY_GLOSSARY_INTRO_DEFAULT } from "@/lib/community-notes/glossary";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import type { CommunityNote, NoteBodySection } from "@/lib/community-notes/types";

const BUREAUCRACY_RE = /в соответствии с|важно отметить|на фоне изменений/gi;
const GLAVNOE_RE = /главное\s*:/i;

/** Generic stubs previously auto-injected — strip if present so narrative stays clean. */
const SYNTHETIC_WHAT_RE =
  /^Что делать:\s*(сначала закройте официальный каркас|примените практику из раздела|сверяйте советы из чатов)/i;
const SYNTHETIC_WHY_RE =
  /^Зачем:\s*(без hard-правил|полевой опыт из чатов экономит итерации|типичные расхождения)/i;
const SYNTHETIC_GLAVNOE_RE =
  /^Главное:\s*разберитесь с «.+» до следующего шага — ошибка здесь обычно стоит недель\.?$/i;

/** @deprecated use improveEditorialText — kept for callers that only stripped channels */
export function stripChannelAttribution(text: string): string {
  return improveEditorialText(text.replace(BUREAUCRACY_RE, ""));
}

function synthesizeGlavnoe(section: NoteBodySection): string {
  const bullets = section.bullets ?? [];
  const first = bullets[0]?.replace(/^(Ошибка|Шаг\s*\d+)\s*[:—–-]?\s*/i, "").trim();
  if (first && first.length > 20 && first.length < 160) {
    const claim = first.charAt(0).toLowerCase() + first.slice(1).replace(/[.!?…]+$/, "");
    return `Главное: ${claim}.`;
  }
  const paras = (section.paragraphs ?? []).filter((p) => !GLAVNOE_RE.test(p) && p.trim().length > 40);
  const last = paras[paras.length - 1];
  if (last) {
    const short = last.replace(/\s+/g, " ").trim();
    if (short.length <= 180) return `Главное: ${short.replace(/[.!?…]+$/, "")}.`;
  }
  return `Главное: сверьте этот блок с официальным источником перед действием.`;
}

function stripSyntheticVoiceStubs(paragraphs: string[]): string[] {
  return paragraphs.filter(
    (p) =>
      !SYNTHETIC_WHAT_RE.test(p.trim()) &&
      !SYNTHETIC_WHY_RE.test(p.trim()) &&
      !SYNTHETIC_GLAVNOE_RE.test(p.trim())
  );
}

/** Ensure non-glossary sections have a «Главное» close; never inject Что/Зачем stubs. */
export function ensureSectionVoiceClose(section: NoteBodySection): NoteBodySection {
  if (isGlossarySection(section)) return section;

  let paragraphs = stripSyntheticVoiceStubs(
    (section.paragraphs ?? []).map(improveEditorialText)
  );
  const bullets = (section.bullets ?? []).map(improveEditorialText);

  const joined = paragraphs.join("\n");
  if (!GLAVNOE_RE.test(joined)) {
    paragraphs = [...paragraphs, synthesizeGlavnoe({ ...section, paragraphs, bullets })];
  }

  return { ...section, paragraphs, bullets };
}

function transformSections(sections: NoteBodySection[]): NoteBodySection[] {
  return sections.map((section) => {
    if (isGlossarySection(section)) {
      const intro = section.paragraphs?.[0]?.trim();
      const needsIntro =
        !intro || intro.startsWith("Ключевые термины") || intro.length < 40;
      return {
        ...section,
        paragraphs: needsIntro
          ? [LITERARY_GLOSSARY_INTRO_DEFAULT]
          : section.paragraphs?.map(improveEditorialText),
        bullets: section.bullets?.map(improveEditorialText),
      };
    }
    return ensureSectionVoiceClose(section);
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
  const quick_answer = improveEditorialText(note.quick_answer);
  const key_takeaways = note.key_takeaways.slice(0, 4).map(improveEditorialText);
  let body_sections = transformSections(note.body_sections);
  const faq = note.faq.map((f) => ({
    q: improveEditorialText(f.q),
    a: improveEditorialText(f.a),
  }));

  const fixed = applyBlueprintFixes({
    content_kind: note.content_kind,
    quick_answer,
    key_takeaways,
    body_sections,
    faq,
  });
  if (fixed.changed) {
    body_sections = fixed.body_sections.map(ensureSectionVoiceClose);
  }

  const body_paragraphs = flattenBodySections(body_sections);
  const changed =
    quick_answer !== note.quick_answer ||
    JSON.stringify(key_takeaways) !== JSON.stringify(note.key_takeaways.slice(0, 4)) ||
    note.key_takeaways.length > 4 ||
    JSON.stringify(body_sections) !== JSON.stringify(note.body_sections) ||
    fixed.changed;

  return {
    quick_answer,
    key_takeaways,
    body_sections,
    body_paragraphs,
    faq,
    changed: changed || note.key_takeaways.length > 4,
  };
}
