"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Compass,
  Heart,
  Newspaper,
  ShoppingBag,
  StickyNote,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import type { HubTileIcon, ResolvedHubTile } from "@/lib/portugal/hub";

const TOP_ICONS: Record<HubTileIcon, LucideIcon> = {
  compass: Compass,
  newspaper: Newspaper,
  sticky: StickyNote,
  shopping: ShoppingBag,
};

type Props = {
  tile: ResolvedHubTile;
};

function RatingBar({ label, value, tone = "good" }: { label: string; value: number; tone?: "good" | "warn" | "neutral" }) {
  const barColor =
    tone === "warn" ? "bg-amber-400" : tone === "neutral" ? "bg-slate-400" : value >= 70 ? "bg-emerald-400" : "bg-red-400";

  return (
    <div className="flex items-center gap-2 text-xs text-white/90">
      <span className="w-20 shrink-0 truncate">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function TilePhotoBackground({ tile, dimmer = false }: { tile: ResolvedHubTile; dimmer?: boolean }) {
  return (
    <>
      <div
        className="absolute inset-0 scale-105 bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${tile.image})`,
          backgroundPosition: tile.imagePosition ?? "center",
        }}
        aria-hidden="true"
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}`} aria-hidden="true" />
      <div
        className={`absolute inset-0 ${dimmer ? "bg-black/55" : "bg-black/25"}`}
        aria-hidden="true"
      />
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${tile.glow} blur-2xl`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_55%)]"
        aria-hidden="true"
      />
    </>
  );
}

function OpenLink({ href, external }: { href: string; external?: boolean }) {
  const className =
    "inline-flex items-center gap-0.5 rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm hover:bg-white/25";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={(e) => e.stopPropagation()}>
        Open
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={(e) => e.stopPropagation()}>
      Open
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}

export function PortugalHubTile({ tile }: Props) {
  const [flipped, setFlipped] = useState(false);
  const TopIcon = TOP_ICONS[tile.topRightIcon];

  return (
    <div
      className="group relative aspect-[4/5] w-full min-h-[220px] cursor-pointer [perspective:1000px] sm:aspect-[3/4] sm:min-h-[260px]"
      role="button"
      tabIndex={0}
      aria-label={`${tile.title} — нажмите для рейтингов`}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front — Nomads-style summary */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
          <TilePhotoBackground tile={tile} />

          <div className="relative flex h-full flex-col p-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-2xl font-bold leading-none tabular-nums underline decoration-white/30 underline-offset-4">
                  {tile.topLeft}
                </p>
                {tile.topLeftHint && (
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/60">{tile.topLeftHint}</p>
                )}
              </div>
              <div className="flex items-center gap-1 rounded-full bg-black/25 px-2 py-1 text-[11px] font-medium backdrop-blur-sm">
                <TopIcon className="h-3 w-3" aria-hidden="true" />
                {tile.topRightLabel}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center py-2">
              <h3 className="text-2xl font-bold tracking-tight sm:text-[1.65rem]">{tile.title}</h3>
              <p className="text-sm text-white/75">{tile.subtitle}</p>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="max-w-[55%] text-[11px] leading-snug text-white/70">{tile.bottomLeft}</div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{tile.bottomRight}</p>
                <div className="mt-1 flex justify-end">
                  <OpenLink href={tile.href} external={tile.external} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back — ratings like Nomads flip */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <TilePhotoBackground tile={tile} dimmer />

          <div className="relative flex h-full flex-col p-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="В избранное (скоро)"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Закрыть"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {tile.ratings.map((rating) => (
                <RatingBar key={rating.label} label={rating.label} value={rating.value} tone={rating.tone} />
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between pt-3">
              <p className="text-[10px] uppercase tracking-wider text-white/50">Emigro · Portugal Hub</p>
              <OpenLink href={tile.href} external={tile.external} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortugalHubTilesLegend() {
  return (
    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
      <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
      Клик — рейтинги слоя · Open — перейти в раздел
    </p>
  );
}
