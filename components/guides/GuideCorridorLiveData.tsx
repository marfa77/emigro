import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import type { GuideLiveCorridorBlock, GuideLiveDataPayload } from "@/lib/guides/corridor-live-data";

function LiveProgramsTable({
  block,
  passportLabel,
}: {
  block: GuideLiveCorridorBlock;
  passportLabel: string;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900">{block.meta.countryNameRu}</h3>
      <p className="mt-1 text-sm text-slate-600">
        Данные программ {block.meta.countryNameRu} в базе Emigro — сверяйте с официальными источниками перед подачей.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-200 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              <th className="px-3 py-2">Программа</th>
              <th className="px-3 py-2">Порог / ключевое</th>
              <th className="px-3 py-2">{passportLabel}</th>
              <th className="px-3 py-2">Проверено</th>
            </tr>
          </thead>
          <tbody>
            {block.programs.map((row) => (
              <tr key={row.href} className="border-b border-emerald-100/80">
                <td className="px-3 py-3 align-top font-medium text-slate-900">
                  <Link href={row.href} className="text-corridor-700 hover:text-corridor-900">
                    {row.title}
                  </Link>
                </td>
                <td className="px-3 py-3 align-top text-slate-700">{row.incomeThreshold ?? "—"}</td>
                <td className="px-3 py-3 align-top text-slate-700">{row.passportStatus ?? "—"}</td>
                <td className="px-3 py-3 align-top text-slate-600">{row.lastVerified ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href={block.meta.wizardHref}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-corridor-700 hover:text-corridor-900"
      >
        Проверить свой профиль в wizard {block.meta.countryNameRu}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function GuideCorridorLiveData({ liveData }: { liveData: GuideLiveDataPayload }) {
  if (liveData.blocks.length === 0) return null;

  const multi = liveData.blocks.length > 1;

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm ring-1 ring-emerald-100 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
          <Database className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Актуальные пороги из коридора Emigro</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {multi
              ? "Сводка по странам, которые разбираются в этом гайде — сверяйте с официальными источниками перед подачей."
              : "Пороги и статус паспорта из базы Emigro — не замена консульской проверки."}
          </p>
        </div>
      </div>
      <div className={`mt-5 space-y-8 ${multi ? "divide-y divide-emerald-100" : ""}`}>
        {liveData.blocks.map((block) => (
          <div key={block.meta.wizardHref} className={multi ? "pt-8 first:pt-0" : undefined}>
            <LiveProgramsTable block={block} passportLabel={liveData.passportLabel} />
          </div>
        ))}
      </div>
    </section>
  );
}
