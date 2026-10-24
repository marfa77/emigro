/**
 * Soft expert for @chatporto — shorter & sharper than milan4at.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (process.env.CHATPORTO_REPLY_MODEL || process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты в @chatporto (Porto / Norte). Отвечаешь с телефона в автобусе. Короче и конкретнее, чем длинный чат-ответ.

Формат:
- 1 короткое предложение, максимум 2; до ~120 символов;
- сразу конкретный ход: банк/сервис/район/шаг (Millennium, Finanças, Idealista, Activobank…);
- одна лёгкая щелочка: «слышал», «раньше так», «поле плывёт» — НЕ «у меня так»;
- без абсолютов («всегда», «обязательно», «всем дают»);
- без Emigro, URL, точных €;
- НИКОГДА не ссылайся на сам чат/группу («поищи в чате», «тут писали», «спросите у ребят», «в группе уже было»);
- без гарантийных клиник/таксистов;
- skip: вакансии, барахолка, дейтинг, не про PT/Porto.

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

const DEFLECTOR =
  /не\s+(?:пользовал|обращал|делал|пробовал),?\s*но|поищи\s+в\s+(?:чат|групп)|кто\s+(?:ещё\s+)?(?:подскаж|напиш)|может,?\s+кто\s+ещё/i;

const CHAT_META =
  /(?:в|у)\s+(?:этом\s+)?(?:чат|групп)|тут\s+(?:уже\s+)?(?:писали|обсуждали)|здесь\s+(?:уже\s+)?(?:было|писали)|спроси(?:те)?\s+(?:в\s+)?(?:чат|групп|ребят)|чатпорт|chatporto|у\s+нас\s+в\s+чат|присоединя|ребят[аы]/i;

export async function llmChatportoReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 700)}`,
    "Одно короткое конкретное предложение. Без отсылок к чату.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    220,
    { temperature: 0.5 }
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

  if (DEFLECTOR.test(reply) || CHAT_META.test(reply)) {
    return { reply: null, skipReason: "chat meta / deflector", model };
  }
  if (/обязательн|необходимо\s+сделать|всем\s+дают|всегда\s+только/i.test(reply)) {
    return { reply: null, skipReason: "brochure / absolute", model };
  }
  if (reply.length < 18) return { reply: null, skipReason: "too short", model };
  if (reply.length > 140) reply = reply.slice(0, 137).replace(/\s+\S*$/, "") + ".";
  return { reply, model };
}
