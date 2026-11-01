import {
  Bike,
  BookOpen,
  Clapperboard,
  Drama,
  Flower2,
  MapPin,
  Moon,
  Mountain,
  Music,
  Palette,
  PersonStanding,
  Sparkles,
  Trophy,
  Users,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { tagLabel } from "@/lib/events/calendar-types";

const ICON: Record<string, LucideIcon> = {
  hike: Mountain,
  night: Moon,
  food: UtensilsCrossed,
  sport: Trophy,
  music: Music,
  theatre: Drama,
  cinema: Clapperboard,
  dance: PersonStanding,
  exhibition: Palette,
  culture: Sparkles,
  family: Users,
  literature: BookOpen,
  bike: Bike,
  water: Waves,
  wellness: Flower2,
  city: MapPin,
};

const COLOR: Record<string, string> = {
  hike: "text-emerald-600",
  night: "text-violet-600",
  food: "text-amber-600",
  sport: "text-orange-600",
  music: "text-fuchsia-600",
  theatre: "text-red-600",
  cinema: "text-slate-600",
  dance: "text-pink-600",
  exhibition: "text-indigo-500",
  culture: "text-indigo-600",
  family: "text-rose-600",
  literature: "text-amber-800",
  bike: "text-lime-700",
  water: "text-sky-600",
  wellness: "text-teal-600",
  city: "text-stone-600",
};

export function EventTypeIcon({
  type,
  size = "row",
}: {
  type: string;
  size?: "row" | "inline";
}) {
  const Icon = ICON[type] || Sparkles;
  const label = tagLabel(type);
  if (size === "inline") {
    return (
      <Icon
        className={`mr-1 inline-block align-[-2px] ${COLOR[type] || "text-slate-500"}`}
        size={14}
        aria-label={label}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 ${COLOR[type] || "text-slate-500"}`}
    >
      <Icon size={18} aria-hidden />
    </span>
  );
}
