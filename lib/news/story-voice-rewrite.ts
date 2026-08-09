/**
 * Voice pass for country story tiles.
 * Facts come from Gemini Flash; tone from OpenRouter (Claude Haiku by default).
 * Soft second Haiku pass only when AI-smell / lecture markers remain.
 */
import { openrouterJson } from "@/lib/llm/openrouter";
import { geminiFastJson } from "@/lib/news/gemini";
import {
  STORY_AI_SMELL_RE,
  storyEditorialVoiceForTopic,
} from "@/lib/news/story-editorial-voice";

export type StoryVoiceFields = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  paragraphs: string[];
  key_takeaways: string[];
  tags: string[];
};

export const DEFAULT_STORY_VOICE_MODEL = "anthropic/claude-haiku-4.5";

export function storyVoiceModel(): string {
  return (process.env.EMIGRO_STORY_VOICE_MODEL || DEFAULT_STORY_VOICE_MODEL).trim();
}

export function hasOpenRouterStoryVoice(): boolean {
  return Boolean((process.env.OPENROUTER_API_KEY || "").trim());
}

export function storyTextSmellsAi(fields: StoryVoiceFields): boolean {
  const text = [fields.title, fields.excerpt, ...fields.paragraphs, ...fields.key_takeaways].join(
    "\n"
  );
  return STORY_AI_SMELL_RE.test(text);
}

function clampVoiceFields(rewritten: StoryVoiceFields, fallbackTags: string[]): StoryVoiceFields {
  return {
    title: rewritten.title.trim().slice(0, 120),
    excerpt: rewritten.excerpt.trim().slice(0, 320),
    seo_title: (rewritten.seo_title || rewritten.title).trim().slice(0, 70),
    seo_description: (rewritten.seo_description || rewritten.excerpt).trim().slice(0, 155),
    paragraphs: rewritten.paragraphs.map((p) => p.trim()).filter(Boolean).slice(0, 4),
    key_takeaways: (rewritten.key_takeaways ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 3),
    tags: (rewritten.tags ?? fallbackTags).map((t) => t.trim()).filter(Boolean).slice(0, 5),
  };
}

function voiceSystemPrompt(topicKey: string, countryRu?: string, retry = false): string {
  const retryBlock = retry
    ? `
ПОВТОРНЫЙ ПРОХОД: в черновике остались ИИ-шаблоны / лекция / пресс. Убери их полностью.
Сохрани ВСЕ факты, имена, цифры, даты. Не добавляй нового. Пиши как в личке — без ярлыков абзацев и без «убедитесь / кого заденет / паспорта RU/BY».
`
    : "";

  return `Перепиши новостную плитку Emigro голосом ниже. Сохрани ВСЕ факты, имена, цифры, даты. Не добавляй нового.
Коридор: ${countryRu || topicKey}.
Ритм живой — разная длина фраз; можно начать с имени или цифры; запрещены подзаголовки-клише внутри paragraphs.
${retryBlock}${storyEditorialVoiceForTopic(topicKey)}
Верни JSON с полями: title, excerpt, seo_title, seo_description, paragraphs, key_takeaways, tags.`;
}

async function openrouterVoiceOnce(
  topicKey: string,
  draft: StoryVoiceFields,
  options: { countryRu?: string; logPrefix: string; retry?: boolean }
): Promise<{ fields: StoryVoiceFields; model: string } | null> {
  const model = storyVoiceModel();
  const system = voiceSystemPrompt(topicKey, options.countryRu, options.retry);
  const { data: rewritten, model: used } = await openrouterJson<StoryVoiceFields>(
    model,
    system,
    JSON.stringify(draft),
    3072,
    { temperature: options.retry ? 0.55 : 0.45 }
  );
  if (!rewritten.title?.trim() || !rewritten.excerpt?.trim() || !rewritten.paragraphs?.length) {
    console.warn(`${options.logPrefix} voice rewrite empty from ${used || model}`);
    return null;
  }
  return { fields: clampVoiceFields(rewritten, draft.tags), model: used || model };
}

async function geminiVoiceOnce(
  topicKey: string,
  draft: StoryVoiceFields,
  options: { countryRu?: string; retry?: boolean }
): Promise<StoryVoiceFields | null> {
  const system = voiceSystemPrompt(topicKey, options.countryRu, options.retry);
  const schema = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      excerpt: { type: "STRING" },
      seo_title: { type: "STRING" },
      seo_description: { type: "STRING" },
      paragraphs: { type: "ARRAY", items: { type: "STRING" } },
      key_takeaways: { type: "ARRAY", items: { type: "STRING" } },
      tags: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: ["title", "excerpt", "seo_title", "seo_description", "paragraphs", "key_takeaways", "tags"],
  };
  const rewritten = await geminiFastJson<StoryVoiceFields>(
    system,
    JSON.stringify(draft),
    schema,
    3072,
    { thinkingBudget: 0 }
  );
  if (!rewritten.title?.trim() || !rewritten.excerpt?.trim() || !rewritten.paragraphs?.length) {
    return null;
  }
  return clampVoiceFields(rewritten, draft.tags);
}

/**
 * Rewrite story copy into Emigro relocant voice.
 * Prefer OpenRouter (Haiku 4.5); fall back to Gemini Flash if no OPENROUTER_API_KEY.
 * If AI-smell markers remain after first pass → one hard retry.
 */
export async function rewriteStoryVoiceFields(
  topicKey: string,
  draft: StoryVoiceFields,
  options?: { countryRu?: string; logPrefix?: string }
): Promise<{ fields: StoryVoiceFields; provider: "openrouter" | "gemini" | "skipped"; model?: string }> {
  const log = options?.logPrefix || `[stories:${topicKey}]`;
  const countryRu = options?.countryRu;

  if (hasOpenRouterStoryVoice()) {
    try {
      const first = await openrouterVoiceOnce(topicKey, draft, { countryRu, logPrefix: log });
      if (!first) return { fields: draft, provider: "skipped" };

      let fields = first.fields;
      let model = first.model;

      if (storyTextSmellsAi(fields)) {
        console.log(`${log} AI smell after voice — retry once`);
        try {
          const second = await openrouterVoiceOnce(topicKey, fields, {
            countryRu,
            logPrefix: log,
            retry: true,
          });
          if (second) {
            fields = second.fields;
            model = second.model;
          }
        } catch (e) {
          console.warn(`${log} voice retry failed:`, e instanceof Error ? e.message : e);
        }
      }

      return { fields, provider: "openrouter", model };
    } catch (e) {
      console.warn(`${log} OpenRouter voice failed, falling back to Gemini:`, e instanceof Error ? e.message : e);
    }
  } else {
    console.warn(`${log} OPENROUTER_API_KEY missing — voice pass via Gemini Flash (weaker)`);
  }

  try {
    let fields = await geminiVoiceOnce(topicKey, draft, { countryRu });
    if (!fields) return { fields: draft, provider: "skipped" };

    if (storyTextSmellsAi(fields)) {
      console.log(`${log} AI smell after Gemini voice — retry once`);
      const second = await geminiVoiceOnce(topicKey, fields, { countryRu, retry: true });
      if (second) fields = second;
    }

    return {
      fields,
      provider: "gemini",
      model: process.env.EMIGRO_NEWS_FAST_MODEL || "gemini-2.5-flash",
    };
  } catch (e) {
    console.warn(`${log} voice rewrite failed:`, e instanceof Error ? e.message : e);
    return { fields: draft, provider: "skipped" };
  }
}
