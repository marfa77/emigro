import Link from "next/link";

const PASSPORTS = [
  { value: "RU", label: "Россия" },
  { value: "BY", label: "Беларусь" },
  { value: "UA", label: "Украина" },
  { value: "KZ", label: "Казахстан" },
] as const;

type Props = {
  title: string;
  body: string;
  /** Hub wizard `?interest=` key. Ranking hint only. */
  interest?: string;
};

function wizardHref(passport: string, interest?: string) {
  const params = new URLSearchParams({ passport });
  if (interest) params.set("interest", interest);
  return `/ru/wizard?${params.toString()}`;
}

/** First hub-wizard question. Passport is a link so the guide page does not add another client bundle. */
export function GuideWizardStart({ title, body, interest }: Props) {
  return (
    <section
      id="guide-wizard"
      aria-label={title}
      className="mt-8 scroll-mt-24 rounded-[2rem] border border-corridor-200 bg-white p-6 shadow-sm ring-1 ring-corridor-100 sm:p-7"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
        Бесплатно · около 2 минут
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{body}</p>
      <p id="guide-wizard-passport" className="mt-5 text-sm font-semibold text-slate-900">
        Ваш паспорт
      </p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="guide-wizard-passport">
        {PASSPORTS.map((passport) => (
          <Link
            key={passport.value}
            href={wizardHref(passport.value, interest)}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-corridor-300"
          >
            {passport.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">Дальше — доход и семья →</p>
    </section>
  );
}
