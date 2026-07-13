/**
 * Editorial readability — convert telegraphic editor notes into reader-facing prose.
 *
 * Covers: «На практике (@channel, 2025): …», semicolon chains, «channel (2025-07):»,
 * inline @lepta 08.2025, gap «Чат:» / «Сайт:» bullets, FAQ practice tails.
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
const GAP_CHAT_PREFIX = /^(Чат|Сайт|Портал|Официально|На деле):\s*/i;

/** Detect telegraphic editor-note style (broader than practice-only). */
export function isTelegraphicEditorial(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (isTelegraphicPractice(t)) return true;
  if (/^(lepta|chatlisboa|por_tugal|autolife_pt)\s*\(\d{4}/i.test(t)) return true;
  if (/\(@[\w\d_]+,\s*\d{4}/.test(t)) return true;
  if (/@(lepta|chatlisboa|por_tugal|autolife_pt)\s+\d{2}\.\d{4}/i.test(t)) return true;
  if (GAP_CHAT_PREFIX.test(t) && t.length < 120) return true;
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

  // «lepta (2025-07): …» / «chatlisboa (2025-06): …»
  const namedDate = body.match(
    /^(lepta|chatlisboa|por_tugal|autolife_pt)\s*\(([^)]+)\)\s*[:\-—–]\s*(.+)$/i
  );
  if (namedDate) {
    const ch = normalizeChannelName(namedDate[1]);
    if (ch) {
      const lead = formatPracticeChannelLead([ch], periodFromDate(namedDate[2]));
      return `${lead} ${capitalizeClaim(namedDate[3])}`;
    }
  }

  // «(@channel, 2025–2026): …» or «На практике (@channel): …»
  const parenAttrib = body.match(/^\(@([\w\d_]+)(?:,\s*([\d–\-/.\s]+))?\)\s*[:\-—–]?\s*(.+)$/i);
  if (parenAttrib) {
    const ch = normalizeChannelName(parenAttrib[1]);
    if (ch) {
      const lead = formatPracticeChannelLead([ch], periodFromDate(parenAttrib[2] ?? "2025"));
      return `${lead} ${capitalizeClaim(parenAttrib[3])}`;
    }
  }

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

  // «@por_tugal 12.2025» without paren
  body = body.replace(/@([\w\d_]+)\s+(\d{2}\.\d{4})/gi, (_, ch, date) => {
    const norm = normalizeChannelName(ch);
    if (!norm) return `@${ch} ${date}`;
    return formatPracticeChannelLead([norm], periodFromDate(date)).replace(/ писали, что$/, " отмечали");
  });

  return body.replace(/\s{2,}/g, " ").trim();
}

function rewriteGapBullet(text: string): string {
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

  // «На практике: …» takeaway — ensure full sentences
  if (/^На практике/i.test(prefix)) {
    return formatPracticeTakeaway(body);
  }
  if (prefix) return `${prefix}${body}`;
  return body;
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
