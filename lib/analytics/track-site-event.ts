import { createAdminClient } from "@/lib/admin/supabase";
import { anonymizeIp, countryFromHeaders } from "@/lib/analytics/geo";
import { isBotUserAgent, parseUserAgent } from "@/lib/analytics/ua-parse";

export interface TrackSiteEventInput {
  session_id: string;
  event_name: string;
  page_path?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  properties?: Record<string, unknown>;
  user_agent?: string | null;
  ip_address?: string | null;
  request?: Request;
}

function clip(value: string | null | undefined, maxLen: number): string | null {
  if (!value) return null;
  const clean = value.trim();
  return clean ? clean.slice(0, maxLen) : null;
}

export async function trackSiteEvent(input: TrackSiteEventInput): Promise<void> {
  const sessionId = input.session_id.trim().slice(0, 128);
  if (sessionId.length < 8) return;

  try {
    const userAgent = input.user_agent ?? input.request?.headers.get("user-agent") ?? null;
    const props: Record<string, unknown> = { ...(input.properties ?? {}) };

    const country = input.request ? countryFromHeaders(input.request) : null;
    if (country) props.country = country;

    const acceptLang = (input.request?.headers.get("accept-language") || "").split(",")[0]?.trim();
    if (acceptLang) props.accept_language = acceptLang.slice(0, 32);

    if (userAgent) {
      const parsed = parseUserAgent(userAgent);
      props.device_type ??= parsed.device_type;
      props.browser ??= parsed.browser;
      if (isBotUserAgent(userAgent)) props.is_bot = true;
    }

    const ip =
      input.ip_address ??
      (input.request
        ? (input.request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null
        : null);

    const supabase = createAdminClient();
    const { error } = await supabase.from("site_events").insert({
      session_id: sessionId,
      event_name: input.event_name.trim().slice(0, 64),
      page_path: clip(input.page_path, 512),
      referrer: clip(input.referrer, 512),
      utm_source: clip(input.utm_source, 128),
      utm_medium: clip(input.utm_medium, 128),
      utm_campaign: clip(input.utm_campaign, 128),
      utm_content: clip(input.utm_content, 128),
      utm_term: clip(input.utm_term, 128),
      properties: props,
      user_agent: clip(userAgent, 512),
      ip_address: anonymizeIp(ip),
    });

    if (error) {
      console.warn("[site_events] insert failed:", error.message);
    }
  } catch (e) {
    console.warn("[site_events] track failed:", e instanceof Error ? e.message : e);
  }
}
