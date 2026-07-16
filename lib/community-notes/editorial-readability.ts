/**
 * Editorial readability — convert telegraphic editor notes into reader-facing prose.
 *
 * Covers: «На практике (@channel, 2025): …», semicolon chains, «channel (2025-07):»,
 * mid-sentence «lepta (2025):», inline @lepta 08.2025, gap «Чат:» / «Сайт:» bullets, FAQ practice tails.
 */
import {
  formatPracticeChannelLead,
  formatPracticeTakeaway,
  improvePracticeText,
  isTelegraphicPractice,
} from "@/lib/community-notes/practice-format";
import type { CommunityNote, CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

const ALLOWED_CHANNELS = new Set(["chatlisboa", "por_tugal", "autolife_pt", "lepta"]);
const TAKEAWAY_PREFIX = /^(Официально|На практике|Расхождение|В чате):\s*/i;
/** Gap editor prefixes only — not takeaway labels «Официально:» / «На практике:». */
const GAP_CHAT_PREFIX = /^(Чат|Сайт|Портал|На деле):\s*/i;
const CHANNEL_ALT = "lepta|chatlisboa|por_tugal|autolife_pt";

/** Detect telegraphic editor-note style (broader than practice-only). */
export function isTelegraphicEditorial(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (isTelegraphicPractice(t)) return true;
  if (new RegExp(`^(${CHANNEL_ALT})\\s*\\(\\d{4}`, "i").test(t)) return true;
  // Mid-sentence / inline editor attribution
  if (new RegExp(`(?:^|[.;!?…]\\s+|—\\s+)(${CHANNEL_ALT})\\s*\\(\\d{4}`, "i").test(t)) return true;
  if (new RegExp(`(?:^|[.;!?…]\\s+)(${CHANNEL_ALT})\\s*[:\\-—–]`, "i").test(t)) return true;
  if (/\(@[\w\d_]+,\s*\d{4}/.test(t)) return true;
  if (/@(lepta|chatlisboa|por_tugal|autolife_pt)\s+\d{2}\.\d{4}/i.test(t)) return true;
  // Short cryptic gap bullets only (long prose with «Чат:» still rewritten by improveEditorialText)
  if (GAP_CHAT_PREFIX.test(t) && t.length < 160) return true;
  const body = t.replace(TAKEAWAY_PREFIX, "");
  const semicolons = (body.match(/;/g) ?? []).length;
  if (semicolons >= 2 && body.length < 280 && !/\[[^\]]+\]\([^)]+\)/.test(body)) return true;
  return false;
}

function normalizeChannelName(raw: string): string | null {
  const c = raw.replace(/^@/, "").toLowerCase();
  return ALLOWED_CHANNELS.has(c) ? c : null;
}

function periodFromDate(raw: string): string {
  const m = raw.match(/(\d{4})/);
  if (!m) return "2025–2026";
  const y = m[1];
  if (/^\d{2}\.\d{4}$/.test(raw.trim())) {
    const [mm, yyyy] = raw.trim().split(".");
    const month = parseInt(mm, 10);
    if (month <= 6) return `${yyyy}–${yyyy}`;
    return `${yyyy}–${parseInt(yyyy, 10) + 1}`;
  }
  return `${y}–${parseInt(y, 10) + 1}`;
}

function capitalizeClaim(claim: string): string {
  const trimmed = claim.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function rewriteChannelDateLead(text: string): string {
  let body = text;

  // «lepta (2025-07): …» / «chatlisboa (2025-06): …» at start
  const namedDate = body.match(
    new RegExp(`^(${CHANNEL_ALT})\\s*\\(([^)]+)\\)\\s*[:\\-—–]\\s*(.+)$`, "i")
  );
  if (namedDate) {
    const ch = normalizeChannelName(namedDate[1]);
    if (ch) {
      const lead = formatPracticeChannelLead([ch], periodFromDate(namedDate[2]));
      return `${lead} ${capitalizeClaim(namedDate[3])}`;
    }
  }

  // Mid-sentence «… lepta (2025): claim» / «… lepta (2025-07): claim»
  body = body.replace(
    new RegExp(`([.;!?…]\\s+|\\s+|—\\s*)(${CHANNEL_ALT})\\s*\\(([^)]+)\\)\\s*[:\\-—–]\\s*`, "gi"),
    (full, _sep: string, chRaw: string, dateRaw: string) => {
      const ch = normalizeChannelName(chRaw);
      if (!ch) return full;
      const lead = formatPracticeChannelLead([ch], periodFromDate(dateRaw));
      return `. ${lead} `;
    }
  );

  // Bare mid-sentence «lepta: claim» / «por_tugal: claim» (no year)
  body = body.replace(
    new RegExp(`([.;!?…]\\s+|\\s+|—\\s*)(${CHANNEL_ALT})\\s*[:\\-—–]\\s*(?=\\S)`, "gi"),
    (full, _sep: string, chRaw: string) => {
      const ch = normalizeChannelName(chRaw);
      if (!ch) return full;
      const lead = formatPracticeChannelLead([ch], "2025–2026");
      return `. ${lead} `;
    }
  );

  // «(@channel, 2025–2026): …» or «На практике (@channel): …»
  const parenAttrib = body.match(/^\(@([\w\d_]+)(?:,\s*([\d–\-/.\s]+))?\)\s*[:\-—–]?\s*(.+)$/i);
  if (parenAttrib) {
    const ch = normalizeChannelName(parenAttrib[1]);
    if (ch) {
      const lead = formatPracticeChannelLead([ch], periodFromDate(parenAttrib[2] ?? "2025"));
      return `${lead} ${capitalizeClaim(parenAttrib[3])}`;
    }
  }

  // Mid-string «(@channel, 2025):»
  body = body.replace(/\(@([\w\d_]+)(?:,\s*([\d–\-/.\s]+))?\)\s*[:\-—–]?\s*/gi, (full, chRaw, dateRaw) => {
    const ch = normalizeChannelName(chRaw);
    if (!ch) return full;
    return `${formatPracticeChannelLead([ch], periodFromDate(dateRaw ?? "2025"))} `;
  });

  // «На практике @por_tugal: …»
  const atColon = body.match(/^@([\w\d_]+)\s*[:\-—–]\s*(.+)$/i);
  if (atColon) {
    const ch = normalizeChannelName(atColon[1]);
    if (ch) {
      const lead = formatPracticeChannelLead([ch]);
      return `${lead} ${capitalizeClaim(atColon[2])}`;
    }
  }

  // inline «(@lepta 08.2025)» / «@lepta 07.2025»
  body = body.replace(/\(@([\w\d_]+)\s+(\d{2}\.\d{4})\)/gi, (_, ch, date) => {
    const norm = normalizeChannelName(ch);
    if (!norm) return "";
    return ` — по опыту ${formatPracticeChannelLead([norm], periodFromDate(date)).replace(/ писали, что$/, "")}`;
  });
  body = body.replace(/@([\w\d_]+)\s+(\d{2}\.\d{4})/gi, (_, ch, date) => {
    const norm = normalizeChannelName(ch);
    if (!norm) return `@${ch} ${date}`;
    return formatPracticeChannelLead([norm], periodFromDate(date)).replace(/ писали, что$/, " отмечали");
  });

  return body.replace(/\s{2,}/g, " ").trim();
}

function stripWrappingQuotes(s: string): string {
  return s.trim().replace(/^[«"']+|['"»]+$/g, "").trim();
}

function rewriteGapBullet(text: string): string {
  // «Сайт: X → Y» / «Чат: X → Y» — common gap pattern
  const arrow = text.match(/^(Чат|Сайт|Портал|На деле):\s*(.+?)\s*→\s*(.+)$/i);
  if (arrow) {
    const [, label, left, right] = arrow;
    const leftClean = stripWrappingQuotes(left);
    const rightClean = right.trim().replace(/[.!?…]+$/, "");
    const isSite = /сайт|портал/i.test(label);
    if (isSite) {
      return `На сайте звучит как «${leftClean}», а на деле ${capitalizeClaim(rightClean)}.`;
    }
    return `В чатах релокантов часто пишут «${leftClean}», но на практике ${capitalizeClaim(rightClean)}.`;
  }

  const m = text.match(/^(Чат|Сайт|Портал|На деле):\s*(.+)$/i);
  if (!m) return text;
  const [, label, rest] = m;
  const frame =
    label.toLowerCase() === "сайт" || label.toLowerCase() === "портал"
      ? "На официальном сайте пишут одно, а"
      : "В чатах релокантов часто пишут, что";
  return `${frame} ${capitalizeClaim(rest)}`;
}

/** Improve a single string — practice blocks, bullets, FAQ answers, takeaways. */
export function improveEditorialText(text: string): string {
  if (!text?.trim()) return text;

  const prefixMatch = text.match(TAKEAWAY_PREFIX);
  const prefix = prefixMatch?.[0] ?? "";
  let body = prefix ? text.replace(TAKEAWAY_PREFIX, "") : text;

  body = rewriteChannelDateLead(body);
  body = rewriteGapBullet(body);
  body = improvePracticeText(body);

  const cleaned = body
    .replace(/\.{2,}/g, ".")
    .replace(/\s+\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();

  // «На практике: …» takeaway — ensure full sentences
  if (/^На практике/i.test(prefix)) {
    return formatPracticeTakeaway(cleaned);
  }
  if (prefix) return `${prefix}${cleaned}`;
  return cleaned;
}

function transformSections(sections: NoteBodySection[]): NoteBodySection[] {
  return sections.map((section) => ({
    ...section,
    paragraphs: (section.paragraphs ?? []).map(improveEditorialText),
    bullets: (section.bullets ?? []).map(improveEditorialText),
  }));
}

function transformFaq(faq: CommunityNoteFaq[]): CommunityNoteFaq[] {
  return faq.map((item) => ({
    q: improveEditorialText(item.q),
    a: improveEditorialText(item.a),
  }));
}

export type ReadabilityDraft = Pick<
  CommunityNote,
  | "quick_answer"
  | "key_takeaways"
  | "body_sections"
  | "body_paragraphs"
  | "faq"
  | "excerpt"
>;

/** Apply readability transforms to all reader-facing text fields. */
export function applyReadabilityToDraft<T extends ReadabilityDraft>(draft: T): T {
  const body_sections = transformSections(draft.body_sections ?? []);
  return {
    ...draft,
    excerpt: draft.excerpt ? improveEditorialText(draft.excerpt) : draft.excerpt,
    quick_answer: improveEditorialText(draft.quick_answer),
    key_takeaways: (draft.key_takeaways ?? []).map(improveEditorialText),
    body_sections,
    body_paragraphs: body_sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
    faq: transformFaq(draft.faq ?? []),
  };
}

export const EDITORIAL_READABILITY_RULES = `
ЧИТАЕМОСТЬ РЕДАКТОРСКИХ ПОМЕТОК (все контексты, не только «На практике»):
- Атрибуция чата: «Участники @por_tugal в 2025–2026 писали, что…» — не «lepta (2025-07):» или «(@channel, 2025):».
- Без цепочек через «;» — 2–3 коротких предложения или отдельные bullets.
- gap-секции: «В чатах пишут…» / «На сайте…» — полные предложения, не «Чат: …» / «Сайт: …».
- FAQ: после «По правилам…» блок «На практике…» — связное предложение с выводом для читателя.
- Разрешённые каналы: @chatlisboa, @por_tugal, @autolife_pt, @lepta — только они.
- Каждый факт: что происходит + что это значит для вас (что делать / чего ждать).`.trim();
