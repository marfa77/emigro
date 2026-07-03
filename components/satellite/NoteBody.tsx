import type { NoteBodySection } from "@/lib/community-notes/types";

type NoteBodyProps = {
  sections: NoteBodySection[];
  paragraphs: string[];
};

export function NoteBody({ sections, paragraphs }: NoteBodyProps) {
  if (sections.length > 0) {
    return (
      <div className="mt-8 space-y-10">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={`section-${slugify(section.heading)}`}>
            <h2
              id={`section-${slugify(section.heading)}`}
              className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            >
              {section.heading}
            </h2>
            {(section.paragraphs ?? []).map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
            {(section.bullets?.length ?? 0) > 0 && (
              <ul className="mt-4 space-y-2.5 border-l-2 border-teal-200 pl-4">
                {section.bullets!.map((item) => (
                  <li key={item.slice(0, 48)} className="leading-relaxed text-slate-700">
                    <span className="font-medium text-teal-800">→</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-slate mt-8 max-w-none">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="leading-relaxed text-slate-700">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5"
      aria-labelledby="takeaways-heading"
    >
      <h2 id="takeaways-heading" className="text-sm font-bold uppercase tracking-wide text-slate-700">
        Коротко для проверки
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.slice(0, 48)} className="flex gap-2 text-sm leading-relaxed text-slate-800">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .slice(0, 48);
}
