/**
 * @emigro_portugal — Norte only (Porto, Gaia, Matosinhos, Braga…).
 * Same pipeline idea as Italy, different format: NOT Lépta.
 * Words go inline in the body, no end blockquote trio, no «реакция» card.
 * Does not publish to @Emigro_news or @emigro_Italy.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { audienceInterestGate } from "@/lib/news/audience-gatekeeper";
import { geminiFastJson } from "@/lib/news/gemini";

export const PORTUGAL_PORTO_CHANNEL = () =>
  (process.env.EMIGRO_PORTUGAL_NEWS_CHANNEL || "@emigro_portugal").trim();

const CHANNEL_URL = "https://t.me/emigro_portugal";
const CAPTION_MAX = 1024;
const MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;
const RECENT_THEME_KEEP = 10;
const CANDIDATE_SCAN = 28;

const FEEDS = [
  "https://www.rtp.pt/noticias/rss/cultura",
  "https://www.observador.pt/feed/",
  "https://www.theportugalnews.com/rss",
  "https://www.portugalresident.com/feed/",
  "https://www.sapo.pt/rss",
  "https://eco.sapo.pt/feed/",
  "https://www.jornaldenegocios.pt/rss",
  "https://www.rtp.pt/noticias/rss/economia",
];

const SKIP_STORY =
  /desordem|confrontos?|motim|vandal|saque|acampada|manifestação|manifestantes|protesto|tiroteio|homicíd|assassin|rapto|violação|cadáver|baby gang|arrastão|presídio permanente|greve geral|ocupam o aeroporto|última hora.*morto|zona para media|jornalistas.*protest|embezzl|desfalque|suspeitos de|força aérea|combater fogos/i;

/** Wars, foreign elections, great-power noise — audience does not care. */
const GEOPOLITICS =
  /ucrânia|rússia|putin|zelensk|trump|nato|otan|gaza|israel|hamas|china|taiwan|brics|casa branca|casa blanca|eua\b|estados unidos|guerra (na|no|em)|cessar[- ]fogo|coreia do norte|comércio bilateral|geopolít/i;

/** Dry sports feed — scores, tables, kickoff notices. Organic sport stories pass. */
const SPORT_DULL =
  /classificação da liga|tabela classificativa|jornada \d+|fc porto joga esta|liga dos campeões\.\s*fc|2h\.\s*liga|sofre a .*derrota|completa reviravolta|\d+\s*[-–]\s*\d+\s*(golos?|gols?)|resultado final|ao minuto|onze inicial|escalação|live blogging/i;

/** Human / city sports angle. */
const SPORT_ORGANIC =
  /adepto|adeptos|estádio|dragão|transferência|contratação|lenda|história (do|da) clube|museu (do|da)|bancada|clássico|derby|derbi|camisola|mascote|cidade do futebol|inaugura.*estádio|bilhete|sócio|superdragões|boavista|vitória de guimarães|sc braga.*adepto/i;

/** Priority #1: exhibitions, events, concerts, openings, restaurants. */
const CULTURE_PRIORITY =
  /exposi[cç][aã]o|exposição|inaugura(ção)? (da|do|de)|inaugura exposição|abre portas|novo restaurante|nova tasca|nova garrafeira|concerto|concertos|palcos|despedem-se dos palcos|festival|feira de arte|feira literár|bienal|galeria|museu|teatro|ópera|bailado|espetáculo|agenda cultural|vida cultural|vernissage|retrospectiva|instalação artística|chef |gastronom|wine bar|cocktail bar|rooftop|petisco|francesinha|vinho do porto|serralves|casa da música|rivoli|coliseu|soares dos reis|circuito cultural|bilhetes/i;

/** Emigrant / relocant life — highest priority over culture & sport. */
const EMIGRANT_PRIORITY =
  /\b(AIMA|SEF|visto|Visto D[78]|autorização de residência|NIF|segurança social|IRS|finanças|imposto|taxa|renda|arrendamento|habitação|imóve|imobiliár|contrato de arrendamento|fiador|caução|crédito à habitação|taxa de juro|Euribor|empreendimento|nova construção|novas construções|prédio novo|condomínio|apartamentos? (novos?|à venda)|licença de habitação|IMI|IMT|mais[- ]valias|salário|trabalho remoto|recibos verdes|portagem|portagens|via verde|aeroporto|voo|voos|sá carneiro|Andante|metro do porto|STCP|comboio|CP\b|passaporte|conservatória|carta de condução|água|luz|gás|apagão|corte de água|corte de luz|tarifa|preço|inflação|quanto custa|escola|escolas|infantário|creche|jardim de infância|ensino|universidade|politécnico|matrícula|ano letivo|provas de ingresso|exame nacional|propinas|residência universitária|ATL|AAAF|SNS|centro de saúde|USF|ULS|hospital|hospitais|urgência|urgências|farmácia|médico|médica|consulta|seguro de saúde|seguro saúde|ADSE|comparticipação|vacina|vacinação|rastreio|campanha de saúde|lei da saúde|saúde pública)\b/i;

/** Broader practical life (still above pure culture). */
const LIFE_PRIORITY =
  /aeroporto|voo|voos|portagem|portagens|via verde|estrada|tráfego|trânsito|imposto|IRS|finanças|taxa|renda|arrendamento|habitação|imóve|imobiliár|empreendimento|nova construção|crédito à habitação|Euribor|preço|inflação|salário|metro|comboio|CP\b|STCP|Andante|NIF|segurança social|SNS|saúde|hospital|farmácia|seguro|vacina|rastreio|passaporte|conservatória|quanto custa|tarifa|bilhete|greve (dos|das|no|na)|corte de água|corte de luz|apagão|AIMA|visto|autorização de residência|escola|creche|universidade/i;

/** Vague “about life” without a concrete news hook. */
const GENERIC_FLUFF =
  /como resolver|o que fazer se|guia completo|tudo o que precisa|opinião|editorial|coluna de opinião|tendências? (do|da|em)|reflexão|debate sobre|o futuro (do|da)|em geral|na prática,? como/i;

const PREFER_STORY =
  /renda|arrendamento|habitação|imóve|preço|inflação|salário|trabalho|metro|comboio|CP\b|STCP|Uber|meteorologia|chuva|calor|turismo|praia|Norte|Porto|Matosinhos|Gaia|Braga|saúde|passaporte|conservatória|quanto custa|tradição|curiosidade/i;

const SOFT_SKIP =
  /reality show|big brother|casa dos segredos|eurovisão|montenegro|primeiro[- ]ministro|sic verifica|chega\b|psd\b|partido socialista|assembleia da república/i;

/** Hard geo: story must touch Norte / Porto metro. Lisboa-only and national fluff — out. */
const NORTE_GEO =
  /\b(porto|oporto|matosinhos|gaia|vila nova de gaia|braga|guimarães|guimaraes|aveiro|viseu|viana do castelo|póa?voa de varzim|vila do conde|espinho|gondomar|maia|valongo|penafiel|amarante|barcelos|famalicão|santo tirso|trofa|norte|serralves|casa da música|coliseu do porto|rivoli|soares dos reis|stcp|metro do porto|aeroporto francisco sá carneiro|sá carneiro|dragão|estádio do dragão|boavista|fc porto|futebol clube do porto|vitória de guimarães|sc braga)\b/i;

const LISBOA_ONLY =
  /\b(lisboa|lisbon|almada|sintra|cascais|setúbal|setubal|doclisboa|óbidos|obidos)\b/i;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type FeedItem = { title: string; link: string; pubDate: string; snippet: string };

export type PortugalPortoDraft = {
  title: string;
  lead: string;
  paragraphs: string[];
  tip: string;
  cardLines: string[];
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
  },
  required: ["skip", "title", "lead", "paragraphs", "tip", "card_lines"],
};

function seenPath(): string {
  return resolve(process.cwd(), "deploy/portugal-porto/state/seen.json");
}

function themesPath(): string {
  return resolve(process.cwd(), "deploy/portugal-porto/state/recent-themes.json");
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

function loadSeen(): Set<string> {
  const urls = new Set<string>();
  const path = seenPath();
  if (!existsSync(path)) return urls;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      for (const item of parsed) if (typeof item === "string") urls.add(normalizeUrl(item));
    }
  } catch {
    /* empty */
  }
  return urls;
}

function loadRecentThemes(): string[] {
  const path = themesPath();
  if (!existsSync(path)) return [];
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string").slice(-RECENT_THEME_KEEP);
    }
  } catch {
    /* empty */
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
  if (/desordem|confront|manifest|protest|motim|vandal|acampada/.test(t)) return "desordem";
  if (/homicíd|assassin|tiroteio|rapto|cadáver/.test(t)) return "crime";
  // Fine-grained culture so exhibition → concert → restaurant can rotate.
  if (/exposi|galeria|museu|vernissage|retrospectiva|instalação|bienal/.test(t)) return "exposicao";
  if (/concerto|ópera|bailado|orquestra|dj set|live\b|palcos|despedem-se dos palcos/.test(t)) {
    return "concerto";
  }
  if (/restaurante|tasca|garrafeira|wine bar|cocktail|chef |petisco|francesinha|gastronom/.test(t)) {
    return "restaurante";
  }
  if (/festival|feira|espetáculo|agenda cultural|inaugura|abertura|abre portas|teatro|cinema/.test(t)) {
    return "evento";
  }
  if (/arte|livro|cultura/.test(t)) return "cultura";
  if (
    /futebol|fc porto|dragão|boavista|adepto|estádio|transferência|contratação|derby|derbi|sc braga|guimarães.*futebol/i.test(
      t
    )
  ) {
    return "sport";
  }
  if (/renda|arrendamento|habitação|imóve|imobiliár|locações|empreendimento|nova construção|crédito à habitação|euribor|condomínio|apartamento/.test(t))
    return "casa";
  if (/metro|comboio|\bcp\b|stcp|aeroporto|trânsito|portagem|via verde/.test(t)) return "transportes";
  if (/preço|inflação|salário|irs|imi|finanças|bolsa/.test(t)) return "dinheiro";
  if (/turismo|praia|viagem|hotel/.test(t)) return "viagens";
  if (/saúde|sns|farmácia|hospital|médico|seguro de saúde|adse|vacina|rastreio|urgência|consulta|comparticipação|centro de saúde|usf|uls/.test(t))
    return "saude";
  if (/escola|escolas|creche|infantário|jardim de infância|universidade|politécnico|matrícula|ano letivo|propinas|exame|educação|ensino/.test(t))
    return "escola";
  if (/chuva|calor|meteorolog|tempo\b/.test(t)) return "meteo";
  if (/curiosidade|tradição|como funciona|quanto custa/.test(t)) return "curiosidade";
  if (/política|governo|psd|ps\b|chega|eleição/.test(t)) return "politica";
  return "outro";
}

function themeKey(title: string, snippet = ""): string {
  const text = `${title} ${snippet}`.toLowerCase();
  const city =
    text.match(
      /\b(porto|lisboa|lisbon|braga|matosinhos|gaia|coimbra|faro|aveiro|guimarães|viseu)\b/
    )?.[1] ?? "portugal";
  const cityNorm = city === "lisbon" ? "lisboa" : city;
  return `${cityNorm}-${topicOf(text)}`;
}

function isNorteStory(item: FeedItem): boolean {
  const blob = `${item.title}\n${item.snippet}`;
  if (GEOPOLITICS.test(blob)) return false;
  if (NORTE_GEO.test(blob)) return true;
  // National practical life (airport/tax/roads) — OK if not Lisboa-only culture
  if (LIFE_PRIORITY.test(blob) && !LISBOA_ONLY.test(blob)) return true;
  if (LIFE_PRIORITY.test(blob) && /aeroporto|IRS|finanças|portagem|via verde|NIF|SNS/i.test(blob)) return true;
  return false;
}

function storyScore(item: FeedItem): number {
  const blob = `${item.title}\n${item.snippet}`;
  if (SKIP_STORY.test(blob) || SPORT_DULL.test(blob) || GENERIC_FLUFF.test(blob) || GEOPOLITICS.test(blob))
    return -100;
  if (!isNorteStory(item)) return -100;
  const topic = topicOf(blob);
  if (topic === "desordem" || topic === "crime") return -100;
  let score = 0;
  // Emigrants first: documents/tax/housing/transport ≫ culture ≫ organic sport
  if (EMIGRANT_PRIORITY.test(blob)) score += 72;
  else if (LIFE_PRIORITY.test(blob)) score += 56;
  // New builds / listings in Norte — strong signal for relocants
  if (/empreendimento|nova construção|novas construções|prédio novo|apartamentos? novos?/i.test(blob))
    score += 20;
  if (/\b(porto|matosinhos|gaia|braga|norte)\b/i.test(blob) && /habitação|imóve|imobiliár|empreendimento|construção/i.test(blob))
    score += 16;
  if (CULTURE_PRIORITY.test(blob)) score += 28;
  else if (SPORT_ORGANIC.test(blob)) score += 22;
  else if (PREFER_STORY.test(blob)) score += 20;
  if (SOFT_SKIP.test(blob) || GENERIC_FLUFF.test(blob)) score -= 40;
  const boost: Record<string, number> = {
    transportes: 42,
    dinheiro: 42,
    casa: 48,
    escola: 40,
    saude: 42,
    exposicao: 22,
    concerto: 20,
    restaurante: 20,
    evento: 18,
    sport: 16,
    cultura: 14,
    curiosidade: 12,
    viagens: 16,
    meteo: 10,
    politica: -35,
    outro: 0,
  };
  score += boost[topic] ?? 0;
  if (/\b(porto|matosinhos|gaia|braga|norte|sá carneiro)\b/i.test(blob)) score += 12;
  if (/€|\d+\s*%|\d{1,2}\/\d{1,2}|milhões|euros|hoje|amanhã|a partir de|até \d/i.test(blob)) score += 10;
  if (
    /em berlim|em paris|em nova iorque|em londres|nos estados unidos|em madrid/i.test(blob) &&
    !/\b(porto|lisboa|braga|matosinhos|gaia|coimbra|faro)\b/i.test(blob)
  ) {
    score -= 45;
  }
  if (/última hora|em direto|breaking|morto|ferido|detido/i.test(blob)) score -= 25;
  return score;
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
      console.warn(`[portugal-porto] feed failed ${url}:`, e instanceof Error ? e.message : e);
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
    if (/cookie|newsletter|subscreva|copyright|todos os direitos/i.test(text)) continue;
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

/** Card: teal bar + sentence-case lines — not Lépta ALL-CAPS / reaction footer. */
function cardSvg(lines: string[]): string {
  const bold = boldFont();
  const face = bold ? `@font-face { font-family: 'CardBold'; src: url('${bold}'); }` : "";
  const boldFamily = bold ? "CardBold" : "DejaVu Sans, Liberation Sans, Arial, sans-serif";
  const y0 = 560;
  const headlines = lines
    .slice(0, 2)
    .map(
      (line, i) =>
        `<text x="48" y="${y0 + i * 48}" font-family="${boldFamily}" font-size="36" fill="#ffffff">${xml(line)}</text>`
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
  <text x="48" y="56" font-family="${boldFamily}" font-size="22" fill="#1fa8a0">EMIGRO · PORTO</text>
  ${headlines}
  <text x="48" y="760" font-family="${boldFamily}" font-size="16" fill="#c8e6e3">@emigro_portugal</text>
</svg>`;
}

export async function renderPortugalPortoCard(photo: Buffer, cardLines: string[]): Promise<Buffer> {
  const base = await sharp(photo)
    .rotate()
    .resize(800, 800, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.94, saturation: 0.95 })
    .jpeg()
    .toBuffer();
  const overlay = await sharp(Buffer.from(cardSvg(cardLines))).png().toBuffer();
  return sharp(base).composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 88 }).toBuffer();
}

/**
 * Caption format (≠ Lépta):
 * bold title → italic lead → paragraphs with 1–2 inline PT glosses already inside
 * → «Источник» link. No blockquote vocab, no Подписаться/Проголосовать twin.
 */
function buildCaption(
  draft: Pick<PortugalPortoDraft, "title" | "lead" | "paragraphs" | "tip" | "sourceUrl">
): string {
  const tipBlock = draft.tip ? `\n\nНа практике: ${esc(draft.tip)}` : "";
  const footer = `<a href="${esc(draft.sourceUrl)}">Источник</a>`;
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
  if (caption.length > CAPTION_MAX) {
    const room = CAPTION_MAX - footer.length - draft.title.length - 40;
    const lead = esc(draft.lead).slice(0, Math.max(80, room));
    caption = `<b>${esc(draft.title.replace(/\.+$/, ""))}</b>\n\n<i>${lead}</i>\n\n${footer}`;
  }
  return caption.slice(0, CAPTION_MAX);
}

/** Turn `word (перевод)` into light italic PT + short gloss — readable, not a dictionary. */
function formatInlineHtml(paragraph: string): string {
  const escaped = esc(paragraph);
  // palavra (перевод) — keep parentheses short; italic only the PT token
  return escaped.replace(
    /\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\-]{1,40})\s*\(([^)]{1,28})\)/g,
    "<i>$1</i> ($2)"
  );
}

async function writeDraft(item: FeedItem, html: string, image: Buffer): Promise<PortugalPortoDraft | null> {
  const body = articleBody(html);
  const cultural = CULTURE_PRIORITY.test(`${item.title}\n${item.snippet}`);
  const minBody = cultural ? 120 : 280;
  if (body.length < minBody) {
    console.log(`[portugal-porto] short body ${body.length} < ${minBody} — ${item.title}`);
    // For culture teasers, fall back to title + snippet
    if (!cultural || `${item.title}. ${item.snippet}`.length < 120) return null;
  }
  const sourceText =
    body.length >= minBody ? body : `${item.title}\n\n${item.snippet}\n\n${body}`.slice(0, 3500);
  const raw = await geminiFastJson<{
    skip: boolean;
    title: string;
    lead: string;
    paragraphs: string[];
    tip: string;
    card_lines: string[];
  }>(
    `Ты редактор канала «Emigro | Новости Порту» для русскоязычных эмигрантов на севере Португалии (Porto, Gaia, Matosinhos, Braga, Norte).
Формат НЕ как Lépta: без блока из трёх слов в конце и без «реакция».

Приоритет сюжетов: документы/AIMA/NIF, налоги/IRS, жильё и недвижимость (аренда, цены, новостройки, empreendimentos, crédito à habitação),
работа, образование (creche/escola/universidade), медицина (SNS, hospital, seguro, vacinas, rastreios),
аэропорты/дороги/portagens, транспорт, цены. Культура и спорт — вторично, только с пользой (куда/когда/билет).

Пиши по-русски, спокойно, по делу. Только факты из источника.
Заголовок без точки, до 90 знаков. Лид — 1–2 предложения.
2–3 коротких абзаца. В тексте естественно встрой 2–4 португальских слова: слово (короткий перевод).
tip: одно короткое практическое предложение (до 140 знаков) — что проверить / куда записаться / на что обратить внимание.
Совет только из фактов источника, без выдумок и без «мы». Без эмодзи и хештегов в tip.
card_lines: 2 строки по-русски в обычном регистре, каждая до 28 символов.

skip=false для полезных эмигрантских и конкретных городских новостей севера.
skip=true только если: не про север (и не национальная практическая тема вроде SNS/IRS/aeroporto),
сухой спорт, преступление, партийная политика, геополитика, или нет фактов.
Не выдумывай даты: если в источнике quinta-feira без числа — пиши «в этот четверг».`,
    `Заголовок источника: ${item.title}\n\n${sourceText}`,
    SCHEMA,
    2500
  );
  if (raw.skip) {
    console.log(`[portugal-porto] gemini skip ${item.title}`);
    return null;
  }
  const title = raw.title.replace(/\s+/g, " ").trim();
  const lead = raw.lead.replace(/\s+/g, " ").trim();
  const paragraphs = (raw.paragraphs ?? []).map((p) => p.replace(/\s+/g, " ").trim()).filter((p) => p.length > 40);
  const draftAll = `${title}\n${lead}\n${paragraphs.join("\n")}`;
  if (
    /(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)\w*\s+\d{1,2}|\d{1,2}\s+(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i.test(
      draftAll
    ) &&
    !/\b(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|\d{1,2}\/\d{1,2})\b/i.test(
      sourceText
    )
  ) {
    console.log(`[portugal-porto] invented date — ${title}`);
    return null;
  }
  const tip = (raw.tip ?? "").replace(/\s+/g, " ").trim().slice(0, 160);
  const cardLines = (raw.card_lines ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 2);
  if (!title || !lead || paragraphs.length === 0 || cardLines.length < 2) {
    console.log(
      `[portugal-porto] draft incomplete title=${Boolean(title)} lead=${Boolean(lead)} paras=${paragraphs.length} cards=${cardLines.length}`
    );
    return null;
  }
  const glossCount = paragraphs.join(" ").match(/\b[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\-]{1,40}\s*\([^)]{1,40}\)/g)?.length ?? 0;
  if (glossCount > 5) {
    console.log(`[portugal-porto] too many glosses (${glossCount}) — skip overstuffed`);
    return null;
  }
  if (glossCount < 2 && cultural) {
    console.log(`[portugal-porto] few glosses (${glossCount}) — keep`);
  }
  const draftBlob = `${title}\n${lead}\n${paragraphs.join(" ")}`;
  if (!NORTE_GEO.test(draftBlob) && !NORTE_GEO.test(`${item.title}\n${item.snippet}`)) {
    console.log(`[portugal-porto] not Norte — ${title}`);
    return null;
  }
  const draftTheme = themeKey(`${title} ${lead}`, paragraphs.join(" "));
  const topic = draftTheme.split("-").slice(1).join("-");
  if (topic === "desordem" || topic === "crime" || topic === "politica") return null;
  return { title, lead, paragraphs, tip, cardLines, sourceUrl: item.link, image, themeKey: draftTheme };
}

export async function buildNextPortugalPortoPost(seen: Set<string>): Promise<PortugalPortoDraft | null> {
  const items = await fetchFeeds();
  const recentThemes = loadRecentThemes();
  const recentTopic = new Set(recentThemes.map((t) => t.split("-").slice(1).join("-")));
  const recentSet = new Set(recentThemes);
  const ranked = items
    .filter((item) => {
      const key = normalizeUrl(item.link);
      if (seen.has(key)) return false;
      const blob = `${item.title}\n${item.snippet}`;
      if (SKIP_STORY.test(blob) || SPORT_DULL.test(blob) || GEOPOLITICS.test(blob) || GENERIC_FLUFF.test(blob)) {
        markSeen(item.link);
        seen.add(key);
        return false;
      }
      if (!isNorteStory(item)) return false;
      const score = storyScore(item);
      const emigrant = EMIGRANT_PRIORITY.test(blob) || LIFE_PRIORITY.test(blob);
      const cultural = CULTURE_PRIORITY.test(blob);
      if (score < (emigrant ? 30 : cultural ? 20 : 45)) return false;
      const theme = themeKey(item.title, item.snippet);
      const topic = theme.split("-").slice(1).join("-");
      if (recentSet.has(theme)) return false;
      // "outro" is too broad — don't block unrelated stories after one vague post
      if (topic !== "outro" && recentTopic.has(topic)) return false;
      return true;
    })
    .slice(0, CANDIDATE_SCAN);

  console.log(
    `[portugal-porto] fresh ${items.length}; candidates ${ranked.length}; recent ${recentThemes.join(",") || "none"}`
  );
  for (const item of ranked) {
    console.log(`[portugal-porto] try score=${storyScore(item)} ${item.title}`);
    try {
      const html = await fetchText(item.link);
      if (!html) continue;
      const imageUrl = ogImageUrl(html);
      if (!imageUrl) {
        console.log(`[portugal-porto] no photo ${item.link}`);
        continue;
      }
      const photo = await downloadImage(imageUrl);
      if (!photo) continue;
      const bodyPreview = articleBody(html);
      const gate = await audienceInterestGate({
        channel: "portugal_norte",
        title: item.title,
        snippet: item.snippet,
        body: bodyPreview || `${item.title}. ${item.snippet}`,
      });
      console.log(`[portugal-porto] gate ${gate.score}/10 pass=${gate.pass} — ${gate.reason} — ${item.title}`);
      if (!gate.pass) {
        if (!gate.reason.startsWith("gate error")) {
          markSeen(item.link);
          seen.add(normalizeUrl(item.link));
        }
        continue;
      }
      const draft = await writeDraft(item, html, photo);
      if (!draft) {
        console.log(`[portugal-porto] skip draft ${item.title}`);
        continue;
      }
      const topic = draft.themeKey.split("-").slice(1).join("-");
      if (recentSet.has(draft.themeKey) || (topic !== "outro" && recentTopic.has(topic))) {
        console.log(`[portugal-porto] draft theme recent ${draft.themeKey}`);
        continue;
      }
      return draft;
    } catch (e) {
      console.warn(`[portugal-porto] draft failed ${item.link}:`, e instanceof Error ? e.message : e);
    }
  }
  return null;
}

async function publishPhoto(caption: string, image: Buffer): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const form = new FormData();
  form.set("chat_id", PORTUGAL_PORTO_CHANNEL());
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

export async function runPortugalPortoChannel(options?: { dryRun?: boolean }): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
}> {
  const seen = loadSeen();
  const draft = await buildNextPortugalPortoPost(seen);
  if (!draft) return { published: false, reason: "no-fresh-story" };
  const card = await renderPortugalPortoCard(draft.image, draft.cardLines);
  const caption = buildCaption(draft);
  if (caption.length > CAPTION_MAX) {
    return { published: false, reason: "caption-too-long", title: draft.title };
  }
  if (options?.dryRun) {
    console.log(`[portugal-porto] dry-run ${draft.title}\n${caption}`);
    return { published: false, reason: "dry-run", title: draft.title };
  }
  const messageId = await publishPhoto(caption, card);
  remember(draft.sourceUrl, draft.themeKey);
  console.log(`[portugal-porto] published ${messageId} ${draft.title} theme=${draft.themeKey}`);
  return { published: true, messageId, title: draft.title };
}
