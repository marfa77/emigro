import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

/** Web dashboard off — stats live in Telegram `/stats`. */
export default function AdminStatsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold">Dashboard выключен</h1>
        <p className="mt-3 text-sm text-slate-600">
          Статистика приходит в Telegram: команда <code>/stats</code> боту.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
