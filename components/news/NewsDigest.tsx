import Link from "next/link";
import { CalendarDays, ExternalLink, Tag } from "lucide-react";
import type { NewsDigest } from "@/lib/news/digests";
import { getNewsDisplayTitle } from "@/lib/news/digests";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsArticlePath } from "@/lib/news/topics";
import { isGoogleNewsUrl } from "@/lib/news/article-resolve";

function formatDateRu(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readableSourceTitle(title: string, url: string) {
  const clean = title.trim();
  if (clean && !/^(com|www|unknown|google news)$/i.test(clean)) return clean;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Источник";
  }
}

export function NewsDigestCard({
  digest,
  topic,
}: {
  digest: NewsDigest;
  topic?: NewsTopicConfig | null;
}) {
  const flag = topic?.flag ?? "🌍";

  return (
    <Link
      href={newsArticlePath(digest.slug)}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-corridor-500 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-corridor-50 px-2.5 py-1 font-medium text-corridor-800">
          {flag} {digest.country}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          неделя до {formatDateRu(digest.week_end)}
        </span>
      </div>
      <h2 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-corridor-700">
        {getNewsDisplayTitle(digest)}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{digest.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {digest.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function NewsArticleBody({ digest }: { digest: NewsDigest }) {
  return (
    <div>
      {digest.key_takeaways.length > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-emerald-950">Редакторский вывод</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {digest.key_takeaways.slice(3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>{item}</span>
              </li>
            ))}
            {digest.key_takeaways.length <= 3 && (
              <li className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>Проверьте изменения по своему маршруту перед подачей документов.</span>
              </li>
            )}
          </ul>
        </section>
      )}

      <div className="mt-8 space-y-5">
        {digest.content_blocks.map((block, index) => (
          <section key={`${block.heading}-${block.source_url ?? ""}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-corridor-50 text-sm font-bold text-corridor-700">
              {index + 1}
            </div>
            <div className="prose prose-slate max-w-none">
              <h2 className="mt-0">{block.heading}</h2>
            </div>
            {block.paragraphs.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
            {block.bullets && block.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                {block.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {block.source_url && block.source_name && !isGoogleNewsUrl(block.source_url) && (
              <p className="not-prose mt-3 text-sm text-slate-500">
                Источник:{" "}
                <a
                  href={block.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-corridor-700 hover:underline"
                >
                  {readableSourceTitle(block.source_name, block.source_url)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {block.story_title && block.story_title !== block.heading ? (
                  <span className="block mt-1 text-xs text-slate-400">{block.story_title}</span>
                ) : null}
              </p>
            )}
          </section>
        ))}
      </div>

      {digest.source_links.filter((s) => s.url && !isGoogleNewsUrl(s.url)).length > 0 && (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Источники недели</h2>
          <ul className="mt-4 space-y-2">
            {digest.source_links
              .filter((s) => s.url && !isGoogleNewsUrl(s.url))
              .map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-2 text-corridor-700 hover:underline"
                  >
                    {readableSourceTitle(s.title, s.url)}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
}
