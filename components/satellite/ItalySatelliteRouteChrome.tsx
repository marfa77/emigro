"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function ItalySatelliteRouteChrome({
  english,
  russian,
}: {
  english: ReactNode;
  russian: ReactNode;
}) {
  const pathname = usePathname();
  const isEnglish =
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    pathname.includes("/satellite/italy/en");

  return <>{isEnglish ? english : russian}</>;
}
