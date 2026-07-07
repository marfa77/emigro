import Image from "next/image";
import Link from "next/link";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalNotePath } from "@/lib/satellite/paths";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function NoteCard({ note }: { note: CommunityNote }) {
  const thumbnail = resolveNoteOgImage(note);
  const showThumbnail = thumbnail !== DEFAULT_OG_IMAGE;
  const href = portugalNotePath(note.slug);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-teal-200">
      {showThumbnail && (
        <Link href={href} className="block">
          <Image
            src={thumbnail}
            alt={note.title}
            width={1200}
            height={630}
            className="aspect-[1200/630] w-full object-cover"
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={href} className="text-slate-900 hover:text-teal-800">
            {note.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{note.excerpt}</p>
        <NoteHashtags tags={note.hashtags} className="mt-3" />
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {note.published_at && <time dateTime={note.published_at}>{formatDate(note.published_at)}</time>}
        </div>
      </div>
    </article>
  );
}
