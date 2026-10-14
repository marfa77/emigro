"use client";

import { track as vercelTrack } from "@vercel/analytics";
import {
  SESSION_STARTED_KEY,
  captureAttribution,
  clientContext,
  getSessionId,
  safeStorageGet,
  safeStorageSet,
} from "@/lib/analytics/attribution";
import type { EmigroEventName, EmigroEventProps } from "@/lib/analytics/events";
import { sanitizeEventProps } from "@/lib/analytics/events";

function sendSiteEvent(payload: Record<string, unknown>): void {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      if (navigator.sendBeacon("/api/v1/events", new Blob([body], { type: "application/json" }))) {
        return;
      }
    }
  } catch {
    /* fall back to fetch */
  }
  try {
    void fetch("/api/v1/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* analytics optional */
  }
}

// Called from effects in the root layout: any throw here would crash every page
// (Google then renders a generic error page and clusters it with unrelated sites).
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  try {
    captureAttribution();
    if (safeStorageGet("sessionStorage", SESSION_STARTED_KEY)) return;
    safeStorageSet("sessionStorage", SESSION_STARTED_KEY, "1");
    trackEvent("session_start");
  } catch {
    /* analytics optional */
  }
}

export function trackEvent(event: EmigroEventName, props: EmigroEventProps = {}): void {
  if (typeof window === "undefined") return;

  try {
    const properties = sanitizeEventProps(props);
    try {
      vercelTrack(event, properties);
    } catch {
      /* analytics optional */
    }

    const attr = captureAttribution();
    sendSiteEvent({
      session_id: getSessionId(),
      event_name: event,
      page_path:
        typeof properties.page_path === "string"
          ? properties.page_path
          : `${window.location.pathname}${window.location.search}`,
      referrer: attr.referrer,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      utm_term: attr.utm_term,
      properties: { ...clientContext(), ...properties },
    });
  } catch {
    /* analytics optional */
  }
}
