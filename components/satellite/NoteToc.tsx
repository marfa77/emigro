"use client";

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
  const initialItems = items.slice(0, 8);
  const overflowItems = items.slice(8);

  function openLinkedSection(id: string) {
    const target = document.getElementById(id);
    const details = target?.closest("details");
    if (details instanceof HTMLDetailsElement) details.open = true;
  }

  return (
    <nav
      className="mt-6 mb-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
      aria-label="Содержание гайда"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Содержание <span className="font-normal normal-case">· {items.length} разделов</span>
      </p>
      <ol className="mt-3 space-y-2 text-sm leading-snug">
        {initialItems.map((section) => renderItem(section))}
        {overflowItems.length > 0 && (
          <li>
            <details className="group/contents rounded-lg">
              <summary className="w-fit cursor-pointer list-none font-medium text-teal-800 marker:content-none [&::-webkit-details-marker]:hidden">
                Ещё {overflowItems.length} разделов
                <span aria-hidden="true" className="ml-1 text-xs text-slate-500 group-open/contents:hidden">⌄</span>
                <span aria-hidden="true" className="ml-1 hidden text-xs text-slate-500 group-open/contents:inline">⌃</span>
              </summary>
              <ol className="mt-2 space-y-2 border-l border-slate-200 pl-3">
                {overflowItems.map((section) => renderItem(section))}
              </ol>
            </details>
          </li>
        )}
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

  function renderItem(section: NoteBodySection) {
    const id = `section-${sectionSlug(section.heading)}`;
    const kind = inferSectionKind(section);
    return (
      <li key={section.heading}>
        <a
          href={`#${id}`}
          onClick={() => openLinkedSection(id)}
          className="text-teal-800 hover:text-teal-950 hover:underline"
        >
          {section.heading}
          {kind === "practice" && (
            <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-teal-600">
              практика
            </span>
          )}
        </a>
      </li>
    );
  }
}
