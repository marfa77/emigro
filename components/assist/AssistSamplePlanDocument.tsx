import { CheckCircle2 } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { NEWS_TELEGRAM_URL } from "@/lib/community";
import { SAMPLE_PLAN_META, SAMPLE_PLAN_SECTIONS } from "@/lib/assist/sample-plan-data";

const SEVERITY_STYLES = {
  Высокий: "bg-red-100 text-red-800",
  Средний: "bg-amber-100 text-amber-800",
  Низкий: "bg-green-100 text-green-800",
} as const;

export function AssistSamplePlanDocument() {
  return (
    <article className="sample-plan-document mx-auto max-w-[210mm] bg-white text-slate-900 shadow-xl print:max-w-none print:shadow-none">
      <header className="border-b-4 border-corridor-600 px-8 py-10 print:px-6 print:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-corridor-600">
              Emigro Assist · {SAMPLE_PLAN_META.documentType}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {SAMPLE_PLAN_META.documentType}: {SAMPLE_PLAN_META.clientName}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{SAMPLE_PLAN_META.subtitle}</p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-800">Дата:</span> {SAMPLE_PLAN_META.preparedAt}
            </p>
            <p>
              <span className="font-medium text-slate-800">ID:</span> {SAMPLE_PLAN_META.planId}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-10 px-8 py-10 print:space-y-8 print:px-6 print:py-8">
        {SAMPLE_PLAN_SECTIONS.map((section) => (
          <section key={section.id} className="break-inside-avoid">
            <h2 className="flex items-baseline gap-3 border-l-4 border-corridor-600 pl-4 text-lg font-bold text-slate-950">
              <span className="text-sm font-semibold text-corridor-600">{section.number}</span>
              <span>{section.title}</span>
            </h2>

            {section.content && section.content.length > 0 && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {section.content.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.items && section.items.length > 0 && (
              <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {section.items.map(({ label, value }) => (
                  <div
                    key={label}
                    className={`grid gap-1 px-4 py-3 sm:grid-cols-[minmax(140px,35%)_1fr] sm:gap-4 ${
                      label === "ИТОГО" ? "bg-corridor-50 font-semibold" : ""
                    }`}
                  >
                    <dt className="text-sm font-medium text-slate-500">{label}</dt>
                    <dd className="text-sm text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {section.comparisonTable && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Вариант</th>
                      <th className="px-4 py-3 font-semibold">Порог</th>
                      <th className="px-4 py-3 font-semibold">Налог</th>
                      <th className="px-4 py-3 font-semibold">Работа</th>
                      <th className="px-4 py-3 font-semibold">Вывод</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {section.comparisonTable.map((row) => (
                      <tr key={row.variant} className={row.recommended ? "bg-corridor-50/70" : undefined}>
                        <td className="px-4 py-3 font-medium text-slate-900">{row.variant}</td>
                        <td className="px-4 py-3 text-slate-700">{row.threshold}</td>
                        <td className="px-4 py-3 text-slate-700">{row.tax}</td>
                        <td className="px-4 py-3 text-slate-700">{row.work}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{row.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.risks && (
              <ul className="mt-4 space-y-4">
                {section.risks.map((risk) => (
                  <li key={risk.title} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{risk.title}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[risk.severity]}`}
                      >
                        {risk.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{risk.description}</p>
                  </li>
                ))}
              </ul>
            )}

            {section.documentChecklist && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Документ</th>
                      <th className="px-4 py-3 font-semibold">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {section.documentChecklist.map((item) => (
                      <tr key={item.document}>
                        <td className="px-4 py-3 text-slate-800">{item.document}</td>
                        <td className="px-4 py-3">
                          {item.status === "done" ? (
                            <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
                              <CheckCircle2 className="h-4 w-4" aria-hidden />
                              {item.statusLabel}
                            </span>
                          ) : (
                            <span className="font-medium text-amber-700">{item.statusLabel}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.providers && (
              <ul className="mt-4 space-y-4">
                {section.providers.map((provider) => (
                  <li key={provider.title} className="rounded-xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-900">{provider.title}</p>
                    <p className="mt-1 text-sm font-medium text-corridor-700">{provider.scope}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{provider.criteria}</p>
                    {provider.cost !== "—" && (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-800">Стоимость:</span> {provider.cost}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {section.nextSteps && (
              <ol className="mt-4 space-y-4">
                {section.nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-corridor-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {section.footnote && (
              <p className="mt-3 text-xs italic text-slate-500">* {section.footnote}</p>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 px-8 py-6 text-xs leading-relaxed text-slate-500 print:px-6">
        <p>
          Emigro Assist · emigro.online · {CONTACT_EMAIL} · {NEWS_TELEGRAM_URL.replace(/^https:\/\//, "")}
        </p>
        <p className="mt-2">
          Документ не является юридической консультацией. Emigro не несёт ответственности за решения консульства,
          AEAT или Extranjería. Проверяйте актуальные требования на дату подачи.
        </p>
        <p className="mt-3">© Emigro · Пример Route Check · {SAMPLE_PLAN_META.planId}</p>
      </footer>
    </article>
  );
}
