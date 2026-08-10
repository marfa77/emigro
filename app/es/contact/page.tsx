import Link from "next/link";
import { Mail } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ES_PATHS } from "@/lib/es/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contacte al equipo Emigro en español: preguntas sobre el corredor Uruguay → España, partnership y feedback.",
  path: ES_PATHS.contact,
  locale: "es",
});

export default function EsContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Contacto" },
  ]);

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
          <span>Contacto</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold">Contacto</h1>
        <p className="mt-3 text-slate-600">
          Para preguntas sobre el servicio, partnership o feedback — escríbanos. Normalmente
          respondemos en 1–2 días hábiles.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-corridor-100 p-3 text-corridor-700">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="font-medium text-slate-900">Email</p>
              <a href={MAILTO_CONTACT} className="mt-1 text-lg text-corridor-600 hover:underline">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-3 text-sm text-slate-600">
                Indique en el asunto «LATAM → España» si escribe sobre el corredor uruguayo u otro
                pasaporte hispanoamericano.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Emigro no presta servicios jurídicos. Para trámites de residencia consulte a profesionales
          colegiados.
        </p>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
