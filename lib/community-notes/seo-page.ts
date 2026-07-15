import type { Metadata } from "next";
import { CONTENT_KIND_LABELS, hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata } from "@/lib/seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";

const GEO = {
  country: "Portugal",
  countryCode: "PT",
  city: "Porto",
  region: "Norte",
  latitude: 41.1579,
  longitude: -8.6291,
  audience: "Russian-speaking relocants in Portugal (RU, BY, UA, KZ passports), primarily Norte (Porto, Braga, Minho)",
} as const;

const SPAIN_GEO = {
  country: "Spain",
  countryCode: "ES",
  city: "Valencia",
  region: "Comunitat Valenciana",
  latitude: 39.4699,
  longitude: -0.3763,
  audience:
    "Russian-speaking relocants in Spain (RU, BY, UA, KZ passports), primarily Valencia, Madrid, Barcelona",
} as const;

const CITY_GEO: Record<string, { city: string; region: string; latitude: number; longitude: number }> = {
  lisbon: { city: "Lisbon", region: "Lisbon Metropolitan Area", latitude: 38.7223, longitude: -9.1393 },
  porto: { city: "Porto", region: "Norte", latitude: 41.1579, longitude: -8.6291 },
  valencia: { city: "Valencia", region: "Comunitat Valenciana", latitude: 39.4699, longitude: -0.3763 },
  madrid: { city: "Madrid", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 },
  barcelona: { city: "Barcelona", region: "Catalonia", latitude: 41.3851, longitude: 2.1734 },
};

const TOPIC_GEO_KEYWORDS: Record<string, string[]> = {
  nif: ["NIF Portugal", "Finanças Porto", "e-Fatura"],
  nie: ["NIE Spain", "extranjería Valencia", "empadronamiento Spain"],
  tie: ["TIE Spain", "cita extranjería", "residencia Spain"],
  aima: ["AIMA Portugal", "Agora appointment", "VNG Portugal"],
  arenda: ["rent Porto", "arrendamento Portugal", "rent Braga", "Idealista Valencia", "rent Spain"],
  bank: ["bank account Portugal", "conta bancária", "IBAN Spain", "cuenta bancaria"],
  sns: ["SNS Portugal", "numero utente"],
  ciple: ["CIPLE CAPLE Portugal"],
  transport: ["Porto metro CP", "transport Norte"],
  sim: ["SIM card Portugal"],
  school: ["school Porto expat", "international school Braga"],
  general: ["Portugal relocation", "Norte expat", "Porto expat", "Spain relocation", "Valencia expat"],
};

function geoForNote(note: CommunityNote) {
  return note.country_key === "spain" ? SPAIN_GEO : GEO;
}

export function buildSatelliteHubPlace(countryKey: "portugal" | "spain") {
  const geo = countryKey === "spain" ? SPAIN_GEO : GEO;
  return {
    "@type": "Place" as const,
    name: `${geo.city}, ${geo.country}`,
    address: {
      "@type": "PostalAddress" as const,
      addressCountry: geo.countryCode,
      addressLocality: geo.city,
      addressRegion: geo.region,
    },
    geo: {
      "@type": "GeoCoordinates" as const,
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
  };
}

export function communityNoteUrl(slug: string, countryKey = "portugal"): string {
  return communityNotePublicUrl(slug, countryKey);
}

function satelliteHubPublicUrl(countryKey: string): string {
  return countryKey === "spain" ? spainSatellitePublicUrl("/") : portugalSatellitePublicUrl("/");
}

function satelliteSiteName(countryKey: string): string {
  return countryKey === "spain" ? "Emigro Spain" : "Emigro Portugal";
}

export function buildCommunityNoteKeywords(note: CommunityNote): string[] {
  const base =
    note.country_key === "spain"
      ? [
          "Испания",
          "Валенсия",
          "релокация",
          "NIE Spain",
          "TIE extranjería",
          CONTENT_KIND_LABELS[note.content_kind],
          note.category,
        ]
      : [
          "Португалия",
          "Порту",
          "Norte",
          "релокация",
          CONTENT_KIND_LABELS[note.content_kind],
          note.category,
        ];
  base.push(
    ...note.topic_tags,
    ...note.hashtags.map((h) => hashtagLabel(normalizeHashtag(h)))
  );
  for (const tag of note.topic_tags) {
    const geo = TOPIC_GEO_KEYWORDS[tag];
    if (geo) base.push(...geo);
  }
  return Array.from(new Set(base.map((k) => k.trim()).filter(Boolean))).slice(0, 12);
}

export function buildCommunityNoteMetadata(note: CommunityNote): Metadata {
  const url = communityNoteUrl(note.slug, note.country_key);
  const title = fitSeoTitlePart(note.seo_title || note.title);
  const description = fitMetaDescription(note.seo_description || note.excerpt || note.quick_answer);
  const keywords = buildCommunityNoteKeywords(note);
  const ogImage = socialImageMetadata(resolveNoteOgImage(note), note.title);
  const siteName = satelliteSiteName(note.country_key);

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
      siteName,
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

function placeSchema(note: CommunityNote) {
  const geo = geoForNote(note);
  const cityGeo = (note.city ? CITY_GEO[note.city] : undefined) ?? CITY_GEO[note.country_key === "spain" ? "valencia" : "porto"];
  const locality = cityGeo.city;
  return {
    "@type": "Place" as const,
    name: `${locality}, ${geo.country}`,
    address: {
      "@type": "PostalAddress" as const,
      addressCountry: geo.countryCode,
      addressLocality: locality,
      addressRegion: cityGeo.region,
    },
    geo: {
      "@type": "GeoCoordinates" as const,
      latitude: cityGeo.latitude,
      longitude: cityGeo.longitude,
    },
  };
}

export function buildCommunityNoteSchemas(note: CommunityNote) {
  const url = communityNoteUrl(note.slug, note.country_key);
  const schemaType = schemaTypeForKind(note.content_kind);
  const hubTitle = note.country_key === "spain" ? SPAIN_SATELLITE.title : PORTUGAL_SATELLITE.title;
  const hubUrl = satelliteHubPublicUrl(note.country_key);
  const defaultTag = note.country_key === "spain" ? "spain" : "portugal";
  const noteGeo = geoForNote(note);

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
    about: [placeSchema(note), ...note.topic_tags.map((t) => ({ "@type": "Thing", name: t }))],
    contentLocation: placeSchema(note),
    spatialCoverage: placeSchema(note),
    audience: {
      "@type": "Audience",
      audienceType: noteGeo.audience,
      geographicArea: placeSchema(note),
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
    { name: hubTitle, item: hubUrl },
    { name: note.category, item: `${hubUrl.replace(/\/$/, "")}/tag/${note.topic_tags[0] ?? defaultTag}` },
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
  const noteGeo = geoForNote(note);
  const facts = [
    note.quick_answer,
    `${CONTENT_KIND_LABELS[note.content_kind]} · ${note.category} · ${noteGeo.city}, ${noteGeo.country}`,
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
  const noteGeo = geoForNote(note);
  return [
    note.quick_answer,
    `География: ${noteGeo.city}, ${noteGeo.country}. Аудитория: ${noteGeo.audience}.`,
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
    "## Wizard и коридор",
    "",
    `- Wizard подбора маршрута ВНЖ: ${PORTUGAL_SATELLITE.wizardUrl}`,
    `- Pillar-гайд: ${PORTUGAL_SATELLITE.pillarGuideUrl}`,
    `- Справочник коридора: ${PORTUGAL_SATELLITE.digestUrl}`,
    "",
    "## Материалы (editorial notes)",
    "",
  ];

  for (const note of notes) {
    const url = communityNoteUrl(note.slug, note.country_key);
    lines.push(`- [${note.title}](${url}): ${note.quick_answer.replace(/\s+/g, " ").slice(0, 220)}`);
  }

  lines.push("", "## Official corridors", "", `- Portugal corridor: https://www.emigro.online/ru/portugal`, "");
  return lines.join("\n");
}

export async function buildSpainLlmsTxt(notes: CommunityNote[]): Promise<string> {
  const hub = spainSatellitePublicUrl("/");
  const tagSet = new Set<string>();
  for (const note of notes) {
    for (const tag of note.hashtags) tagSet.add(tag.replace(/^#/, "").trim().toLowerCase());
  }
  const topTags = Array.from(tagSet).slice(0, 12);

  const lines = [
    "# spain.emigro.online — практика для релокантов",
    "",
    `> ${SPAIN_SATELLITE.tagline}`,
    `> Аудитория: ${SPAIN_GEO.audience}. Не юридическая консультация.`,
    `> Hub: ${hub}`,
    "",
    "## Wizard и коридор",
    "",
    `- Wizard подбора маршрута ВНЖ: ${SPAIN_SATELLITE.wizardUrl}`,
    `- Pillar-гайд: ${SPAIN_SATELLITE.pillarGuideUrl}`,
    `- Справочник коридора: ${SPAIN_SATELLITE.digestUrl}`,
    `- Коридор на emigro.online: ${SPAIN_SATELLITE.mainSiteUrl}`,
    "",
    "## Материалы (editorial notes)",
    "",
  ];

  for (const note of notes) {
    const url = communityNoteUrl(note.slug, "spain");
    lines.push(`- [${note.title}](${url}): ${note.quick_answer.replace(/\s+/g, " ").slice(0, 220)}`);
  }

  if (topTags.length > 0) {
    lines.push("", "## Хэштеги", "");
    for (const tag of topTags) {
      lines.push(`- #${tag}: ${spainSatellitePublicUrl(`/tag/${encodeURIComponent(tag)}`)}`);
    }
  }

  lines.push("", "## Official corridors", "", `- Spain corridor: ${SPAIN_SATELLITE.mainSiteUrl}`, "");
  return lines.join("\n");
}
