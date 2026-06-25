import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminCorridorsPage() {
  const supabase = createServerClient();
  const { data: corridors } = await supabase
    .from("emigro_corridors")
    .select("slug, title_ru, url_segment, publish_status, is_published")
    .order("slug");

  const { data: topics } = await supabase
    .from("emigro_news_topics")
    .select("key, status, corridor_slug, site_paths")
    .order("sort_order");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Corridors — publish lifecycle</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          <code>emigro_corridors.publish_status</code> управляет видимостью на сайте. Триггер синхронизирует{" "}
          <code>emigro_news_topics</code>.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-slate-600">
          <li>
            <strong>draft</strong> — коридор не на сайте (только новости, если topic = news_only)
          </li>
          <li>
            <strong>in_development</strong> — лендинг + справочник + новости, бейдж «в разработке»
          </li>
          <li>
            <strong>active</strong> — полный коридор (wizard, программы)
          </li>
        </ul>
        <p className="mt-3 font-mono text-xs text-slate-500">
          PATCH /api/v1/admin/corridors/{"{slug}"} — body: {"{ \"publish_status\": \"in_development\" }"}
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">slug</th>
                <th className="px-4 py-3">url_segment</th>
                <th className="px-4 py-3">publish_status</th>
                <th className="px-4 py-3">topic sync</th>
              </tr>
            </thead>
            <tbody>
              {(corridors ?? []).map((c) => {
                const topic = (topics ?? []).find((t) => t.corridor_slug === c.slug || t.key === c.url_segment);
                return (
                  <tr key={c.slug} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.title_ru}</div>
                      <div className="font-mono text-xs text-slate-500">{c.slug}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{c.url_segment ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.publish_status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.publish_status === "in_development"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.publish_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {topic ? `${topic.key} → ${topic.status}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
