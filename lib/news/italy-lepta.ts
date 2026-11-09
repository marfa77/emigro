/**
 * @milan_echat — Lepta-style Italy posts.
 * Prefer diverse, useful, evergreen life stories over flash street drama.
 * One story, square card, caption ≤1024. Does not publish to @Emigro_news.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { audienceInterestGate } from "@/lib/news/audience-gatekeeper";
import { geminiFastJson } from "@/lib/news/gemini";

export const ITALY_LEPTA_CHANNEL = () =>
  (process.env.EMIGRO_ITALY_NEWS_CHANNEL || "@milan_echat").trim();
const CAPTION_MAX = 1024;
/** Breaking windows stay short; culture/useful pieces can be a bit older. */
const MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

const FEEDS = [
  "https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml",
  "https://www.ansa.it/sito/notizie/economia/economia_rss.xml",
  "https://www.corriere.it/rss/cultura.xml",
  "https://www.corriere.it/rss/economia.xml",
  "https://www.repubblica.it/rss/cultura/rss2.0.xml",
  "https://www.repubblica.it/rss/economia/rss2.0.xml",
  "https://www.ilsole24ore.com/rss/italia.xml",
  "https://www.corriere.it/rss/homepage.xml",
  "https://www.repubblica.it/rss/homepage/rss2.0.xml",
];

/** Already on the channel / rejected themes — do not republish. */
const SEEDED_URLS = [
  "https://www.ansa.it/sito/notizie/cronaca/2026/10/19/il-movimento-17-ottobre-annuncia-mobilitazione-permanente-meloni-convoca-un-vertice_0d0d286f-7f8f-420a-9737-2566da0ba8a2.html",
  "https://www.ansa.it/sito/notizie/cronaca/2026/10/19/paura-di-nuovi-disordini-a-milano-chiudono-i-negozi-del-lusso_0d0d286f-7f8f-420a-9737-2566da0ba8a2.html",
  "https://www.ansa.it/sito/notizie/topnews/2026/10/19/presidio-centrodestra-a-milano-momenti-di-tensione-con-alcuni-giovani_f48c88b5-5fa8-4d0c-83b4-50cc493a8c37.html",
];

/** Flash street drama, protest heat, crime spectacle — never. */
const SKIP_STORY =
  /disordin|scontr[oi]|devastaz|sacchegg|guerriglia|rivolt|sommoss|tensione con|momenti di tensione|presidio|corteo|manifestaz|moviment[oa] 17|negozi del lusso|paura di nuov|feriti\b.*poliz|arrestat[oi].*\d{2,}|minori arrest|piazza duomo|assalto ai negozi|omicid|rapina|femminicid|agguato|sparatoria|stupro|cadavere|mort[oa] ammazzat|baby gang|teppist|vandali|flash mob di protesta|vertice di sicurezza|meloni convoca|sciopero generale|occupano l['’ ]?aeroporto|uniamo le lotte|blocco stradale|presidio permanente/i;

/** Emigrant / relocant life — highest priority (docs, tax, housing, education…). */
const EMIGRANT_PRIORITY =
  /permesso di soggiorno|questura|codice fiscale|spid|anagrafe|carta d'identit|passaport|isee|assegno|bonus|tassa|imu|iva|bollett|affitt|mutuo|immobil|canone|locazioni|contratto di locazione|cauzione|stipend|lavoro|partita iva|treno|metro|aeroporto|volo|sciopero|traffico|tangenziale|ztl|parchegg|scuola|asilo|nido|materna|universit|iscrizion|immatricolaz|tasse universit|diritto allo studio|esame|matur|quanto costa|prezz[oi]|inflazion|sanit[aà]|ospedale|ospedali|pronto soccorso|farmacia|medico|medici|asl|ticket sanit|ricetta|mutua|assicurazione sanit|assicurazione malattia|campagna di vaccin|vaccin|screening|visita medica|legge sanit|ssn|servizio sanitario/i;

/** Soft prefer — life, curiosity, useful rules (Lépta mix). */
const PREFER_STORY =
  /affitt|mutuo|immobil|canone|locazioni|prezz[oi]|bollett|inflazion|stipend|lavoro|treno|metro|aeroporto|volo|sciopero|traffico|tangenziale|ztl|parchegg|bike|monopattin|meteo|maltempo|neve|caldo|alluvion|festival|mostra|museo|teatro|concerto|ricetta|cibo|ristorant|vino|olio|turismo|vacanz|spiaggia|montagna|sanit[aà]|ospedale|farmacia|medico|scuola|asilo|nido|materna|universit|esame|isee|assegno|bonus|tassa|imu|iva|carta d'identit|passaport|anagrafe|permesso|regola|curiosit|come funziona|quanto costa|abitudin|tradizion/i;

/** Wars / foreign politics — audience does not care. */
const GEOPOLITICS =
  /ucraina|russia|putin|zelensk|trump|nato|gaza|israel|hamas|cina|taiwan|brics|casa bianca|stati uniti|guerra (in|contro)|corea del nord|geopolit/i;

/** Dry sports — scores/tables/kickoffs. Organic sport (tifosi, stadium, club story) is allowed. */
const SPORT_DULL =
  /classifica (serie|della)|risultato finale|giornata \d+|live scoring|tabellino|\d+\s*[-–]\s*\d+\s*(gol|reti)|formazione ufficiale|cronaca della partita|diretta.*serie a/i;

const SPORT_ORGANIC =
  /tifos[io]|curva|stadio|san siro|olimpico|trasferimento|colpo di mercato|leggenda|derby|bigliett|museo del calcio|inno|maglia|società sportiva|atmosfera.*stadio|festa scudetto|promozione.*città/i;

/** Thin ceremony / award noise — ok rarely, never preferred. */
const SOFT_SKIP =
  /premio letterario|concorso letterario|cerimonia di premiazione|oscar|sanremo|gf vip|grande fratello|ballando|isola dei famosi/i;

const GENERIC_FLUFF =
  /come risolvere|tutto quello che|guida completa|opinione|editoriale|riflessione|il futuro (di|del|della)|in generale|tendenze/i;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const RECENT_THEME_KEEP = 10;
const CANDIDATE_SCAN = 28;

type FeedItem = { title: string; link: string; pubDate: string; snippet: string };

export type ItalyLeptaDraft = {
  title: string;
  lead: string;
  paragraphs: string[];
  tip: string;
  cardLines: string[];
  vocab: Array<{ it: string; ru: string }>;
  sourceUrl: string;
  image: Buffer;
  themeKey: string;
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
    vocab: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          it: { type: "STRING" },
          ru: { type: "STRING" },
        },
        required: ["it", "ru"],
      },
    },
  },
  required: ["skip", "title", "lead", "paragraphs", "tip", "card_lines", "vocab"],
};

function seenPath(): string {
  return resolve(process.cwd(), "deploy/italy-lepta/state/seen.json");
}

function themesPath(): string {
  return resolve(process.cwd(), "deploy/italy-lepta/state/recent-themes.json");
}

function loadSeen(): Set<string> {
  const path = seenPath();
  const urls = new Set(SEEDED_URLS.map(normalizeUrl));
  if (!existsSync(path)) return urls;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (typeof item === "string") urls.add(normalizeUrl(item));
      }
    }
  } catch {
    /* empty state is fine */
  }
  return urls;
}

function loadRecentThemes(): string[] {
  const path = themesPath();
  if (!existsSync(path)) {
    // Seed with Milan disorder cluster so the next posts cannot repeat it.
    return ["milano-disordini", "milano-protesta"];
  }
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string").slice(-RECENT_THEME_KEEP);
    }
  } catch {
    /* fresh */
  }
  return [];
}

function markSeen(url: string): void {
  const path = seenPath();
  mkdirSync(dirname(path), { recursive: true });
  const prev = existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as unknown) : [];
  const list = Array.isArray(prev) ? prev.filter((x): x is string => typeof x === "string") : [];
  const key = normalizeUrl(url);
  if (!list.some((item) => normalizeUrl(item) === key)) list.push(key);
  writeFileSync(path, JSON.stringify(list.slice(-400), null, 2));
}

function remember(url: string, theme: string): void {
  markSeen(url);
  const themes = loadRecentThemes();
  if (themes[themes.length - 1] !== theme) themes.push(theme);
  writeFileSync(themesPath(), JSON.stringify(themes.slice(-RECENT_THEME_KEEP), null, 2));
}

function topicOf(text: string): string {
  const t = text.toLowerCase();
  if (/disordin|scontr|protest|corteo|presidio|manifest|guerriglia|rivolt|devastaz/.test(t)) {
    return "disordini";
  }
  if (/omicid|rapin|arrest|furto|droga|mafia|camorra|sparatoria/.test(t)) return "cronaca-nera";
  if (/meteo|maltempo|neve|alluvion|caldo|temporale/.test(t)) return "meteo";
  if (/treno|metro|atm|atac|aeroporto|volo|sciopero|traffico|tangenziale|ztl|parchegg/.test(t)) {
    return "trasporti";
  }
  if (/affitt|mutuo|immobil|canone|affitti|prezzi delle case|mercato immobil|locazioni/.test(t)) {
    return "casa";
  }
  if (/sanit[aà]|ospedale|farmacia|medico|vaccin|asl|ticket sanit|ricetta|mutua|assicurazione|screening|pronto soccorso|ssn/.test(t))
    return "salute";
  if (/scuola|asilo|nido|materna|universit|iscrizion|immatricolaz|esame|matur|tasse universit|diritto allo studio/.test(t))
    return "scuola";
  if (/festival|mostra|museo|teatro|concerto|libro|cinema|arte/.test(t)) return "cultura";
  if (/cibo|ricetta|ristorant|vino|olio|pizza|caff/.test(t)) return "cibo";
  if (/turismo|vacanz|spiaggia|montagna|viaggio/.test(t)) return "viaggi";
  if (/prezz|bollett|inflazion|stipend|lavoro|tassa|imu|iva|isee|bonus|assegno/.test(t)) {
    return "soldi";
  }
  if (/politic|governo|meloni|parlamento|elezion|partito/.test(t)) return "politica";
  if (/curiosit|perch[eé]|come funziona|storia di|invent/.test(t)) return "curiosita";
  if (/calcio|serie a|tifos|stadio|juventus|inter|milan|napoli|roma|lazio|derby|trasferimento/.test(t)) {
    return "sport";
  }
  return "altro";
}

function themeKey(title: string, snippet = ""): string {
  const text = `${title} ${snippet}`.toLowerCase();
  const city =
    text.match(
      /\b(milano|roma|napoli|torino|firenze|bologna|venezia|genova|palermo|catania|verona|bari|brescia|padova)\b/
    )?.[1] ?? "italia";
  return `${city}-${topicOf(text)}`;
}

function isBlockedStory(item: FeedItem): boolean {
  const blob = `${item.title}\n${item.snippet}`;
  return SKIP_STORY.test(blob) || GEOPOLITICS.test(blob) || GENERIC_FLUFF.test(blob);
}

/** Higher = better for the channel. Flash drama scores negative and is dropped. */
function storyScore(item: FeedItem): number {
  const blob = `${item.title}\n${item.snippet}`;
  if (SKIP_STORY.test(blob) || GEOPOLITICS.test(blob) || GENERIC_FLUFF.test(blob) || SPORT_DULL.test(blob))
    return -100;
  const topic = topicOf(blob);
  if (topic === "disordini" || topic === "cronaca-nera") return -100;
  let score = 0;
  // Emigrants first: docs/tax/housing/education ≫ culture ≫ organic sport
  if (EMIGRANT_PRIORITY.test(blob)) score += 70;
  else if (PREFER_STORY.test(blob)) score += 40;
  else if (SPORT_ORGANIC.test(blob)) score += 22;
  if (SOFT_SKIP.test(blob)) score -= 35;
  const boost: Record<string, number> = {
    casa: 40,
    scuola: 40,
    salute: 42,
    trasporti: 38,
    soldi: 38,
    cibo: 22,
    curiosita: 18,
    viaggi: 20,
    meteo: 14,
    cultura: 12,
    sport: 14,
    politica: -25,
    altro: 0,
  };
  score += boost[topic] ?? 0;
  if (/\b(come |quanto costa|guida|tradizion|abitudin|ogni anno|sempre|funziona)\b/i.test(item.title)) {
    score += 12;
  }
  if (/ora |live|breaking|in diretta|ultime |ferito|arrestato/i.test(blob)) score -= 25;
  const ageH = (Date.now() - new Date(item.pubDate).getTime()) / 3_600_000;
  if (Number.isFinite(ageH)) {
    if (ageH < 6 && (topic === "politica" || topic === "altro")) score -= 8;
    if (ageH > 12 && ageH < 96 && PREFER_STORY.test(blob)) score += 6;
  }
  return score;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
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

function scriptFont(): string | null {
  return fontFile([
    "/System/Library/Fonts/Supplemental/SnellRoundhand.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
    "/System/Library/Fonts/Supplemental/Georgia Italic.ttf",
  ]);
}

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
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

async function fetchFeeds(): Promise<FeedItem[]> {
  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({ timeout: 20_000 });
  const items: FeedItem[] = [];
  for (const url of FEEDS) {
    try {
      const xmlText = await fetchText(url);
      if (!xmlText) continue;
      const feed = await parser.parseString(xmlText);
      for (const item of feed.items ?? []) {
        const link = item.link?.trim();
        const title = item.title?.trim();
        if (!link || !title) continue;
        const pub = item.pubDate ? new Date(item.pubDate) : new Date();
        if (!Number.isFinite(pub.getTime())) continue;
        if (Date.now() - pub.getTime() > MAX_AGE_MS) continue;
        items.push({
          title,
          link,
          pubDate: pub.toISOString(),
          snippet: (item.contentSnippet || item.content || "").replace(/<[^>]+>/g, " ").slice(0, 500),
        });
      }
    } catch (e) {
      console.warn(`[italy-lepta] feed failed ${url}:`, e instanceof Error ? e.message : e);
    }
  }
  items.sort((a, b) => storyScore(b) - storyScore(a) || (a.pubDate < b.pubDate ? 1 : -1));
  return items;
}

function articleBody(html: string): string {
  const paras = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [];
  const out: string[] = [];
  for (const raw of paras) {
    const text = stripTags(raw);
    if (text.length < 50) continue;
    if (/cookie|newsletter|iscriviti|abbonati|copyright|riproduzione riservata/i.test(text)) continue;
    out.push(text);
    if (out.join(" ").length > 3500) break;
  }
  return out.join("\n\n").slice(0, 3500);
}

function ogImageUrl(html: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const found = html.match(re)?.[1]?.trim();
    if (found && /^https?:\/\//i.test(found)) return found;
  }
  return null;
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

function cardSvg(lines: string[]): string {
  const bold = boldFont();
  const script = scriptFont();
  const face = [
    bold ? `@font-face { font-family: 'CardBold'; src: url('${bold}'); }` : "",
    script ? `@font-face { font-family: 'CardScript'; src: url('${script}'); }` : "",
  ].join("\n");
  const boldFamily = bold ? "CardBold" : "DejaVu Sans, Liberation Sans, Arial, sans-serif";
  const scriptFamily = script ? "CardScript" : "Georgia, 'DejaVu Serif', serif";
  const y0 = lines.length > 2 ? 520 : 560;
  const headlines = lines
    .slice(0, 3)
    .map(
      (line, i) =>
        `<text x="32" y="${y0 + i * 52}" font-family="${boldFamily}" font-size="40" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${face}</style>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#fade)"/>
  <text x="28" y="64" font-family="${scriptFamily}" font-size="48" fill="#ffffff">Emigro</text>
  ${headlines}
  <text x="32" y="762" font-family="${boldFamily}" font-size="15" fill="#ffffff">РЕАКЦИЯ</text>
  <polygon points="128,746 122,756 128,756 120,768 134,755 128,755" fill="#ffd60a"/>
  <text x="140" y="762" font-family="${boldFamily}" font-size="15" fill="#ffffff">= ТЕМА ИНТЕРЕСНАЯ И ВАЖНАЯ</text>
  <text x="776" y="762" text-anchor="end" font-family="${boldFamily}" font-size="16" fill="#ffffff">@milan_echat</text>
</svg>`;
}

export async function renderItalyCard(photo: Buffer, cardLines: string[]): Promise<Buffer> {
  const base = await sharp(photo)
    .rotate()
    .resize(800, 800, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.92 })
    .jpeg()
    .toBuffer();
  const overlay = await sharp(Buffer.from(cardSvg(cardLines))).png().toBuffer();
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 88 }).toBuffer();
}

function buildCaption(
  draft: Pick<ItalyLeptaDraft, "title" | "lead" | "paragraphs" | "tip" | "vocab" | "sourceUrl">
): string {
  const vocab = draft.vocab
    .slice(0, 3)
    .map((row) => `${esc(row.it)} — ${esc(row.ru)}`)
    .join("\n");
  const tipBlock = draft.tip ? `\n\nНа практике: ${esc(draft.tip)}` : "";
  const footer =
    `<blockquote>${vocab}</blockquote>\n\n` +
    `<a href="${esc(draft.sourceUrl)}">©</a>`;
  const head =
    `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n` + `<i>${esc(draft.lead)}</i>\n\n`;
  const paras = [...draft.paragraphs];
  let body = paras.map((p) => esc(p)).join("\n\n");
  let caption = `${head}${body}${tipBlock}\n\n${footer}`;
  while (caption.length > CAPTION_MAX && paras.length > 0) {
    paras.pop();
    body = paras.map((p) => esc(p)).join("\n\n");
    caption = body ? `${head}${body}${tipBlock}\n\n${footer}` : `${head}${tipBlock}\n\n${footer}`;
  }
  if (caption.length > CAPTION_MAX && tipBlock) {
    caption = `${head}${body}\n\n${footer}`;
  }
  if (caption.length > CAPTION_MAX) {
    const room = CAPTION_MAX - (head.length - draft.lead.length) - footer.length - 8;
    const lead = esc(draft.lead).slice(0, Math.max(80, room));
    caption = `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n<i>${lead}</i>\n\n${footer}`;
  }
  return caption.slice(0, CAPTION_MAX);
}

async function writeDraft(item: FeedItem, html: string, image: Buffer): Promise<ItalyLeptaDraft | null> {
  const body = articleBody(html);
  if (body.length < 280) return null;
  const raw = await geminiFastJson<{
    skip: boolean;
    title: string;
    lead: string;
    paragraphs: string[];
    tip: string;
    card_lines: string[];
    vocab: Array<{ it: string; ru: string }>;
  }>(
    `Ты пишешь в чат @milan_echat для русскоязычных в Италии, голос как у Lépta. Пиши по-русски, нейтрально. Не зови подписаться на канал.
Приоритет: permesso/questura, codice fiscale, налоги/бонусы, жильё, работа, asilo/scuola/università,
медицина (ospedale, ASL, ticket, assicurazione, vaccinazioni, screening, акции в поликлиниках),
транспорт, аэропорты, ZTL, цены. Культура и спорт — вторично, только с пользой.

Только факты из источника. Не выдумывай цифры, даты, имена.
Заголовок без точки, до 90 знаков. Лид — 1–2 предложения. 2–3 коротких абзаца.
tip: одно короткое практическое предложение (до 140 знаков) — что проверить / куда записаться / на что смотреть.
Только из фактов источника, без «мы», без эмодзи.
card_lines: 2 строки ЗАГЛАВНЫМИ по-русски, каждая до 22 символов.
vocab: ровно 3 пары. Два существительных с артиклем (Il/Lo/La/L') и один глагол в инфинитиве.
Без хештегов и оценок.

skip=true для: беспорядков, митингов, чёрной хроники, геополитики, партийной повестки, сухого спорта, пустых сюжетов.
skip=false для полезных эмигрантских новостей (медицина, школа, документы, налоги, жильё).`,
    `Заголовок источника: ${item.title}\n\n${body}`,
    SCHEMA,
    2500
  );
  if (raw.skip) return null;
  const title = raw.title.replace(/\s+/g, " ").trim();
  const lead = raw.lead.replace(/\s+/g, " ").trim();
  const paragraphs = (raw.paragraphs ?? []).map((p) => p.replace(/\s+/g, " ").trim()).filter((p) => p.length > 40);
  const tip = (raw.tip ?? "").replace(/\s+/g, " ").trim().slice(0, 160);
  const cardLines = (raw.card_lines ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 2);
  const vocab = (raw.vocab ?? []).filter((row) => row.it && row.ru).slice(0, 3);
  if (!title || !lead || paragraphs.length === 0 || cardLines.length < 2 || vocab.length < 3) return null;
  const draftTheme = themeKey(`${title} ${lead}`, paragraphs.join(" "));
  const topic = draftTheme.split("-").slice(1).join("-");
  if (topic === "disordini" || topic === "cronaca-nera" || topic === "politica") return null;
  return {
    title,
    lead,
    paragraphs,
    tip,
    cardLines,
    vocab,
    sourceUrl: item.link,
    image,
    themeKey: draftTheme,
  };
}

export async function buildNextItalyLeptaPost(seen: Set<string>): Promise<ItalyLeptaDraft | null> {
  const items = await fetchFeeds();
  const recentThemes = loadRecentThemes();
  const recentTopic = new Set(recentThemes.map((t) => t.split("-").slice(1).join("-")));
  const recentSet = new Set(recentThemes);
  const ranked = items
    .filter((item) => {
      const key = normalizeUrl(item.link);
      if (seen.has(key)) return false;
      if (isBlockedStory(item)) {
        markSeen(item.link);
        seen.add(key);
        return false;
      }
      const score = storyScore(item);
      if (score < 15) return false;
      const theme = themeKey(item.title, item.snippet);
      const topic = theme.split("-").slice(1).join("-");
      if (recentSet.has(theme) || recentTopic.has(topic)) return false;
      return true;
    })
    .slice(0, CANDIDATE_SCAN);

  console.log(
    `[italy-lepta] fresh ${items.length}; candidates ${ranked.length}; recent ${recentThemes.join(",") || "none"}`
  );
  for (const item of ranked) {
    console.log(`[italy-lepta] try score=${storyScore(item)} ${item.title}`);
    const html = await fetchText(item.link);
    if (!html) continue;
    const imageUrl = ogImageUrl(html);
    if (!imageUrl) {
      console.log(`[italy-lepta] no photo ${item.link}`);
      continue;
    }
    const photo = await downloadImage(imageUrl);
    if (!photo) continue;
    try {
      const bodyPreview = articleBody(html);
      const gate = await audienceInterestGate({
        channel: "italy",
        title: item.title,
        snippet: item.snippet,
        body: bodyPreview,
      });
      console.log(`[italy-lepta] gate ${gate.score}/10 pass=${gate.pass} — ${gate.reason} — ${item.title}`);
      if (!gate.pass) {
        if (!gate.reason.startsWith("gate error")) {
          markSeen(item.link);
          seen.add(normalizeUrl(item.link));
        }
        continue;
      }
      const draft = await writeDraft(item, html, photo);
      if (!draft) {
        console.log(`[italy-lepta] skip draft ${item.title}`);
        continue;
      }
      const topic = draft.themeKey.split("-").slice(1).join("-");
      if (recentSet.has(draft.themeKey) || recentTopic.has(topic)) {
        console.log(`[italy-lepta] draft theme recent ${draft.themeKey}`);
        continue;
      }
      return draft;
    } catch (e) {
      console.warn(`[italy-lepta] draft failed ${item.link}:`, e instanceof Error ? e.message : e);
    }
  }
  return null;
}

async function publishPhoto(caption: string, image: Buffer): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const form = new FormData();
  form.set("chat_id", ITALY_LEPTA_CHANNEL());
  form.set("caption", caption);
  form.set("parse_mode", "HTML");
  form.set("photo", new Blob([new Uint8Array(image)], { type: "image/jpeg" }), "og.jpg");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
  const json = (await res.json()) as { ok?: boolean; description?: string; result?: { message_id?: number } };
  if (!res.ok || json.ok === false) {
    throw new Error(json.description || `sendPhoto HTTP ${res.status}`);
  }
  return json.result?.message_id ?? 0;
}

export async function runItalyLeptaChannel(options?: { dryRun?: boolean }): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
}> {
  const seen = loadSeen();
  const draft = await buildNextItalyLeptaPost(seen);
  if (!draft) return { published: false, reason: "no-fresh-story" };
  const card = await renderItalyCard(draft.image, draft.cardLines);
  const caption = buildCaption(draft);
  if (caption.length > CAPTION_MAX) {
    return { published: false, reason: "caption-too-long", title: draft.title };
  }
  if (options?.dryRun) {
    console.log(`[italy-lepta] dry-run ${draft.title}\n${caption}`);
    return { published: false, reason: "dry-run", title: draft.title };
  }
  const messageId = await publishPhoto(caption, card);
  remember(draft.sourceUrl, draft.themeKey);
  console.log(`[italy-lepta] published ${messageId} ${draft.title} theme=${draft.themeKey}`);
  return { published: true, messageId, title: draft.title };
}
