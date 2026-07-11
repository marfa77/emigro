import type { NoteBodySection } from "@/lib/community-notes/types";
import { sectionSlug } from "@/lib/community-notes/note-body-render";
import { inferSectionKind } from "@/lib/community-notes/official-vs-practice";
import { isGlossarySection } from "@/lib/community-notes/glossary";

type NoteTocProps = {
  sections: NoteBodySection[];
  hasFaq: boolean;
};

export function NoteToc({ sections, hasFaq }: NoteTocProps) {
  const items = sections.filter((section) => !isGlossarySection(section));
  if (items.length < 5) return null;

  return (
    <nav
      className="mt-6 mb-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
      aria-label="Содержание гайда"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Содержание</p>
      <ol className="mt-3 space-y-2 text-sm leading-snug">
        {items.map((section) => {
          const id = `section-${sectionSlug(section.heading)}`;
          const kind = inferSectionKind(section);
          return (
            <li key={section.heading}>
              <a href={`#${id}`} className="text-teal-800 hover:text-teal-950 hover:underline">
                {section.heading}
                {kind === "practice" && (
                  <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-teal-600">
                    практика
                  </span>
                )}
              </a>
            </li>
          );
        })}
        {hasFaq && (
          <li>
            <a href="#faq" className="text-teal-800 hover:text-teal-950 hover:underline">
              FAQ
            </a>
          </li>
        )}
      </ol>
    </nav>
  );
}
