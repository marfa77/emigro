import { createAdminClient } from "@/lib/admin/supabase";

/**
 * Who is this visitor and how did they get here — for the owner DM on wizard results.
 * Built from the browser session's own site_events (first referrer, landing page, pages
 * read before the quiz), not guessed from the results URL.
 */

const REFERRER_LABELS: Array<{ test: RegExp; label: string }> = [
  { test: /threads\.(net|com)/i, label: "Threads" },
  { test: /instagram\.com/i, label: "Instagram" },
  { test: /facebook\.com|fb\.com/i, label: "Facebook" },
  { test: /t\.me|telegram/i, label: "Telegram" },
  { test: /google\./i, label: "Google" },
  { test: /yandex\./i, label: "Яндекс" },
  { test: /bing\.com/i, label: "Bing" },
  { test: /duckduckgo/i, label: "DuckDuckGo" },
  { test: /chatgpt\.com|openai/i, label: "ChatGPT" },
  { test: /perplexity/i, label: "Perplexity" },
  { test: /vk\.com/i, label: "VK" },
  { test: /youtube\.com/i, label: "YouTube" },
  { test: /reddit\.com/i, label: "Reddit" },
];

export function referrerLabel(referrer?: string | null, utmSource?: string | null): string {
  if (utmSource) return `utm: ${utmSource}`;
  if (!referrer) return "прямой заход (закладка, мессенджер или ссылка без источника)";
  let host = referrer;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw */
  }
  if (/emigro\.online/i.test(host)) return "внутренний переход";
  const known = REFERRER_LABELS.find(({ test }) => test.test(host));
  return known ? `${known.label} (${host})` : host;
}

export function deviceLabel(userAgent?: string | null): string | undefined {
  if (!userAgent) return undefined;
  const ua = userAgent;
  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Macintosh/.test(ua)
          ? "Mac"
          : /Windows/.test(ua)
            ? "Windows"
            : /Linux/.test(ua)
              ? "Linux"
              : "устройство не определено";
  const app = /Barcelona/.test(ua)
    ? "приложение Threads"
    : /Instagram/.test(ua)
      ? "приложение Instagram"
      : /FBAN|FBAV/.test(ua)
        ? "приложение Facebook"
        : /Telegram/i.test(ua)
          ? "Telegram"
          : /YaBrowser/.test(ua)
            ? "Яндекс Браузер"
            : /Edg\//.test(ua)
              ? "Edge"
              : /CriOS|Chrome\//.test(ua)
                ? "Chrome"
                : /Firefox|FxiOS/.test(ua)
                  ? "Firefox"
                  : /Safari\//.test(ua)
                    ? "Safari"
                    : undefined;
  return app ? `${os}, ${app}` : os;
}

function shortPath(path: string): string {
  const clean = path.split("?")[0];
  if (clean === "/ru" || clean === "/") return "главная";
  if (/\/wizard\/results$|\/results$/.test(clean)) return "результаты";
  if (/\/wizard$/.test(clean)) return "квиз";
  const guide = clean.match(/\/guides\/([^/]+)$/);
  if (guide) return `гайд ${guide[1]}`;
  return clean;
}

export type VisitorTrail = {
  source: string;
  landing?: string;
  path: string[];
  device?: string;
  firstSeen?: string;
};

export async function loadVisitorTrail(analyticsSessionId?: string): Promise<VisitorTrail | null> {
  if (!analyticsSessionId) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_events")
    .select("event_name, page_path, referrer, utm_source, utm_campaign, user_agent, created_at")
    .eq("session_id", analyticsSessionId)
    .eq("event_name", "page_view")
    .order("created_at", { ascending: true })
    .limit(40);
  if (error || !data?.length) return null;

  const first = data[0];
  const external = data.find((row) => row.referrer && !/emigro\.online/i.test(row.referrer)) ?? first;
  const path: string[] = [];
  for (const row of data) {
    const step = shortPath(String(row.page_path ?? ""));
    if (path[path.length - 1] !== step) path.push(step);
  }
  return {
    source: referrerLabel(external.referrer, external.utm_source) + (external.utm_campaign ? ` · ${external.utm_campaign}` : ""),
    landing: first.page_path ?? undefined,
    path: path.slice(0, 8),
    device: deviceLabel(first.user_agent),
    firstSeen: first.created_at,
  };
}
