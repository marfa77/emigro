"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/client";

function placementFromContent(utmContent: string | null): "early" | "context" | "final" | "property-image" {
  if (!utmContent) return "context";
  if (utmContent.includes("-early-")) return "early";
  if (utmContent.includes("-final-")) return "final";
  if (utmContent.includes("-property-image-")) return "property-image";
  return "context";
}

function destinationFromPath(pathname: string): "tulipani" | "inventory" {
  return pathname.includes("tulipani") ? "tulipani" : "inventory";
}

function guideSlugFromContent(utmContent: string | null, fallback: string): string {
  if (!utmContent) return fallback;
  const match = utmContent.match(
    /^(.*?)-(?:early|context|final|property-image)-(?:tulipani|inventory)$/,
  );
  return match?.[1] || fallback;
}

/** Tracks inline markdown ComoStay links that are not wrapped in ComoStayLink. */
export function ComoStayInlineClickTracker({
  guideSlug,
  children,
}: {
  guideSlug: string;
  children: ReactNode;
}) {
  return (
    <div
      onClick={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const anchor = target.closest("a[href*='comostay.net']");
        if (!(anchor instanceof HTMLAnchorElement)) return;
        if (anchor.closest("[data-como-stay-tracked='1']")) return;

        let url: URL;
        try {
          url = new URL(anchor.href);
        } catch {
          return;
        }

        const utmContent = url.searchParams.get("utm_content");
        trackEvent("como_stay_click", {
          guide_slug: guideSlugFromContent(utmContent, guideSlug),
          placement: placementFromContent(utmContent),
          destination: destinationFromPath(url.pathname),
        });
      }}
    >
      {children}
    </div>
  );
}
