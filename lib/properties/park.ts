/**
 * Parque da Cidade do Porto — outline from OpenStreetMap (way 559610396, via Nominatim,
 * simplified to ~60 points). © OpenStreetMap contributors, ODbL.
 * [lng, lat] pairs, closed ring.
 */
export const PARQUE_DA_CIDADE_RING: [number, number][] = [
  [-8.688121, 41.172865], [-8.687433, 41.171795], [-8.687022, 41.170845], [-8.686949, 41.170587],
  [-8.687067, 41.170319], [-8.687214, 41.169843], [-8.687318, 41.169634], [-8.687675, 41.16954],
  [-8.687683, 41.16915], [-8.687613, 41.168952], [-8.687158, 41.168916], [-8.686359, 41.169057],
  [-8.685639, 41.168804], [-8.685086, 41.168394], [-8.684666, 41.168297], [-8.684233, 41.168026],
  [-8.683991, 41.167976], [-8.682214, 41.167592], [-8.681741, 41.167516], [-8.681263, 41.167594],
  [-8.681148, 41.167998], [-8.680516, 41.167446], [-8.680151, 41.167042], [-8.679601, 41.166767],
  [-8.67958, 41.166512], [-8.67226, 41.16529], [-8.672161, 41.165748], [-8.672227, 41.166915],
  [-8.671756, 41.167613], [-8.671458, 41.16793], [-8.671412, 41.168135], [-8.671559, 41.168598],
  [-8.671921, 41.16943], [-8.671937, 41.169767], [-8.671778, 41.170056], [-8.671394, 41.170332],
  [-8.672039, 41.170591], [-8.67281, 41.170287], [-8.674005, 41.169963], [-8.67397, 41.17127],
  [-8.674336, 41.171968], [-8.675027, 41.171559], [-8.675306, 41.171914], [-8.675785, 41.171781],
  [-8.678643, 41.171361], [-8.679165, 41.170975], [-8.679406, 41.170918], [-8.680022, 41.171121],
  [-8.680163, 41.171536], [-8.680637, 41.171859], [-8.680576, 41.171447], [-8.681937, 41.171056],
  [-8.68273, 41.170875], [-8.683277, 41.171815], [-8.681669, 41.172095], [-8.681566, 41.172299],
  [-8.682764, 41.172865], [-8.683623, 41.173349], [-8.684207, 41.173471], [-8.685921, 41.173383],
  [-8.687433, 41.173295], [-8.687818, 41.173218], [-8.688121, 41.172865],
];

export const PARK_CENTER: [number, number] = [41.1693, -8.6795];

const R = 6371000;
const COS = Math.cos((41.169 * Math.PI) / 180);
const xy = (lng: number, lat: number): [number, number] => [
  ((lng * Math.PI) / 180) * R * COS,
  ((lat * Math.PI) / 180) * R,
];
const RING_XY = PARQUE_DA_CIDADE_RING.map(([lng, lat]) => xy(lng, lat));

function insideRing(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = RING_XY.length - 1; i < RING_XY.length; j = i++) {
    const [xi, yi] = RING_XY[i]!;
    const [xj, yj] = RING_XY[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Straight-line metres from a point to the park edge (0 inside). */
export function metresToPark(lat: number, lng: number): number {
  const [x, y] = xy(lng, lat);
  if (insideRing(x, y)) return 0;
  let best = Infinity;
  for (let i = 0; i < RING_XY.length - 1; i++) {
    const [ax, ay] = RING_XY[i]!;
    const [bx, by] = RING_XY[i + 1]!;
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return Math.round(best);
}

/** Closest point on the park edge as [lng, lat] — used to draw the «до парка» line. */
export function nearestParkPoint(lat: number, lng: number): [number, number] {
  const [x, y] = xy(lng, lat);
  let best = Infinity;
  let point: [number, number] = PARQUE_DA_CIDADE_RING[0]!;
  for (let i = 0; i < RING_XY.length - 1; i++) {
    const [ax, ay] = RING_XY[i]!;
    const [bx, by] = RING_XY[i + 1]!;
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    const d = Math.hypot(x - ax - t * dx, y - ay - t * dy);
    if (d < best) {
      best = d;
      const [alng, alat] = PARQUE_DA_CIDADE_RING[i]!;
      const [blng, blat] = PARQUE_DA_CIDADE_RING[i + 1]!;
      point = [alng + t * (blng - alng), alat + t * (blat - alat)];
    }
  }
  return point;
}

/**
 * Walking minutes from straight-line metres. Streets add ~35% over a straight line here
 * (Boavista crossings, park gates), walking pace 80 m/min. Shown as «≈», never exact.
 */
export function walkMinutes(metres: number): number {
  return Math.max(1, Math.round((metres * 1.35) / 80));
}

export type ParkBand = "adjacent" | "five" | "ten";

export function parkBand(metres: number): ParkBand {
  if (metres <= 160) return "adjacent";
  if (metres <= 300) return "five";
  return "ten";
}

export const PARK_BAND_LABEL: Record<ParkBand, string> = {
  adjacent: "Вплотную к парку",
  five: "До 5 минут",
  ten: "5–10 минут",
};

/** Pin and badge colour per band (map, plates, chips). */
export const BAND_COLOR: Record<ParkBand, string> = {
  adjacent: "#047857",
  five: "#0e7490",
  ten: "#b45309",
};
