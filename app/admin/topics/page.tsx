import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { createServerClient } from "@/lib/supabase/server";
import { mapNewsTopicRow } from "@/lib/news/topics";

export default async function AdminTopicsPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("emigro_news_topics")
    .select("*")
    .order("sort_order")
    .order("key");

  const topics = (data ?? []).map(mapNewsTopicRow);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">News destinations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Таблица <code>emigro_news_topics</code> — сайт и Prep2Go-import читают отсюда; RSS queries остаются только для ручного legacy-скрипта.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">key</th>
                <th className="px-4 py-3">Страна</th>
                <th className="px-4 py-3">status</th>
                <th className="px-4 py-3">corridor</th>
                <th className="px-4 py-3">RSS queries</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.key} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{t.key}</td>
                  <td className="px-4 py-3">
                    {t.flag} {t.countryRu}
                  </td>
                  <td className="px-4 py-3">{t.status}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.corridorSlug ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.rssQueries.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {topics.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              Нет строк — выполните <code>npm run db:push</code>
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
