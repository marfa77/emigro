import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { StorySubmitForm } from "@/components/stories/StorySubmitForm";
import { STORIES_INDEX_PATH, STORIES_SUBMIT_PATH } from "@/lib/stories/paths";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const metadata: Metadata = pageMetadata({
  title: "Поделиться историей релокации",
  description:
    "Отправьте личный кейс переезда: успех, провал, спорное мнение или лайфхак. Emigro опубликует после модерации с вашим именем и ссылкой.",
  path: STORIES_SUBMIT_PATH,
  noIndex: true,
});

type SearchParams = { guide?: string; disagree?: string };

export default function StorySubmitPage({ searchParams }: { searchParams?: SearchParams }) {
  const guide = searchParams?.guide?.trim() || "";
  const disagree = searchParams?.disagree === "1" || searchParams?.disagree === "true";

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Истории", item: pageUrl(STORIES_INDEX_PATH) },
    { name: "Отправить", item: pageUrl(STORIES_SUBMIT_PATH) },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={STORIES_INDEX_PATH} className="text-corridor-600 hover:underline">
            Истории
          </Link>
          <span className="mx-2">/</span>
          <span>Отправить</span>
        </nav>

        <h1 className="mt-6 text-3xl font-bold text-slate-950">
          {disagree ? "Не согласны? Дополните" : "Расскажите свою историю"}
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Четыре жанра на выбор. Обязательное поле «что бы сделали иначе» — чтобы следующий читатель не повторил ваши
          ошибки. Публикация после модерации; контакт не публикуем.
        </p>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <StorySubmitForm initialGuideSlug={guide} disagree={disagree} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
