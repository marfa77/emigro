import { fitMetaDescription, fitSeoTitleAbsolute, pageMetadata, SITE_NAME } from "@/lib/seo";
import { listGuides } from "@/lib/guides/load";
import {
  GUIDE_CATEGORIES,
  GUIDE_AUDIENCES,
  getGuideCategoryById,
  getGuideAudienceById,
} from "@/lib/guides/categories";
import { getPtLongTailByGuideSlug } from "@/lib/seo/pt-longtail";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";
import { buildLlmCitationPrompts } from "@/lib/seo/llm-citation-prompts";
import { publicSiteUrl, portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";
import {
  countWizardCtas,
  extractAiDescription,
  extractCanonical,
  extractGeoSignals,
  extractHreflang,
  extractInternalLinks,
  extractJsonLdTypes,
  extractMeta,
  extractTitle,
} from "./html-utils";
import { runFunnelChecks } from "./funnel-checks";
import type {
  AuditContext,
  CitationCheck,
  DuplicateGroup,
  FetchProbe,
  PageProbe,
} from "./types";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

type PageMeta = { url: string; title: string; description: string; source: string };

function resolveTitle(metadata: ReturnType<typeof pageMetadata>): string {
  const t = metadata.title;
  if (typeof t === "string") return `${t}${TITLE_SUFFIX}`;
  if (t && typeof t === "object" && "absolute" in t && t.absolute) return t.absolute;
  if (t && typeof t === "object" && "default" in t) return String(t.default);
  return String(t);
}

function addPage(pages: PageMeta[], input: {
  url: string;
  title: string;
  description: string;
  titleAbsolute?: boolean;
  source: string;
}) {
  const meta = pageMetadata({
    title: input.title,
    description: input.description,
    path: input.url.replace(/^https?:\/\/[^/]+/, "") || input.url,
    titleAbsolute: input.titleAbsolute,
  });
  pages.push({
    url: input.url,
    title: resolveTitle(meta),
    description: String(meta.description ?? input.description),
    source: input.source,
  });
}

function findDuplicates(pages: PageMeta[], field: "title" | "description"): DuplicateGroup[] {
  const map = new Map<string, PageMeta[]>();
  for (const p of pages) {
    const list = map.get(p[field]) ?? [];
    list.push(p);
    map.set(p[field], list);
  }
  return Array.from(map.entries())
    .filter(([, list]) => list.length > 1)
    .map(([value, list]) => ({
      value,
      count: list.length,
      samples: list.slice(0, 6).map((p) => ({ url: p.url, source: p.source })),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

async function fetchProbe(url: string): Promise<FetchProbe> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Emigro-SEO-Audit/1.0" },
      redirect: "follow",
    });
    const body = await res.text();
    return {
      url,
      status: res.status,
      ok: res.ok,
      contentType: res.headers.get("content-type") ?? undefined,
      bytes: body.length,
    };
  } catch (e) {
    return {
      url,
      status: 0,
      ok: false,
      bytes: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function probePage(url: string): Promise<PageProbe> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Emigro-SEO-Audit/1.0" },
      redirect: "follow",
    });
    const html = await res.text();
    const jsonLdTypes = extractJsonLdTypes(html);
    return {
      url,
      status: res.status,
      title: extractTitle(html),
      description: extractMeta(html, "description"),
      canonical: extractCanonical(html),
      ogTitle: extractMeta(html, "og:title"),
      ogDescription: extractMeta(html, "og:description"),
      robots: extractMeta(html, "robots"),
      hreflang: extractHreflang(html),
      jsonLdTypes,
      aiDescription: extractAiDescription(html),
      hasFaqSchema: jsonLdTypes.includes("FAQPage"),
      hasSpeakable: jsonLdTypes.includes("SpeakableSpecification") || html.includes("SpeakableSpecification"),
      geoSignals: extractGeoSignals(html),
      wizardCtaCount: countWizardCtas(html),
      internalLinksSample: extractInternalLinks(html, new URL(url).origin),
    };
  } catch (e) {
    return {
      url,
      status: 0,
      hreflang: [],
      jsonLdTypes: [],
      hasFaqSchema: false,
      hasSpeakable: false,
      geoSignals: [],
      wizardCtaCount: 0,
      internalLinksSample: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function countXmlLocs(xml: string): number {
  return (xml.match(/<loc>/gi) ?? []).length;
}

async function collectStaticDuplicates(): Promise<{
  pagesAnalyzed: number;
  duplicateTitles: DuplicateGroup[];
  duplicateDescriptions: DuplicateGroup[];
}> {
  const pages: PageMeta[] = [];
  const staticPages = [
    {
      url: "/ru",
      title: "Emigro — ВНЖ и релокация в Европу",
      titleAbsolute: true,
      description:
        "Навигатор по ВНЖ и гражданству для русскоязычных: коридоры Европы, wizard подбора, справочники программ и еженедельные новости с источниками.",
    },
    {
      url: "/ru/guides",
      title: "Гайды по релокации и ВНЖ в Европе",
      description:
        "Практические pillar-гайды Emigro: маршруты для русскоязычных за рубежом и в СНГ — digital nomad, семья с детьми, отказы в визах, бюджет релокации и ВНЖ по странам ЕС.",
    },
    {
      url: "/ru/news",
      title: "Новости релокации в Европу",
      titleAbsolute: true,
      description:
        "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей.",
    },
    {
      url: "/ru/wizard",
      title: "Подбор страны и маршрута ВНЖ",
      titleAbsolute: true,
      description:
        "Ответьте на вопросы о паспорте, текущем месте жительства, доходе, работе и семье — Emigro проверит европейские коридоры и покажет подходящие программы.",
    },
  ];

  for (const p of staticPages) addPage(pages, { ...p, source: "static" });

  for (const cat of GUIDE_CATEGORIES) {
    const category = getGuideCategoryById(cat.id);
    addPage(pages, {
      url: `/ru/guides?cat=${cat.id}`,
      title: `Гайды: ${category.label}`,
      description: `${category.description} Pillar-гайды Emigro для русскоязычных за рубежом и в СНГ — wizard подбора маршрута ВНЖ.`,
      source: "guides-filter-cat",
    });
  }

  for (const aud of GUIDE_AUDIENCES) {
    const audience = getGuideAudienceById(aud.id);
    addPage(pages, {
      url: `/ru/guides?aud=${aud.id}`,
      title: `Гайды для ${audience.label}`,
      description: `Pillar-гайды Emigro для ${audience.label.toLowerCase()}: маршруты ВНЖ, документы, семья и бюджет релокации в Европу.`,
      source: "guides-filter-aud",
    });
  }

  for (const guide of listGuides()) {
    const longTail = getPtLongTailByGuideSlug(guide.slug);
    const title = longTail?.seoTitle ?? guide.seo_title ?? guide.title;
    const description =
      longTail?.seoDescription ??
      guide.seo_description ??
      guide.excerpt ??
      guide.quick_answer ??
      guide.title;
    const meta = pageMetadata({ title, description, path: `/ru/guides/${guide.slug}` });
    pages.push({
      url: `/ru/guides/${guide.slug}`,
      title: resolveTitle(meta),
      description: String(meta.description),
      source: "guide",
    });
  }

  for (const hub of TRANSIT_HUBS) {
    addPage(pages, {
      url: hub.path,
      title: hub.heroTitle ?? `${hub.countryRu}: транзитный хаб`,
      description: `${hub.quickAnswer} Не EU-коридор: первый шаг для стабилизации, документов, банков и подготовки маршрута в Европу.`,
      source: "transit-hub",
    });
  }

  return {
    pagesAnalyzed: pages.length,
    duplicateTitles: findDuplicates(pages, "title"),
    duplicateDescriptions: findDuplicates(pages, "description"),
  };
}

async function collectCitationChecks(baseUrl: string): Promise<{
  checks: CitationCheck[];
  meta: AuditContext["citationMeta"];
  llmsBody: string;
}> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/llms.txt`, {
    headers: { "User-Agent": "Emigro-SEO-Audit/1.0" },
  });
  const body = res.ok ? await res.text() : "";
  const prompts = buildLlmCitationPrompts();

  const checks: CitationCheck[] = prompts.map((prompt) => {
    const hasQuery = body.includes(prompt.question);
    const hasPath = body.includes(prompt.path);
    return {
      question: prompt.question,
      path: prompt.path,
      hasQuery,
      hasPath,
      ok: hasQuery && hasPath,
    };
  });

  return {
    checks,
    meta: {
      hasAiCard: body.includes("AI Answer Card"),
      hasUtm: body.includes("utm_source=llm"),
      hasHighIntent: body.includes("LLM High-Intent"),
      hasOriginHub: body.includes("/ru/rossiyane"),
      hasProgramIndex: body.includes("Программы ВНЖ — индекс для AI"),
    },
    llmsBody: body.slice(0, 4000),
  };
}

export async function collectAuditContext(baseUrlInput?: string): Promise<AuditContext> {
  const baseUrl = (baseUrlInput || process.env.EMIGRO_SEO_AUDIT_SITE_URL || publicSiteUrl()).replace(/\/$/, "");
  const portugalUrl = portugalSatellitePublicUrl("/");
  const spainUrl = spainSatellitePublicUrl("/");

  const probeUrls = [
    `${baseUrl}/llms.txt`,
    `${baseUrl}/llms-full.txt`,
    `${baseUrl}/llm-sitemap.xml`,
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/robots.txt`,
    `${baseUrl}/ru`,
    `${baseUrl}/ru/wizard`,
    `${baseUrl}/ru/guides`,
    `${portugalUrl}`,
    `${portugalUrl}/llms`,
    `${spainUrl}`,
    `${spainUrl}/llms`,
  ];

  const [probes, pages, citation, duplicates, funnel] = await Promise.all([
    Promise.all(probeUrls.map(fetchProbe)),
    Promise.all([
      probePage(`${baseUrl}/ru`),
      probePage(`${baseUrl}/ru/wizard`),
      probePage(`${baseUrl}/ru/guides`),
      probePage(`${baseUrl}/ru/portugal`),
      probePage(`${baseUrl}/ru/spain`),
      probePage(portugalUrl),
      probePage(spainUrl),
    ]),
    collectCitationChecks(baseUrl),
    collectStaticDuplicates(),
    Promise.resolve(runFunnelChecks()),
  ]);

  const llmsFullProbe = probes.find((p) => p.url.endsWith("/llms-full.txt"));
  const llmSitemapProbe = probes.find((p) => p.url.endsWith("/llm-sitemap.xml"));
  const sitemapProbe = probes.find((p) => p.url.endsWith("/sitemap.xml"));

  let llmsFullLineCount = 0;
  let llmSitemapUrlCount = 0;
  let sitemapUrlCount = 0;

  if (llmsFullProbe?.ok) {
    const text = await fetch(llmsFullProbe.url).then((r) => r.text());
    llmsFullLineCount = text.split("\n").filter(Boolean).length;
  }
  if (llmSitemapProbe?.ok) {
    const xml = await fetch(llmSitemapProbe.url).then((r) => r.text());
    llmSitemapUrlCount = countXmlLocs(xml);
  }
  if (sitemapProbe?.ok) {
    const xml = await fetch(sitemapProbe.url).then((r) => r.text());
    sitemapUrlCount = countXmlLocs(xml);
  }

  return {
    collectedAt: new Date().toISOString(),
    baseUrl,
    portugalUrl,
    spainUrl,
    probes,
    pages,
    citationChecks: citation.checks,
    citationMeta: citation.meta,
    funnelIssues: funnel.issues,
    guidesChecked: funnel.guidesChecked,
    duplicateTitles: duplicates.duplicateTitles,
    duplicateDescriptions: duplicates.duplicateDescriptions,
    pagesAnalyzed: duplicates.pagesAnalyzed,
    llmsFullLineCount,
    llmSitemapUrlCount,
    sitemapUrlCount,
    rubricRef: "docs/SATELLITE_SEO_GEO_LLM_AUDIT.md",
  };
}

export function formatContextForAgent(context: AuditContext): string {
  const citationPassed = context.citationChecks.filter((c) => c.ok).length;
  const citationFailed = context.citationChecks.filter((c) => !c.ok);

  return JSON.stringify(
    {
      collectedAt: context.collectedAt,
      scope: {
        baseUrl: context.baseUrl,
        portugalUrl: context.portugalUrl,
        spainUrl: context.spainUrl,
      },
      endpointProbes: context.probes,
      pageProbes: context.pages,
      llmLayer: {
        citationPromptsPassed: `${citationPassed}/${context.citationChecks.length}`,
        citationFailures: citationFailed.slice(0, 8),
        citationMeta: context.citationMeta,
        llmsFullLineCount: context.llmsFullLineCount,
        llmSitemapUrlCount: context.llmSitemapUrlCount,
        sitemapUrlCount: context.sitemapUrlCount,
      },
      seoDuplicates: {
        pagesAnalyzed: context.pagesAnalyzed,
        duplicateTitleGroups: context.duplicateTitles.slice(0, 10),
        duplicateDescriptionGroups: context.duplicateDescriptions.slice(0, 10),
      },
      funnel: {
        guidesChecked: context.guidesChecked,
        issues: context.funnelIssues.slice(0, 20),
        issueCount: context.funnelIssues.length,
      },
      rubricRef: context.rubricRef,
    },
    null,
    2
  );
}
