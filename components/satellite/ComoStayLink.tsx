"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/client";

export type ComoStayPlacement = "early" | "context" | "final" | "property-image";
export type ComoStayDestination = "tulipani" | "inventory";

export function ComoStayLink({
  href,
  guideSlug,
  placement,
  destination,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  guideSlug: string;
  placement: ComoStayPlacement;
  destination: ComoStayDestination;
  children: ReactNode;
}) {
  return (
    <a
      {...props}
      href={href}
      rel="sponsored"
      data-como-stay-tracked="1"
      onClick={(event) => {
        props.onClick?.(event);
        trackEvent("como_stay_click", {
          guide_slug: guideSlug,
          placement,
          destination,
        });
      }}
    >
      {children}
    </a>
  );
}
