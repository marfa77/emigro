import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import type { PartnerRecruitmentBannerCopy } from "@/lib/partners/recruitment-banner";

export function PartnerRecruitmentBanner({ scope, countryPrepositional }: PartnerRecruitmentBannerCopy) {
  const message =
    scope === "local"
      ? `Ищем локальных партнёров в ${countryPrepositional}`
      : "Ищем глобальных партнёров по релокации";

  return (
    <div
      className="relative z-40 border-b border-corridor-100 bg-corridor-50"
      role="region"
      aria-label="Партнёрская программа"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-sm text-corridor-900">
        <Handshake className="hidden h-4 w-4 shrink-0 text-corridor-600 sm:block" aria-hidden />
        <p className="text-center sm:text-left">
          <span className="font-medium">{message}</span>
        </p>
        <Link
          href="/ru/partners"
          className="inline-flex shrink-0 items-center gap-1 font-medium text-corridor-600 hover:text-corridor-700 hover:underline"
        >
          Подробнее
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
