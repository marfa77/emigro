import { existsSync } from "node:fs";
import sharp from "sharp";
import { geminiFastJson } from "@/lib/news/gemini";
import type { OutdoorDraft, OutdoorEvent } from "@/lib/news/outdoor/types";
import { downloadImage, formatPriceLine } from "@/lib/news/outdoor/util";

export const OUTDOOR_CHANNEL = () =>
  (process.env.EMIGRO_PORTUGAL_NEWS_CHANNEL || "@emigro_portugal").trim();

const CHANNEL_URL = "https://t.me/emigro_portugal";
const CAPTION_MAX = 1024;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    skip: { type: "BOOLEAN" },
    title: { type: "STRING" },
    lead: { type: "STRING" },
    who: { type: "STRING" },
    outcome: { type: "STRING" },
    bring: { type: "STRING" },
    includes_ru: { type: "STRING" },
  },
  required: ["skip", "title", "lead", "who", "outcome", "bring", "includes_ru"],
};

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

export function formatWhen(iso: string, endIso?: string | null): string {
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

export function factCardLines(ev: OutdoorEvent): string[] {
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

export async function renderOutdoorCard(photo: Buffer, cardLines: string[]): Promise<Buffer> {
  const base = await sharp(photo)
    .rotate()
    .resize(800, 800, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.94, saturation: 0.95 })
    .jpeg()
    .toBuffer();
  const overlay = await sharp(Buffer.from(cardSvg(cardLines))).png().toBuffer();
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 88 }).toBuffer();
}

function oneLine(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export function buildOutdoorCaption(draft: OutdoorDraft): string {
  const footer =
    `<a href="${esc(draft.mapsUrl)}">Карта</a> · ` +
    `<a href="${esc(draft.sourceUrl)}">Запись и оплата</a>`;
  const facts = [
    `📅 ${esc(draft.whenLine)}`,
    `📍 <a href="${esc(draft.mapsUrl)}">${esc(draft.locationLine)}</a>`,
    `👤 ${esc(draft.organizer)}`,
    draft.priceLine ? `💶 ${esc(draft.priceLine)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const brief = [
    draft.who ? `<b>Кому:</b> ${esc(oneLine(draft.who, 180))}` : null,
    draft.outcome ? `<b>На выходе:</b> ${esc(oneLine(draft.outcome, 220))}` : null,
    draft.includesRu ? `<b>Включено:</b> ${esc(oneLine(draft.includesRu, 220))}` : null,
    draft.bring ? `<b>Взять:</b> ${esc(oneLine(draft.bring, 160))}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const head =
    `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n` +
    `${esc(oneLine(draft.lead, 180))}\n\n` +
    `${facts}\n\n`;
  let caption = `${head}${brief}\n\n${footer}`;
  if (caption.length > CAPTION_MAX) {
    const short = [
      draft.who ? `<b>Кому:</b> ${esc(oneLine(draft.who, 120))}` : null,
      draft.outcome ? `<b>На выходе:</b> ${esc(oneLine(draft.outcome, 140))}` : null,
      draft.includesRu ? `<b>Включено:</b> ${esc(oneLine(draft.includesRu, 140))}` : null,
      draft.bring ? `<b>Взять:</b> ${esc(oneLine(draft.bring, 100))}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    caption = `${head}${short}\n\n${footer}`;
  }
  if (caption.length > CAPTION_MAX) {
    caption = `${head}${footer}`;
  }
  return caption.slice(0, CAPTION_MAX);
}

export async function writeOutdoorDraft(
  ev: OutdoorEvent,
  image: Buffer
): Promise<OutdoorDraft | null> {
  const whenLine = formatWhen(ev.startIso, ev.endIso);
  const locationLine = ev.address || ev.location;
  const priceLine = formatPriceLine(ev.tickets) || (ev.priceLabel ? ev.priceLabel : null);
  const ticketsBlob = ev.tickets.map((t) => `${t.name}=${t.price}`).join("; ") || "нет";
  const raw = await geminiFastJson<{
    skip?: boolean;
    title?: string;
    lead?: string;
    who?: string;
    outcome?: string;
    bring?: string;
    includes_ru?: string;
  }>(
    `Ты пишешь пост в @emigro_portugal так, будто сам уже сходил и кидаешь друзьям в чат: коротко, по делу, без брошюры.
Русский. Можно 1 PT-слово с переводом в скобках, если оно реально на странице.
Не выдумывай километры, сложность, обед и страховку — только если это есть во входе. Если факта нет, поле короткое и честное («гид на маршруте» / «уточняется на странице записи»).
Дата, место, цена и ссылки добавим сами — не повторяй их.
skip=true только если это не живое событие.`,
    `SOURCE: ${ev.sourceId}
TITLE: ${ev.title}
WHEN: ${whenLine}
WHERE: ${locationLine}
ORGANIZER: ${ev.organizer}
TICKETS: ${ticketsBlob}
PRICE: ${ev.priceLabel || "—"}
INCLUI_PT: ${ev.includesPt || "—"}
ABOUT_PT: ${(ev.aboutPt || ev.description).slice(0, 1100)}

Поля:
- title: до 70 знаков, суть + место
- lead: зачем ехать, 1 фраза, без «погрузитесь»
- who: кому зайдёт (новичок / семья / кто уже ходит / возраст), 1 фраза
- outcome: что человек получит к концу (вид, навык, еда, маршрут) — конкретно
- includes_ru: что входит в цену; пусто если на странице нет
- bring: что взять (обувь, вода, слои, наличные) под этот формат`,
    SCHEMA,
    2048
  );

  if (!raw || raw.skip) return null;
  const title = (raw.title || "").trim();
  const lead = (raw.lead || "").trim();
  const who = (raw.who || "").trim();
  const outcome = (raw.outcome || "").trim();
  const bring = (raw.bring || "").trim();
  const includesRu = (raw.includes_ru || "").trim() || null;
  if (!title || !lead || !who || !outcome) return null;
  return {
    title,
    lead,
    who,
    outcome,
    bring,
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
    sourceId: ev.sourceId,
  };
}

export async function publishOutdoorPhoto(caption: string, image: Buffer): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const form = new FormData();
  form.set("chat_id", OUTDOOR_CHANNEL());
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

export async function materializeEvent(ev: OutdoorEvent): Promise<OutdoorDraft | null> {
  if (!ev.imageUrl) return null;
  const photo = await downloadImage(ev.imageUrl);
  if (!photo) return null;
  return writeOutdoorDraft(ev, photo);
}
