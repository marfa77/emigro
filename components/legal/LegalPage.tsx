import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Обновлено: {updated}</p>
        <article className="prose-legal mt-8 space-y-6 text-slate-700">{children}</article>
      </main>
      <SiteFooter />
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
