import { emitBotEvent } from "@/lib/tax-cockpit/analytics";
import { extractLegsFromTicketMedia, parseManualPresenceText } from "@/lib/tax-cockpit/ingest";
import { addPresence, ensureLedger, listPresence } from "@/lib/tax-cockpit/ledger";
import { evaluateResidency, RESIDENCY_DISCLAIMER_RU } from "@/lib/tax-cockpit/residency";
import { answerCounsel, formatCounselReplyHtml } from "@/lib/tax-cockpit/counsel";
import { formatResidencyReportHtml } from "@/lib/tax-cockpit/report";
import type { PresenceInterval, PresenceSource } from "@/lib/tax-cockpit/types";
import { answerStatsBotCallback, sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { downloadTelegramFile } from "@/lib/telegram/bot/download-file";
import { isGlobalCommand, sendHome } from "@/lib/telegram/bot/home";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { clearSession, setSession } from "@/lib/telegram/bot/session";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

type TaxPayload = {
  year: number;
  pendingLegs?: PresenceInterval[];
};

const MANUAL_FORMAT = [
  "Формат (одна строка = одна поездка):",
  "<code>PT 2026-01-10..2026-03-01</code>",
  "<code>AE 2026-03-01..2026-06-15</code>",
  "",
  "Или по-русски: <code>Португалия 10.01.2026 - 01.03.2026</code>",
].join("\n");

function asPayload(raw: Record<string, unknown> | undefined): TaxPayload {
  const year = typeof raw?.year === "number" ? raw.year : new Date().getUTCFullYear();
  const pendingLegs = parsePendingLegs(raw?.pendingLegs);
  return { year, ...(pendingLegs.length ? { pendingLegs } : {}) };
}

function parsePendingLegs(raw: unknown): PresenceInterval[] {
  if (!Array.isArray(raw)) return [];
  const legs: PresenceInterval[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (
      typeof row.countryIso2 === "string" &&
      typeof row.startDate === "string" &&
      typeof row.endDate === "string"
    ) {
      const source: PresenceSource =
        row.source === "ticket" || row.source === "import" || row.source === "manual"
          ? row.source
          : "manual";
      legs.push({
        countryIso2: row.countryIso2,
        startDate: row.startDate,
        endDate: row.endDate,
        source,
      });
    }
  }
  return legs;
}

function clampTaxYear(year: number): number {
  if (year >= 2020 && year <= 2100) return year;
  return new Date().getUTCFullYear();
}

function hubHtml(year: number): string {
  return [
    `<b>Налоги · ${year}</b>`,
    "Дни по билетам → светофор резидентства → сценарии и рычаги оптимизации в вашей ситуации (бесплатно).",
    `<i>${RESIDENCY_DISCLAIMER_RU}</i>`,
    "",
    "Сложный кейс (PT+AE, GV, аренда, split-year) — сначала даты, потом «Вопрос консультанту».",
  ].join("\n");
}

function eventMeta(ctx: BotUserCtx, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ...extra,
    ...(ctx.username ? { username: ctx.username } : {}),
    ...(ctx.firstName ? { firstName: ctx.firstName } : {}),
  };
}

function taxHubKeyboard(year: number) {
  return inlineRows([
    [
      { text: "Ввести даты", callback_data: "tx:manual" },
      { text: "Отчёт", callback_data: "tx:report" },
    ],
    [{ text: "Вопрос консультанту", callback_data: "tx:counsel" }],
    [
      { text: String(year - 1), callback_data: `tx:year:${year - 1}` },
      { text: String(year), callback_data: `tx:year:${year}` },
      { text: String(year + 1), callback_data: `tx:year:${year + 1}` },
    ],
  ]);
}

function ingestConfirmKeyboard() {
  return inlineRows([
    [
      { text: "Подтвердить", callback_data: "tx:confirm" },
      { text: "Изменить", callback_data: "tx:edit" },
    ],
  ]);
}

function formatLegsPreview(legs: PresenceInterval[]): string {
  return legs
    .map((leg) => `${leg.countryIso2} ${leg.startDate}..${leg.endDate}`)
    .join("\n");
}

async function persist(ctx: BotUserCtx, step: string, payload: TaxPayload): Promise<void> {
  await setSession({
    telegramUserId: ctx.userId,
    app: "tax",
    step,
    payload: payload as Record<string, unknown>,
  });
}

async function sendHub(ctx: BotUserCtx, year: number): Promise<void> {
  await persist(ctx, "hub", { year });
  await sendStatsBotMessage(ctx.chatId, hubHtml(year), {
    parseMode: "HTML",
    replyMarkup: taxHubKeyboard(year),
  });
}

async function sendReport(ctx: BotUserCtx, year: number): Promise<void> {
  const ledger = await ensureLedger(ctx.userId, year);
  const intervals = await listPresence(ledger.id);
  const evaluation = evaluateResidency(year, intervals);
  await emitBotEvent(ctx.userId, "residency_report", eventMeta(ctx, { year }));
  await sendStatsBotMessage(ctx.chatId, formatResidencyReportHtml(evaluation), {
    parseMode: "HTML",
    replyMarkup: taxHubKeyboard(year),
  });
}

async function showIngestConfirm(
  ctx: BotUserCtx,
  year: number,
  legs: PresenceInterval[],
  errorLines: string[] = []
): Promise<void> {
  await persist(ctx, "ingest_confirm", { year, pendingLegs: legs });
  const parts = ["<b>Проверьте поездки</b>", `<pre>${formatLegsPreview(legs)}</pre>`];
  if (errorLines.length) {
    parts.push("", errorLines.map((e) => `⚠️ ${e}`).join("\n"));
  }
  parts.push("", "Подтвердите запись в журнал или измените текст.");
  await sendStatsBotMessage(ctx.chatId, parts.join("\n"), {
    parseMode: "HTML",
    replyMarkup: ingestConfirmKeyboard(),
  });
}

export async function startTax(ctx: BotUserCtx, year?: number): Promise<void> {
  const y = clampTaxYear(year ?? new Date().getUTCFullYear());
  await ensureLedger(ctx.userId, y);
  await emitBotEvent(ctx.userId, "tax_open", eventMeta(ctx, { year: y }));
  await sendHub(ctx, y);
}

export async function continueTax(
  ctx: BotUserCtx,
  incoming: BotIncoming,
  payloadRaw: Record<string, unknown>,
  step?: string
): Promise<void> {
  const payload = asPayload(payloadRaw);

  if (incoming.kind === "message") {
    if (isGlobalCommand(incoming.text)) {
      await clearSession(ctx.userId);
      await sendHome(ctx);
      return;
    }
  }

  if (incoming.kind === "callback") {
    await answerStatsBotCallback(incoming.id);
    const data = incoming.data;

    if (data.startsWith("tx:year:")) {
      const y = clampTaxYear(Number(data.slice("tx:year:".length)));
      await emitBotEvent(ctx.userId, "tax_open", eventMeta(ctx, { year: y }));
      await sendHub(ctx, y);
      return;
    }
    if (data === "tx:manual") {
      await persist(ctx, "manual_wait", { year: payload.year });
      await sendStatsBotMessage(
        ctx.chatId,
        ["<b>Ввод дат</b>", MANUAL_FORMAT, "", "Вставьте строки в чат одним сообщением."].join("\n"),
        { parseMode: "HTML" }
      );
      return;
    }
    if (data === "tx:edit") {
      await persist(ctx, "manual_wait", { year: payload.year });
      await sendStatsBotMessage(
        ctx.chatId,
        ["<b>Измените даты</b>", MANUAL_FORMAT].join("\n\n"),
        { parseMode: "HTML" }
      );
      return;
    }
    if (data === "tx:confirm") {
      const legs = payload.pendingLegs ?? [];
      if (step !== "ingest_confirm" || legs.length === 0) {
        await sendHub(ctx, payload.year);
        return;
      }
      try {
        const ledger = await ensureLedger(ctx.userId, payload.year);
        await addPresence(ledger.id, legs);
        const source = legs.every((l) => l.source === "ticket")
          ? "ticket"
          : legs.every((l) => l.source === "manual")
            ? "manual"
            : "import";
        await emitBotEvent(
          ctx.userId,
          "ticket_add",
          eventMeta(ctx, {
            year: payload.year,
            count: legs.length,
            source,
            preview: formatLegsPreview(legs).slice(0, 200),
          })
        );
        await sendHub(ctx, payload.year);
      } catch (e) {
        await sendStatsBotMessage(
          ctx.chatId,
          `Не удалось сохранить: ${e instanceof Error ? e.message : "ошибка"}. Попробуйте снова.`,
          { parseMode: "HTML", replyMarkup: ingestConfirmKeyboard() }
        );
      }
      return;
    }
    if (data === "tx:report") {
      try {
        await sendReport(ctx, payload.year);
      } catch (e) {
        await sendStatsBotMessage(
          ctx.chatId,
          `Не удалось построить отчёт: ${e instanceof Error ? e.message : "ошибка"}. Попробуйте позже.`,
          { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
        );
      }
      return;
    }
    if (data === "tx:counsel") {
      await persist(ctx, "counsel", { year: payload.year });
      await sendStatsBotMessage(
        ctx.chatId,
        [
          `<b>Консультант · ${payload.year}</b>`,
          "Задайте один вопрос по вашему журналу дней (сценарии, чеклисты, что проверить).",
          `<i>${RESIDENCY_DISCLAIMER_RU}</i>`,
        ].join("\n"),
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
      return;
    }
  }

  if (incoming.kind === "media") {
    const mediaStep = step ?? "hub";
    if (mediaStep !== "hub" && mediaStep !== "manual_wait") {
      await sendStatsBotMessage(
        ctx.chatId,
        "Фото билета можно отправить из главного экрана «Налоги» или после «Ввести даты».",
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
      return;
    }

    const fileId = incoming.photoFileId ?? incoming.documentFileId;
    const mime =
      incoming.mimeType ??
      (incoming.photoFileId ? "image/jpeg" : incoming.documentFileId ? "application/octet-stream" : "");

    if (!fileId) {
      await sendStatsBotMessage(
        ctx.chatId,
        "Не удалось получить файл. Пришлите фото или PDF билета ещё раз.",
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
      return;
    }

    const allowed =
      mime.startsWith("image/") ||
      mime === "application/pdf" ||
      (incoming.photoFileId != null && !incoming.documentFileId);
    if (!allowed) {
      await sendStatsBotMessage(
        ctx.chatId,
        ["Поддерживаются фото билета и PDF.", "", MANUAL_FORMAT].join("\n"),
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
      return;
    }

    await sendStatsBotMessage(ctx.chatId, "⏳ Читаю билет…", { parseMode: "HTML" });

    const buffer = await downloadTelegramFile(fileId);
    if (!buffer) {
      await sendStatsBotMessage(
        ctx.chatId,
        "Не удалось скачать файл (слишком большой или ошибка Telegram). Введите даты текстом.",
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
      return;
    }

    const effectiveMime = incoming.photoFileId && !mime.startsWith("image/") ? "image/jpeg" : mime;

    try {
      const { legs, errors, rawNotes } = await extractLegsFromTicketMedia(
        buffer,
        effectiveMime,
        incoming.caption
      );
      if (legs.length === 0) {
        const errBlock =
          errors.length > 0
            ? errors.map((e) => `⚠️ ${e}`).join("\n")
            : "⚠️ Не удалось прочитать билет.";
        await sendStatsBotMessage(
          ctx.chatId,
          [`<b>Билет не разобран</b>`, errBlock, "", MANUAL_FORMAT].join("\n"),
          { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
        );
        await persist(ctx, mediaStep === "manual_wait" ? "manual_wait" : "hub", { year: payload.year });
        return;
      }
      const confirmHints = [...errors];
      if (rawNotes?.trim()) {
        confirmHints.push(`Заметка модели: ${rawNotes.trim().slice(0, 300)}`);
      }
      await showIngestConfirm(ctx, payload.year, legs, confirmHints);
    } catch (e) {
      await sendStatsBotMessage(
        ctx.chatId,
        `Не удалось обработать билет: ${e instanceof Error ? e.message : "ошибка"}. ${MANUAL_FORMAT}`,
        { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
      );
    }
    return;
  }

  if (incoming.kind === "message") {
    if (step === "counsel") {
      const question = incoming.text.trim();
      if (!question) {
        await sendStatsBotMessage(ctx.chatId, "Напишите вопрос текстом.", {
          parseMode: "HTML",
          replyMarkup: taxHubKeyboard(payload.year),
        });
        return;
      }

      await sendStatsBotMessage(ctx.chatId, "⏳ Думаю…", { parseMode: "HTML" });

      try {
        const answer = await answerCounsel({
          telegramUserId: ctx.userId,
          year: payload.year,
          userText: question,
        });

        if (answer.refused) {
          await emitBotEvent(
            ctx.userId,
            "counsel_ask",
            eventMeta(ctx, { year: payload.year, refused: true, preview: question.slice(0, 200) })
          );
          await sendStatsBotMessage(ctx.chatId, answer.text, {
            parseMode: "HTML",
            replyMarkup: inlineRows([
              [{ text: "Ввести даты", callback_data: "tx:manual" }],
              [{ text: "← Назад", callback_data: `tx:year:${payload.year}` }],
            ]),
          });
          return;
        }

        await emitBotEvent(
          ctx.userId,
          "counsel_ask",
          eventMeta(ctx, {
            year: payload.year,
            question_chars: question.length,
            preview: question.slice(0, 200),
          })
        );
        if (answer.countryFocus?.length) {
          for (const iso2 of answer.countryFocus) {
            await emitBotEvent(
              ctx.userId,
              "country_focus",
              eventMeta(ctx, { year: payload.year, iso2 })
            );
          }
        }

        await sendStatsBotMessage(
          ctx.chatId,
          formatCounselReplyHtml(answer.text, answer.sources ?? []),
          { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
        );
        await persist(ctx, "counsel", { year: payload.year });
      } catch (e) {
        await sendStatsBotMessage(
          ctx.chatId,
          `Не удалось ответить: ${e instanceof Error ? e.message : "ошибка"}. Попробуйте позже или «Отчёт».`,
          { parseMode: "HTML", replyMarkup: taxHubKeyboard(payload.year) }
        );
      }
      return;
    }

    if (step === "manual_wait") {
      const { legs, errors } = parseManualPresenceText(incoming.text, payload.year);
      if (legs.length === 0) {
        const errBlock =
          errors.length > 0
            ? ["", errors.map((e) => `⚠️ ${e}`).join("\n")].join("\n")
            : "\n\n⚠️ Не распознано ни одной строки.";
        await sendStatsBotMessage(
          ctx.chatId,
          [`<b>Не удалось разобрать</b>${errBlock}`, "", MANUAL_FORMAT].join("\n"),
          { parseMode: "HTML" }
        );
        await persist(ctx, "manual_wait", { year: payload.year });
        return;
      }
      await showIngestConfirm(ctx, payload.year, legs, errors);
      return;
    }
  }

  await sendHub(ctx, payload.year);
}
