import Link from "next/link";
import type { ReactNode } from "react";
import type { NoteBodySection } from "@/lib/community-notes/types";
import {
  inferSectionKind,
  SECTION_KIND_LABELS,
  type SectionKind,
} from "@/lib/community-notes/official-vs-practice";

const INLINE_MARKDOWN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK_CLASS = "text-teal-700 underline hover:text-teal-900";

function renderInlineSegment(part: string, key: number): ReactNode {
  if (part.startsWith("**") && part.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    );
  }

  const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (linkMatch) {
    const [, label, href] = linkMatch;
    if (/^https?:\/\//i.test(href)) {
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {label}
        </a>
      );
    }
    if (href.startsWith("/")) {
      return (
        <Link key={key} href={href} className={LINK_CLASS}>
          {label}
        </Link>
      );
    }
  }

  return part;
}

/** Render **bold** and [text](url) inline markdown in note body fields. */
export function parseInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(INLINE_MARKDOWN_RE);
  return parts.map((part, i) => renderInlineSegment(part, i));
}

/** @deprecated Prefer parseInlineMarkdown — kept for call sites that only need bold+links. */
export function parseInlineBold(text: string): ReactNode[] {
  return parseInlineMarkdown(text);
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
  if (section.section_kind === "glossary") return false;
  return (section.bullets?.length ?? 0) >= 3 && /чеклист|недел|шаг/i.test(section.heading);
}

export function sectionSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .slice(0, 48);
}

const TAKEAWAY_PREFIX = /^(Официально|На практике|Расхождение|В чате):\s*/i;

export function parseTakeawayPrefix(text: string): { label: string | null; body: string } {
  const match = text.trim().match(TAKEAWAY_PREFIX);
  if (!match) return { label: null, body: text };
  return { label: match[1], body: text.replace(TAKEAWAY_PREFIX, "").trim() };
}

const SECTION_SURFACE: Record<
  SectionKind,
  { wrap: string; badge: string; badgeClass: string }
> = {
  official: {
    wrap: "rounded-xl border border-slate-200 bg-slate-50/90 p-5 sm:p-6",
    badge: SECTION_KIND_LABELS.official,
    badgeClass: "bg-slate-700 text-white",
  },
  practice: {
    wrap: "rounded-xl border border-teal-100 bg-teal-50/50 p-5 sm:p-6",
    badge: SECTION_KIND_LABELS.practice,
    badgeClass: "bg-teal-700 text-white",
  },
  gap: {
    wrap: "rounded-xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6",
    badge: SECTION_KIND_LABELS.gap,
    badgeClass: "bg-amber-700 text-white",
  },
  glossary: {
    wrap: "rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 sm:p-6",
    badge: SECTION_KIND_LABELS.glossary,
    badgeClass: "bg-indigo-700 text-white",
  },
};

export function resolveSectionSurface(section: NoteBodySection) {
  const kind = inferSectionKind(section);
  if (!kind) return null;
  return SECTION_SURFACE[kind];
}
