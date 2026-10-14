export const SESSION_KEY = "emigro_sid";
export const ATTR_KEY = "emigro_attr";
export const SESSION_STARTED_KEY = "emigro_session_started";

export interface Attribution {
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
}

type StorageKind = "localStorage" | "sessionStorage";

// Storage access can throw (crawlers, privacy modes, quota). Analytics runs in the root
// layout, so an uncaught throw here replaces every page with Next's "Application error".
export function safeStorageGet(kind: StorageKind, key: string): string | null {
  try {
    return window[kind].getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSet(kind: StorageKind, key: string, value: string): void {
  try {
    window[kind].setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

const EMPTY_ATTRIBUTION: Attribution = {
  referrer: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  landing_page: null,
};

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return { ...EMPTY_ATTRIBUTION };

  const existing = safeStorageGet("sessionStorage", ATTR_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution;
    } catch {
      /* fall through */
    }
  }

  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    referrer: document.referrer || null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    landing_page: `${window.location.pathname}${window.location.search}`,
  };
  safeStorageSet("sessionStorage", ATTR_KEY, JSON.stringify(attr));
  return attr;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = safeStorageGet("localStorage", SESSION_KEY);
  if (!id) {
    id = randomId();
    safeStorageSet("localStorage", SESSION_KEY, id);
  }
  return id;
}

export function clientContext(): Record<string, string> {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent;
  const mobile = /iPhone|Android|Mobile/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua);
  const device_type = tablet ? "tablet" : mobile ? "mobile" : "desktop";
  return {
    lang: navigator.language || "",
    device_type,
    hostname: typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "",
  };
}
