import Link from "next/link";
import { PenLine, MessageSquareWarning } from "lucide-react";
import { storySubmitPath, STORIES_INDEX_PATH } from "@/lib/stories/paths";

type Props = {
  guideSlug: string;
  className?: string;
};

export function GuideStoriesCta({ guideSlug, className = "" }: Props) {
  return (
    <section
      className={`rounded-2xl border border-corridor-200 bg-gradient-to-br from-white via-corridor-50 to-sky-50 px-5 py-5 sm:px-6 ${className}`}
      aria-label="Поделиться историей"
    >
      <h2 className="text-lg font-semibold text-slate-950">Вы прошли через это?</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Другой опыт — дополните гайд своей историей. Короткий кейс поможет тем, кто сейчас на том же шаге.
        Публикуем с именем и ссылкой, если захотите.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={storySubmitPath({ guide: guideSlug })}
          className="inline-flex items-center gap-2 rounded-full bg-corridor-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-corridor-800"
        >
          <PenLine className="h-4 w-4" aria-hidden />
          Рассказать
        </Link>
        <Link
          href={storySubmitPath({ guide: guideSlug, disagree: true })}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
        >
          <MessageSquareWarning className="h-4 w-4" aria-hidden />
          Не согласен с гайдом
        </Link>
        <Link
          href={STORIES_INDEX_PATH}
          className="inline-flex items-center rounded-full px-3 py-2.5 text-sm font-medium text-corridor-700 hover:underline"
        >
          Все истории
        </Link>
      </div>
    </section>
  );
}
