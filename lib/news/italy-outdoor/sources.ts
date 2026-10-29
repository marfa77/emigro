/**
 * Northern Italy outdoor calendars for @milan_echat.
 * Guiddy (regional listings), Trekking Lecco, Lanzo Trekking,
 * OssolaTrek, Piccole Dolomiti Sport.
 */
import type { OutdoorEvent, OutdoorTicket } from "@/lib/news/outdoor/types";
import {
  fetchJson,
  fetchText,
  mapsUrlFor,
  og,
  priceLabelFromTickets,
  stripTags,
} from "@/lib/news/outdoor/util";

const GUIDDY_REGIONS = [
  "lombardia",
  "piemonte",
  "trentino-alto-adige",
  "veneto",
  "valle-d-aosta",
  "liguria",
  "emilia-romagna",
];

const MONTHS: Record<string, number> = {
  gennaio: 1,
  febbraio: 2,
  marzo: 3,
  aprile: 4,
  maggio: 5,
  giugno: 6,
  luglio: 7,
  agosto: 8,
  settembre: 9,
  ottobre: 10,
  novembre: 11,
  dicembre: 12,
};

/** Centre, south, islands, and trips that leave Italy. */
const OUTSIDE =
  /\b(sicilia|sardegna|calabria|puglia|campania|napoli|lazio|toscana|firenze|umbria|marche|abruzzo|molise|basilicata|svizzera|suisse|switzerland|france|francia|austria|slovenia|spagna|portogallo)\b|\(\s*ch\s*\)/i;

type Built = Omit<OutdoorEvent, "mapsUrl" | "priceLabel"> & { priceLabel?: string | null };

function inNorth(blob: string): boolean {
  return !OUTSIDE.test(blob);
}

function italyPoint(lat: number | null, lng: number | null): { lat: number | null; lng: number | null } {
  if (lat == null || lng == null) return { lat: null, lng: null };
  if (lat >= 43.4 && lat <= 47.2 && lng >= 6.5 && lng <= 13.9) return { lat, lng };
  return { lat: null, lng: null };
}

function build(partial: Built): OutdoorEvent | null {
  const point = italyPoint(partial.lat, partial.lng);
  const ev: OutdoorEvent = {
    ...partial,
    lat: point.lat,
    lng: point.lng,
    priceLabel: priceLabelFromTickets(partial.tickets) || partial.priceLabel || null,
    mapsUrl: mapsUrlFor({
      lat: point.lat,
      lng: point.lng,
      address: partial.address,
      location: partial.location || "Italia del Nord",
    }),
  };
  const startMs = Date.parse(ev.startIso);
  if (!Number.isFinite(startMs) || startMs < Date.now() - 30 * 60 * 1000) return null;
  const blob = `${ev.title}\n${ev.location}\n${ev.address || ""}\n${ev.description}`;
  if (!inNorth(blob)) return null;
  const paid = partial.tickets.map((t) => t.price).filter((n) => n > 0);
  if (paid.some((n) => n > 120)) return null;
  return ev;
}

/** Wall time in Europe/Rome → UTC ISO. */
export function romeIso(year: number, month: number, day: number, hour: number, minute: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null;
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
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

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/[\u200b\u200c\u200d\ufeff]/g, "");
}

function clean(text: string): string {
  return decodeEntities(text).replace(/\s+/g, " ").trim();
}

function parseItalianDate(text: string): { year: number; month: number; day: number } | null {
  const m = text.match(
    /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+(20\d{2}))?/i
  );
  if (!m) return null;
  const month = MONTHS[m[2]!.toLowerCase()];
  if (!month) return null;
  return { day: Number(m[1]), month, year: m[3] ? Number(m[3]) : new Date().getFullYear() };
}

type GuiddyDate = { at?: string; closed?: boolean; soldOut?: boolean };
type GuiddyItem = {
  id?: string;
  title?: string;
  slug?: { it?: string } | string;
  price?: number | string;
  difficulty?: { label?: string };
  place?: string;
  province?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  coverUrl?: string;
  coords?: number[];
  days?: number;
  dates?: GuiddyDate[];
  card?: {
    ageRange?: string;
    length?: number;
    difference_in_altitude?: { climb?: number };
    difficulty?: { title?: { it?: string } };
  };
};

function slugOf(slug: GuiddyItem["slug"]): string {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.it || "";
}

function guiddyEvents(items: GuiddyItem[]): OutdoorEvent[] {
  const out: OutdoorEvent[] = [];
  for (const item of items) {
    const id = item.id || "";
    const slug = slugOf(item.slug);
    const title = (item.title || "").trim();
    if (!id || !slug || !title) continue;
    if ((item.days || 1) > 1) continue;
    if (item.countryCode && item.countryCode !== "IT") continue;
    const region = item.region || "";
    if (region && !/lombardia|piemonte|veneto|liguria|trentino|aosta|emilia/i.test(region)) continue;
    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 5 || price > 120) continue;
    const coords = item.coords || [];
    const lng = typeof coords[0] === "number" ? coords[0] : null;
    const lat = typeof coords[1] === "number" ? coords[1] : null;
    const place = [item.place, item.province, region].filter(Boolean).join(", ");
    const climb = item.card?.difference_in_altitude?.climb;
    const length = item.card?.length;
    const level = item.card?.difficulty?.title?.it || item.difficulty?.label || "";
    const about = [
      level ? `Livello: ${level}` : "",
      length ? `${length} km` : "",
      climb ? `dislivello ${climb} m` : "",
      item.card?.ageRange ? `età ${item.card.ageRange}` : "",
    ]
      .filter(Boolean)
      .join(". ");
    for (const date of item.dates || []) {
      const at = date.at || "";
      if (!at || date.closed || date.soldOut) continue;
      const day = at.slice(0, 10);
      const ev = build({
        key: `guiddy:${id}:${day}`,
        sourceId: "guiddy",
        organizer: "Guiddy",
        title,
        description: about,
        aboutPt: about || null,
        includesPt: null,
        startIso: at,
        endIso: null,
        location: place || region || "Nord Italia",
        address: place || null,
        lat,
        lng,
        tickets: [{ name: "Adulto", price }],
        url: `https://www.guiddy.it/itinerari/${slug}?date=${day}`,
        imageUrl: item.coverUrl || null,
      });
      if (ev) out.push(ev);
    }
  }
  return out;
}

export async function fetchGuiddyEvents(): Promise<OutdoorEvent[]> {
  const pages = await Promise.all(
    GUIDDY_REGIONS.map(async (region) => {
      const html = await fetchText(`https://www.guiddy.it/escursioni/${region}`);
      if (!html) return [] as GuiddyItem[];
      const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
      if (!m) return [];
      try {
        const data = JSON.parse(m[1]!) as {
          props?: { pageProps?: { showcase?: { results?: GuiddyItem[] } } };
        };
        return data.props?.pageProps?.showcase?.results || [];
      } catch {
        return [];
      }
    })
  );
  const seen = new Set<string>();
  const events: OutdoorEvent[] = [];
  for (const ev of guiddyEvents(pages.flat())) {
    if (seen.has(ev.key)) continue;
    seen.add(ev.key);
    events.push(ev);
  }
  return events;
}

type WcProduct = {
  id?: number;
  name?: string;
  permalink?: string;
  short_description?: string;
  description?: string;
  prices?: { price?: string; currency_minor_unit?: number };
  images?: { src?: string }[];
  categories?: { slug?: string; name?: string }[];
};

function leccoPrice(product: WcProduct): number | null {
  const raw = product.prices?.price;
  if (!raw) return null;
  const minor = product.prices?.currency_minor_unit ?? 2;
  const n = Number(raw) / 10 ** minor;
  if (!Number.isFinite(n) || n < 5 || n > 120) return null;
  return Math.round(n * 100) / 100;
}

export async function fetchTrekkingLeccoEvents(): Promise<OutdoorEvent[]> {
  const products = await fetchJson<WcProduct[]>(
    "https://www.trekkinglecco.com/wp-json/wc/store/v1/products?per_page=40"
  );
  if (!products) return [];
  const out: OutdoorEvent[] = [];
  for (const product of products) {
    const name = (product.name || "").trim();
    const cats = (product.categories || []).map((c) => `${c.slug || ""} ${c.name || ""}`).join(" ");
    if (!name || /gift|buono|regalo/i.test(`${name} ${cats}`)) continue;
    const text = stripTags(`${product.short_description || ""} ${product.description || ""}`);
    const dated = parseItalianDate(text);
    if (!dated) continue;
    const clock = text.match(/ore\s+(\d{1,2})[:.](\d{2})/i);
    const hour = clock ? Number(clock[1]) : 9;
    const minute = clock ? Number(clock[2]) : 0;
    const startIso = romeIso(dated.year, dated.month, dated.day, hour, minute);
    if (!startIso) continue;
    const price = leccoPrice(product);
    const place =
      text.match(
        /([A-ZÀ-Ý][\p{L}'’.\- ]{2,40})\s*\((?:LC|BG|SO|CO|VB|VA|MI|NO|BI|TO|TN|BZ|BL|VR|VI|GE|CN)\)/u
      )?.[1]?.trim() ||
      text.match(/ore\s+\d{1,2}[:.]\d{2}\s+a\s+([^|.]{3,40})/i)?.[1]?.trim() ||
      "Lecco";
    const level = text.match(/difficolt[àa]\s*:\s*([^|.]{3,40})/i)?.[1]?.trim() || "";
    const includes = text.match(/(?:include|comprende|incluso)[:\s]+([^.]{8,160})/i)?.[1]?.trim() || null;
    const ev = build({
      key: `lecco:${product.id || name}:${dated.year}-${dated.month}-${dated.day}`,
      sourceId: "lecco",
      organizer: "Trekking Lecco",
        title: clean(name).replace(/\s*\|\s*\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+20\d{2}\s*$/i, "").trim(),
      description: [level, text.slice(0, 700)].filter(Boolean).join(". "),
      aboutPt: text.slice(0, 700),
      includesPt: includes,
      startIso,
      endIso: null,
      location: place,
      address: place,
      lat: null,
      lng: null,
      tickets: price != null ? [{ name: "Adulto", price }] : [],
      priceLabel: price != null ? null : null,
      url: product.permalink || "https://www.trekkinglecco.com/escursioni/",
      imageUrl: product.images?.[0]?.src || null,
    });
    if (ev) out.push(ev);
  }
  return out;
}

type LanzoItem = {
  id?: string;
  title?: string;
  fullUrl?: string;
  assetUrl?: string;
  body?: string;
  excerpt?: string;
  location?: {
    mapLat?: number;
    mapLng?: number;
    addressLine2?: string;
    addressCountry?: string;
  };
  structuredContent?: { startDate?: number; endDate?: number };
};

type LanzoPage = {
  upcoming?: LanzoItem[];
  past?: LanzoItem[];
  pagination?: { nextPage?: boolean; nextPageUrl?: string };
};

function lanzoTickets(text: string): OutdoorTicket[] {
  const m = text.match(/prezzo:\s*(\d+)\s*€(?:\s*\((\d+)\s*€\s*per)?/i);
  if (!m) return [];
  const tickets: OutdoorTicket[] = [{ name: "Adulto", price: Number(m[1]) }];
  if (m[2]) tickets.push({ name: "до 16 лет", price: Number(m[2]) });
  return tickets;
}

export async function fetchLanzoEvents(): Promise<OutdoorEvent[]> {
  const out: OutdoorEvent[] = [];
  const seen = new Set<string>();
  let url: string | null = "https://www.lanzotrekking.it/calendario?format=json";
  for (let page = 0; page < 6 && url; page++) {
    const data: LanzoPage | null = await fetchJson<LanzoPage>(url);
    if (!data) break;
    for (const item of [...(data.upcoming || []), ...(data.past || [])]) {
      const id = item.id || item.fullUrl || "";
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const startMs = item.structuredContent?.startDate;
      if (!startMs) continue;
      const startIso = new Date(startMs).toISOString();
      const endMs = item.structuredContent?.endDate;
      const durationH = endMs ? (endMs - startMs) / 3_600_000 : 0;
      const text = stripTags(`${item.excerpt || ""} ${item.body || ""}`);
      const tickets = lanzoTickets(text);
      const address = item.location?.addressLine2 || null;
      const ev = build({
        key: `lanzo:${id}`,
        sourceId: "lanzo",
        organizer: "Lanzo Trekking",
        title: (item.title || "").trim(),
        description: text.slice(0, 800),
        aboutPt: text.slice(0, 800),
        includesPt: null,
        startIso,
        endIso: durationH >= 3 && endMs ? new Date(endMs).toISOString() : null,
        location: address || "Piemonte",
        address,
        lat: item.location?.mapLat ?? null,
        lng: item.location?.mapLng ?? null,
        tickets,
        url: item.fullUrl?.startsWith("http")
          ? item.fullUrl
          : `https://www.lanzotrekking.it${item.fullUrl || "/calendario"}`,
        imageUrl: item.assetUrl || null,
      });
      if (ev) out.push(ev);
    }
    const next: string = data.pagination?.nextPage ? data.pagination.nextPageUrl || "" : "";
    url = next
      ? `https://www.lanzotrekking.it${next}${next.includes("?") ? "&" : "?"}format=json`
      : null;
  }
  return out;
}

const WEEKDAY_DATE =
  /(luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|domenica)\s+(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+(20\d{2}))?/gi;

function textCalendar(params: {
  html: string;
  sourceId: string;
  organizer: string;
  pageUrl: string;
  defaultYear: number;
}): OutdoorEvent[] {
  const text = stripTags(params.html);
  const image = og(params.html, "og:image");
  const marks = [...text.matchAll(WEEKDAY_DATE)];
  const out: OutdoorEvent[] = [];
  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i]!;
    const month = MONTHS[mark[3]!.toLowerCase()];
    if (!month) continue;
    const year = mark[4] ? Number(mark[4]) : params.defaultYear;
    const day = Number(mark[2]);
    const startIso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000Z`;
    if (!Number.isFinite(Date.parse(startIso))) continue;
    const from = (mark.index || 0) + mark[0].length;
    const to = marks[i + 1]?.index ?? from + 220;
    const chunk = clean(text.slice(from, to));
    const title = clean(chunk.split(/zona\s*:|difficolt|per informazioni|la scala/i)[0] || "")
      .replace(/^[.\-–—:\s]+/, "")
      .slice(0, 90);
    if (title.length < 8) continue;
    const zona = clean(chunk.match(/zona\s*:\s*([^.]{3,48})/i)?.[1] || "");
    const hinted = chunk.match(/\b(?:a|al|alla|sul|sulla|nel|nella)\s+([A-ZÀ-Ý][\p{L}'’ ]{2,36})/u)?.[1];
    const location = zona || clean(hinted || "") || title;
    const ev = build({
      key: `${params.sourceId}:${year}-${month}-${day}:${title.slice(0, 40)}`,
      sourceId: params.sourceId,
      organizer: params.organizer,
      title,
      description: chunk.slice(0, 400),
      aboutPt: chunk.slice(0, 400),
      includesPt: null,
      startIso,
      endIso: null,
      location,
      address: zona || location,
      lat: null,
      lng: null,
      tickets: [],
      url: params.pageUrl,
      imageUrl: image,
    });
    if (ev) out.push(ev);
  }
  return out;
}

export async function fetchOssolaEvents(): Promise<OutdoorEvent[]> {
  const html = await fetchText("https://www.ossolatrek.com/calendario");
  if (!html) return [];
  return textCalendar({
    html,
    sourceId: "ossola",
    organizer: "OssolaTrek",
    pageUrl: "https://www.ossolatrek.com/calendario",
    defaultYear: 2026,
  });
}

export async function fetchPiccoleDolomitiEvents(): Promise<OutdoorEvent[]> {
  const html = await fetchText("https://www.piccoledolomitisport.com/calendario-attivita-2026/");
  if (!html) return [];
  return textCalendar({
    html,
    sourceId: "piccoledolomiti",
    organizer: "Piccole Dolomiti Sport",
    pageUrl: "https://www.piccoledolomitisport.com/calendario-attivita-2026/",
    defaultYear: 2026,
  });
}

export const ITALY_OUTDOOR_SOURCES: { id: string; label: string; fetch: () => Promise<OutdoorEvent[]> }[] = [
  { id: "guiddy", label: "Guiddy", fetch: fetchGuiddyEvents },
  { id: "lecco", label: "Trekking Lecco", fetch: fetchTrekkingLeccoEvents },
  { id: "lanzo", label: "Lanzo Trekking", fetch: fetchLanzoEvents },
  { id: "ossola", label: "OssolaTrek", fetch: fetchOssolaEvents },
  { id: "piccoledolomiti", label: "Piccole Dolomiti Sport", fetch: fetchPiccoleDolomitiEvents },
];
