const GOOGLE_API_KEY = () => (process.env.GOOGLE_API_KEY || "").trim();

export const FAST_MODEL = () =>
  (process.env.EMIGRO_NEWS_FAST_MODEL || "gemini-2.5-flash").replace(/^google\//, "");

export const ORCHESTRATOR_MODEL = () =>
  (process.env.EMIGRO_NEWS_MODEL || process.env.EMIGRO_NEWS_ORCHESTRATOR_MODEL || "gemini-2.5-pro").replace(
    /^google\//,
    ""
  );

type GeminiSchema = Record<string, unknown>;

function stripMarkdownJsonFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }
  return t;
}

function repairJsonSlice(raw: string): string {
  return raw
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");
}

function logInvalidJson(context: string, source: string, err: unknown): void {
  const preview = source.slice(0, 240).replace(/\s+/g, " ");
  const tail = source.slice(-240).replace(/\s+/g, " ");
  const detail = err instanceof Error ? err.message : String(err);
  console.error(
    `[gemini] invalid JSON (${context}): len=${source.length} parse=${detail} head=${preview} tail=${tail}`
  );
}

function parseJsonRobust<T>(text: string, context = "response"): T {
  const trimmed = stripMarkdownJsonFences(text);
  try {
    return JSON.parse(trimmed) as T;
  } catch (firstErr) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = repairJsonSlice(trimmed.slice(start, end + 1));
      try {
        return JSON.parse(slice) as T;
      } catch (innerErr) {
        logInvalidJson(context, trimmed, innerErr);
        throw new Error(`Gemini returned invalid JSON: ${innerErr instanceof Error ? innerErr.message : String(innerErr)}`);
      }
    }
    logInvalidJson(context, trimmed, firstErr);
    throw new Error(`Gemini returned invalid JSON: ${firstErr instanceof Error ? firstErr.message : String(firstErr)}`);
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

  for (let attempt = 0; attempt < 5; attempt += 1) {
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
      return parseJsonRobust<T>(text, `${model} attempt ${attempt + 1}`);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < 4) continue;
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
