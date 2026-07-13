/**
 * Practice block format — readable field experience from Telegram chats.
 *
 * BAD (telegraphic semicolon-list):
 *   «На практике (@chatlisboa, 2025–2026): ожидание 30–90 дней; services.aima.gov.pt — только после e-mail AIMA; Agora — presencial.»
 *
 * GOOD (mini-paragraph with reader impact):
 *   «На практике: Участники @chatlisboa и @por_tugal в 2025–2026 писали, что от загрузки документов
 *   до решения по онлайн-продлению проходит 30–90 дней — не гарантия, сверяйтесь со своим pedido.
 *   Если карта уже просрочена, портал services.aima.gov.pt открывают не сразу: в чатах пишут,
 *   что ссылку присылают только после письма от AIMA с оплатой пошлины.»
 *
 * Rules:
 * - One thought per bullet/takeaway; no semicolon chains of unrelated facts.
 * - Channel attribution: «Участники @channel в 2025–2026 писали, что…» — not «(@channel, 2025–2026):».
 * - PT terms explained inline on first use in the sentence.
 * - Each item answers: what happens + what it means for the reader.
 * - Never cite @emigro_chat.
 */
import { formatChannelHandle } from "@/lib/guides/portugal-telegram-citations";

const TAKEAWAY_PREFIX = /^(Официально|На практике|Расхождение|В чате):\s*/i;
const BLOCKED_CHANNELS = new Set(["emigro_chat"]);

export type PracticeFormatInput = {
  /** Field claim grounded in chat signals */
  claim: string;
  /** Optional: what the reader should do or expect */
  forReader?: string;
  channels?: string[];
  period?: string;
};

/** Detect telegraphic semicolon-list or raw (@channel, year) attribution. */
export function isTelegraphicPractice(text: string): boolean {
  const body = text.replace(TAKEAWAY_PREFIX, "").trim();
  if (!body) return false;
  if (/^На практике\s*\(@/i.test(text)) return true;
  if (/^На практике:\s*[^.]{0,80};\s*[^.]{0,80};\s*/i.test(text)) return true;
  const semicolons = (body.match(/;/g) ?? []).length;
  if (semicolons >= 2 && body.length < 320) return true;
  if (/@\w+,\s*20\d{2}/.test(body) && semicolons >= 1) return true;
  return false;
}

function normalizeChannels(channels?: string[]): string[] {
  if (!channels?.length) return [];
  return channels
    .map((c) => c.replace(/^@/, "").toLowerCase())
    .filter((c) => c && !BLOCKED_CHANNELS.has(c));
}

/** Readable channel lead — «Участники @por_tugal в 2025–2026 писали, что…» */
export function formatPracticeChannelLead(channels: string[], period = "2025–2026"): string {
  const norm = normalizeChannels(channels);
  if (norm.length === 0) {
    return `В чатах релокантов в ${period} часто пишут, что`;
  }
  const handles = norm.map(formatChannelHandle);
  const channelList =
    handles.length <= 2
      ? handles.join(" и ")
      : `${handles.slice(0, 2).join(", ")} и др.`;
  return `Участники ${channelList} в ${period} писали, что`;
}

function capitalizeClaim(claim: string): string {
  const trimmed = claim.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

function joinSentences(parts: string[]): string {
  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Single practice bullet for body_sections (no «На практике:» prefix). */
export function formatPracticeBullet(input: PracticeFormatInput | string): string {
  if (typeof input === "string") {
    return improvePracticeText(input);
  }

  const { claim, forReader, channels, period } = input;
  const lead = channels?.length ? formatPracticeChannelLead(channels, period) : "";
  const core = lead
    ? `${lead} ${capitalizeClaim(claim)}`
    : claim.trim().charAt(0).toUpperCase() + claim.trim().slice(1);

  return joinSentences([core, forReader ?? ""]);
}

/** Practice line for key_takeaways — prefixed «На практике:». */
export function formatPracticeTakeaway(input: PracticeFormatInput | string): string {
  const body =
    typeof input === "string"
      ? improvePracticeText(input.replace(TAKEAWAY_PREFIX, ""))
      : formatPracticeBullet(input);
  return `На практике: ${body}`;
}

/**
 * Best-effort cleanup of legacy telegraphic strings.
 * Prefer explicit PracticeFormatInput for new content.
 */
export function improvePracticeText(text: string): string {
  let body = text.replace(TAKEAWAY_PREFIX, "").trim();
  if (!body) return body;

  // «(@chatlisboa, 2025–2026): …» → readable lead
  const rawAttrib = body.match(/^\(@([\w\d_]+)(?:,\s*([\d–-]+))?\):\s*(.+)$/i);
  if (rawAttrib) {
    const [, channel, period, rest] = rawAttrib;
    const lead = formatPracticeChannelLead([channel], period ?? "2025–2026");
    body = `${lead} ${capitalizeClaim(rest)}`;
  }

  // «На практике @channel: …» at start of body
  const atStart = body.match(/^@([\w\d_]+)(?:,\s*([\d–-]+))?\s*:\s*(.+)$/i);
  if (atStart) {
    const [, channel, period, rest] = atStart;
    const lead = formatPracticeChannelLead([channel], period ?? "2025–2026");
    body = `${lead} ${capitalizeClaim(rest)}`;
  }

  // Split semicolon chains into sentences (cap at 3 clauses)
  if ((body.match(/;/g) ?? []).length >= 2) {
    const parts = body
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((p, i) => {
        const sentence = p.charAt(0).toUpperCase() + p.slice(1);
        return i < 2 && !/[.!?]$/.test(sentence) ? `${sentence}.` : sentence;
      });
    body = parts.join(" ");
  }

  return body.replace(/\s+/g, " ").trim();
}

/** Format a single string if it is a telegraphic practice line. */
export function formatPracticeString(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/^На практике:/i.test(trimmed) && isTelegraphicPractice(trimmed)) {
    return formatPracticeTakeaway(trimmed);
  }
  if (/^На практике \(@/i.test(trimmed)) {
    return formatPracticeTakeaway(trimmed);
  }
  return trimmed;
}

export type PracticeFormatDraft = {
  key_takeaways: string[];
  body_sections: Array<{
    heading: string;
    section_kind?: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

/** Best-effort pass over takeaways + practice sections (DB cron / batch). */
export function applyPracticeFormatToDraft(draft: PracticeFormatDraft): {
  key_takeaways: string[];
  body_sections: PracticeFormatDraft["body_sections"];
  changed: number;
} {
  let changed = 0;

  const key_takeaways = draft.key_takeaways.map((t) => {
    const next = formatPracticeString(t);
    if (next !== t) changed += 1;
    return next;
  });

  const body_sections = draft.body_sections.map((section) => {
    const isPractice =
      section.section_kind === "practice" ||
      /на практике|как обычно|в чате|опыт релокант/i.test(section.heading);
    if (!isPractice) return section;

    const bullets = section.bullets?.map((b) => {
      if (typeof b !== "string") return b;
      const candidate = /^На практике/i.test(b) ? b : `На практике: ${b}`;
      if (!isTelegraphicPractice(candidate) && !/^На практике \(@/i.test(b)) return b;
      const next = /^На практике:/i.test(b) ? formatPracticeTakeaway(b) : improvePracticeText(b);
      if (next !== b) changed += 1;
      return next;
    });

    return bullets ? { ...section, bullets } : section;
  });

  return { key_takeaways, body_sections, changed };
}

export const PRACTICE_BLOCK_FORMAT_RULES = `
ПРАКТИКА ИЗ ЧАТОВ (формат, не телеграф):
- Один смысл на bullet или takeaway — без цепочек через «;».
- Атрибуция: «Участники @por_tugal в 2025–2026 писали, что…» — не «(@por_tugal, 2025–2026):».
- Каждый пункт: что происходит + что это значит для читателя (что делать / чего ждать).
- PT-термин при первом упоминании: termo (краткая расшифровка по-русски).
- key_takeaways «На практике:» — 1–3 полных предложения, не список аббревиатур.
- body practice bullets — до 2 строк, глагол или конкретный факт + пояснение.
- Запрещено: @emigro_chat, сырые «lepta, 2025-08» в скобках, три факта в одной строке через «;».

Плохо: «services.aima.gov.pt для просроченных — только после e-mail AIMA»
Хорошо: «Если карта уже просрочена, портал services.aima.gov.pt открывают не сразу — в чатах пишут,
что ссылку и доступ присылают только после письма от AIMA с оплатой пошлины.»`.trim();
