import Link from "next/link";
import { BookOpen, Compass, Newspaper, Sparkles } from "lucide-react";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsIndexPath } from "@/lib/news/topics";
import { isCorridorFull, isCorridorOnSite } from "@/lib/corridor/publish";

type Props = {
  topic: NewsTopicConfig;
  /** compact = inline links row; full = explanatory cards */
  variant?: "full" | "compact";
  /** stack = single column (sidebar); grid = multi-column when space allows */
  layout?: "stack" | "grid";
};

export function CorridorIntelLinks({ topic, variant = "full", layout = "grid" }: Props) {
  const newsHref = newsIndexPath(topic.urlSegment);
  const paths = topic.sitePaths;

  if (variant === "compact") {
    return (
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600" aria-label="Связанные разделы">
        {paths?.landing && (
          <Link href={paths.landing} className="text-corridor-600 hover:underline">
            Коридор {topic.countryRu}
          </Link>
        )}
        {paths?.guide && (
          <>
            <span className="text-slate-300">·</span>
            <Link href={paths.guide} className="text-corridor-600 hover:underline">
              Справочник
            </Link>
          </>
        )}
        <span className="text-slate-300">·</span>
        <Link href={newsHref} className="text-corridor-600 hover:underline">
          Новости
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/ru/guides" className="text-corridor-600 hover:underline">
          Гайды
        </Link>
        {paths?.wizard && isCorridorFull(topic.status) && (
          <>
            <span className="text-slate-300">·</span>
            <Link href={paths.wizard} className="text-corridor-600 hover:underline">
              Подбор маршрута
            </Link>
          </>
        )}
      </nav>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-corridor-100 p-2 text-corridor-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Интеллект Emigro: {topic.flag} {topic.countryRu}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Два слоя: справочник с проверенными фактами и еженедельные новости с источниками.
          </p>
        </div>
      </div>

      <div
        className={`mt-5 grid gap-3 ${
          layout === "stack"
            ? "grid-cols-1"
            : paths
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {paths?.landing && (
          <Link
            href={paths.landing}
            className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-corridor-400 hover:shadow-sm"
          >
            <Compass className="h-5 w-5 text-corridor-600" />
            <p className="mt-2 font-medium text-slate-900 group-hover:text-corridor-700">Коридор {topic.countryRu}</p>
            <p className="mt-1 text-sm text-slate-600">Программы ВНЖ, wizard и обзор маршрутов коридора.</p>
          </Link>
        )}

        {paths?.guide && (
          <Link
            href={paths.guide}
            className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-corridor-400 hover:shadow-sm"
          >
            <BookOpen className="h-5 w-5 text-corridor-600" />
            <p className="mt-2 font-medium text-slate-900 group-hover:text-corridor-700">Справочник</p>
            <p className="mt-1 text-sm text-slate-600">
              Гражданство, язык, налоги и административные шаги — статические заметки коридора.
            </p>
          </Link>
        )}

        <Link
          href={newsHref}
          className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-corridor-400 hover:shadow-sm"
        >
          <Newspaper className="h-5 w-5 text-corridor-600" />
          <p className="mt-2 font-medium text-slate-900 group-hover:text-corridor-700">Новости недели</p>
          <p className="mt-1 text-sm text-slate-600">
            AIMA, консульства, законы — еженедельный дайджест с источниками.
          </p>
        </Link>

        {paths?.wizard && isCorridorFull(topic.status) && (
          <Link
            href={paths.wizard}
            className="group rounded-lg border border-corridor-200 bg-corridor-50 p-4 transition hover:border-corridor-400 hover:shadow-sm"
          >
            <Compass className="h-5 w-5 text-corridor-700" />
            <p className="mt-2 font-medium text-corridor-900 group-hover:text-corridor-700">Подбор маршрута</p>
            <p className="mt-1 text-sm text-corridor-800/80">
              D8, D7, воссоединение — wizard сопоставит профиль с требованиями.
            </p>
          </Link>
        )}

        <Link
          href="/ru/guides"
          className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-corridor-400 hover:shadow-sm"
        >
          <BookOpen className="h-5 w-5 text-corridor-600" />
          <p className="mt-2 font-medium text-slate-900 group-hover:text-corridor-700">Гайды Emigro</p>
          <p className="mt-1 text-sm text-slate-600">Pillar-разборы: digital nomad, семья, отказы, бюджет.</p>
        </Link>
      </div>

      {topic.status === "in_development" && (
        <p className="mt-4 text-sm text-amber-800">
          Коридор {topic.countryRu} в разработке — wizard и детальные программы появятся после завершения наполнения.
        </p>
      )}

      {!paths && !isCorridorOnSite(topic.status) && (
        <p className="mt-4 text-sm text-slate-500">
          Полный коридор с wizard для {topic.countryRu} — в разработке. Пока доступны еженедельные новости.
        </p>
      )}
    </section>
  );
}
