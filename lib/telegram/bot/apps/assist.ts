import { submitAssistLead } from "@/lib/leads/submit-assist";
import { newsBotTopicByKey, resolveNewsBotTopic } from "@/lib/news/bot-subscribe-topics";
import { answerStatsBotCallback, sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession, setSession } from "@/lib/telegram/bot/session";
import type { AssistPlanTier, BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

const TIERS: Array<{ id: AssistPlanTier; label: string }> = [
  { id: "partner-match", label: "Партнёр · бесплатно" },
  { id: "route-check", label: "Route Check · €129" },
  { id: "accompaniment", label: "Сопровождение · €100/ч" },
];

const COUNTRIES: Array<{ key: string; label: string; iso2: string }> = [
  { key: "portugal", label: "Португалия", iso2: "PT" },
  { key: "spain", label: "Испания", iso2: "ES" },
  { key: "italy", label: "Италия", iso2: "IT" },
  { key: "thailand", label: "Таиланд", iso2: "TH" },
];

const SUCCESS: Record<AssistPlanTier, string> = {
  "partner-match":
    "Запрос отправлен. Emigro посмотрит задачу и свяжет с партнёром, если есть по направлению. Это бесплатно.",
  "route-check":
    "Заявка отправлена. Слот и оплата €129 — после согласования. В боте деньги не берём. PDF с разбором — в течение 48 часов после созвона.",
  accompaniment:
    "Заявка отправлена. Уточним задачу и формат. Оплата €100/час — после согласования, не в этом чате.",
};

export type AssistPayload = {
  tier?: AssistPlanTier;
  country?: string;
  countryLabel?: string;
  iso2?: string;
  name?: string;
  brief?: string;
  sessionId?: string;
  programRoute?: string;
};

function asPayload(raw: Record<string, unknown> | undefined): AssistPayload {
  return { ...(raw ?? {}) } as AssistPayload;
}

function contactOf(ctx: BotUserCtx): string {
  const handle = ctx.username ? `@${ctx.username}` : "";
  return [handle, `tg://user?id=${ctx.userId}`].filter(Boolean).join(" ");
}

function displayName(ctx: BotUserCtx, payload: AssistPayload): string {
  return (payload.name || ctx.firstName || "").trim();
}

function nextAssistStep(payload: AssistPayload, ctx: BotUserCtx): string {
  if (!payload.tier) return "plan";
  if (!payload.country) return "country";
  if (payload.country === "other" && !payload.countryLabel) return "country_other";
  if (!displayName(ctx, payload)) return "name";
  if (!payload.brief) return "brief";
  return "consent";
}

async function promptPlan(ctx: BotUserCtx): Promise<void> {
  await sendStatsBotMessage(
    ctx.chatId,
    [
      "<b>Помощь Emigro Assist</b>",
      "Не юридическая консультация. Три тарифа — те же, что на сайте.",
      "",
      "1) Партнёр бесплатно — подберём специалиста и передадим контакт только с вашего согласия.",
      "2) Route Check €129 — созвон + PDF. Оплата после слота.",
      "3) Сопровождение €100/ч — письма, формы, консульство. Оплата после формата.",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([TIERS.map((t) => ({ text: t.label, callback_data: `as:plan:${t.id}` }))]),
    }
  );
}

async function promptCountry(ctx: BotUserCtx): Promise<void> {
  await sendStatsBotMessage(ctx.chatId, "Страна маршрута?", {
    parseMode: "HTML",
    replyMarkup: inlineRows([
      COUNTRIES.map((c) => ({ text: c.label, callback_data: `as:country:${c.key}` })),
      [{ text: "Другая", callback_data: "as:country:other" }],
    ]),
  });
}

async function promptName(ctx: BotUserCtx): Promise<void> {
  await sendStatsBotMessage(ctx.chatId, "Как к вам обращаться? Напишите имя одним сообщением.", {
    parseMode: "HTML",
  });
}

async function promptBrief(ctx: BotUserCtx): Promise<void> {
  await sendStatsBotMessage(
    ctx.chatId,
    "Одним сообщением: паспорт, доход / накопления, срок и в чём затык.",
    { parseMode: "HTML" }
  );
}

async function promptConsent(ctx: BotUserCtx, payload: AssistPayload): Promise<void> {
  const tier = payload.tier ? TIERS.find((t) => t.id === payload.tier)?.label : "тариф";
  const country = payload.countryLabel || payload.country || "страна";
  await sendStatsBotMessage(
    ctx.chatId,
    [
      "<b>Проверьте заявку</b>",
      `Тариф: ${tier}`,
      `Страна: ${country}`,
      `Имя: ${displayName(ctx, payload) || "—"}`,
      "",
      payload.brief || "",
      "",
      "Отправить? Контакт из этого чата: username и Telegram id. Деньги в боте не берём.",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([
        [
          { text: "Отправить", callback_data: "as:consent:yes" },
          { text: "Отмена", callback_data: "as:consent:no" },
        ],
      ]),
    }
  );
}

async function persist(ctx: BotUserCtx, step: string, payload: AssistPayload): Promise<void> {
  await setSession({ telegramUserId: ctx.userId, app: "assist", step, payload });
}

async function showStep(ctx: BotUserCtx, payload: AssistPayload): Promise<void> {
  const step = nextAssistStep(payload, ctx);
  await persist(ctx, step, payload);
  if (step === "plan") return promptPlan(ctx);
  if (step === "country") return promptCountry(ctx);
  if (step === "country_other") {
    await sendStatsBotMessage(ctx.chatId, "Напишите страну текстом.", { parseMode: "HTML" });
    return;
  }
  if (step === "name") return promptName(ctx);
  if (step === "brief") return promptBrief(ctx);
  return promptConsent(ctx, payload);
}

function applyCountry(payload: AssistPayload, raw: string): AssistPayload {
  if (raw === "other") return { ...payload, country: "other", countryLabel: undefined, iso2: undefined };
  const topic = newsBotTopicByKey(raw) || resolveNewsBotTopic(raw);
  const known = COUNTRIES.find((c) => c.key === raw || c.key === topic?.key);
  if (known) {
    return { ...payload, country: known.key, countryLabel: known.label, iso2: known.iso2 };
  }
  if (topic) {
    return { ...payload, country: topic.key, countryLabel: topic.countryRu };
  }
  return { ...payload, country: raw, countryLabel: raw };
}

export async function startAssist(
  ctx: BotUserCtx,
  seed?: { country?: string; tier?: AssistPlanTier; sessionId?: string; programRoute?: string }
): Promise<void> {
  const payload: AssistPayload = { sessionId: seed?.sessionId, programRoute: seed?.programRoute };
  if (seed?.tier) payload.tier = seed.tier;
  if (seed?.country) Object.assign(payload, applyCountry(payload, seed.country));
  if (!payload.name && ctx.firstName) payload.name = ctx.firstName;
  await showStep(ctx, payload);
}

async function submit(ctx: BotUserCtx, payload: AssistPayload): Promise<void> {
  const tier = payload.tier || "partner-match";
  const name = displayName(ctx, payload) || "Telegram";
  const country = payload.countryLabel || payload.country || "не указана";
  const result = await submitAssistLead({
    country,
    destinationIso2: payload.iso2,
    programRoute: payload.programRoute || "telegram-bot",
    planTier: tier,
    name,
    contact: contactOf(ctx),
    message: payload.brief || "",
    source: "emigro_assist_bot",
    sessionId: payload.sessionId,
    preferredLanguage: "ru",
  });
  await clearSession(ctx.userId);
  await sendStatsBotMessage(
    ctx.chatId,
    [
      `<b>${result.stored ? "✅ Заявка принята" : "⚠️ Заявку получили, но запись могла не сохраниться"}</b>`,
      "",
      SUCCESS[tier],
    ].join("\n"),
    { parseMode: "HTML" }
  );
  await sendHome(ctx, "Можно открыть новости или чат города.");
}

export async function continueAssist(
  ctx: BotUserCtx,
  incoming: BotIncoming,
  rawPayload?: Record<string, unknown>
): Promise<void> {
  const payload = asPayload(rawPayload);
  if (incoming.kind === "callback") {
    await answerStatsBotCallback(incoming.id);
    if (incoming.data.startsWith("as:plan:")) {
      const tier = incoming.data.slice("as:plan:".length) as AssistPlanTier;
      if (tier === "partner-match" || tier === "route-check" || tier === "accompaniment") {
        await showStep(ctx, { ...payload, tier });
      }
      return;
    }
    if (incoming.data.startsWith("as:country:")) {
      await showStep(ctx, applyCountry(payload, incoming.data.slice("as:country:".length)));
      return;
    }
    if (incoming.data === "as:consent:yes") {
      if (!payload.brief) {
        await showStep(ctx, payload);
        return;
      }
      await submit(ctx, payload);
      return;
    }
    if (incoming.data === "as:consent:no") {
      await clearSession(ctx.userId);
      await sendHome(ctx, "Заявку не отправили.");
      return;
    }
    await showStep(ctx, payload);
    return;
  }

  const text = incoming.text.trim();
  const step = nextAssistStep(payload, ctx);
  if (step === "country_other") {
    await showStep(ctx, { ...payload, country: "other", countryLabel: text });
    return;
  }
  if (step === "name") {
    await showStep(ctx, { ...payload, name: text.slice(0, 80) });
    return;
  }
  if (step === "brief") {
    await showStep(ctx, { ...payload, brief: text.slice(0, 2000) });
    return;
  }
  await showStep(ctx, payload);
}
