import Link from "next/link";
import { ArrowRight, Compass, Route, Sparkles } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HouseholdBanner } from "@/components/wizard/HouseholdBanner";
import { WizardTelegramDelivery } from "@/components/wizard/WizardTelegramDelivery";
import { WizardOutcomeCard, readableReason } from "@/components/wizard/WizardOutcomeCard";
import { corridorWizardPath } from "@/lib/corridor/paths";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { corridorSlugForTopic, findFirstProviderTopicKey } from "@/lib/providers/registry";
import { PORTUGAL_URL_SEGMENT, portugalHubPaths } from "@/lib/portugal/hub";
import { PortugalHubNextSteps } from "@/components/portugal/PortugalHubNextSteps";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";

export function HubWizardResults({
  sessionId,
  passportIso2,
  payload,
}: {
  sessionId: string;
  passportIso2: string;
  payload: GlobalEvalPayload;
}) {
  const { pick, byCountry, results, household } = payload;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;
  const strongMatchCount = results.filter((r) => r.outcome === "likely_eligible").length;
  const showTransitFallback = strongMatchCount === 0 || matchCount <= 1;
  const hasRemoteIncome = payload.hasRemoteIncome === true;
  const providerTopicKey = findFirstProviderTopicKey([
    ...results.map((r) => r.countrySegment),
    ...byCountry.map((g) => g.corridorSlug?.replace(/^ru-speaking-to-/, "") ?? ""),
  ]);

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Ваши маршруты по Европе</h1>
        <p className="mt-2 text-slate-600">
          Проверено {results.length} программ. Совпадений: {matchCount}. Это предварительная навигация, не
          юридическая гарантия.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Уже за границей?</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Если вы уже живёте в ЕС или другой стране, wizard показывает классические маршруты первичной подачи.
          Часто актуальны другие сценарии: смена основания (например с туристического на рабочий или digital nomad),
          переход в другую страну ЕС, продление текущего ВНЖ, воссоединение с семьёй или подача из страны
          легального проживания. Уточните место подачи и сроки на странице программы или через Emigro Assist.
        </p>
      </section>

      <HouseholdBanner household={household} />

      <WizardTelegramDelivery
        mode="hub"
        sessionId={sessionId}
        topRecommendation={pick ? `${pick.countryRu} — ${pick.programTitleRu}` : undefined}
        matchCount={matchCount}
      />

      {passportIso2 === "UA" && (
        <section className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">Граждане Украины</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Временная защита vs ВНЖ</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Если у вас паспорт UA, сначала сравните Temporary Protection (TP) в Польше, Чехии или Германии с классическими
            маршрутами ВНЖ — TP быстрее, но не ведёт к ПМЖ и гражданству. Wizard ниже показывает EU-программы; для TP
            см. отдельный разбор.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/ru/ukraine"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Хаб Украина → ЕС
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ru/guides/ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50"
            >
              TP vs ВНЖ — гайд
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {showTransitFallback && (
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
              <Route className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">EU-маршрут сейчас слабый. Рассмотрите временный хаб на 3–12 месяцев.</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
                Транзитный хаб — не замена ВНЖ в Европе и не путь к гражданству. Это промежуточный шаг: стабилизировать
                документы, банки и доход, а затем спокойно готовить отдельный EU-маршрут.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TRANSIT_HUBS.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={hub.path}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-corridor-800 shadow-sm hover:bg-corridor-50"
                  >
                    {hub.flag} {hub.countryRu}
                    {hasRemoteIncome && hub.wizardNote ? (
                      <span className="text-xs font-normal text-slate-500">({hub.wizardNote})</span>
                    ) : null}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {providerTopicKey && (
        <ServiceProvidersSection
          className="mt-8"
          corridorSlug={corridorSlugForTopic(providerTopicKey)}
          topicKey={providerTopicKey}
          placement="wizard_hub_results"
          variant="compact"
        />
      )}

      {pick ? (
        <section className="mt-8 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-corridor-600 p-2 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Наш выбор</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {pick.countryRu} — {pick.programTitleRu}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {pick.outcome === "likely_eligible"
                  ? "Подходит по базовым ответам"
                  : pick.outcome === "needs_review"
                    ? "Требует проверки"
                    : "Сейчас не подходит"}
              </p>
              {pick.reasons?.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm opacity-90">
                  {pick.reasons.slice(0, 3).map((reason) => (
                    <li key={reason}>• {readableReason(reason)}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={pick.programPath}
                  className="inline-flex items-center gap-1 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
                >
                  Подробнее о программе
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {pick.sourceUrl && (
                  <a
                    href={pick.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                  >
                    Официальный источник
                  </a>
                )}
                <Link
                  href={corridorWizardPath(pick.corridorSlug)}
                  className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                >
                  <Compass className="h-4 w-4" />
                  Wizard {pick.countryRu}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-medium">Явных совпадений по текущим ответам не найдено.</p>
          <p className="mt-2 text-sm leading-relaxed">
            Это не отказ и не тупик. Обычно варианты такие: увеличить подтверждаемый доход, накопить больше средств,
            получить рабочий оффер, рассмотреть учебный маршрут, проверить воссоединение семьи или выбрать другую
            страну. Если есть сложная история с отказами, семьёй или документами, лучше показать кейс провайдеру.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            <Link href="/ru#destinations" className="text-corridor-700 underline">
              Все направления →
            </Link>
            <Link href="/ru/assist" className="text-corridor-700 underline">
              Обсудить с Emigro Assist →
            </Link>
          </div>
        </section>
      )}

      <ResultsNextSteps
        hasMatches={matchCount > 0}
        providerTopicKey={providerTopicKey}
        showPortugalHub={pick?.countrySegment === PORTUGAL_URL_SEGMENT || providerTopicKey === PORTUGAL_URL_SEGMENT}
      />

      {byCountry.length > 0 && (
        <section className="mt-12 space-y-10">
          <h2 className="text-2xl font-semibold">По странам</h2>
          {byCountry.map((group) => (
            <div key={group.corridorSlug} className="w-full">
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">{group.countryRu}</h3>
                <Link href={group.landingPath} className="shrink-0 text-sm text-corridor-600 hover:underline">
                  Коридор {group.countryRu} →
                </Link>
              </div>
              <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
                {group.matches.map((row) => (
                  <WizardOutcomeCard
                    key={`${row.programId}-${row.corridorSlug}`}
                    title={row.programTitleRu}
                    programType={row.programType}
                    outcome={row.outcome}
                    reasons={row.reasons}
                    href={row.programPath}
                    sourceUrl={row.sourceUrl}
                    sourceLabel={row.sourceLabelRu}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {pick && (
        <div className="mt-12 max-w-lg">
          <LeadForm
            corridorSlug={pick.corridorSlug}
            sessionId={sessionId}
            programSlugs={[pick.programSlug]}
            defaultPassport={passportIso2}
            countryRu={pick.countryRu}
          />
        </div>
      )}
    </>
  );
}

function ResultsNextSteps({
  hasMatches,
  providerTopicKey,
  showPortugalHub = false,
}: {
  hasMatches: boolean;
  providerTopicKey?: string;
  showPortugalHub?: boolean;
}) {
  return (
    <>
      {showPortugalHub && (
        <PortugalHubNextSteps className="mt-10" guideHref={portugalHubPaths.digest} placement="wizard_hub_results" />
      )}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Что делать дальше</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
        <li>
          {hasMatches
            ? "Выберите 1–2 маршрута, которые выглядят реалистично."
            : "Выберите, что проще изменить: доход, сбережения, учёбу, оффер или страну."}
        </li>
        <li>Откройте страницу программы и проверьте официальный источник: требования меняются.</li>
        <li>Соберите доказательства цифр: выписки, контракты, оффер, документы о семье или зачислении.</li>
        <li>
          Проверьте, где именно подаваться: это зависит от текущего места жительства, легального статуса и
          консульства — особенно если вы уже в ЕС.
        </li>
        <li>Если сомневаетесь, отправьте короткое описание кейса Emigro Assist или профильному провайдеру.</li>
      </ol>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
        <Link href="/ru/assist" className="rounded-lg bg-corridor-600 px-4 py-2 text-white hover:bg-corridor-700">
          Написать Emigro Assist
        </Link>
        {providerTopicKey && (
          <Link
            href={`/ru/${providerTopicKey}`}
            className="rounded-lg border border-corridor-300 px-4 py-2 text-corridor-800 hover:bg-corridor-50"
          >
            Посмотреть коридор
          </Link>
        )}
      </div>
    </section>
    </>
  );
}
