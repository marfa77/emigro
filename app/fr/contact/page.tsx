import Link from "next/link";
import { Mail } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { FR_PATHS } from "@/lib/fr/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contactez l'équipe Emigro en français : Maghreb / Sénégal → France, partnership et feedback.",
  path: FR_PATHS.contact,
  locale: "fr",
  frHreflang: { destinationIso: "FR" },
});

export default function FrContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro FR", item: pageUrl(FR_PATHS.home) },
    { name: "Contact" },
  ]);

  return (
    <>
      <SiteHeader locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro FR
          </Link>
          <span className="mx-2">/</span>
          <span>Contact</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold">Contact</h1>
        <p className="mt-3 text-slate-600">
          Pour des questions sur le service, un partnership ou un feedback — écrivez-nous. Réponse habituelle sous
          1–2 jours ouvrés. Pour un Route Check payant, utilisez aussi{" "}
          <Link href={FR_PATHS.assist} className="font-medium text-corridor-700 hover:underline">
            Emigro Assist
          </Link>
          .
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
                Indiquez dans l&apos;objet « Maghreb → France » ou votre passeport (MA / DZ / TN / SN).
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}
