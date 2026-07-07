import type { Metadata } from "next";
import { CONTENT_KIND_LABELS, hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata } from "@/lib/seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { portugalSatellitePublicUrl } from "@/lib/site-url";

const GEO = {
  country: "Portugal",
  countryCode: "PT",
  city: "Porto",
  region: "Norte",
  latitude: 41.1579,
  longitude: -8.6291,
  audience: "Russian-speaking relocants in Portugal (RU, BY, UA, KZ passports), primarily Norte (Porto, Braga, Minho)",
} as const;

const CITY_GEO: Record<string, { city: string; region: string; latitude: number; longitude: number }> = {
  lisbon: { city: "Lisbon", region: "Lisbon Metropolitan Area", latitude: 38.7223, longitude: -9.1393 },
  porto: { city: "Porto", region: "Norte", latitude: 41.1579, longitude: -8.6291 },
};

const TOPIC_GEO_KEYWORDS: Record<string, string[]> = {
  nif: ["NIF Portugal", "Finanças Porto", "e-Fatura"],
  aima: ["AIMA Portugal", "Agora appointment", "VNG Portugal"],
  arenda: ["rent Porto", "arrendamento Portugal", "rent Braga"],
  bank: ["bank account Portugal", "conta bancária"],
  sns: ["SNS Portugal", "numero utente"],
  ciple: ["CIPLE CAPLE Portugal"],
  transport: ["Porto metro CP", "transport Norte"],
  sim: ["SIM card Portugal"],
  school: ["school Porto expat", "international school Braga"],
  general: ["Portugal relocation", "Norte expat", "Porto expat"],
};

export function communityNoteUrl(slug: string): string {
  return communityNotePublicUrl(slug);
}

export function buildCommunityNoteKeywords(note: CommunityNote): string[] {
  const base = [
    "Португалия",
    "Порту",
    "Norte",
    "релокация",
    CONTENT_KIND_LABELS[note.content_kind],
    note.category,
    ...note.topic_tags,
    ...note.hashtags.map((h) => hashtagLabel(normalizeHashtag(h))),
  ];
  for (const tag of note.topic_tags) {
    const geo = TOPIC_GEO_KEYWORDS[tag];
    if (geo) base.push(...geo);
  }
  return Array.from(new Set(base.map((k) => k.trim()).filter(Boolean))).slice(0, 12);
}

export function buildCommunityNoteMetadata(note: CommunityNote): Metadata {
  const url = communityNoteUrl(note.slug);
  const title = fitSeoTitlePart(note.seo_title || note.title);
  const description = fitMetaDescription(note.seo_description || note.excerpt || note.quick_answer);
  const keywords = buildCommunityNoteKeywords(note);
  const ogImage = socialImageMetadata(resolveNoteOgImage(note), note.title);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: { "ru-RU": url, ru: url, "x-default": url },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: note.title,
      description: note.excerpt || description,
      url,
      siteName: "Emigro Portugal",
      locale: "ru_RU",
      type: "article",
      ...(note.published_at ? { publishedTime: note.published_at } : {}),
      modifiedTime: note.updated_at,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.excerpt || description,
      images: [ogImage.url],
    },
  };
}

function schemaTypeForKind(kind: ContentKind): "NewsArticle" | "Article" {
  return kind === "news" ? "NewsArticle" : "Article";
}

function placeSchema(city?: string) {
  const geo = (city ? CITY_GEO[city] : undefined) ?? CITY_GEO.porto;
  const locality = geo.city;
  return {
    "@type": "Place" as const,
    name: `${locality}, ${GEO.country}`,
    address: {
      "@type": "PostalAddress" as const,
      addressCountry: GEO.countryCode,
      addressLocality: locality,
      addressRegion: geo.region,
    },
    geo: {
      "@type": "GeoCoordinates" as const,
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
  };
}

export function buildCommunityNoteSchemas(note: CommunityNote) {
  const url = communityNoteUrl(note.slug);
  const schemaType = schemaTypeForKind(note.content_kind);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: note.title,
    description: note.excerpt || note.quick_answer,
    abstract: note.quick_answer,
    datePublished: note.published_at,
    dateModified: note.updated_at,
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: schemaImage(resolveNoteOgImage(note)),
    inLanguage: "ru-RU",
    keywords: buildCommunityNoteKeywords(note).join(", "),
    about: [placeSchema(note.city), ...note.topic_tags.map((t) => ({ "@type": "Thing", name: t }))],
    contentLocation: placeSchema(note.city),
    spatialCoverage: placeSchema(note.city),
    audience: {
      "@type": "Audience",
      audienceType: GEO.audience,
      geographicArea: placeSchema(note.city),
    },
    ...(note.official_links.length
      ? {
          citation: note.official_links.map((l) => ({
            "@type": "CreativeWork",
            name: l.title,
            url: l.url,
          })),
        }
      : {}),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: PORTUGAL_SATELLITE.title, item: portugalSatellitePublicUrl("/") },
    { name: note.category, item: portugalSatellitePublicUrl(`/tag/${note.topic_tags[0] ?? "portugal"}`) },
    { name: note.title },
  ]);

  const faqSchema =
    note.faq.length >= 1
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: note.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name: note.title,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".community-quick-answer", "h1", "#takeaways-heading"],
    },
  };

  return { articleSchema, breadcrumbSchema, faqSchema, speakableSchema };
}

export function buildCommunityNoteLlmFacts(note: CommunityNote): string[] {
  const facts = [
    note.quick_answer,
    `${CONTENT_KIND_LABELS[note.content_kind]} · ${note.category} · ${GEO.city}, ${GEO.country}`,
    note.excerpt,
    ...note.key_takeaways,
  ];
  for (const item of note.faq.slice(0, 3)) {
    facts.push(`Q: ${item.q} A: ${item.a}`);
  }
  if (note.official_links[0]) {
    facts.push(`Official: ${note.official_links[0].title} — ${note.official_links[0].url}`);
  }
  return facts.filter(Boolean);
}

export function buildCommunityNoteLlmDescription(note: CommunityNote): string {
  return [
    note.quick_answer,
    `География: ${GEO.city}, ${GEO.country}. Аудитория: ${GEO.audience}.`,
    `Emigro — editorial note, not legal advice. Verify on official portals before filing.`,
  ]
    .filter(Boolean)
    .join(" ");
}

export async function buildPortugalLlmsTxt(notes: CommunityNote[]): Promise<string> {
  const hub = portugalSatellitePublicUrl("/");
  const lines = [
    "# portugal.emigro.online — практика для релокантов",
    "",
    `> ${PORTUGAL_SATELLITE.tagline}`,
    `> Аудитория: ${GEO.audience}. Не юридическая консультация.`,
    `> Hub: ${hub}`,
    "",
    "## Материалы (editorial notes)",
    "",
  ];

  for (const note of notes) {
    const url = communityNoteUrl(note.slug);
    lines.push(`- [${note.title}](${url}): ${note.quick_answer.replace(/\s+/g, " ").slice(0, 220)}`);
  }

  lines.push("", "## Official corridors", "", `- Portugal corridor: https://www.emigro.online/ru/portugal`, "");
  return lines.join("\n");
}
