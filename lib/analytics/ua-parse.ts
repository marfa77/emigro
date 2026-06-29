const BOT_MARKERS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "baiduspider",
  "slurp",
  "facebookexternalhit",
  "meta-externalagent",
  "twitterbot",
  "linkedinbot",
  "applebot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
  "gptbot",
  "claudebot",
  "anthropic-ai",
  "headlesschrome",
  "lighthouse",
  "chrome-lighthouse",
  "phantomjs",
  "puppeteer",
  "playwright",
  "selenium",
  "wget/",
  "curl/",
  "python-requests",
  "scrapy",
  "httpx/",
  "go-http-client",
] as const;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const low = userAgent.toLowerCase();
  if (BOT_MARKERS.some((marker) => low.includes(marker))) return true;
  return /\b(bot|crawler|spider)\b/i.test(userAgent);
}

export function parseUserAgent(userAgent: string | null | undefined): {
  device_type: string;
  browser: string;
} {
  if (!userAgent) return { device_type: "unknown", browser: "unknown" };

  let browser = "Other";
  if (userAgent.includes("Telegram")) browser = "Telegram";
  else if (userAgent.includes("Edg/")) browser = "Edge";
  else if (userAgent.includes("Firefox/")) browser = "Firefox";
  else if (userAgent.includes("Chrome/") || userAgent.includes("CriOS/")) browser = "Chrome";
  else if (userAgent.includes("Safari/")) browser = "Safari";

  let device_type = "desktop";
  if (/iPad|Tablet/i.test(userAgent)) device_type = "tablet";
  else if (/iPhone|Android|Mobile|IEMobile/i.test(userAgent)) device_type = "mobile";

  return { device_type, browser };
}
