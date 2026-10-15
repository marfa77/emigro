import {
  GOLDEN_VISA_ROWS,
  goldenVisaRow,
  investPagePath,
  type InvestLocale,
  type InvestPageKey,
} from "@/lib/investment/golden-visa-2026";
import { signInvestPdfUrl } from "@/lib/investment/pdf-link";
import { investBotStartPayload, QUICK_PAGE_KEYS } from "@/lib/investment/quick-lead";
import { submitInvestmentLeadLite } from "@/lib/leads/submit-investment";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { publicSiteUrl } from "@/lib/site-url";
import { sendOwnerTelegramDm } from "@/lib/telegram";
import {
  answerStatsBotCallback,
  sendStatsBotDocument,
  sendStatsBotMessage,
  type TelegramInlineKeyboard,
} from "@/lib/telegram/admin-bot";
import { upsertBotUser } from "@/lib/telegram/bot/users";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

const CALLBACK_PREFIX = "iv:req:";

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function siteUrl(locale: InvestLocale, key: InvestPageKey): string {
  const url = new URL(`${publicSiteUrl()}${investPagePath(locale, key)}`);
  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "invest_quick");
  url.searchParams.set("utm_campaign", key);
  return url.toString();
}

function contactOf(ctx: BotUserCtx): string {
  return ctx.username ? `@${ctx.username}` : `tg://user?id=${ctx.userId}`;
}

export function investCallbackData(key: InvestPageKey, locale: InvestLocale): string {
  return `${CALLBACK_PREFIX}${key}:${locale}`;
}

function parseCallback(data: string): { key: InvestPageKey; locale: InvestLocale } | null {
  if (!data.startsWith(CALLBACK_PREFIX)) return null;
  const [key, locale] = data.slice(CALLBACK_PREFIX.length).split(":");
  if (!QUICK_PAGE_KEYS.includes(key as InvestPageKey)) return null;
  if (locale !== "ru" && locale !== "en") return null;
  return { key: key as InvestPageKey, locale };
}

function overviewLines(locale: InvestLocale): string[] {
  return GOLDEN_VISA_ROWS.map(
    (row) =>
      `${row.flag} <b>${esc(row.country[locale])}</b> — ${esc(row.minInvestment[locale])}${
        row.ruBy.status === "restricted" ? (locale === "ru" ? " · РФ/РБ: ограничено" : " · RU/BY: restricted") : ""
      }`
  );
}

export function investIntroHtml(key: InvestPageKey, locale: InvestLocale): string {
  const ru = locale === "ru";
  const row = key === "hub" || key === "compare" ? undefined : goldenVisaRow(key);
  const lines: string[] = [];
  if (row) {
    lines.push(
      `<b>${row.flag} ${esc(row.country[locale])} — ${esc(row.programme[locale])}</b>`,
      "",
      `${ru ? "Минимум" : "Minimum"}: ${esc(row.minInvestment[locale])}`,
      `${ru ? "Маршруты" : "Routes"}: ${esc(row.routes[locale])}`,
      `${ru ? "Гражданство" : "Citizenship"}: ${esc(row.citizenship[locale])}`,
      `${ru ? "Паспорта РФ/РБ" : "RU/BY passports"}: ${esc(row.ruBy[locale])}`,
      `${ru ? "Проверено" : "Checked"}: ${row.lastChecked ?? (ru ? "уточняется" : "being verified")} · <a href="${row.sources[0].url}">${ru ? "официальный источник" : "official source"}</a>`
    );
  } else {
    lines.push(
      ru
        ? "<b>ВНЖ за инвестиции 2026 — 8 программ</b>"
        : "<b>Investment residency 2026 — 8 programmes</b>",
      "",
      ...overviewLines(locale)
    );
  }
  lines.push(
    "",
    `<a href="${siteUrl(locale, key)}">${ru ? "Подробно на сайте" : "Details on the site"}</a>`,
    "",
    ru
      ? "Хотите бесплатный подбор под ваш паспорт и бюджет? Нажмите кнопку — ответим здесь в течение 1 рабочего дня. Нажимая, вы соглашаетесь на обработку данных по Политике конфиденциальности Emigro."
      : "Want a free match for your passport and budget? Tap the button — we reply here within 1 business day. By tapping you agree to data processing under the Emigro Privacy Policy.",
    ru ? "Не юридическая консультация." : "Not legal advice."
  );
  return lines.join("\n");
}

function introKeyboard(key: InvestPageKey, locale: InvestLocale): TelegramInlineKeyboard {
  return {
    inline_keyboard: [
      [
        {
          text: locale === "ru" ? "Получить подбор бесплатно" : "Get my free match",
          callback_data: investCallbackData(key, locale),
        },
      ],
      [{ text: locale === "ru" ? "Открыть на сайте" : "Open on the site", url: siteUrl(locale, key) }],
    ],
  };
}

export async function startInvest(ctx: BotUserCtx, key: InvestPageKey, locale: InvestLocale): Promise<void> {
  const startPayload = investBotStartPayload(key, locale);
  await upsertBotUser(ctx, key === "hub" || key === "compare" ? undefined : key);
  await sendOwnerTelegramDm(
    [
      "🤖 Emigro бот — инвест deep link",
      `start=${startPayload}`,
      `Пользователь: ${contactOf(ctx)}${ctx.firstName ? ` (${ctx.firstName})` : ""}`,
    ].join("\n")
  );

  if (key === "compare") {
    // Telegram fetches the file once and re-hosts it, so a short-lived link is enough.
    const pdfUrl = signInvestPdfUrl(locale, 60 * 60 * 1000);
    if (pdfUrl) {
      const sent = await sendStatsBotDocument(
        ctx.chatId,
        pdfUrl,
        locale === "ru" ? "Сравнение Golden Visa 2026 — Emigro" : "Golden Visa 2026 comparison — Emigro"
      );
      if (!sent.success) console.warn("[bot:invest] PDF send failed:", sent.error);
    } else {
      console.warn("[bot:invest] PDF not sent: no signing secret");
    }
  }

  await sendStatsBotMessage(ctx.chatId, investIntroHtml(key, locale), {
    parseMode: "HTML",
    replyMarkup: introKeyboard(key, locale),
  });
}

export function isInvestCallback(data: string): boolean {
  return data.startsWith(CALLBACK_PREFIX);
}

export async function continueInvest(ctx: BotUserCtx, incoming: BotIncoming): Promise<void> {
  if (incoming.kind !== "callback") return;
  const parsed = parseCallback(incoming.data);
  if (!parsed) {
    await answerStatsBotCallback(incoming.id);
    return;
  }
  const { key, locale } = parsed;
  const startPayload = investBotStartPayload(key, locale);
  const row = key === "hub" || key === "compare" ? undefined : goldenVisaRow(key);
  const result = await submitInvestmentLeadLite({
    name: [ctx.firstName, ctx.lastName].filter(Boolean).join(" ") || contactOf(ctx),
    contact: contactOf(ctx),
    destination: row ? row.country.ru : key,
    destinationIso2: row?.iso2,
    message: `Запрос бесплатного подбора из бота (start=${startPayload})`,
    kind: "other",
    source: "invest_tg",
    preferredLanguage: locale,
    packet: { start_payload: startPayload, country: key, locale },
    ownerTitle: `💼 Emigro — инвест-заявка из бота (source=invest_tg, ${startPayload})`,
  });
  await answerStatsBotCallback(incoming.id, locale === "ru" ? "Заявка принята" : "Request received");
  await sendStatsBotMessage(
    ctx.chatId,
    result.stored
      ? locale === "ru"
        ? "Заявка принята ✅ Пришлём бесплатный подбор маршрута в течение 1 рабочего дня сюда, в Telegram."
        : "Request received ✅ We'll send your free route match within 1 business day here in Telegram."
      : locale === "ru"
        ? `Не удалось сохранить заявку. Напишите на ${CONTACT_EMAIL} — ответим вручную.`
        : `Couldn't save the request. Email ${CONTACT_EMAIL} and we'll reply manually.`,
    { parseMode: null }
  );
}
