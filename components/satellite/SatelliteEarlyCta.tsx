import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { publicSiteUrl } from "@/lib/site-url";

const COUNTRY_RU: Record<SatelliteCountryKey, string> = {
  spain: "Испании",
  portugal: "Португалии",
  italy: "Италии",
  thailand: "Таиланде",
};

/**
 * Compact request CTA right under the quick answer. Long satellite notes used to show the
 * first money CTA after 2 000+ words; this puts one straight path to the free request form on screen early.
 */
export function SatelliteEarlyCta({ countryKey, noteSlug }: { countryKey: SatelliteCountryKey; noteSlug: string }) {
  const source = `${countryKey}_satellite`;
  const qs = new URLSearchParams({
    country: countryKey,
    source,
    utm_source: "emigro",
    utm_medium: "satellite",
    utm_campaign: `${countryKey}_early_cta`,
    utm_content: noteSlug,
  });
  const href = `${publicSiteUrl()}/ru/assist?${qs.toString()}#assist-form`;
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-relaxed text-slate-700">
        <strong className="text-slate-950">Нужна помощь с переездом в {COUNTRY_RU[countryKey] ?? "страну"}?</strong> Оставьте
        заявку — бесплатно подберём специалиста под ваш случай.
      </p>
      <TrackedAssistLink
        href={href}
        placement="satellite_note_early"
        linkLabel="Оставить заявку"
        country={countryKey}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-corridor-600 px-4 py-2 text-sm font-semibold text-white hover:bg-corridor-700"
      >
        Оставить заявку
      </TrackedAssistLink>
    </div>
  );
}
