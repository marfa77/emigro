import { createAdminClient } from "@/lib/admin/supabase";
import { trackServerEvent } from "@/lib/analytics/server";
import { publicSiteUrl } from "@/lib/site-url";
import { sendOwnerTelegramDm, sendOwnerTelegramHtmlWithButtons } from "@/lib/telegram";
import { looksLikeTelegramPublicContact } from "@/lib/telegram/public-url";
import { SCREENING_FIELDS, SCREENING_SCHEMA_VERSION, type ScreeningAnswers } from "@/lib/screening/questions";

export type ScreeningChannel = "web" | "bot";

export type SaveScreeningInput = {
  answers: ScreeningAnswers;
  channel: ScreeningChannel;
  /** Link tag (?ref=) or bot entry source (guide slug, wizard, satellite…). */
  ref?: string;
  consentVersion: string;
  /** Present when the request came through @emigro_chat_bot — lets Emigro message the person back. */
  telegram?: { userId: number; chatId: number; username?: string };
};

export type SaveScreeningResult = { id: string | null; error?: string };

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Owner buttons on a screening DM: hand off, ask for details, decline. Callback prefix `rq:`. */
export function requestOwnerKeyboard(leadId: string) {
  return [
    [{ text: "✅ Передан специалисту", callback_data: `rq:ok:${leadId}` }],
    [
      { text: "❓ Нужно уточнить", callback_data: `rq:info:${leadId}` },
      { text: "✖️ Не наш случай", callback_data: `rq:no:${leadId}` },
    ],
  ];
}

/** Store a screening (web questionnaire or bot dialogue) and DM the owner with hand-off buttons. */
export async function saveScreeningLead(input: SaveScreeningInput): Promise<SaveScreeningResult> {
  const { answers, channel, telegram } = input;
  const ref = (input.ref ?? "").slice(0, 80);
  const contact =
    answers.contact || (telegram?.username ? `@${telegram.username}` : telegram ? `tg://user?id=${telegram.userId}` : "");
  const sourceBase = channel === "bot" ? "screening:bot" : "screening";

  let leadId: string | null = null;
  let storageError = "";
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_manual_leads")
      .insert({
        lead_type: "screening",
        source: ref ? `${sourceBase}:${ref}` : sourceBase,
        status: "new",
        name: answers.name || "Без имени",
        email: contact,
        telegram: telegram?.username
          ? `@${telegram.username}`
          : looksLikeTelegramPublicContact(contact)
            ? contact
            : null,
        preferred_language: "ru",
        notes: answers.main_question ?? null,
        lead_packet: {
          schema_version: SCREENING_SCHEMA_VERSION,
          channel,
          ref: ref || null,
          answers: { ...answers, contact },
          telegram: telegram ? { user_id: telegram.userId, chat_id: telegram.chatId, username: telegram.username ?? null } : null,
        },
        consent_at: new Date().toISOString(),
        consent_version: input.consentVersion,
      })
      .select("id")
      .single();
    if (error) storageError = error.message;
    else leadId = data.id as string;
  } catch (err) {
    storageError = err instanceof Error ? err.message : "storage failed";
  }

  await trackServerEvent("screening_submitted", {
    lead_id: leadId ?? "",
    stored: Boolean(leadId),
    ref,
    channel,
  });

  // Questionnaire order (answers may come back from jsonb with keys reordered).
  const rows = SCREENING_FIELDS.filter((field) => answers[field.id] && field.id !== "name" && field.id !== "contact").map(
    (field) => `<b>${escapeHtml(field.label)}:</b> ${escapeHtml(answers[field.id])}`
  );
  const html = [
    `📋 <b>Заявка на подбор специалиста</b> · ${channel === "bot" ? "бот" : "сайт"}`,
    `${escapeHtml(answers.name || "Без имени")} · ${escapeHtml(contact)}`,
    ...rows,
    ref ? `Источник: ${escapeHtml(ref)}` : "",
    leadId
      ? `${publicSiteUrl()}/admin/screening#${leadId}`
      : `⚠ Не сохранилось в базе: ${escapeHtml(storageError)}`,
    telegram && leadId ? "Кнопки ниже отправят человеку статус в бот." : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (leadId) {
    const sent = await sendOwnerTelegramHtmlWithButtons(html, requestOwnerKeyboard(leadId));
    if (!sent.success) await sendOwnerTelegramDm(html.replace(/<\/?b>/g, ""));
  } else {
    await sendOwnerTelegramDm(html.replace(/<\/?b>/g, ""));
  }

  return leadId ? { id: leadId } : { id: null, error: storageError };
}
