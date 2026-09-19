import type { EsOriginIso } from "@/lib/es/origin-hub-faq";
import { buildEsOriginHubFaq } from "@/lib/es/origin-hub-faq";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";

export function OriginHubFaq({ originIso }: { originIso: EsOriginIso }) {
  const faq = buildEsOriginHubFaq(originIso);
  const schema = buildFaqSchema(faq);
  const llmFacts = faq.map((item) => `${item.question} ${item.answer}`).join(" ");
  return (
    <>
      {schema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ) : null}
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{llmFacts}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <div className="sr-only" data-llm="facts" aria-hidden="true">
        {llmFacts}
      </div>
      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-4">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-medium text-slate-900">{item.question}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
