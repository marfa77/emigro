/**
 * Outdoor experience sources for @emigro_portugal.
 */
import type { OutdoorEvent, OutdoorTicket } from "@/lib/news/outdoor/types";
import {
  euroLabel,
  fetchJson,
  fetchText,
  isInScope,
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
    const place =
      stripTags(html.match(/(?:Local|Localização|Venue)[:\s]*([^<]{5,80})/i)?.[1] || "") ||
      title.split("|").slice(1).join("|").trim() ||
      "Norte de Portugal";
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
    const dateHit =
      html.match(/Data\s*:?\s*(\d{2}\/\d{2}\/20\d{2})/i)?.[1] ||
      html.match(/(\d{2}\/\d{2}\/20\d{2})/)?.[1];
    const startIso = dateHit ? parsePtDateTime(`${dateHit} @ 09:00`) : null;
    if (!title || !startIso) continue;
    const price = pickDayPrice(html.match(/€\s?\d[\d.,]+|\d[\d.,]+\s*€/g) || []);
    const tickets: OutdoorTicket[] = price != null ? [{ name: "pessoa", price }] : [];
    const place =
      stripTags(html.match(/(?:Local|Localização)[:\s]*([^<]{4,80})/i)?.[1] || "") ||
      title.split("-").slice(-1)[0]!.trim() ||
      "Norte de Portugal";
    const ev = base({
      key: `montanhas:${url.replace(/\/$/, "").split("/").pop()}`,
      sourceId: "montanhas",
      organizer: "Montanhas do Norte",
      title,
      description: stripTags(html).slice(0, 500),
      aboutPt: stripTags(html).slice(0, 900),
      includesPt: null,
      startIso,
      endIso: null,
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

export type OutdoorSourceFn = () => Promise<OutdoorEvent[]>;

export const OUTDOOR_SOURCES: Array<{ id: string; label: string; fetch: OutdoorSourceFn }> = [
  { id: "geo2go", label: "Geo2Go", fetch: fetchGeo2goEvents },
  { id: "trekkin", label: "Trekkin", fetch: fetchTrekkinEvents },
  { id: "hikeland", label: "Hike Land", fetch: fetchHikeLandEvents },
  { id: "trekkingroots", label: "Trekking Roots", fetch: fetchTrekkingRootsEvents },
  { id: "montanhas", label: "Montanhas do Norte", fetch: fetchMontanhasEvents },
  { id: "arouca", label: "Arouca Geopark", fetch: fetchAroucaEvents },
  { id: "geres", label: "Gerês Viver Turismo", fetch: fetchGeresEvents },
];
