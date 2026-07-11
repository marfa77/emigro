import Link from "next/link";
import { ContentKindBadge } from "@/components/satellite/HashtagNav";
import { formatSpotlightDateLabel } from "@/lib/community-notes/daily-spotlight";
import type { DailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { satelliteNotePath } from "@/lib/satellite/paths";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { tapTarget } from "@/lib/ui/mobile";

export function DailySpotlightTile({ spotlight }: { spotlight: DailySpotlight }) {
  const countryKey: SatelliteCountryKey = spotlight.country_key === "spain" ? "spain" : "portugal";
  const ctaClass =
    countryKey === "spain"
      ? "bg-amber-700 hover:bg-amber-800"
      : "bg-teal-700 hover:bg-teal-800";

  return (
    <section
      className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-5 shadow-sm sm:p-6"
      aria-labelledby="spotlight-heading"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-teal-200/40 blur-2xl" aria-hidden="true" />

      <div className="relative">
        <p id="spotlight-heading" className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Лучшее за сегодня · {formatSpotlightDateLabel(spotlight.spotlight_date)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
            {spotlight.headline}
          </span>
          <ContentKindBadge kind={spotlight.content_kind} />
        </div>

        <div className="mt-4 rounded-xl border border-white/80 bg-white/90 p-4 shadow-inner">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{spotlight.threads_text}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={satelliteNotePath(spotlight.note_slug, countryKey)}
            className={`inline-flex ${tapTarget} items-center rounded-lg ${ctaClass} px-4 py-2.5 text-sm font-semibold text-white transition`}
          >
            Читать полностью →
          </Link>
        </div>
      </div>
    </section>
  );
}
