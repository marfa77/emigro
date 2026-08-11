import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { FrHubWizardResults } from "@/components/wizard/FrHubWizardResults";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { FR_PATHS } from "@/lib/fr/corridor";
import { getHubWizardSession } from "@/lib/wizard/hub-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Résultats de l'évaluateur Afrique → France",
  description: "Comparaison France — non indexé.",
  path: FR_PATHS.wizardResults,
  locale: "fr",
  noIndex: true,
});

export default async function FrHubWizardResultsPage({
  searchParams,
}: {
  searchParams: { session?: string };
}) {
  const sessionId = searchParams.session;
  if (!sessionId) {
    return (
      <>
        <SiteHeader locale="fr" />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p>
            Pas de session.{" "}
            <Link href={FR_PATHS.wizard} className="text-corridor-600 underline">
              Complétez l&apos;évaluateur
            </Link>
            .
          </p>
        </main>
        <SiteFooter locale="fr" />
      </>
    );
  }

  const session = await getHubWizardSession(sessionId);
  if (!session?.payload) notFound();

  const payload = session.payload as GlobalEvalPayload;

  return (
    <>
      <SiteHeader locale="fr" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href={FR_PATHS.wizard} className="text-sm text-corridor-600 hover:underline">
          ← Recommencer
        </Link>
        <div className="mt-6">
          <FrHubWizardResults
            sessionId={sessionId}
            passportIso2={session.passport_iso2 ?? "MA"}
            payload={payload}
          />
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}
