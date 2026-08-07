/** Inline Markdown for trusted editorial strings (guides, notes). */
export function inlineMarkdown(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-corridor-700 underline hover:text-corridor-900">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Plain text for meta, share, JSON-LD — drop bold/link markers. */
export function stripInlineMarkdown(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
