import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { WizardForm } from "@/components/WizardForm";
import { CorridorBreadcrumb } from "@/components/corridor/CorridorLanding";
import { CorridorHubShell } from "@/components/corridor/hub/CorridorHubShell";
import { topicHasLanding } from "@/lib/corridor/publish";
import { WizardHeroVisual } from "@/components/visuals/WizardHeroVisual";
import { corridorStaticParamsFromSegments, getActiveCorridorSegments } from "@/lib/corridor/segments";
import { corridorResultsPath } from "@/lib/corridor/paths";
import { getCorridorBySlug, getWizardForCorridor } from "@/lib/corridor/queries";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull } from "@/lib/corridor/publish";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { wizardCorridorDescription } from "@/lib/seo/wizard-corridor-copy";
import { buildCorridorBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export async function generateStaticParams() {
  const segments = await getActiveCorridorSegments();
  return corridorStaticParamsFromSegments(segments);
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  return pageMetadata({
    title: `Подбор маршрута ВНЖ — ${topic.countryRu}`,
    description: wizardCorridorDescription(topic.urlSegment, topic.countryRu),
    path: topic.sitePaths.wizard!,
  });
}

export default async function CountryWizardPage({ params }: { params: { country: string } }) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorFull(topic.status) || !topic.sitePaths?.wizard) notFound();

  const corridor = await getCorridorBySlug(topic.corridorSlug);

  if (!corridor) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p>Коридор не найден. Примените миграцию.</p>
          <Link href={`/ru/${params.country}`} className="mt-4 inline-block text-corridor-600 underline">
            ← Назад
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const wizard = await getWizardForCorridor(corridor.id);
  if (!wizard) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p>Wizard не настроен.</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const wizardPath = topic.sitePaths.wizard!;
  const breadcrumbSchema = buildCorridorBreadcrumbSchema(topic, "Wizard", pageUrl(wizardPath));

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current="Wizard" />
        {topicHasLanding(topic) && <CorridorHubShell topic={topic} active="route" />}
        <header className="mt-4 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-6 py-8">
          <WizardHeroVisual />
          <h1 className="mt-4 text-center text-3xl font-bold">{wizard.title_ru}</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            Ответьте на несколько вопросов — мы сопоставим ваш профиль с маршрутами коридора {topic.countryRu}.
            Подходит и если вы уже за границей, и если планируете первичный переезд.
          </p>
        </header>
        <div className="mt-8">
          <WizardForm
            corridorSlug={corridor.slug}
            wizardId={wizard.id}
            modules={wizard.modules}
            resultsPath={corridorResultsPath(corridor.slug)}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
