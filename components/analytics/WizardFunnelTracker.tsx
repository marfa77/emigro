"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";
import { siteLocaleFromPath } from "@/lib/locale";

function isWizardHref(href: string): boolean {
  return /\/wizard(\/|$|\?)/.test(href) || href === "/ru/wizard";
}

function isWizardResultsPath(pathname: string): boolean {
  return pathname.includes("/wizard/results") || /^\/ru\/[^/]+\/results$/.test(pathname);
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

  const path = typeof window !== "undefined" ? window.location.pathname : "";

  return {
    target_path: href,
    link_text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
    page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
    referer: typeof document !== "undefined" ? document.referrer : "",
    locale: siteLocaleFromPath(path),
    placement: anchor.getAttribute("data-placement") ?? "",
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

      if (isWizardResultsPath(pathname)) {
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
    if (!isWizardResultsPath(pathname)) return;
    const sessionId = searchParams.get("session");
    if (!sessionId) return;

    const metrics = document.getElementById("wizard-results-metrics");
    const matchCount = metrics?.getAttribute("data-match-count") ?? "";
    const strongMatchCount = metrics?.getAttribute("data-strong-match-count") ?? "";
    const pickOutcome = metrics?.getAttribute("data-pick-outcome") ?? "";
    const pickCountry = metrics?.getAttribute("data-pick-country") ?? "";

    trackEvent("wizard_results_view", {
      session_id: sessionId,
      page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
      referer: typeof document !== "undefined" ? document.referrer : "",
      locale: siteLocaleFromPath(pathname),
      match_count: matchCount,
      strong_match_count: strongMatchCount,
      pick_outcome: pickOutcome,
      pick_country: pickCountry,
    });
  }, [pathname, searchParams]);

  return null;
}
