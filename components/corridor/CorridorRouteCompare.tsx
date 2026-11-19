import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CorridorProgram } from "@/lib/types";
import { getProgramsBySlugs } from "@/lib/corridor/queries";
import { keyRequirement, timelineSummary } from "@/lib/seo/corridor-page-seo";

/** First sentence, capped: requirement texts can run for a paragraph. */
function brief(text: string | null, max: number): string | null {
  if (!text) return null;
  let first = text.replace(/\s+/g, " ").trim().split(/(?<=[.;])\s/)[0];
  // Don't leave a bracket open: «8–24 месяца (задержки AIMA ARI;» → «8–24 месяца».
  if ((first.match(/\(/g)?.length ?? 0) > (first.match(/\)/g)?.length ?? 0)) {
    first = first.slice(0, first.lastIndexOf("(")).trim().replace(/[;,]$/, "");
  }
  return first.length > max ? `${first.slice(0, max - 1).trim()}…` : first;
}

/** «Португалия D8 — цифровой кочевник» → «D8 · цифровой кочевник». */
function cardTitle(title: string, countryRu: string): string {
  const stripped = title.replace(new RegExp(`^${countryRu}\\s*(?:—\\s*)?`, "i"), "").trim() || title;
  const label = stripped.replace(/\s+—\s+/, " · ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Corridor programs as a compact comparison: who it is for, the money bar, how long it takes. */
export async function CorridorRouteCompare({
  programs,
  countryRu,
  landingPath,
  interactive,
}: {
  programs: CorridorProgram[];
  countryRu: string;
  landingPath: string;
  interactive: boolean;
}) {
  const details = await getProgramsBySlugs(programs.map((p) => p.slug));
  return (
    <section id="programs" className="mt-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-slate-950">Маршруты ВНЖ: сравнение</h2>
      <p className="mt-2 text-sm text-slate-600">Пороги и сроки — ориентир 2026 года; точные требования на странице каждой программы.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {programs.map((program) => {
          const detail = details.get(program.slug);
          const threshold = detail ? brief(keyRequirement(detail), 110) : null;
          const timeline = detail ? brief(timelineSummary(detail), 90) : null;
          const href = `${landingPath}/programs/${program.slug}`;
          const body = (
            <>
              <h3 className="text-lg font-semibold text-slate-950">{cardTitle(program.title_ru, countryRu)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{program.summary_ru}</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                {threshold ? (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-slate-500">Требование</dt>
                    <dd className="font-medium text-slate-900">{threshold}</dd>
                  </div>
                ) : null}
                {timeline ? (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-slate-500">Сроки</dt>
                    <dd className="text-slate-800">{timeline}</dd>
                  </div>
                ) : null}
              </dl>
              {interactive ? (
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-corridor-700">
                  Подробнее <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              ) : null}
            </>
          );
          return interactive ? (
            <Link
              key={program.slug}
              href={href}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-corridor-300 hover:shadow"
            >
              {body}
            </Link>
          ) : (
            <div key={program.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
