/**
 * Geo2Go agenda → @emigro_portugal (outdoor experiences: Bussaco / Caramulo…).
 * Separate from RSS life-news; posts one new upcoming event per run.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { geminiFastJson } from "@/lib/news/gemini";

export const GEO2GO_CHANNEL = () =>
  (process.env.EMIGRO_PORTUGAL_NEWS_CHANNEL || "@emigro_portugal").trim();

const AGENDA_URL = "https://www.geo2go.pt/agenda";
const CHANNEL_URL = "https://t.me/emigro_portugal";
const CAPTION_MAX = 1024;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ORGANIZER = "Geo2Go";

export type Geo2goTicket = { name: string; price: number };

export type Geo2goEvent = {
  key: string;
  slug: string;
  title: string;
  description: string;
  aboutPt: string | null;
  includesPt: string | null;
  startIso: string;
  endIso: string | null;
  location: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
  organizer: string;
  tickets: Geo2goTicket[];
  /** Short card summary e.g. "€13–29". */
  priceLabel: string | null;
  url: string;
  imageUrl: string | null;
};

export type Geo2goDraft = {
  title: string;
  lead: string;
  paragraphs: string[];
  tip: string;
  includesRu: string | null;
  cardLines: string[];
  sourceUrl: string;
  mapsUrl: string;
  locationLine: string;
  organizer: string;
  priceLine: string | null;
  priceLabel: string | null;
  whenLine: string;
  image: Buffer;
  eventKey: string;
};

const SCHEMA = {
  type: "OBJECT",
  properties: {
    skip: { type: "BOOLEAN" },
    title: { type: "STRING" },
    lead: { type: "STRING" },
    paragraphs: { type: "ARRAY", items: { type: "STRING" } },
    tip: { type: "STRING" },
    includes_ru: { type: "STRING" },
  },
  required: ["skip", "title", "lead", "paragraphs", "tip", "includes_ru"],
};

function seenPath(): string {
  return resolve(process.cwd(), "deploy/geo2go-events/state/seen.json");
}

function loadSeen(): Set<string> {
  const path = seenPath();
  if (!existsSync(path)) return new Set();
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function remember(key: string): void {
  const path = seenPath();
  mkdirSync(dirname(path), { recursive: true });
  const prev = loadSeen();
  prev.add(key);
  writeFileSync(path, JSON.stringify([...prev].slice(-400), null, 2) + "\n");
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function xml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fontFile(candidates: string[]): string | null {
  return candidates.find((path) => existsSync(path)) ?? null;
}

function boldFont(): string | null {
  return fontFile([
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
  ]);
}

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
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

function parseCoords(html: string): { lat: number | null; lng: number | null } {
  const lat = Number(html.match(/"latitude"\s*:\s*([-\d.]+)/)?.[1]);
  const lng = Number(html.match(/"longitude"\s*:\s*([-\d.]+)/)?.[1]);
  return {
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

function mapsUrlFor(params: {
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

function euroLabel(n: number): string {
  return n % 1 === 0 ? `€${n}` : `€${n.toFixed(2)}`;
}

function parseTickets(html: string): Geo2goTicket[] {
  const tickets: Geo2goTicket[] = [];
  const seen = new Set<string>();
  for (const m of html.matchAll(
    /"name"\s*:\s*"([^"]+)"\s*,\s*"price"\s*:\s*\{[^}]*?"value"\s*:\s*"([\d.]+)"/g
  )) {
    const name = m[1]!.trim();
    const price = Number(m[2]);
    if (!name || !Number.isFinite(price)) continue;
    if (/cogumelos do bussaco|trilho|experienc/i.test(name) && !/adulto|anos|crian/i.test(name)) {
      continue; // package title, not a tier
    }
    const key = `${name}|${price}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tickets.push({ name, price });
  }
  return tickets;
}

function priceLabelFromTickets(tickets: Geo2goTicket[], node?: Record<string, unknown>): string | null {
  const paid = tickets.map((t) => t.price).filter((n) => n > 0);
  if (paid.length > 0) {
    const min = Math.min(...paid);
    const max = Math.max(...paid);
    return min === max ? euroLabel(min) : `${euroLabel(min)}–${euroLabel(max).replace("€", "")}`;
  }
  const offers = node?.offers as { highPrice?: string | number } | undefined;
  const high = Number(offers?.highPrice);
  if (Number.isFinite(high) && high > 0) return euroLabel(high);
  return null;
}

function ticketTierRu(name: string, price: number): string {
  const n = name.trim();
  if (/^adulto$/i.test(n)) return price > 0 ? `${euroLabel(price)} взрослый` : "взрослый — бесплатно";
  if (/12\s*aos?\s*16/i.test(n)) {
    return price > 0
      ? `${euroLabel(price)} подросток 12–16 лет`
      : "подросток 12–16 лет — бесплатно";
  }
  if (/6\s*aos?\s*11/i.test(n)) {
    return price > 0 ? `${euroLabel(price)} ребёнок 6–11 лет` : "ребёнок 6–11 лет — бесплатно";
  }
  if (/<\s*6|menor\s*de\s*6|até\s*5/i.test(n)) {
    return price > 0 ? `${euroLabel(price)} младше 6 лет` : "младше 6 лет — бесплатно";
  }
  return price > 0 ? `${euroLabel(price)} (${n})` : `${n} — бесплатно`;
}

/** Full cost line for caption. */
function formatPriceLine(tickets: Geo2goTicket[]): string | null {
  if (tickets.length === 0) return null;
  const paid = tickets.filter((t) => t.price > 0).map((t) => ticketTierRu(t.name, t.price));
  const free = tickets.filter((t) => t.price === 0).map((t) => ticketTierRu(t.name, t.price));
  const parts = [...paid];
  if (free.length) parts.push(free.join("; "));
  return parts.join(", ");
}

function parseAboutAndIncludes(html: string): { aboutPt: string | null; includesPt: string | null } {
  let aboutPt: string | null = null;
  const aboutMatch = html.match(/data-hook="about-section"[^>]*>([\s\S]{0,4000}?)<\/(?:div|section|span)>/i);
  if (aboutMatch) {
    aboutPt = aboutMatch[1]!
      .replace(/<[^>]+>/g, " ")
      .replace(/Sobre o evento/gi, " ")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1200) || null;
  }
  const inclui = html.match(/INCLUI:\s*([^<]{10,500})/i);
  let includesPt = inclui?.[1]?.replace(/&gt;/g, ">").replace(/\s+/g, " ").trim() || null;
  if (!includesPt && aboutPt) {
    // fallback: first sentence after "programa"
    const prog = aboutPt.match(/(?:Do programa consta|programa)[^.!]{10,280}/i);
    if (prog) includesPt = prog[0]!.trim();
  }
  return { aboutPt, includesPt };
}

function parseJsonLdEvent(html: string, fallbackUrl: string): Geo2goEvent | null {
  const { lat, lng } = parseCoords(html);
  const tickets = parseTickets(html);
  const { aboutPt, includesPt } = parseAboutAndIncludes(html);
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of blocks) {
    try {
      const data = JSON.parse(m[1]!) as Record<string, unknown> | Record<string, unknown>[];
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const type = String((node as { "@type"?: string })["@type"] || "");
        if (!/event/i.test(type)) continue;
        const name = String((node as { name?: string }).name || "").trim();
        const startIso = String((node as { startDate?: string }).startDate || "").trim();
        if (!name || !startIso) continue;
        const endIso = String((node as { endDate?: string }).endDate || "").trim() || null;
        const description = String((node as { description?: string }).description || "").trim();
        const locRaw = (node as { location?: { name?: string; address?: unknown } }).location;
        let location = "";
        let address: string | null = null;
        if (locRaw && typeof locRaw === "object") {
          location = String(locRaw.name || "").trim();
          if (typeof locRaw.address === "string" && locRaw.address.trim()) {
            address = locRaw.address.trim();
          } else if (locRaw.address && typeof locRaw.address === "object") {
            address =
              String((locRaw.address as { streetAddress?: string }).streetAddress || "").trim() || null;
          }
        }
        const url = String((node as { url?: string }).url || fallbackUrl).trim() || fallbackUrl;
        const slug = url.split("/").filter(Boolean).pop() || name;
        const imageField = (node as { image?: string | string[] | { url?: string } }).image;
        let imageUrl: string | null = null;
        if (typeof imageField === "string") imageUrl = imageField;
        else if (Array.isArray(imageField)) {
          const first = imageField[0];
          if (typeof first === "string") imageUrl = first;
          else if (first && typeof first === "object" && typeof (first as { url?: string }).url === "string") {
            imageUrl = (first as { url: string }).url;
          }
        } else if (imageField && typeof imageField === "object" && typeof imageField.url === "string") {
          imageUrl = imageField.url;
        }
        if (!imageUrl) {
          const og =
            html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
            html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
          imageUrl = og?.trim() || null;
        }
        const place = location || address || "Portugal";
        return {
          key: `geo2go:${slug}`,
          slug,
          title: name,
          description,
          aboutPt,
          includesPt,
          startIso,
          endIso,
          location: place,
          address,
          lat,
          lng,
          mapsUrl: mapsUrlFor({ lat, lng, address, location: place }),
          organizer: ORGANIZER,
          tickets,
          priceLabel: priceLabelFromTickets(tickets, node as Record<string, unknown>),
          url,
          imageUrl,
        };
      }
    } catch {
      /* next block */
    }
  }
  return null;
}

/** List page → event-details slugs (Wix SSR HTML). */
export async function listGeo2goAgendaUrls(): Promise<string[]> {
  const html = await fetchText(AGENDA_URL);
  if (!html) return [];
  return [
    ...new Set(
      [...html.matchAll(/https:\/\/www\.geo2go\.pt\/event-details\/[a-z0-9\-]+/gi)].map((m) => m[0])
    ),
  ];
}

export async function fetchGeo2goEvent(url: string): Promise<Geo2goEvent | null> {
  const html = await fetchText(url);
  if (!html) return null;
  return parseJsonLdEvent(html, url);
}

export async function loadUpcomingGeo2goEvents(seen: Set<string>): Promise<Geo2goEvent[]> {
  const urls = await listGeo2goAgendaUrls();
  const now = Date.now();
  const out: Geo2goEvent[] = [];
  for (const url of urls) {
    const ev = await fetchGeo2goEvent(url);
    if (!ev) continue;
    if (seen.has(ev.key) || seen.has(ev.url)) continue;
    const start = Date.parse(ev.startIso);
    if (!Number.isFinite(start) || start < now - 6 * 60 * 60 * 1000) continue;
    out.push(ev);
  }
  out.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
  return out;
}

function formatWhen(iso: string, endIso?: string | null): string {
  const start = new Date(iso);
  if (!Number.isFinite(start.getTime())) return iso;
  const day = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(start);
  const t0 = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
  if (endIso) {
    const end = new Date(endIso);
    if (Number.isFinite(end.getTime())) {
      const t1 = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        minute: "2-digit",
      }).format(end);
      return `${day}, ${t0}–${t1}`;
    }
  }
  return `${day}, ${t0}`;
}

function clip(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** Fact lines on the card — date, place, organizer, price (not LLM). */
function factCardLines(ev: Geo2goEvent): string[] {
  const when = formatWhen(ev.startIso, ev.endIso);
  const place = clip(ev.location, 36);
  const lines = [when, place, `Организатор: ${ev.organizer}`];
  if (ev.priceLabel) lines.push(`Стоимость: ${ev.priceLabel}`);
  return lines;
}

function cardSvg(lines: string[]): string {
  const bold = boldFont();
  const face = bold ? `@font-face { font-family: 'CardBold'; src: url('${bold}'); }` : "";
  const boldFamily = bold ? "CardBold" : "DejaVu Sans, Liberation Sans, Arial, sans-serif";
  const rows = lines.slice(0, 4);
  const y0 = 760 - rows.length * 40 - 24;
  const headlines = rows
    .map(
      (line, i) =>
        `<text x="48" y="${y0 + i * 40}" font-family="${boldFamily}" font-size="${i === 0 ? 30 : 26}" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${face}</style>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#062a2e" stop-opacity="0"/>
      <stop offset="40%" stop-color="#062a2e" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#062a2e" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#fade)"/>
  <rect x="0" y="0" width="10" height="800" fill="#1fa8a0"/>
  <text x="48" y="56" font-family="${boldFamily}" font-size="22" fill="#1fa8a0">EMIGRO · EVENTOS</text>
  ${headlines}
  <text x="48" y="780" font-family="${boldFamily}" font-size="15" fill="#c8e6e3">${CHANNEL_URL.replace("https://t.me/", "@")}</text>
</svg>`;
}

async function renderCard(photo: Buffer, cardLines: string[]): Promise<Buffer> {
  const base = await sharp(photo)
    .rotate()
    .resize(800, 800, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.94, saturation: 0.95 })
    .jpeg()
    .toBuffer();
  const overlay = await sharp(Buffer.from(cardSvg(cardLines))).png().toBuffer();
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 88 }).toBuffer();
}

function formatInlineHtml(paragraph: string): string {
  const escaped = esc(paragraph);
  return escaped.replace(
    /\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\-]{1,40})\s*\(([^)]{1,28})\)/g,
    "<i>$1</i> ($2)"
  );
}

function buildCaption(draft: Geo2goDraft): string {
  const facts = [
    `📅 ${esc(draft.whenLine)}`,
    `📍 <a href="${esc(draft.mapsUrl)}">${esc(draft.locationLine)}</a>`,
    `👤 ${esc(draft.organizer)}`,
    draft.priceLine ? `💶 Стоимость: ${esc(draft.priceLine)}` : null,
    draft.includesRu ? `🍽 Включено: ${esc(draft.includesRu)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const tipBlock = draft.tip ? `\n\nНа практике: ${esc(draft.tip)}` : "";
  const footer = `<a href="${esc(draft.sourceUrl)}">Запись на Geo2Go</a>`;
  const head =
    `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n` +
    `<i>${esc(draft.lead)}</i>\n\n` +
    `${facts}\n\n`;
  const paras = [...draft.paragraphs];
  let body = paras.map((p) => formatInlineHtml(p)).join("\n\n");
  let caption = `${head}${body}${tipBlock}\n\n${footer}`;
  while (caption.length > CAPTION_MAX && paras.length > 0) {
    paras.pop();
    body = paras.map((p) => formatInlineHtml(p)).join("\n\n");
    caption = body ? `${head}${body}${tipBlock}\n\n${footer}` : `${head}${tipBlock}\n\n${footer}`;
  }
  if (caption.length > CAPTION_MAX && tipBlock) {
    caption = `${head}${body}\n\n${footer}`;
  }
  // Prefer keeping price+includes over long body if still over limit
  if (caption.length > CAPTION_MAX) {
    caption = `${head}${tipBlock}\n\n${footer}`.slice(0, CAPTION_MAX);
  }
  return caption.slice(0, CAPTION_MAX);
}

async function writeDraft(ev: Geo2goEvent, image: Buffer): Promise<Geo2goDraft | null> {
  const whenLine = formatWhen(ev.startIso, ev.endIso);
  const locationLine = ev.address || ev.location;
  const priceLine = formatPriceLine(ev.tickets);
  const ticketsBlob = ev.tickets.map((t) => `${t.name}=${t.price}`).join("; ") || "нет";
  const raw = await geminiFastJson<{
    skip?: boolean;
    title?: string;
    lead?: string;
    paragraphs?: string[];
    tip?: string;
    includes_ru?: string;
  }>(
    `Ты редактор Telegram @emigro_portugal (русскоязычные в Португалии).
События outdoor Geo2Go (Bussaco / Caramulo / Mortágua — Centro).
Пиши по-русски. Можно 1–2 PT-gloss: слово (перевод).
Не дублируй дату/место/тарифы — их добавим отдельно.
includes_ru: одна плотная фраза «что включено» по фактам INCLUI/ABOUT (сбор, обучение, обед…), без воды.
paragraphs: суть опыта (не прайс). Без Emigro-питча. skip=true если нет даты.`,
    `TITLE: ${ev.title}
WHEN: ${whenLine}
WHERE: ${locationLine}
ORGANIZER: ${ev.organizer}
TICKETS: ${ticketsBlob}
PRICE_LINE_RU_HINT: ${priceLine || "—"}
INCLUI_PT: ${ev.includesPt || "—"}
ABOUT_PT: ${(ev.aboutPt || ev.description).slice(0, 900)}
URL: ${ev.url}

Нужно:
- title до ~90 знаков
- lead — 1 предложение (что это за формат дня)
- paragraphs — 1 абзац про опыт
- includes_ru — что входит в билет
- tip — запись / машина / что взять`,
    SCHEMA,
    2048
  );

  if (!raw || raw.skip) return null;
  const title = (raw.title || "").trim();
  const lead = (raw.lead || "").trim();
  const paragraphs = (raw.paragraphs || []).map((p) => p.trim()).filter(Boolean).slice(0, 2);
  const tip = (raw.tip || "").trim();
  const includesRu = (raw.includes_ru || "").trim() || null;
  if (!title || !lead || paragraphs.length < 1) return null;
  return {
    title,
    lead,
    paragraphs,
    tip,
    includesRu,
    cardLines: factCardLines(ev),
    sourceUrl: ev.url,
    mapsUrl: ev.mapsUrl,
    locationLine,
    organizer: ev.organizer,
    priceLine,
    priceLabel: ev.priceLabel,
    whenLine,
    image,
    eventKey: ev.key,
  };
}

async function publishPhoto(caption: string, image: Buffer): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const form = new FormData();
  form.set("chat_id", GEO2GO_CHANNEL());
  form.set("caption", caption);
  form.set("parse_mode", "HTML");
  form.set("photo", new Blob([new Uint8Array(image)], { type: "image/jpeg" }), "event.jpg");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
  const json = (await res.json()) as { ok?: boolean; description?: string; result?: { message_id?: number } };
  if (!res.ok || json.ok === false) {
    throw new Error(json.description || `sendPhoto HTTP ${res.status}`);
  }
  return json.result?.message_id ?? 0;
}

async function publishEvent(
  ev: Geo2goEvent,
  options?: { dryRun?: boolean }
): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
}> {
  console.log(`[geo2go] try ${ev.startIso} ${ev.title} · ${ev.priceLabel || "?"} · ${ev.location}`);
  if (!ev.imageUrl) {
    console.log(`[geo2go] no image ${ev.url}`);
    return { published: false, reason: "no-image", url: ev.url };
  }
  const photo = await downloadImage(ev.imageUrl);
  if (!photo) {
    console.log(`[geo2go] image download failed ${ev.imageUrl}`);
    return { published: false, reason: "image-download-failed", url: ev.url };
  }
  const draft = await writeDraft(ev, photo);
  if (!draft) {
    console.log(`[geo2go] draft skip ${ev.title}`);
    return { published: false, reason: "draft-skip", url: ev.url };
  }
  const card = await renderCard(draft.image, draft.cardLines);
  const caption = buildCaption(draft);
  if (options?.dryRun) {
    console.log(`[geo2go] dry-run ${draft.title}\n${caption}`);
    return { published: false, reason: "dry-run", title: draft.title, url: ev.url };
  }
  const messageId = await publishPhoto(caption, card);
  remember(ev.key);
  console.log(`[geo2go] published ${messageId} ${draft.title}`);
  return { published: true, messageId, title: draft.title, url: ev.url };
}

export async function runGeo2goEventsChannel(options?: {
  dryRun?: boolean;
  forceUrl?: string;
}): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
}> {
  if (options?.forceUrl) {
    const url = options.forceUrl.trim();
    const ev = await fetchGeo2goEvent(url);
    if (!ev) return { published: false, reason: "force-url-fetch-failed", url };
    return publishEvent(ev, options);
  }

  const seen = loadSeen();
  const events = await loadUpcomingGeo2goEvents(seen);
  console.log(`[geo2go] upcoming unseen ${events.length}`);
  if (events.length === 0) return { published: false, reason: "no-fresh-event" };

  for (const ev of events) {
    const result = await publishEvent(ev, options);
    if (result.published || result.reason === "dry-run") return result;
  }
  return { published: false, reason: "no-draftable-event" };
}
