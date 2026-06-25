import Link from "next/link";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsIndexPath } from "@/lib/news/topics";

export function NewsCountryNav({
  topics,
  activeCountry,
}: {
  topics: NewsTopicConfig[];
  activeCountry?: string;
}) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Страны">
      <Link
        href={newsIndexPath()}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          !activeCountry
            ? "bg-corridor-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Все страны
      </Link>
      {topics.map((topic) => (
        <Link
          key={topic.key}
          href={newsIndexPath(topic.urlSegment)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            activeCountry === topic.urlSegment
              ? "bg-corridor-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {topic.flag} {topic.countryRu}
        </Link>
      ))}
    </nav>
  );
}
