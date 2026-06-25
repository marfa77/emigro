import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { CorridorBreadcrumb } from "@/components/corridor/CorridorLanding";
import { ProgramSeoSections } from "@/components/corridor/ProgramSeoSections";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";
import { getProgramBySlug, getCorridorBySlug } from "@/lib/corridor/queries";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull } from "@/lib/corridor/publish";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildProgramArticleSchema,
  buildProgramFaq,
  buildProgramHowToSchema,
  buildProgramMetadata,
  programPagePath,
} from "@/lib/seo/corridor-page-seo";
import { SITE_URL } from "@/lib/site-url";

const COUNTRY_SEGMENT_TO_ISO2: Record<string, string> = {
  france: "FR",
  germany: "DE",
  italy: "IT",
  portugal: "PT",
  spain: "ES",
};

function programMatchesCountrySegment(programIso2: string, countrySegment: string): boolean {
  return COUNTRY_SEGMENT_TO_ISO2[countrySegment] === programIso2;
}

export async function generateMetadata({
  params,
}: {
  params: { country: string; slug: string };
}): Promise<Metadata> {
  const program = await getProgramBySlug(params.slug);
  const topic = await getTopicByCountrySegment(params.country);
  if (!program || !topic?.sitePaths) return {};
  return buildProgramMetadata(program, topic);
}

export default async function CountryProgramPage({
  params,
}: {
  params: { country: string; slug: string };
}) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorFull(topic.status) || !topic.sitePaths) notFound();

  const program = await getProgramBySlug(params.slug);
  if (!program || !program.version) notFound();

  const corridor = await getCorridorBySlug(topic.corridorSlug);
  const isLinkedToCorridor = corridor?.programs.some((p) => p.slug === program.slug) ?? false;
  if (!isLinkedToCorridor && !programMatchesCountrySegment(program.destination_iso2, topic.urlSegment)) notFound();

  const base = topic.sitePaths.landing;
  const path = programPagePath(topic, program.slug);
  const url = `${SITE_URL}${path}`;
  const faq = buildProgramFaq(program, topic);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro", item: SITE_URL },
    { name: topic.countryRu, item: `${SITE_URL}${base}` },
    { name: program.title_ru, item: url },
  ]);
  const articleSchema = buildProgramArticleSchema(program, topic, url);
  const howToSchema = buildProgramHowToSchema(program, topic, url);
  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current={program.title_ru} />

        <div className="mt-4">
          <ProgramTypeBadge type={program.program_type} />
        </div>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{program.title_ru}</h1>
        <p className="mt-4 text-lg text-slate-600">{program.summary_ru}</p>

        <ProgramSeoSections program={program} topic={topic} landingPath={base} />

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Требования</h2>
          <ul className="mt-4 space-y-2">
            {program.requirements.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <span className="font-medium">{r.label_ru}</span>
                {r.value_text && <span className="text-slate-600"> — {r.value_text}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Сроки</h2>
          <ol className="mt-4 space-y-3">
            {program.timeline.map((step, i) => (
              <li key={step.id} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-corridor-100 text-sm font-medium text-corridor-800">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title_ru}</p>
                  {step.duration_text && <p className="text-sm text-slate-500">{step.duration_text}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Ориентировочные расходы</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {program.costs.map((c) => (
              <li key={c.id}>
                {c.label_ru}: {c.amount_text ?? (c.amount_eur ? `€${c.amount_eur}` : "—")}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Официальные источники</h2>
          <div className="mt-4 space-y-4">
            {program.sources.map((s) => (
              <blockquote key={s.id} className="rounded-lg border-l-4 border-corridor-500 bg-slate-50 p-4 text-sm">
                <p className="text-slate-700">{s.raw_excerpt}</p>
                <footer className="mt-2 text-xs text-slate-500">
                  <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-corridor-600 underline">
                    {s.label_ru ?? s.source_url}
                  </a>
                  {s.last_verified && ` · проверено ${s.last_verified}`}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          {topic.sitePaths.wizard && (
            <Link
              href={topic.sitePaths.wizard}
              className="inline-block rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
            >
              Проверить подходит ли вам маршрут
            </Link>
          )}
          <Link
            href={base}
            className="inline-block rounded-lg border border-corridor-200 bg-white px-5 py-3 font-medium text-slate-700 hover:border-corridor-400"
          >
            Коридор {topic.countryRu}
          </Link>
        </div>

        <div className="mt-10">
          <CorridorIntelLinks topic={topic} variant="compact" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
