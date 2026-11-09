/**
 * Outdoor experience sources for @emigro_portugal.
 */
import { execFile } from "node:child_process";
import type { OutdoorEvent, OutdoorTicket } from "@/lib/news/outdoor/types";
import {
  euroLabel,
  fetchJson,
  fetchText,
  isInScope,
  cleanPlace,
  mapsUrlFor,
  og,
  parseEuro,
  parsePtDateTime,
  pickDayPrice,
  priceLabelFromTickets,
  stripTags,
  upcoming,
} from "@/lib/news/outdoor/util";

function base(
  partial: Omit<OutdoorEvent, "mapsUrl" | "priceLabel" | "tickets" | "lat" | "lng"> & {
    tickets?: OutdoorTicket[];
    lat?: number | null;
    lng?: number | null;
    priceLabel?: string | null;
  }
): OutdoorEvent | null {
  const tickets = partial.tickets || [];
  const lat = partial.lat ?? null;
  const lng = partial.lng ?? null;
  const { priceLabel: priceHint, tickets: _t, lat: _la, lng: _ln, ...rest } = partial;
  const ev: OutdoorEvent = {
    ...rest,
    lat,
    lng,
    tickets,
    priceLabel: priceLabelFromTickets(tickets) || priceHint || null,
    mapsUrl: mapsUrlFor({
      lat,
      lng,
      address: partial.address,
      location: partial.location,
    }),
  };
  if (!upcoming(ev.startIso)) return null;
  if (!isInScope(ev)) return null;
  return ev;
}

export async function parseGeo2goEventHtml(html: string, url: string): Promise<OutdoorEvent | null> {
  const ldBlocks = [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const m of ldBlocks) {
    try {
      const data = JSON.parse(m[1]!) as Record<string, unknown> | Record<string, unknown>[];
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        if (!/event/i.test(String((node as { "@type"?: string })["@type"] || ""))) continue;
        const title = String((node as { name?: string }).name || "").trim();
        const startIso = String((node as { startDate?: string }).startDate || "").trim();
        if (!title || !startIso) continue;
        const endIso = String((node as { endDate?: string }).endDate || "").trim() || null;
        const description = String((node as { description?: string }).description || "").trim();
        const loc = (node as { location?: { name?: string; address?: unknown } }).location;
        let location = "";
        let address: string | null = null;
        if (loc && typeof loc === "object") {
          location = String(loc.name || "").trim();
          if (typeof loc.address === "string") address = loc.address.trim();
        }
        const tickets: OutdoorTicket[] = [];
        const seen = new Set<string>();
        for (const tm of html.matchAll(
          /"name"\s*:\s*"([^"]+)"\s*,\s*"price"\s*:\s*\{[^}]*?"value"\s*:\s*"([\d.]+)"/g
        )) {
          const name = tm[1]!.trim();
          const price = Number(tm[2]);
          if (!name || !Number.isFinite(price)) continue;
          if (/cogumelos do bussaco|trilho|experienc/i.test(name) && !/adulto|anos|crian/i.test(name)) {
            continue;
          }
          const key = `${name}|${price}`;
          if (seen.has(key)) continue;
          seen.add(key);
          tickets.push({ name, price });
        }
        const inclui = html.match(/INCLUI:\s*([^<]{10,500})/i)?.[1]?.replace(/&gt;/g, ">").trim() || null;
        const about =
          stripTags(html.match(/data-hook="about-section"[^>]*>([\s\S]{0,4000}?)<\//i)?.[1] || "")
            .replace(/Sobre o evento/gi, "")
            .trim()
            .slice(0, 1200) || null;
        const lat = Number(html.match(/"latitude"\s*:\s*([-\d.]+)/)?.[1]);
        const lng = Number(html.match(/"longitude"\s*:\s*([-\d.]+)/)?.[1]);
        const imageField = (node as { image?: string | { url?: string } }).image;
        let imageUrl =
          typeof imageField === "string"
            ? imageField
            : imageField && typeof imageField === "object"
              ? imageField.url || null
              : null;
        imageUrl = imageUrl || og(html, "og:image");
        const slug = url.split("/").filter(Boolean).pop() || title;
        return base({
          key: `geo2go:${slug}`,
          sourceId: "geo2go",
          organizer: "Geo2Go",
          title,
          description,
          aboutPt: about,
          includesPt: inclui,
          startIso,
          endIso,
          location: location || address || "Portugal",
          address,
          lat: Number.isFinite(lat) ? lat : null,
          lng: Number.isFinite(lng) ? lng : null,
          tickets,
          url,
          imageUrl,
        });
      }
    } catch {
      /* next */
    }
  }
  return null;
}

/** Geo2Go Wix agenda (Bussaco / Caramulo). */
export async function fetchGeo2goEvents(): Promise<OutdoorEvent[]> {
  const agenda = await fetchText("https://www.geo2go.pt/agenda");
  if (!agenda) return [];
  const urls = [
    ...new Set(
      [...agenda.matchAll(/https:\/\/www\.geo2go\.pt\/event-details\/[a-z0-9\-]+/gi)].map((m) => m[0])
    ),
  ];
  const out: OutdoorEvent[] = [];
  for (const url of urls) {
    const html = await fetchText(url);
    if (!html) continue;
    const ev = await parseGeo2goEventHtml(html, url);
    if (ev) out.push(ev);
  }
  return out;
}

/** Trekkin public API — Melgaço / Gerês / Basto. */
export async function fetchTrekkinEvents(): Promise<OutdoorEvent[]> {
  const data = await fetchJson<{
    ok?: boolean;
    items?: Array<{
      id: string;
      name: string;
      description?: string;
      shortDescription?: string;
      longDescription?: string;
      imageUrl?: string;
      startAt?: string;
      location?: string;
      price?: number;
      published?: boolean;
      status?: string;
    }>;
  }>("https://trekkin-api-snowy-sunset-6669.fly.dev/api/public/events");
  if (!data?.items?.length) return [];
  const out: OutdoorEvent[] = [];
  for (const item of data.items) {
    if (item.published === false || (item.status && item.status !== "open")) continue;
    if (!item.startAt || !item.name) continue;
    let lat: number | null = null;
    let lng: number | null = null;
    const locMatch = String(item.location || "").match(/([-\d.]+)\s*,\s*([-\d.]+)/);
    if (locMatch) {
      lat = Number(locMatch[1]);
      lng = Number(locMatch[2]);
    }
    const price = Number(item.price);
    const tickets: OutdoorTicket[] =
      Number.isFinite(price) && price >= 0 ? [{ name: "pessoa", price }] : [];
    const url = `https://www.trekkin.pt/evento/${slugify(item.name)}/${item.id}/`;
    const ev = base({
      key: `trekkin:${item.id}`,
      sourceId: "trekkin",
      organizer: "Trekkin",
      title: item.name,
      description: item.shortDescription || item.description || "",
      aboutPt: item.longDescription || item.description || null,
      includesPt: null,
      startIso: new Date(item.startAt).toISOString(),
      endIso: null,
      location: lat != null ? `${lat.toFixed(4)}, ${lng!.toFixed(4)}` : "Norte de Portugal",
      address: null,
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      tickets,
      url,
      imageUrl: item.imageUrl || null,
    });
    if (ev) out.push(ev);
  }
  return out;
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Hike Land — Norte listing → event pages. */
export async function fetchHikeLandEvents(): Promise<OutdoorEvent[]> {
  const list = await fetchText("https://www.hikeland.pt/norte-centro-norte/");
  if (!list) return [];
  const urls = [
    ...new Set([...list.matchAll(/https:\/\/www\.hikeland\.pt\/eventos\/[a-z0-9\-]+\/?/gi)].map((m) => m[0])),
  ];
  const out: OutdoorEvent[] = [];
  for (const url of urls) {
    const html = await fetchText(url);
    if (!html) continue;
    const title = (og(html, "og:title") || "").replace(/\s*-\s*Hike Land.*$/i, "").trim();
    const desc = og(html, "og:description") || "";
    const imageUrl = og(html, "og:image");
    const startIso =
      parsePtDateTime(desc) ||
      parsePtDateTime(html.match(/content=["'](20\d{2}-\d{2}-\d{2}T[^"']+)/)?.[1] || "") ||
      null;
    if (!title || !startIso) continue;
    const endMatch = desc.match(/@\s*\d{1,2}:\d{2}\s*-\s*(\d{1,2}:\d{2})/);
    let endIso: string | null = null;
    if (endMatch) {
      const day = desc.match(/(\d{2}\/\d{2}\/20\d{2})/)?.[1];
      if (day) endIso = parsePtDateTime(`${day} @ ${endMatch[1]}`);
    }
    const price =
      pickDayPrice(html.match(/€\s?\d[\d.,]+|\d[\d.,]+\s*€/g) || []) ||
      pickDayPrice([html.match(/Preço[^€\d]{0,20}([\d.,]+\s*€|€\s*[\d.,]+)/i)?.[1] || ""]);
    const tickets: OutdoorTicket[] = price != null ? [{ name: "pessoa", price }] : [];
    const labeled = html.match(/\bLocal(?:ização|izacao)?\b\s*[:：]\s*([^<\n]{3,80})/i)?.[1];
    const fromTitle = title.split("|").slice(1).join("|").trim();
    const park = title.match(/Parque\s+Natural\s+de\s+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{2,40}/)?.[0];
    const place = cleanPlace(stripTags(labeled || "")) || cleanPlace(fromTitle) || cleanPlace(park) || "Norte de Portugal";
    const ev = base({
      key: `hikeland:${url.replace(/\/$/, "").split("/").pop()}`,
      sourceId: "hikeland",
      organizer: "Hike Land",
      title,
      description: desc,
      aboutPt: stripTags(html).slice(0, 900) || null,
      includesPt: /seguro/i.test(html) ? "Guia; seguro (conforme página)" : null,
      startIso,
      endIso,
      location: place,
      address: null,
      tickets,
      url: url.replace(/\/?$/, "/"),
      imageUrl,
    });
    if (ev) out.push(ev);
  }
  return out;
}

/** Trekking Roots — /caminhada/* with Event JSON-LD. */
export async function fetchTrekkingRootsEvents(): Promise<OutdoorEvent[]> {
  const list = await fetchText("https://trekkingroots.pt/calendario-caminhadas/");
  if (!list) return [];
  const paths = [
    ...new Set([...list.matchAll(/href="(\/caminhada\/[^"]+)"/g)].map((m) => m[1]!)),
  ];
  const out: OutdoorEvent[] = [];
  for (const path of paths) {
    const url = `https://trekkingroots.pt${path}`;
    const html = await fetchText(url);
    if (!html) continue;
    for (const m of html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    )) {
      try {
        const node = JSON.parse(m[1]!) as Record<string, unknown>;
        if (!/event/i.test(String(node["@type"] || ""))) continue;
        const title = String(node.name || "").trim();
        const startIso = String(node.startDate || "").trim();
        if (!title || !startIso) continue;
        const endIso = String(node.endDate || "").trim() || null;
        const loc = node.location as
          | { name?: string; address?: { addressLocality?: string }; geo?: { latitude?: string; longitude?: string } }
          | undefined;
        const lat = loc?.geo?.latitude != null ? Number(loc.geo.latitude) : null;
        const lng = loc?.geo?.longitude != null ? Number(loc.geo.longitude) : null;
        const offers = node.offers as { price?: string } | undefined;
        const price = offers?.price != null ? Number(offers.price) : null;
        const tickets: OutdoorTicket[] =
          price != null && Number.isFinite(price) ? [{ name: "pessoa", price }] : [];
        const image =
          typeof node.image === "string"
            ? node.image
            : Array.isArray(node.image)
              ? String(node.image[0] || "")
              : og(html, "og:image");
        const ev = base({
          key: `trekkingroots:${path.split("/").filter(Boolean).pop()}`,
          sourceId: "trekkingroots",
          organizer: "Trekking Roots",
          title,
          description: String(node.description || og(html, "og:description") || ""),
          aboutPt: String(node.description || "").slice(0, 900) || null,
          includesPt: null,
          startIso: new Date(startIso).toISOString(),
          endIso: endIso ? new Date(endIso).toISOString() : null,
          location: loc?.name || loc?.address?.addressLocality || "Norte de Portugal",
          address: loc?.address?.addressLocality || null,
          lat: Number.isFinite(lat as number) ? lat : null,
          lng: Number.isFinite(lng as number) ? lng : null,
          tickets,
          url,
          imageUrl: image || null,
        });
        if (ev) out.push(ev);
      } catch {
        /* next */
      }
    }
  }
  return out;
}

export function montanhasMeeting(html: string): {
  place: string;
  lat: number | null;
  lng: number | null;
  start: string | null;
  end: string | null;
} {
  const start = html.match(/IN[IÍ]CIO:\s*(\d{1,2}:\d{2})/i)?.[1] || null;
  const end = html.match(/FINAL:\s*(\d{1,2}:\d{2})/i)?.[1] || null;
  const embed = html.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
  const lng = embed ? Number(embed[1]) : null;
  const lat = embed ? Number(embed[2]) : null;
  let place = "";
  const heading = html.search(/Localiza[cç][aã]o\s*-\s*Hor[aá]rio/i);
  const after = heading >= 0 ? html.slice(heading) : "";
  for (const paragraph of after.matchAll(/<p>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(paragraph[1] || "")
      .replace(/clique para ver no google maps/gi, "")
      .trim();
    if (!text || /coordenadas|^guia\b|seguro|rnaat|licen[cç]a/i.test(text)) continue;
    const cleaned = cleanPlace(text);
    if (cleaned) {
      place = cleaned;
      break;
    }
  }
  return {
    place: place || "Norte de Portugal",
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    start,
    end,
  };
}

/** Montanhas do Norte — /tour/* pages. */
export async function fetchMontanhasEvents(): Promise<OutdoorEvent[]> {
  const list = await fetchText("https://montanhasdonorte.pt/");
  if (!list) return [];
  const urls = [
    ...new Set(
      [...list.matchAll(/https:\/\/montanhasdonorte\.pt\/tour\/[a-z0-9\-]+\/?/gi)].map((m) => m[0])
    ),
  ];
  const out: OutdoorEvent[] = [];
  for (const url of urls) {
    const html = await fetchText(url);
    if (!html) continue;
    const title = (og(html, "og:title") || "").replace(/\s*-\s*Montanhas do Norte.*$/i, "").trim();
    const imageUrl = og(html, "og:image");
    const meet = montanhasMeeting(html);
    const dateHit =
      html.match(/tour-booking-date-display[^>]*>\s*(\d{2}\/\d{2}\/20\d{2})/i)?.[1] ||
      html.match(/Data\s*:?\s*(\d{2}\/\d{2}\/20\d{2})/i)?.[1] ||
      html.match(/(\d{2}\/\d{2}\/20\d{2})/)?.[1];
    const startIso = dateHit ? parsePtDateTime(`${dateHit} @ ${meet.start || "09:00"}`) : null;
    const endIso = dateHit && meet.end ? parsePtDateTime(`${dateHit} @ ${meet.end}`) : null;
    if (!title || !startIso) continue;
    const price = pickDayPrice(html.match(/€\s?\d[\d.,]+|\d[\d.,]+\s*€/g) || []);
    const tickets: OutdoorTicket[] = price != null ? [{ name: "pessoa", price }] : [];
    const ev = base({
      key: `montanhas:${url.replace(/\/$/, "").split("/").pop()}`,
      sourceId: "montanhas",
      organizer: "Montanhas do Norte",
      title,
      description: stripTags(html).slice(0, 500),
      aboutPt: stripTags(html).slice(0, 900),
      includesPt: null,
      startIso,
      endIso,
      location: meet.place,
      address: meet.place,
      lat: meet.lat,
      lng: meet.lng,
      tickets,
      url: url.replace(/\/?$/, "/"),
      imageUrl,
    });
    if (ev) out.push(ev);
  }
  return out;
}

/** Arouca Geopark — eventos feed + detail. */
export async function fetchAroucaEvents(): Promise<OutdoorEvent[]> {
  const feed = await fetchText("https://aroucageopark.pt/eventos/feed/");
  if (!feed) return [];
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  const out: OutdoorEvent[] = [];
  for (const item of items) {
    const block = item[1]!;
    const title = stripTags(block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
    const url = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim();
    if (!title || !url || /conferência|conferencia|inherit|feira das colheitas/i.test(title)) {
      continue;
    }
    const html = await fetchText(url);
    if (!html) continue;
    const body = stripTags(html);
    let startIso: string | null = null;
    // "25-10-2026 a 25-10-2026" or "Data: 25 de outubro"
    const dmy = html.match(/(\d{2})-(\d{2})-(20\d{2})/);
    if (dmy) startIso = parsePtDateTime(`${dmy[1]}/${dmy[2]}/${dmy[3]} @ 09:30`);
    if (!startIso) {
      const slash = html.match(/(\d{2})\/(\d{2})\/(20\d{2})/);
      if (slash) startIso = parsePtDateTime(`${slash[1]}/${slash[2]}/${slash[3]} @ 09:30`);
    }
    if (!startIso) {
      const months: Record<string, string> = {
        janeiro: "01",
        fevereiro: "02",
        março: "03",
        marco: "03",
        abril: "04",
        maio: "05",
        junho: "06",
        julho: "07",
        agosto: "08",
        setembro: "09",
        outubro: "10",
        novembro: "11",
        dezembro: "12",
      };
      const verbal = body.match(/(\d{1,2})\s+de\s+([A-Za-zçãáéíóú]+)/i);
      if (verbal) {
        const mon = months[verbal[2]!.toLowerCase()];
        if (mon) {
          startIso = parsePtDateTime(
            `${verbal[1]!.padStart(2, "0")}/${mon}/2026 @ 09:30`
          );
        }
      }
    }
    if (!startIso) continue;
    const price = pickDayPrice(body.match(/([\d.,]+)\s*€|€\s*([\d.,]+)/g) || []) ?? 7.5;
    const tickets: OutdoorTicket[] = [{ name: "pessoa", price }];
    const includes =
      body.match(/Inclui:\s*([^.…]{10,200})/i)?.[1]?.trim() ||
      (body.includes("seguro")
        ? "Guia-intérprete, seguro, reforço alimentar (conforme página)"
        : null);
    const imageUrl =
      og(html, "og:image") ||
      html.match(/https:\/\/aroucageopark\.pt\/wp-content\/uploads\/[^"']+\.(?:jpg|jpeg|png|webp)/i)?.[0] ||
      "https://aroucageopark.pt/wp-content/uploads/2025/02/AG_sem-fundo-cores-1-150x150.png";
    const ev = base({
      key: `arouca:${url.replace(/\/$/, "").split("/").pop()}`,
      sourceId: "arouca",
      organizer: "Arouca Geopark",
      title,
      description: body.slice(0, 400),
      aboutPt: body.slice(0, 900),
      includesPt: includes,
      startIso,
      endIso: null,
      location: "Arouca Geopark",
      address: "Arouca, Portugal",
      lat: 40.928,
      lng: -8.245,
      tickets,
      url,
      imageUrl,
    });
    if (ev) out.push(ev);
  }
  return out;
}

/** Gerês Viver Turismo — WooCommerce store API products. */
export async function fetchGeresEvents(): Promise<OutdoorEvent[]> {
  const data = await fetchJson<
    Array<{
      id: number;
      name: string;
      permalink: string;
      prices?: { price?: string; currency_code?: string };
      images?: Array<{ src?: string }>;
      short_description?: string;
      description?: string;
    }>
  >("https://caminhadas.geres.pt/wp-json/wc/store/v1/products?per_page=40");
  if (!Array.isArray(data)) return [];
  const out: OutdoorEvent[] = [];
  for (const p of data) {
    const name = stripTags(p.name || "");
    // Titles often "Santa Isabel 26/12" — parse day/month, year 2026
    const dm = name.match(/(\d{1,2})\s*\/\s*(\d{1,2})\b/) || name.match(/(\d{2})(\d{2})\b/);
    let startIso: string | null = null;
    if (dm) {
      const day = Number(dm[1]);
      const month = Number(dm[2]);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        startIso = parsePtDateTime(
          `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/2026 @ 09:00`
        );
      }
    }
    if (!startIso) continue;
    const cents = p.prices?.price != null ? Number(p.prices.price) : NaN;
    // Store API uses minor units; free guest products fall back to programme fee €12.50
    let price = Number.isFinite(cents) ? cents / 100 : 12.5;
    if (price <= 0) price = 12.5;
    const tickets: OutdoorTicket[] = [{ name: "pessoa", price }];
    const ev = base({
      key: `geres:${p.id}`,
      sourceId: "geres",
      organizer: "Gerês Viver Turismo",
      title: name,
      description: stripTags(p.short_description || p.description || "").slice(0, 500),
      aboutPt: stripTags(p.description || "").slice(0, 900) || null,
      includesPt: "Caminhada guiada (programa anual Gerês Viver Turismo)",
      startIso,
      endIso: null,
      location: "Parque Nacional da Peneda-Gerês",
      address: "Terras de Bouro / Gerês",
      lat: 41.722,
      lng: -8.163,
      tickets,
      url: p.permalink,
      imageUrl: p.images?.[0]?.src || null,
      priceLabel: euroLabel(price),
    });
    if (ev) out.push(ev);
  }
  return out;
}

const SHOTGUN_CITIES = [
  { slug: "porto", label: "Porto" },
  { slug: "lisbon", label: "Lisboa" },
];

/** Vercel challenges Node/curl. Python's client still gets the city HTML. */
function shotgunHtml(url: string): Promise<string | null> {
  const script = [
    "import urllib.request, sys",
    "req = urllib.request.Request(sys.argv[1], headers={",
    '  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",',
    '  "Accept": "text/html",',
    "})",
    "with urllib.request.urlopen(req, timeout=20) as res:",
    "    sys.stdout.buffer.write(res.read())",
  ].join("\n");
  return new Promise((resolve) => {
    execFile("python3", ["-c", script, url], { maxBuffer: 2_000_000, timeout: 25_000 }, (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }
      const html = stdout.toString();
      resolve(html.includes("/en/events/") ? html : null);
    });
  });
}

function shotgunPrice(chunk: string): { label: string | null; tickets: OutdoorTicket[] } | "sold" {
  if (/sold out/i.test(chunk)) return "sold";
  const hit = chunk.match(/€\s?(\d+(?:[.,]\d{1,2})?)/);
  if (!hit) {
    if (/\bfree\b/i.test(chunk)) return { label: "бесплатно", tickets: [] };
    return { label: null, tickets: [] };
  }
  const price = Number(hit[1]!.replace(",", "."));
  if (!Number.isFinite(price) || price < 0 || price > 80) return "sold";
  if (price === 0) return { label: "бесплатно", tickets: [] };
  return { label: euroLabel(price), tickets: [{ name: "entrada", price }] };
}

/** Shotgun city lists for Porto and Lisbon. One public night calendar, not RA. */
export async function fetchShotgunEvents(): Promise<OutdoorEvent[]> {
  const out: OutdoorEvent[] = [];
  const seen = new Set<string>();
  for (let c = 0; c < SHOTGUN_CITIES.length; c++) {
    const city = SHOTGUN_CITIES[c]!;
    if (c > 0) await new Promise((resolve) => setTimeout(resolve, 2000));
    const page = await shotgunHtml(`https://shotgun.live/en/cities/${city.slug}`);
    if (!page) {
      console.warn(`[outdoor] shotgun ${city.slug}: page unavailable`);
      continue;
    }
    const parts = page.split(/<a[^>]+href="(\/en\/events\/[^"]+)"[^>]*>/i);
    for (let i = 1; i < parts.length; i += 2) {
      const path = parts[i]!;
      const slug = path.split("/").pop() || "";
      const chunk = (parts[i + 1] || "").split("</a>")[0] || "";
      if (!slug || seen.has(slug)) continue;
      const title = stripTags(
        chunk.match(/class="line-clamp-2[^"]*"[^>]*>([^<]+)/)?.[1] ||
          chunk.match(/alt="([^"]+)"/)?.[1] ||
          ""
      );
      const venueRaw = stripTags(
        chunk.match(/text-muted-foreground shrink overflow-hidden[^"]*"[^>]*>([^<]+)/)?.[1] || ""
      );
      const venue = venueRaw && venueRaw.toLowerCase() !== city.label.toLowerCase() ? venueRaw : city.label;
      const startRaw = chunk.match(/dateTime="([^"]+)"/)?.[1] || "";
      const price = shotgunPrice(chunk);
      const imageUrl = chunk.match(
        /https:\/\/assets\.shotgun\.live\/image\/upload\/c_limit,w_1080[^"\s]+/
      )?.[0];
      if (!title || !startRaw || !imageUrl || price === "sold") continue;
      const startMs = Date.parse(startRaw);
      if (!Number.isFinite(startMs) || startMs < Date.now() - 2 * 60 * 60 * 1000) continue;
      const placeholderClock = /T23:59:00/.test(startRaw);
      const startIso = placeholderClock ? `${startRaw.slice(0, 10)}T23:59:00.000Z` : startRaw;
      const hour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Lisbon",
          hour: "2-digit",
          hourCycle: "h23",
        }).format(new Date(startIso))
      );
      // Daytime listings (family lunch, 16:00 rooftop) are not the night slot.
      if (!placeholderClock && hour >= 7 && hour < 18) continue;
      const location = venue === city.label ? city.label : `${venue}, ${city.label}`;
      const address = venue === city.label ? `${city.label}, Portugal` : `${venue}, ${city.label}, Portugal`;
      seen.add(slug);
      out.push({
        key: `shotgun:${slug}`,
        sourceId: "shotgun",
        organizer: venue,
        title,
        description: location,
        aboutPt: null,
        includesPt: null,
        startIso,
        endIso: null,
        location,
        address,
        lat: null,
        lng: null,
        mapsUrl: mapsUrlFor({
          lat: null,
          lng: null,
          address,
          location,
        }),
        tickets: price.tickets,
        priceLabel: price.label,
        url: `https://shotgun.live${path}`,
        imageUrl,
      });
    }
  }
  return out;
}

export type OutdoorSourceFn = () => Promise<OutdoorEvent[]>;

const AGENDA_KEEP = new Set(["musica", "teatro", "danca", "cinema", "stand-up-comedy", "literatura"]);
const AGENDA_TAG: Record<string, string> = {
  musica: "music",
  teatro: "theatre",
  danca: "dance",
  cinema: "cinema",
  literatura: "literature",
  artes: "exhibition",
  "stand-up-comedy": "theatre",
};
const HORIZON_DAYS = 45;

function lisbonToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date()
  );
}

function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

/** Wall clock in Lisbon → UTC. Casa da Música prints "2026-11-01 18:00:00" with no zone. */
function lisbonWallToIso(wall: string): string | null {
  const match = wall.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Lisbon",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(guess)
      .map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute)
  );
  return new Date(guess.getTime() - (asUtc - guess.getTime())).toISOString();
}

function decodeBasic(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

type AgendaEvent = {
  id?: number;
  title?: { rendered?: string };
  featured_media_large?: string;
  description?: string[];
  venue?: Record<string, { name?: string }>;
  categories_name_list?: Record<string, { slug?: string }>;
  link?: string;
  occurences?: string[];
  StartDate?: string;
  LastDate?: string;
  string_times?: string;
  price_cat?: string | string[];
};

/** Câmara Municipal de Lisboa open agenda. One next date, not every day of a long exhibition. */
const AGENDA_WEEKDAY = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;

/** "18h00", or "dom: 21h" / "sáb: 14h, 18h" for the day we keep. */
function agendaClock(raw: string, day: string): { hh: string; mm: string } | null {
  const text = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const simple = text.match(/^(\d{1,2})\s*h\s*(\d{2})?$/);
  if (simple) return { hh: simple[1]!.padStart(2, "0"), mm: simple[2] || "00" };
  const date = new Date(`${day}T12:00:00Z`);
  if (!Number.isFinite(date.getTime())) return null;
  const weekday = AGENDA_WEEKDAY[date.getUTCDay()];
  for (const part of text.split(";")) {
    const slot = part.trim().match(/^(dom|seg|ter|qua|qui|sex|sab)\s*:\s*(.+)$/);
    if (!slot || slot[1] !== weekday) continue;
    const first = slot[2]!.match(/(\d{1,2})\s*h\s*(\d{2})?/);
    if (first) return { hh: first[1]!.padStart(2, "0"), mm: first[2] || "00" };
  }
  return null;
}

export async function fetchAgendaLxEvents(): Promise<OutdoorEvent[]> {
  const today = lisbonToday();
  const until = addDays(today, HORIZON_DAYS);
  const rows: AgendaEvent[] = [];
  for (let page = 1; page <= 8; page++) {
    const batch = await fetchJson<AgendaEvent[]>(
      `https://www.agendalx.pt/wp-json/agendalx/v1/events?per_page=50&page=${page}`
    );
    if (!batch?.length) break;
    rows.push(...batch);
    if (batch.length < 50) break;
  }
  const out: OutdoorEvent[] = [];
  for (const row of rows) {
    const slugs = Object.values(row.categories_name_list || {})
      .map((item) => item.slug || "")
      .filter(Boolean);
    const upcoming = (row.occurences || []).filter((day) => day >= today && day <= until);
    const next = upcoming[0];
    if (!row.id || !next || !row.link) continue;
    const spanStart = Date.parse(`${row.StartDate || next}T12:00:00Z`);
    const spanEnd = Date.parse(`${row.LastDate || next}T12:00:00Z`);
    const span = Number.isFinite(spanStart) && Number.isFinite(spanEnd) ? Math.round((spanEnd - spanStart) / 86_400_000) : 999;
    // A show with a few dates. Not a museum that is open every day for months.
    const performance = slugs.some((slug) => AGENDA_KEEP.has(slug)) && upcoming.length <= 3;
    const shortArt = slugs.includes("artes") && span <= 3;
    if (!performance && !shortArt) continue;
    const title = decodeBasic(stripTags(row.title?.rendered || ""));
    const venue = Object.values(row.venue || []).find((item) => item?.name)?.name || "Lisboa";
    const clock = agendaClock(row.string_times || "", next);
    const startIso = clock
      ? lisbonWallToIso(`${next} ${clock.hh}:${clock.mm}:00`)
      : `${next}T23:59:00.000Z`;
    if (!title || !startIso) continue;
    const startMs = Date.parse(startIso);
    if (!Number.isFinite(startMs) || startMs < Date.now() - 2 * 60 * 60 * 1000) continue;
    const priceCat = Array.isArray(row.price_cat) ? row.price_cat.join(" ") : row.price_cat || "";
    const free = /free|gratuito/i.test(priceCat);
    const location = venue.toLowerCase() === "lisboa" ? "Lisboa" : `${venue}, Lisboa`;
    const agendaTags = slugs.map((slug) => AGENDA_TAG[slug]).filter((tag): tag is string => !!tag);
    out.push({
      key: `agendalx:${row.id}`,
      sourceId: "agendalx",
      organizer: venue,
      title,
      description: decodeBasic(stripTags((row.description || []).join(" "))).slice(0, 500),
      aboutPt: null,
      includesPt: null,
      startIso,
      endIso: null,
      location,
      address: `${venue}, Lisboa, Portugal`,
      lat: null,
      lng: null,
      mapsUrl: mapsUrlFor({ lat: null, lng: null, address: `${venue}, Lisboa, Portugal`, location }),
      tickets: [],
      priceLabel: free ? "бесплатно" : null,
      url: row.link,
      imageUrl: row.featured_media_large || null,
      tags: agendaTags,
    });
  }
  return out.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso)).slice(0, 80);
}

/** Casa da Música agenda page. Concerts in Porto, each session is its own row. */
export async function fetchCasaMusicaEvents(): Promise<OutdoorEvent[]> {
  const html = await fetchText("https://casadamusica.com/en/agenda/");
  if (!html) {
    console.warn("[outdoor] casa da música: page unavailable");
    return [];
  }
  const out: OutdoorEvent[] = [];
  for (const block of html.split('itemtype="https://schema.org/Event"').slice(1)) {
    const wall = block.match(/datetime="(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})"/)?.[1];
    const title = decodeBasic(stripTags(block.match(/itemprop="name"[^>]*>([\s\S]*?)<\/a>/)?.[1] || ""));
    const href = block.match(/href="(https:\/\/casadamusica\.com\/[^"]+)"/)?.[1];
    const room = decodeBasic(stripTags(block.match(/uppercase[\s\S]{0,240}<div>([^<]+)<\/div>/)?.[1] || "")) || "Casa da Música";
    const image = block.match(/src="(https:\/\/casadamusic[^"]+)"/)?.[1] || null;
    if (!wall || !title || !href) continue;
    const startIso = lisbonWallToIso(wall);
    if (!startIso || Date.parse(startIso) < Date.now() - 2 * 60 * 60 * 1000) continue;
    const euro = block.match(/€\s?(\d+(?:[.,]\d{1,2})?)/);
    const price = euro ? Number(euro[1]!.replace(",", ".")) : null;
    const session = href.match(/selected_session=(\d+)/)?.[1];
    const slug = href.match(/\/event\/([^/?]+)/)?.[1] || title;
    const location = `${room}, Casa da Música, Porto`;
    out.push({
      key: `casamusica:${slug}:${session || wall.slice(0, 10)}`,
      sourceId: "casamusica",
      organizer: "Casa da Música",
      title,
      description: location,
      aboutPt: null,
      includesPt: null,
      startIso,
      endIso: null,
      location,
      address: "Casa da Música, Porto, Portugal",
      lat: 41.1588,
      lng: -8.6307,
      mapsUrl: mapsUrlFor({
        lat: 41.1588,
        lng: -8.6307,
        address: "Casa da Música, Porto, Portugal",
        location,
      }),
      tickets: price && price > 0 && price <= 150 ? [{ name: "entrada", price }] : [],
      priceLabel: /free entry/i.test(block) ? "бесплатно" : price && price > 0 && price <= 150 ? euroLabel(price) : null,
      url: href,
      imageUrl: image,
      tags: ["music"],
    });
  }
  return out;
}

const LIGA_CITY: Record<string, string> = {
  Porto: "Porto",
  Lisbon: "Lisboa",
  Amadora: "Lisboa",
  Estoril: "Lisboa",
  Braga: "Braga",
  Guimarães: "Guimarães",
  Barcelos: "Barcelos",
  "Vila do Conde": "Vila do Conde",
  "Vila Nova de Famalicão": "Famalicão",
};

type LigaEvent = {
  id?: string;
  date?: string;
  competitions?: Array<{
    status?: { type?: { state?: string } };
    venue?: { fullName?: string; address?: { city?: string } };
    competitors?: Array<{
      homeAway?: string;
      team?: { displayName?: string; logos?: Array<{ href?: string }> };
    }>;
  }>;
};

/** Primeira Liga matches in Porto, Lisbon and the north. ESPN scoreboard, one request per match day. */
export async function fetchLigaEvents(): Promise<OutdoorEvent[]> {
  const today = lisbonToday();
  const until = addDays(today, HORIZON_DAYS);
  const first = await fetchJson<{ leagues?: Array<{ calendar?: string[] }>; events?: LigaEvent[] }>(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/scoreboard?dates=${today.replace(/-/g, "")}`
  );
  const days = new Set<string>();
  for (const stamp of first?.leagues?.[0]?.calendar || []) {
    const day = stamp.slice(0, 10);
    if (day >= today && day <= until) days.add(day);
  }
  days.add(today);
  const events: LigaEvent[] = [...(first?.events || [])];
  for (const day of [...days].filter((day) => day !== today)) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const board = await fetchJson<{ events?: LigaEvent[] }>(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/por.1/scoreboard?dates=${day.replace(/-/g, "")}`
    );
    if (board?.events?.length) events.push(...board.events);
  }
  const seen = new Set<string>();
  const out: OutdoorEvent[] = [];
  for (const event of events) {
    const competition = event.competitions?.[0];
    const city = LIGA_CITY[competition?.venue?.address?.city || ""];
    if (!event.id || !event.date || !city || seen.has(event.id)) continue;
    if (competition?.status?.type?.state === "post") continue;
    const startMs = Date.parse(event.date);
    if (!Number.isFinite(startMs) || startMs < Date.now() - 2 * 60 * 60 * 1000) continue;
    const home = competition?.competitors?.find((side) => side.homeAway === "home")?.team;
    const away = competition?.competitors?.find((side) => side.homeAway === "away")?.team;
    if (!home?.displayName || !away?.displayName) continue;
    const stadium = competition?.venue?.fullName || city;
    const location = `${stadium}, ${city}`;
    seen.add(event.id);
    out.push({
      key: `liga:${event.id}`,
      sourceId: "liga",
      organizer: home.displayName,
      title: `${away.displayName} — ${home.displayName}`,
      description: location,
      aboutPt: null,
      includesPt: null,
      startIso: new Date(startMs).toISOString(),
      endIso: null,
      location,
      address: `${stadium}, ${city}, Portugal`,
      lat: null,
      lng: null,
      mapsUrl: mapsUrlFor({ lat: null, lng: null, address: `${stadium}, ${city}, Portugal`, location }),
      tickets: [],
      priceLabel: null,
      url: `https://www.espn.com/soccer/match/_/gameId/${event.id}`,
      imageUrl: home.logos?.[0]?.href || null,
    });
  }
  if (!out.length) console.warn("[outdoor] liga: no matches in Porto, Lisbon or the north");
  return out.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
}

export const OUTDOOR_SOURCES: Array<{ id: string; label: string; fetch: OutdoorSourceFn }> = [
  { id: "geo2go", label: "Geo2Go", fetch: fetchGeo2goEvents },
  { id: "trekkin", label: "Trekkin", fetch: fetchTrekkinEvents },
  { id: "hikeland", label: "Hike Land", fetch: fetchHikeLandEvents },
  { id: "trekkingroots", label: "Trekking Roots", fetch: fetchTrekkingRootsEvents },
  { id: "montanhas", label: "Montanhas do Norte", fetch: fetchMontanhasEvents },
  { id: "arouca", label: "Arouca Geopark", fetch: fetchAroucaEvents },
  { id: "geres", label: "Gerês Viver Turismo", fetch: fetchGeresEvents },
  { id: "shotgun", label: "Shotgun", fetch: fetchShotgunEvents },
  { id: "agendalx", label: "Agenda Cultural de Lisboa", fetch: fetchAgendaLxEvents },
  { id: "casamusica", label: "Casa da Música", fetch: fetchCasaMusicaEvents },
  { id: "liga", label: "Primeira Liga", fetch: fetchLigaEvents },
];
