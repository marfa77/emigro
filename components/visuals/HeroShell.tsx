import type { ReactNode } from "react";

export function HeroShell({
  children,
  visual,
  className = "",
}: {
  children: ReactNode;
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-corridor-600 to-corridor-900 px-6 py-10 text-white sm:px-8 sm:py-12 ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl"
        aria-hidden
      />

      <div className={`relative ${visual ? "grid items-center gap-8 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]" : ""}`}>
        <div>{children}</div>
        {visual && (
          <div className="hidden justify-center lg:flex" aria-hidden>
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
