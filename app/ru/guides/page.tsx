import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { GuidesIndexContent } from "@/components/guides/GuidesIndexContent";
import { listGuides } from "@/lib/guides/load";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { getActiveNewsTopics } from "@/lib/news/topics";
import { pageMetadata } from "@/lib/seo";
import { schemaImage } from "@/lib/seo/schema";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Гайды по релокации и ВНЖ в Европе",
  description:
    "Практические pillar-гайды Emigro: маршруты для русскоязычных за рубежом и в СНГ — digital nomad, семья с детьми, отказы в визах, бюджет релокации и ВНЖ по странам ЕС.",
  path: "/ru/guides",
  ogImage: schemaImage("/images/og/guides-index.jpg"),
});

export default async function GuidesIndexPage() {
  const allGuides = listGuides();
  const pillarGuides = listPillarGuides();
  const corridors = (await getActiveNewsTopics())
    .filter((t) => t.sitePaths?.landing)
    .slice(0, 8)
    .map((topic) => ({
      key: topic.key,
      flag: topic.flag,
      countryRu: topic.countryRu,
      corridorSlug: topic.corridorSlug,
      landing: topic.sitePaths?.landing,
      wizard: topic.sitePaths?.wizard,
    }));

  return (
    <>
      <SiteHeader />
      <GuidesIndexContent allGuides={allGuides} pillarGuides={pillarGuides} corridors={corridors} />
      <SiteFooter />
    </>
  );
}
