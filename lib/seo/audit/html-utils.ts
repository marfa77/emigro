export function extractMeta(html: string, name: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const m = html.match(re);
  if (m?.[1]) return m[1];

  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i"
  );
  return re2.exec(html)?.[1];
}

export function extractTitle(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
}

export function extractCanonical(html: string): string | undefined {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (m?.[1]) return m[1];
  return html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i)?.[1];
}

export function extractHreflang(html: string): string[] {
  const out: string[] = [];
  const re = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push(m[1]);
  }
  return out;
}

export function extractJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]) as unknown;
      collectSchemaTypes(parsed, types);
    } catch {
      // skip malformed blocks
    }
  }
  return Array.from(types);
}

function collectSchemaTypes(node: unknown, types: Set<string>): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectSchemaTypes(item, types);
    return;
  }
  const obj = node as Record<string, unknown>;
  if (typeof obj["@type"] === "string") types.add(obj["@type"]);
  if (Array.isArray(obj["@type"])) {
    for (const t of obj["@type"]) {
      if (typeof t === "string") types.add(t);
    }
  }
  for (const value of Object.values(obj)) {
    collectSchemaTypes(value, types);
  }
}

export function extractAiDescription(html: string): string | undefined {
  const m = html.match(/ai:description[\s\S]{0,200}?<\/h2>\s*([\s\S]{0,600}?)(?:<\/|$)/i);
  return m?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractGeoSignals(html: string): string[] {
  const signals: string[] = [];
  const patterns = [
    /Porto|Порту|Norte|Braga|Minho|Lisboa|Lisbon|Лиссабон/gi,
    /Valencia|Валенсия|Comunitat Valenciana|Madrid|Barcelona/gi,
    /Place["'][^>]*>[\s\S]{0,300}/gi,
    /geo\.latitude|geo\.longitude|GeoCoordinates/gi,
  ];
  for (const re of patterns) {
    const matches = html.match(re);
    if (matches) signals.push(...matches.slice(0, 5));
  }
  return Array.from(new Set(signals)).slice(0, 12);
}

export function countWizardCtas(html: string): number {
  const wizardLinks = html.match(/href=["'][^"']*\/wizard[^"']*["']/gi) ?? [];
  const ctaText = html.match(/Подобрать|wizard|Wizard/gi) ?? [];
  return wizardLinks.length + Math.min(ctaText.length, 10);
}

export function extractInternalLinks(html: string, origin: string): string[] {
  const links = new Set<string>();
  const re = /href=["'](\/[^"'#?][^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    links.add(`${origin.replace(/\/$/, "")}${m[1]}`);
  }
  return Array.from(links).slice(0, 20);
}
