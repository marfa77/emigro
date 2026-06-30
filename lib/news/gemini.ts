const GOOGLE_API_KEY = () => (process.env.GOOGLE_API_KEY || "").trim();

export const FAST_MODEL = () =>
  (process.env.EMIGRO_NEWS_FAST_MODEL || "gemini-2.5-flash").replace(/^google\//, "");

export const ORCHESTRATOR_MODEL = () =>
  (process.env.EMIGRO_NEWS_MODEL || process.env.EMIGRO_NEWS_ORCHESTRATOR_MODEL || "gemini-2.5-pro").replace(
    /^google\//,
    ""
  );

type GeminiSchema = Record<string, unknown>;

function parseJsonRobust<T>(text: string): T {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        const slice = trimmed.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(slice) as T;
      } catch (inner) {
        if (process.env.DEBUG_GEMINI_JSON === "1") {
          console.error("[gemini] invalid JSON len=", trimmed.length, "tail=", trimmed.slice(-300));
        }
        throw inner;
      }
    }
    throw new Error("Gemini returned invalid JSON");
  }
}

export async function geminiJson<T>(
  model: string,
  system: string,
  user: string,
  schema: GeminiSchema,
  maxOutputTokens = 8192
): Promise<T> {
  const key = GOOGLE_API_KEY();
  if (!key) throw new Error("GOOGLE_API_KEY is required for news generation");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens,
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        }),
      });

      const json = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        error?: { message?: string };
      };

      if (!res.ok) throw new Error(json.error?.message || `Gemini HTTP ${res.status}`);
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini returned empty response");
      return parseJsonRobust<T>(text);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt === 0) continue;
    }
  }

  throw lastError ?? new Error("Gemini request failed");
}

export const geminiFastJson = <T>(system: string, user: string, schema: GeminiSchema, max = 4096) =>
  geminiJson<T>(FAST_MODEL(), system, user, schema, max);

export const geminiProJson = <T>(system: string, user: string, schema: GeminiSchema, max = 12288) =>
  geminiJson<T>(ORCHESTRATOR_MODEL(), system, user, schema, max);

export const SCHEMA_SELECTION = {
  type: "OBJECT",
  properties: {
    selected: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          candidate_idx: { type: "NUMBER" },
          title: { type: "STRING" },
          source: { type: "STRING" },
          why: { type: "STRING" },
          score: { type: "NUMBER" },
        },
        required: ["candidate_idx", "title", "why"],
      },
    },
  },
  required: ["selected"],
};

export const SCHEMA_SITE_DIGEST_RU = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    excerpt: { type: "STRING" },
    seo_title: { type: "STRING" },
    seo_description: { type: "STRING" },
    key_takeaways: { type: "ARRAY", items: { type: "STRING" } },
    content_blocks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          paragraphs: { type: "ARRAY", items: { type: "STRING" } },
          bullets: { type: "ARRAY", items: { type: "STRING" } },
          source_name: { type: "STRING" },
          source_url: { type: "STRING" },
          story_title: { type: "STRING" },
        },
        required: ["heading", "paragraphs", "source_name", "source_url", "story_title"],
      },
    },
    tags: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "excerpt", "seo_title", "seo_description", "key_takeaways", "content_blocks", "tags"],
};

export const SCHEMA_TELEGRAM_HTML = {
  type: "OBJECT",
  properties: {
    digest_html: { type: "STRING" },
  },
  required: ["digest_html"],
};

export const SCHEMA_COMPRESS = {
  type: "OBJECT",
  properties: { digest_html: { type: "STRING" } },
  required: ["digest_html"],
};
