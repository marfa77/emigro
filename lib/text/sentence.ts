/** End a sentence with exactly one terminal mark: requirement texts often already end with a period. */
export function withPeriod(text: string): string {
  const trimmed = text.trimEnd();
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}
