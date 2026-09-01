import { AssistLeadForm } from "@/components/assist/AssistLeadForm";
import { getAssistCountryOptions } from "@/lib/corridor/registry";
import { getAssistLeadProviders } from "@/lib/providers/registry";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { satelliteAssistUrl } from "@/lib/satellite/funnel-urls";

/**
 * Compact Assist intake on satellite hub — posts to shared /api (no host rewrite).
 * Country locked to the satellite corridor.
 */
export function SatelliteAssistIntake({ countryKey }: { countryKey: SatelliteCountryKey }) {
  const allCountries = getAssistCountryOptions();
  const countries = allCountries.filter((c) => c.value === countryKey);
  const fallback = allCountries.filter((c) =>
    countryKey === "spain" ? c.value === "spain" : c.value === "portugal"
  );
  const countryOptions = (countries.length > 0 ? countries : fallback).map((c) => ({
    label: c.label,
    value: c.value,
    corridorSlug: c.corridorSlug,
  }));

  const corridorSlug = countryOptions[0]?.corridorSlug ?? countryKey;
  const providers = getAssistLeadProviders()
    .filter((p) => p.corridorSlugs?.includes(corridorSlug))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      corridorSlugs: p.corridorSlugs ?? [],
    }));

  const accent =
    countryKey === "spain"
      ? "border-amber-200 bg-amber-50/50"
      : "border-teal-200 bg-teal-50/50";

  const fallbackUrl = satelliteAssistUrl({
    countryKey,
    placement: "satellite_hub_intake",
    content: "hub_form",
  });

  if (countryOptions.length === 0) {
    return (
      <section className={`mt-12 rounded-2xl border p-5 ${accent}`} id="assist-intake">
        <h2 className="text-lg font-semibold text-slate-900">Route Check — €129</h2>
        <p className="mt-2 text-sm text-slate-700">
          Разбор кейса с командой Emigro — заявка на основном сайте.
        </p>
        <a href={fallbackUrl} className="mt-3 inline-block text-sm font-semibold text-teal-800 underline">
          Открыть форму Assist →
        </a>
      </section>
    );
  }

  return (
    <section className={`mt-12 rounded-2xl border p-5 sm:p-6 ${accent}`} id="assist-intake">
      <h2 className="text-lg font-semibold text-slate-900">Route Check — €129</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Созвон с командой Emigro по чек-листу, PDF с разбором кейса за 48 часов и подбор партнёров.
        Оплата — после согласования слота. Не юридическая консультация.
      </p>
      <div className="mt-5">
        <AssistLeadForm
          countries={countryOptions}
          providers={providers}
          defaultPlanTier="route-check"
          initialCountry={countryKey}
          locale="ru"
          leadSource={`emigro_assist_satellite_${countryKey}`}
        />
      </div>
    </section>
  );
}
