"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ParqueMap, type MapPoint } from "@/components/properties/ParqueMap";
import type { ProjectStatus, Side, Typology } from "@/lib/properties/types";

export type ExplorerProject = {
  slug: string;
  pin: number;
  name: string;
  tagline: string;
  href: string;
  side: Side;
  status: ProjectStatus;
  statusLabel: string;
  statusTone: string;
  sideLabel: string;
  lat: number | null;
  lng: number | null;
  walk: {
    park: number;
    ocean: number;
    metro: { name: string; min: number };
    metrobus: { name: string; min: number } | null;
    /** Minutes to the nearer of metro and metrobus. */
    transit: number;
  } | null;
  completion: string | null;
  typologies: Typology[];
  fromByTypology: Partial<Record<Typology, number>>;
  fromLabels: { typology: Typology; label: string }[];
  ppmLabel: string;
  onSale: number;
  unknownCount: number;
  conflictCount: number;
};

type WalkKey = "park" | "ocean" | "transit";
const WALK_FILTERS: { id: WalkKey; label: string; max: number }[] = [
  { id: "park", label: "парк ≤ 5 мин", max: 5 },
  { id: "ocean", label: "океан ≤ 10 мин", max: 10 },
  { id: "transit", label: "метро ≤ 15 мин", max: 15 },
];
type SortKey = "price" | WalkKey;
const TYPE_FILTERS: { id: string; label: string; match: Typology[] }[] = [
  { id: "any", label: "Любой", match: [] },
  { id: "t01", label: "T0–T1", match: ["T0", "T1"] },
  { id: "t2", label: "T2", match: ["T2"] },
  { id: "t3", label: "T3", match: ["T3"] },
  { id: "t4", label: "T4+", match: ["T4", "T5"] },
];
const BUDGETS: { id: string; label: string; max: number | null }[] = [
  { id: "any", label: "Любой", max: null },
  { id: "600", label: "до 600 тыс.", max: 600_000 },
  { id: "900", label: "до 900 тыс.", max: 900_000 },
  { id: "1200", label: "до 1,2 млн", max: 1_200_000 },
  { id: "2000", label: "до 2 млн", max: 2_000_000 },
];

function Walk({ label, min, note, extra }: { label: string; min: number | null; note?: string; extra?: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{min != null ? `≈ ${min} мин` : "—"}</dd>
      {note ? <dd className="truncate text-xs text-slate-500">{note}</dd> : null}
      {extra ? <dd className="truncate text-xs text-slate-500">{extra}</dd> : null}
    </div>
  );
}

function Chip({ on, onClick, children, dot }: { on: boolean; onClick: () => void; children: ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-sm transition ${
        on ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-400"
      }`}
    >
      {dot ? <span className="h-2 w-2 rounded-full" style={{ background: dot }} aria-hidden /> : null}
      {children}
    </button>
  );
}

export function CatalogExplorer({
  projects,
  covers,
  compareHref,
}: {
  projects: ExplorerProject[];
  covers: Record<string, ReactNode>;
  compareHref: string;
}) {
  const [walk, setWalk] = useState<WalkKey[]>([]);
  const [type, setType] = useState("any");
  const [budget, setBudget] = useState("any");
  const [side, setSide] = useState<Side | "all">("all");
  const [sort, setSort] = useState<SortKey>("price");
  const [active, setActive] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  const visible = useMemo(() => {
    const t = TYPE_FILTERS.find((f) => f.id === type)!;
    const max = BUDGETS.find((b) => b.id === budget)!.max;
    const rows = projects.filter((p) => {
      if (side !== "all" && p.side !== side) return false;
      for (const key of walk) {
        const f = WALK_FILTERS.find((w) => w.id === key)!;
        if (!p.walk || p.walk[key] > f.max) return false;
      }
      const types = t.match.length ? t.match : p.typologies;
      if (t.match.length && !p.typologies.some((x) => t.match.includes(x))) return false;
      if (max != null) {
        const prices = types.map((x) => p.fromByTypology[x]).filter((v): v is number => v != null);
        if (!prices.length || Math.min(...prices) > max) return false;
      }
      return true;
    });
    if (sort === "price") {
      const key = (p: ExplorerProject) => {
        const v = Object.values(p.fromByTypology);
        return v.length ? Math.min(...(v as number[])) : Infinity;
      };
      rows.sort((a, b) => key(a) - key(b));
    } else {
      const key = (p: ExplorerProject) => (p.walk ? p.walk[sort] : Infinity);
      rows.sort((a, b) => key(a) - key(b));
    }
    return rows;
  }, [projects, walk, type, budget, side, sort]);

  const points: MapPoint[] = projects
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      slug: p.slug,
      pin: p.pin,
      name: p.name,
      lat: p.lat!,
      lng: p.lng!,
      href: p.href,
      caption: p.walk
        ? `пешком: парк ≈ ${p.walk.park} мин · океан ≈ ${p.walk.ocean} мин · метро ≈ ${p.walk.transit} мин`
        : "",
    }));

  const toggle = (slug: string) =>
    setPicked((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length >= 3 ? cur : [...cur, slug]));

  const reset = () => {
    setWalk([]);
    setType("any");
    setBudget("any");
    setSide("all");
  };

  return (
    <div>
      <div className="relative isolate overflow-hidden rounded-3xl ring-1 ring-slate-200">
        <ParqueMap
          points={points}
          active={active}
          onSelect={(slug) => {
            setActive(slug);
            document.getElementById(`p-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="h-[380px] sm:h-[460px]"
        />
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-wrap gap-3 rounded-2xl bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm backdrop-blur">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-900 ring-2 ring-white" /> проект
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-red-600 text-[9px] font-bold text-white">M</span> метро
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-violet-600 text-[7px] font-bold text-white">MB</span> метробус
          </span>
        </div>
      </div>

      <div className="-mx-4 mt-6 space-y-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:sticky sm:top-0 sm:z-[600]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">Пешком</span>
          {WALK_FILTERS.map((w) => (
            <Chip
              key={w.id}
              on={walk.includes(w.id)}
              onClick={() => setWalk((cur) => (cur.includes(w.id) ? cur.filter((x) => x !== w.id) : [...cur, w.id]))}
            >
              {w.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">Тип</span>
          {TYPE_FILTERS.map((f) => (
            <Chip key={f.id} on={type === f.id} onClick={() => setType(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">Бюджет</span>
          {BUDGETS.map((b) => (
            <Chip key={b.id} on={budget === b.id} onClick={() => setBudget(b.id)}>
              {b.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">Сторона</span>
          <Chip on={side === "all"} onClick={() => setSide("all")}>Обе</Chip>
          <Chip on={side === "porto"} onClick={() => setSide("porto")}>Порту</Chip>
          <Chip on={side === "matosinhos"} onClick={() => setSide("matosinhos")}>Матозиньюш</Chip>
          <span className="ml-auto inline-flex items-center gap-2 text-sm text-slate-600">
            <label htmlFor="parque-sort">Сортировка</label>
            <select
              id="parque-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="min-h-[36px] rounded-full border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="price">дешевле</option>
              <option value="park">ближе к парку</option>
              <option value="ocean">ближе к океану</option>
              <option value="transit">ближе к метро</option>
            </select>
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600" aria-live="polite">
        {visible.length === projects.length ? `Все ${projects.length} проектов` : `Подходит ${visible.length} из ${projects.length}`}
        {visible.length !== projects.length ? (
          <button type="button" onClick={reset} className="ml-2 text-teal-800 underline">
            сбросить
          </button>
        ) : null}
      </p>

      <ol className="mt-3 space-y-4">
        {visible.map((p) => (
          <li
            key={p.slug}
            id={`p-${p.slug}`}
            onMouseEnter={() => setActive(p.slug)}
            onMouseLeave={() => setActive((cur) => (cur === p.slug ? null : cur))}
            className={`group overflow-hidden rounded-3xl bg-white ring-1 transition ${
              active === p.slug ? "ring-2 ring-slate-900" : "ring-slate-200 hover:ring-slate-400"
            }`}
          >
            <div className="grid gap-0 sm:grid-cols-[300px_1fr]">
              <Link href={p.href} className="relative block h-52 sm:h-auto sm:min-h-[220px]" tabIndex={-1} aria-hidden>
                <div className="absolute inset-0">{covers[p.slug]}</div>
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow ring-2 ring-white">
                  {p.pin}
                </span>
              </Link>
              <div className="min-w-0 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-slate-900">
                      <Link href={p.href} className="hover:underline">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-600">{p.tagline}</p>
                  </div>
                  <label className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-full px-2 text-sm text-slate-600 ring-1 ring-slate-200">
                    <input
                      type="checkbox"
                      checked={picked.includes(p.slug)}
                      onChange={() => toggle(p.slug)}
                      disabled={!picked.includes(p.slug) && picked.length >= 3}
                      className="h-4 w-4 accent-slate-900"
                    />
                    сравнить
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ring-1 ${p.statusTone}`}>{p.statusLabel}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">{p.sideLabel}</span>
                  {p.conflictCount ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900 ring-1 ring-amber-200">
                      расхождений в источниках: {p.conflictCount}
                    </span>
                  ) : null}
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <Walk label="Парк" min={p.walk?.park ?? null} />
                  <Walk label="Океан" min={p.walk?.ocean ?? null} />
                  {p.walk?.metrobus ? (
                    <Walk label="Метробус" min={p.walk.metrobus.min} note={p.walk.metrobus.name} extra={`метро ≈ ${p.walk.metro.min} мин`} />
                  ) : (
                    <Walk label="Метро" min={p.walk?.metro.min ?? null} note={p.walk?.metro.name ?? "адрес не подтверждён"} />
                  )}
                </dl>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-500">В продаже от</dt>
                    <dd className="flex flex-wrap gap-x-3 text-slate-900">
                      {p.fromLabels.length
                        ? p.fromLabels.map((f) => (
                            <span key={f.typology} className="whitespace-nowrap">
                              <span className="text-slate-500">{f.typology}</span> {f.label}
                            </span>
                          ))
                        : "цен нет"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">€ за м²</dt>
                    <dd className="text-slate-900">{p.ppmLabel}</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-4">
                    <dt className="text-xs text-slate-500">Сдача</dt>
                    <dd className="text-slate-900">{p.completion || <span className="text-slate-500">не опубликована</span>}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          Под эти фильтры ничего нет. Чаще всего мешает бюджет или сочетание «океан + метро»: рядом с пляжем и станцией одновременно стоят только дома в Матозиньюш Сул.
        </p>
      ) : null}

      {picked.length ? (
        <div className="fixed inset-x-0 bottom-0 z-[700] border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(15,23,42,.08)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
            <span className="text-sm text-slate-700">
              Выбрано {picked.length} из 3:{" "}
              {picked.map((s) => projects.find((p) => p.slug === s)?.name).join(", ")}
            </span>
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={() => setPicked([])} className="min-h-[40px] rounded-full px-3 text-sm text-slate-600 ring-1 ring-slate-300">
                очистить
              </button>
              {picked.length >= 2 ? (
                <Link
                  href={`${compareHref}?p=${picked.join(",")}`}
                  className="inline-flex min-h-[40px] items-center rounded-full bg-slate-900 px-4 text-sm font-medium text-white"
                >
                  Сравнить
                </Link>
              ) : (
                <span className="inline-flex min-h-[40px] items-center px-2 text-sm text-slate-500">выберите ещё один</span>
              )}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
