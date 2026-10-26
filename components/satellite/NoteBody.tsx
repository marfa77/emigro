import type { ReactNode } from "react";
import Link from "next/link";
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

const ACTION_HEADING =
  /^(?:(?:официально|на практике)\s*:\s*)?(?:как (?:выбрать|проверить|оформить|подать|записаться|спланировать|добраться)|что (?:подготовить|проверить|делать|сохранить)|первые (?:часы|шаги)|шаг(?:\s+\d|и\b)|пошагово|таймлайн|после (?:подписания|подачи)|перед (?:оплатой|задатком|выходом)|план действий)/i;

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
    <ol className={`mt-4 space-y-3 ${checklist ? "" : "list-disc pl-5 marker:text-teal-600 sm:pl-6"}`}>
      {bullets.map((item, index) => (
        <li
          key={item.slice(0, 48)}
          className={`text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed ${
            checklist ? "flex gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5" : ""
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

function ActionTiles({ items }: { items: string[] }) {
  return (
    <ol className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 40)}`}
          className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold tabular-nums text-teal-800 ring-1 ring-inset ring-teal-100"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 pt-0.5 text-[15px] leading-[1.65] text-slate-700 [&_a]:break-words sm:text-base sm:leading-relaxed">
            {parseInlineMarkdown(item)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SectionTable({ table }: { table: NonNullable<NoteBodySection["table"]> }) {
  return (
    <div className="mt-5">
      <div className="space-y-3 sm:hidden">
        {table.rows.map((row, rowIndex) => (
          <article key={`${row[0]}-${rowIndex}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold leading-snug text-slate-900">{parseInlineMarkdown(row[0] ?? "")}</h3>
            {table.columns.slice(1).map((column, cellIndex) => {
              const cell = row[cellIndex + 1];
              if (!cell) return null;
              return (
                <div key={`${column}-${cellIndex}`} className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{column}</p>
                  <div className="mt-1 text-sm leading-relaxed text-slate-700">{parseInlineMarkdown(cell)}</div>
                </div>
              );
            })}
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
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
  const actionSection = section.section_kind === "action_guide" || ACTION_HEADING.test(section.heading);
  const images = section.images ?? [];
  const paragraphs = section.paragraphs ?? [];
  const cards = section.cards ?? [];
  const normalizeForCompare = (value: string) => value
    .replace(/^\s*(?:Главное:\s*|[-•]\s*)/i, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.!?…]+$/, "")
    .trim()
    .toLocaleLowerCase("ru");
  const visibleParagraphs = paragraphs
    .map((paragraph) => {
      const takeaway = paragraph.match(/(?:^|\s)Главное:\s*(.+)$/i);
      if (!takeaway) return paragraph;
      const key = normalizeForCompare(takeaway[1]);
      if (!bullets.some((bullet) => normalizeForCompare(bullet) === key)) return paragraph;
      const takeawayStart = paragraph.lastIndexOf(takeaway[0]);
      return paragraph.slice(0, takeawayStart).trim();
    })
    .filter(Boolean);
  /** Full figures after the lead — not a tiny strip before the prose. */
  const imageAfterLead = images.length > 0 && visibleParagraphs.length >= 2;
  const imageAtEnd = images.length > 0 && !imageAfterLead;

  return (
    <>
      {visibleParagraphs.map((paragraph, index) => (
        <div key={paragraph.slice(0, 48)}>
          <p className="mt-3 max-w-[72ch] text-[15px] leading-[1.65] text-slate-700 sm:text-base sm:leading-relaxed [&_a]:break-words">
            {parseInlineMarkdown(paragraph)}
          </p>
          {imageAfterLead && index === 0 && <SectionImages images={images} />}
        </div>
      ))}
      {section.table && section.table.rows.length > 0 && <SectionTable table={section.table} />}
      {cards.length > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <li
              key={`${card.title}-${index}`}
              className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start gap-3">
                {section.card_layout === "steps" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
                <div className="min-w-0">
                  {card.eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">{card.eyebrow}</p>}
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{card.title}</h3>
                </div>
              </div>
              <p className={`mt-3 text-sm leading-relaxed text-slate-600 ${section.card_layout === "steps" ? "sm:ml-10" : ""}`}>
                {parseInlineMarkdown(card.body)}
              </p>
              {card.href && card.link_label && (
                <Link href={card.href} className={`mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-950 ${section.card_layout === "steps" ? "sm:ml-10" : ""}`}>
                  {card.link_label}<span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
      {imageAtEnd && <SectionImages images={images} />}
      {bullets.length > 0 &&
        (ranking ? (
          <RankingBulletsWithPreviews bullets={bullets} />
        ) : actionSection && !checklist && bullets.length >= 2 ? (
          <ActionTiles items={bullets} />
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
              className={checklist ? "rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5" : ""}
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
