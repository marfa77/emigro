import type { ReactNode } from "react";
import type { NoteBodyImage, NoteBodySection } from "@/lib/community-notes/types";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import {
  extractMarkdownHttpLinks,
  getLinkPreviews,
  type LinkPreview,
} from "@/lib/link-preview";
import { LinkPreviewThumb } from "@/components/satellite/LinkPreviewThumb";
import { NoteImageGallery } from "@/components/satellite/NoteImageGallery";
import {
  isChecklistSection,
  isRankingSection,
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

async function RankingBulletsWithPreviews({ bullets }: { bullets: string[] }) {
  const linksPerBullet = bullets.map((item) => extractMarkdownHttpLinks(item));
  const allUrls = linksPerBullet.flatMap((links) => links.map((l) => l.url));
  const previews = await getLinkPreviews(allUrls);

  return (
    <ol className="mt-4 space-y-4">
      {bullets.map((item, index) => {
        const links = linksPerBullet[index] ?? [];
        const primary = links[0]
          ? previews.get(links[0].url) ?? previewFallback(links[0].url)
          : null;

        return (
          <li
            key={item.slice(0, 48)}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4">
              {primary && (
                <div className="sm:w-40 sm:shrink-0">
                  <LinkPreviewThumb
                    href={primary.url}
                    hostname={primary.hostname}
                    imageUrl={primary.imageUrl}
                    label={links[0]?.label ?? primary.hostname}
                    size="sm"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed [&_a]:break-words">
                {parseInlineMarkdown(item)}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function previewFallback(url: string): LinkPreview {
  let hostname = "site";
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* keep default */
  }
  return { url, hostname, imageUrl: null, siteName: null };
}

function SectionImages({ images }: { images: NoteBodyImage[] }) {
  return <NoteImageGallery images={images} />;
}

function SectionTable({ table }: { table: NonNullable<NoteBodySection["table"]> }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-slate-700">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {table.columns.map((col) => (
              <th key={col} className="px-3 py-2.5 sm:px-4">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={`${row[0]}-${rowIndex}`}
              className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/60"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className={`px-3 py-2.5 align-top sm:px-4 ${
                    cellIndex === 0 ? "whitespace-nowrap font-medium text-slate-900" : ""
                  }`}
                >
                  {parseInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function SectionContent({
  section,
  checklist,
}: {
  section: NoteBodySection;
  checklist: boolean;
}) {
  const ranking = isRankingSection(section);
  const bullets = section.bullets ?? [];
  const images = section.images ?? [];
  const paragraphs = section.paragraphs ?? [];
  /** Full figures after the lead — not a tiny strip before the prose. */
  const imageAfterLead = images.length > 0 && paragraphs.length >= 2;
  const imageAtEnd = images.length > 0 && !imageAfterLead;

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <div key={paragraph.slice(0, 48)}>
          <p className="mt-3 text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed [&_a]:break-words">
            {parseInlineMarkdown(paragraph)}
          </p>
          {imageAfterLead && index === 0 && <SectionImages images={images} />}
        </div>
      ))}
      {section.table && section.table.rows.length > 0 && <SectionTable table={section.table} />}
      {imageAtEnd && <SectionImages images={images} />}
      {bullets.length > 0 &&
        (ranking ? (
          <RankingBulletsWithPreviews bullets={bullets} />
        ) : (
          <SectionBullets bullets={bullets} checklist={checklist} />
        ))}
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

export async function NoteBody({ sections, paragraphs }: NoteBodyProps) {
  const optimized = optimizeBodySections(sections);

  if (optimized.length > 0) {
    let contentIndex = 0;
    const prepared = optimized.map((section) => {
      const glossary = isGlossarySection(section);
      const indexAmongContent = glossary ? -1 : contentIndex++;
      return {
        section,
        id: `section-${sectionSlug(section.heading)}`,
        checklist: isChecklistSection(section),
        surface: resolveSectionSurface(section),
        glossary,
        collapsed: glossary ? true : sectionStartsCollapsed(section, indexAmongContent),
        useCollapsible: sectionShouldCollapse(section),
      };
    });

    return (
      <div className="mt-8 space-y-6 sm:space-y-7">
        {prepared.map(({ section, id, checklist, surface, collapsed, useCollapsible }) => {
          const content = <SectionContent section={section} checklist={checklist} />;

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
                  {content}
                </CollapsibleSection>
              ) : (
                <>
                  {surface && (
                    <SectionBadge className={`mb-2 ${surface.badgeClass}`} label={surface.badge} />
                  )}
                  <h2 id={id} className={SECTION_HEADING}>
                    {section.heading}
                  </h2>
                  {content}
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
