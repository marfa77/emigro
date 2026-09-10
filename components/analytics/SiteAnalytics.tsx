"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackEvent } from "@/lib/analytics/client";
import { siteLocaleFromPath } from "@/lib/locale";

export function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initAnalytics();

    const trackPlainAssistLink = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.dataset.assistTracked === "true") return;
      const target = new URL(anchor.href, window.location.href);
      if (!/^\/(ru|es|fr)\/assist(?:\/|$)/.test(target.pathname)) return;
      trackEvent("assist_cta_click", {
        placement: anchor.dataset.placement || "global_assist_link",
        link_label: anchor.textContent?.trim().slice(0, 120) || "Assist",
        target_path: `${target.pathname}${target.search}${target.hash}`,
        locale: siteLocaleFromPath(window.location.pathname),
      });
    };

    document.addEventListener("click", trackPlainAssistLink, true);
    return () => document.removeEventListener("click", trackPlainAssistLink, true);
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackEvent("page_view", {
      page_path: pagePath,
      locale: siteLocaleFromPath(pathname),
    });
  }, [pathname, searchParams]);

  return null;
}
