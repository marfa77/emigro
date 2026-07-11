import Image from "next/image";
import Link from "next/link";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { satelliteNotePath } from "@/lib/satellite/paths";
import { layoutContain, NOTE_CONTENT_IMAGE_SIZES, noteContentImageClass } from "@/lib/ui/mobile";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function noteCountryKey(note: CommunityNote): SatelliteCountryKey {
  return note.country_key === "spain" ? "spain" : "portugal";
}

function accentClasses(countryKey: SatelliteCountryKey) {
  return countryKey === "spain"
    ? {
        border: "hover:border-amber-200",
        category: "text-amber-800",
        title: "hover:text-amber-900",
      }
    : {
        border: "hover:border-teal-200",
        category: "text-teal-700",
        title: "hover:text-teal-800",
      };
}

export function NoteCard({ note }: { note: CommunityNote }) {
  const thumbnail = resolveNoteOgImage(note);
  const showThumbnail = thumbnail !== DEFAULT_OG_IMAGE;
  const countryKey = noteCountryKey(note);
  const href = satelliteNotePath(note.slug, countryKey);
  const accent = accentClasses(countryKey);

  return (
    <article className={`${layoutContain} overflow-hidden rounded-xl border border-slate-200 bg-white transition ${accent.border}`}>
      {showThumbnail && (
        <Link href={href} className={`block ${layoutContain} overflow-hidden`}>
          <Image
            src={thumbnail}
            alt={note.title}
            width={1200}
            height={630}
            sizes={NOTE_CONTENT_IMAGE_SIZES}
            className={noteContentImageClass}
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-xs font-medium uppercase tracking-wide ${accent.category}`}>{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h3 className="mt-2 text-lg font-semibold">
          <Link href={href} className={`text-slate-900 ${accent.title}`}>
            {note.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{note.excerpt}</p>
        <NoteHashtags tags={note.hashtags} className="mt-3" countryKey={countryKey} />
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {note.published_at && <time dateTime={note.published_at}>{formatDate(note.published_at)}</time>}
        </div>
      </div>
    </article>
  );
}
