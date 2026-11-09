import { existsSync } from "node:fs";
import sharp from "sharp";
import { geminiFastJson } from "@/lib/news/gemini";
import type { OutdoorDraft, OutdoorEvent } from "@/lib/news/outdoor/types";
import { captionThemeHint } from "@/lib/news/outdoor/themes";
import { downloadImage, formatPriceLine } from "@/lib/news/outdoor/util";

export const OUTDOOR_CHANNEL = () =>
  (process.env.EMIGRO_PORTUGAL_NEWS_CHANNEL || "@emigro_portugal").trim();

const CHANNEL_URL = "https://t.me/emigro_portugal";
const CALENDAR_URL = "https://porto.emigro.online/calendar";
const CAPTION_MAX = 1024;

export async function calendarPageIsLive(): Promise<boolean> {
  try {
    const res = await fetch(CALENDAR_URL, { method: "GET", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

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
  if (/00:00|23:59/.test(t0) && !endIso) return day;
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

function usefulDetail(text: string | null | undefined): boolean {
  const t = (text || "").trim();
  if (t.length < 4) return false;
  return !/^(нет|пусто|—|-|ничего|не указан|вход на)|ничего особенного/i.test(t);
}

function oneLine(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

const GLOSS_SRC = "\\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\\-]{1,40})\\s*\\(([А-Яа-яЁё][^)]{0,28})\\)";

/** palavra (перевод) → italic PT + gloss. Reverse «русский (pt)» is ignored. */
function glossHtml(text: string): string {
  return esc(text).replace(new RegExp(GLOSS_SRC, "g"), "<i>$1</i> ($2)");
}

function glossCount(text: string): number {
  return (text.match(new RegExp(GLOSS_SRC, "g")) || []).length;
}

export function buildOutdoorCaption(draft: OutdoorDraft, options?: { mentionSite?: boolean }): string {
  const footer =
    `<a href="${esc(draft.mapsUrl)}">Карта</a> · ` +
    `<a href="${esc(draft.sourceUrl)}">Запись и оплата</a>`;
  const site = options?.mentionSite
    ? `\n\nЕщё события Порту и севера — <a href="${CALENDAR_URL}">в календаре</a>`
    : "";
  const facts = [
    `📅 ${esc(draft.whenLine)}`,
    `📍 <a href="${esc(draft.mapsUrl)}">${esc(draft.locationLine)}</a>`,
    draft.priceLine ? `💶 ${esc(draft.priceLine)}` : null,
    draft.organizer ? `👤 ${esc(draft.organizer)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const extra = [
    usefulDetail(draft.includesRu) ? `<b>В цене:</b> ${glossHtml(oneLine(draft.includesRu || "", 180))}` : "",
    usefulDetail(draft.bring) ? `<b>С собой:</b> ${glossHtml(oneLine(draft.bring, 160))}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const leadLimits = [520, 380, 240];
  let caption = "";
  for (const max of leadLimits) {
    const story = draft.lead.trim() ? glossHtml(oneLine(draft.lead, max)) : "";
    caption = `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>${story ? `\n\n${story}` : ""}\n\n${facts}${extra ? `\n${extra}` : ""}\n\n${footer}${site}`;
    if (caption.length <= CAPTION_MAX) return caption;
  }
  return caption.slice(0, CAPTION_MAX);
}

export async function writeOutdoorDraft(
  ev: OutdoorEvent,
  image: Buffer
): Promise<OutdoorDraft | null> {
  const whenLine = formatWhen(ev.startIso, ev.endIso);
  const locationLine = ev.location || ev.address || "";
  const priceLine = formatPriceLine(ev.tickets) || (ev.priceLabel ? ev.priceLabel : null);
  const about = (ev.aboutPt || ev.description || "").trim();
  if (about.length < 80) {
    return {
      title: ev.title,
      lead: "",
      who: "",
      outcome: "",
      bring: "",
      includesRu: null,
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
    `Ты пишешь пост в @emigro_portugal так, будто зовёшь друга провести этот вечер или выходной. Тепло, конкретно, приятно читать. Не брошюра и не реклама.
Канал ещё и учит португальский. ${captionThemeHint(ev, "pt")}
Португальское слово снаружи, русский перевод в скобках.
Плохо: «гриб (cogumelo)», «пообедаете (almoço)».
Число совпадает: не «cogumelo (грибов)». Не начинай поле словом «включено».
lead — это весь рассказ. who и outcome короткие, их в пост отдельно не ставим.
Не переводи целое предложение.
Правило глосс выше (4–6 и список слов темы) не действует: здесь 2–4 глоссы, и только слова из TITLE или ABOUT.
Не выдумывай очередь, прогулку после, километры, вкус и вид.
Без «погрузитесь», «уникальный», «незабываемый», «атмосфер», «прекрасный повод», «отличный повод», «привет», «как насчёт», «представь», «давай сходим».
Первая фраза — что это за событие. Не вопрос и не приветствие.
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
- lead: 2–3 фразы, до 420 знаков. Что это за выход и чем он хорош. Только факты со страницы. Если фактов мало — две фразы, без дописывания
- who: кому зайдёт, 1 короткая фраза, или пусто
- outcome: что будет к концу, 1 короткая фраза, или пусто
- includes_ru: что входит в цену; пусто если на странице нет
- bring: что взять; пусто если на странице нет
Глоссы: 2–4 штуки, и только португальские слова, которые уже есть в TITLE или ABOUT. Не придумывай слово ради скобок.`,
    SCHEMA,
    4096,
    { thinkingBudget: 0 }
  );

  if (!raw || raw.skip) return null;
  const title = (raw.title || "").trim();
  let lead = (raw.lead || "").trim();
  if (/^(привет|как насч[её]т|представь|друзья)/i.test(lead)) {
    lead = lead.replace(/^(привет[!.,\s]*)/i, "").replace(/^(как насч[её]т[^?]{0,80}\?\s*)/i, "").trim();
  }
  const who = (raw.who || "").trim();
  const outcome = (raw.outcome || "").trim();
  const bring = (raw.bring || "").trim();
  const includesRu = (raw.includes_ru || "").trim() || null;
  const blob = [lead, who, outcome, bring, includesRu || ""].join(" ");
  const glosses = glossCount(blob);
  if (!title || !lead) return null;
  if (/[А-Яа-яЁё][А-Яа-яЁё\-]{2,}\s*\([A-Za-zÀ-ÿ]/.test(blob)) {
    console.log(`[outdoor] reversed gloss — ${title}`);
    return null;
  }
  if (glosses < 2) {
    console.log(`[outdoor] few glosses (${glosses}) — ${title}`);
    return null;
  }
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
