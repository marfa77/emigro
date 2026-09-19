/** Extract visible FAQ pairs from guide HTML for FAQPage schema (must match on-page Q&A). */

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Heading text of this h2 only — do not match “RMA FAQ” in an earlier section. */
const FAQ_HEADING =
  /<h2[^>]*>((?:(?!<\/h2>)[\s\S])*?(?:FAQ|Preguntas frecuentes|Foire aux questions|Questions fr[ée]quentes)(?:(?!<\/h2>)[\s\S])*)<\/h2>([\s\S]*?)(?=<h2|$)/i;

export type GuideFaqItem = { question: string; answer: string };

export function extractGuideFaq(bodyHtml: string, limit = 7): GuideFaqItem[] {
  const faqSection = FAQ_HEADING.exec(bodyHtml)?.[2] ?? "";

  const sectionMatches = Array.from(
    faqSection.matchAll(
      /<section[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/section>/g
    )
  );
  const h3Matches = Array.from(
    faqSection.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g)
  );
  const legacyCombined = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s+([\s\S]*?)<\/p>/g)
  );
  const legacySplit = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>\s*<p[^>]*>(.*?)<\/p>/g)
  );

  const matches =
    sectionMatches.length > 0
      ? sectionMatches
      : h3Matches.length > 0
        ? h3Matches
        : legacyCombined.length > 0
          ? legacyCombined
          : legacySplit;

  return matches
    .map((match) => ({
      question: stripHtml(match[1] ?? ""),
      answer: stripHtml(match[2] ?? ""),
    }))
    .filter((item) => item.question && item.answer)
    .slice(0, limit);
}

export function buildFaqPageSchema(items: GuideFaqItem[]) {
  if (items.length < 5) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
