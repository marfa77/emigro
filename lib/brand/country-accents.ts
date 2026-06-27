/** Accent palette for corridor / country hero visuals */
export const COUNTRY_ACCENTS: Record<
  string,
  { from: string; to: string; glow: string; label: string; cardImage: string }
> = {
  portugal: { from: "#1d4ed8", to: "#0f766e", glow: "#2dd4bf", label: "Португалия", cardImage: "/images/corridor-portugal.webp" },
  spain: { from: "#dc2626", to: "#b45309", glow: "#fbbf24", label: "Испания", cardImage: "/images/corridor-spain.webp" },
  france: { from: "#1d4ed8", to: "#7c3aed", glow: "#93c5fd", label: "Франция", cardImage: "/images/corridor-france.webp" },
  italy: { from: "#15803d", to: "#b91c1c", glow: "#86efac", label: "Италия", cardImage: "/images/corridor-italy.webp" },
  germany: { from: "#1e293b", to: "#b45309", glow: "#fcd34d", label: "Германия", cardImage: "/images/corridor-germany.webp" },
  netherlands: { from: "#ea580c", to: "#1d4ed8", glow: "#fdba74", label: "Нидерланды", cardImage: "/images/corridor-netherlands.webp" },
  scandinavia: { from: "#0369a1", to: "#1e3a8a", glow: "#7dd3fc", label: "Скандинавия", cardImage: "/images/corridor-scandinavia.webp" },
  poland: { from: "#dc2626", to: "#f8fafc", glow: "#fca5a5", label: "Польша", cardImage: "/images/corridor-poland.webp" },
  czechia: { from: "#1d4ed8", to: "#dc2626", glow: "#93c5fd", label: "Чехия", cardImage: "/images/corridor-czechia.webp" },
  austria: { from: "#dc2626", to: "#f8fafc", glow: "#fca5a5", label: "Австрия", cardImage: "/images/corridor-austria.webp" },
};

export const HUB_ACCENT = { from: "#1d4ed8", to: "#1e3a5f", glow: "#60a5fa" };

export function countryAccent(segment?: string) {
  if (!segment) return HUB_ACCENT;
  return COUNTRY_ACCENTS[segment] ?? HUB_ACCENT;
}

const DEFAULT_BAR = "from-corridor-500 via-sky-400 to-corridor-600";

const BAR_CLASSES: Record<string, string> = {
  portugal: "from-blue-600 via-teal-500 to-teal-700",
  spain: "from-red-600 via-amber-500 to-amber-700",
  france: "from-blue-600 via-violet-500 to-violet-700",
  italy: "from-green-700 via-red-500 to-red-700",
  germany: "from-slate-700 via-amber-600 to-amber-700",
  netherlands: "from-orange-600 via-blue-600 to-blue-700",
  scandinavia: "from-sky-700 via-blue-800 to-blue-900",
  poland: "from-red-700 via-slate-100 to-red-600",
  czechia: "from-blue-700 via-red-500 to-blue-800",
  austria: "from-red-700 via-white to-red-600",
};

export function countryAccentBarClass(segment?: string) {
  if (!segment) return DEFAULT_BAR;
  return BAR_CLASSES[segment] ?? DEFAULT_BAR;
}

export function countryCardImage(segment?: string) {
  if (!segment) return "/images/emigro-main-hero.webp";
  return COUNTRY_ACCENTS[segment]?.cardImage ?? "/images/emigro-main-hero.webp";
}
