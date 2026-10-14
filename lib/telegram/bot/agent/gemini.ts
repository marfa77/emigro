/** Gemini tool loop for the owner agent: function calls + Google Search as a separate grounded call. */

export type Part = Record<string, unknown>;
export type Content = { role: "user" | "model"; parts: Part[] };

export type FunctionDecl = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type Source = { title: string; uri: string };

type Candidate = {
  content?: { parts?: Part[] };
  finishReason?: string;
  groundingMetadata?: { groundingChunks?: Array<{ web?: { uri?: string; title?: string } }> };
};
type Response = { candidates?: Candidate[]; error?: { message: string } };

/** Main model first, one fallback. Override with EMIGRO_AGENT_MODELS="main,fallback". */
export const AGENT_MODELS = (): string[] =>
  (process.env.EMIGRO_AGENT_MODELS?.trim() || "gemini-3.8-flash,gemini-2.5-flash")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

const SEARCH_MODEL = () => process.env.EMIGRO_AGENT_SEARCH_MODEL?.trim() || "gemini-2.5-flash";

export class GeminiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY missing");
  return key;
}

async function call(body: Record<string, unknown>, model: string): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey()}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
    const data = (await res.json().catch(() => ({}))) as Response;
    if (res.ok) return data;
    if (res.status >= 500 && attempt < 1) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    throw new GeminiError(res.status, `Gemini ${model} ${res.status}: ${data.error?.message?.slice(0, 160) || "error"}`);
  }
}

function textOf(parts: Part[]): string {
  return parts
    .filter((p) => typeof p.text === "string" && !p.thought)
    .map((p) => p.text as string)
    .join("")
    .trim();
}

const WEB_SEARCH: FunctionDecl = {
  name: "web_search",
  description:
    "Поиск Google: выдача и конкуренты по запросу, свежие правила и новости, тренды, что пишут в соцсетях. Возвращает сводку с источниками.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "что найти; укажи язык/страну, если важно (напр. «ВНЖ Португалии россиянам 2026 — топ выдачи»)" },
    },
    required: ["query"],
  },
};

async function webSearch(query: string, sources: Source[]): Promise<unknown> {
  const data = await call(
    {
      contents: [{ role: "user", parts: [{ text: `${query}\n\nОтветь фактами: кто в топе, что именно пишут (заголовки, цифры, даты), со ссылками.` }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2 },
    },
    SEARCH_MODEL(),
  );
  const candidate = data.candidates?.[0];
  const found: Source[] = [];
  for (const chunk of candidate?.groundingMetadata?.groundingChunks || []) {
    if (!chunk.web?.uri) continue;
    const source = { title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri };
    found.push(source);
    if (!sources.some((s) => s.title === source.title)) sources.push(source);
  }
  return { summary: textOf(candidate?.content?.parts || []), sources: found };
}

export async function runAgent(opts: {
  system: string;
  history: Content[];
  userParts: Part[];
  functions: FunctionDecl[];
  onCall: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  model: string;
  sources?: Source[];
  maxSteps?: number;
}): Promise<string> {
  const contents: Content[] = [...opts.history, { role: "user", parts: opts.userParts }];
  const sources = opts.sources ?? [];
  const maxSteps = opts.maxSteps ?? 10;
  for (let step = 0; step < maxSteps; step++) {
    const data = await call(
      {
        system_instruction: { parts: [{ text: opts.system }] },
        contents,
        tools: [{ functionDeclarations: [WEB_SEARCH, ...opts.functions] }],
        generationConfig: { temperature: 0.6 },
      },
      opts.model,
    );
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const calls = parts.filter((p) => p.functionCall) as Array<{
      functionCall: { name: string; args?: Record<string, unknown>; id?: string };
    }>;
    if (!calls.length) {
      const text = textOf(parts);
      if (text) return text;
      throw new Error(`empty answer (${candidate?.finishReason || "no candidate"})`);
    }
    contents.push({ role: "model", parts });
    const responses = await Promise.all(
      calls.map(async ({ functionCall: fc }): Promise<Part> => {
        let result: unknown;
        try {
          result =
            fc.name === WEB_SEARCH.name
              ? await webSearch(String(fc.args?.query ?? ""), sources)
              : await opts.onCall(fc.name, fc.args || {});
        } catch (e) {
          result = { error: e instanceof Error ? e.message : String(e) };
        }
        return { functionResponse: { name: fc.name, id: fc.id, response: { result } } };
      }),
    );
    contents.push({ role: "user", parts: responses });
  }
  throw new Error("too many tool steps");
}

/** Main model, then the fallback on any API failure. Tools are read-only, so a restart is safe. */
export async function runAgentWithFallback(
  opts: Omit<Parameters<typeof runAgent>[0], "model" | "sources">,
): Promise<{ text: string; model: string; sources: Source[] }> {
  let last: unknown;
  for (const model of AGENT_MODELS()) {
    const sources: Source[] = [];
    try {
      return { text: await runAgent({ ...opts, model, sources }), model, sources };
    } catch (e) {
      last = e;
      console.warn(`[agent] ${model} failed:`, e instanceof Error ? e.message : e);
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}
