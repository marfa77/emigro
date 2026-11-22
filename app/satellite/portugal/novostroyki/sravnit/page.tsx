import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCover } from "@/components/properties/ProjectCover";
import { SIDE_LABEL, STATUS_LABEL, formatEur, listParqueProjects, type CatalogProject } from "@/lib/properties/catalog";
import { ppmLabel } from "@/lib/properties/explorer";
import type { Typology } from "@/lib/properties/types";
import { portugalNovostroykiPath } from "@/lib/satellite/paths";

export const metadata: Metadata = {
  title: "Сравнение новостроек у Parque da Cidade",
  robots: { index: false, follow: true },
};

type Row = { label: string; cell: (p: CatalogProject) => React.ReactNode; best?: (ps: CatalogProject[]) => string | null };

function cheapest(t: Typology[]) {
  return (p: CatalogProject) => {
    const v = t.map((x) => p.fromByTypology[x]).filter((n): n is number => n != null);
    return v.length ? Math.min(...v) : null;
  };
}

function bestBy(fn: (p: CatalogProject) => number | null) {
  return (ps: CatalogProject[]) => {
    const scored = ps.map((p) => [p.slug, fn(p)] as const).filter(([, v]) => v != null);
    if (scored.length < 2) return null;
    return scored.sort((a, b) => a[1]! - b[1]!)[0]![0];
  };
}

const muted = (s: string) => <span className="italic text-slate-400">{s}</span>;

const ROWS: Row[] = [
  {
    label: "До парка",
    cell: (p) => (p.dist ? `≈ ${p.dist.park.min} мин · ${p.dist.park.m} м` : muted("адрес не подтверждён")),
    best: bestBy((p) => p.dist?.park.m ?? null),
  },
  {
    label: "До океана",
    cell: (p) => (p.dist ? `≈ ${p.dist.ocean.min} мин · ${p.dist.ocean.m} м` : muted("адрес не подтверждён")),
    best: bestBy((p) => p.dist?.ocean.m ?? null),
  },
  {
    label: "До метро",
    cell: (p) => {
      if (!p.dist) return muted("адрес не подтверждён");
      const t = p.dist.metrobus ?? p.dist.metro;
      return `≈ ${t.min} мин · ${p.dist.metrobus ? "метробус " : ""}${t.name}`;
    },
    best: bestBy((p) => (p.dist ? (p.dist.metrobus ?? p.dist.metro).m : null)),
  },
  { label: "Сторона", cell: (p) => SIDE_LABEL[p.side] },
  { label: "Статус", cell: (p) => STATUS_LABEL[p.status] },
  { label: "Сдача", cell: (p) => p.completion ?? muted("не публикуется") },
  { label: "Застройщик", cell: (p) => p.developer ?? muted("не публикуется") },
  { label: "Архитектор", cell: (p) => p.architect ?? muted("не публикуется") },
  { label: "Юнитов", cell: (p) => p.units_total ?? muted("—") },
  ...(["T0–T1", "T2", "T3", "T4+"] as const).map((label) => {
    const t: Typology[] = label === "T0–T1" ? ["T0", "T1"] : label === "T4+" ? ["T4", "T5"] : [label as Typology];
    const fn = cheapest(t);
    return {
      label: `${label} от`,
      cell: (p: CatalogProject) => {
        const v = fn(p);
        return v != null ? formatEur(v) : muted(p.typologies.some((x) => t.includes(x)) ? "нет в продаже" : "—");
      },
      best: bestBy(fn),
    };
  }),
  { label: "€ за м²", cell: (p) => ppmLabel(p), best: bestBy((p) => p.ppmMin) },
  { label: "Энергокласс", cell: (p) => p.energy_class ?? muted("не публикуется") },
  { label: "Неизвестно", cell: (p) => (p.unknowns.length ? p.unknowns.join(", ") : "—") },
  { label: "Расхождения", cell: (p) => (p.conflicts.length ? `${p.conflicts.length}` : "нет") },
];

export default function ComparePage({ searchParams }: { searchParams?: { p?: string } }) {
  const all = listParqueProjects();
  const wanted = (searchParams?.p || "").split(",").map((s) => s.trim()).filter(Boolean);
  const picked = wanted.map((s) => all.find((p) => p.slug === s)).filter((p): p is CatalogProject => !!p).slice(0, 3);

  return (
    <main className="mx-auto min-w-0 max-w-5xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href={portugalNovostroykiPath()} className="hover:text-teal-800">
          Новостройки у Parque da Cidade
        </Link>{" "}
        / Сравнение
      </nav>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Сравнение</h1>
      {picked.length < 2 ? (
        <p className="mt-4 text-slate-700">
          Выберите 2–3 проекта в{" "}
          <Link href={portugalNovostroykiPath()} className="text-teal-800 underline">
            каталоге
          </Link>{" "}
          и нажмите «Сравнить».
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl ring-1 ring-slate-200">
          <table className="w-full min-w-[620px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-36" />
              {picked.map((p) => (
                <col key={p.slug} />
              ))}
            </colgroup>
            <thead>
              <tr className="align-top">
                <th className="p-3" />
                {picked.map((p) => (
                  <th key={p.slug} className="p-3 font-normal">
                    <Link href={portugalNovostroykiPath(p.slug)} className="block">
                      <ProjectCover project={p} sizes="300px" className="aspect-[4/3] w-full rounded-2xl ring-1 ring-slate-200" />
                      <span className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                          {p.pin}
                        </span>
                        {p.name}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROWS.map((row) => {
                const best = row.best?.(picked) ?? null;
                return (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="bg-slate-50 p-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {row.label}
                    </th>
                    {picked.map((p) => (
                      <td key={p.slug} className={`p-3 ${best === p.slug ? "bg-emerald-50 font-semibold text-emerald-900" : "text-slate-900"}`}>
                        {row.cell(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">Зелёным — лучшее значение в строке: ближе или дешевле.</p>
    </main>
  );
}
