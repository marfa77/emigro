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

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {
      referrer: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      landing_page: null,
    };
  }

  const existing = window.sessionStorage.getItem(ATTR_KEY);
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
  window.sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
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
  };
}
