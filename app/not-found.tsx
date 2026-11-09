import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { mainSiteUrl } from "@/lib/satellite/paths";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: false },
};

/**
 * Root 404. No headers()/cookies() here: the root not-found sits in every route's tree,
 * so one dynamic call made the whole site render per request (cache-control: private,
 * x-vercel-cache MISS). The old portugal.* branch was dead anyway: that host 301s to porto.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-slate-600">Страница не найдена.</p>
        <a href={mainSiteUrl("/ru")} className="mt-6 inline-block text-corridor-600 hover:underline">
          ← На главную
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
