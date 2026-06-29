import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CorridorLanding } from "@/components/corridor/CorridorLanding";
import { TransitHubLanding } from "@/components/transit/TransitHubLanding";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorOnSite } from "@/lib/corridor/publish";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { countryOgImage } from "@/lib/brand/country-accents";
import { pageMetadata, socialImageMetadata } from "@/lib/seo";
import {
  buildCorridorLandingAiDescription,
  buildCorridorLandingQuickAnswer,
} from "@/lib/seo/corridor-page-seo";
import { TRANSIT_HUBS, getTransitHub } from "@/lib/transit-hubs";

export async function generateStaticParams() {
  const segments = await getPublishedCorridorSegments();
  return [
    ...corridorStaticParamsFromSegments(segments),
    ...TRANSIT_HUBS.map((hub) => ({ country: hub.slug })),
  ];
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const hub = getTransitHub(params.country);
  if (hub) {
    return {
      ...pageMetadata({
        title: hub.heroTitle ?? `${hub.countryRu}: транзитный хаб`,
        description: `${hub.quickAnswer} Не EU-коридор: первый шаг для стабилизации, документов, банков и подготовки маршрута в Европу.`,
        path: hub.path,
        ogImage: "/images/og/og-default.jpg",
        ogImageAlt: `${hub.countryRu} как транзитный хаб Emigro`,
      }),
      other: {
        "ai:description": hub.quickAnswer,
        "llm-summary": hub.llmSummary,
      },
    };
  }

  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  const corridor = topic.corridorSlug ? await getCorridorBySlug(topic.corridorSlug) : null;
  const ogImage = countryOgImage(topic.urlSegment);
  const aiDescription = corridor
    ? buildCorridorLandingAiDescription(topic, corridor)
    : `${topic.focusHintRu} Wizard подбора маршрута ВНЖ, справочник коридора и еженедельные новости Emigro.`;
  const llmSummary = corridor
    ? buildCorridorLandingQuickAnswer(topic, corridor)
    : topic.focusHintRu;

  const base = pageMetadata({
    title: `${topic.countryRu} — коридор релокации`,
    description: `${topic.focusHintRu}. Wizard подбора маршрута ВНЖ, справочник коридора с проверенными фактами, программы и еженедельные новости для паспортов RU/BY/UA/KZ. Emigro.`,
    path: topic.sitePaths.landing,
    ogImage,
    ogImageAlt: `${topic.countryRu}: коридор релокации Emigro`,
  });
  return {
    ...base,
    other: {
      "ai:description": aiDescription,
      "llm-summary": llmSummary,
    },
    openGraph: {
      ...base.openGraph,
      images: [socialImageMetadata(ogImage, `${topic.countryRu}: коридор релокации Emigro`)],
    },
  };
}

export default async function CountryCorridorPage({ params }: { params: { country: string } }) {
  const hub = getTransitHub(params.country);
  if (hub) return <TransitHubLanding hub={hub} />;

  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.landing) notFound();
  return <CorridorLanding country={params.country} />;
}
