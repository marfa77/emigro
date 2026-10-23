import {
  runAgentWithFallback,
  type FunctionDecl,
  type Source,
} from "@/lib/telegram/bot/agent/gemini";
import { ensureLedger, listPresence } from "./ledger";
import { canonicalIso2, getPack } from "./packs";
import { evaluateResidency, RESIDENCY_DISCLAIMER_RU, type ResidencyEvaluation } from "./residency";
import type { PresenceInterval } from "./types";

export const EMPTY_LEDGER_REFUSE_RU =
  "В журнале за этот год пока нет поездок — без дат присутствия я не могу отвечать по резидентству. Добавьте даты («Ввести даты») или пришлите билет, затем задайте вопрос снова.";

const ASSIST_SOFT_RU =
  "Golden Visa, аренда в ОАЭ при жизни в Португалии, подача декларации — сложные кейсы: Emigro Assist (https://emigro.io/ru/assist) или @emigro_chat_bot → Assist. Это не замена бухгалтеру.";

const READ_LEDGER: FunctionDecl = {
  name: "read_ledger",
  description:
    "Дни присутствия по странам за налоговый год из журнала пользователя (inclusive arrive / exclusive depart по умолчанию).",
  parameters: {
    type: "object",
    properties: {
      year: { type: "integer", description: "налоговый год, напр. 2026" },
    },
    required: ["year"],
  },
};

const READ_PACK: FunctionDecl = {
  name: "read_pack",
  description:
    "Черновик правил Emigro по стране (ISO2): пороги-ориентиры, вопросы tie-breaker, playbooks. Не закон — только pack.",
  parameters: {
    type: "object",
    properties: {
      iso2: { type: "string", description: "ISO 3166-1 alpha-2, напр. PT, AE, GB" },
    },
    required: ["iso2"],
  },
};

export type CounselAnswer = {
  text: string;
  countryFocus?: string[];
  refused?: boolean;
  sources?: Source[];
};

export type CounselDeps = {
  ensureLedger?: typeof ensureLedger;
  listPresence?: typeof listPresence;
  runAgent?: typeof runAgentWithFallback;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ledgerSummaryBlock(evaluation: ResidencyEvaluation): string {
  const lines = [
    `Год: ${evaluation.year}`,
    "Топ стран по дням (из журнала, не вывод резидента):",
  ];
  for (const row of evaluation.topCountries) {
    lines.push(
      `- ${row.iso2} ${row.nameRu}: ${row.days} дн., светофор ${row.light}, complete=${row.complete}`
    );
  }
  if (evaluation.topCountries.length === 0) {
    lines.push("- (нет дней в журнале за год)");
  }
  for (const row of evaluation.topCountries) {
    const pack = getPack(row.iso2);
    if (pack.notesRu.length) {
      lines.push(`Pack ${row.iso2} notes: ${pack.notesRu.slice(0, 3).join(" | ")}`);
    }
  }
  return lines.join("\n");
}

function buildSystemPrompt(year: number, evaluation: ResidencyEvaluation): string {
  return [
    "Ты — ориентир по налоговому году Emigro Tax Cockpit. Отвечай по-русски, кратко и по делу.",
    "",
    `DISCLAIMER (в каждом ответе напомни одной фразой): ${RESIDENCY_DISCLAIMER_RU}`,
    "",
    "Жёсткие правила:",
    "- Никогда не пиши «вы налоговый резидент X» / «вы не резидент» как финальный вывод. Только «по дням в журнале…», «проверьте tie-breaker», «нужен бухгалтер».",
    "- Без данных read_ledger не делай выводов по резидентству; вызови read_ledger.",
    "- Не выдумывай пороги и законы — только pack (read_pack) и web_search для свежих официальных источников.",
    "- EU stubs / incomplete pack → yellow, pack incomplete, консультант.",
    "- Инструменты только read_ledger, read_pack, web_search. Маркетинг и SEO не трогай.",
    "",
    `Soft CTA (если уместно GV / PT+AE rental / filing): ${ASSIST_SOFT_RU}`,
    "",
    "Контекст журнала (уже загружен):",
    ledgerSummaryBlock(evaluation),
    "",
    `Текущий выбранный год сессии: ${year}`,
  ].join("\n");
}

async function readLedgerForUser(
  telegramUserId: number,
  taxYear: number,
  deps: CounselDeps
): Promise<{ year: number; byCountry: Array<{ iso2: string; days: number; light: string; complete: boolean }> }> {
  const ensure = deps.ensureLedger ?? ensureLedger;
  const list = deps.listPresence ?? listPresence;
  const ledger = await ensure(telegramUserId, taxYear);
  const intervals = await list(ledger.id);
  const evaluation = evaluateResidency(taxYear, intervals);
  return {
    year: taxYear,
    byCountry: evaluation.byCountry.map((row) => ({
      iso2: row.iso2,
      days: row.days,
      light: row.light,
      complete: row.complete,
    })),
  };
}

function readPackForIso(iso2: string): Record<string, unknown> {
  const code = canonicalIso2(iso2) ?? iso2.trim().toUpperCase();
  const pack = getPack(code);
  return {
    iso2: pack.iso2,
    nameRu: pack.nameRu,
    complete: pack.complete,
    presenceThresholdDays: pack.presenceThresholdDays,
    thresholdCompare: pack.thresholdCompare ?? "gte",
    abbreviatedFormula: pack.abbreviatedFormula ?? false,
    notesRu: pack.notesRu,
    tieBreakerQuestionsRu: pack.tieBreakerQuestionsRu,
    playbooks: pack.playbooks?.map((p) => ({ id: p.id, titleRu: p.titleRu, bodyRu: p.bodyRu })),
    officialSource: pack.officialSource ?? null,
  };
}

function disclaimerPresent(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("не налоговая консультация") ||
    lower.includes("не замена бухгалтеру")
  );
}

/** Telegram HTML for counsel reply; appends disclaimer and optional grounded sources. */
export function formatCounselReplyHtml(text: string, sources: Source[] = []): string {
  let body = escapeHtml(text.trim());
  if (!disclaimerPresent(text)) {
    body += `\n\n<i>${escapeHtml(RESIDENCY_DISCLAIMER_RU)}</i>`;
  }
  if (sources.length) {
    const links = sources
      .slice(0, 6)
      .map((s) => `<a href="${escapeHtml(s.uri)}">${escapeHtml(s.title)}</a>`);
    body += `\n\n<i>Источники:</i> ${links.join(" · ")}`;
  }
  return body;
}

export async function answerCounsel(
  opts: { telegramUserId: number; year: number; userText: string },
  deps: CounselDeps = {}
): Promise<CounselAnswer> {
  const question = opts.userText.trim();
  if (!question) {
    return { text: "Напишите вопрос одним сообщением.", refused: true };
  }

  const ensure = deps.ensureLedger ?? ensureLedger;
  const list = deps.listPresence ?? listPresence;
  const ledger = await ensure(opts.telegramUserId, opts.year);
  const intervals: PresenceInterval[] = await list(ledger.id);

  if (intervals.length === 0) {
    return { text: EMPTY_LEDGER_REFUSE_RU, refused: true };
  }

  const evaluation = evaluateResidency(opts.year, intervals);
  const countryFocus = new Set<string>();
  const runAgent = deps.runAgent ?? runAgentWithFallback;

  const { text, sources } = await runAgent({
    system: buildSystemPrompt(opts.year, evaluation),
    history: [],
    userParts: [{ text: question }],
    functions: [READ_LEDGER, READ_PACK],
    onCall: async (name, args) => {
      if (name === READ_LEDGER.name) {
        const y =
          typeof args.year === "number" && Number.isFinite(args.year)
            ? Math.trunc(args.year)
            : opts.year;
        return readLedgerForUser(opts.telegramUserId, y, deps);
      }
      if (name === READ_PACK.name) {
        const raw = String(args.iso2 ?? "");
        const code = canonicalIso2(raw);
        if (code) countryFocus.add(code);
        return readPackForIso(raw);
      }
      return { error: `unknown tool: ${name}` };
    },
    maxSteps: 8,
  });

  return {
    text,
    countryFocus: countryFocus.size ? [...countryFocus] : undefined,
    sources,
  };
}
