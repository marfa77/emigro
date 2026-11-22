import { COAST_LINES, TRANSIT_STOPS, type TransitStop } from "@/lib/properties/geo-data";
import { metresToPark, walkMinutes } from "@/lib/properties/park";

const K = 111_320;
const COS = Math.cos((41.17 * Math.PI) / 180);
const xy = (lng: number, lat: number): [number, number] => [lng * K * COS, lat * K];

function segDist(x: number, y: number, a: [number, number], b: [number, number]): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}

const COAST_XY = COAST_LINES.map((line) => line.map(([lng, lat]) => xy(lng, lat)));

/** Straight-line metres to the nearest point of the coastline (beach or rocks). */
export function metresToOcean(lat: number, lng: number): number {
  const [x, y] = xy(lng, lat);
  let best = Infinity;
  for (const line of COAST_XY) {
    for (let i = 0; i < line.length - 1; i++) best = Math.min(best, segDist(x, y, line[i]!, line[i + 1]!));
  }
  return Math.round(best);
}

export type StopDistance = { name: string; kind: TransitStop["kind"]; m: number; min: number };

/** Nearest stop of a kind, straight-line metres and walking minutes. */
export function nearestStop(lat: number, lng: number, kind: TransitStop["kind"]): StopDistance {
  const [x, y] = xy(lng, lat);
  let best: StopDistance | null = null;
  for (const stop of TRANSIT_STOPS) {
    if (stop.kind !== kind) continue;
    const [sx, sy] = xy(stop.lng, stop.lat);
    const m = Math.round(Math.hypot(x - sx, y - sy));
    if (!best || m < best.m) best = { name: stop.name, kind, m, min: walkMinutes(m) };
  }
  return best!;
}

export type Distances = {
  park: { m: number; min: number };
  ocean: { m: number; min: number };
  metro: StopDistance;
  /** Only when the metrobus stop is closer than the nearest metro station. */
  metrobus: StopDistance | null;
};

export function distancesFrom(lat: number, lng: number): Distances {
  const parkM = metresToPark(lat, lng);
  const oceanM = metresToOcean(lat, lng);
  const metro = nearestStop(lat, lng, "metro");
  const bus = nearestStop(lat, lng, "metrobus");
  return {
    park: { m: parkM, min: walkMinutes(parkM) },
    ocean: { m: oceanM, min: walkMinutes(oceanM) },
    metro,
    metrobus: bus.m < metro.m ? bus : null,
  };
}

/** «≈ 6 мин», or «рядом» for under 2 minutes. */
export function minLabel(min: number): string {
  return min <= 1 ? "≈ 1 мин" : `≈ ${min} мин`;
}
