import Link from "next/link";
import { StoryGenreBadge } from "@/components/stories/StoryGenreBadge";
import { STORY_ROLE_LABELS } from "@/lib/stories/genres";
import { storyPath, STORIES_INDEX_PATH } from "@/lib/stories/paths";
import type { StoryFrontmatter } from "@/lib/stories/types";

type Props = {
  stories: StoryFrontmatter[];
  totalCount: number;
  guideSlug: string;
  className?: string;
};

export function GuideRelatedStories({ stories, totalCount, guideSlug, className = "" }: Props) {
  if (stories.length === 0) return null;

  return (
    <section className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 sm:p-8 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Реальные истории читателей</h2>
          <p className="mt-1 text-sm text-slate-600">Личный опыт рядом с этим гайдом — не замена официальным правилам.</p>
        </div>
        {totalCount > stories.length ? (
          <Link
            href={`${STORIES_INDEX_PATH}?guide=${encodeURIComponent(guideSlug)}`}
            className="text-sm font-medium text-corridor-700 hover:underline"
          >
            Все {totalCount} →
          </Link>
        ) : null}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <StoryGenreBadge genre={story.genre} />
            <h3 className="mt-3 font-semibold leading-snug text-slate-950">
              <Link href={storyPath(story.slug)} className="hover:text-corridor-700">
                {story.title}
              </Link>
            </h3>
            {story.excerpt ? (
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{story.excerpt}</p>
            ) : null}
            <p className="mt-3 text-xs text-slate-500">
              {story.author_display}
              {story.country ? ` · ${story.country}` : ""}
              {` · ${STORY_ROLE_LABELS[story.role]}`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
