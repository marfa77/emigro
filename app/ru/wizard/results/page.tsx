import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HubWizardResults } from "@/components/wizard/HubWizardResults";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { getHubWizardSession } from "@/lib/wizard/hub-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Результаты глобального подбора",
  description: "Сравнение маршрутов ВНЖ по Европе — не индексируется.",
  path: "/ru/wizard/results",
  noIndex: true,
});

export default async function HubWizardResultsPage({
  searchParams,
}: {
  searchParams: { session?: string };
}) {
  const sessionId = searchParams.session;
  if (!sessionId) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p>
            Нет сессии.{" "}
            <Link href="/ru/wizard" className="text-corridor-600 underline">
              Пройдите wizard
            </Link>
            .
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const session = await getHubWizardSession(sessionId);
  if (!session?.payload) notFound();

  const payload = session.payload as GlobalEvalPayload;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/ru/wizard" className="text-sm text-corridor-600 hover:underline">
          ← Пройти заново
        </Link>
        <div className="mt-6">
          <HubWizardResults
            sessionId={sessionId}
            passportIso2={session.passport_iso2 ?? "RU"}
            payload={payload}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
