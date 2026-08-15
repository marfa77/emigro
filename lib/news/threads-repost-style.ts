/**
 * Style for @Emigro_news posts that the owner later pastes into Threads.
 * Tuned to pv.inform top performers: country + number/myth hook + short “slides”.
 */
import {
  composeThreadsChain,
  formatThreadsChainPreview,
} from "@/lib/threads/compose";

/** Shared editorial rules — Telegram HTML and Threads carousel paste. */
export const THREADS_REPOST_STYLE = `
Формат поста (Telegram → потом копипаст в Threads как карусель):

1) HEADLINE (1 строка, ≤140 символов):
   Страна/тема + резкий тезис. Обязательно ОДНО из:
   - цифра/порог (€, дни, годы, %)
   - было → стало (2022 vs 2026, 5→10 лет)
   - миф/ловушка («пишут X — на деле Y», «дешевле ≠ проще»)
   Примеры тона (ритм, не факты):
   - «Грузия для россиян в 2026 — уже не 2022-й. Но и не закрылась»
   - «Польша: work permit €1 080 vs Blue Card €3 020 — один ВНЖ, разница ×3»
   - «Испания: 30 дней на TIE — не совет, а дедлайн (EES фиксирует въезд)»
   - «Golden Visa 2021–22: "ноябрь 2026 = паспорт" — опасное заблуждение»

2) SLIDES / абзацы (2–3 штуки, каждый ≤160 символов):
   Плотные факты, на «вы». Цифра, правило, ловушка или порядок действий.
   Пустая строка между абзацами. В Threads: до 500 символов на пост; длинное уходит цепочкой reply.

3) Без CTA-крика. Ссылка ставится кодом отдельно.

ЗАПРЕЩЕНО:
- первое лицо, мемуары, «Представьте:», «Давайте разберёмся»
- «наш визард», «можно найти», «не забудьте сверить»
- пресс-канцелярит: «выражает опасения», «стало известно», «важно отметить»
- выдуманные цифры сверх фактов входа
`.trim();

export type ThreadsRepostDraft = {
  headline: string;
  slides: string[];
};

/** Strip markdown noise from LLM output. */
export function stripRepostMd(s: string): string {
  return s.replace(/\*\*/g, "").replace(/__/g, "").replace(/^#+\s*/, "").trim();
}

/**
 * Reshape a news story into Threads-repost headline + slides (Gemini Flash).
 * Fail soft: returns null on error / empty — caller keeps original title/excerpt.
 */
export async function reshapeNewsForThreadsRepost(params: {
  countryRu: string;
  title: string;
  excerpt: string;
  bodyPreview?: string;
}): Promise<ThreadsRepostDraft | null> {
  try {
    const { geminiFastJson } = await import("@/lib/news/gemini");
    const system = `Ты редактор @Emigro_news. Перепиши новость так, чтобы пост из Telegram хорошо залетал при копипасте в Threads.

${THREADS_REPOST_STYLE}

Верни JSON: headline, slides (массив 2–3 строк, каждая ≤160 символов). Без HTML, URL, эмодзи (флаг страны в headline не нужен — его добавит шапка). Только факты из входа.`;

    const user = JSON.stringify({
      country: params.countryRu,
      title: params.title,
      excerpt: params.excerpt,
      body: (params.bodyPreview || "").slice(0, 1200),
    });

    const schema = {
      type: "OBJECT",
      properties: {
        headline: { type: "STRING" },
        slides: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["headline", "slides"],
    };

    const result = await geminiFastJson<ThreadsRepostDraft>(system, user, schema, 2048, {
      thinkingBudget: 0,
    });

    const headline = stripRepostMd(String(result.headline || "")).slice(0, 160);
    const slides = (result.slides ?? [])
      .map((s) => stripRepostMd(String(s || "")).slice(0, 180))
      .filter((s) => s.length >= 40)
      .slice(0, 3);

    if (!headline || slides.length < 2) return null;
    return { headline, slides };
  } catch {
    return null;
  }
}

/** Plain-text preview matching auto-publish (multi-post if needed + Telegram CTA). */
export function formatThreadsPaste(draft: ThreadsRepostDraft, countryRu = ""): string {
  const items = composeThreadsChain({
    countryRu,
    headline: draft.headline,
    slides: draft.slides,
    ctaMode: "telegram",
  });
  return formatThreadsChainPreview(items);
}
