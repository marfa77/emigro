"use client";

import { ArrowRight, Compass, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { buildAssistUrl } from "@/lib/assist/build-url";
import type { ContentKind } from "@/lib/community-notes/types";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import {
  satelliteAssistUrl,
  satelliteHubUrl,
  satellitePillarUrl,
  satelliteWizardUrl,
  type SatelliteFunnelPlacement,
} from "@/lib/satellite/funnel-urls";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  countryKey: SatelliteCountryKey;
  placement: SatelliteFunnelPlacement;
  noteSlug?: string;
  noteTitle?: string;
  contentKind?: ContentKind;
};

function accent(countryKey: SatelliteCountryKey) {
  if (countryKey === "spain") {
    return {
      shell: "border-amber-200 bg-amber-50/70",
      eyebrow: "text-amber-900",
      primary: "bg-amber-800 text-white hover:bg-amber-900",
      secondary: "border-amber-300 bg-white text-amber-950 hover:bg-amber-50",
      link: "text-amber-900 hover:text-amber-950",
    };
  }
  if (countryKey === "italy") {
    return {
      shell: "border-emerald-200 bg-emerald-50/70",
      eyebrow: "text-emerald-900",
      primary: "bg-emerald-800 text-white hover:bg-emerald-900",
      secondary: "border-emerald-300 bg-white text-emerald-950 hover:bg-emerald-50",
      link: "text-emerald-900 hover:text-emerald-950",
    };
  }
  if (countryKey === "thailand") {
    return {
      shell: "border-indigo-200 bg-indigo-50/70",
      eyebrow: "text-indigo-950",
      primary: "bg-indigo-800 text-white hover:bg-indigo-900",
      secondary: "border-indigo-300 bg-white text-indigo-950 hover:bg-indigo-50",
      link: "text-indigo-900 hover:text-indigo-950",
    };
  }
  return {
    shell: "border-teal-200 bg-teal-50/70",
    eyebrow: "text-teal-800",
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    secondary: "border-teal-300 bg-white text-teal-900 hover:bg-teal-50",
    link: "text-teal-800 hover:text-teal-950",
  };
}

/**
 * Secondary satellite → www funnel block after the owned city-chat CTA.
 * Assist first for guides/qa; wizard first for news/lifehacks.
 */
export function SatelliteFunnelCta({
  countryKey,
  placement,
  noteSlug,
  noteTitle,
  contentKind,
}: Props) {
  const a = accent(countryKey);
  const content = noteSlug ?? "hub";
  const preferAssist = contentKind === "guide" || contentKind === "qa" || !contentKind;
  const countryLabel =
    countryKey === "spain"
      ? "Испания"
      : countryKey === "italy"
        ? "Италия"
        : countryKey === "thailand"
          ? "Таиланд"
          : "Португалия";

  const assistHref = satelliteAssistUrl({ countryKey, placement, content });
  const propertyHref =
    countryKey === "thailand"
      ? buildAssistUrl({
          locale: "ru",
          country: "thailand",
          program: "Недвижимость на Пхукете — Empyreal Estate",
          providerId: "empyreal-estate-phuket",
          source: "thailand_satellite",
        })
      : null;
  const wizardHref = satelliteWizardUrl({ countryKey, placement, content });
  const hubHref = satelliteHubUrl({ countryKey, placement, content });
  const pillarHref = satellitePillarUrl({ countryKey, placement, content });

  function trackAssist(label: string) {
    trackEvent("assist_cta_click", {
      placement,
      link_label: label,
      target_path: assistHref,
      locale: "ru",
      country: countryKey,
      program: "",
      note_slug: noteSlug ?? "",
    });
  }

  function trackCorridor(linkTarget: string, href: string) {
    trackEvent("corridor_link_click", {
      link_target: linkTarget,
      placement,
      note_slug: noteSlug ?? null,
      target_path: href,
      country: countryKey,
    });
  }

  const assistCta = "Получить помощь бесплатно";
  const wizardCta = `Визард ${countryLabel}`;

  return (
    <aside
      className={`mt-8 rounded-xl border p-5 ${a.shell}`}
      aria-label="Следующий шаг Emigro"
    >
      <p className={`text-xs font-bold uppercase tracking-wide ${a.eyebrow}`}>Следующий шаг</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {noteTitle
          ? `После «${noteTitle.slice(0, 72)}${noteTitle.length > 72 ? "…" : ""}» — сверьте маршрут ВНЖ или попросите Emigro найти специалиста.`
          : `Практика на сателлите. Маршрут и бесплатный запрос специалисту — на основном Emigro (${countryLabel}).`}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {preferAssist ? (
          <>
            <a
              href={assistHref}
              onClick={() => trackAssist(assistCta)}
              className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${a.primary}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {assistCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={wizardHref}
              onClick={() => trackCorridor("wizard", wizardHref)}
              className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${a.secondary}`}
            >
              <Compass className="h-4 w-4" aria-hidden />
              {wizardCta}
            </a>
          </>
        ) : (
          <>
            <a
              href={wizardHref}
              onClick={() => trackCorridor("wizard", wizardHref)}
              className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${a.primary}`}
            >
              <Compass className="h-4 w-4" aria-hidden />
              {wizardCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={assistHref}
              onClick={() => trackAssist(assistCta)}
              className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${a.secondary}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              {assistCta}
            </a>
          </>
        )}
        {propertyHref && (
          <a
            href={propertyHref}
            onClick={() =>
              trackEvent("assist_cta_click", {
                placement,
                link_label: "Подобрать недвижимость на Пхукете",
                target_path: propertyHref,
                locale: "ru",
                country: "thailand",
                program: "Недвижимость на Пхукете — Empyreal Estate",
                provider_id: "empyreal-estate-phuket",
                note_slug: noteSlug ?? "",
              })
            }
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold ${a.secondary}`}
          >
            Подобрать недвижимость на Пхукете
          </a>
        )}
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        <li>
          <a
            href={hubHref}
            onClick={() => trackCorridor("corridor_hub", hubHref)}
            className={`font-medium underline ${a.link}`}
          >
            Хаб коридора на emigro.online
          </a>
        </li>
        <li>
          <a
            href={pillarHref}
            onClick={() => trackCorridor("pillar", pillarHref)}
            className={`font-medium underline ${a.link}`}
          >
            Pillar-гид ВНЖ 2026
          </a>
        </li>
      </ul>
    </aside>
  );
}
