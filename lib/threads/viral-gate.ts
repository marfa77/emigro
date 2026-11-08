/**
 * A row publishes only after a second agent confirms it.
 * The writer records `writer`. That same id cannot set `viral.by`.
 */
export function viralRefusal(row: unknown, label: string): string | null {
  const rec =
    row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  const viral =
    rec.viral && typeof rec.viral === "object"
      ? (rec.viral as Record<string, unknown>)
      : {};
  const by = String(viral.by || "").trim();
  const writer = String(rec.writer || "").trim();
  const why = String(viral.why || "").trim();
  const at = String(viral.at || "").trim();
  if (viral.ok !== true || !by || !at || !why || !writer) {
    return `${label}: no independent viral confirmation`;
  }
  if (by === writer) {
    return `${label}: viral confirmation is from the writer`;
  }
  return null;
}
