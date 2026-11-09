/**
 * @milan_echat — education for parents, Lepta voice and card.
 * Official first: public @Miur_Social. Orizzonte Scuola only when the headline
 * is about families (enrollment, nido, benefits), not teacher careers.
 * Auto-publishes at most one new post per run. Does not touch @Emigro_news.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { geminiFastJson } from "@/lib/news/gemini";

const CHANNEL = () => (process.env.EMIGRO_ITALY_NEWS_CHANNEL || "@milan_echat").trim();
const CAPTION_MAX = 1024;
const MAX_AGE_MS = 72 * 60 * 60 * 1000;
const UA = "Mozilla/5.0 (compatible; EmigroNewsBot/1.0; +https://www.emigro.online)";

const PARENT =
  /iscrizion|nido|asilo|infanzia|mensa|trasporto|bonus|isee|dote scuola|unica|calendario|esame di stato|maturit|vaccin|contributo|retta|borsa di studio|ascolta|psicolog|libri di testo|cedola|dispersione|diritto allo studio|scuola dell'infanzia|scuola primaria|secondaria/i;
const SKIP =
  /personale ata|\bata\b|docenti|supplenz|concorso|mobilit[aà]|interpell|cerimonia|inauguraz|summit|ministro incontra|coordinatori regionali|giornata mondiale|permessi 150/i;

const SEEDED = [
  "tg:Miur_Social/5555",
  "https://www.mim.gov.it/web/guest/-/scuola-dal-15-ottobre-attivo-per-l-a-s-2026-2027-ascoltami-il-servizio-per-il-supporto-psicologico-degli-studenti",
];

type Item = {
  key: string;
  title: string;
  text: string;
  link: string;
  imageUrl: string | null;
  pubMs: number;
};

const SCHEMA = {
  type: "OBJECT",
  properties: {
    skip: { type: "BOOLEAN" },
    title: { type: "STRING" },
    lead: { type: "STRING" },
    paragraphs: { type: "ARRAY", items: { type: "STRING" } },
    card_lines: { type: "ARRAY", items: { type: "STRING" } },
    vocab: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { it: { type: "STRING" }, ru: { type: "STRING" } },
        required: ["it", "ru"],
      },
    },
  },
  required: ["skip", "title", "lead", "paragraphs", "card_lines", "vocab"],
};

function seenPath(): string {
  return resolve(process.cwd(), "deploy/italy-education/state/seen.json");
}

function loadSeen(): Set<string> {
  const urls = new Set(SEEDED);
  const path = seenPath();
  if (!existsSync(path)) return urls;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      for (const item of parsed) if (typeof item === "string") urls.add(item);
    }
  } catch {
    /* fresh state */
  }
  return urls;
}

function remember(keys: string[]): void {
  const path = seenPath();
  mkdirSync(dirname(path), { recursive: true });
  const prev = existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as unknown) : [];
  const list = Array.isArray(prev) ? prev.filter((x): x is string => typeof x === "string") : [];
  writeFileSync(path, JSON.stringify([...list, ...keys].slice(-500), null, 2));
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

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "*/*" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function decode(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function parentFit(text: string): boolean {
  if (!PARENT.test(text)) return false;
  if (SKIP.test(text)) return false;
  return true;
}

async function fetchMiur(): Promise<Item[]> {
  const html = await fetchText("https://t.me/s/Miur_Social");
  if (!html) return [];
  const chunks = html.split(/(?=<div class="tgme_widget_message_wrap)/);
  const items: Item[] = [];
  for (const chunk of chunks) {
    const id = chunk.match(/data-post="Miur_Social\/(\d+)"/)?.[1];
    const raw = chunk.match(/class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    if (!id || !raw) continue;
    const text = decode(raw);
    const dt = chunk.match(/datetime="([^"]+)"/)?.[1];
    const pubMs = dt ? Date.parse(dt) : Date.now();
    if (!Number.isFinite(pubMs) || Date.now() - pubMs > MAX_AGE_MS) continue;
    const links = Array.from(raw.matchAll(/href="(https?:\/\/[^"]+)"/g), (m) => m[1]).filter(
      (href) => !/t\.me\//i.test(href)
    );
    const image = chunk.match(/tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)/)?.[1] ?? null;
    items.push({
      key: `tg:Miur_Social/${id}`,
      title: text.split("\n")[0]?.slice(0, 140) || "MIM",
      text,
      link: links[0] || `https://t.me/Miur_Social/${id}`,
      imageUrl: image,
      pubMs,
    });
  }
  return items.sort((a, b) => b.pubMs - a.pubMs);
}

async function fetchOrizzonte(): Promise<Item[]> {
  const xmlText = await fetchText("https://www.orizzontescuola.it/feed/");
  if (!xmlText) return [];
  const Parser = (await import("rss-parser")).default;
  const feed = await new Parser({ timeout: 20_000 }).parseString(xmlText);
  const items: Item[] = [];
  for (const item of feed.items ?? []) {
    const link = item.link?.trim();
    const title = item.title?.trim();
    if (!link || !title) continue;
    const pubMs = item.pubDate ? Date.parse(item.pubDate) : Date.now();
    if (!Number.isFinite(pubMs) || Date.now() - pubMs > MAX_AGE_MS) continue;
    const snippet = `${title}\n${item.contentSnippet || ""}`.slice(0, 800);
    if (!parentFit(snippet)) continue;
    items.push({
      key: link,
      title,
      text: snippet,
      link,
      imageUrl: null,
      pubMs,
    });
  }
  return items;
}

async function downloadImage(url: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 4000 ? buf : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function cardSvg(lines: string[]): string {
  const bold = fontFile([
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  ]);
  const script = fontFile([
    "/System/Library/Fonts/Supplemental/SnellRoundhand.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
    "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
  ]);
  const face = [
    bold ? `@font-face { font-family:'CardBold'; src: url('${bold}'); }` : "",
    script ? `@font-face { font-family:'CardScript'; src: url('${script}'); }` : "",
  ].join("");
  const boldFamily = bold ? "CardBold" : "DejaVu Sans, Liberation Sans, Arial, sans-serif";
  const scriptFamily = script ? "CardScript" : "Georgia, 'DejaVu Serif', serif";
  const headlines = lines
    .slice(0, 2)
    .map(
      (line, i) =>
        `<text x="32" y="${500 + i * 64}" font-family="${boldFamily}" font-size="48" fill="#ffffff">${xml(line)}</text>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs><style>${face}</style></defs>
  <rect x="0" y="330" width="800" height="470" fill="#071630"/>
  <text x="28" y="72" font-family="${scriptFamily}" font-size="48" fill="#ffffff">Emigro</text>
  ${headlines}
  <text x="32" y="762" font-family="${boldFamily}" font-size="15" fill="#ffffff">РЕАКЦИЯ</text>
  <polygon points="128,746 122,756 128,756 120,768 134,755 128,755" fill="#ffd60a"/>
  <text x="140" y="762" font-family="${boldFamily}" font-size="15" fill="#ffffff">= ТЕМА ИНТЕРЕСНАЯ И ВАЖНАЯ</text>
  <text x="776" y="762" text-anchor="end" font-family="${boldFamily}" font-size="16" fill="#ffffff">@milan_echat</text>
</svg>`;
}

async function renderCard(photo: Buffer, lines: string[]): Promise<Buffer> {
  const base = await sharp(photo).rotate().resize(800, 800, { fit: "cover", position: "centre" }).jpeg().toBuffer();
  const overlay = await sharp(Buffer.from(cardSvg(lines))).png().toBuffer();
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 88 }).toBuffer();
}

function buildCaption(draft: {
  title: string;
  lead: string;
  paragraphs: string[];
  vocab: Array<{ it: string; ru: string }>;
  sourceUrl: string;
}): string {
  const vocab = draft.vocab
    .slice(0, 3)
    .map((row) => `${esc(row.it)} — ${esc(row.ru)}`)
    .join("\n");
  const footer =
    `<blockquote>${vocab}</blockquote>\n\n` +
    `<a href="${esc(draft.sourceUrl)}">©</a>`;
  const head = `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n<i>${esc(draft.lead)}</i>\n\n`;
  const paras = [...draft.paragraphs];
  let caption = `${head}${paras.map(esc).join("\n\n")}\n\n${footer}`;
  while (caption.length > CAPTION_MAX && paras.length > 1) {
    paras.pop();
    caption = `${head}${paras.map(esc).join("\n\n")}\n\n${footer}`;
  }
  return caption.slice(0, CAPTION_MAX);
}

async function writeDraft(item: Item): Promise<{
  title: string;
  lead: string;
  paragraphs: string[];
  cardLines: string[];
  vocab: Array<{ it: string; ru: string }>;
  sourceUrl: string;
} | null> {
  const raw = await geminiFastJson<{
    skip: boolean;
    title: string;
    lead: string;
    paragraphs: string[];
    card_lines: string[];
    vocab: Array<{ it: string; ru: string }>;
  }>(
    `Ты пишешь в чат @milan_echat про образование в Италии. Голос как у городской газеты Lépta: спокойно, связно, без рубрик «что изменилось / кого касается». Не зови подписаться на канал.
Аудитория — родители. Университеты упоминай только если это суть новости.
Пиши только факты из текста источника. Не добавляй документы, суммы, даты и шаги, которых в тексте нет. Если их нет — одной фразой скажи, что источник их не назвал.
Заголовок без точки. Лид курсивом по смыслу, 1–2 предложения. 2 коротких абзаца.
card_lines: ровно 2 строки ЗАГЛАВНЫМИ по-русски, каждая до 18 символов, для плашки на фото.
vocab: 3 пары, два существительных с артиклем и один глагол в инфинитиве.
skip=true, если это церемония, встреча министра, новость для учителей (ATA, конкурс, замещение) или нет практической пользы для семьи.
Без эмодзи и хештегов.`,
    item.text.slice(0, 3500),
    SCHEMA,
    2200
  );
  if (raw.skip) return null;
  const title = raw.title.replace(/\s+/g, " ").trim();
  const lead = raw.lead.replace(/\s+/g, " ").trim();
  const paragraphs = (raw.paragraphs ?? []).map((p) => p.replace(/\s+/g, " ").trim()).filter((p) => p.length > 30);
  const cardLines = (raw.card_lines ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim().toUpperCase())
    .filter((line) => line.length > 0 && line.length <= 22)
    .slice(0, 2);
  const vocab = (raw.vocab ?? []).filter((row) => row.it && row.ru).slice(0, 3);
  if (!title || !lead || paragraphs.length === 0 || cardLines.length < 2 || vocab.length < 3) return null;
  return { title, lead, paragraphs, cardLines, vocab, sourceUrl: item.link };
}

async function publishPhoto(caption: string, image: Buffer): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const form = new FormData();
  form.set("chat_id", CHANNEL());
  form.set("caption", caption);
  form.set("parse_mode", "HTML");
  form.set("photo", new Blob([new Uint8Array(image)], { type: "image/jpeg" }), "og.jpg");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
  const json = (await res.json()) as { ok?: boolean; description?: string; result?: { message_id?: number } };
  if (!res.ok || json.ok === false) throw new Error(json.description || `sendPhoto HTTP ${res.status}`);
  return json.result?.message_id ?? 0;
}

export async function runItalyEducationChannel(options?: { dryRun?: boolean }): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
}> {
  const seen = loadSeen();
  const pool = [...(await fetchMiur()), ...(await fetchOrizzonte())].sort((a, b) => b.pubMs - a.pubMs);
  console.log(`[italy-edu] candidates ${pool.length}`);
  for (const item of pool) {
    if (seen.has(item.key) || seen.has(item.link)) continue;
    if (!parentFit(`${item.title}\n${item.text}`)) {
      console.log(`[italy-edu] not for parents ${item.key}`);
      continue;
    }
    if (!item.imageUrl) {
      console.log(`[italy-edu] no photo ${item.key}`);
      continue;
    }
    const photo = await downloadImage(item.imageUrl);
    if (!photo) continue;
    let draft: Awaited<ReturnType<typeof writeDraft>>;
    try {
      draft = await writeDraft(item);
    } catch (e) {
      console.warn(`[italy-edu] draft failed ${item.key}:`, e instanceof Error ? e.message : e);
      continue;
    }
    if (!draft) {
      console.log(`[italy-edu] model skip ${item.key}`);
      continue;
    }
    const card = await renderCard(photo, draft.cardLines);
    const caption = buildCaption(draft);
    if (caption.length > CAPTION_MAX) return { published: false, reason: "caption-too-long", title: draft.title };
    if (options?.dryRun) {
      console.log(`[italy-edu] dry-run ${draft.title}\n${caption}`);
      return { published: false, reason: "dry-run", title: draft.title };
    }
    const messageId = await publishPhoto(caption, card);
    remember([item.key, item.link]);
    console.log(`[italy-edu] published ${messageId} ${draft.title}`);
    return { published: true, messageId, title: draft.title };
  }
  return { published: false, reason: "no-fresh-story" };
}
