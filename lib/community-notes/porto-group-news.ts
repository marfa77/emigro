/**
 * Rare short news cards in the Porto city group — only super-relevant
 * RU-audience resident ops from emigro.online stories (not visa/GV club,
 * not @Emigro_news молния). Silence is the default.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { looksLikeEphemeralPolitics } from "@/lib/community-notes/politics-news";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import {
  formatPortoGroupHtml,
  portoGroupChatId,
  satelliteNotePublicUrl,
} from "@/lib/community-notes/porto-group-card";
import type { CommunityNote } from "@/lib/community-notes/types";
import {
  escapeTelegramHtml,
  hasLightningConcreteDetail,
  lightningAudienceSkipReason,
} from "@/lib/news/story-lightning";
import { createServerClient } from "@/lib/supabase/server";
import { newsArticleUrl } from "@/lib/site-url";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

const STATE_FILE = resolve(process.cwd(), "parser/out/porto-group-news-posted.json");
const LOOKBACK_DAYS = 4;
const MIN_INTERVAL_MS = 5 * 24 * 60 * 60 * 1000;

/** Visa / nationality / investor — that belongs on @Emigro_news, not the city group. */
const VISA_CLUB_RE =
  /golden visa|vistos?\s*gold|\bari\b|d7\b|d8\b|\bnhr\b|lei da nacionalidade|национальност|гражданств.{0,40}португал|nomad visa|digital nomad|visto gold|инвестор.{0,20}виз|5\s*[→\-–]\s*10/i;

/** Operational facts for people already living in PT (Norte first). */
const RESIDENT_OPS_RE =
  /\bsns\b|utente|centro de sa[uú]de|sns24|finanç|financas|\bnif\b|\birs\b|e-fatura|portagen|via verde|\bstcp\b|metro do porto|comboios|\bcp\b|intercidades|greve|забастов|arrendamento|senhorio|lei do arrendamento|\bimi\b|agrupamento|escola p[uú]blica|prote[cç][aã]o civil|civil protection|оранжев\w+ уровен|желт\w+ уровен|погодн\w+ предупред|электричеств|edp\b|iva .{0,24}climat|andante|тариф (?:воды|света|газа)|multa.{0,20}portagen/i;

const ENACTED_RE =
  /вступает в силу|вступают в силу|decreto-lei|принят[оа]? закон|уже в силе|enter(?:s)? into force/i;

type NewsState = {
  chat_id: string;
  last_posted_at?: string;
  slugs: string[];
};

type StoryRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  key_takeaways: string[] | null;
  content_blocks: Array<{ paragraphs?: string[]; bullets?: string[] }> | null;
  published_at: string;
};

export type PortoGroupNewsResult = {
  skipped?: string;
  kind?: "story" | "note";
  slug?: string;
  title?: string;
  html?: string;
  messageId?: number;
  dryRun?: boolean;
};

function loadState(chatId: string): NewsState {
  try {
    const raw = JSON.parse(readFileSync(STATE_FILE, "utf-8")) as NewsState;
    if (raw.chat_id !== chatId) return { chat_id: chatId, slugs: [] };
    return { chat_id: chatId, slugs: raw.slugs ?? [], last_posted_at: raw.last_posted_at };
  } catch {
    return { chat_id: chatId, slugs: [] };
  }
}

function saveState(state: NewsState): void {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function hay(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join("\n");
}

export function portoGroupNewsSkipReason(text: string): string | null {
  const audience = lightningAudienceSkipReason(text);
  if (audience) return audience;
  if (VISA_CLUB_RE.test(text)) return "visa-club";
  if (looksLikeEphemeralPolitics(text) && !ENACTED_RE.test(text)) return "politics";
  if (!RESIDENT_OPS_RE.test(text)) return "not-resident-ops";
  if (!hasLightningConcreteDetail(text) && !/€\s?\d|\d{1,2}[./]\d{1,2}|\d{4}/.test(text)) {
    return "no-concrete-detail";
  }
  return null;
}

function storyGateText(row: StoryRow): string {
  const block = row.content_blocks?.[0];
  return hay([
    row.title,
    row.excerpt,
    ...(row.key_takeaways ?? []),
    ...(block?.paragraphs ?? []),
    ...(block?.bullets ?? []),
  ]);
}

function noteGateText(note: CommunityNote): string {
  return hay([note.title, note.excerpt, note.quick_answer, ...(note.key_takeaways ?? [])]);
}

function storyArticleUrl(slug: string): string {
  const url = new URL(newsArticleUrl(slug));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "porto_group_news");
  url.searchParams.set("utm_content", slug);
  return url.toString();
}

export function formatPortoGroupNewsHtml(title: string, excerpt: string, articleUrl: string): string {
  const hook = excerpt.replace(/\s+/g, " ").trim();
  const clipped = hook.length > 380 ? `${hook.slice(0, 377).trim()}…` : hook;
  const href = articleUrl.replace(/"/g, "&quot;");
  return [
    `<b>${escapeTelegramHtml(title.replace(/\s+/g, " ").trim().slice(0, 160))}</b>`,
    `<i>Коротко с emigro.online</i>`,
    "",
    escapeTelegramHtml(clipped),
    "",
    href,
  ].join("\n");
}

function sinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function loadCandidateStories(): Promise<StoryRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select("slug, title, excerpt, key_takeaways, content_blocks, published_at")
    .eq("topic_key", "portugal")
    .eq("format", "story")
    .eq("status", "published")
    .gte("published_at", sinceIso(LOOKBACK_DAYS))
    .order("published_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as StoryRow[];
}

export async function postPortoGroupNewsIfRelevant(options?: {
  dryRun?: boolean;
}): Promise<PortoGroupNewsResult> {
  const chatId = portoGroupChatId();
  if (!chatId) return { skipped: "EMIGRO_PORTO_CHAT_ID missing" };
  if (!process.env.EMIGRO_CHAT_BOT_TOKEN?.trim()) {
    return { skipped: "EMIGRO_CHAT_BOT_TOKEN missing" };
  }

  const state = loadState(chatId);
  if (state.last_posted_at) {
    const last = Date.parse(state.last_posted_at);
    if (Number.isFinite(last) && Date.now() - last < MIN_INTERVAL_MS) {
      return { skipped: "news interval (max 1 / 5 days)" };
    }
  }

  const posted = new Set(state.slugs);

  const stories = await loadCandidateStories();
  for (const row of stories) {
    if (posted.has(`story:${row.slug}`)) continue;
    const reason = portoGroupNewsSkipReason(storyGateText(row));
    if (reason) continue;
    const excerpt = (row.excerpt || row.key_takeaways?.[0] || "").trim();
    if (excerpt.length < 40) continue;
    const html = formatPortoGroupNewsHtml(row.title, excerpt, storyArticleUrl(row.slug));
    return sendNews(chatId, state, `story:${row.slug}`, row.title, html, "story", options?.dryRun);
  }

  const notes = await getPublishedCommunityNotesUncached("portugal");
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const newsNotes = notes
    .filter((n) => n.content_kind === "news" && n.published_at && Date.parse(n.published_at) >= cutoff)
    .sort((a, b) => Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? ""));

  for (const note of newsNotes) {
    if (posted.has(`note:${note.slug}`)) continue;
    const reason = portoGroupNewsSkipReason(noteGateText(note));
    if (reason) continue;
    const html = formatPortoGroupHtml(note, satelliteNotePublicUrl(note.slug));
    return sendNews(chatId, state, `note:${note.slug}`, note.title, html, "note", options?.dryRun);
  }

  return { skipped: "no super-relevant Portugal news" };
}

async function sendNews(
  chatId: string,
  state: NewsState,
  key: string,
  title: string,
  html: string,
  kind: "story" | "note",
  dryRun?: boolean
): Promise<PortoGroupNewsResult> {
  const slug = key.replace(/^(story|note):/, "");
  if (dryRun) {
    return { kind, slug, title, html, dryRun: true };
  }

  const sent = await sendStatsBotMessage(chatId, html, {
    parseMode: "HTML",
    disableWebPagePreview: false,
  });
  if (!sent.success) {
    throw new Error(sent.error || "telegram send failed");
  }

  const next: NewsState = {
    chat_id: chatId,
    last_posted_at: new Date().toISOString(),
    slugs: [...state.slugs, key],
  };
  saveState(next);
  return { kind, slug, title, html, messageId: sent.messageId };
}
