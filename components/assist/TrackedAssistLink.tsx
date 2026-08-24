"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/client";

type Props = {
  href: string;
  placement: string;
  linkLabel: string;
  locale?: "ru" | "es" | "fr";
  country?: string;
  program?: string;
  sessionId?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "onClick" | "className" | "children">;

/** Link to Assist that fires assist_cta_click (→ site_events + owner Telegram). */
export function TrackedAssistLink({
  href,
  placement,
  linkLabel,
  locale = "ru",
  country,
  program,
  sessionId,
  className,
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("assist_cta_click", {
          placement,
          link_label: linkLabel,
          target_path: href,
          locale,
          country: country ?? "",
          program: program ?? "",
          session_id: sessionId ?? "",
        })
      }
      {...rest}
    >
      {children}
    </Link>
  );
}
