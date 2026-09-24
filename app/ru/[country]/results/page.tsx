import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { AssistResultsCta } from "@/components/wizard/AssistResultsCta";
import { HouseholdBanner } from "@/components/wizard/HouseholdBanner";
import { WizardTelegramDelivery } from "@/components/wizard/WizardTelegramDelivery";
import { WizardOutcomeCard } from "@/components/wizard/WizardOutcomeCard";
import { buildAssistUrl } from "@/lib/assist/build-url";
import { corridorWizardPath } from "@/lib/corridor/paths";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { describeHousehold, parseHousehold } from "@/lib/engine/household";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull } from "@/lib/corridor/publish";
import { createServerClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { corridorStaticParamsFromSegments, getActiveCorridorSegments } from "@/lib/corridor/segments";
import { newsIndexPath } from "@/lib/news/topics";
import { PortugalHubNextSteps } from "@/components/portugal/PortugalHubNextSteps";
import { WizardSatellitePracticeCta } from "@/components/wizard/WizardSatellitePracticeCta";
import { isPortugalHubTopic } from "@/lib/portugal/hub";
import { liveCityChatForCountry } from "@/lib/satellite/city-chats";
import { formatCountryProgramLabel } from "@/lib/wizard/format-country-program-label";

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
  const cityChat = liveCityChatForCountry(topic.urlSegment);
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

  const household = describeHousehold(
    parseHousehold((session.answers as Record<string, unknown>) ?? {})
  );
  const topResult = results[0] ? programMap.get(results[0].program_id) : null;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;
  const strongMatchCount = results.filter((r) => r.outcome === "likely_eligible").length;
  const topOutcome = typeof results[0]?.outcome === "string" ? results[0].outcome : "";
  const preferRouteCheck =
    strongMatchCount === 0 || topOutcome === "needs_review" || matchCount <= 1;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
          Предварительный shortlist
        </p>
        <h1 className="mt-1 text-3xl font-bold">Ваши доступные маршруты — {topic.countryRu}</h1>
        <p className="mt-2 text-slate-600">
          Сопоставление по вашим ответам ({matchCount} из {results.length} не «unlikely»). Emigro не ранжирует
          «лучшую визу» — только eligibility. Это не юридическая гарантия.
        </p>

        <HouseholdBanner household={household} />

        <div
          id="wizard-results-metrics"
          hidden
          data-match-count={matchCount}
          data-strong-match-count={strongMatchCount}
          data-pick-outcome={topOutcome}
          data-pick-country={topic.urlSegment}
        />

        {cityChat ? (
          <WizardSatellitePracticeCta
            sessionId={sessionId}
            placement="wizard_corridor_results"
            countryKey={cityChat.countryKey}
            chat={cityChat}
          />
        ) : null}

        <AssistResultsCta
          sessionId={sessionId}
          placement="wizard_corridor_results"
          country={topic.urlSegment}
          countryRu={topic.countryRu}
          programTitle={topResult?.title_ru}
          matchCount={matchCount}
          strongMatchCount={strongMatchCount}
          pickOutcome={topOutcome}
          preferRouteCheck={preferRouteCheck}
        />

        <WizardTelegramDelivery
          mode="corridor"
          sessionId={sessionId}
          topRecommendation={
            topResult
              ? formatCountryProgramLabel(topic.countryRu, topResult.title_ru)
              : undefined
          }
          matchCount={matchCount}
        />

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
            <TrackedAssistLink
              href={buildAssistUrl({
                sessionId,
                country: topic.urlSegment,
                program: topResult?.title_ru,
              })}
              placement="wizard_corridor_next_steps"
              linkLabel="Найти специалиста"
              sessionId={sessionId}
              country={topic.urlSegment}
              program={topResult?.title_ru}
              className="inline-flex min-h-11 items-center rounded-lg bg-corridor-600 px-4 py-2 text-white hover:bg-corridor-700"
            >
              Найти специалиста
            </TrackedAssistLink>
            <TrackedAssistLink
              href={buildAssistUrl({
                sessionId,
                country: topic.urlSegment,
                program: topResult?.title_ru,
                hash: "assist-form-route-check",
              })}
              placement="wizard_corridor_next_steps_route_check"
              linkLabel="Route Check — €129"
              sessionId={sessionId}
              country={topic.urlSegment}
              program={topResult?.title_ru}
              className="inline-flex min-h-11 items-center text-sm font-medium text-corridor-700 hover:underline"
            >
              Route Check — €129
            </TrackedAssistLink>
          </div>
        </section>

        <ServiceProvidersSection
          className="mt-12"
          corridorSlug={corridorSlug}
          topicKey={topic.key}
          placement="wizard_corridor_results"
          title={`Провайдеры и сервисы — ${topic.countryRu}`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
