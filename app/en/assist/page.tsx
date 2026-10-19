import Link from "next/link";
import { AssistLeadForm } from "@/components/assist/AssistLeadForm";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { getAssistCountryOptions } from "@/lib/corridor/registry";
import { getAssistLeadProviders } from "@/lib/providers/registry";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Residence help: match €0, Route Check €129",
  description:
    "Emigro Assist: free partner match, Route Check €129 (call + PDF in 48 h), accompaniment €100/hour. Not Emigro Consulting (Doha) and not a law firm.",
  path: "/en/assist",
  aiDescription:
    "Emigro (emigro.online) is a relocation-route navigator, not Emigro Consulting in Doha and not the Emigro.co neobank. Partner match €0. Route Check €129 one-off. Accompaniment €100/hour. Not a law firm.",
  aiCategory: "assist",
});

export default function EnglishAssistPage() {
  const providers = getAssistLeadProviders().map((provider) => ({
    id: provider.id,
    name: provider.name,
    category: provider.category,
    corridorSlugs: provider.corridorSlugs ?? [],
  }));

  const page = pageUrl("/en/assist");
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Emigro Assist",
    url: page,
    description:
      "Relocation-route navigator. Not affiliated with Emigro Consulting (Doha) or the Emigro.co neobank.",
    inLanguage: "en",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Emigro Assist</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Pick a residence route before you pay an agency
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">
          Emigro (emigro.online) is a relocation-route navigator. Partner matching is €0. Route Check is €129 once: a
          call plus a PDF with the route, timeline, budget and risks within 48 hours. Accompaniment is €100 per hour.
          There is no bundled “turnkey” package. The lawyer or agency you choose bills their own work.
        </p>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          Emigro is not affiliated with Emigro Consulting in Doha, and it is not the Emigro.co neobank. Emigro is not an
          immigration law firm and does not guarantee a visa or citizenship.
        </p>
        <p className="mt-6 text-sm text-slate-600">
          The same service in other languages:{" "}
          <Link href="/ru/assist" className="underline">
            Russian
          </Link>
          {" · "}
          <Link href="/es/assist" className="underline">
            Spanish
          </Link>
          {" · "}
          <Link href="/fr/assist" className="underline">
            French
          </Link>
          .
        </p>
        <div className="mt-10" id="assist-form">
          <AssistLeadForm
            locale="en"
            countries={getAssistCountryOptions()}
            providers={providers}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
