"use client";

import { usePathname } from "next/navigation";
import { PartnerRecruitmentBanner } from "@/components/partners/PartnerRecruitmentBanner";
import { resolvePartnerRecruitmentBanner } from "@/lib/partners/recruitment-banner";

const HIDDEN_PREFIXES = ["/ru/partners", "/admin"];

export function PartnerRecruitmentBar() {
  const pathname = usePathname();

  if (!pathname?.startsWith("/ru")) return null;
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return <PartnerRecruitmentBanner {...resolvePartnerRecruitmentBanner(pathname)} />;
}
