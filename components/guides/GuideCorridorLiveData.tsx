import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import type { GuideCorridorLiveMeta, GuideLiveProgramRow } from "@/lib/guides/corridor-live-data";

export function GuideCorridorLiveData({
  programs,
  meta,
}: {
  programs: GuideLiveProgramRow[];
  meta: GuideCorridorLiveMeta | null;
}) {
  if (programs.length === 0 || !meta) return null;

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm ring-1 ring-emerald-100 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
          <Database className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Актуальные пороги из коридора Emigro</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Данные программ {meta.countryNameRu} в базе Emigro — сверяйте с официальными источниками перед подачей.
          </p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-200 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              <th className="px-3 py-2">Программа</th>
              <th className="px-3 py-2">Порог / ключевое</th>
              <th className="px-3 py-2">RU-паспорт</th>
              <th className="px-3 py-2">Проверено</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((row) => (
              <tr key={row.href} className="border-b border-emerald-100/80">
                <td className="px-3 py-3 align-top font-medium text-slate-900">
                  <Link href={row.href} className="text-corridor-700 hover:text-corridor-900">
                    {row.title}
                  </Link>
                </td>
                <td className="px-3 py-3 align-top text-slate-700">{row.incomeThreshold ?? "—"}</td>
                <td className="px-3 py-3 align-top text-slate-700">{row.passportRu ?? "—"}</td>
                <td className="px-3 py-3 align-top text-slate-600">{row.lastVerified ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href={meta.wizardHref}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-corridor-700 hover:text-corridor-900"
      >
        Проверить свой профиль в wizard {meta.countryNameRu}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
