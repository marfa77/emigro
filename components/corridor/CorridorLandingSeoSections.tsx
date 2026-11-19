import type { NewsTopicConfig } from "@/lib/news/topics";
import type { FaqItem } from "@/lib/seo/corridor-page-seo";
import { inlineMarkdownWithBreaks } from "@/lib/markdown/inline";

/**
 * Corridor landing FAQ. The hidden LLM / sr-only blocks and the «Куда дальше» grid were removed on
 * 2026-11-19: hidden text is a search risk, and the grid duplicated the page navigation.
 */
export function CorridorLandingSeoSections({ topic, faq }: { topic: NewsTopicConfig; faq: FaqItem[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Частые вопросы про ВНЖ: {topic.countryRu}</h2>
      <div className="mt-5 space-y-5">
        {faq.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium text-slate-900">{item.question}</h3>
            <p
              className="mt-2 text-sm leading-relaxed text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-900"
              dangerouslySetInnerHTML={{ __html: inlineMarkdownWithBreaks(item.answer) }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
