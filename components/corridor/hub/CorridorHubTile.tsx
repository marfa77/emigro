"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Heart,
  Newspaper,
  ShoppingBag,
  StickyNote,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import type { HubTileIcon, ResolvedHubTile } from "@/lib/corridor/hub";

const TOP_ICONS: Record<HubTileIcon, LucideIcon> = {
  compass: Compass,
  newspaper: Newspaper,
  book: BookOpen,
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
      <span className="w-16 shrink-0 truncate sm:w-20">{label}</span>
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
      <div className={`absolute inset-0 ${dimmer ? "bg-black/55" : "bg-black/25"}`} aria-hidden="true" />
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

function OpenLink({ href, external, comingSoon }: { href: string; external?: boolean; comingSoon?: boolean }) {
  const className =
    "inline-flex items-center gap-0.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm";

  if (comingSoon) {
    return <span className={`${className} cursor-default opacity-70`}>Soon</span>;
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} hover:bg-white/25`} onClick={(e) => e.stopPropagation()}>
        Open
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={`${className} hover:bg-white/25`} onClick={(e) => e.stopPropagation()}>
      Open
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </Link>
  );
}

const TILE_FACE =
  "absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translateZ(0)]";

export function CorridorHubTilesGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2 snap-x snap-mandatory touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500 sm:hidden">Свайп влево — остальные слои</p>
    </div>
  );
}

export function CorridorHubTileSlot({ children }: { children: ReactNode }) {
  return <div className="w-[min(78vw,300px)] shrink-0 snap-center sm:w-auto">{children}</div>;
}

export function CorridorHubTile({ tile }: Props) {
  const [flipped, setFlipped] = useState(false);
  const TopIcon = TOP_ICONS[tile.topRightIcon];

  return (
    <div
      className={`group relative aspect-[5/6] w-full min-h-[240px] [perspective:1000px] sm:aspect-[3/4] sm:min-h-[260px] ${
        tile.comingSoon ? "opacity-90" : "cursor-pointer"
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${tile.title}${tile.comingSoon ? " — скоро" : " — нажмите для рейтингов"}`}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] [transform:translateZ(0)]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className={TILE_FACE}>
          <TilePhotoBackground tile={tile} />

          <div className="relative flex h-full flex-col p-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xl font-bold leading-none tabular-nums underline decoration-white/30 underline-offset-4 sm:text-2xl">
                  {tile.topLeft}
                </p>
                {tile.topLeftHint && (
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/60 sm:text-[10px]">{tile.topLeftHint}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-[10px] font-medium backdrop-blur-sm sm:text-[11px]">
                <TopIcon className="h-3 w-3" aria-hidden="true" />
                <span className="max-w-[4.5rem] truncate sm:max-w-none">{tile.topRightLabel}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center py-1 sm:py-2">
              <h3 className="text-lg font-bold tracking-tight sm:text-2xl lg:text-[1.65rem]">{tile.title}</h3>
              <p className="hidden text-sm text-white/75 sm:block">{tile.subtitle}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="line-clamp-2 text-[10px] leading-snug text-white/70 sm:max-w-[55%] sm:text-[11px]">{tile.bottomLeft}</div>
              <div className="flex items-center justify-between gap-2 sm:block sm:text-right">
                <p className="text-xs font-semibold text-white sm:text-sm">{tile.bottomRight}</p>
                <OpenLink href={tile.href} external={tile.external} comingSoon={tile.comingSoon} />
              </div>
            </div>
          </div>
        </div>

        <div className={`${TILE_FACE} [transform:rotateY(180deg)]`}>
          <TilePhotoBackground tile={tile} dimmer />

          <div className="relative flex h-full flex-col p-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:p-4">
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

            <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-2.5">
              {tile.ratings.map((rating) => (
                <RatingBar key={rating.label} label={rating.label} value={rating.value} tone={rating.tone} />
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
              <p className="max-w-[50%] truncate text-[9px] uppercase tracking-wider text-white/50 sm:max-w-none sm:text-[10px]">
                Emigro · {tile.hubLabel}
              </p>
              <OpenLink href={tile.href} external={tile.external} comingSoon={tile.comingSoon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CorridorHubTilesLegend() {
  return (
    <p className="mt-3 hidden items-center justify-center gap-1.5 text-center text-xs text-slate-400 sm:flex">
      <Wifi className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Клик — рейтинги слоя · Open — перейти в раздел · Soon — скоро</span>
    </p>
  );
}
