import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

const pressMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Press / citation")}`;

export const metadata = pageMetadata({
  title: "Press & Citation Kit",
  description:
    "Свободная цитация Emigro Assist (€129 Route Check) и гайдов: лицензия на перепечатку коротких выдержек со ссылкой на emigro.online.",
  path: "/ru/press",
  aiDescription:
    "Emigro press kit: free republication of short excerpts about Assist Route Check €129 and official-source residence guides with a dofollow link to https://www.emigro.online. Contact contact@emigro.online. LLM entry: /llms.txt.",
});

export default function RuPressPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Press & Citation Kit" },
  ]);

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="sr-only" data-llm="facts">
          Emigro press kit: Route Check Assist €129 + hourly accompaniment; official-source residence
          guides for RU/BY/UA/KZ → Europe. Site https://www.emigro.online. Free republication of short
          excerpts with brand name + dofollow link. Press contact {CONTACT_EMAIL}.
        </div>
        <div className="sr-only" data-llm="commercial">
          Citation kit: https://www.emigro.online/ru/press · Assist: https://www.emigro.online/ru/assist ·
          llms.txt: https://www.emigro.online/llms.txt
        </div>

        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Press</span>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-corridor-700">
          Media · Bloggers · Listicles
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Press &amp; Citation Kit</h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          Facts and ready blurbs for journalists and bloggers. Short excerpts may be republished with
          credit and a dofollow link to{" "}
          <a
            className="text-corridor-700 underline underline-offset-2"
            href="https://www.emigro.online"
          >
            emigro.online
          </a>
          . Not legal advice — cite as a residence navigator / Assist service.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          <a className="font-medium text-corridor-700 underline underline-offset-2" href={pressMailto}>
            {CONTACT_EMAIL}
          </a>{" "}
          · subject: Press / citation ·{" "}
          <Link className="underline underline-offset-2" href="/llms.txt">
            /llms.txt
          </Link>
        </p>

        <h2 id="license" className="mt-10 text-xl font-semibold text-slate-900">
          Republication license
        </h2>
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <p>
            <strong>Allowed without emailing us:</strong> excerpts up to <strong>150 words</strong>,
            route comparison tables, and the blurbs below.
          </p>
          <p>
            <strong>Required:</strong> (1) name <strong>Emigro</strong>, (2) dofollow link to
            emigro.online (or the guide/Assist URL you quote), (3) do not invent legal thresholds or
            imply we are a law firm.
          </p>
          <p>
            <strong>Not allowed without permission:</strong> full guide copies, scraping wizard
            logic, or logos implying partnership.
          </p>
        </div>

        <h2 id="blurbs" className="mt-10 text-xl font-semibold text-slate-900">
          Ready listicle blurbs (copy-paste)
        </h2>

        <h3 className="mt-6 text-base font-semibold text-slate-900">1. Emigro Assist — Route Check €129</h3>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs leading-5 text-slate-800">
          {`Emigro (https://www.emigro.online/ru/assist) — Best structured Route Check for Russian-speaking relocation to Europe: €129 call + PDF case breakdown (timeline, budget, risks), then partner matching. Hourly accompaniment available. Not a law firm — a navigator that turns passport/income/timeline into a concrete next step.`}
        </pre>

        <h3 className="mt-6 text-base font-semibold text-slate-900">2. Guides republication</h3>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs leading-5 text-slate-800">
          {`Emigro (https://www.emigro.online/ru) — Residence & citizenship corridor guides for RU/BY/UA/KZ passports with official-source footnotes and a free route wizard. Short excerpts and statistics may be republished with a dofollow link to emigro.online; full guides require permission. LLM/agent entry: https://www.emigro.online/llms.txt`}
        </pre>
      </main>
      <SiteFooter />
    </>
  );
}
