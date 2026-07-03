import type { NoteBodySection } from "@/lib/community-notes/types";
import {
  isChecklistSection,
  optimizeBodySections,
  parseInlineBold,
  sectionSlug,
} from "@/lib/community-notes/note-body-render";

type NoteBodyProps = {
  sections: NoteBodySection[];
  paragraphs: string[];
};

const SECTION_HEADING =
  "text-lg font-semibold tracking-tight text-slate-900 sm:text-xl";

export function NoteBody({ sections, paragraphs }: NoteBodyProps) {
  const optimized = optimizeBodySections(sections);

  if (optimized.length > 0) {
    return (
      <div className="mt-8 space-y-8">
        {optimized.map((section) => {
          const id = `section-${sectionSlug(section.heading)}`;
          const checklist = isChecklistSection(section);

          return (
            <section
              key={section.heading}
              aria-labelledby={id}
              className={checklist ? "rounded-xl border border-teal-100 bg-teal-50/40 p-5 sm:p-6" : undefined}
            >
              <h2 id={id} className={SECTION_HEADING}>
                {section.heading}
              </h2>
              {(section.paragraphs ?? []).map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-slate-700">
                  {parseInlineBold(paragraph)}
                </p>
              ))}
              {(section.bullets?.length ?? 0) > 0 && (
                <ol className={`mt-4 space-y-3 ${checklist ? "" : "border-l-2 border-teal-200 pl-4"}`}>
                  {section.bullets!.map((item, index) => (
                    <li
                      key={item.slice(0, 48)}
                      className={`leading-relaxed text-slate-700 ${checklist ? "flex gap-3 rounded-lg bg-white/80 px-3 py-2.5 shadow-sm" : ""}`}
                    >
                      {checklist && (
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white"
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                      )}
                      <span className={checklist ? "pt-0.5" : undefined}>{parseInlineBold(item)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="prose prose-slate mt-8 max-w-none">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="leading-relaxed text-slate-700">
          {parseInlineBold(paragraph)}
        </p>
      ))}
    </div>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6"
      aria-labelledby="takeaways-heading"
    >
      <h2 id="takeaways-heading" className={SECTION_HEADING}>
        Коротко для проверки
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.slice(0, 48)} className="flex gap-2.5 text-sm leading-relaxed text-slate-800 sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
            {parseInlineBold(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
