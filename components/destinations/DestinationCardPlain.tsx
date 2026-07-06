import Link from "next/link";
import Image from "next/image";
import { BookOpen, Newspaper } from "lucide-react";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsIndexPath } from "@/lib/news/topics";
import { corridorStatusBadgeClass, corridorStatusLabelRu } from "@/lib/corridor/publish";
import { countryAccentBarClass, countryCardImage } from "@/lib/brand/country-accents";

/** Static card for news-only directions without a corridor landing. */
export function DestinationCardPlain({ topic }: { topic: NewsTopicConfig }) {
  const badgeText = corridorStatusLabelRu(topic.status);
  const badgeClass = corridorStatusBadgeClass(topic.status);
  const newsHref = newsIndexPath(topic.urlSegment);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-corridor-400 hover:shadow-md">
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <Image
          src={countryCardImage(topic.urlSegment)}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r ${countryAccentBarClass(topic.urlSegment)}`}
          aria-hidden
        />
      </div>
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
        </div>
      </div>
    </article>
  );
}
