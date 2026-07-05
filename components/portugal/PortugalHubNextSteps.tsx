import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PORTUGAL_HUB_NEXT_STEPS, portugalHubPaths } from "@/lib/portugal/hub";

type Props = {
  guideHref?: string;
  placement?: string;
  className?: string;
};

export function PortugalHubNextSteps({
  guideHref = portugalHubPaths.digest,
  placement = "wizard_results",
  className,
}: Props) {
  const ctx = { guideHref, placement };

  return (
    <section
      className={`rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-6 ${className ?? ""}`}
      aria-labelledby="portugal-hub-next-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Portugal Hub</p>
      <h2 id="portugal-hub-next-heading" className="mt-1 text-xl font-semibold text-slate-900">
        Следующие шаги по Португалии
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Маршрут выбран — теперь следите за изменениями, готовьтесь к подаче и подключайтесь к локальному слою.
      </p>

      <ul className="mt-5 space-y-3">
        {PORTUGAL_HUB_NEXT_STEPS.map((step) => {
          const href = step.resolveHref(ctx);
          const linkClass = `font-medium hover:underline ${step.linkClass}`;

          return (
            <li key={step.id} className="rounded-lg border border-white bg-white/80 px-4 py-3">
              {step.external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 ${linkClass}`}
                >
                  {step.title}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <Link href={href} className={linkClass}>
                  {step.title}
                </Link>
              )}
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
