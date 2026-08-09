/**
 * Editorial voice for short news story tiles.
 * Keep this SHORT — dumping full guide voice into Flash makes it ignore tone.
 */
import { voiceExamples } from "@/lib/community-notes/editorial-voice";

/** Compact voice block for Gemini story generation / rewrite. */
export function storyEditorialVoiceForTopic(topicKey: string): string {
  const geo =
    topicKey === "portugal"
      ? "Португалия (AIMA, Finanças, Lisboa/Porto/Braga)"
      : topicKey === "spain"
        ? "Испания (NIE/TIE, extranjería, Valencia/Madrid/Barcelona)"
        : "европейский коридор для релокантов с паспортами RU/BY/UA/KZ";

  return `
ГОЛОС ПЛИТКИ Emigro — «опытный релокант за кофе» (${geo}):
Пиши как человек, который уже живёт переездом и объясняет новость другу за столом — НЕ как лента РИА/ТАСС.

Обязательно:
- На «вы»; можно «мы» (Emigro). Тёплый, спокойный.
- Первая фраза title/excerpt/paragraphs — живая: сцена, страх из чата или «что это значит для вас», НЕ канцелярит.
- Схема: хук → факт → кого заденет / кого нет.
- Даты календарно («6 августа 2026»), не «вчера».
- Термины (AIMA, IND, NIE…) при первом упоминании — краткая русская расшифровка в скобках.

Запрещено (если встретите — перепишите):
- «выражает опасения», «подчеркивает позицию», «это заявление», «в соответствии с», «важно отметить», «на данный момент», «необходимо учитывать», «отражает стремление».
- Пассивные штампы: «стало известно», «работы продолжаются», «ситуация находится под контролем».
- Телеграф и стены bullets; @username; «гарантированный ВНЖ».

Хорошо:
${voiceExamples.goodDemystify}

Плохо:
${voiceExamples.bad}
`.trim();
}
