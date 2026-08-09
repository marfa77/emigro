/**
 * Voice pass for country story tiles.
 * Facts come from Gemini Flash; tone from OpenRouter (Claude Haiku by default).
 */
import { openrouterJson } from "@/lib/llm/openrouter";
import { geminiFastJson } from "@/lib/news/gemini";
import { storyEditorialVoiceForTopic } from "@/lib/news/story-editorial-voice";

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

function voiceSystemPrompt(topicKey: string, countryRu?: string): string {
  return `Перепиши новостную плитку Emigro голосом ниже. Сохрани ВСЕ факты, имена, цифры, даты. Не добавляй нового.
Коридор: ${countryRu || topicKey}.
${storyEditorialVoiceForTopic(topicKey)}
Верни JSON с полями: title, excerpt, seo_title, seo_description, paragraphs, key_takeaways, tags.`;
}

/**
 * Rewrite story copy into Emigro relocant voice.
 * Prefer OpenRouter (Haiku 4.5); fall back to Gemini Flash if no OPENROUTER_API_KEY.
 */
export async function rewriteStoryVoiceFields(
  topicKey: string,
  draft: StoryVoiceFields,
  options?: { countryRu?: string; logPrefix?: string }
): Promise<{ fields: StoryVoiceFields; provider: "openrouter" | "gemini" | "skipped"; model?: string }> {
  const log = options?.logPrefix || `[stories:${topicKey}]`;
  const system = voiceSystemPrompt(topicKey, options?.countryRu);
  const user = JSON.stringify(draft);

  if (hasOpenRouterStoryVoice()) {
    const model = storyVoiceModel();
    try {
      const { data: rewritten, model: used } = await openrouterJson<StoryVoiceFields>(
        model,
        system,
        user,
        3072,
        { temperature: 0.45 }
      );
      if (!rewritten.title?.trim() || !rewritten.excerpt?.trim() || !rewritten.paragraphs?.length) {
        console.warn(`${log} voice rewrite empty from ${used || model}`);
        return { fields: draft, provider: "skipped" };
      }
      return {
        fields: clampVoiceFields(rewritten, draft.tags),
        provider: "openrouter",
        model: used || model,
      };
    } catch (e) {
      console.warn(`${log} OpenRouter voice failed, falling back to Gemini:`, e instanceof Error ? e.message : e);
    }
  } else {
    console.warn(`${log} OPENROUTER_API_KEY missing — voice pass via Gemini Flash (weaker)`);
  }

  try {
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
    const rewritten = await geminiFastJson<StoryVoiceFields>(system, user, schema, 3072, {
      thinkingBudget: 0,
    });
    if (!rewritten.title?.trim() || !rewritten.excerpt?.trim() || !rewritten.paragraphs?.length) {
      return { fields: draft, provider: "skipped" };
    }
    return {
      fields: clampVoiceFields(rewritten, draft.tags),
      provider: "gemini",
      model: process.env.EMIGRO_NEWS_FAST_MODEL || "gemini-2.5-flash",
    };
  } catch (e) {
    console.warn(`${log} voice rewrite failed:`, e instanceof Error ? e.message : e);
    return { fields: draft, provider: "skipped" };
  }
}
