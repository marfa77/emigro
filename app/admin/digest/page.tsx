import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { getCorridorBySlug } from "@/lib/corridor/queries";

export default async function AdminDigestPage() {
  const corridor = await getCorridorBySlug("ru-speaking-to-portugal");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Corridor digest items</h1>
        <p className="mt-1 text-sm text-slate-500">
          Таблица <code>emigro_corridor_digest_items</code> — справочник на /ru/portugal/digest.
        </p>

        {!corridor ? (
          <p className="mt-8 text-slate-600">Коридор не найден.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {corridor.digest.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-medium uppercase text-corridor-600">{item.category}</p>
                <h2 className="mt-1 font-semibold">{item.title_ru}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.body_ru}</p>
                <p className="mt-2 font-mono text-xs text-slate-400">{item.id}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
