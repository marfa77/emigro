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

export type Geo2goEvent = {
  key: string;
  slug: string;
  title: string;
  description: string;
  startIso: string;
  endIso: string | null;
  location: string;
  url: string;
  imageUrl: string | null;
  priceHint: string | null;
};

export type Geo2goDraft = {
  title: string;
  lead: string;
  paragraphs: string[];
  tip: string;
  cardLines: string[];
  sourceUrl: string;
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
    card_lines: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["skip", "title", "lead", "paragraphs", "tip", "card_lines"],
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

function stripTags(html: string): string {
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

function parseJsonLdEvent(html: string, fallbackUrl: string): Geo2goEvent | null {
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
        if (locRaw && typeof locRaw === "object") {
          location = String(locRaw.name || "").trim();
          if (!location && locRaw.address) {
            location =
              typeof locRaw.address === "string"
                ? locRaw.address
                : String((locRaw.address as { streetAddress?: string }).streetAddress || "").trim();
          }
        }
        const url = String((node as { url?: string }).url || fallbackUrl).trim() || fallbackUrl;
        const slug = url.split("/").filter(Boolean).pop() || name;
        const imageField = (node as { image?: string | string[] }).image;
        let imageUrl: string | null = null;
        if (typeof imageField === "string") imageUrl = imageField;
        else if (Array.isArray(imageField) && typeof imageField[0] === "string") imageUrl = imageField[0];
        if (!imageUrl) {
          const og =
            html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
            html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
          imageUrl = og?.trim() || null;
        }
        const priceHits = html.match(/€\s?\d[\d.,]*/g) || [];
        const priceHint = priceHits[0]?.replace(/\s+/g, "") || null;
        return {
          key: `geo2go:${slug}`,
          slug,
          title: name,
          description,
          startIso,
          endIso,
          location: location || "Portugal",
          url,
          imageUrl,
          priceHint,
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
  const urls = [
    ...new Set(
      [...html.matchAll(/https:\/\/www\.geo2go\.pt\/event-details\/[a-z0-9\-]+/gi)].map((m) => m[0])
    ),
  ];
  return urls;
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

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function cardSvg(lines: string[]): string {
  const bold = boldFont();
  const face = bold ? `@font-face { font-family: 'CardBold'; src: url('${bold}'); }` : "";
  const boldFamily = bold ? "CardBold" : "DejaVu Sans, Liberation Sans, Arial, sans-serif";
  const y0 = 560;
  const headlines = lines
    .slice(0, 2)
    .map(
      (line, i) =>
        `<text x="48" y="${y0 + i * 48}" font-family="${boldFamily}" font-size="34" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${face}</style>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#062a2e" stop-opacity="0"/>
      <stop offset="45%" stop-color="#062a2e" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#062a2e" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#fade)"/>
  <rect x="0" y="0" width="10" height="800" fill="#1fa8a0"/>
  <text x="48" y="56" font-family="${boldFamily}" font-size="22" fill="#1fa8a0">EMIGRO · EVENTOS</text>
  ${headlines}
  <text x="48" y="760" font-family="${boldFamily}" font-size="16" fill="#c8e6e3">${CHANNEL_URL.replace("https://t.me/", "@")}</text>
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

function buildCaption(draft: Pick<Geo2goDraft, "title" | "lead" | "paragraphs" | "tip" | "sourceUrl">): string {
  const tipBlock = draft.tip ? `\n\nНа практике: ${esc(draft.tip)}` : "";
  const footer = `<a href="${esc(draft.sourceUrl)}">Geo2Go · запись</a>`;
  const head =
    `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n` + `<i>${esc(draft.lead)}</i>\n\n`;
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
  return caption.slice(0, CAPTION_MAX);
}

async function writeDraft(ev: Geo2goEvent, image: Buffer): Promise<Geo2goDraft | null> {
  const when = formatWhen(ev.startIso);
  const raw = await geminiFastJson<{
    skip?: boolean;
    title?: string;
    lead?: string;
    paragraphs?: string[];
    tip?: string;
    card_lines?: string[];
  }>(
    `Ты редактор Telegram @emigro_portugal (русскоязычные в Португалии).
Формат как Porto-канал: title, lead, 1–2 абзаца, tip, card_lines.
События outdoor Geo2Go (Bussaco / Caramulo / Mortágua — Centro, не Lisboa и не центр Porto).
Пиши конкретно место. Можно 1–2 PT-gloss: слово (перевод). Только факты из входа. Без Emigro-питча и эмодзи.
skip=true если нет даты или это не событие.`,
    `TITLE: ${ev.title}
WHEN: ${when} (Europe/Lisbon)
WHERE: ${ev.location}
PRICE_HINT: ${ev.priceHint || "не указана на странице"}
DESC: ${ev.description.slice(0, 600)}
URL: ${ev.url}

Нужно:
- title по-русски до ~90 знаков
- lead — 1 предложение
- paragraphs — 1–2 абзаца
- tip — одна практика (запись / дорога / что взять)
- card_lines — 2 строки до ~28 символов (дата·место / суть)`,
    SCHEMA,
    2048
  );

  if (!raw || raw.skip) return null;
  const title = (raw.title || "").trim();
  const lead = (raw.lead || "").trim();
  const paragraphs = (raw.paragraphs || []).map((p) => p.trim()).filter(Boolean).slice(0, 3);
  const tip = (raw.tip || "").trim();
  const cardLines = (raw.card_lines || []).map((l) => l.trim()).filter(Boolean).slice(0, 2);
  if (!title || !lead || paragraphs.length < 1 || cardLines.length < 1) return null;
  return {
    title,
    lead,
    paragraphs,
    tip,
    cardLines,
    sourceUrl: ev.url,
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

export async function runGeo2goEventsChannel(options?: { dryRun?: boolean }): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
}> {
  const seen = loadSeen();
  const events = await loadUpcomingGeo2goEvents(seen);
  console.log(`[geo2go] upcoming unseen ${events.length}`);
  if (events.length === 0) return { published: false, reason: "no-fresh-event" };

  for (const ev of events) {
    console.log(`[geo2go] try ${ev.startIso} ${ev.title}`);
    if (!ev.imageUrl) {
      console.log(`[geo2go] no image ${ev.url}`);
      continue;
    }
    const photo = await downloadImage(ev.imageUrl);
    if (!photo) {
      console.log(`[geo2go] image download failed ${ev.imageUrl}`);
      continue;
    }
    const draft = await writeDraft(ev, photo);
    if (!draft) {
      console.log(`[geo2go] draft skip ${ev.title}`);
      continue;
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
  return { published: false, reason: "no-draftable-event" };
}
