import type { ReactNode } from "react";
import type { NoteBodySection } from "@/lib/community-notes/types";

/** Render **bold** segments from Gemini output. */
export function parseInlineBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const WEEKLY_DETAIL_RE = /^Недел[яи]\s+\d/i;

/** Drop redundant «Неделя 1/2/3» sections when a weekly checklist with bullets exists. */
export function optimizeBodySections(sections: NoteBodySection[]): NoteBodySection[] {
  const hasWeeklyChecklist = sections.some(
    (s) => /чеклист|по неделям/i.test(s.heading) && (s.bullets?.length ?? 0) >= 3
  );
  if (!hasWeeklyChecklist) return sections;
  return sections.filter((s) => !WEEKLY_DETAIL_RE.test(s.heading));
}

export function isChecklistSection(section: NoteBodySection): boolean {
  return (section.bullets?.length ?? 0) >= 3 && /чеклист|недел|шаг/i.test(section.heading);
}

export function sectionSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .slice(0, 48);
}
