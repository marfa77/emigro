import type { GuideOfficialSource } from "@/lib/guides/load";

export function GuideOfficialSources({ sources }: { sources: GuideOfficialSource[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5">
      <h2 className="text-xl font-semibold text-slate-900">Официальные источники</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Проверяйте пороги и процедуры на дату подачи — ссылки на первоисточники:
      </p>
      <ul className="mt-5 space-y-3">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-corridor-700 underline decoration-corridor-200 underline-offset-2 hover:text-corridor-900"
            >
              {source.label}
            </a>
            <span className="mt-1 block truncate text-xs text-slate-500">{source.url}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
