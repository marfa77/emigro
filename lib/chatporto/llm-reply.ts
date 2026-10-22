/**
 * Short soft-expert reply for @chatporto — 1–2 phrases, owner pastes manually.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (process.env.CHATPORTO_REPLY_MODEL || process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты обычный человек в русском Telegram @chatporto (Порту / Norte). Ответ вставит владелец от себя.

Отвечай ТОЛЬКО если вопрос про инвентарь Emigro: NIF, аренда/fiador, районы Porto, SNS/utente, AIMA/Agora, банк/IBAN, интернет MEO/NOS, машина/portagens, школа Porto–Braga, климат/плесень.

Стиль:
- 1–2 фразы, до ~240 символов;
- «у меня», «насколько помню», «в Porto часто»;
- без Emigro, ссылок, точных €, названий клиник/врачей/таксистов которых не знаешь;
- не выдумывай CUF, Idealista-агентов, «проверенных» контактов.

SKIP (JSON skip:true) если:
- просят контакт такси / врача / трихолога / парикмахера / няни;
- дейтинг, вакансии, куплю-продам;
- нет реального полевого совета без выдумки;
- вопрос не про PT/Porto быт из списка выше.

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

export async function llmChatportoReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема инвентаря: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 900)}`,
    "Если не уверен без выдумки — skip. Иначе 1–2 фразы.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    320,
    { temperature: 0.45 }
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

  if (/у\s+нас\s+в\s+чат|присоединя|чат\s+порту/i.test(reply)) {
    return { reply: null, skipReason: "chat CTA", model };
  }
  // Invented service names — common hallucination pattern
  if (/\b(?:cuf|luz\s+saúde|trofa|hospital\s+da\s+luz)\b/i.test(reply) && /трихолог|дерматолог|врач|клиник/i.test(params.question + reply)) {
    return { reply: null, skipReason: "invented clinic", model };
  }
  if (reply.length < 20) return { reply: null, skipReason: "too short", model };
  if (reply.length > 260) reply = reply.slice(0, 257).replace(/\s+\S*$/, "") + ".";
  return { reply, model };
}
