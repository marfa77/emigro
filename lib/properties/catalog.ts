import { PARQUE_PROJECTS } from "@/lib/properties/parque-da-cidade";
import { distancesFrom, type Distances } from "@/lib/properties/distances";
import { metresToPark, parkBand, walkMinutes, type ParkBand } from "@/lib/properties/park";
import { PROJECT_PHOTOS, type ProjectPhoto } from "@/lib/properties/photos";
import type { ParqueProject, ProjectStatus, Typology } from "@/lib/properties/types";

export type CatalogProject = ParqueProject & {
  /** 1-based pin number, ordered by the cheapest listed price. */
  pin: number;
  photo: ProjectPhoto | null;
  /** Walking distances to the park, the ocean and rapid transit; null without a confirmed address. */
  dist: Distances | null;
  parkM: number | null;
  walkMin: number | null;
  band: ParkBand | null;
  priceFrom: number | null;
  /** Cheapest listed price per typology still on sale. */
  fromByTypology: Partial<Record<Typology, number>>;
  ppmMin: number | null;
  ppmMax: number | null;
  onSale: number;
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  selling: "Строится, продаётся",
  ready: "Дом сдан",
  embargo: "Стройка остановлена",
  sold_out: "Всё продано",
};

export const STATUS_TONE: Record<ProjectStatus, string> = {
  selling: "bg-sky-50 text-sky-900 ring-sky-200",
  ready: "bg-emerald-50 text-emerald-900 ring-emerald-200",
  embargo: "bg-rose-50 text-rose-900 ring-rose-200",
  sold_out: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const SIDE_LABEL = { porto: "Порту · Foz / Nevogilde", matosinhos: "Матозиньюш Сул" } as const;

/** Nearest of metro and metrobus — what «до метро» means in filters and sorting. */
export function transitOf(d: Distances): { name: string; min: number; m: number; kind: "metro" | "metrobus" } {
  return d.metrobus ?? d.metro;
}

function derive(project: ParqueProject): Omit<CatalogProject, "pin"> {
  const parkM = project.lat != null && project.lng != null ? metresToPark(project.lat, project.lng) : null;
  const live = project.units.filter((u) => u.status !== "sold" && u.price_eur != null);
  const fromByTypology: Partial<Record<Typology, number>> = {};
  for (const unit of live) {
    const current = fromByTypology[unit.typology];
    if (current == null || unit.price_eur! < current) fromByTypology[unit.typology] = unit.price_eur!;
  }
  const ppm = live.filter((u) => u.area_m2).map((u) => u.price_eur! / u.area_m2!);
  return {
    ...project,
    photo: PROJECT_PHOTOS[project.slug] ?? null,
    dist: project.lat != null && project.lng != null ? distancesFrom(project.lat, project.lng) : null,
    parkM,
    walkMin: parkM == null ? null : walkMinutes(parkM),
    band: parkM == null ? null : parkBand(parkM),
    priceFrom: live.length ? Math.min(...live.map((u) => u.price_eur!)) : null,
    fromByTypology,
    ppmMin: ppm.length ? Math.round(Math.min(...ppm)) : null,
    ppmMax: ppm.length ? Math.round(Math.max(...ppm)) : null,
    onSale: project.units.filter((u) => u.status === "available" || u.status === "assignment").length,
  };
}

/** Projects ordered by the cheapest listed price; projects without prices go last. */
export function listParqueProjects(): CatalogProject[] {
  return PARQUE_PROJECTS.map(derive)
    .sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity))
    .map((p, i) => ({ ...p, pin: i + 1 }));
}

export function getParqueProject(slug: string): CatalogProject | null {
  return listParqueProjects().find((p) => p.slug === slug) ?? null;
}

export function formatEur(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m.toLocaleString("ru-RU", { maximumFractionDigits: m >= 10 ? 1 : 2 })} млн €`;
  }
  return `${Math.round(value / 1000).toLocaleString("ru-RU")} тыс. €`;
}

export function formatEurExact(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toLocaleString("ru-RU")} €`;
}

export function formatM2(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} м²`;
}

export function catalogVerifiedDate(projects: CatalogProject[]): string {
  const dates = projects.map((p) => p.verified).sort();
  return dates[dates.length - 1] ?? "";
}

export function formatRuDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
