import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { StatsDashboard } from "@/components/admin/stats/StatsDashboard";
import { buildStatsReport } from "@/lib/analytics/stats";

export default async function AdminStatsPage() {
  let report;
  let error: string | null = null;
  try {
    report = await buildStatsReport();
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Не удалось загрузить статистику";
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Emigro · dashboard-digest</h1>
            <p className="mt-1 text-sm text-slate-500">
              Продукты, сателлиты, сообщества и поиск · без ботов ·{" "}
              <Link href="/admin" className="text-corridor-600 hover:underline">
                ← Admin
              </Link>
            </p>
          </div>
          {report ? (
            <p className="text-sm text-slate-500">
              TZ: <code>{report.timezone}</code> · сегодня {report.todayLabel}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {error}. Проверьте Supabase migrations, <code>SUPABASE_SERVICE_ROLE_KEY</code> и необязательные GSC credentials.
          </div>
        ) : null}

        {report ? <StatsDashboard report={report} /> : null}
      </main>
      <SiteFooter />
    </>
  );
}
