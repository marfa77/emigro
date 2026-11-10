import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { createAdminClient } from "@/lib/admin/supabase";
import { SCREENING_FIELDS, SCREENING_SECTIONS } from "@/lib/screening/questions";

export const dynamic = "force-dynamic";

type Packet = { ref?: string | null; answers?: Record<string, string> };

const KNOWN_IDS = new Set(SCREENING_FIELDS.map((field) => field.id));

export default async function AdminScreeningPage() {
  const supabase = createAdminClient();
  const { data: leads, error } = await supabase
    .from("emigro_manual_leads")
    .select("id, created_at, name, email, status, source, lead_packet")
    .eq("lead_type", "screening")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold">Анкеты скрининга</h1>
          <Link href="/admin/leads" className="text-sm text-corridor-700 underline">
            Все лиды
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Ссылка для клиента: <code>https://www.emigro.online/ru/anketa?ref=метка</code>. Последние 100 анкет.
        </p>
        {error ? <p className="mt-4 text-sm text-red-700">Ошибка базы: {error.message}</p> : null}
        {!error && (leads ?? []).length === 0 ? <p className="mt-6 text-slate-600">Анкет пока нет.</p> : null}
        <div className="mt-6 space-y-6">
          {(leads ?? []).map((lead) => {
            const packet = (lead.lead_packet ?? {}) as Packet;
            const answers = packet.answers ?? {};
            const extra = Object.entries(answers).filter(([id]) => !KNOWN_IDS.has(id));
            return (
              <article
                key={lead.id as string}
                id={lead.id as string}
                className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm target:ring-2 target:ring-corridor-400"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    {(lead.name as string) || "Без имени"} · {(lead.email as string) || "—"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {new Date(lead.created_at as string).toLocaleString("ru-RU", { timeZone: "Europe/Lisbon" })} ·{" "}
                    {lead.status as string}
                    {packet.ref ? ` · метка: ${packet.ref}` : ""}
                  </p>
                </header>
                {SCREENING_SECTIONS.map((section) => {
                  const rows = section.fields.filter((field) => answers[field.id]);
                  if (rows.length === 0) return null;
                  return (
                    <section key={section.title} className="mt-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-corridor-700">{section.title}</h3>
                      <dl className="mt-1 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[minmax(0,14rem)_1fr]">
                        {rows.map((field) => (
                          <div key={field.id} className="contents">
                            <dt className="text-slate-500">{field.label}</dt>
                            <dd className="whitespace-pre-wrap text-slate-900">{answers[field.id]}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  );
                })}
                {extra.length > 0 ? (
                  <section className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Старые поля</h3>
                    <dl className="mt-1 text-sm">
                      {extra.map(([id, value]) => (
                        <div key={id}>
                          <dt className="inline text-slate-500">{id}: </dt>
                          <dd className="inline whitespace-pre-wrap">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ) : null}
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
