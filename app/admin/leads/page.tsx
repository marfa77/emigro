import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { createAdminClient } from "@/lib/admin/supabase";

type LeadPacket = {
  budget_eur?: unknown;
  asset?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "—";
}

function budget(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `€${value.toLocaleString("en-US")}`
    : "—";
}

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();
  const { data: leads } = await supabase
    .from("emigro_manual_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  const leadIds = (leads ?? []).map((lead) => lead.id as string);
  const { data: assignments } = leadIds.length
    ? await supabase
        .from("emigro_lead_assignments")
        .select("lead_id, provider_id, status, attribution_model, attribution_expires_at")
        .in("lead_id", leadIds)
    : { data: [] };
  const assignmentsByLead = new Map(
    (assignments ?? []).map((assignment) => [assignment.lead_id as string, assignment])
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Manual leads (ops)</h1>
        <p className="mt-1 text-sm text-slate-500">
          Внутренняя таблица Assist и Investment Migration. Без изменения текущей auth-модели.
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Контакт</th>
                <th className="px-4 py-3">Направление / источник</th>
                <th className="px-4 py-3">Бюджет / актив</th>
                <th className="px-4 py-3">Программа</th>
                <th className="px-4 py-3">Партнёр / атрибуция</th>
                <th className="px-4 py-3">Согласие</th>
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {(leads ?? []).map((lead) => {
                const isInvestment = lead.lead_type === "investment";
                const packet = (lead.lead_packet ?? {}) as LeadPacket;
                const assignment = assignmentsByLead.get(lead.id as string);
                const providers = (lead.selected_provider_ids ?? []) as string[];
                return (
                  <tr key={lead.id} className="border-b align-top last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
                          isInvestment
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isInvestment ? "Investment" : "Assist"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{lead.name}</td>
                    <td className="px-4 py-3">
                      <div>{lead.email}</div>
                      {lead.telegram && lead.telegram !== lead.email ? (
                        <div className="mt-1 text-xs text-slate-500">{lead.telegram}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div>{text(lead.destination_iso2)}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {text(lead.source)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{isInvestment ? budget(packet.budget_eur) : "—"}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {isInvestment ? text(packet.asset) : `Паспорт: ${text(lead.passport_iso2)}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {((lead.selected_program_slugs ?? []) as string[]).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div>{assignment?.provider_id ?? (providers.join(", ") || "—")}</div>
                      {assignment ? (
                        <div className="mt-1 whitespace-nowrap text-xs text-slate-500">
                          {assignment.status} · {assignment.attribution_model}
                          {assignment.attribution_expires_at
                            ? ` · до ${new Date(assignment.attribution_expires_at).toLocaleDateString("ru-RU")}`
                            : ""}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {lead.consent_at ? (
                        <>
                          <div>{new Date(lead.consent_at).toLocaleDateString("ru-RU")}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {text(lead.consent_version)}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!leads?.length && <p className="p-8 text-center text-slate-500">Пока нет заявок</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
