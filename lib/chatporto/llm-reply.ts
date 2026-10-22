/**
 * Short soft-expert reply for @chatporto — 1–2 phrases, owner pastes manually.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (process.env.CHATPORTO_REPLY_MODEL || process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты релокант в Porto с полевым опытом. Ответ вставит человек в @chatporto от своего имени.

Правило №1: либо конкретный ответ по делу, либо SKIP. Середины нет.

Запрещено (сразу skip):
- «я не пользовался / не обращался / не знаю, но…»;
- «поищи в чате / в группе раньше писали / кто подскажет»;
- «может кто ещё скажет»;
- выдуманные клиники, врачи, таксисты, «проверенные контакты»;
- пустая отписка без факта.

Можно отвечать только по быту Porto/Norte из опыта: NIF, аренда/fiador, районы, SNS/utente, AIMA/Agora, банк/IBAN, интернет, машина/portagens, школа, климат/плесень.
Тон: 1–2 фразы, до ~240 символов, «у меня», «насколько помню», без Emigro/ссылок/точных €.

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

/** Soft deflectors — not an expert answer. */
const DEFLECTOR =
  /не\s+(?:пользовал|обращал|делал|знаю|пробовал)|поищи\s+в\s+(?:чат|групп)|в\s+групп[еы]\s+(?:раньше|иногда)|кто\s+(?:ещё\s+)?(?:подскаж|напиш)|может,?\s+кто|не\s+знаю,?\s+но|контакты,?\s+поищи/i;

export async function llmChatportoReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 900)}`,
    "Нет полевого факта — skip. Не пиши «я не… но поищи».",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    320,
    { temperature: 0.4 }
  );

  if (data.skip === true || !data.reply?.trim()) {
    return { reply: null, skipReason: data.reason || "model skip", model };
  }

  let reply = data.reply.trim();
  reply = reply
    .replace(/^["«]|["»]$/g, "")
    .replace(/^(привет[!.]?\s*|всем\s+привет[!.]?\s*|добр(ый|ое)\s+(день|утро|вечер)[!.]?\s*)/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bemigro\b/gi, "")
    .replace(/€\s?\d[\d.,]*\s*(?:k|к|тыс\.?|тысяч)?/gi, "")
    .replace(/\b\d[\d.,]*\s*€/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
  if (reply) reply = reply.charAt(0).toUpperCase() + reply.slice(1);

  if (DEFLECTOR.test(reply)) {
    return { reply: null, skipReason: "deflector / no expertise", model };
  }
  if (/у\s+нас\s+в\s+чат|присоединя|чат\s+порту/i.test(reply)) {
    return { reply: null, skipReason: "chat CTA", model };
  }
  if (/\b(?:cuf|luz\s+saúde|trofa|hospital\s+da\s+luz)\b/i.test(reply)) {
    return { reply: null, skipReason: "invented clinic", model };
  }
  if (reply.length < 24) return { reply: null, skipReason: "too short", model };
  if (reply.length > 260) reply = reply.slice(0, 257).replace(/\s+\S*$/, "") + ".";
  return { reply, model };
}
