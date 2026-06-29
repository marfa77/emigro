import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { buildStatsReport, countryFlag, deltaLine } from "@/lib/analytics/stats";

function MetricRow({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: number;
  delta?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 py-2 last:border-0">
      <span className="text-slate-700">{label}</span>
      <span className="text-right">
        <strong className="text-slate-900">{value.toLocaleString("ru-RU")}</strong>
        {delta && <span className="ml-2 text-xs text-slate-500">{delta}</span>}
        {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
      </span>
    </div>
  );
}

function TopList({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map(([value, cnt]) => (
          <li key={`${title}-${value}`} className="flex justify-between gap-3">
            <span className="truncate text-slate-700" title={value}>
              {value}
            </span>
            <span className="shrink-0 font-medium text-slate-900">{cnt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function AdminStatsPage() {
  let report;
  let error: string | null = null;
  try {
    report = await buildStatsReport();
  } catch (e) {
    error = e instanceof Error ? e.message : "Не удалось загрузить статистику";
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Статистика сайта</h1>
            <p className="mt-1 text-sm text-slate-500">
              Emigro · browser-id, без ботов ·{" "}
              <Link href="/admin" className="text-corridor-600 hover:underline">
                ← Admin
              </Link>
            </p>
          </div>
          {report && (
            <p className="text-sm text-slate-500">
              TZ: <code>{report.timezone}</code> · сегодня {report.todayLabel}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {error}. Примените миграцию <code>20260628150000_site_events.sql</code> и проверьте{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code>.
          </div>
        )}

        {report && (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Нарастающий итог
              </h2>
              <div className="mt-3">
                <MetricRow label="Уникальные посетители" value={report.total.visitors} hint="(browser-id)" />
                <MetricRow label="Просмотры страниц" value={report.total.pageViews} />
                <MetricRow label="Сессии (session_start)" value={report.total.newSessions} />
                <MetricRow label="Сессии с визардом" value={report.total.wizardStarted} />
                <MetricRow label="Завершения визарда" value={report.total.wizardCompleted} />
                <MetricRow label="Лиды" value={report.total.leads} />
                <MetricRow label="Событий в БД" value={report.total.eventsTotal} />
                <MetricRow label="Боты (исключены)" value={report.botsTotal} />
              </div>
            </section>

            <section className="rounded-xl border border-corridor-100 bg-corridor-50/40 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-corridor-800">Сегодня</h2>
              <div className="mt-3">
                <MetricRow
                  label="Посетители"
                  value={report.today.visitors}
                  delta={deltaLine(report.today.visitors, report.yesterday.visitors)}
                />
                <MetricRow
                  label="↩ вернулись"
                  value={report.todayReturningVisitors}
                  delta={deltaLine(report.todayReturningVisitors, report.yesterdayReturningVisitors)}
                />
                <MetricRow
                  label="✨ новые"
                  value={report.todayNewVisitors}
                  delta={deltaLine(report.todayNewVisitors, report.yesterdayNewVisitors)}
                />
                <MetricRow
                  label="Просмотры страниц"
                  value={report.today.pageViews}
                  delta={deltaLine(report.today.pageViews, report.yesterday.pageViews)}
                />
                <MetricRow
                  label="Новые сессии"
                  value={report.today.newSessions}
                  delta={deltaLine(report.today.newSessions, report.yesterday.newSessions)}
                />
                <MetricRow
                  label="Визард started"
                  value={report.today.wizardStarted}
                  delta={deltaLine(report.today.wizardStarted, report.yesterday.wizardStarted)}
                />
                <MetricRow
                  label="Лиды"
                  value={report.today.leads}
                  delta={deltaLine(report.today.leads, report.yesterday.leads)}
                />
                <MetricRow
                  label="LLM-трафик"
                  value={report.llmToday}
                  delta={deltaLine(report.llmToday, report.llmYesterday)}
                  hint={`(всего ${report.llmTotal})`}
                />
                <MetricRow
                  label="Боты (исключены)"
                  value={report.botsToday}
                  delta={deltaLine(report.botsToday, report.botsYesterday)}
                  hint={`(всего ${report.botsTotal})`}
                />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Динамика 7 дней
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {report.trend.map((row) => (
                  <li key={row.dayLabel} className="flex items-center gap-3">
                    <span className="w-12 shrink-0 text-slate-500">{row.dayLabel}</span>
                    <span className="w-24 shrink-0">
                      <strong>{row.visitors}</strong> / {row.pageViews}
                    </span>
                    <span className="text-corridor-500">
                      {"▪".repeat(Math.min(row.visitors, 12)) || "·"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <TopList title="Топ страниц сегодня" rows={report.topPagesToday} />
              <TopList title="Топ страниц всего" rows={report.topPagesAll} />
              <TopList title="Referrer сегодня" rows={report.topReferrersToday} />
              <TopList title="UTM source сегодня" rows={report.topUtmToday} />
              <TopList
                title="Страны сегодня"
                rows={report.topCountriesToday.map(([code, cnt]) => [
                  `${countryFlag(code)} ${code}`,
                  cnt,
                ])}
              />
              <TopList title="Языки сегодня" rows={report.topLangToday} />
              <TopList title="Устройства сегодня" rows={report.topDeviceToday} />
              <TopList title="Браузеры сегодня" rows={report.topBrowserToday} />
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Посетители сегодня
              </h2>
              {report.recentSessions.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">— пока нет</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {report.recentSessions.map((s) => (
                    <li key={s.sessionId} className="rounded-lg bg-slate-50 px-3 py-2">
                      <span className="font-mono text-xs text-slate-500">
                        {s.isReturning ? "↩ " : "✨ "}
                        {s.sessionId}
                      </span>
                      <div className="mt-1 truncate text-slate-800">{s.pagePath ?? "—"}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {[s.country, s.llm, s.referrer].filter(Boolean).join(" · ") || "direct"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
