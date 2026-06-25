import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CorridorLanding } from "@/components/corridor/CorridorLanding";
import { TransitHubLanding } from "@/components/transit/TransitHubLanding";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorOnSite } from "@/lib/corridor/publish";
import { pageMetadata } from "@/lib/seo";
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
        title: `${hub.countryRu}: транзитный хаб`,
        description: `${hub.quickAnswer} Не EU-коридор: первый шаг для стабилизации, документов, банков и подготовки маршрута в Европу.`,
        path: hub.path,
        ogImage: "/images/emigro-main-hero.webp",
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
  return pageMetadata({
    title: `${topic.countryRu} — коридор релокации`,
    description: `${topic.focusHintRu}. Wizard подбора маршрута ВНЖ, справочник коридора с проверенными фактами и еженедельные новости для паспортов RU/BY/UA/KZ.`,
    path: topic.sitePaths.landing,
  });
}

export default async function CountryCorridorPage({ params }: { params: { country: string } }) {
  const hub = getTransitHub(params.country);
  if (hub) return <TransitHubLanding hub={hub} />;

  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.landing) notFound();
  return <CorridorLanding country={params.country} />;
}
