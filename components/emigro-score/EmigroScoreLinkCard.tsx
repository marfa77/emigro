import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmigroScoreFace } from "@/components/emigro-score/EmigroScoreFace";
import { getEmigroScore, toEmigroScoreView } from "@/lib/emigro-score";
import { hubKindLabel, type TransitHub } from "@/lib/transit-hubs";
import { countryCardImage } from "@/lib/brand/country-accents";

export function EmigroScoreLinkCard({ hub }: { hub: TransitHub }) {
  const raw = getEmigroScore(hub.slug);
  const view = raw ? toEmigroScoreView(raw) : null;
  const image = countryCardImage(hub.slug);

  return (
    <Link
      href={hub.path}
      className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 shadow-md transition hover:-translate-y-0.5 hover:border-corridor-400/50 hover:shadow-xl"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" aria-hidden />
      <div className="relative flex flex-1 flex-col p-4 text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-2xl" aria-hidden>
              {hub.flag}
            </span>
            <h4 className="mt-1 text-lg font-semibold tracking-tight">{hub.countryRu}</h4>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
              {hub.cardLabel ?? hubKindLabel(hub.kind)}
            </p>
          </div>
          {view ? (
            <EmigroScoreFace overall100={view.overall100} tone={view.tone} size="chip" />
          ) : (
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-white/60">Скоро оценка</span>
          )}
        </div>

        {view ? (
          <div className="mt-auto pt-4">
            <EmigroScoreFace overall100={view.overall100} tone={view.tone} size="card" />
            <p className="mt-3 line-clamp-2 text-xs leading-snug text-white/70">{view.summary}</p>
          </div>
        ) : (
          <p className="mt-auto pt-4 text-sm text-white/70">{hub.tagline}</p>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-300 group-hover:underline">
          Открыть
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
