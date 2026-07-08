import type { GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const GLOSSARY_SECTION_HEADING = "Словарь терминов";

const GLOSSARY_HEADING_RE = /словарь\s+термин/i;

/** Format: **term** — explanation (optional context in parens before em dash). */
export function formatGlossaryBullet(term: GlossaryTerm): string {
  const pt = term.pt.trim();
  const ru = term.ru.trim();
  if (term.context) {
    return `**${pt}** (${term.context}) — ${ru}`;
  }
  return `**${pt}** — ${ru}`;
}

export function buildGlossarySection(terms: GlossaryTerm[]): NoteBodySection {
  return {
    heading: GLOSSARY_SECTION_HEADING,
    section_kind: "glossary",
    paragraphs: [
      "Ключевые термины на португальском (PT-PT) — чтобы читать порталы, договоры и переписку со школами/органами без постоянного перевода.",
    ],
    bullets: terms.map(formatGlossaryBullet),
  };
}

export function isGlossarySection(section: NoteBodySection): boolean {
  return section.section_kind === "glossary" || GLOSSARY_HEADING_RE.test(section.heading);
}

export function hasGlossarySection(sections: NoteBodySection[]): boolean {
  return sections.some(isGlossarySection);
}

/** Move existing glossary section to index 0 (first body_section). */
export function moveGlossaryToStart(sections: NoteBodySection[]): NoteBodySection[] {
  const glossary = sections.find(isGlossarySection);
  if (!glossary) return sections;
  const without = sections.filter((s) => !isGlossarySection(s));
  if (sections[0] && isGlossarySection(sections[0])) return sections;
  return [glossary, ...without];
}

/** Insert or refresh glossary as the first body_section (after quick_answer / takeaways on the page). */
export function upsertGlossarySection(
  sections: NoteBodySection[],
  terms: GlossaryTerm[]
): NoteBodySection[] {
  const glossary = buildGlossarySection(terms);
  const without = sections.filter((s) => !isGlossarySection(s));
  return [glossary, ...without];
}

export function countGlossaryTerms(section: NoteBodySection): number {
  if (!isGlossarySection(section)) return 0;
  return section.bullets?.length ?? 0;
}

export function validateGlossarySection(section: NoteBodySection): string[] {
  const errors: string[] = [];
  if (!isGlossarySection(section)) return errors;
  const count = countGlossaryTerms(section);
  if (count < 5) errors.push(`glossary: need 5–12 terms, got ${count}`);
  if (count > 12) errors.push(`glossary: max 12 terms, got ${count}`);
  for (const bullet of section.bullets ?? []) {
    if (!/^\*\*.+\*\*/.test(bullet.trim())) {
      errors.push(`glossary bullet missing PT term bold: ${bullet.slice(0, 40)}…`);
    }
  }
  return errors;
}

export function validateGuideGlossary(body_sections: NoteBodySection[]): string[] {
  const glossary = body_sections.find(isGlossarySection);
  if (!glossary) return ["glossary: guide needs «Словарь терминов» section"];
  return validateGlossarySection(glossary);
}
