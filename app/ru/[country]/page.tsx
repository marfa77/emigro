import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CorridorLanding } from "@/components/corridor/CorridorLanding";
import { TransitHubLanding } from "@/components/transit/TransitHubLanding";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorOnSite } from "@/lib/corridor/publish";
import { countryOgImage } from "@/lib/brand/country-accents";
import { pageMetadata, socialImageMetadata } from "@/lib/seo";
import { getLongTailByPath } from "@/lib/seo/query-longtail";
import { buildCorridorLandingAiDescription } from "@/lib/seo/corridor-page-seo";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { TRANSIT_HUBS, getTransitHub } from "@/lib/transit-hubs";

export const revalidate = 3600;

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
    };
  }

  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  const ogImage = countryOgImage(topic.urlSegment);
  const longTail = getLongTailByPath(topic.sitePaths.landing);
  const corridor = topic.corridorSlug ? await getCorridorBySlug(topic.corridorSlug) : null;

  const landingTitle = longTail?.seoTitle ?? `${topic.countryRu} — коридор релокации`;
  const landingDescription =
    longTail?.seoDescription ??
    `${topic.focusHintRu}. Wizard подбора маршрута ВНЖ, справочник коридора с проверенными фактами, программы и еженедельные новости для паспортов RU/BY/UA/KZ. Emigro.`;

  const aiDescription =
    corridor != null
      ? buildCorridorLandingAiDescription(topic, corridor)
      : landingDescription;

  const base = pageMetadata({
    title: landingTitle,
    description: landingDescription,
    path: topic.sitePaths.landing,
    ogImage,
    ogImageAlt: `${topic.countryRu}: коридор релокации Emigro`,
    aiDescription,
    aiCategory: `corridor-${topic.urlSegment}`,
  });
  return {
    ...base,
    keywords: longTail ? [...(topic.seoTags ?? []), ...longTail.queries] : topic.seoTags,
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
