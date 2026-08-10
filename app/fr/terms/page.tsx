import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { FR_PATHS } from "@/lib/fr/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Conditions d'utilisation",
  description:
    "Conditions d'utilisation Emigro (version FR) : information indicative, pas de conseil juridique.",
  path: FR_PATHS.terms,
  locale: "fr",
});

const UPDATED = "10 août 2026";

export default function FrTermsPage() {
  return (
    <LegalPage title="Conditions d'utilisation" updated={UPDATED} locale="fr">
      <LegalSection title="1. Objet">
        <p>
          Emigro publie des guides et hubs d&apos;information sur la résidence en France pour l&apos;Afrique
          francophone (
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            /fr
          </Link>
          ). Ce n&apos;est pas un conseil juridique ni une représentation auprès des autorités.
        </p>
      </LegalSection>
      <LegalSection title="2. Exactitude">
        <p>
          Les seuils et procédures évoluent. Vérifiez toujours France-Visas, service-public.fr et le consulat
          compétent à la date du dépôt.
        </p>
      </LegalSection>
      <LegalSection title="3. Contact">
        <p>
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
