"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";

function isWizardHref(href: string): boolean {
  return /\/wizard(\/|$|\?)/.test(href) || href === "/ru/wizard";
}

function collectLinkMeta(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href") ?? "";
  let interest: string | null = null;
  try {
    const url = href.startsWith("http") ? new URL(href) : new URL(href, window.location.origin);
    interest = url.searchParams.get("interest");
  } catch {
    interest = null;
  }

  return {
    target_path: href,
    link_text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
    page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
    referer: typeof document !== "undefined" ? document.referrer : "",
    locale: "ru",
    ...(interest ? { interest_countries: interest } : {}),
  };
}

export function WizardFunnelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const meta = collectLinkMeta(anchor);

      if (isWizardHref(href)) {
        trackEvent("wizard_cta_click", meta);
        return;
      }

      if (pathname.includes("/wizard/results")) {
        trackEvent("wizard_results_click", {
          ...meta,
          session_id: searchParams.get("session") ?? "",
          link_label: meta.link_text,
        });
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pathname.includes("/wizard/results")) return;
    const sessionId = searchParams.get("session");
    if (!sessionId) return;

    trackEvent("wizard_results_view", {
      session_id: sessionId,
      page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
      referer: typeof document !== "undefined" ? document.referrer : "",
      locale: "ru",
    });
  }, [pathname, searchParams]);

  return null;
}
