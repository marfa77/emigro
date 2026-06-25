import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CorridorLanding } from "@/components/corridor/CorridorLanding";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorOnSite } from "@/lib/corridor/publish";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const segments = await getPublishedCorridorSegments();
  return corridorStaticParamsFromSegments(segments);
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  return pageMetadata({
    title: `${topic.countryRu} — коридор релокации`,
    description: `${topic.focusHintRu}. Wizard подбора маршрута ВНЖ, справочник коридора с проверенными фактами и еженедельные новости для паспортов RU/BY/UA/KZ.`,
    path: topic.sitePaths.landing,
  });
}

export default async function CountryCorridorPage({ params }: { params: { country: string } }) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.landing) notFound();
  return <CorridorLanding country={params.country} />;
}
