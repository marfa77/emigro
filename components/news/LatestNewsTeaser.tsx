import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getPublishedNewsDigests, getNewsDisplayTitle } from "@/lib/news/digests";
import { getNewsTopic, newsArticlePath, newsIndexPath } from "@/lib/news/topics";

function formatDateRu(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function LatestNewsTeaser({ topicKey }: { topicKey: string }) {
  const topic = await getNewsTopic(topicKey);
  const [latest] = await getPublishedNewsDigests({ topicKey, limit: 1 });
  if (!topic) return null;

  if (!latest) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        <p className="font-medium text-slate-800">
          Новости недели — {topic.flag} {topic.countryRu}
        </p>
        <p className="mt-2">Первый выпуск появится после запуска еженедельного дайджеста.</p>
        <Link href={newsIndexPath(topic.urlSegment)} className="mt-3 inline-block text-corridor-600 hover:underline">
          Раздел новостей →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-corridor-700">{topic.flag} Последний дайджест</p>
        <Link href={newsIndexPath(topic.urlSegment)} className="text-xs text-corridor-600 hover:underline">
          Все выпуски →
        </Link>
      </div>
      <Link href={newsArticlePath(latest.slug)} className="group mt-3 block">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-corridor-700">
          {getNewsDisplayTitle(latest)}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{latest.excerpt}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          неделя до {formatDateRu(latest.week_end)}
        </p>
      </Link>
    </div>
  );
}
