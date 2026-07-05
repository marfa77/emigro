import Link from "next/link";
import { Construction } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { PortugalHubShell } from "@/components/portugal/PortugalHubShell";
import { PortugalHubStack } from "@/components/portugal/PortugalHubStack";
import { isPortugalHubTopic } from "@/lib/portugal/hub";
import { CorridorLandingSeoSections } from "@/components/corridor/CorridorLandingSeoSections";
import { GuideDigestPreview } from "@/components/corridor/GuideDigestPreview";
import { LatestNewsTeaser } from "@/components/news/LatestNewsTeaser";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HeroShell } from "@/components/visuals/HeroShell";
import { CorridorHeroVisual } from "@/components/visuals/CorridorHeroVisual";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";
import { isCorridorFull } from "@/lib/corridor/publish";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { requirePublishedCorridorTopic } from "@/lib/corridor/resolve-topic";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { buildCorridorBreadcrumbSchema, buildCorridorLandingArticleSchema, buildFaqSchema, buildCorridorLandingFaq } from "@/lib/seo/corridor-page-seo";
import { pageUrl } from "@/lib/seo";

export async function CorridorLanding({ country }: { country: string }) {
  const topic = await requirePublishedCorridorTopic(country);
  const corridor = await getCorridorBySlug(topic.corridorSlug!);
  const isFull = isCorridorFull(topic.status);

  if (!corridor) {
    return (
      <>
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Коридор не найден</h1>
          <p className="mt-2 text-slate-600">Данные коридора ещё не загружены в базу.</p>
        </div>
        <SiteFooter />
      </>
    );
  }

  const base = topic.sitePaths!.landing;
  const url = pageUrl(base);
  const faq = buildCorridorLandingFaq(topic, corridor);
  const breadcrumbSchema = buildCorridorBreadcrumbSchema(topic, "Коридор");
  const articleSchema = buildCorridorLandingArticleSchema(topic, corridor, url);
  const faqSchema = buildFaqSchema(faq);
  const isPortugalHub = isPortugalHubTopic(topic);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current="Коридор" />

        {isPortugalHub && <PortugalHubShell active="hub" />}

        {!isFull && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Коридор в разработке</p>
              <p className="mt-1 text-sm text-amber-900/90">
                Мы наполняем программы, wizard и справочник. Пока доступны новости и частичный справочник — полный
                подбор маршрута появится после завершения наполнения.
              </p>
            </div>
          </div>
        )}

        <HeroShell visual={<CorridorHeroVisual segment={topic.urlSegment} />}>
          <p className="text-sm uppercase tracking-wide text-corridor-100">
            {isFull ? "Полный коридор Emigro" : "Коридор в разработке"}
          </p>
          <h1 className="mt-2 text-4xl font-bold">{corridor.title_ru}</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">{corridor.audience_description_ru}</p>
          <p className="mt-3 max-w-2xl text-sm text-corridor-100/90">
            Для русскоязычных за рубежом и в СНГ — в том числе если вы уже в ЕС и ищете смену статуса, переход в{" "}
            {topic.countryRu} или продление.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {isFull && topic.sitePaths?.wizard && (
              <Link
                href={topic.sitePaths.wizard}
                className="rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
              >
                Подобрать маршрут
              </Link>
            )}
            <Link
              href={`/ru/news?country=${topic.key}`}
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Новости недели
            </Link>
            {topic.sitePaths?.guide && (
              <Link
                href={topic.sitePaths.guide}
                className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
              >
                Справочник коридора
              </Link>
            )}
          </div>
        </HeroShell>

        {isPortugalHub && <PortugalHubStack />}

        {corridor.programs.length > 0 && (
          <section id="programs" className="mt-12">
            <h2 className="text-2xl font-semibold">Маршруты в коридоре</h2>
            {!isFull && (
              <p className="mt-2 text-sm text-slate-500">Карточки программ — превью; wizard и детальные страницы после запуска.</p>
            )}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {corridor.programs.map((program) => {
                const href = `${base}/programs/${program.slug}`;
                const card = (
                  <>
                    <ProgramTypeBadge type={program.program_type} />
                    <h3 className="mt-3 text-lg font-semibold">{program.title_ru}</h3>
                    <p className="mt-2 text-sm text-slate-600">{program.summary_ru}</p>
                  </>
                );
                return isFull ? (
                  <Link
                    key={String(program.id)}
                    href={href}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-corridor-500 hover:shadow-md"
                  >
                    {card}
                  </Link>
                ) : (
                  <div
                    key={String(program.id)}
                    className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 opacity-90"
                  >
                    {card}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Интеллект коридора</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            {isPortugalHub
              ? "Новости и справочник — два слоя Portugal Hub. Wizard, сателлит и Barakhlo дополняют их на каждом этапе переезда."
              : `Справочник с проверенными фактами и еженедельные новости — два дополняющих слоя.${isFull ? " Wizard опирается на оба." : ""}`}
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <LatestNewsTeaser topicKey={topic.key} />
            {topic.sitePaths?.guide && (
              <GuideDigestPreview
                items={corridor.digest}
                guideHref={topic.sitePaths.guide}
                countryRu={topic.countryRu}
              />
            )}
          </div>
        </section>

        <ServiceProvidersSection
          className="mt-12"
          corridorSlug={topic.corridorSlug ?? undefined}
          topicKey={topic.key}
          placement="corridor_landing"
        />

        <div className="mt-12">
          <CorridorIntelLinks topic={topic} />
        </div>

        <CorridorLandingSeoSections topic={topic} corridor={corridor} landingPath={base} />

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Другие разделы Emigro</h2>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/ru" className="text-corridor-600 hover:underline">
              Все направления
            </Link>
            <Link href="/ru/wizard" className="text-corridor-600 hover:underline">
              Hub wizard
            </Link>
            <Link href="/ru/guides" className="text-corridor-600 hover:underline">
              Гайды по ВНЖ
            </Link>
            <Link href="/ru/news" className="text-corridor-600 hover:underline">
              Новости Европы
            </Link>
          </nav>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function CorridorBreadcrumb({
  topic,
  current,
}: {
  topic: NewsTopicConfig;
  current: string;
}) {
  return (
    <nav className="text-sm text-slate-500">
      <Link href="/ru" className="text-corridor-600 hover:underline">
        Все направления
      </Link>
      <span className="mx-2">/</span>
      <Link href={topic.sitePaths?.landing ?? `/ru/${topic.urlSegment}`} className="text-corridor-600 hover:underline">
        {topic.countryRu}
      </Link>
      <span className="mx-2">/</span>
      <span>{current}</span>
    </nav>
  );
}
