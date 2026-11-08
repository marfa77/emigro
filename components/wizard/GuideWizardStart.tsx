import Link from "next/link";

const PASSPORTS = {
  ru: [
    { value: "RU", label: "Россия" },
    { value: "BY", label: "Беларусь" },
    { value: "UA", label: "Украина" },
    { value: "KZ", label: "Казахстан" },
  ],
  es: [
    { value: "UY", label: "Uruguay" },
    { value: "EC", label: "Ecuador" },
    { value: "PE", label: "Perú" },
    { value: "PY", label: "Paraguay" },
    { value: "CO", label: "Colombia" },
    { value: "CL", label: "Chile" },
  ],
} as const;

type Props = {
  title: string;
  body: string;
  /** Hub wizard `?interest=` key. Ranking hint only. */
  interest?: string;
  locale?: "ru" | "es";
};

function wizardHref(locale: "ru" | "es", passport: string, interest?: string) {
  const params = new URLSearchParams({ passport });
  if (interest) params.set("interest", interest);
  return locale === "es" ? `/es/wizard?${params.toString()}` : `/ru/wizard?${params.toString()}`;
}

/** First hub-wizard question. Passport is a link so the guide page does not add another client bundle. */
export function GuideWizardStart({ title, body, interest, locale = "ru" }: Props) {
  const passports = PASSPORTS[locale];
  return (
    <section
      id="guide-wizard"
      aria-label={title}
      className="mt-8 scroll-mt-24 rounded-[2rem] border border-corridor-200 bg-white p-6 shadow-sm ring-1 ring-corridor-100 sm:p-7"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
        {locale === "es" ? "Gratis · unos 2 minutos" : "Бесплатно · около 2 минут"}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{body}</p>
      <p id="guide-wizard-passport" className="mt-5 text-sm font-semibold text-slate-900">
        {locale === "es" ? "Su pasaporte" : "Ваш паспорт"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="guide-wizard-passport">
        {passports.map((passport) => (
          <Link
            key={passport.value}
            href={wizardHref(locale, passport.value, interest)}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-corridor-300"
          >
            {passport.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        {locale === "es" ? "Siguiente: ingreso y familia →" : "Дальше — доход и семья →"}
      </p>
    </section>
  );
}
