"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";

export function InvestmentViewTracker({
  event,
  country,
}: {
  event: "investment_hub_view" | "investment_country_view";
  country?: string;
}) {
  useEffect(() => {
    trackEvent(event, country ? { country, source: event } : { source: "investment_hub" });
  }, [country, event]);

  return null;
}

export function InvestmentRouteLink({
  href,
  country,
  slug,
  className,
  children,
}: {
  href: string;
  country: string;
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("investment_route_click", { country, slug, source: "investment_hub" })}
    >
      {children}
    </Link>
  );
}
