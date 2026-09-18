import type { DashboardSurfaceKey } from "@/lib/analytics/dashboard/types";

export function classifyDashboardSurface(
  hostname: string | null | undefined,
  pagePath: string | null | undefined
): DashboardSurfaceKey {
  const host = (hostname || "").trim().toLowerCase();
  const path = (pagePath || "").split("?")[0].toLowerCase();
  if (host.startsWith("portugal.") || path.startsWith("/satellite/portugal")) return "portugal";
  if (host.startsWith("spain.") || path.startsWith("/satellite/spain")) return "spain";
  if (host.startsWith("italy.") || path.startsWith("/satellite/italy")) return "italy";
  if (host.startsWith("thailand.") || path.startsWith("/satellite/thailand")) return "thailand";
  return "core";
}
