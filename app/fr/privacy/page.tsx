import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { FR_PATHS } from "@/lib/fr/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité Emigro (version FR) : données collectées, usage et droits RGPD.",
  path: FR_PATHS.privacy,
  locale: "fr",
});

const UPDATED = "10 août 2026";

export default function FrPrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" updated={UPDATED} locale="fr">
      <LegalSection title="1. Qui sommes-nous">
        <p>
          Emigro (site{" "}
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            emigro.online/fr
          </Link>
          ) est un service d&apos;information sur la relocalisation vers la France. L&apos;opérateur traite des
          données dans le cadre des guides, du contact et, à l&apos;avenir, de l&apos;évaluation de routes.
        </p>
        <p>
          Contact données personnelles :{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="2. Quelles données">
        <ul className="list-disc space-y-2 pl-5">
          <li>Coordonnées que vous nous envoyez (email, message).</li>
          <li>Données techniques de base (journaux serveur, analytics agrégés).</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Vos droits">
        <p>
          Conformément au RGPD, vous pouvez demander accès, rectification ou suppression en écrivant à{" "}
          {CONTACT_EMAIL}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
