const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";

export const DEFAULT_AUDIT_MODEL = () =>
  (process.env.EMIGRO_SEO_AUDIT_MODEL || "~x-ai/grok-latest").trim();

function apiKey(): string {
  const key = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!key) throw new Error("OPENROUTER_API_KEY is required for OpenRouter requests");
  return key;
}

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
        const detail = innerErr instanceof Error ? innerErr.message : String(innerErr);
        throw new Error(`OpenRouter returned invalid JSON (${context}): ${detail}`);
      }
    }
    const detail = firstErr instanceof Error ? firstErr.message : String(firstErr);
    throw new Error(`OpenRouter returned invalid JSON (${context}): ${detail}`);
  }
}

export type OpenRouterUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
};

export type OpenRouterResult<T> = {
  data: T;
  model: string;
  usage?: OpenRouterUsage;
};

export async function openrouterJson<T>(
  model: string,
  system: string,
  user: string,
  maxTokens = 8192
): Promise<OpenRouterResult<T>> {
  const key = apiKey();
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(OPENROUTER_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.EMIGRO_PUBLIC_SITE_URL || "https://www.emigro.online",
          "X-Title": "Emigro SEO Audit",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      });

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        model?: string;
        usage?: OpenRouterUsage;
        error?: { message?: string };
      };

      if (!res.ok) {
        throw new Error(json.error?.message || `OpenRouter HTTP ${res.status}`);
      }

      const text = json.choices?.[0]?.message?.content;
      if (!text) throw new Error("OpenRouter returned empty response");

      return {
        data: parseJsonRobust<T>(text, `${model} attempt ${attempt + 1}`),
        model: json.model || model,
        usage: json.usage,
      };
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < 2) continue;
    }
  }

  throw lastError ?? new Error("OpenRouter request failed");
}
