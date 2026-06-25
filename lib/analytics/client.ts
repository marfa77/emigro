"use client";

import { track as vercelTrack } from "@vercel/analytics";
import type { EmigroEventName, EmigroEventProps } from "./events";
import { sanitizeEventProps } from "./events";

export function trackEvent(event: EmigroEventName, props: EmigroEventProps = {}): void {
  const properties = sanitizeEventProps(props);
  try {
    vercelTrack(event, properties);
  } catch {
    /* analytics optional */
  }

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const body = JSON.stringify({ event, properties });
    navigator.sendBeacon("/api/v1/events", new Blob([body], { type: "application/json" }));
  } else {
    void fetch("/api/v1/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
      keepalive: true,
    }).catch(() => undefined);
  }
}
