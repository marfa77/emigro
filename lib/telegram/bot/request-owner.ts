/**
 * Owner side of the specialist-request flow: buttons under the screening DM (`rq:ok|info|no:<leadId>`)
 * update the lead and, when the request came through the bot, tell the person what happens next.
 * Also serves «Мой запрос» for users.
 */
import { createAdminClient } from "@/lib/admin/supabase";
import { answerStatsBotCallback, isAdminTelegramChat, sendStatsBotMessage } from "@/lib/telegram/admin-bot";

type RequestDecision = "ok" | "info" | "no";

const DECISIONS: Record<RequestDecision, { status: string; label: string; userText: string }> = {
  ok: {
    status: "assigned",
    label: "Передан специалисту",
    userText:
      "Ваш запрос передан специалисту по вашему маршруту. Он свяжется с вами сам в течение 1–3 рабочих дней. Для вас это бесплатно; условия его работы обсуждаете с ним напрямую.",
  },
  info: {
    status: "contacted",
    label: "Нужно уточнить",
    userText:
      "Мы посмотрели ваш запрос — чтобы подобрать специалиста точнее, нужно кое-что уточнить. Мы напишем вам в ближайшее время.",
  },
  no: {
    status: "closed",
    label: "Не наш случай",
    userText:
      "Спасибо за запрос. К сожалению, по вашему направлению у нас сейчас нет подходящего специалиста. Посмотрите гиды на emigro.online — там пошаговые разборы с официальными источниками.",
  },
};

export function isRequestOwnerCallback(data: string): boolean {
  return /^rq:(ok|info|no):[0-9a-f-]{36}$/i.test(data.trim());
}

export async function handleRequestOwnerCallback(args: {
  data: string;
  chatId: string | number;
  userId?: string | number;
  callbackQueryId: string;
}): Promise<boolean> {
  const match = args.data.trim().match(/^rq:(ok|info|no):([0-9a-f-]{36})$/i);
  if (!match) return false;
  if (!isAdminTelegramChat(args.chatId, args.userId)) {
    await answerStatsBotCallback(args.callbackQueryId);
    return true;
  }
  const decision = DECISIONS[match[1].toLowerCase() as RequestDecision];
  const leadId = match[2];

  const supabase = createAdminClient();
  const { data: lead, error } = await supabase
    .from("emigro_manual_leads")
    .select("id, name, lead_packet")
    .eq("id", leadId)
    .maybeSingle();
  if (error || !lead) {
    await answerStatsBotCallback(args.callbackQueryId);
    await sendStatsBotMessage(args.chatId, `Заявка ${leadId} не найдена.`, { parseMode: null });
    return true;
  }

  const packet = (lead.lead_packet ?? {}) as Record<string, unknown>;
  const history = Array.isArray(packet.status_history) ? (packet.status_history as unknown[]) : [];
  await supabase
    .from("emigro_manual_leads")
    .update({
      status: decision.status,
      lead_packet: {
        ...packet,
        request_status: decision.label,
        status_history: [...history, { status: decision.label, at: new Date().toISOString() }],
      },
    })
    .eq("id", leadId);

  const telegram = packet.telegram as { chat_id?: number } | null | undefined;
  let notified = false;
  if (telegram?.chat_id) {
    const sent = await sendStatsBotMessage(telegram.chat_id, decision.userText, { parseMode: null });
    notified = sent.success;
  }
  await answerStatsBotCallback(args.callbackQueryId);
  await sendStatsBotMessage(
    args.chatId,
    `${decision.label}: ${lead.name}. ${
      telegram?.chat_id ? (notified ? "Человеку отправлен статус в бот." : "Статус в бот отправить не удалось.") : "Заявка с сайта — напишите человеку сами."
    }`,
    { parseMode: null }
  );
  return true;
}

/** «Мой запрос»: the latest bot request of this Telegram user and its status. */
export async function sendMyRequestStatus(chatId: number, userId: number): Promise<void> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("emigro_manual_leads")
    .select("created_at, status, lead_packet")
    .eq("lead_type", "screening")
    .contains("lead_packet", { telegram: { user_id: userId } })
    .order("created_at", { ascending: false })
    .limit(1);
  const lead = data?.[0];
  if (!lead) {
    await sendStatsBotMessage(chatId, "У вас пока нет заявок. Нажмите «Подобрать специалиста», чтобы оставить запрос — это бесплатно.", {
      parseMode: null,
    });
    return;
  }
  const packet = (lead.lead_packet ?? {}) as Record<string, unknown>;
  const answers = (packet.answers ?? {}) as Record<string, string>;
  const status =
    (packet.request_status as string | undefined) ??
    (lead.status === "new" ? "Получена, смотрим ваш случай" : String(lead.status));
  const date = new Date(lead.created_at as string).toLocaleDateString("ru-RU");
  await sendStatsBotMessage(
    chatId,
    [`Ваш запрос от ${date}`, answers.destination ? `Направление: ${answers.destination}` : "", `Статус: ${status}`]
      .filter(Boolean)
      .join("\n"),
    { parseMode: null }
  );
}
