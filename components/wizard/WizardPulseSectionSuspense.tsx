import { Suspense } from "react";
import { WizardPulseSection } from "@/components/wizard/WizardPulseSection";

function WizardPulseFallback() {
  return (
    <section
      className="mt-10 animate-pulse rounded-2xl border border-corridor-500/20 bg-slate-900/90 p-6"
      aria-hidden
    >
      <div className="h-6 w-56 rounded bg-slate-700" />
      <div className="mt-3 h-4 w-72 rounded bg-slate-800" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-xl bg-slate-800" />
        ))}
      </div>
    </section>
  );
}

export function WizardPulseSectionSuspense() {
  return (
    <Suspense fallback={<WizardPulseFallback />}>
      <WizardPulseSection />
    </Suspense>
  );
}
