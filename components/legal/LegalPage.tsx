import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ES_PATHS } from "@/lib/es/corridor";
import type { SiteLocale } from "@/lib/locale";

export function LegalPage({
  title,
  updated,
  children,
  locale = "ru",
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
  locale?: SiteLocale;
}) {
  const home = locale === "es" ? ES_PATHS.home : "/ru";
  const updatedLabel = locale === "es" ? "Actualizado:" : "Обновлено:";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={home} className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {updatedLabel} {updated}
        </p>
        <article className="prose-legal mt-8 space-y-6 text-slate-700">{children}</article>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
