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
  sweden: { from: "#0369a1", to: "#1e3a8a", glow: "#7dd3fc", label: "Швеция", cardImage: "/images/corridor-scandinavia.webp" },
  norway: { from: "#ba0c2f", to: "#00205b", glow: "#fca5a5", label: "Норвегия", cardImage: "/images/corridor-scandinavia.webp" },
  finland: { from: "#003580", to: "#ffffff", glow: "#93c5fd", label: "Финляндия", cardImage: "/images/corridor-scandinavia.webp" },
  denmark: { from: "#c8102e", to: "#ffffff", glow: "#fca5a5", label: "Дания", cardImage: "/images/corridor-scandinavia.webp" },
  poland: { from: "#dc2626", to: "#f8fafc", glow: "#fca5a5", label: "Польша", cardImage: "/images/corridor-poland.webp" },
  czechia: { from: "#1d4ed8", to: "#dc2626", glow: "#93c5fd", label: "Чехия", cardImage: "/images/corridor-czechia.webp" },
  austria: { from: "#dc2626", to: "#f8fafc", glow: "#fca5a5", label: "Австрия", cardImage: "/images/corridor-austria.webp" },
  greece: { from: "#0c4a6e", to: "#fbbf24", glow: "#7dd3fc", label: "Греция", cardImage: "/images/corridor-greece.webp" },
  cyprus: { from: "#0e7490", to: "#f59e0b", glow: "#67e8f9", label: "Кипр", cardImage: "/images/corridor-cyprus.webp" },
  hungary: { from: "#14532d", to: "#dc2626", glow: "#86efac", label: "Венгрия", cardImage: "/images/corridor-hungary.webp" },
  malta: { from: "#dc2626", to: "#fbbf24", glow: "#fca5a5", label: "Мальта", cardImage: "/images/corridor-malta.webp" },
  bulgaria: { from: "#00966e", to: "#d62612", glow: "#6ee7b7", label: "Болгария", cardImage: "/images/corridor-bulgaria.webp" },
  croatia: { from: "#0e7490", to: "#1d4ed8", glow: "#67e8f9", label: "Хорватия", cardImage: "/images/corridor-croatia.webp" },
  slovenia: { from: "#0057b8", to: "#ffcd00", glow: "#93c5fd", label: "Словения", cardImage: "/images/corridor-slovenia.webp" },
  estonia: { from: "#0072ce", to: "#000000", glow: "#93c5fd", label: "Эстония", cardImage: "/images/corridor-estonia.webp" },
  // Transit hubs
  serbia: { from: "#0c4a6e", to: "#c8102e", glow: "#7dd3fc", label: "Сербия", cardImage: "/images/corridor-serbia.webp" },
  armenia: { from: "#d90012", to: "#0033a0", glow: "#fca5a5", label: "Армения", cardImage: "/images/corridor-armenia.webp" },
  georgia: { from: "#e8112d", to: "#0ea5e9", glow: "#fca5a5", label: "Грузия", cardImage: "/images/corridor-georgia.webp" },
  turkey: { from: "#e30a17", to: "#0f172a", glow: "#fca5a5", label: "Турция", cardImage: "/images/corridor-turkey.webp" },
  montenegro: { from: "#c40308", to: "#0c4a6e", glow: "#fca5a5", label: "Черногория", cardImage: "/images/corridor-montenegro.webp" },
  kazakhstan: { from: "#00afca", to: "#fac50f", glow: "#67e8f9", label: "Казахстан", cardImage: "/images/corridor-kazakhstan.webp" },
  uae: { from: "#00732f", to: "#000000", glow: "#6ee7b7", label: "ОАЭ", cardImage: "/images/corridor-uae.webp" },
  thailand: { from: "#a51931", to: "#2d2a4a", glow: "#fca5a5", label: "Таиланд", cardImage: "/images/corridor-thailand.webp" },
  indonesia: { from: "#e30613", to: "#0ea5e9", glow: "#fca5a5", label: "Индонезия", cardImage: "/images/corridor-indonesia.webp" },
  switzerland: { from: "#d52b1e", to: "#ffffff", glow: "#fca5a5", label: "Швейцария", cardImage: "/images/corridor-switzerland.webp" },
  uk: { from: "#012169", to: "#c8102e", glow: "#93c5fd", label: "Великобритания", cardImage: "/images/corridor-uk.webp" },
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
  sweden: "from-sky-700 via-blue-800 to-blue-900",
  norway: "from-red-700 via-blue-900 to-slate-900",
  finland: "from-blue-800 via-sky-500 to-white",
  denmark: "from-red-700 via-white to-red-600",
  poland: "from-red-700 via-slate-100 to-red-600",
  czechia: "from-blue-700 via-red-500 to-blue-800",
  austria: "from-red-700 via-white to-red-600",
  greece: "from-sky-900 via-amber-400 to-sky-700",
  cyprus: "from-cyan-800 via-amber-400 to-cyan-700",
  hungary: "from-green-900 via-red-600 to-green-800",
  malta: "from-red-700 via-amber-400 to-red-600",
  bulgaria: "from-emerald-700 via-red-600 to-emerald-800",
  croatia: "from-cyan-800 via-sky-500 to-blue-800",
  slovenia: "from-blue-700 via-sky-500 to-amber-400",
  estonia: "from-blue-700 via-sky-600 to-slate-900",
  serbia: "from-sky-900 via-red-600 to-sky-800",
  armenia: "from-red-700 via-blue-700 to-orange-500",
  georgia: "from-red-700 via-sky-500 to-red-800",
  turkey: "from-red-700 via-slate-900 to-red-800",
  montenegro: "from-red-800 via-sky-800 to-slate-900",
  kazakhstan: "from-cyan-600 via-sky-500 to-amber-400",
  uae: "from-emerald-800 via-slate-900 to-emerald-700",
  thailand: "from-red-700 via-indigo-900 to-blue-800",
  indonesia: "from-red-600 via-sky-500 to-teal-700",
  switzerland: "from-red-700 via-white to-red-600",
  uk: "from-blue-900 via-red-700 to-blue-800",
};

export function countryAccentBarClass(segment?: string) {
  if (!segment) return DEFAULT_BAR;
  return BAR_CLASSES[segment] ?? DEFAULT_BAR;
}

export function countryCardImage(segment?: string) {
  if (!segment) return "/images/emigro-main-hero.webp";
  return COUNTRY_ACCENTS[segment]?.cardImage ?? "/images/emigro-main-hero.webp";
}

/** 1200×630 JPG for Open Graph / Twitter Cards (not the UI card webp). */
export function countryOgImage(segment?: string) {
  if (!segment) return "/images/og/og-default.jpg";
  const accent = COUNTRY_ACCENTS[segment];
  if (!accent) return "/images/og/og-default.jpg";

  // Keep OG image aligned with the actual chosen `cardImage` (in case a segment uses a placeholder from
  // another corridor image file).
  const match = accent.cardImage.match(/^\/images\/corridor-([a-z0-9-]+)\.webp$/i);
  const ogSegment = match?.[1];
  if (ogSegment) return `/images/og/corridor-${ogSegment}.jpg`;

  return `/images/og/corridor-${segment}.jpg`;
}
