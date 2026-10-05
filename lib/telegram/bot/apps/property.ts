import { submitInvestmentLeadLite } from "@/lib/leads/submit-investment";
import { DUBAI_OFFER_VERDICT } from "@/lib/investment/uae-offer-verdict";
import {
  italySatelliteUrl,
  portugalSatelliteUrl,
  spainSatelliteUrl,
  thailandSatelliteUrl,
} from "@/lib/site-url";
import { answerStatsBotCallback, sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession, setSession } from "@/lib/telegram/bot/session";
import { startAssist } from "@/lib/telegram/bot/apps/assist";
import { startCity } from "@/lib/telegram/bot/apps/city";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

const FIRST_MONTH: Record<string, () => string> = {
  portugal: () => portugalSatelliteUrl("/notes/pervyj-mesyac-portugaliya-checklist"),
  spain: () => spainSatelliteUrl("/notes/pervye-30-dnej-v-ispanii-satelit-2026"),
  italy: () => italySatelliteUrl("/notes/pervye-30-dnej-v-italii-satelit-2026"),
  thailand: () => thailandSatelliteUrl("/notes/pervye-30-dnej-phuket-2026"),
};

type PropertyPayload = {
  dest?: "uae" | "thailand" | "other";
  brief?: string;
};

function asPayload(raw: Record<string, unknown> | undefined): PropertyPayload {
  return { ...(raw ?? {}) } as PropertyPayload;
}

function contactOf(ctx: BotUserCtx): string {
  const handle = ctx.username ? `@${ctx.username}` : "";
  return [handle, `tg://user?id=${ctx.userId}`].filter(Boolean).join(" ");
}

async function persist(ctx: BotUserCtx, step: string, payload: PropertyPayload): Promise<void> {
  await setSession({ telegramUserId: ctx.userId, app: "property", step, payload });
}

async function promptIntent(ctx: BotUserCtx): Promise<void> {
  await persist(ctx, "intent", {});
  await sendStatsBotMessage(
    ctx.chatId,
    [
      "<b>Недвижимость</b> — продукт, не риелторская анкета.",
      "Жить / аренда → городской чат и гайд первого месяца, заявки нет.",
      "Купить / инвест → ОАЭ, Пхукет или другой маршрут. Коротко, не 15 полей с сайта.",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([
        [
          { text: "Жить / аренда", callback_data: "pr:intent:rent" },
          { text: "Купить / инвест", callback_data: "pr:intent:buy" },
        ],
      ]),
    }
  );
}

async function promptDest(ctx: BotUserCtx): Promise<void> {
  await persist(ctx, "dest", {});
  await sendStatsBotMessage(ctx.chatId, "Куда смотрите покупку?", {
    parseMode: "HTML",
    replyMarkup: inlineRows([
      [
        { text: "ОАЭ", callback_data: "pr:dest:uae" },
        { text: "Пхукет", callback_data: "pr:dest:thailand" },
        { text: "Другое", callback_data: "pr:dest:other" },
      ],
    ]),
  });
}

async function promptRentCity(ctx: BotUserCtx): Promise<void> {
  await persist(ctx, "rent_city", {});
  await sendStatsBotMessage(
    ctx.chatId,
    "Аренда: выберите город — пришлём инвайт и гайд первого месяца. Лида нет.",
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([
        [
          { text: "Порту", callback_data: "pr:rent:portugal" },
          { text: "Валенсия", callback_data: "pr:rent:spain" },
        ],
        [
          { text: "Милан", callback_data: "pr:rent:italy" },
          { text: "Пхукет", callback_data: "pr:rent:thailand" },
        ],
      ]),
    }
  );
}

export async function startProperty(ctx: BotUserCtx, dest?: "uae" | "thailand"): Promise<void> {
  if (dest === "uae" || dest === "thailand") {
    await handleBuyDest(ctx, dest);
    return;
  }
  await promptIntent(ctx);
}

async function finishRent(ctx: BotUserCtx, countryKey: string): Promise<void> {
  const guide = FIRST_MONTH[countryKey];
  if (guide) {
    await sendStatsBotMessage(
      ctx.chatId,
      `Гайд первого месяца: <a href="${guide()}">${guide()}</a>\nЗаявку на аренду не создаём — это чат и чеклист.`,
      { parseMode: "HTML" }
    );
  }
  await clearSession(ctx.userId);
  await startCity(ctx, countryKey);
}

async function handleBuyDest(ctx: BotUserCtx, dest: "uae" | "thailand" | "other"): Promise<void> {
  if (dest === "thailand") {
    await clearSession(ctx.userId);
    await sendStatsBotMessage(
      ctx.chatId,
      "Пхукет: подбор через Assist + Empyreal. Коротко опишите бюджет и что ищете — заявка уйдёт как помощь, не как 15 полей /ru/invest.",
      { parseMode: "HTML" }
    );
    await startAssist(ctx, {
      country: "thailand",
      programRoute: "Недвижимость на Пхукете — Empyreal Estate",
    });
    return;
  }
  await persist(ctx, "brief", { dest });
  if (dest === "uae") {
    await sendStatsBotMessage(
      ctx.chatId,
      [
        `<b>ОАЭ</b> — сверка оффера: <a href="${DUBAI_OFFER_VERDICT.url}">${DUBAI_OFFER_VERDICT.domain}</a>`,
        "Одним сообщением: бюджет и цель (жить / сдать / Golden / только актив). Это короткий инвест-лид, не полная анкета сайта.",
      ].join("\n"),
      { parseMode: "HTML" }
    );
    return;
  }
  await sendStatsBotMessage(
    ctx.chatId,
    "Одним сообщением: страна, бюджет и цель. Короткий инвест-лид, без 15 полей с /ru/invest.",
    { parseMode: "HTML" }
  );
}

async function submitLite(ctx: BotUserCtx, payload: PropertyPayload, brief: string): Promise<void> {
  const dest = payload.dest || "other";
  const name = (ctx.firstName || ctx.username || "Telegram").trim();
  const result = await submitInvestmentLeadLite({
    name,
    contact: contactOf(ctx),
    destination: dest === "uae" ? "UAE" : dest === "thailand" ? "Thailand" : "other",
    destinationIso2: dest === "uae" ? "AE" : dest === "thailand" ? "TH" : undefined,
    message: brief,
    kind: dest,
    source: "emigro_bot_property",
  });
  await clearSession(ctx.userId);
  await sendStatsBotMessage(
    ctx.chatId,
    result.stored
      ? "✅ Заявку записали. Свяжемся в этом Telegram. Не оферта и не юрконсультация."
      : "⚠️ Сообщение получили, но запись могла не сохраниться. Напишите ещё раз или откройте Помощь.",
    { parseMode: "HTML" }
  );
  await sendHome(ctx);
}

export async function continueProperty(
  ctx: BotUserCtx,
  incoming: BotIncoming,
  rawPayload?: Record<string, unknown>
): Promise<void> {
  const payload = asPayload(rawPayload);
  if (incoming.kind === "callback") {
    await answerStatsBotCallback(incoming.id);
    if (incoming.data === "pr:intent:rent") {
      await promptRentCity(ctx);
      return;
    }
    if (incoming.data === "pr:intent:buy") {
      await promptDest(ctx);
      return;
    }
    if (incoming.data.startsWith("pr:dest:")) {
      const dest = incoming.data.slice("pr:dest:".length);
      if (dest === "uae" || dest === "thailand" || dest === "other") {
        await handleBuyDest(ctx, dest);
      }
      return;
    }
    if (incoming.data.startsWith("pr:rent:")) {
      await finishRent(ctx, incoming.data.slice("pr:rent:".length));
      return;
    }
    await promptIntent(ctx);
    return;
  }
  const text = incoming.text.trim();
  if (payload.dest && text) {
    await submitLite(ctx, payload, text.slice(0, 2000));
    return;
  }
  await promptIntent(ctx);
}
