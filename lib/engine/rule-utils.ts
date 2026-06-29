/** Remove hardcoded passport_iso2 gates when passport eligibility is already resolved via DB. */
export function stripPassportConstraint(
  rule: Record<string, unknown>,
  passportStatus?: string
): Record<string, unknown> {
  if (!passportStatus || passportStatus === "ineligible") return rule;
  return simplifyRule(stripPassportNodes(rule));
}

function isPassportClause(node: unknown): boolean {
  if (!node || typeof node !== "object") return false;
  const clause = node as Record<string, unknown>;
  const eq = clause["=="];
  if (!Array.isArray(eq) || eq.length !== 2) return false;
  const left = eq[0];
  return Boolean(left && typeof left === "object" && (left as { var?: string }).var === "passport_iso2");
}

function stripPassportNodes(node: unknown): unknown {
  if (!node || typeof node !== "object") return node;

  // Arrays must be mapped element-by-element to preserve their structure. Without this guard the
  // generic Object.entries loop below converts arrays (e.g. the two-element argument list of a
  // json-logic operator like `==` or `>=`) into plain objects with numeric string keys ("0", "1",
  // …). That corrupts the rule so that json-logic can no longer evaluate it and
  // isPassportClause can no longer recognise the passport clause — every rule then silently fails
  // and the evaluation fallback fires for every program.
  if (Array.isArray(node)) {
    return node.map(stripPassportNodes);
  }

  const obj = node as Record<string, unknown>;

  if (Array.isArray(obj.and)) {
    const next = obj.and.map(stripPassportNodes).filter((child) => !isPassportClause(child));
    return { and: next };
  }

  if (Array.isArray(obj.or)) {
    return { or: obj.or.map(stripPassportNodes) };
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    out[key] = stripPassportNodes(value);
  }
  return out;
}

function simplifyRule(node: unknown): Record<string, unknown> {
  if (!node || typeof node !== "object") return {};
  const obj = node as Record<string, unknown>;
  if (Array.isArray(obj.and)) {
    const clauses = obj.and.filter(Boolean);
    if (clauses.length === 0) return {};
    if (clauses.length === 1) return simplifyRule(clauses[0]);
    return { and: clauses };
  }
  return obj;
}
