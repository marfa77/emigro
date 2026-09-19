import { DEFAULT_EXTERNAL_AD_REL } from "@/lib/partners/link";
import { classifyReferralUrl } from "@/lib/partners/referral-inline";

/** Inline Markdown for trusted editorial strings (guides, notes). */
export function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
      const classified = classifyReferralUrl(href);
      if (classified) {
        return (
          `<a href="${href}" target="_blank" rel="${DEFAULT_EXTERNAL_AD_REL}"` +
          ` class="text-corridor-700 underline hover:text-corridor-900"` +
          ` data-partner-referral="${classified.provider}" data-partner-product="${classified.product}"` +
          ` data-partner-campaign="${classified.campaign}">${label}</a>`
        );
      }
      return `<a href="${href}" class="text-corridor-700 underline hover:text-corridor-900">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Plain text for meta, share, JSON-LD — drop bold/link markers. */
export function stripInlineMarkdown(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
