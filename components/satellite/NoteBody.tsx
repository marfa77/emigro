import type { ReactNode } from "react";
import type { NoteBodySection } from "@/lib/community-notes/types";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import {
  isChecklistSection,
  optimizeBodySections,
  parseInlineMarkdown,
  parseTakeawayPrefix,
  resolveSectionSurface,
  sectionShouldCollapse,
  sectionSlug,
  sectionStartsCollapsed,
} from "@/lib/community-notes/note-body-render";

type NoteBodyProps = {
  sections: NoteBodySection[];
  paragraphs: string[];
};

const SECTION_HEADING =
  "text-lg font-semibold tracking-tight text-slate-900 sm:text-xl";

function SectionBadge({ className, label }: { className: string; label: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

function SectionBullets({
  bullets,
  checklist,
}: {
  bullets: string[];
  checklist: boolean;
}) {
  return (
    <ol className={`mt-4 space-y-3.5 ${checklist ? "" : "border-l-2 border-slate-200 pl-4 sm:pl-5"}`}>
      {bullets.map((item, index) => (
        <li
          key={item.slice(0, 48)}
          className={`text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed ${
            checklist ? "flex gap-3 rounded-lg bg-white/80 px-3 py-2.5 shadow-sm" : ""
          }`}
        >
          {checklist && (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
          )}
          <span className={`min-w-0 ${checklist ? "pt-0.5" : ""} [&_a]:break-words`}>
            {parseInlineMarkdown(item)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SectionContent({ section, checklist }: { section: NoteBodySection; checklist: boolean }) {
  return (
    <>
      {(section.paragraphs ?? []).map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="mt-3 text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed [&_a]:break-words"
        >
          {parseInlineMarkdown(paragraph)}
        </p>
      ))}
      {(section.bullets?.length ?? 0) > 0 && (
        <SectionBullets bullets={section.bullets!} checklist={checklist} />
      )}
    </>
  );
}

function CollapsibleSection({
  section,
  collapsed,
  surface,
  children,
}: {
  section: NoteBodySection;
  collapsed: boolean;
  surface: ReturnType<typeof resolveSectionSurface>;
  children: ReactNode;
}) {
  const id = `section-${sectionSlug(section.heading)}`;
  const glossary = isGlossarySection(section);
  const bulletCount = section.bullets?.length ?? 0;

  if (!sectionShouldCollapse(section)) {
    return <>{children}</>;
  }

  return (
    <details className="group" open={!collapsed}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          {surface && (
            <SectionBadge className={`mb-2 ${surface.badgeClass}`} label={surface.badge} />
          )}
          <h2 id={id} className={SECTION_HEADING}>
            {section.heading}
          </h2>
          {collapsed && bulletCount > 0 && (
            <p className="mt-1.5 text-sm text-slate-500">
              {glossary
                ? `${bulletCount} терминов — нажмите, чтобы раскрыть`
                : `${bulletCount} пунктов — нажмите, чтобы раскрыть`}
            </p>
          )}
        </div>
        <span
          className="mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function NoteBody({ sections, paragraphs }: NoteBodyProps) {
  const optimized = optimizeBodySections(sections);
  let contentIndex = 0;

  if (optimized.length > 0) {
    return (
      <div className="mt-8 space-y-6 sm:space-y-7">
        {optimized.map((section) => {
          const id = `section-${sectionSlug(section.heading)}`;
          const checklist = isChecklistSection(section);
          const surface = resolveSectionSurface(section);
          const glossary = isGlossarySection(section);
          const indexAmongContent = glossary ? -1 : contentIndex++;
          const collapsed = glossary
            ? true
            : sectionStartsCollapsed(section, indexAmongContent);
          const useCollapsible = sectionShouldCollapse(section);

          return (
            <section
              key={section.heading}
              aria-labelledby={id}
              className={
                surface?.wrap ??
                (checklist ? "rounded-xl border border-teal-100 bg-teal-50/40 p-5 sm:p-6" : undefined)
              }
            >
              {useCollapsible ? (
                <CollapsibleSection
                  section={section}
                  collapsed={collapsed}
                  surface={surface}
                >
                  <SectionContent section={section} checklist={checklist} />
                </CollapsibleSection>
              ) : (
                <>
                  {surface && (
                    <SectionBadge className={`mb-2 ${surface.badgeClass}`} label={surface.badge} />
                  )}
                  <h2 id={id} className={SECTION_HEADING}>
                    {section.heading}
                  </h2>
                  <SectionContent section={section} checklist={checklist} />
                </>
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
          {parseInlineMarkdown(paragraph)}
        </p>
      ))}
    </div>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6"
      aria-labelledby="takeaways-heading"
    >
      <h2 id="takeaways-heading" className={SECTION_HEADING}>
        Коротко для проверки
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const { label, body } = parseTakeawayPrefix(item);
          return (
            <li
              key={item.slice(0, 48)}
              className="flex gap-2.5 text-[15px] leading-[1.65] text-slate-800 sm:text-base sm:leading-relaxed"
            >
              {label ? (
                <span className="mt-0.5 shrink-0 rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {label}
                </span>
              ) : (
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
              )}
              <span className="min-w-0 [&_a]:break-words">{parseInlineMarkdown(body)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
