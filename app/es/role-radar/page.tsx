import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { ES_PATHS, esGuidePath } from "@/lib/es/corridor";
import { ROLE_RADAR_BOT_BASE, roleRadarBotHref } from "@/lib/role-radar";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Role Radar — vacantes según tu CV en Telegram",
  description:
    "Role Radar: digests de vacantes según tu CV en Telegram. Roles y regiones por filtros. Free, Scout y Operator. Producto hermano de Emigro para LATAM → Europa.",
  path: ES_PATHS.roleRadar,
  locale: "es",
  aiDescription:
    "Role Radar Telegram bot matches jobs to an uploaded CV. English bot UI; Spanish Emigro landing for LATAM readers. Sister product of Emigro ES.",
  aiCategory: "sister-product",
});

export default function EsRoleRadarPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Role Radar" },
  ]);
  const botHref = roleRadarBotHref("emigro_es");

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <span>Role Radar</span>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">Producto hermano</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Role Radar</h1>
        <p className="mt-4 text-lg text-slate-700">
          Bot de Telegram que empareja vacantes con tu CV. Tú eliges roles y regiones; no es un canal con la misma
          lista para todos. Ideal si miras nómada digital, trabajo remoto o empleo en Europa.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          La interfaz del bot está en <strong>inglés</strong>. Emigro te ayuda con el marco de residencia (España /
          Portugal); Role Radar busca el rol.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={botHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Abrir Role Radar en Telegram
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href={esGuidePath("visa-nomada-digital-espana-latam-2026")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800 hover:border-sky-300"
          >
            Guía nómada digital España
          </Link>
        </div>

        <section className="mt-10 space-y-4 text-sm text-slate-700">
          <h2 className="text-lg font-semibold text-slate-950">Cómo funciona</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Abres el bot y cargas tu CV (PDF/DOCX).</li>
            <li>Fijas roles, nivel y regiones (EU, UK, remote, etc.).</li>
            <li>Recibes digests en el chat — Free, Scout u Operator según plan.</li>
          </ol>
          <p className="text-xs text-slate-500">
            Bot: {ROLE_RADAR_BOT_BASE}. No es asesoría inmigratoria ni garantía de contrato.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p>
            También en Emigro ES:{" "}
            <Link href={ES_PATHS.wizard} className="font-medium text-corridor-700 hover:underline">
              evaluador
            </Link>
            {" · "}
            <Link href={ES_PATHS.spain} className="font-medium text-corridor-700 hover:underline">
              España
            </Link>
            {" · "}
            <Link href={ES_PATHS.portugal} className="font-medium text-corridor-700 hover:underline">
              Portugal
            </Link>
            {" · "}
            <Link href={ES_PATHS.assist} className="font-medium text-corridor-700 hover:underline">
              Assist
            </Link>
          </p>
        </section>

        <div className="mt-8">
          <Disclaimer locale="es" />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
