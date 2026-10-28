import type { OutdoorTicket } from "@/lib/news/outdoor/types";

export const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Soft skip: not Norte / not day-trip from Porto. */
export const OUT_OF_SCOPE_GEO =
  /\b(sintra|cascais|lisboa|lisbon|setúbal|setubal|algarve|faro|lagos|loulé|lóus[aã]|lousa|ourém|orem|óbidos|obidos|ordesa|pirineu|pirinéu|pyrenees|monte perdido|courel|manteigas|estrela|galiza|galicia|madrid|barcelona)\b/i;

/** Day-hike style prices only — skip elevation/noise matches. */
export function pickDayPrice(candidates: string[]): number | null {
  const nums = candidates
    .map((c) => parseEuro(c))
    .filter((n): n is number => n != null && n >= 5 && n <= 120);
  if (nums.length === 0) return null;
  return Math.min(...nums);
}

export async function fetchText(url: string, timeoutMs = 20_000): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,application/json,*/*" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson<T>(url: string, timeoutMs = 20_000): Promise<T | null> {
  const text = await fetchText(url, timeoutMs);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function downloadImage(url: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "image/*" },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 8_000 ? buf : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function mapsUrlFor(params: {
  lat: number | null;
  lng: number | null;
  address: string | null;
  location: string;
}): string {
  if (params.lat != null && params.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${params.lat},${params.lng}`;
  }
  const q = encodeURIComponent(params.address || params.location || "Portugal");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function euroLabel(n: number): string {
  return n % 1 === 0 ? `€${n}` : `€${n.toFixed(2)}`;
}

export function priceLabelFromTickets(tickets: OutdoorTicket[]): string | null {
  const paid = tickets.map((t) => t.price).filter((n) => n > 0);
  if (paid.length === 0) return null;
  const min = Math.min(...paid);
  const max = Math.max(...paid);
  return min === max ? euroLabel(min) : `${euroLabel(min)}–${euroLabel(max).replace("€", "")}`;
}

export function ticketTierRu(name: string, price: number): string {
  const n = name.trim();
  if (/^adulto$/i.test(n)) return price > 0 ? `${euroLabel(price)} взрослый` : "взрослый — бесплатно";
  if (/12\s*aos?\s*16/i.test(n)) {
    return price > 0 ? `${euroLabel(price)} подросток 12–16 лет` : "подросток 12–16 лет — бесплатно";
  }
  if (/6\s*aos?\s*11/i.test(n)) {
    return price > 0 ? `${euroLabel(price)} ребёнок 6–11 лет` : "ребёнок 6–11 лет — бесплатно";
  }
  if (/<\s*6|menor\s*de\s*6|até\s*5/i.test(n)) {
    return price > 0 ? `${euroLabel(price)} младше 6 лет` : "младше 6 лет — бесплатно";
  }
  if (/geral|standard|normal|pessoa|por pessoa|^ticket$/i.test(n) || !n) {
    return price > 0 ? euroLabel(price) : "бесплатно";
  }
  return price > 0 ? `${euroLabel(price)} (${n})` : `${n} — бесплатно`;
}

export function formatPriceLine(tickets: OutdoorTicket[]): string | null {
  if (tickets.length === 0) return null;
  const paid = tickets.filter((t) => t.price > 0).map((t) => ticketTierRu(t.name, t.price));
  const free = tickets.filter((t) => t.price === 0).map((t) => ticketTierRu(t.name, t.price));
  const parts = [...paid];
  if (free.length) parts.push(free.join("; "));
  return parts.join(", ") || null;
}

export function parsePtDateTime(raw: string): string | null {
  // 15/11/2026 @ 09:00  or 15/11/2026, 09:00  or 2026-11-15T09:00:00
  const iso = raw.match(/(20\d{2}-\d{2}-\d{2}T[\d:.+-]+Z?)/);
  if (iso) {
    const d = new Date(iso[1]!);
    return Number.isFinite(d.getTime()) ? d.toISOString() : null;
  }
  const m = raw.match(/(\d{2})\/(\d{2})\/(20\d{2})(?:\s*[@,]?\s*(\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const hour = m[4] != null ? Number(m[4]) : 9;
  const minute = m[5] != null ? Number(m[5]) : 0;
  // Lisbon wall time → ISO via explicit offset approximation (WET/WEST)
  const provisional = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return Number.isFinite(provisional.getTime()) ? provisional.toISOString() : null;
}

export function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

export function og(html: string, prop: string): string | null {
  const re1 = new RegExp(`property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i");
  return html.match(re1)?.[1]?.trim() || html.match(re2)?.[1]?.trim() || null;
}

export function parseEuro(text: string): number | null {
  const m = text.replace(/\s/g, "").match(/€?\s*(\d+)(?:[.,](\d{2}))?\s*€?/);
  if (!m) return null;
  const whole = Number(m[1]);
  const frac = m[2] ? Number(m[2]) / 100 : 0;
  const n = whole + frac;
  return Number.isFinite(n) ? n : null;
}

export function isInScope(ev: { title: string; location: string; address: string | null; url: string }): boolean {
  const blob = `${ev.title}\n${ev.location}\n${ev.address || ""}\n${ev.url}`;
  return !OUT_OF_SCOPE_GEO.test(blob);
}

export function upcoming(iso: string, graceMs = 6 * 60 * 60 * 1000): boolean {
  const t = Date.parse(iso);
  return Number.isFinite(t) && t >= Date.now() - graceMs;
}
