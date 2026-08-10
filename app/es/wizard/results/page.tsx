import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { EsHubWizardResults } from "@/components/wizard/EsHubWizardResults";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { ES_PATHS } from "@/lib/es/corridor";
import { getHubWizardSession } from "@/lib/wizard/hub-queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Resultados del evaluador LATAM",
  description: "Comparación España / Portugal — no se indexa.",
  path: ES_PATHS.wizardResults,
  locale: "es",
  noIndex: true,
});

export default async function EsHubWizardResultsPage({
  searchParams,
}: {
  searchParams: { session?: string };
}) {
  const sessionId = searchParams.session;
  if (!sessionId) {
    return (
      <>
        <SiteHeader locale="es" />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p>
            No hay sesión.{" "}
            <Link href={ES_PATHS.wizard} className="text-corridor-600 underline">
              Complete el evaluador
            </Link>
            .
          </p>
        </main>
        <SiteFooter locale="es" />
      </>
    );
  }

  const session = await getHubWizardSession(sessionId);
  if (!session?.payload) notFound();

  const payload = session.payload as GlobalEvalPayload;

  return (
    <>
      <SiteHeader locale="es" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href={ES_PATHS.wizard} className="text-sm text-corridor-600 hover:underline">
          ← Volver a empezar
        </Link>
        <div className="mt-6">
          <EsHubWizardResults
            sessionId={sessionId}
            passportIso2={session.passport_iso2 ?? "UY"}
            payload={payload}
          />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
