import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { LeadForm } from "@/components/LeadForm";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HouseholdBanner } from "@/components/wizard/HouseholdBanner";
import { WizardTelegramDelivery } from "@/components/wizard/WizardTelegramDelivery";
import { WizardOutcomeCard } from "@/components/wizard/WizardOutcomeCard";
import { corridorWizardPath } from "@/lib/corridor/paths";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { describeHousehold, parseHousehold } from "@/lib/engine/household";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { getProvidersForContext } from "@/lib/providers/registry";
import { isCorridorFull } from "@/lib/corridor/publish";
import { createServerClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { corridorStaticParamsFromSegments, getActiveCorridorSegments } from "@/lib/corridor/segments";
import { newsIndexPath } from "@/lib/news/topics";
import { PortugalHubNextSteps } from "@/components/portugal/PortugalHubNextSteps";
import { isPortugalHubTopic } from "@/lib/portugal/hub";

export async function generateStaticParams() {
  const segments = await getActiveCorridorSegments();
  return corridorStaticParamsFromSegments(segments);
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  return pageMetadata({
    title: `Результаты wizard — ${topic.countryRu}`,
    description: "Персональное сравнение маршрутов ВНЖ — не индексируется.",
    path: `${topic.sitePaths.landing}/results`,
    noIndex: true,
  });
}

export default async function CountryResultsPage({
  params,
  searchParams,
}: {
  params: { country: string };
  searchParams: { session?: string };
}) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorFull(topic.status) || !topic.sitePaths) notFound();

  const corridorSlug = topic.corridorSlug;
  const base = topic.sitePaths.landing;
  const sessionId = searchParams.session;
  const corridor = await getCorridorBySlug(corridorSlug);

  if (!sessionId) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p>
            Нет сессии. Пройдите{" "}
            <Link href={corridorWizardPath(corridorSlug)} className="text-corridor-600 underline">
              wizard
            </Link>
            .
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const supabase = createServerClient();
  const { data: session } = await supabase
    .from("emigro_wizard_sessions")
    .select("id, passport_iso2, corridor_id, answers")
    .eq("id", sessionId)
    .single();

  if (!session || !corridor || session.corridor_id !== corridor.id) notFound();

  const { data: results } = await supabase
    .from("emigro_eligibility_results")
    .select("id, outcome, score, program_id, reasons")
    .eq("session_id", sessionId)
    .order("score", { ascending: false });

  if (!results?.length) notFound();

  const programIds = results.map((r) => r.program_id);
  const { data: programs } = await supabase
    .from("emigro_programs")
    .select("id, slug, title_ru, program_type")
    .in("id", programIds);

  const programMap = new Map((programs ?? []).map((p) => [p.id, p]));
  const { data: versions } = await supabase
    .from("emigro_program_versions")
    .select("id, program_id")
    .in("program_id", programIds)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const latestVersionByProgram = new Map<string, string>();
  for (const version of versions ?? []) {
    if (!latestVersionByProgram.has(version.program_id)) {
      latestVersionByProgram.set(version.program_id, version.id);
    }
  }

  const versionIds = Array.from(latestVersionByProgram.values());
  const { data: sources } = versionIds.length
    ? await supabase
        .from("emigro_program_sources")
        .select("program_version_id, source_url, label_ru, last_verified")
        .in("program_version_id", versionIds)
        .order("last_verified", { ascending: false })
    : { data: [] };

  const sourceByVersion = new Map<string, { source_url: string | null; label_ru: string | null }>();
  for (const source of sources ?? []) {
    if (!sourceByVersion.has(source.program_version_id)) {
      sourceByVersion.set(source.program_version_id, source);
    }
  }

  const defaultSlug = corridor.programs[0]?.slug ?? "";

  const programSlugs = results
    .filter((r) => r.outcome !== "unlikely")
    .map((r) => programMap.get(r.program_id)?.slug)
    .filter((s): s is string => Boolean(s));

  const household = describeHousehold(
    parseHousehold((session.answers as Record<string, unknown>) ?? {})
  );
  const topResult = results[0] ? programMap.get(results[0].program_id) : null;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Ваши маршруты — {topic.countryRu}</h1>
        <p className="mt-2 text-slate-600">
          Сравнение по вашим ответам. Это предварительная навигация, не юридическая гарантия.
        </p>

        <HouseholdBanner household={household} />

        <WizardTelegramDelivery
          mode="corridor"
          sessionId={sessionId}
          topRecommendation={topResult ? `${topic.countryRu} — ${topResult.title_ru}` : undefined}
          matchCount={matchCount}
        />

        {getProvidersForContext({ corridorSlug, topicKey: topic.key }).length > 0 && (
          <ServiceProvidersSection
            className="mt-8"
            corridorSlug={corridorSlug}
            topicKey={topic.key}
            placement="wizard_corridor_results"
            variant="compact"
          />
        )}

        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
          {results.map((row) => {
            const program = programMap.get(row.program_id);
            if (!program) return null;
            const source = sourceByVersion.get(latestVersionByProgram.get(row.program_id) ?? "");
            return (
              <WizardOutcomeCard
                key={row.id}
                title={program.title_ru}
                programType={program.program_type}
                outcome={row.outcome}
                reasons={Array.isArray(row.reasons) ? (row.reasons as string[]) : undefined}
                href={`${base}/programs/${program.slug}`}
                sourceUrl={source?.source_url}
                sourceLabel={source?.label_ru}
              />
            );
          })}
        </div>

        {isPortugalHubTopic(topic) && (
          <PortugalHubNextSteps
            className="mt-8"
            guideHref={topic.sitePaths.guide}
            placement="wizard_corridor_results"
          />
        )}

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Что делать дальше</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
            <li>Выберите маршрут с самым понятным “почему подходит” и откройте страницу программы.</li>
            <li>Сверьте требования с официальным источником: доход, деньги, семья, место подачи.</li>
            <li>Соберите документы, которые доказывают ваши ответы: выписки, оффер, договоры, справки.</li>
            <li>Проверьте консульство или миграционный орган, где именно можно подаваться.</li>
            <li>Если есть сомнения, отправьте кейс Emigro Assist или профильному провайдеру.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            {topic.sitePaths.guide && (
              <Link href={topic.sitePaths.guide} className="text-corridor-600 underline">
                Справочник коридора →
              </Link>
            )}
            <Link href={newsIndexPath(topic.urlSegment)} className="text-corridor-600 underline">
              Новости недели →
            </Link>
            <Link href="/ru/assist" className="text-corridor-600 underline">
              Emigro Assist →
            </Link>
          </div>
        </section>

        <div className="mt-12 max-w-lg">
          <LeadForm
            corridorSlug={corridorSlug}
            sessionId={sessionId}
            programSlugs={programSlugs.length ? programSlugs : defaultSlug ? [defaultSlug] : []}
            defaultPassport={session.passport_iso2 ?? "RU"}
            countryRu={topic.countryRu}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
