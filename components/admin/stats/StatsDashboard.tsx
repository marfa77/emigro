import { countryFlag, deltaLine, type StatsReport } from "@/lib/analytics/stats";
import {
  DeltaBadge,
  Funnel,
  HealthBadge,
  KpiCard,
  Section,
  Sparkline,
  TopList,
} from "@/components/admin/stats/DashboardVisuals";

function pct(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";
}

function dateTime(value: string | null): string {
  if (!value) return "нет данных";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function StatsDashboard({ report }: { report: StatsReport }) {
  const { portfolio } = report;
  const core = portfolio.surfaces.find((surface) => surface.key === "core");
  const investment = portfolio.investment;

  return (
    <div className="mt-8 space-y-6">
      <nav className="flex gap-2 overflow-x-auto pb-1 text-sm">
        {[
          ["#pulse", "Pulse"],
          ["#products", "Воронки"],
          ["#satellites", "Сателлиты"],
          ["#investment", "Инвестиции"],
          ["#community", "TG и контент"],
          ["#search", "GSC"],
          ["#threads", "Threads"],
          ["#details", "Детали"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:border-corridor-300">
            {label}
          </a>
        ))}
      </nav>

      <section id="pulse" className="scroll-mt-24 rounded-2xl bg-slate-950 p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-corridor-300">Executive pulse</p>
            <h2 className="mt-2 text-2xl font-bold">Что происходит с Emigro</h2>
          </div>
          <p className="text-xs text-slate-400">Сегодня против вчера · 7 дней против предыдущих 7</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Посетители сегодня" value={report.today.visitors} previous={report.yesterday.visitors} hint={`${report.todayNewVisitors} новых · ${report.todayReturningVisitors} вернулись`} />
          <KpiCard label="Просмотры сегодня" value={report.today.pageViews} previous={report.yesterday.pageViews} hint={`${report.llmToday} LLM-сессий`} />
          <KpiCard label="Лиды сегодня" value={report.today.leads} previous={report.yesterday.leads} hint={`${report.assist.leadsToday} Assist · ${investment.leads7d} invest за 7д`} />
          <KpiCard label="Переходы в чаты" value={report.assist.communityClicksToday} previous={report.assist.communityClicksYesterday} hint="intent, не подтверждённый join" />
        </div>
        {report.revolutReferral.active ? (
          <div className="mt-4 rounded-xl bg-indigo-500/15 p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
                  Revolut referral · личка до {report.revolutReferral.personalEndsOn} · юрик до {report.revolutReferral.businessEndsOn}
                </p>
                <p className="mt-1 text-sm text-indigo-100">Клики с гайдов (provider_click)</p>
              </div>
              <DeltaBadge current={report.revolutReferral.clicksToday} previous={report.revolutReferral.clicksYesterday} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-indigo-200/80">Сегодня всего</p>
                <p className="text-xl font-bold">{report.revolutReferral.clicksToday}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200/80">Личка сегодня</p>
                <p className="text-xl font-bold">{report.revolutReferral.personal.clicksToday}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200/80">Юрик сегодня</p>
                <p className="text-xl font-bold">{report.revolutReferral.business.clicksToday}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200/80">Кампания</p>
                <p className="text-xl font-bold">{report.revolutReferral.clicksCampaign}</p>
              </div>
            </div>
            {report.revolutReferral.byContent.length > 0 ? (
              <p className="mt-3 truncate text-xs text-indigo-100/80">
                {report.revolutReferral.byContent
                  .slice(0, 4)
                  .map(([slug, count]) => `${slug} ×${count}`)
                  .join(" · ")}
              </p>
            ) : null}
          </div>
        ) : null}
        {core ? (
          <div className="mt-4 rounded-xl bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">Core: посетители за 30 дней</span>
              <DeltaBadge current={core.current7d.visitors} previous={core.previous7d.visitors} />
            </div>
            <Sparkline values={core.trend.map((point) => point.visitors)} label="Посетители Emigro core за 30 дней" className="text-corridor-300" />
          </div>
        ) : null}
      </section>

      <Section id="products" title="Продуктовые воронки" subtitle="7 дней для портфельного контроля; дневные значения — в pulse и деталях">
        <div className="grid gap-7 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold text-slate-900">Wizard → Telegram</h3>
            <Funnel steps={[
              { label: "Wizard started сегодня", value: report.today.wizardStarted },
              { label: "Wizard completed", value: report.today.wizardCompleted },
              { label: "Results view", value: report.wizardTelegram.resultsViewsToday },
              { label: "Отчёт доставлен в TG", value: report.wizardTelegram.deliveriesToday },
            ]} />
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-slate-900">Emigro Assist сегодня</h3>
            <Funnel steps={[
              { label: "Просмотры /assist", value: report.assist.pageViewsToday },
              { label: "Клики CTA", value: report.assist.ctaClicksToday },
              { label: "Заявки", value: report.assist.leadsToday },
            ]} />
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-slate-900">Investment за 7 дней</h3>
            <Funnel steps={[
              { label: "Просмотры /invest", value: investment.pageViews7d },
              { label: "Qualifier started", value: investment.qualifierStarted7d },
              { label: "Qualifier completed", value: investment.qualifierCompleted7d },
              { label: "Лиды в CRM", value: investment.leads7d, hint: "CRM — источник истины" },
            ]} />
          </div>
        </div>
      </Section>

      <Section id="satellites" title="Сателлиты" subtitle="Трафик и конверсии по hostname; для старой истории доступен fallback по `/satellite/*`">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {portfolio.surfaces.map((surface) => (
            <article key={surface.key} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{surface.label}</h3>
                <DeltaBadge current={surface.current7d.visitors} previous={surface.previous7d.visitors} />
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums">{surface.current7d.visitors}</p>
              <p className="text-xs text-slate-400">посетителей за 7д</p>
              <Sparkline values={surface.trend.map((point) => point.visitors)} label={`${surface.label}: посетители за 30 дней`} />
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><dt className="text-slate-400">PV</dt><dd className="font-semibold">{surface.current7d.pageViews}</dd></div>
                <div><dt className="text-slate-400">Wizard</dt><dd className="font-semibold">{surface.current7d.wizardStarted}</dd></div>
                <div><dt className="text-slate-400">Assist</dt><dd className="font-semibold">{surface.current7d.assistClicks}</dd></div>
                <div><dt className="text-slate-400">Chat intent</dt><dd className="font-semibold">{surface.current7d.communityClicks}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section id="investment" title="Инвестиционная миграция" subtitle="Воронка сайта + CRM и партнёрская атрибуция; капитал профилей не равен выручке">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="PV /invest · 7д"
            value={investment.pageViews7d}
            previous={investment.pageViewsPrevious7d}
            hint={`hub ${investment.hubViews7d} · страны ${investment.countryViews7d} · results ${investment.resultsViews7d}`}
          />
          <KpiCard label="Лиды · 7д" value={investment.leads7d} hint={`${investment.leadsTotal} всего`} />
          <KpiCard label="Назначены" value={investment.assigned} hint={`${pct(investment.assigned, investment.leadsTotal)} от лидов`} />
          <KpiCard label="Won / Lost" value={`${investment.won} / ${investment.lost}`} />
          <KpiCard label="Капитал профилей" value={`€${investment.budgetTotalEur.toLocaleString("ru-RU")}`} hint="не revenue и не AUM" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TopList title="Страницы · 7д" rows={investment.topPages7d} />
          <TopList title="Направления" rows={investment.topDestinations} />
          <TopList title="Активы" rows={investment.topAssets} />
          <TopList title="Цели" rows={investment.topOutcomes} />
          <TopList title="Готовность средств" rows={investment.topReadiness} />
        </div>
      </Section>

      <Section id="community" title="Telegram и community pipeline" subtitle="22 внешних источника → сигналы → заметки; owned-чаты измеряются отдельными дневными снимками">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-3 pr-4">Сателлит</th>
                <th className="pb-3 pr-4">Источники</th>
                <th className="pb-3 pr-4">Сигналы 7д</th>
                <th className="pb-3 pr-4">Backlog</th>
                <th className="pb-3 pr-4">Опубликовано</th>
                <th className="pb-3 pr-4">Spotlight 30д</th>
                <th className="pb-3">Последний сигнал</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.community.map((country) => (
                <tr key={country.countryKey} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-semibold">{country.label}</td>
                  <td className="py-3 pr-4"><HealthBadge active={country.activeChannels} total={country.totalChannels} /></td>
                  <td className="py-3 pr-4 tabular-nums">{country.signals7d}</td>
                  <td className="py-3 pr-4 tabular-nums">{country.backlog}</td>
                  <td className="py-3 pr-4 tabular-nums">{country.publishedNotes} <span className="text-xs text-slate-400">(+{country.published7d})</span></td>
                  <td className="py-3 pr-4 tabular-nums">{country.spotlightDays30}/30</td>
                  <td className="py-3 text-slate-500">{dateTime(country.latestSignalAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.ownedChats.map((chat) => (
            <KpiCard
              key={chat.countryKey}
              label={chat.label}
              value={chat.members ?? "—"}
              previous={chat.previous7d ?? undefined}
              hint="реальные участники Telegram"
            >
              <Sparkline values={chat.trend.map((point) => point.value)} label={`${chat.label}: участники за 30 дней`} />
            </KpiCard>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Снимки участников: {portfolio.snapshotCapturedAt ? dateTime(portfolio.snapshotCapturedAt) : "ещё не собраны; collector запустится ежедневно"}.
        </p>
      </Section>

      <Section id="search" title="Google Search Console" subtitle={portfolio.searchConsole.available ? `${portfolio.searchConsole.startDate} — ${portfolio.searchConsole.endDate} · данные Google с лагом` : "Блок не мешает остальной статистике при недоступном GSC"}>
        {portfolio.searchConsole.available ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Клики · 28д" value={portfolio.searchConsole.clicks} previous={portfolio.searchConsole.previousClicks} />
              <KpiCard label="Показы · 28д" value={portfolio.searchConsole.impressions} previous={portfolio.searchConsole.previousImpressions} />
              <KpiCard label="CTR" value={`${(portfolio.searchConsole.ctr * 100).toFixed(1)}%`} />
              <KpiCard label="Средняя позиция" value={portfolio.searchConsole.position.toFixed(1)} />
            </div>
            <Sparkline values={portfolio.searchConsole.trend.map((point) => point.clicks)} label="Клики из Google за 28 дней" />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <TopList title="Страницы · клики" rows={portfolio.searchConsole.topPages.map((row) => [row.key, row.clicks])} />
              <TopList title="Запросы · показы" rows={portfolio.searchConsole.topQueries.map((row) => [row.key, row.impressions])} />
              <TopList title="Surface · клики" rows={portfolio.searchConsole.surfaces.map((row) => [row.key, row.clicks])} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            GSC недоступен: {portfolio.searchConsole.error || "credentials missing"}
          </div>
        )}
      </Section>

      <Section id="threads" title="Threads: два работающих канала" subtitle="Переходы разделены по UTM campaign; downstream считается по browser session">
        <div className="grid gap-4 lg:grid-cols-2">
          {portfolio.threadsAccounts.map((account) => (
            <article key={account.handle} className="rounded-xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold">@{account.handle}</h3>
                <DeltaBadge current={account.sessions7d} previous={account.sessionsPrevious7d} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div><p className="text-xs text-slate-400">Followers</p><p className="text-xl font-bold">{account.followers?.toLocaleString("ru-RU") ?? "—"}</p></div>
                <div><p className="text-xs text-slate-400">Переходы 7д</p><p className="text-xl font-bold">{account.sessions7d}</p></div>
                <div><p className="text-xs text-slate-400">Переходы 30д</p><p className="text-xl font-bold">{account.sessions30d}</p></div>
              </div>
              <Sparkline values={account.trend.map((point) => point.sessions)} label={`Переходы из @${account.handle} за 30 дней`} />
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-slate-400">Wizard starts</dt><dd className="font-semibold">{account.wizardStarts}</dd></div>
                <div><dt className="text-slate-400">Assist clicks</dt><dd className="font-semibold">{account.assistClicks}</dd></div>
                <div><dt className="text-slate-400">Qualifier starts</dt><dd className="font-semibold">{account.qualifierStarts}</dd></div>
                <div><dt className="text-slate-400">Invest leads</dt><dd className="font-semibold">{account.leads}</dd></div>
              </dl>
              <div className="mt-4"><TopList title="Landing pages" rows={account.topLandings} /></div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="details" title="Acquisition и подробности" subtitle="Прежние срезы сохранены ниже продуктового pulse">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TopList title="Поиск сегодня" rows={report.topPagesSearchToday} />
          <TopList title="LLM сегодня" rows={report.topPagesLlmToday} />
          <TopList title="LLM-источники" rows={report.llmSourcesToday} />
          <TopList title="Каналы сегодня" rows={report.channelMixToday} />
          <TopList title="Страницы сегодня" rows={report.topPagesToday} />
          <TopList title="Discovery всего" rows={report.topPagesDiscoveryAll} />
          <TopList title="Referrer сегодня" rows={report.topReferrersToday} />
          <TopList title="UTM source" rows={report.topUtmToday} />
          <TopList title="Страны" rows={report.topCountriesToday.map(([code, count]) => [`${countryFlag(code)} ${code}`, count])} />
          <TopList title="Assist CTA placements" rows={report.assist.topCtaPlacementsToday} />
          <TopList title="Чаты: страна · placement" rows={report.assist.topCommunityPlacementsToday} />
          <TopList title="Клики партнёров" rows={report.topProvidersToday} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {([
            ["RU", report.localeSplit.today.ru, report.localeSplit.yesterday.ru],
            ["ES / LATAM", report.localeSplit.today.es, report.localeSplit.yesterday.es],
            ["FR / Afrique", report.localeSplit.today.fr, report.localeSplit.yesterday.fr],
          ] as const).map(([label, today, yesterday]) => (
            <div key={label} className="rounded-xl border border-slate-200 p-4 text-sm">
              <h3 className="font-semibold">{label}</h3>
              <p className="mt-2">PV: <strong>{today.pageViews}</strong> <span className="text-xs text-slate-400">{deltaLine(today.pageViews, yesterday.pageViews)}</span></p>
              <p>Wizard: <strong>{today.wizardStarted}</strong></p>
              <p>Results: <strong>{today.resultsViews}</strong></p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold">Последние посетители сегодня</h3>
          {report.recentSessions.length ? (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {report.recentSessions.map((session) => (
                <li key={session.sessionId} className="rounded-lg bg-white p-3 text-sm">
                  <span className="font-mono text-xs text-slate-400">{session.isReturning ? "↩" : "✨"} {session.sessionId}</span>
                  <p className="mt-1 truncate font-medium">{session.pagePath ?? "/"}</p>
                  <p className="truncate text-xs text-slate-500">{[session.country, session.llm || session.channel, session.referrer].filter(Boolean).join(" · ") || "direct"}</p>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-slate-400">Пока нет данных</p>}
        </div>
      </Section>
    </div>
  );
}
