import { STORY_GENRE_LABELS } from "@/lib/stories/genres";
import type { StoryGenre } from "@/lib/stories/types";

const GENRE_STYLES: Record<StoryGenre, string> = {
  triumph: "border-emerald-200 bg-emerald-50 text-emerald-900",
  failure: "border-rose-200 bg-rose-50 text-rose-900",
  hot_take: "border-amber-200 bg-amber-50 text-amber-950",
  lifehack: "border-sky-200 bg-sky-50 text-sky-900",
};

export function StoryGenreBadge({ genre, className = "" }: { genre: StoryGenre; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${GENRE_STYLES[genre]} ${className}`}
    >
      {STORY_GENRE_LABELS[genre]}
    </span>
  );
}
