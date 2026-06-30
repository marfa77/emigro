import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-slate-600">Страница не найдена.</p>
        <Link href="/ru" className="mt-6 inline-block text-corridor-600 hover:underline">
          ← На главную
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
