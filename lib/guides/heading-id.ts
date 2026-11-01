/** Stable in-page id for a guide H2. Shared by the markdown renderer and in-page navigators. */
export function guideHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/€/g, "eur")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
