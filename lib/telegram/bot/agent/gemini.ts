/** Gemini tool loop for the owner agent: Google Search grounding + function calls. */

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

/** Cheap Flash-class chain, tried in order. Override with EMIGRO_AGENT_MODELS="a,b,c". */
export const AGENT_MODELS = (): string[] =>
  (process.env.EMIGRO_AGENT_MODELS?.trim() || "gemini-3.8-flash,gemini-2.5-flash,gemini-3.5-flash-lite")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

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

export async function runAgent(opts: {
  system: string;
  history: Content[];
  userParts: Part[];
  functions: FunctionDecl[];
  onCall: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  model: string;
  search?: boolean;
  sources?: Source[];
  maxSteps?: number;
}): Promise<string> {
  const contents: Content[] = [...opts.history, { role: "user", parts: opts.userParts }];
  const maxSteps = opts.maxSteps ?? 8;
  const search = opts.search !== false;
  for (let step = 0; step < maxSteps; step++) {
    const data = await call(
      {
        system_instruction: { parts: [{ text: opts.system }] },
        contents,
        tools: search
          ? [{ google_search: {} }, { functionDeclarations: opts.functions }]
          : [{ functionDeclarations: opts.functions }],
        ...(search ? { toolConfig: { includeServerSideToolInvocations: true } } : {}),
        generationConfig: { temperature: 0.6 },
      },
      opts.model,
    );
    const candidate = data.candidates?.[0];
    for (const chunk of candidate?.groundingMetadata?.groundingChunks || []) {
      if (chunk.web?.uri && opts.sources && !opts.sources.some((s) => s.title === chunk.web!.title)) {
        opts.sources.push({ title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri });
      }
    }
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
    const responses: Part[] = [];
    for (const { functionCall: fc } of calls) {
      let result: unknown;
      try {
        result = await opts.onCall(fc.name, fc.args || {});
      } catch (e) {
        result = { error: e instanceof Error ? e.message : String(e) };
      }
      responses.push({ functionResponse: { name: fc.name, id: fc.id, response: { result } } });
    }
    contents.push({ role: "user", parts: responses });
  }
  throw new Error("too many tool steps");
}

/**
 * Walks the cheap model chain. Search grounding has its own quota and is not combinable with
 * function calls on older models, so a 4xx with search retries the same model without it.
 * Agent tools are read-only, so restarting a run after tool calls is safe.
 */
export async function runAgentWithFallback(
  opts: Omit<Parameters<typeof runAgent>[0], "model" | "search" | "sources">,
): Promise<{ text: string; model: string; search: boolean; sources: Source[] }> {
  let last: unknown;
  for (const model of AGENT_MODELS()) {
    for (const search of [true, false]) {
      const sources: Source[] = [];
      try {
        const text = await runAgent({ ...opts, model, search, sources });
        return { text, model, search, sources };
      } catch (e) {
        last = e;
        console.warn(`[agent] ${model}${search ? " +search" : ""} failed:`, e instanceof Error ? e.message : e);
        const status = e instanceof GeminiError ? e.status : 0;
        if (!(search && status >= 400 && status < 500)) break;
      }
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}
