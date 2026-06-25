import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLeadsPage() {
  const supabase = createServerClient();
  const { data: leads } = await supabase
    .from("emigro_manual_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Manual leads (ops)</h1>
        <p className="mt-1 text-sm text-slate-500">Внутренняя таблица для ручного CPL. Без auth в MVP-A.</p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Паспорт</th>
                <th className="px-4 py-3">Маршруты</th>
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {(leads ?? []).map((lead) => (
                <tr key={lead.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.passport_iso2}</td>
                  <td className="px-4 py-3">{(lead.selected_program_slugs ?? []).join(", ")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{lead.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads?.length && <p className="p-8 text-center text-slate-500">Пока нет заявок</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
