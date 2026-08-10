import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ES_PATHS } from "@/lib/es/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Términos de uso",
  description:
    "Términos de uso de Emigro (versión ES): información orientativa, sin asesoramiento jurídico.",
  path: ES_PATHS.terms,
  locale: "es",
});

const UPDATED = "10 de agosto de 2026";

export default function EsTermsPage() {
  return (
    <LegalPage title="Términos de uso" updated={UPDATED} locale="es">
      <LegalSection title="1. Servicio informativo">
        <p>
          Emigro publica guías y hubs de corredores de reubicación. El contenido es orientativo y no
          sustituye asesoramiento jurídico, fiscal o migratorio profesional.
        </p>
      </LegalSection>
      <LegalSection title="2. Exactitud">
        <p>
          Verifique siempre requisitos, tasas y umbrales en fuentes oficiales (consulados,
          extranjería, BOE) en la fecha de su trámite. Las normas cambian.
        </p>
      </LegalSection>
      <LegalSection title="3. Contacto">
        <p>
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . Términos completos en ruso:{" "}
          <Link href="/ru/terms" className="text-corridor-600 hover:underline">
            /ru/terms
          </Link>
          .
        </p>
      </LegalSection>
      <LegalSection title="4. Idioma">
        <p>
          La superficie{" "}
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            /es
          </Link>{" "}
          está dirigida a hispanohablantes (corredor semilla Uruguay → España).
        </p>
      </LegalSection>
    </LegalPage>
  );
}
