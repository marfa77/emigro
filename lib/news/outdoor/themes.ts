/**
 * Day events are not a hike feed. A run mixes themes and never spends
 * the whole batch on trails.
 */

export type EventTheme = "food" | "wellness" | "bike" | "water" | "family" | "city" | "culture" | "sport" | "night" | "hike";

const THEME_IDS: EventTheme[] = ["food", "wellness", "bike", "water", "family", "city", "culture", "sport", "night", "hike"];

const FOOD = /gastro|cantin|enotur|oleotur|\bvino\b|wine|degust|aperitiv|tapas|mercado|mercat|sagra|\bcomida\b|cucina|cocina|brunch|formagg|cogumel|setas|funghi|picada|paella/i;
const WELLNESS = /yoga|medit|mindful|pilates|\britiro\b|\bretiro\b|benessere|bienestar|respir/i;
const BIKE = /e-?bike|biciclet|ciclism|\bbici\b|\bbike\b|\bmtb\b/i;
const WATER = /kayak|paddle|snorkel|\bsurf\b|\bvela\b|\bbarco\b|\bbarca\b|\bpraia\b|\bplaya\b|spiaggia|\bcanoa\b/i;
const FAMILY = /famigl|famili|bambin|niñ|crianç|\bkids\b|infantil/i;
const CITY = /urban|visita guiada|centro storic|centro hist|casco|roteiro|walking tour|museo|museu|\bborgo\b|borghi|patrimoni/i;
const CULTURE = /mostra|exposi|concert|teatro|teatre|festival|música|musica|cinema|\bcine\b|feira|fiera/i;
const HIKE = /escursion|trek|sender|caminhad|caminata|trilh|hike|hiking|trail|monta|\bmonte\b|\bcima\b|rifugio|ferrata|\bserra\b|malga|percurs|pedestre/i;

const HIKE_SOURCES = new Set([
  "guiddy",
  "lecco",
  "lanzo",
  "ossola",
  "piccoledolomiti",
  "geo2go",
  "trekkin",
  "hikeland",
  "trekkingroots",
  "montanhas",
  "arouca",
  "geres",
]);

export function isEventTheme(value: string | undefined): value is EventTheme {
  return !!value && (THEME_IDS as string[]).includes(value);
}

/** Finer than the single channel theme. One event can carry several. */
export type EventTag =
  | EventTheme
  | "music"
  | "theatre"
  | "cinema"
  | "dance"
  | "exhibition"
  | "literature";

const TAG_IDS: EventTag[] = [
  ...THEME_IDS,
  "music",
  "theatre",
  "cinema",
  "dance",
  "exhibition",
  "literature",
];

export function isEventTag(value: string | undefined): value is EventTag {
  return !!value && (TAG_IDS as string[]).includes(value);
}

/**
 * Tags written with the row. The channel still uses one theme;
 * the calendar filter uses this list.
 */
export function eventTags(ev: {
  title: string;
  description?: string | null;
  organizer?: string | null;
  sourceId?: string | null;
  tags?: string[] | null;
}): EventTag[] {
  const tags = new Set<EventTag>();
  for (const raw of ev.tags || []) {
    if (isEventTag(raw)) tags.add(raw);
  }
  const primary = eventTheme(ev);
  tags.add(primary);
  const text = `${ev.title}\n${ev.description || ""}\n${ev.organizer || ""}`;
  const source = ev.sourceId || "";
  if (FOOD.test(text)) tags.add("food");
  if (FAMILY.test(text)) tags.add("family");
  if (source === "shotgun" || source === "liga" || source === "agendalx" || source === "casamusica") {
    return [...tags];
  }
  if (WELLNESS.test(text)) tags.add("wellness");
  if (BIKE.test(text)) tags.add("bike");
  if (WATER.test(text)) tags.add("water");
  if (CULTURE.test(text)) tags.add("culture");
  if (primary === "hike" || HIKE_SOURCES.has(source)) tags.add("hike");
  return [...tags];
}

export function eventTheme(ev: {
  title: string;
  description?: string | null;
  organizer?: string | null;
  sourceId?: string | null;
}): EventTheme {
  if (ev.sourceId === "shotgun") return "night";
  if (ev.sourceId === "liga") return "sport";
  if (ev.sourceId === "agendalx" || ev.sourceId === "casamusica") return "culture";
  const text = `${ev.title}\n${ev.description || ""}\n${ev.organizer || ""}`;
  if (FOOD.test(text)) return "food";
  if (WELLNESS.test(text)) return "wellness";
  if (BIKE.test(text)) return "bike";
  if (FAMILY.test(text)) return "family";
  if (/urban/i.test(text)) return "city";
  if (WATER.test(text) && !HIKE.test(text)) return "water";
  if (CITY.test(text) && !HIKE.test(text)) return "city";
  if (CULTURE.test(text) && !HIKE.test(text)) return "culture";
  if (/visita|históric|historica|cueva|\bcova\b/i.test(text) && !HIKE.test(text)) return "city";
  if (HIKE.test(text)) return "hike";
  if (HIKE_SOURCES.has(ev.sourceId || "")) return "hike";
  return "hike";
}

const HORIZON_MS = 45 * 24 * 60 * 60 * 1000;

const OUTSIDE_PORTO_NORTH =
  /lisboa|lisbon|cascais|estoril|sintra|alvalade|fatima|batalha|bucaco|lourinh|ourense|blancos|espanha|\bspain\b|coimbra|viseu|oliveira de frades|leiria|nazare|algarve|faro|setubal|evora|santarem/i;

const PORTO_NORTH =
  /porto|gaia|matosinhos|gondomar|\bmaia\b|valongo|espinho|braga|guimar|famalic|barcelos|geres|peneda|arcos de valdevez|cabeceiras|amarante|vila do conde|povoa|arouca|montesinho|braganca|chaves|vila real|\bmiranda\b|caminha|viana|ponte de lima|moncao|melgaco|montalegre|terras de bouro|casa da musica|\bnorte\b/i;

/** Channel posts stay in Porto and the North. Lisbon and the centre stay on the site. */
export function inPortoNorth(location: string): boolean {
  const place = location.normalize("NFD").replace(/\p{M}/gu, "");
  if (OUTSIDE_PORTO_NORTH.test(place)) return false;
  return PORTO_NORTH.test(place);
}

export function hasListedClock(iso: string, endIso?: string | null): boolean {
  const start = Date.parse(iso);
  if (!Number.isFinite(start)) return false;
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(start));
  if ((clock === "00:00" || clock === "23:59") && !endIso) return false;
  return true;
}

function themeRank(theme: EventTheme, recent: Set<EventTheme>): number {
  if (theme === "hike") return 50;
  if (recent.has(theme)) return 20;
  return 0;
}

/**
 * Up to `max` events, each a different theme. Hikes lose to everything else
 * and never fill more than one slot. A hike-only queue publishes a single trail.
 */
export function nextPosts<
  T extends {
    title: string;
    startIso: string;
    description?: string | null;
    organizer?: string | null;
    sourceId?: string | null;
  },
>(events: T[], max = 3, recent: EventTheme[] = []): T[] {
  const now = Date.now();
  const near = events.filter((ev) => {
    const start = Date.parse(ev.startIso);
    return Number.isFinite(start) && start <= now + HORIZON_MS;
  });
  const pool = near.length ? near : events;
  const recentSet = new Set(recent.slice(-4));
  const byDate = (a: T, b: T) => Date.parse(a.startIso) - Date.parse(b.startIso);
  const ranked = [...pool].sort((a, b) => {
    const rank = themeRank(eventTheme(a), recentSet) - themeRank(eventTheme(b), recentSet);
    if (rank !== 0) return rank;
    return byDate(a, b);
  });
  const picked: T[] = [];
  const used = new Set<EventTheme>();
  const soonest = [...pool].sort(byDate)[0];
  if (soonest && Date.parse(soonest.startIso) - now <= 72 * 60 * 60 * 1000) {
    picked.push(soonest);
    used.add(eventTheme(soonest));
  }
  for (const ev of ranked) {
    if (picked.length >= max) break;
    const theme = eventTheme(ev);
    if (used.has(theme)) continue;
    if (theme === "hike" && picked.length === 0 && ranked.some((item) => eventTheme(item) !== "hike")) continue;
    picked.push(ev);
    used.add(theme);
  }
  if (!used.has("hike") && picked.length < max) {
    const hike = [...pool]
      .sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso))
      .find((ev) => eventTheme(ev) === "hike");
    if (hike) picked.push(hike);
  }
  if (picked.every((ev) => eventTheme(ev) === "hike")) return picked.slice(0, 1);
  return picked.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
}

type ChannelCandidate = {
  title: string;
  startIso: string;
  endIso?: string | null;
  description?: string | null;
  organizer?: string | null;
  sourceId?: string | null;
  location: string;
  imageUrl?: string | null;
};

function channelScore(ev: ChannelCandidate, used: Set<EventTheme>, now: number): number {
  const start = Date.parse(ev.startIso);
  const days = (start - now) / 86_400_000;
  let score = 0;
  if (hasListedClock(ev.startIso, ev.endIso)) score += 40;
  const text = (ev.description || "").trim();
  if (text.length > 180) score += 20;
  else if (text.length > 60) score += 10;
  if (days < 1) score += 50;
  else if (days <= 2) score += 36;
  else if (days <= 7) score += 16;
  else if (days <= 14) score += 6;
  else score -= 12;
  if (used.has(eventTheme(ev))) score -= 70;
  return score;
}

/**
 * Best Porto and North events for the channel. One theme ahead of a repeat,
 * soon and with a real hour ahead of a dateless listing. Order is post order.
 */
export function channelPicks<T extends ChannelCandidate>(events: T[], max = 3, recent: EventTheme[] = []): T[] {
  const now = Date.now();
  const pool = events.filter((ev) => {
    const start = Date.parse(ev.startIso);
    if (!Number.isFinite(start) || start < now || start > now + HORIZON_MS) return false;
    if (!ev.imageUrl) return false;
    return inPortoNorth(ev.location);
  });
  const remaining = [...pool];
  const picked: T[] = [];
  const used = new Set(recent);
  while (picked.length < max && remaining.length) {
    remaining.sort((a, b) => {
      const rank = channelScore(b, used, now) - channelScore(a, used, now);
      if (rank !== 0) return rank;
      return Date.parse(a.startIso) - Date.parse(b.startIso);
    });
    const [next] = remaining.splice(0, 1);
    if (!next) break;
    picked.push(next);
    used.add(eventTheme(next));
  }
  return picked;
}

const THEME_RU: Record<EventTheme, string> = {
  food: "еда",
  wellness: "спокойный день",
  bike: "велосипед",
  water: "вода",
  family: "семья",
  city: "город",
  culture: "культура",
  sport: "спорт",
  night: "ночь",
  hike: "поход",
};

const SAMPLE: Record<"it" | "es" | "pt", Record<EventTheme, { sample: string; example: string; words: string }>> = {
  it: {
    hike: {
      sample: "sentiero (тропа)",
      example: "выйдем на sentiero (тропа) с guida (гид)",
      words: "sentiero, escursione, guida, rifugio, bosco, gruppo, prenotazione",
    },
    food: {
      sample: "cantina (винодельня)",
      example: "заглянем на cantina (винодельня) и останемся на degustazione (дегустация)",
      words: "cantina, vino, degustazione, pranzo, guida, gruppo, prenotazione",
    },
    wellness: {
      sample: "meditazione (медитация)",
      example: "час meditazione (медитация) с guida (гид)",
      words: "meditazione, respiro, guida, gruppo, prenotazione",
    },
    bike: {
      sample: "bici (велосипед)",
      example: "поедем на bici (велосипед) с guida (гид)",
      words: "bici, percorso, guida, panorama, gruppo, prenotazione",
    },
    water: {
      sample: "barca (лодка)",
      example: "выйдем на barca (лодка) с guida (гид)",
      words: "barca, mare, guida, gruppo, prenotazione",
    },
    family: {
      sample: "famiglia (семья)",
      example: "формат для famiglia (семья), темп спокойный, с guida (гид)",
      words: "famiglia, bambini, guida, percorso, gruppo, prenotazione",
    },
    city: {
      sample: "borgo (городок)",
      example: "пройдём borgo (городок) с guida (гид)",
      words: "borgo, centro, guida, storia, gruppo, prenotazione",
    },
    culture: {
      sample: "mostra (выставка)",
      example: "зайдём на mostra (выставка) с guida (гид)",
      words: "mostra, museo, guida, biglietto, gruppo, prenotazione",
    },
    sport: {
      sample: "partita (матч)",
      example: "partita (матч) на stadio (стадион), вход по biglietto (билет)",
      words: "partita, stadio, squadra, biglietto, calcio",
    },
    night: {
      sample: "notte (ночь)",
      example: "ночь на pista (танцпол), вход по biglietto (билет)",
      words: "notte, pista, biglietto, ingresso, dj, casa",
    },
  },
  es: {
    hike: {
      sample: "sendero (тропа)",
      example: "выйдем на sendero (тропа) с guía (гид)",
      words: "sendero, ruta, guía, montaña, pueblo, grupo, inscripción",
    },
    food: {
      sample: "tapas (закуски)",
      example: "соберёмся на tapas (закуски) с guía (гид)",
      words: "tapas, ruta, guía, pueblo, grupo, inscripción",
    },
    wellness: {
      sample: "meditación (медитация)",
      example: "час meditación (медитация) у playa (пляж)",
      words: "meditación, playa, guía, grupo, inscripción",
    },
    bike: {
      sample: "bici (велосипед)",
      example: "поедем на bici (велосипед) с guía (гид)",
      words: "bici, ruta, guía, pueblo, grupo, inscripción",
    },
    water: {
      sample: "playa (пляж)",
      example: "соберёмся на playa (пляж) с guía (гид)",
      words: "playa, mar, guía, grupo, inscripción",
    },
    family: {
      sample: "familia (семья)",
      example: "формат для familia (семья), с guía (гид)",
      words: "familia, niños, guía, ruta, grupo, inscripción",
    },
    city: {
      sample: "casco (старый город)",
      example: "пройдём casco (старый город) с guía (гид)",
      words: "casco, pueblo, guía, historia, grupo, inscripción",
    },
    culture: {
      sample: "museo (музей)",
      example: "зайдём в museo (музей) с guía (гид)",
      words: "museo, exposición, guía, entrada, grupo, inscripción",
    },
    sport: {
      sample: "partido (матч)",
      example: "partido (матч) на estadio (стадион), вход по entrada (билет)",
      words: "partido, estadio, equipo, entrada, fútbol",
    },
    night: {
      sample: "noche (ночь)",
      example: "ночь на pista (танцпол), вход по entrada (билет)",
      words: "noche, pista, entrada, discoteca, dj, sala",
    },
  },
  pt: {
    hike: {
      sample: "trilho (тропа)",
      example: "выйдем на trilho (тропа) с guia (гид)",
      words: "trilho, caminhada, guia, serra, floresta, grupo, inscrição",
    },
    food: {
      sample: "cogumelo (гриб)",
      example: "соберём cogumelos (грибы) и останемся на almoço (обед)",
      words: "cogumelo, almoço, guia, serra, grupo, inscrição",
    },
    wellness: {
      sample: "meditação (медитация)",
      example: "час meditação (медитация) с guia (гид)",
      words: "meditação, guia, grupo, inscrição",
    },
    bike: {
      sample: "bicicleta (велосипед)",
      example: "поедем на bicicleta (велосипед) с guia (гид)",
      words: "bicicleta, percurso, guia, grupo, inscrição",
    },
    water: {
      sample: "praia (пляж)",
      example: "соберёмся на praia (пляж) с guia (гид)",
      words: "praia, mar, guia, grupo, inscrição",
    },
    family: {
      sample: "família (семья)",
      example: "формат для família (семья), с guia (гид)",
      words: "família, crianças, guia, percurso, grupo, inscrição",
    },
    city: {
      sample: "centro (центр)",
      example: "пройдём centro (центр) с guia (гид)",
      words: "centro, cidade, guia, história, grupo, inscrição",
    },
    culture: {
      sample: "museu (музей)",
      example: "зайдём в museu (музей) с guia (гид)",
      words: "museu, exposição, guia, bilhete, grupo, inscrição",
    },
    sport: {
      sample: "jogo (матч)",
      example: "jogo (матч) на estádio (стадион), вход по bilhete (билет)",
      words: "jogo, estádio, equipa, bilhete, futebol",
    },
    night: {
      sample: "noite (ночь)",
      example: "ночь на pista (танцпол), вход по bilhete (билет)",
      words: "noite, pista, bilhete, entrada, dj, casa",
    },
  },
};

/** Prompt fragment: glosses follow the event, and a meal is not written as a summit. */
export function captionThemeHint(
  ev: { title: string; description?: string | null; organizer?: string | null; sourceId?: string | null },
  lang: "it" | "es" | "pt"
): string {
  const theme = eventTheme(ev);
  const pack = SAMPLE[lang][theme];
  const trail =
    theme === "hike"
      ? ""
      : theme === "night"
        ? " Это клубная ночь, не поход: без километров, вершины и треккинговой обуви."
        : theme === "sport"
          ? " Это футбольный матч, не поход: кто играет, стадион и час. Без километров и вершины."
          : theme === "culture"
            ? " Это культура, не поход: сцена, зал или выставка. Без километров и вершины."
            : " Это не поход: не пиши про тропу, вершину и набор высоты, если этого нет во входе.";
  return `Тема: ${THEME_RU[theme]}.${trail} В тексте обязательно 4–6 слов СТРОГО так: ${pack.sample}. Хорошо: «${pack.example}». Бери слова события: ${pack.words}.`;
}
