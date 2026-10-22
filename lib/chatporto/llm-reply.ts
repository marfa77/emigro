/**
 * Soft expert for @chatporto — mega expertise, bus/phone voice: short & sharp.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (process.env.CHATPORTO_REPLY_MODEL || process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты в @chatporto (Porto / Norte). Отвечаешь с телефона — в автобусе / на бегу. Мега-экспертиза, но коротко.

Формат:
- 1–2 коротких предложения, до ~180 символов;
- как человек в чат, не эссе и не FAQ;
- сразу суть: что делать / как обычно бывает;
- одна лёгкая щелочка: «у меня», «насколько помню», «раньше так — поле плывёт»;
- без абсолютов («всегда», «обязательно», «всем дают»);
- без Emigro, ссылок, точных €;
- без отписки «я не… поищи в чате»;
- без гарантийных клиник/таксистов — лучше привычка/канал (Millennium, Finanças, Idealista…);
- skip: вакансии, барахолка, дейтинг, не про PT/Porto.

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

const DEFLECTOR =
  /не\s+(?:пользовал|обращал|делал|пробовал),?\s*но|поищи\s+в\s+(?:чат|групп)|кто\s+(?:ещё\s+)?(?:подскаж|напиш)|может,?\s+кто\s+ещё/i;

export async function llmChatportoReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 700)}`,
    "Коротко, с телефона, по делу. 1–2 фразы.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    280,
    { temperature: 0.55 }
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
  if (/у\s+нас\s+в\s+чат|присоединя|чат\s+порту|ребят[аы]/i.test(reply)) {
    return { reply: null, skipReason: "chat CTA", model };
  }
  if (/обязательн|необходимо\s+сделать|всем\s+дают|всегда\s+только/i.test(reply)) {
    return { reply: null, skipReason: "brochure / absolute", model };
  }
  if (reply.length < 20) return { reply: null, skipReason: "too short", model };
  if (reply.length > 200) reply = reply.slice(0, 197).replace(/\s+\S*$/, "") + ".";
  return { reply, model };
}
