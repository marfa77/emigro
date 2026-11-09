/**
 * Day events around Valencia for @valencia_echat.
 * Peace of Mind (dated trips from Valencia) and the Pego i les Valls autumn programme.
 */
import type { OutdoorEvent, OutdoorTicket } from "@/lib/news/outdoor/types";
import { fetchText, mapsUrlFor, og, priceLabelFromTickets, stripTags } from "@/lib/news/outdoor/util";

const MONTHS: Record<string, number> = {
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
  enero: 1,
};

/** Trips that leave the Valencia chat's map: other regions and other countries. */
const FAR =
  /\b(toledo|irati|navarra|vietnam|jap[oó]n|costa\s*rica|b[eé]lgica|tailandia|china|c[aá]ceres|lleida|l[eé]rida|cuenca|alsacia|madrid|barcelona|pirineos?|canarias|mallorca|andaluc|sevilla|galicia|asturias|euskadi|teruel|par[ií]s)\b/i;

type Built = Omit<OutdoorEvent, "mapsUrl" | "priceLabel"> & { priceLabel?: string | null };

function madridIso(year: number, month: number, day: number, hour: number, minute: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(utcGuess)).map((p) => [p.type, p.value]));
  const asWall = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute)
  );
  const iso = new Date(utcGuess - (asWall - utcGuess)).toISOString();
  return Number.isFinite(Date.parse(iso)) ? iso : null;
}

function plain(text: string): string {
  return text
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function build(partial: Built): OutdoorEvent | null {
  const startMs = Date.parse(partial.startIso);
  if (!Number.isFinite(startMs) || startMs < Date.now() - 30 * 60 * 1000) return null;
  if (partial.endIso) {
    const endMs = Date.parse(partial.endIso);
    if (Number.isFinite(endMs) && endMs - startMs > 30 * 60 * 60 * 1000) return null;
  }
  const blob = `${partial.title}\n${partial.location}`;
  if (FAR.test(blob)) return null;
  const paid = partial.tickets.map((t) => t.price).filter((n) => n > 0);
  if (paid.some((n) => n > 80)) return null;
  return {
    ...partial,
    priceLabel: priceLabelFromTickets(partial.tickets) || partial.priceLabel || null,
    mapsUrl: mapsUrlFor({
      lat: partial.lat,
      lng: partial.lng,
      address: partial.address,
      location: partial.location || "Valencia",
    }),
  };
}

function feeFrom(text: string): OutdoorTicket[] {
  const aport = text.match(/aportaci[oó]n\s*(\d+(?:[.,]\d{1,2})?)\s*€/i);
  if (aport) return [{ name: "взнос", price: Number(aport[1]!.replace(",", ".")) }];
  const nums = [...text.matchAll(/(\d+(?:[.,]\d{1,2})?)\s*€/g)]
    .map((m) => Number(m[1]!.replace(",", ".")))
    .filter((n) => n >= 2 && n <= 80);
  if (nums.length === 0) return [];
  return [{ name: "Adulto", price: Math.min(...nums) }];
}

type LdEvent = {
  "@type"?: string | string[];
  name?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  image?: string | { url?: string };
  description?: string;
  location?: { name?: string; address?: string };
  organizer?: { name?: string };
};

function asEvents(node: unknown): LdEvent[] {
  if (!node || typeof node !== "object") return [];
  const record = node as { "@graph"?: unknown; "@type"?: string | string[] };
  if (Array.isArray(record["@graph"])) return record["@graph"].flatMap(asEvents);
  const kind = Array.isArray(record["@type"]) ? record["@type"].join(" ") : String(record["@type"] || "");
  return /Event/i.test(kind) ? [node as LdEvent] : [];
}

function imageOf(image: LdEvent["image"]): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || null;
}

export async function fetchPeaceOfMindEvents(): Promise<OutdoorEvent[]> {
  const html = await fetchText("https://peaceofmindvalencia.es/calendario/");
  if (!html) return [];
  const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const out: OutdoorEvent[] = [];
  const seen = new Set<string>();
  for (const block of blocks) {
    let data: unknown;
    try {
      data = JSON.parse(block[1]!);
    } catch {
      continue;
    }
    const nodes = Array.isArray(data) ? data.flatMap(asEvents) : asEvents(data);
    for (const item of nodes) {
      const title = plain(item.name || "");
      const startRaw = item.startDate || "";
      if (!title || !startRaw) continue;
      const startIso = startRaw.length <= 10 ? `${startRaw}T00:00:00.000Z` : startRaw;
      const endRaw = item.endDate || "";
      const endIso = endRaw ? (endRaw.length <= 10 ? `${endRaw}T00:00:00.000Z` : endRaw) : null;
      const full = plain(item.description || "");
      const about = full.slice(0, 900);
      const place = plain(item.location?.name || "Valencia");
      const url = item.url || "https://peaceofmindvalencia.es/calendario/";
      const key = `pom:${url}:${startIso.slice(0, 10)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const includes = about.match(/inclu(?:ye|ido|ye el)[^.]{8,140}/i)?.[0] || null;
      const ev = build({
        key,
        sourceId: "peaceofmind",
        organizer: plain(item.organizer?.name || "") || "Peace of Mind Valencia",
        title,
        description: about,
        aboutPt: about,
        includesPt: includes,
        startIso,
        endIso,
        location: place,
        address: plain(item.location?.address || "") || place,
        lat: null,
        lng: null,
        tickets: feeFrom(full),
        url,
        imageUrl: imageOf(item.image),
      });
      if (ev) out.push(ev);
    }
  }
  return out;
}

const PEGO_URL = "https://comarcalcv.com/pego/rutas-otono-senderismo-visitas/";

function pegoEvent(params: {
  title: string;
  place: string;
  month: number;
  day: number;
  hour: number;
  minute: number;
  about: string;
  tickets: OutdoorTicket[];
  priceLabel?: string | null;
  image: string | null;
}): OutdoorEvent | null {
  const title = params.title
    .replace(/^(?:y\s+)+el\s+/i, "")
    .replace(/^la\s+ruta\s+hist\S*\s+(?:de\s+)?(?:la\s+)?/i, "")
    .trim();
  if (title.length < 6 || title.length > 80 || /programa|diciembre|actividades|jornadas/i.test(title)) return null;
  const startIso = madridIso(2026, params.month, params.day, params.hour, params.minute);
  if (!startIso) return null;
  return build({
    key: `pego:${params.month}-${params.day}:${title.slice(0, 40)}`,
    sourceId: "pego",
    organizer: "Pego i les Valls",
    title,
    description: params.about,
    aboutPt: params.about,
    includesPt: /seguro/i.test(params.about) ? "seguro" : null,
    startIso,
    endIso: null,
    location: params.place,
    address: `${params.place}, Comunitat Valenciana`,
    lat: null,
    lng: null,
    tickets: params.tickets,
    priceLabel: params.priceLabel,
    url: PEGO_URL,
    imageUrl: params.image,
  });
}

export async function fetchPegoEvents(): Promise<OutdoorEvent[]> {
  const html = await fetchText(PEGO_URL);
  if (!html) return [];
  const text = stripTags(html);
  const image = og(html, "og:image");
  const out: OutdoorEvent[] = [];
  const push = (ev: OutdoorEvent | null) => {
    if (ev) out.push(ev);
  };

  for (const m of text.matchAll(
    /(\d{1,2}) de (octubre|noviembre|diciembre)(?:\s+toca)?\s+([^,.]{3,70}),\s+en\s+([^.(]{3,40})/gi
  )) {
    const month = MONTHS[m[2]!.toLowerCase()];
    if (!month) continue;
    push(
      pegoEvent({
        title: m[3]!.trim(),
        place: m[4]!.trim(),
        month,
        day: Number(m[1]),
        hour: 9,
        minute: 30,
        about: m[0]!,
        tickets: [],
        priceLabel: "бесплатно",
        image,
      })
    );
  }

  const nov = text.match(/En noviembre hay tres citas:\s*([^.]{0,450})/i)?.[1] || "";
  for (const m of nov.matchAll(/([^.;,]{6,80}),\s+en\s+([^,]+),\s+el (?:día )?(\d{1,2})/gi)) {
    const title = m[1]!.replace(/^(?:y\s+el\s+|el\s+|la\s+ruta\s+hist[oó]rica\s+(?:de\s+)?)/i, "").trim();
    push(
      pegoEvent({
        title,
        place: m[2]!.trim(),
        month: 11,
        day: Number(m[3]),
        hour: 9,
        minute: 30,
        about: m[0]!,
        tickets: [],
        priceLabel: "бесплатно",
        image,
      })
    );
  }

  for (const m of text.matchAll(/el (\d{1,2}) de (octubre|noviembre|diciembre) en ([^,.;]+?)(?=\s+y\s+el|,|\.|$)/gi)) {
    const month = MONTHS[m[2]!.toLowerCase()];
    if (!month) continue;
    const place = m[3]!.trim();
    push(
      pegoEvent({
        title: `Visita urbana en ${place}`,
        place,
        month,
        day: Number(m[1]),
        hour: 11,
        minute: 0,
        about: "Visita urbana con guía y degustación de producto local.",
        tickets: [{ name: "Adulto", price: 5 }],
        image,
      })
    );
  }

  for (const m of text.matchAll(/(?:domingo|s[aá]bado)\s+(\d{1,2}) de (octubre|noviembre|diciembre)/gi)) {
    const month = MONTHS[m[2]!.toLowerCase()];
    if (!month) continue;
    push(
      pegoEvent({
        title: "Cova de Canelobres",
        place: "l'Atzúbia",
        month,
        day: Number(m[1]),
        hour: 10,
        minute: 30,
        about: "Jornada en la Cova de Canelobres, Tossal del Llop.",
        tickets: [{ name: "Adulto", price: 2 }],
        image,
      })
    );
  }

  const seen = new Set<string>();
  return out.filter((ev) => (seen.has(ev.key) ? false : (seen.add(ev.key), true)));
}

export const VALENCIA_OUTDOOR_SOURCES: { id: string; label: string; fetch: () => Promise<OutdoorEvent[]> }[] = [
  { id: "peaceofmind", label: "Peace of Mind Valencia", fetch: fetchPeaceOfMindEvents },
  { id: "pego", label: "Pego i les Valls", fetch: fetchPegoEvents },
];
