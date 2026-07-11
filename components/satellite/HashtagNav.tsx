import Link from "next/link";
import { MobileSwipeHint } from "@/components/layout/MobileSwipeHint";
import { collectHashtagCounts, FEATURED_HASHTAGS, hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import type { CommunityNote } from "@/lib/community-notes/types";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { satelliteHubPath, satelliteTagPath } from "@/lib/satellite/paths";
import { layoutContain, mobileScrollRow, tapTarget } from "@/lib/ui/mobile";

function resolveCountryKey(notes: CommunityNote[], explicit?: SatelliteCountryKey): SatelliteCountryKey {
  if (explicit) return explicit;
  return notes[0]?.country_key === "spain" ? "spain" : "portugal";
}

function accentClasses(countryKey: SatelliteCountryKey) {
  return countryKey === "spain"
    ? {
        active: "bg-amber-700 text-white",
        idle: "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900",
        tag: "bg-amber-50 text-amber-900 hover:bg-amber-100",
      }
    : {
        active: "bg-teal-700 text-white",
        idle: "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800",
        tag: "bg-teal-50 text-teal-800 hover:bg-teal-100",
      };
}

export function HashtagNav({
  notes,
  activeTag,
  countryKey,
}: {
  notes: CommunityNote[];
  activeTag?: string | null;
  countryKey?: SatelliteCountryKey;
}) {
  const resolvedCountry = resolveCountryKey(notes, countryKey);
  const accent = accentClasses(resolvedCountry);
  const counts = collectHashtagCounts(notes);
  const active = activeTag ? normalizeHashtag(activeTag) : null;

  const tags = FEATURED_HASHTAGS.filter((t) => (counts.get(t) ?? 0) > 0 || !active);
  const featuredSet = new Set<string>(FEATURED_HASHTAGS);
  const extraTags = Array.from(counts.entries())
    .filter(([t]) => !featuredSet.has(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);

  const allTags = Array.from(new Set([...tags, ...extraTags]));

  const chipClass = (isActive: boolean) =>
    `inline-flex shrink-0 items-center ${tapTarget} rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? accent.active : accent.idle
    }`;

  return (
    <nav className={`mt-8 ${layoutContain}`} aria-label="Хэштеги">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Навигация</p>
      <div className={`mt-3 ${mobileScrollRow}`}>
        <Link href={satelliteHubPath(resolvedCountry)} className={chipClass(!active)}>
          Все
        </Link>
        {allTags.map((tag) => {
          const isActive = active === tag;
          const count = counts.get(tag) ?? 0;
          return (
            <Link key={tag} href={satelliteTagPath(tag, resolvedCountry)} className={chipClass(isActive)}>
              #{hashtagLabel(tag)}
              {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </Link>
          );
        })}
      </div>
      <MobileSwipeHint>Свайп влево — остальные теги</MobileSwipeHint>
    </nav>
  );
}

export function NoteHashtags({
  tags,
  className = "",
  countryKey = "portugal",
}: {
  tags: string[];
  className?: string;
  countryKey?: SatelliteCountryKey;
}) {
  if (!tags.length) return null;
  const accent = accentClasses(countryKey);
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={satelliteTagPath(tag, countryKey)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${accent.tag}`}
        >
          #{hashtagLabel(tag)}
        </Link>
      ))}
    </div>
  );
}

export function ContentKindBadge({ kind }: { kind: CommunityNote["content_kind"] }) {
  const labels: Record<CommunityNote["content_kind"], string> = {
    news: "📰 Новость",
    lifehack: "⚡ Лайфхак",
    tip: "💡 Совет",
    guide: "📋 Гайд",
    qa: "❓ Q&A",
  };
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {labels[kind]}
    </span>
  );
}
