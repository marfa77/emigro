import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { CorridorBreadcrumb } from "@/components/corridor/CorridorLanding";
import { ProgramSeoSections } from "@/components/corridor/ProgramSeoSections";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { CorridorHeroVisual } from "@/components/visuals/CorridorHeroVisual";
import { HeroShell } from "@/components/visuals/HeroShell";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";
import { getProgramBySlug, getCorridorBySlug } from "@/lib/corridor/queries";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull } from "@/lib/corridor/publish";
import type { ProgramDetail } from "@/lib/types";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildProgramArticleSchema,
  buildProgramFaq,
  buildProgramHowToSchema,
  buildProgramMetadata,
  buildProgramQuickAnswer,
  passportLabel,
  PASSPORT_STATUS_LABELS,
  programPagePath,
} from "@/lib/seo/corridor-page-seo";
import { SITE_URL } from "@/lib/site-url";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 3600;
export const dynamicParams = true;

const ISO2_TO_SEGMENT: Record<string, string> = {
  FR: "france",
  DE: "germany",
  IT: "italy",
  PT: "portugal",
  ES: "spain",
};

export async function generateStaticParams(): Promise<{ country: string; slug: string }[]> {
  try {
    const supabase = createServerClient();
    const { data: programs } = await supabase
      .from("emigro_programs")
      .select("slug, destination_iso2")
      .eq("is_active", true);

    if (!programs?.length) return [];

    return programs.flatMap((p) => {
      const country = ISO2_TO_SEGMENT[p.destination_iso2 as string];
      if (!country) return [];
      return [{ country, slug: p.slug as string }];
    });
  } catch {
    return [];
  }
}

function programMatchesCountrySegment(programIso2: string, countrySegment: string): boolean {
  return ISO2_TO_SEGMENT[programIso2] === countrySegment;
}

function formatCost(cost: ProgramDetail["costs"][number] | undefined): string {
  if (!cost) return "Уточнить по составу семьи";
  return cost.amount_text ?? (cost.amount_eur ? `€${cost.amount_eur}` : "Уточнить");
}

function findRequirement(program: ProgramDetail, pattern: RegExp) {
  return program.requirements.find((item) => pattern.test(`${item.label_ru} ${item.value_text ?? ""}`));
}

function findCost(program: ProgramDetail, pattern: RegExp) {
  return program.costs.find((item) => pattern.test(`${item.label_ru} ${item.amount_text ?? ""}`));
}

function timelinePreview(program: ProgramDetail): string {
  const durations = program.timeline.map((step) => step.duration_text).filter(Boolean).slice(0, 2);
  if (durations.length > 0) return durations.join(" + ");
  return program.timeline.length > 0 ? `${program.timeline.length} этапа` : "Срок зависит от консульства";
}

function passportNote(entry: ProgramDetail["passportEligibility"][number]): string {
  if (entry.notes_ru) return entry.notes_ru;
  if (entry.status === "partial") return "Подача зависит от консульства, юрисдикции и текущей практики записи.";
  if (entry.status === "eligible") return "Маршрут открыт по общим требованиям, но место подачи нужно сверить отдельно.";
  return "По текущим требованиям маршрут не подходит для этого паспорта.";
}

const PASSPORT_CARD_STYLES: Record<ProgramDetail["passportEligibility"][number]["status"], string> = {
  eligible: "border-emerald-200 bg-emerald-50 text-emerald-950",
  partial: "border-amber-200 bg-amber-50 text-amber-950",
  ineligible: "border-rose-200 bg-rose-50 text-rose-950",
};

export async function generateMetadata({
  params,
}: {
  params: { country: string; slug: string };
}): Promise<Metadata> {
  const [program, topic] = await Promise.all([
    getProgramBySlug(params.slug),
    getTopicByCountrySegment(params.country),
  ]);
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

  const [program, corridor] = await Promise.all([
    getProgramBySlug(params.slug),
    getCorridorBySlug(topic.corridorSlug),
  ]);
  if (!program || !program.version) notFound();
  const isLinkedToCorridor = corridor?.programs.some((p) => p.slug === program.slug) ?? false;
  if (!isLinkedToCorridor && !programMatchesCountrySegment(program.destination_iso2, topic.urlSegment)) notFound();

  const base = topic.sitePaths.landing;
  const path = programPagePath(topic, program.slug);
  const url = `${SITE_URL}${path}`;
  const faq = buildProgramFaq(program, topic);
  const quickAnswer = buildProgramQuickAnswer(program, topic);
  const incomeRequirement = findRequirement(program, /доход|зарплат|income|salary|средств|сбереж/i);
  const documentRequirement = findRequirement(program, /документ|справк|договор|контракт|анкета|страхов/i);
  const fundsCost = findCost(program, /средств|баланс|депозит|доход|сбереж/i);
  const officialCost = program.costs.find((cost) => cost !== fundsCost);
  const checklist = [
    "Проверить, где именно можно подать заявление с вашим паспортом.",
    incomeRequirement
      ? `Подтвердить критерий: ${incomeRequirement.label_ru}${incomeRequirement.value_text ? ` — ${incomeRequirement.value_text}` : ""}.`
      : "Подтвердить доход, накопления или основание программы документами.",
    documentRequirement
      ? `Подготовить документ: ${documentRequirement.label_ru}${documentRequirement.value_text ? ` — ${documentRequirement.value_text}` : ""}.`
      : "Собрать переводы, апостили, страховку и подтверждение жилья.",
    "Заложить буфер на запись в консульство, выпуск карты и продление.",
  ];

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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current={program.title_ru} />

        <HeroShell className="mt-5" visual={<CorridorHeroVisual segment={topic.urlSegment} />}>
          <ProgramTypeBadge type={program.program_type} />
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">{program.title_ru}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-corridor-100">{program.summary_ru}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {topic.sitePaths.wizard && (
              <Link
                href={topic.sitePaths.wizard}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
              >
                Проверить мой профиль
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
            <Link
              href={base}
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Все маршруты в {topic.countryRu}
            </Link>
          </div>
        </HeroShell>

        <section className="mt-8 rounded-3xl border border-corridor-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Короткий ответ</p>
              <p className="mt-3 max-w-3xl text-xl font-medium leading-relaxed text-slate-900">{quickAnswer}</p>
            </div>
            {topic.sitePaths.wizard && (
              <Link
                href={topic.sitePaths.wizard}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
              >
                Оценить маршрут
              </Link>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <WalletCards className="h-5 w-5 text-corridor-600" aria-hidden />
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Доход / средства</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {incomeRequirement?.value_text ?? formatCost(fundsCost)}
            </p>
            <p className="mt-2 text-sm text-slate-600">{incomeRequirement?.label_ru ?? fundsCost?.label_ru ?? "Финансовый критерий"}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Banknote className="h-5 w-5 text-corridor-600" aria-hidden />
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Расходы на старт</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatCost(officialCost)}</p>
            <p className="mt-2 text-sm text-slate-600">{officialCost?.label_ru ?? "Сборы, страховка и подготовка досье"}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Clock3 className="h-5 w-5 text-corridor-600" aria-hidden />
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Ориентир по срокам</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900">{timelinePreview(program)}</p>
            <p className="mt-2 text-sm text-slate-600">Плюс очередь на запись и выдачу карты резидента.</p>
          </article>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Eligibility</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900">Кому маршрут подходит</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Ниже не сырой список из базы, а практические критерии, которые обычно превращаются в документы для подачи.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {program.requirements.map((requirement) => (
              <article key={requirement.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-corridor-50 text-corridor-700">
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{requirement.label_ru}</h3>
                    {requirement.value_text && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{requirement.value_text}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {program.passportEligibility.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Паспорт и место подачи</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Статус показывает не только закон программы, но и операционный риск: консульство, VFS, запись и юрисдикция
              могут отличаться для RU/BY/UA/KZ.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {program.passportEligibility.map((entry) => (
                <article
                  key={entry.id}
                  className={`rounded-2xl border p-4 shadow-sm ${PASSPORT_CARD_STYLES[entry.status]}`}
                >
                  <p className="font-semibold">{passportLabel(entry.passport_iso2)}</p>
                  <p className="mt-1 text-sm font-medium">{PASSPORT_STATUS_LABELS[entry.status] ?? entry.status}</p>
                  <p className="mt-3 text-xs leading-relaxed opacity-85">{passportNote(entry)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-200">Timeline</p>
              <h2 className="mt-2 text-3xl font-bold">Как выглядит путь</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Используйте как план проекта: сначала критерии и документы, затем слот подачи, решение и карта.
              </p>
            </div>
            <ol className="space-y-4">
              {program.timeline.map((step, i) => (
                <li key={step.id} className="relative flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-corridor-800">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <p className="font-semibold">{step.title_ru}</p>
                    {step.duration_text && <p className="mt-1 text-sm text-slate-300">{step.duration_text}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <ShieldAlert className="h-5 w-5" aria-hidden />
            <h2 className="mt-3 text-xl font-semibold">Риски</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <li>Консульская практика и доступность записи могут меняться быстрее официальных страниц.</li>
              <li>Финансовые пороги часто зависят от семьи, срока аренды и формата дохода.</li>
              <li>Неполный пакет документов обычно дороже, чем ранняя проверка досье.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-950">
            <AlertTriangle className="h-5 w-5" aria-hidden />
            <h2 className="mt-3 text-xl font-semibold">Частые ошибки</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <li>Считать сумму на счёте достаточной без подтверждения происхождения денег.</li>
              <li>Бронировать жильё или страховку не под тот тип визы/ВНЖ.</li>
              <li>Игнорировать различия между правом на программу и правом подать в конкретном консульстве.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
            <ClipboardCheck className="h-5 w-5" aria-hidden />
            <h2 className="mt-3 text-xl font-semibold">Чеклист перед стартом</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        {program.costs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">Бюджет и платежи</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {program.costs.map((cost) => (
                <article key={cost.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{cost.label_ru}</p>
                  <p className="mt-2 text-xl font-bold text-slate-900">{formatCost(cost)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <ServiceProvidersSection
          className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          corridorSlug={topic.corridorSlug}
          topicKey={topic.key}
          placement="guide_sidebar"
          title="Сервисы и помощь на этом маршруте"
        />

        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FileText className="h-5 w-5 text-corridor-600" aria-hidden />
            Официальные источники
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {program.sources.map((source) => (
              <blockquote key={source.id} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
                <p className="leading-relaxed text-slate-700">{source.raw_excerpt}</p>
                <footer className="mt-4 text-xs text-slate-500">
                  <a href={source.source_url} target="_blank" rel="noopener noreferrer" className="font-medium text-corridor-700 underline">
                    {source.label_ru ?? source.source_url}
                  </a>
                  {source.last_verified && ` · проверено ${source.last_verified}`}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <ProgramSeoSections program={program} topic={topic} landingPath={base} />

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <CalendarClock className="h-5 w-5 text-corridor-600" aria-hidden />
            Следующий шаг
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {topic.sitePaths.wizard && (
              <Link
                href={topic.sitePaths.wizard}
                className="inline-flex rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
              >
                Проверить подходит ли вам маршрут
              </Link>
            )}
            <Link
              href={base}
              className="inline-flex rounded-lg border border-corridor-200 bg-white px-5 py-3 font-medium text-slate-700 hover:border-corridor-400"
            >
              Коридор {topic.countryRu}
            </Link>
          </div>
        </section>

        <div className="mt-10">
          <CorridorIntelLinks topic={topic} variant="compact" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
