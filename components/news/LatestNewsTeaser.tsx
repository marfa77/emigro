import Link from "next/link";
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";
import { getPublishedNewsDigests, getNewsDisplayTitle, type NewsDigest } from "@/lib/news/digests";
import { getNewsTopic, newsArticlePath, newsIndexPath } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

function formatDateRu(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type ViewProps = {
  topic: NewsTopicConfig;
  latest: NewsDigest | null | undefined;
};

export function LatestNewsTeaserView({ topic, latest }: ViewProps) {
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

function LatestNewsTeaserFallback() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-6" aria-hidden>
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="mt-4 h-6 w-full rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200" />
    </div>
  );
}

export async function LatestNewsTeaser({ topicKey }: { topicKey: string }) {
  const topic = await getNewsTopic(topicKey);
  if (!topic) return null;
  const [latest] = await getPublishedNewsDigests({ topicKey, limit: 1 });
  return <LatestNewsTeaserView topic={topic} latest={latest} />;
}

export function LatestNewsTeaserSuspense({ topicKey }: { topicKey: string }) {
  return (
    <Suspense fallback={<LatestNewsTeaserFallback />}>
      <LatestNewsTeaser topicKey={topicKey} />
    </Suspense>
  );
}
