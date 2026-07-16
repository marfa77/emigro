/**
 * Lightweight programmatic voice transforms — no Gemini.
 * Improves readability of editor notes; ensures «Главное» / «Что делать» / «Зачем»;
 * trims takeaways; preserves facts.
 */
import { applyBlueprintFixes } from "@/lib/community-notes/article-blueprint";
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { improveEditorialText } from "@/lib/community-notes/editorial-readability";
import { LITERARY_GLOSSARY_INTRO_DEFAULT } from "@/lib/community-notes/glossary";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import type { CommunityNote, NoteBodySection } from "@/lib/community-notes/types";

const BUREAUCRACY_RE = /в соответствии с|важно отметить|на фоне изменений/gi;
const GLAVNOE_RE = /главное\s*:/i;
const WHAT_RE = /что\s+делать\s*:/i;
const WHY_RE = /зачем\s*:/i;

/** @deprecated use improveEditorialText — kept for callers that only stripped channels */
export function stripChannelAttribution(text: string): string {
  return improveEditorialText(text.replace(BUREAUCRACY_RE, ""));
}

function synthesizeGlavnoe(section: NoteBodySection): string {
  const bullets = section.bullets ?? [];
  const first = bullets[0]?.replace(/^Ошибка:\s*/i, "").trim();
  if (first && first.length > 20 && first.length < 180) {
    const claim = first.charAt(0).toLowerCase() + first.slice(1).replace(/[.!?…]+$/, "");
    return `Главное: ${claim} — сверяйте с официальным порталом перед действием.`;
  }
  const heading = section.heading.replace(/^(Официально|На практике|Где)\s*[:—–-]?\s*/i, "").trim();
  return `Главное: разберитесь с «${heading}» до следующего шага — ошибка здесь обычно стоит недель.`;
}

function synthesizeWhatWhy(section: NoteBodySection): { what: string; why: string } {
  const heading = section.heading.replace(/^(Официально|На практике|Где)\s*[:—–-]?\s*/i, "").trim();
  const kind = section.section_kind;
  if (kind === "gap") {
    return {
      what: `Что делать: сверяйте советы из чатов с официальным сайтом по теме «${heading}» — не переносите чужой кейс один в один.`,
      why: "Зачем: типичные расхождения «сайт vs чат» съедают недели и деньги на повторные визиты.",
    };
  }
  if (kind === "official") {
    return {
      what: `Что делать: сначала закройте официальный каркас по разделу «${heading}» — документы, порталы и сроки с gov / органа.`,
      why: "Зачем: без hard-правил следующий шаг (банк, запись, школа) встанет, даже если в чате «у всех прокатило».",
    };
  }
  return {
    what: `Что делать: примените практику из раздела «${heading}» к своему кейсу — с запасом по срокам.`,
    why: "Зачем: полевой опыт из чатов экономит итерации, но не заменяет сверку с вашим processo.",
  };
}

/** Ensure non-glossary sections have voice leads + «Главное» close. */
export function ensureSectionVoiceClose(section: NoteBodySection): NoteBodySection {
  if (isGlossarySection(section)) return section;

  let paragraphs = [...(section.paragraphs ?? []).map(improveEditorialText)];
  const bullets = (section.bullets ?? []).map(improveEditorialText);

  const joined = paragraphs.join("\n");
  const needsWhat = !WHAT_RE.test(joined);
  const needsWhy = !WHY_RE.test(joined);
  const needsGlavnoe = !GLAVNOE_RE.test(joined);

  if (needsWhat || needsWhy) {
    const { what, why } = synthesizeWhatWhy(section);
    const lead: string[] = [];
    if (paragraphs[0] && !WHAT_RE.test(paragraphs[0]) && !WHY_RE.test(paragraphs[0])) {
      // Keep existing narrative lead, then inject voice frame
      lead.push(paragraphs[0]);
      paragraphs = paragraphs.slice(1);
    }
    if (needsWhat) lead.push(what);
    if (needsWhy) lead.push(why);
    paragraphs = [...lead, ...paragraphs];
  }

  if (needsGlavnoe) {
    paragraphs = [...paragraphs, synthesizeGlavnoe({ ...section, bullets })];
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
