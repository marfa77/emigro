/**
 * The one job of @emigro_chat_bot since 2026-11-19: a short screening dialogue → free specialist match.
 * Same questions as the web questionnaire (/ru/anketa), asked one at a time with buttons. The result is
 * stored as a screening lead and the owner gets hand-off buttons (see request-owner.ts).
 */
import { answerStatsBotCallback, sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession, REQUEST_TTL_MS, setSession } from "@/lib/telegram/bot/session";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";
import { SCREENING_FIELDS } from "@/lib/screening/questions";
import { saveScreeningLead } from "@/lib/screening/save";

export const BOT_REQUEST_CONSENT_VERSION = "bot-request-2026-11-19";

type Step = {
  id: string;
  question: string;
  /** Button options; when "other" is set, the last button asks for free text. */
  options?: readonly string[];
  other?: string;
};

const DESTINATIONS = ["Португалия", "Испания", "Италия", "Германия", "Таиланд", "ОАЭ"] as const;
const CITIZENSHIPS = ["Россия", "Беларусь", "Украина", "Казахстан"] as const;

function optionsOf(id: string): readonly string[] {
  return SCREENING_FIELDS.find((field) => field.id === id)?.options ?? [];
}

export const REQUEST_STEPS: Step[] = [
  { id: "destination", question: "Куда хотите переехать?", options: DESTINATIONS, other: "Другая страна или пока не знаю" },
  { id: "citizenship", question: "Ваше гражданство?", options: CITIZENSHIPS, other: "Другое или несколько" },
  { id: "residence_country", question: "В какой стране вы живёте сейчас? Напишите одним сообщением." },
  { id: "residence_status", question: "Ваш статус в этой стране?", options: optionsOf("residence_status") },
  { id: "goal", question: "Главная цель переезда?", options: optionsOf("goal") },
  { id: "timeline", question: "Когда планируете переезд?", options: optionsOf("timeline") },
  { id: "household", question: "Кто переезжает?", options: optionsOf("household") },
  { id: "income_source", question: "Основной источник дохода?", options: optionsOf("income_source") },
  { id: "income_monthly", question: "Доход в месяц на семью, после налогов?", options: optionsOf("income_monthly") },
  { id: "refusals", question: "Были отказы в визах или ВНЖ?", options: optionsOf("refusals") },
  {
    id: "main_question",
    question: "Последнее: в двух-трёх предложениях — с чем нужна помощь или где застряли?",
  },
];

/** Map site goals (invest pages, property CTAs) to a screening goal option. */
const GOAL_HINTS: Record<string, string> = {
  invest: "Инвестиции",
  property: "Инвестиции",
};

export type RequestPayload = {
  answers: Record<string, string>;
  source?: string;
  awaitingOther?: string;
  reminded?: boolean;
};

function payloadOf(raw: Record<string, unknown> | undefined): RequestPayload {
  const p = (raw ?? {}) as Partial<RequestPayload>;
  return { answers: { ...(p.answers ?? {}) }, source: p.source, awaitingOther: p.awaitingOther, reminded: p.reminded };
}

function nextStep(payload: RequestPayload): Step | null {
  return REQUEST_STEPS.find((step) => !payload.answers[step.id]) ?? null;
}

function progress(payload: RequestPayload): string {
  const done = REQUEST_STEPS.filter((step) => payload.answers[step.id]).length;
  return `${Math.min(done + 1, REQUEST_STEPS.length)}/${REQUEST_STEPS.length}`;
}

async function save(ctx: BotUserCtx, payload: RequestPayload, step: string): Promise<void> {
  await setSession({
    telegramUserId: ctx.userId,
    app: "request",
    step,
    payload: payload as unknown as Record<string, unknown>,
    ttlMs: REQUEST_TTL_MS,
  });
}

async function ask(ctx: BotUserCtx, payload: RequestPayload): Promise<void> {
  const step = nextStep(payload);
  if (!step) {
    await askConsent(ctx, payload);
    return;
  }
  await save(ctx, payload, step.id);
  const rows = (step.options ?? []).map((option, index) => [{ text: option, callback_data: `rs:${step.id}:${index}` }]);
  if (step.other) rows.push([{ text: step.other, callback_data: `rs:${step.id}:other` }]);
  await sendStatsBotMessage(ctx.chatId, `<b>${progress(payload)}</b> · ${step.question}`, {
    parseMode: "HTML",
    replyMarkup: rows.length ? inlineRows(rows) : undefined,
  });
}

async function askConsent(ctx: BotUserCtx, payload: RequestPayload): Promise<void> {
  await save(ctx, payload, "consent");
  const lines = REQUEST_STEPS.map((step) => {
    const label = SCREENING_FIELDS.find((field) => field.id === step.id)?.label ?? step.id;
    return `• ${label}: ${payload.answers[step.id] ?? "—"}`;
  });
  await sendStatsBotMessage(
    ctx.chatId,
    [
      "<b>Проверьте заявку</b>",
      ...lines.map((line) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;")),
      "",
      "Нажимая «Отправить», вы соглашаетесь с политикой конфиденциальности emigro.online/ru/privacy и с тем, что Emigro передаст запрос подходящему специалисту. Для вас бесплатно: комиссию Emigro платит специалист. Emigro не юридическая фирма.",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([
        [{ text: "✅ Отправить", callback_data: "rs:send" }],
        [{ text: "Начать заново", callback_data: "rs:restart" }],
      ]),
    }
  );
}

async function submit(ctx: BotUserCtx, payload: RequestPayload): Promise<void> {
  const answers = {
    ...payload.answers,
    name: [ctx.firstName, ctx.lastName].filter(Boolean).join(" ").trim() || ctx.username || "Без имени",
    contact: ctx.username ? `@${ctx.username}` : `tg://user?id=${ctx.userId}`,
    consultation: "Подбор специалиста (юрист или агентство)",
  };
  const saved = await saveScreeningLead({
    answers,
    channel: "bot",
    ref: payload.source,
    consentVersion: BOT_REQUEST_CONSENT_VERSION,
    telegram: { userId: ctx.userId, chatId: ctx.chatId, username: ctx.username },
  });
  await clearSession(ctx.userId);
  await sendStatsBotMessage(
    ctx.chatId,
    saved.id
      ? "Заявка отправлена. Мы посмотрим ваш случай и подберём специалиста — обычно в течение 1–2 рабочих дней. Статус придёт сюда же, а проверить его можно кнопкой «Мой запрос»."
      : "Заявка дошла до нас, но сохранилась с ошибкой. Мы всё равно её видим и ответим здесь.",
    { parseMode: null }
  );
  await sendHome(ctx);
}

/** Start the dialogue. Country / goal / source come from the site deep link when known. */
export async function startRequest(
  ctx: BotUserCtx,
  opts: { country?: string; source?: string; goal?: string } = {}
): Promise<void> {
  const payload: RequestPayload = { answers: {}, source: opts.source };
  const country = opts.country ? COUNTRY_LABELS[opts.country] : undefined;
  if (country) payload.answers.destination = country;
  const goal = opts.goal ? GOAL_HINTS[opts.goal] : undefined;
  if (goal) payload.answers.goal = goal;
  await sendStatsBotMessage(
    ctx.chatId,
    [
      "<b>Подберём специалиста по вашему переезду — бесплатно</b>",
      "Несколько коротких вопросов, большинство — кнопками. Это займёт 2 минуты. Потом мы передадим ваш случай юристу или агентству по этому маршруту, и он свяжется с вами сам.",
      "Выйти можно в любой момент: «Меню».",
    ].join("\n"),
    { parseMode: "HTML" }
  );
  await ask(ctx, payload);
}

export const COUNTRY_LABELS: Record<string, string> = {
  portugal: "Португалия",
  spain: "Испания",
  italy: "Италия",
  germany: "Германия",
  thailand: "Таиланд",
  uae: "ОАЭ",
  france: "Франция",
  netherlands: "Нидерланды",
  poland: "Польша",
  czechia: "Чехия",
  austria: "Австрия",
  greece: "Греция",
  cyprus: "Кипр",
  malta: "Мальта",
  hungary: "Венгрия",
  serbia: "Сербия",
  montenegro: "Черногория",
  georgia: "Грузия",
  armenia: "Армения",
  kazakhstan: "Казахстан",
  turkey: "Турция",
  estonia: "Эстония",
  sweden: "Швеция",
  denmark: "Дания",
  uk: "Великобритания",
};

export async function continueRequest(
  ctx: BotUserCtx,
  incoming: BotIncoming,
  raw: Record<string, unknown>,
  currentStep: string
): Promise<void> {
  const payload = payloadOf(raw);

  if (incoming.kind === "callback") {
    await answerStatsBotCallback(incoming.id);
    const data = incoming.data;
    if (data === "rs:send") {
      await submit(ctx, payload);
      return;
    }
    if (data === "rs:restart") {
      await startRequest(ctx, { source: payload.source });
      return;
    }
    const match = data.match(/^rs:([a-z_]+):(\d+|other)$/);
    if (!match) {
      await ask(ctx, payload);
      return;
    }
    const step = REQUEST_STEPS.find((s) => s.id === match[1]);
    if (!step) {
      await ask(ctx, payload);
      return;
    }
    if (match[2] === "other") {
      payload.awaitingOther = step.id;
      await save(ctx, payload, step.id);
      await sendStatsBotMessage(ctx.chatId, "Напишите ответ одним сообщением.", { parseMode: null });
      return;
    }
    const value = step.options?.[Number(match[2])];
    if (value) payload.answers[step.id] = value;
    payload.awaitingOther = undefined;
    await ask(ctx, payload);
    return;
  }

  if (incoming.kind === "message") {
    const text = incoming.text.trim().slice(0, 1500);
    const step =
      REQUEST_STEPS.find((s) => s.id === payload.awaitingOther) ??
      REQUEST_STEPS.find((s) => s.id === currentStep && !s.options);
    if (step && text) {
      payload.answers[step.id] = text;
      payload.awaitingOther = undefined;
      await ask(ctx, payload);
      return;
    }
    if (currentStep === "consent") {
      await askConsent(ctx, payload);
      return;
    }
    await sendStatsBotMessage(ctx.chatId, "Выберите вариант кнопкой выше или нажмите последнюю кнопку, чтобы написать свой.", {
      parseMode: null,
    });
    return;
  }

  await ask(ctx, payload);
}
