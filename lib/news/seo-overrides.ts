import type { NewsDigest } from "@/lib/news/digests";

/**
 * Git-shipped SEO patches for published stories until Supabase rows are updated
 * (`scripts/apply-bing-seo-batch2-news.ts`). Facts must match live article bodies.
 */
export const NEWS_SEO_OVERRIDES: Partial<
  Record<string, Pick<NewsDigest, "seo_title" | "seo_description">>
> = {
  "sweden-story-2026-08-31-ea8jvq": {
    seo_title: "Выборы в Швеции 2027: 31 августа",
    seo_description:
      "Выборы в Швеции 31 августа 2026: что партии обещают иностранцам по иммиграции, разрешениям на работу, налогам и социальным выплатам.",
  },
  "portugal-story-2026-09-07-k1b2yo": {
    seo_title: "Регистрация компании в Португалии 2026: LDA, NIF",
    seo_description:
      "Как открыть фирму в Португалии: LDA/SA, NIF, банк и registo comercial. Empresa na Hora на justica.gov.pt — один balcão; ВНЖ только при критериях предпринимателя.",
  },
  "germany-story-2026-10-05-vn3nqp": {
    seo_title: "Счётчики отопления в Германии: с 1 января 2027",
    seo_description:
      "HeizkostenV §5: до 31.12.2026 дооснастить счётчики отопления; с 01.01.2027 — дистанционное считывание. Арендатор вправе требовать учёт у Gebäudeeigentümer.",
  },
  "cyprus-story-2026-09-08-c48qw0": {
    seo_title: "BrainRocket закрывает офисы в Лимассоле",
    seo_description:
      "BrainRocket сворачивает офисы в Лимассоле: сотрудникам предложили релокацию за границу, а не возврат на Кипр. Что это значит для tech-рынка острова.",
  },
};

export function applyNewsSeoOverrides<T extends Pick<NewsDigest, "slug" | "seo_title" | "seo_description">>(
  digest: T,
): T {
  const patch = NEWS_SEO_OVERRIDES[digest.slug];
  if (!patch) return digest;
  return {
    ...digest,
    seo_title: patch.seo_title ?? digest.seo_title,
    seo_description: patch.seo_description ?? digest.seo_description,
  };
}