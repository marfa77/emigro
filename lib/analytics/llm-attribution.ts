const LLM_UTM_SOURCES: Record<string, string> = {
  llm: "LLM",
  chatgpt: "ChatGPT",
  openai: "ChatGPT",
  perplexity: "Perplexity",
  claude: "Claude",
  anthropic: "Claude",
  gemini: "Gemini",
  "google-gemini": "Gemini",
  copilot: "Copilot",
  "bing-chat": "Copilot",
  phind: "Phind",
  poe: "Poe",
  "you.com": "You.com",
  "meta-ai": "Meta AI",
  grok: "Grok",
};

const LLM_REFERRER_HOSTS: Array<[string, string]> = [
  ["chatgpt.com", "ChatGPT"],
  ["chat.openai.com", "ChatGPT"],
  ["perplexity.ai", "Perplexity"],
  ["claude.ai", "Claude"],
  ["anthropic.com", "Claude"],
  ["gemini.google.com", "Gemini"],
  ["bard.google.com", "Gemini"],
  ["copilot.microsoft.com", "Copilot"],
  ["bing.com", "Copilot"],
  ["phind.com", "Phind"],
  ["poe.com", "Poe"],
  ["you.com", "You.com"],
  ["meta.ai", "Meta AI"],
  ["grok.com", "Grok"],
  ["x.ai", "Grok"],
];

export function referrerHost(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    let host = new URL(referrer).hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    return host || null;
  } catch {
    return referrer.slice(0, 40).toLowerCase();
  }
}

export function classifyLlmAttribution(
  referrer: string | null | undefined,
  utmSource: string | null | undefined,
  utmMedium?: string | null
): string | null {
  if (utmSource) {
    const src = utmSource.trim().toLowerCase();
    const med = (utmMedium || "").trim().toLowerCase();
    if (src === "llm" && med === "llms.txt") return "llms.txt";
    if (src in LLM_UTM_SOURCES) return LLM_UTM_SOURCES[src];
  }

  const host = referrerHost(referrer);
  if (host) {
    for (const [needle, label] of LLM_REFERRER_HOSTS) {
      if (host.includes(needle)) return label;
    }
  }
  return null;
}
