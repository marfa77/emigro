import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ES_PATHS } from "@/lib/es/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Política de privacidad",
  description:
    "Política de privacidad de Emigro (versión ES): qué datos se recogen, cómo se usan y cómo ejercer derechos GDPR.",
  path: ES_PATHS.privacy,
  locale: "es",
});

const UPDATED = "10 de agosto de 2026";

export default function EsPrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" updated={UPDATED} locale="es">
      <LegalSection title="1. Quiénes somos">
        <p>
          Emigro (sitio{" "}
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            emigro.online/es
          </Link>
          ) es un servicio informativo sobre reubicación a Europa. El operador trata datos en el
          marco de guías, contacto y, en el futuro, evaluación de rutas.
        </p>
        <p>
          Contacto sobre datos personales:{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="2. Qué datos recogemos">
        <ul className="list-disc space-y-2 pl-5">
          <li>Datos que nos envía por email (nombre, mensaje, correo).</li>
          <li>Datos técnicos básicos de analítica (páginas vistas, dispositivo) cuando aplica.</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Base jurídica">
        <p>
          Interés legítimo en operar el sitio informativo y, cuando escribe, ejecución de medidas
          precontractuales a petición suya. Puede solicitar acceso, rectificación o borrado.
        </p>
      </LegalSection>
      <LegalSection title="4. Versión completa">
        <p>
          La política detallada en ruso (producto principal) está en{" "}
          <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
            /ru/privacy
          </Link>
          . Esta página ES resume lo esencial para la superficie hispanohablante.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
