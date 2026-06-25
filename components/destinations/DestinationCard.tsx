import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Construction, Newspaper } from "lucide-react";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsIndexPath } from "@/lib/news/topics";
import { corridorStatusBadgeClass, corridorStatusLabelRu, isCorridorFull } from "@/lib/corridor/publish";
import { countryAccentBarClass } from "@/lib/brand/country-accents";

export function DestinationCard({ topic }: { topic: NewsTopicConfig }) {
  const badgeText = corridorStatusLabelRu(topic.status);
  const badgeClass = corridorStatusBadgeClass(topic.status);
  const newsHref = newsIndexPath(topic.urlSegment);
  const isFull = isCorridorFull(topic.status);
  const landingHref = topic.sitePaths?.landing;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-corridor-400 hover:shadow-md">
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${countryAccentBarClass(topic.urlSegment)}`}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xl" aria-hidden>
            {topic.flag}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{topic.countryRu}</h2>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm text-slate-600">{topic.audienceRu}</p>
      <p className="mt-2 text-xs text-slate-500">{topic.focusHintRu}</p>

      {topic.status === "in_development" && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-800">
          <Construction className="h-3.5 w-3.5" />
          Wizard и программы — после завершения наполнения
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={newsHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-corridor-600 px-3 py-2 text-sm font-medium text-white hover:bg-corridor-700"
        >
          <Newspaper className="h-4 w-4" />
          Новости
        </Link>
        {topic.sitePaths?.guide && (
          <Link
            href={topic.sitePaths.guide}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-corridor-400"
          >
            <BookOpen className="h-4 w-4" />
            Справочник
          </Link>
        )}
        {isFull && topic.sitePaths?.wizard && (
          <Link
            href={topic.sitePaths.wizard}
            className="inline-flex items-center gap-1.5 rounded-lg border border-corridor-200 bg-corridor-50 px-3 py-2 text-sm font-medium text-corridor-800 hover:bg-corridor-100"
          >
            <Compass className="h-4 w-4" />
            Wizard
          </Link>
        )}
        {landingHref && (
          <Link
            href={landingHref}
            className="inline-flex items-center gap-1 text-sm text-corridor-600 hover:underline"
          >
            Коридор
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      </div>
    </article>
  );
}
