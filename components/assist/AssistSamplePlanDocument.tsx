import { CheckCircle2, Circle } from "lucide-react";
import { SAMPLE_PLAN_META, SAMPLE_PLAN_SECTIONS } from "@/lib/assist/sample-plan-data";

export function AssistSamplePlanDocument() {
  return (
    <article className="sample-plan-document mx-auto max-w-[210mm] bg-white text-slate-900 shadow-xl print:max-w-none print:shadow-none">
      <header className="border-b-4 border-corridor-600 px-8 py-10 print:px-6 print:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-corridor-600">Emigro Assist</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              План релокации
            </h1>
            <p className="mt-1 text-sm text-slate-500">Персональный маршрут · конфиденциально</p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-800">ID:</span> {SAMPLE_PLAN_META.planId}
            </p>
            <p>
              <span className="font-medium text-slate-800">Дата:</span> {SAMPLE_PLAN_META.preparedAt}
            </p>
            <p className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              {SAMPLE_PLAN_META.status}
            </p>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <MetaRow label="Клиент" value={SAMPLE_PLAN_META.clientName} />
          <MetaRow label="Семья" value={SAMPLE_PLAN_META.family} />
          <MetaRow label="Маршрут" value={SAMPLE_PLAN_META.clientLocation} />
          <MetaRow label="Программа" value={SAMPLE_PLAN_META.route} />
        </dl>
      </header>

      <div className="space-y-10 px-8 py-10 print:space-y-8 print:px-6 print:py-8">
        {SAMPLE_PLAN_SECTIONS.map((section) => (
          <section key={section.id} className="break-inside-avoid">
            <h2 className="border-l-4 border-corridor-600 pl-4 text-lg font-bold text-slate-950">
              {section.title}
            </h2>

            {section.content.length > 0 && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {section.content.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.items && section.items.length > 0 && (
              <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {section.items.map(({ label, value }) => (
                  <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(140px,35%)_1fr] sm:gap-4">
                    <dt className="text-sm font-medium text-slate-500">{label}</dt>
                    <dd className="text-sm text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {section.checklist && (
              <ul className="mt-4 space-y-2">
                {section.checklist.map(({ done, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-slate-700">
                    {done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                    )}
                    <span className={done ? "" : "text-slate-600"}>{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 px-8 py-6 text-xs leading-relaxed text-slate-500 print:px-6">
        <p className="font-semibold text-slate-700">Дисклеймер</p>
        <p className="mt-2">
          Демо-документ для иллюстрации формата PDF-разбора от партнёрского специалиста. Это не юридическая консультация.
          Иммиграционные правила, суммы и сроки меняются — перед подачей проверяйте актуальные требования консульства
          и UGE. Emigro не гарантирует одобрение визы или ВНЖ.
        </p>
        <p className="mt-3">© Emigro · emigro.app · Пример плана · {SAMPLE_PLAN_META.planId}</p>
      </footer>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
