import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { GuidesIndexContent } from "@/components/guides/GuidesIndexContent";
import { guidePath, listGuides } from "@/lib/guides/load";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { getActiveNewsTopics } from "@/lib/news/topics";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import { schemaImage } from "@/lib/seo/schema";

export const revalidate = 3600;

const GUIDES_INDEX_DESCRIPTION =
  "Практические pillar-гайды Emigro: маршруты для русскоязычных за рубежом и в СНГ — digital nomad, семья с детьми, отказы в визах, бюджет релокации и ВНЖ по странам ЕС.";

export const metadata: Metadata = pageMetadata({
  title: "Гайды по релокации и ВНЖ в Европе",
  description: GUIDES_INDEX_DESCRIPTION,
  path: "/ru/guides",
  ogImage: schemaImage("/images/og/guides-index.jpg"),
  aiDescription: GUIDES_INDEX_DESCRIPTION,
  aiCategory: "relocation-guides-index",
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

  const indexUrl = pageUrl("/ru/guides");
  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Гайды по релокации и ВНЖ в Европе",
    url: indexUrl,
    description: GUIDES_INDEX_DESCRIPTION,
    inLanguage: "ru-RU",
    items: pillarGuides.slice(0, 20).map((guide) => ({
      url: pageUrl(guidePath(guide.slug)),
      name: guide.title,
    })),
  });

  return (
    <>
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <SiteHeader />
      <GuidesIndexContent allGuides={allGuides} pillarGuides={pillarGuides} corridors={corridors} />
      <SiteFooter />
    </>
  );
}
