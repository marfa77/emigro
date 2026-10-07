export type ComoGuideImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  creditUrl: string;
};

export type ComoGuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { columns: string[]; rows: string[][] };
  images?: ComoGuideImage[];
};

export type ComoGuide = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  quickAnswer: string;
  category: string;
  updated: string;
  hero: string;
  heroAlt: string;
  heroCreditUrl: string;
  sections: ComoGuideSection[];
  faq: Array<{ q: string; a: string }>;
  officialSources: Array<{ title: string; url: string }>;
};

export const COMO_STAY_OFFER = {
  percent: 5,
  code: "EMIGRO5",
  headline: "5% off any ComoStay apartment",
  headlineRu: "5% скидка на любой апартамент ComoStay",
  detail:
    "Emigro readers get 5% off any ComoStay home, including Tulipani 11. Quote code EMIGRO5 when you book.",
  detailRu:
    "Читателям Emigro — 5% на любой апартамент ComoStay, включая Tulipani 11. При бронировании назовите код EMIGRO5.",
} as const;

export function comoStayUrl(
  guideSlug: string,
  placement: "early" | "context" | "final" | "property-image",
  destination: "tulipani" | "inventory",
): string {
  const url = new URL(
    destination === "tulipani"
      ? "https://comostay.net/en/apartment-tulipani-11---tremezzo"
      : "https://comostay.net/",
  );
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "guide");
  url.searchParams.set("utm_campaign", "lake_como_2026");
  url.searchParams.set("utm_content", `${guideSlug}-${placement}-${destination}`);
  url.searchParams.set("coupon", COMO_STAY_OFFER.code);
  return url.toString();
}

const COMO_STAY_URL = comoStayUrl("lake-como-hub", "context", "inventory");
const TULIPANI_URL = comoStayUrl("lake-como-hub", "context", "tulipani");

export const COMO_STAY = {
  siteUrl: COMO_STAY_URL,
  tulipaniUrl: TULIPANI_URL,
  apartmentName: "Apartment Tulipani 11",
  facts: ["Tremezzo", "4 guests", "2 bedrooms", "2 bathrooms", "air conditioning", "Wi-Fi"],
} as const;

const tulipaniImages: ComoGuideImage[] = [
  {
    src: "/images/como/tulipani-11-balcony.webp",
    alt: "Balcony at Apartment Tulipani 11 in Tremezzo",
    caption: "A quiet Tremezzo base with a balcony, close to the central-lake sights.",
    credit: "ComoStay · Tulipani 11",
    creditUrl: TULIPANI_URL,
  },
  {
    src: "/images/como/tulipani-11-living.webp",
    alt: "Living room at Apartment Tulipani 11 in Tremezzo",
    caption: "The apartment sleeps four and has two bedrooms and two bathrooms.",
    credit: "ComoStay · Tulipani 11",
    creditUrl: TULIPANI_URL,
  },
];

export const COMO_GUIDES: ComoGuide[] = [
  {
    slug: "lake-como-ferry-guide-timetables",
    title: "Lake Como ferries: the practical 2026 guide from Tremezzo",
    seoTitle: "Lake Como Ferry Timetable 2026: Tremezzo Guide",
    description:
      "Lake Como ferry guide for 2026: seasonal timetables, Tremezzo routes, fast boats, car ferries, tickets and missed-last-boat backup plans.",
    excerpt:
      "Use the official seasonal PDF, not an old screenshot. This guide explains Tremezzo, Cadenabbia and Lenno departures, central-lake ferries and realistic backups.",
    quickAnswer:
      "From Tremezzo, use Navigazione Laghi’s current Lake Como timetable and re-check it on the day of travel. Tremezzo and Lenno have passenger-boat calls; the frequent central-lake vehicle ferry uses nearby Cadenabbia, Bellagio, Menaggio and Varenna. Published schedules change by season, weather and port traffic, so this page links to the live official timetable instead of copying a timetable that will expire.",
    category: "Getting around",
    updated: "2026-10-05",
    hero: "/images/como/lake-como-ferries.webp",
    heroAlt: "Passenger ferry crossing Lake Como",
    heroCreditUrl: "https://www.pexels.com/photo/a-boat-is-floating-on-the-water-near-a-mountain-28267234/",
    sections: [
      {
        heading: "The four stops that matter from Tremezzo",
        paragraphs: [
          "Tremezzo is a good base precisely because you do not need to force every journey through Como city. The passenger pier is in the village, Lenno is useful for Villa del Balbianello, and Cadenabbia is the central-lake workhorse when you want Bellagio, Menaggio or Varenna.",
          "Do not treat “Tremezzo” and “Tremezzina” as a single pier name. Tremezzina is the municipality; timetables list individual stops. Check the departure pier printed on the ticket before leaving the apartment.",
        ],
        table: {
          columns: ["Pier", "Best for", "Practical note"],
          rows: [
            ["Tremezzo", "Passenger boats, Villa Carlotta", "Walkable village pier; frequency varies by season."],
            ["Lenno", "Balbianello and the Greenway", "Useful southbound alternative; not every service calls."],
            ["Cadenabbia", "Bellagio, Menaggio, Varenna", "Central-lake ferry hub; vehicle ferry also takes pedestrians."],
            ["Como", "Como city and rail connections", "A scenic long ride; fast and slow services differ."],
          ],
        },
      },
      {
        heading: "How to read the official timetable",
        paragraphs: [
          "Open Navigazione Laghi’s “Tickets and timetables Lake Como” page and choose the date range containing your travel day. Then open the Como–Colico table for passenger services or the Bellagio–Cadenabbia–Varenna–Menaggio table for the central-lake ferry.",
          "The PDF distinguishes daily, weekday and holiday services. Italian public holidays can follow the holiday column. A dot or blank cell means that sailing does not call at that pier. Fast services may require a supplement and can have different boarding rules.",
        ],
        bullets: [
          "Arrive about 20 minutes early; the operator explicitly recommends this and summer ticket queues can be substantial.",
          "Buy on board without surcharge only when the departure pier has no open ticket office; accessibility passengers may buy on board.",
          "Ask staff which vessel to board when several boats are alongside the same pier.",
          "Weather, waves and port traffic can alter or suspend services even after a PDF is published.",
        ],
      },
      {
        heading: "Three useful day-trip patterns",
        paragraphs: [
          "Bellagio is easiest through Cadenabbia when the frequent central-lake ferry is running. For Varenna, use the same central triangle and protect your return connection: Varenna is also a rail gateway, but the train does not bring you back to the western shore.",
          "For Como city, a direct boat is the scenic choice; the C110 bus is the practical fallback. For Balbianello, travel to Lenno and allow time for the final walk or the separate local boat service when operating.",
        ],
        table: {
          columns: ["Plan", "Outbound", "Return safeguard"],
          rows: [
            ["Bellagio", "Tremezzo/Cadenabbia → Bellagio", "Save a Cadenabbia return plus a C110 fallback."],
            ["Varenna", "Cadenabbia → Varenna", "Do not assume the last Bellagio connection also serves Varenna."],
            ["Como city", "Direct passenger boat", "Check C110 from Como for a later land option."],
          ],
        },
      },
      {
        heading: "Tickets, cars and accessibility",
        paragraphs: [
          "Only stops marked “Traghetto” accept vehicles. A passenger boat calling at Tremezzo is not automatically a car ferry. If you are driving, build the plan around the official vehicle-ferry table and arrive early because space is finite.",
          "Accessibility depends on vessel and water level. Navigazione Laghi publishes assistance information, but contacting the operator before travel is sensible when step-free boarding is essential.",
        ],
      },
      {
        heading: "If you miss the last boat",
        paragraphs: [
          "The western shore has a land backup: ASF Autolinee line C110 links Como, Argegno, Tremezzo, Menaggio and Colico. It does not solve every cross-lake journey, so from Bellagio or Varenna you may still need a ferry to the western side first.",
          "Save the official ASF timetable and a taxi number before the day trip. Do not rely on a generic maps app alone late at night; seasonal and holiday service patterns are easy to misread.",
        ],
      },
      {
        heading: "Stay where the central lake is usable",
        paragraphs: [
          "Tulipani 11 is in a quiet part of Tremezzo and is listed 1.2 km from both the bus and port. It works best for guests who want the central lake by day and a two-bedroom apartment rather than a hotel room at night.",
          `Check [Tulipani 11](${TULIPANI_URL}) for this exact apartment, or [browse all ComoStay homes](${COMO_STAY_URL}) if your dates or group size differ.`,
        ],
        images: tulipaniImages,
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 5 October 2026 against Navigazione Laghi’s official timetable page and ASF Autolinee’s official line search. Fixed: old guides still call the western-shore bus C10; the current official route number is C110. Sailing times are deliberately not frozen in this article because the operator publishes date-bounded seasonal PDFs.",
        ],
      },
    ],
    faq: [
      { q: "Is there a ferry stop in Tremezzo?", a: "Yes. Tremezzo has a passenger pier, but not every sailing calls there. Cadenabbia is the nearby hub for the central-lake vehicle ferry." },
      { q: "Can I take a car from Tremezzo to Bellagio?", a: "Use a stop and sailing marked Traghetto. The usual nearby vehicle-ferry departure is Cadenabbia, not every Tremezzo passenger service." },
      { q: "Should I buy Lake Como ferry tickets online?", a: "Use the official Navigazione Laghi channel where available, but still arrive early. Some routes and tickets are handled at the pier, and summer queues are common." },
      { q: "What is the bus backup for Tremezzo?", a: "ASF Autolinee line C110 runs along the western shore between Como, Argegno, Tremezzo, Menaggio and Colico. Always open the current seasonal PDF." },
      { q: "Are ferry times the same all year?", a: "No. The operator publishes separate winter, spring, summer and autumn date ranges, with weekday and holiday differences." },
    ],
    officialSources: [
      { title: "Navigazione Laghi — Lake Como tickets and timetables", url: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/" },
      { title: "ASF Autolinee — official line and timetable search", url: "https://www.asfautolinee.it/search-for-lines-and-schedules/?lang=en" },
      { title: "Villa Carlotta — official directions to Tremezzo", url: "https://www.villacarlotta.it/en/visit/" },
    ],
  },
  {
    slug: "lake-como-hiking-best-trails",
    title: "Best Lake Como hikes: five real trails from Tremezzo",
    seoTitle: "Best Lake Como Hikes 2026: 5 Trails from Tremezzo",
    description:
      "Five real Lake Como hikes from Tremezzo: Greenway del Lario, San Martino, Monte Crocione, Monte Grona and Sentiero del Viandante.",
    excerpt:
      "A no-filler hiking shortlist with realistic difficulty, access, seasonal risks and the right official map or transport link for each route.",
    quickAnswer:
      "For an easy first walk, choose the 10 km Greenway del Lario and join it directly in Tremezzo. For a short steep viewpoint, hike to San Martino above Griante. Experienced hikers can plan Monte Crocione or Monte Grona only with a current CAI/topographic track, suitable weather and mountain footwear. Sentiero del Viandante is the best rail-supported point-to-point option on the eastern shore.",
    category: "Hiking",
    updated: "2026-10-05",
    hero: "/images/como/lake-como-hiking.webp",
    heroAlt: "Mountain trail above Lake Como",
    heroCreditUrl: "https://www.pexels.com/photo/stunning-view-of-lake-como-and-alpine-mountains-35444658/",
    sections: [
      {
        heading: "Choose by difficulty, not by Instagram",
        paragraphs: [
          "Lake-level sunshine does not make the upper trails benign. Limestone, leaf-covered mule tracks, summer thunderstorms and lingering snow can change the character of a route. Distances in different apps also vary because users record different start points.",
          "The figures below are planning ranges, not a substitute for a current CAI map. Download the track before leaving Wi-Fi, turn around when visibility closes, and carry water: reliable fountains are not guaranteed above the villages.",
        ],
        table: {
          columns: ["Trail", "Level", "Planning range", "Best feature"],
          rows: [
            ["Greenway del Lario", "Easy", "10+ km point-to-point", "Villages, villas and frequent exits"],
            ["San Martino, Griante", "Moderate", "Short but steep", "Immediate central-lake panorama"],
            ["Monte Crocione", "Hard", "Full mountain day unless starting high", "Big Tremezzina ridge views"],
            ["Rifugio Menaggio / Monte Grona", "Hard", "Half/full day", "Classic pre-Alpine terrain"],
            ["Sentiero del Viandante", "Moderate", "Choose one rail-linked stage", "Flexible east-shore traverse"],
          ],
        },
      },
      {
        heading: "1. Greenway del Lario",
        paragraphs: [
          "The official route runs for more than 10 km through Colonno, Sala Comacina, Ossuccio, Lenno, Mezzegra, Tremezzo and Griante. It mixes old lanes, lakefront and sections near roads rather than behaving like an isolated woodland trail.",
          "From Tulipani 11, join the marked route in Tremezzo and walk south toward Lenno/Ossuccio for the most attraction-rich half, or north toward Griante for Villa Carlotta and the central-lake ferry. Bus and boat stops make a one-way walk practical.",
        ],
        bullets: [
          "Best for: families, mixed groups and the first or last day.",
          "Surface: paving, lanes, steps and roadside sections; not a continuous flat promenade.",
          "Navigation: follow Greenway signs, but keep the official stage description open at village junctions.",
          "Heat plan: start early in July–August; shade is intermittent.",
        ],
      },
      {
        heading: "2. San Martino above Griante",
        paragraphs: [
          "The small church on the rock wall above Griante gives one of the highest view-to-effort ratios on the central lake. The route climbs quickly from the village on stone and woodland paths; it is not a casual flip-flop walk despite its short distance.",
          "Start from Griante/Cadenabbia, follow local signs for San Martino and return the same way. In wet weather the descent deserves more attention than the ascent. Combine it with the Greenway rather than adding a second mountain objective.",
        ],
      },
      {
        heading: "3. Monte Crocione",
        paragraphs: [
          "Monte Crocione is the serious hike directly behind Tremezzina. Routes from lake level involve substantial ascent; higher starts near mountain roads or Rifugio Venini reduce the climb but add a narrow seasonal drive and do not remove navigation risk.",
          "Use a current CAI/topographic route and confirm road access locally. The summit ridge is exposed to weather, and low cloud can erase the visual landmarks that make the route seem obvious in photographs.",
        ],
        bullets: [
          "Only attempt in stable weather with proper footwear and an offline track.",
          "Do not quote one universal distance: lake-level, Boffalora and Venini starts are different hikes.",
          "Avoid after fresh snow unless equipped and experienced for winter mountain conditions.",
        ],
      },
      {
        heading: "4. Rifugio Menaggio and Monte Grona",
        paragraphs: [
          "The Menaggio–Plesio side offers a classic progression: hike to Rifugio Menaggio, then decide whether conditions and the group justify continuing toward Monte Grona. The upper mountain is materially harder than the refuge walk.",
          "Road access, refuge opening and public transport are seasonal. Check the refuge and local tourism information directly rather than assuming food, water or a return bus will be available.",
        ],
      },
      {
        heading: "5. Sentiero del Viandante",
        paragraphs: [
          "This historic route follows the eastern shore from the Lecco side toward Colico and beyond. Its major advantage is the railway: choose a stage between rail-served villages and return by train instead of retracing every step.",
          "From Tremezzo, cross to Varenna or reach the east shore through a central-lake ferry connection. Do not confuse the Church of San Martino near Abbadia Lariana, mentioned in the first official stage, with the San Martino viewpoint above Griante.",
        ],
      },
      {
        heading: "A practical hiking base in Tremezzo",
        paragraphs: [
          "A washing machine, two bathrooms and a kitchen matter after a wet or dusty trail more than another hotel lobby. Tulipani 11 accommodates four, has air conditioning and Wi-Fi, and puts the Greenway and central-lake transport within the Tremezzo area.",
          `See [Tulipani 11](${TULIPANI_URL}) or compare [all ComoStay apartments](${COMO_STAY_URL}) for a different trailhead or group size.`,
        ],
        images: tulipaniImages,
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 5 October 2026 against the official Lake Como destination pages for Greenway del Lario and Sentiero del Viandante. Route statistics for mountain objectives vary by trailhead, so this guide avoids false single-number precision and directs hikers to a current local/CAI track.",
        ],
      },
    ],
    faq: [
      { q: "What is the easiest hike near Tremezzo?", a: "The Greenway del Lario is the easiest flexible option. Join in Tremezzo and stop at a bus or ferry point instead of completing the full route." },
      { q: "Can children walk the Lake Como Greenway?", a: "Many families do, but it includes steps, village streets and road-adjacent sections. Choose a shorter section and supervise crossings." },
      { q: "Is Monte Crocione suitable for beginners?", a: "Not as a first mountain hike from lake level. It needs route planning, stable weather, suitable footwear and a realistic view of the ascent." },
      { q: "Can I hike without a car?", a: "Yes. The Greenway has bus and ferry access, while Sentiero del Viandante is particularly useful for rail-supported point-to-point stages." },
      { q: "When is the best hiking season?", a: "Spring and autumn are often comfortable at lower elevations. High routes depend on snow, storms and visibility, so check conditions rather than relying on the calendar." },
    ],
    officialSources: [
      { title: "Lake Como — Greenway del Lario", url: "https://www.lakecomo.is/en/experience/greenway-del-lario/" },
      { title: "Lake Como — Sentiero del Viandante", url: "https://www.lakecomo.is/en/experience/sentiero-del-viandante/" },
      { title: "Lake Como — official hiking collection", url: "https://www.lakecomo.is/en/experiences/sports/hiking/" },
    ],
  },
  {
    slug: "madesimo-ski-trip-from-lake-como",
    title: "Skiing in Madesimo from Lake Como: the complete 2026 trip plan",
    seoTitle: "Madesimo Ski from Lake Como 2026: 40 km, Sky Express, RidottoDì",
    description:
      "Deeper than the destination page: SS36 from Tremezzo, Campodolcino Sky Express PDF, Larici, MadePark, night ski €22, RidottoDì −30%, helmets D.L. 96/2025, Val di Lei status.",
    excerpt:
      "Madesimo is the closest serious Alpine ski day from Lake Como—if you plan SS36, the two base doors, RidottoDì, MadePark and closed Val di Lei like an operator, not a brochure.",
    quickAnswer:
      "From Tremezzo, treat Madesimo as a long Alpine day. Madesimo Turismo lists the Valchiavenna ski area at 11 lifts, about 34 slopes and 40 km from the village up to Alpe Motta / Pizzo Groppera; season 2025/26 ran 28 November 2025–12 April 2026 (live board always wins). Drive western/northern lake → SS36 → Chiavenna–Campodolcino–Madesimo (Como–Madesimo ~104 km / ~2 h in normal conditions). Enter from Madesimo village (Larici) or Campodolcino Sky Express (1,082→1,721 m, ~3 min, 639 m). Buy the unique ticket on Skiarea Valchiavenna; Tuesday/Thursday RidottoDì is −30% on the day pass plus local 15% extras when the promo applies. Helmets are mandatory for everyone under D.L. 96/2025. Do not promise Val di Lei / Canalone from an old map—plants were under redevelopment.",
    category: "Winter",
    updated: "2026-10-07",
    hero: "/images/como/madesimo-ski.webp",
    heroAlt: "Winter mountain scene in Madesimo",
    heroCreditUrl: "https://www.pexels.com/photo/snowmobiler-in-snowy-madesimo-mountains-36770831/",
    sections: [
      {
        heading: "Why this guide beats the destination ski page",
        paragraphs: [
          "The official Madesimo Turismo ski page is the right marketing overview: 40 km, two access doors, MadePark, night skiing, helmets, skipass link. What it does not do is plan a Lake Como departure: SS36 winter buffer, which door to choose when village parking is hostile, how RidottoDì −30% changes your Tuesday vs Saturday decision, how to read the Sky Express PDF, when night skiing is a separate overnight product, and how to treat Val di Lei / Canalone while plants are modernised.",
          "This Emigro page keeps every official product fact and adds the operator layer a Tremezzo guest actually needs. Use madesimo.eu and Skiarea Valchiavenna for live calendars; use this guide for the decision tree from the lake.",
        ],
        bullets: [
          "Official inventory + Lake Como day-trip logistics in one place.",
          "Door A vs Door B parking logic (village Larici vs Campodolcino Sky Express).",
          "RidottoDì −30% / extras, night-ski €22 window, MadePark feature list with caveats.",
          "Hard no on stale maps that still sell Val di Lei as open every day.",
        ],
      },
      {
        heading: "Official product snapshot (what madesimo.eu publishes)",
        paragraphs: [
          "Madesimo Turismo’s ski page (EN/IT) describes Skiarea Valchiavenna as 11 lifts and about 34 slopes of all levels across roughly 40 kilometres, from village houses up to the foot of Pizzo Groppera at Alpe Motta. The area sits on three municipalities—Madesimo, Campodolcino and Piuro—with one tariff and connected slopes. Access is ski-bus-free from Madesimo village lifts, or from Campodolcino via the underground Sky Express (~3 minutes to Motta).",
          "Season window on that page for 2025/26: open 28 November 2025, close 12 April 2026; the EN page also advertised free skiing on opening day. Skiarea’s live board may show a different open-lift / open-slope count than the brochure maximum (the plant board has listed up to 37 slope slots)—always ski today’s board, not the marketing ceiling.",
        ],
        table: {
          columns: ["Official claim", "Source", "Lake Como planner note"],
          rows: [
            ["11 lifts · ~34 slopes · ~40 km", "madesimo.eu ski page", "Confirm open count on skiareavalchiavenna.it the morning you leave."],
            ["Season 28 Nov 2025 – 12 Apr 2026", "madesimo.eu IT ski page", "Re-check for the season you actually travel."],
            ["Free skiing on opening day", "madesimo.eu EN ski page", "One-day promo; do not assume other free days."],
            ["Helmets mandatory for everyone", "D.L. 96/2025 warning on madesimo.eu", "Rent or bring for every adult—old under-18 rule is dead."],
            ["Unique ticket, three communes", "madesimo.eu", "Village and Sky Express are doors, not two resorts."],
          ],
        },
      },
      {
        heading: "Is Madesimo a day trip from Tremezzo?",
        paragraphs: [
          "Yes by car for an early-starting intermediate or advanced group with pre-booked rentals. No as a spontaneous half day, and rarely for first-timers who still need boot fitting, a lesson and a gentle orientation lap.",
          "The workable route leaves Tremezzo along the western/northern lake, joins the SS36 toward Lecco–Chiavenna, then climbs the Valle Spluga to Campodolcino and Madesimo. Consorzio Turistico Madesimo publishes Como–Madesimo as about 104 km / ~2 hours and Lecco–Madesimo as about 85 km / ~1h30 in normal conditions. From Tremezzo you still need the lakeshore segment and a winter buffer for weather, snow controls and slow tourist traffic. Destination marketing often says “under 140 km from Milan”; that is true and still not a lakeside hop from Bellagio.",
          "For beginners collecting equipment and arranging a lesson, an overnight in Valchiavenna removes the return-drive pressure. Experienced skiers can make a day work by leaving before dawn, parking with a plan B, and treating 16:00 as the hard stop for the descent—unless you have deliberately booked a night-ski overnight (see below).",
        ],
        bullets: [
          "Check road weather and Italian winter-equipment requirements before leaving the lake.",
          "Do not schedule a non-refundable lesson around a summer Google Maps estimate.",
          "Keep chains accessible rather than buried under luggage.",
          "If the upper village road or parking looks difficult, switch to Campodolcino + Sky Express.",
        ],
      },
      {
        heading: "Two doors into the ski area: Madesimo vs Campodolcino",
        paragraphs: [
          "Treat access as a choice of base, not as two different resorts. Madesimo Turismo is clear: lifts start from both the village and the Sky Express, slopes are connected, and the tariff is unique.",
          "Door A — Madesimo village: ski from the pedestrian centre on cabin and chair access, including the Larici cabin toward roughly 1,900 m (Acquarella / Alpe Groppera sector). Best when your rental/school meeting point is in the village, you want MadePark via Larici/Montalto, or you plan night skiing on Pianello/Montalto.",
          "Door B — Campodolcino Sky Express: the underground funicular from 1,082 m to Alpe Motta at 1,721 m. Skiarea Valchiavenna lists 639 m vertical, 1,406 m length; destination pages call it about three minutes. Madesimo Turismo notes a large free parking area beside the SP1 ticket office—this is often the calmest day-trip parking move when Madesimo village fills.",
        ],
        table: {
          columns: ["Access", "Best for", "Watch-outs"],
          rows: [
            ["Madesimo / Larici", "Village stay, MadePark, night ski, ski-back-to-town", "Village parking is tighter on peak weekends."],
            ["Campodolcino / Sky Express", "Day-trippers, free lower parking, Motta start", "Match the funicular PDF and last descent."],
            ["Wrong choice", "Campodolcino lesson + late MadePark hunt in the village", "Children and instructors are not interchangeable between bases."],
          ],
        },
      },
      {
        heading: "Sky Express: treat the winter PDF as operational truth",
        paragraphs: [
          "Skiarea Valchiavenna publishes a winter 2025/26 Sky Express timetable PDF. Pattern to plan around: first departure 07:50 (reserved for pedestrians / non-skiers), then roughly half-hourly service through 17:30, with a denser morning pattern on festive days including an 08:15 departure. Weekday vs Saturday–Sunday / holiday bridges differ; Christmas 24 Dec 2025–6 Jan 2026 and Carnevale 14–22 Feb 2026 are called out as festive periods on that PDF.",
          "The same PDF states the company may alter or cancel runs without notice. Do not print one grid and treat it as permanent. On the morning itself, open the live plant page and the PDF again before you leave Tremezzo.",
        ],
        bullets: [
          "Park low at Campodolcino if you want to avoid the last mountain hairpins.",
          "Do not put a child’s first lesson on the 07:50 pedestrian-only departure.",
          "Protect the last useful downhill connection as tightly as a ferry return on Como.",
        ],
      },
      {
        heading: "What the ski area actually offers",
        paragraphs: [
          "Official alpine product: ~40 km of blue, red and black terrain with natural and artificial snow; race-certified lines including the Montalto / Arlecchino FIS context; village ski-out at Madesimo; MadePark freestyle; scheduled night skiing on Pianello/Montalto; plus cross-country and skialp products on regulated tracks when published.",
          "Expert / freeride honesty: historic Canalone and Val di Lei are the photos destination marketing still loves. Madesimo Turismo says the scenic Val di Lei and the famous Canalone freeride return only when new plants are ready; the IT page has also used “wait until December 2025 / plants being modernised” language for Canalone. Valchiavenna has marked Val di Lei inaccessible during redevelopment. Soft rule for Lake Como planners: never sell that sector as open until the live Skiarea board and madesimo.eu both say so the morning you leave.",
        ],
        table: {
          columns: ["Product", "Official signal", "Lake Como planner note"],
          rows: [
            ["Alpine slopes", "~40 km · 11 lifts · ~34 slopes (brochure)", "Ski today’s open count on the Skiarea board."],
            ["Sky Express", "Campodolcino 1082 → Motta 1721, ~3 min, 639 m", "Best day-trip parking + Motta start."],
            ["MadePark", "~1800 m via Larici / Montalto; free access; helmet mandatory", "Feature list changes—see MadePark section."],
            ["Night skiing", "Pianello/Montalto · Larici 19:00–22:45 · €22 when scheduled", "Usually needs a valley overnight from Tremezzo."],
            ["Val di Lei / Canalone", "Waiting on redevelopment / new plants", "Discard 2019 maps that still promise it."],
          ],
        },
      },
      {
        heading: "MadePark: snowpark facts the brochure lists—and how to use them",
        paragraphs: [
          "Madesimo Turismo places MadePark at about 1,800 m, reached from the village centre by Larici cabin or Montalto chairlift. Access is free within the ski-area logic; helmet use is mandatory. Official feature language includes kickers of 2, 4 and 6 metres plus flat boxes, plugs, down rails, tanks, mailboxes, rainbows and modular boxes, with a setup that changes through the season.",
          "From Lake Como, MadePark is a second-block product for riders who already have warm legs and a village-side access plan—not the reason to leave Tremezzo at 05:45 if the rest of the car is on blue slopes. Book rental and school on the Madesimo side if the park is the day’s priority; do not park at Sky Express and invent a late traverse to “just check the park”.",
        ],
        bullets: [
          "Helmet mandatory even though park entry is free.",
          "Do not promise a specific rail or kicker from last year’s Instagram.",
          "Same-base rule: MadePark priority ⇒ Door A (village), not Door B.",
        ],
      },
      {
        heading: "Night skiing: €22 evenings that are not a Tremezzo day add-on",
        paragraphs: [
          "Madesimo Turismo’s night-ski product is the illuminated Pianello/Montalto piste, with Larici cabin running 19:00–22:45 on scheduled evenings; Larici is free for pedestrians; the night skipass is listed at €22 with no reductions. Stops at Larici / Acquarella refreshment are part of the published experience. The IT ski page has stated that 2026 dates were not yet available; earlier calendars (e.g. selected Saturdays in Feb–Mar 2025) show the pattern is sparse, weather-cancellable and not nightly.",
          "Honest Lake Como rule: do not bolt night skiing onto a dawn departure from Tremezzo and a 16:00 return. If night skiing is the goal, sleep in Madesimo or Campodolcino, ski a normal day from Door A, then buy the night ticket—or arrive for the evening only after confirming the live date list.",
        ],
        table: {
          columns: ["Item", "Official figure", "Planner note"],
          rows: [
            ["Slope", "Pianello / Montalto illuminated", "Village-side product, not Motta."],
            ["Lift window", "Larici 19:00–22:45", "Pedestrians free on Larici when operating."],
            ["Night pass", "€22, no reductions", "Separate from the daytime listino."],
            ["2026 calendar", "Not always published in advance", "Confirm on madesimo.eu / Skiarea before travel."],
          ],
        },
      },
      {
        heading: "Skipass, RidottoDì −30% and money logic",
        paragraphs: [
          "Buy on the official Skiarea Valchiavenna shop or at the desks—do not trust a screenshot from a random booking site. Listino figures move by season band and age category (Junior / Senior / Bimbo birth-year rules); open https://www.skiareavalchiavenna.it/prezzi/ and the online shop for your exact date rather than freezing a blog number.",
          "RidottoDì (official Madesimo Turismo 2025/26 promo page): Tuesday and Thursday daily skipass at −30%, bought online or at the desks, valid across the season with high-crowd exclusions. Presenting that day ticket unlocks further published extras: 15% off lessons at participating schools (e.g. Scuola Italiana Sci e Snowboard Madesimo & Vallespluga, Scuola Sci e Snowboard Alpe Motta), 15% off rental at named shops (Buzzetti Sport, Deghi Sport, Powder Ski Rent, Pedro Ski Center), plus snowmobile and wellness discounts listed on the same page. For a Lake Como guest, Tuesday/Thursday often beats Saturday on price, queues and parking stress—even before the −30%.",
          "Other money levers: Early Bird dated tickets when sold; half-day tickets if the SS36 ate your morning; and not buying a full day for a beginner who will spend three hours in rental and lesson logistics.",
        ],
        bullets: [
          "−30% RidottoDì is the headline; 15% school/rental extras are the second layer—ask at payment.",
          "High-crowd exclusions apply—do not assume Christmas week is a RidottoDì day.",
          "Photo is required for multi-day tickets beyond three days on published rules—irrelevant for a one-day raid.",
        ],
      },
      {
        heading: "Helmets, insurance and Italian piste rules you cannot ignore",
        paragraphs: [
          "Madesimo Turismo explicitly warns that D.L. 96 of 30 June 2025 makes an approved protective helmet mandatory for everyone. Italian winter-sports operators present this as applying to alpine skiing, snowboarding, telemark, sledges and toboggans from winter 2025/26, with administrative fines and possible pass withdrawal for repeat violations. Bring or rent a helmet for every adult—do not assume the old “only under 18” rule.",
          "Separately, Italian piste law (D.Lgs. 40/2021 framework) still expects civil-liability cover for damage to third parties and forbids skiing under the influence of alcohol or drugs. If your travel insurance is silent on piste liability, fix that before you leave Tremezzo—not at the rental desk.",
        ],
      },
      {
        heading: "A workable ski-day timeline from Tulipani 11",
        table: {
          columns: ["Time", "Plan", "Why"],
          rows: [
            ["Before 06:15", "Leave Tremezzo", "Protects lake + SS36 + mountain delays."],
            ["07:45–08:30", "Arrive Campodolcino or Madesimo", "Choose Door B if village parking looks hostile."],
            ["08:30–09:15", "Collect pre-booked kit + buy/load pass", "Rental queues eat the cold morning snow."],
            ["09:15–12:30", "Ski the open sector that matches the group", "Live lift board only."],
            ["12:30–13:15", "Early lunch on-mountain or at Motta/village", "Avoid the peak queue."],
            ["13:15–15:30", "Second ski block (MadePark only if Door A)", "Stop while legs and light are still good."],
            ["By 16:00", "Return kit and start the descent", "Skip night ski unless you overnighted up-valley."],
          ],
        },
        paragraphs: [
          "This is a planning framework, not an operating timetable. Last uplift, Sky Express last run and night-skiing evenings vary. Confirm them on Skiarea Valchiavenna the morning you leave.",
        ],
      },
      {
        heading: "Beginners, families, schools and rentals",
        paragraphs: [
          "Book the ski school meeting point and the rental shop in the same base sector. A Campodolcino Sky Express start and a Madesimo village lesson are not interchangeable when a child is waiting for an instructor.",
          "Send heights, weights, shoe sizes and ability levels the day before. Ask whether helmets and damage waiver are included. A family with first-timers usually gains more from a Valchiavenna overnight than from burning the best snow hours in fitting queues after a 06:00 lake departure.",
          "If you hold a RidottoDì ticket, ask for the published 15% lesson/rental discount at participating schools and shops named on the Madesimo Turismo promo page—do not invent the discount at a random desk.",
        ],
      },
      {
        heading: "Public transport: possible does not mean practical from Tremezzo",
        paragraphs: [
          "Rail gateway: Chiavenna, then local mountain transport / shuttle products toward the plants. From Tremezzo that usually means ASF lakeshore bus logic into a Como or Colico rail connection, then Trenord toward Chiavenna, then a final mountain leg. Seasonal timings and a missed last shuttle can strand a day trip.",
          "Valtellina / Valchiavenna pages have, in past seasons, sold Sunday “Treno delle Neve” style packages (train + shuttle + day pass). Treat those as seasonal products to verify for your exact date—not as a permanent timetable you can paste into a Lake Como itinerary.",
          "If you refuse the car, sleep in Chiavenna, Campodolcino or Madesimo the night before. Do not invent a permanent “Madesimo bus from Tremezzo” grid.",
        ],
      },
      {
        heading: "Where to sleep before and after the ski day",
        paragraphs: [
          "Tulipani 11 makes sense when skiing is one chapter of a longer Lake Como stay: four guests, two bedrooms, two bathrooms, kitchen, washing machine, heating and street parking. Emigro readers get 5% off any ComoStay apartment with code EMIGRO5. For consecutive ski days—or any night-skiing plan—move up-valley instead of repeating the SS36.",
          `Book the lake portion at [Tulipani 11](${TULIPANI_URL}), or browse [all ComoStay apartments](${COMO_STAY_URL}) if dates or capacity differ.`,
          "Local info if you are already in the village: Consorzio Turistico Madesimo Infopoint, Via Alle Scuole 12, 23024 Madesimo (SO), +39 0343 53015 / +39 345 0400 857, info@madesimo.eu. Published public hours have been Mon/Tue/Thu/Fri/Sat 09:00–12:30 and 15:00–18:00, Sunday 09:00–12:00, Wednesday phone/email only—re-check before you depend on a walk-in.",
        ],
        images: tulipaniImages,
      },
      {
        heading: "Morning-of checklist",
        bullets: [
          "Skiarea Valchiavenna live lifts / snow board open.",
          "Sky Express PDF or village first-lift time re-checked.",
          "Pass purchased (RidottoDì Tue/Thu if eligible) or Valchiavenna Card ready; helmet for every adult.",
          "Rental / school confirmation with the correct base name.",
          "Road weather + chains / winter-equipment status for SS36.",
          "Hard stop time for the return drive agreed—or confirmed night-ski overnight plan.",
        ],
        paragraphs: [
          "If two of those six fail, convert the day into a lake plan—do not force a mountain day on stale information.",
        ],
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 7 October 2026 against madesimo.eu EN/IT ski pages, RidottoDì 2025/26 promo, Consorzio Turistico Valchiavenna and Skiarea Valchiavenna (live board, prices page, Sky Express plant page and winter 2025/26 timetable PDF). Confirmed OK: ~40 km / 11-lift brochure product, Sky Express Campodolcino–Motta specs, season window 28 Nov 2025–12 Apr 2026, RidottoDì −30% Tue/Thu + listed 15% extras, night ski Larici 19:00–22:45 / €22 pattern, MadePark ~1800 m with mandatory helmet, D.L. 96/2025 helmet warning, Val di Lei / Canalone not to be sold as routinely open. Soft: exact day-listino euros, night-ski 2026 calendar, Canalone “December 2025” vs “when new plants ready” wording on destination pages—always open the live shop/board for your date. Driving times use Madesimo Turismo’s Como/Lecco ranges plus a winter buffer from Tremezzo; they are not GPS guarantees.",
        ],
      },
    ],
    faq: [
      {
        q: "How far is Madesimo from Tremezzo / Lake Como?",
        a: "Consorzio Turistico Madesimo lists Como–Madesimo at about 104 km / ~2 hours in normal conditions. From Tremezzo, add the western-shore segment and a winter buffer—plan a long mountain day, not a nearby resort shuttle.",
      },
      {
        q: "Should I park in Madesimo or Campodolcino?",
        a: "Day-trippers often do better at Campodolcino’s free Sky Express parking on SP1, then ride the underground funicular to Motta. Use Madesimo village when your rental, MadePark or night-ski plan is there and parking looks workable.",
      },
      {
        q: "Is Val di Lei or the Canalone open?",
        a: "Do not assume yes. Destination pages say Val di Lei and the Canalone freeride return when new plants are ready; some copy has also used “wait until December 2025 / modernisation” language. Re-check the live Skiarea board and madesimo.eu the morning you leave—never trust an old piste map.",
      },
      {
        q: "Do adults need a helmet in Madesimo?",
        a: "Yes for planning purposes. Madesimo Turismo warns that D.L. 96/2025 makes an approved helmet mandatory for everyone from winter 2025/26. Bring or rent one for each skier/snowboarder—including MadePark.",
      },
      {
        q: "What is RidottoDì?",
        a: "Official Tuesday/Thursday promotion: −30% on the daily skipass (online or at desks), plus published extras such as 15% off participating schools and rentals. High-crowd exclusions apply—verify the current Madesimo Turismo RidottoDì page before travel.",
      },
      {
        q: "Can I do night skiing after a day trip from Tremezzo?",
        a: "Not as a sane same-day plan. Night ski is Larici 19:00–22:45 on scheduled evenings at €22. Overnight in the valley, or treat it as a separate evening product after the calendar is confirmed.",
      },
      {
        q: "Can I reach Madesimo without a car from Tremezzo?",
        a: "Only with multiple seasonal connections via Chiavenna. For a same-day ski trip it is fragile; overnight in Valchiavenna is the honest car-free plan.",
      },
      {
        q: "Is Madesimo good for beginners?",
        a: "Yes if you pre-book rental and school at the same base and accept that a first day may be better as an overnight. Do not combine a dawn lake departure with an unbooked walk-up lesson on a Saturday.",
      },
      {
        q: "How is this different from madesimo.eu/en/experiences/ski-madesimo/?",
        a: "That page is the destination marketing overview. This guide keeps those official facts and adds SS36 timing from Tremezzo, Door A vs Door B parking, Sky Express PDF logic, RidottoDì −30% money math, and when night skiing or MadePark actually fit a Lake Como stay.",
      },
    ],
    officialSources: [
      { title: "Madesimo Turismo — skiing in Madesimo (EN)", url: "https://www.madesimo.eu/en/experiences/ski-madesimo/" },
      { title: "Madesimo Turismo — sciare a Madesimo (IT)", url: "https://www.madesimo.eu/it/esperienze/sciare-a-madesimo/" },
      { title: "Madesimo Turismo — RidottoDì 2025/2026", url: "https://www.madesimo.eu/it/inverno/ridottodi-martedi-e-giovedi-sulla-neve/" },
      { title: "Valchiavenna — Skiarea Valchiavenna overview", url: "https://www.valchiavenna.com/en/experience/skiarea-valchiavenna-tra-madesimo-e-campodolcino/" },
      { title: "Skiarea Valchiavenna — live lifts and tickets", url: "https://www.skiareavalchiavenna.it/en/" },
      { title: "Skiarea Valchiavenna — prices", url: "https://www.skiareavalchiavenna.it/prezzi/" },
      { title: "Sky Express — plant page", url: "https://www.skiareavalchiavenna.it/en/impianti/sky-express/" },
      { title: "Sky Express — winter 2025/26 timetable PDF", url: "https://www.skiareavalchiavenna.it/wp-content/uploads/2025/08/Sky-Express-Orario-Invernale-2025-2026_IT.pdf" },
      { title: "Madesimo Turismo — how to get there", url: "https://www.madesimo.eu/it/informazioni-utili/info-mobilita/" },
    ],
  },
  {
    slug: "lake-como-yellow-pages-transport-services",
    title: "Lake Como yellow pages: transport, help and useful services",
    seoTitle: "Lake Como Yellow Pages 2026: Tremezzo Transport",
    description:
      "Lake Como practical directory for Tremezzo: current bus, ferry and train links, pharmacies, tourist offices, emergency numbers and live schedules.",
    excerpt:
      "The useful Lake Como page to save offline: official timetable links, station strategy, emergencies and service categories without stale copied opening hours.",
    quickAnswer:
      "For Tremezzo, save three official transport sources: Navigazione Laghi for boats, ASF Autolinee line C110 for the western shore, and Trenord for rail from Como or Varenna-Esino. In an emergency call 112. For pharmacies, medical cover and tourist offices, use the official local directory or phone before travelling; opening hours and on-call rotations change, so this guide links live sources rather than freezing them.",
    category: "Directory",
    updated: "2026-10-05",
    hero: "/images/como/lake-como-directory.webp",
    heroAlt: "Bus and ferry connections around Lake Como",
    heroCreditUrl: "https://www.pexels.com/photo/scenic-view-of-lake-como-with-ferry-and-historic-buildings-31780481/",
    sections: [
      {
        heading: "Transport links to save",
        table: {
          columns: ["Need", "Official source", "Tremezzo strategy"],
          rows: [
            ["Ferry", "Navigazione Laghi", "Check date-bounded Como and central-lake PDFs."],
            ["Bus", "ASF Autolinee C110", "Como–Argegno–Tremezzo–Menaggio–Colico."],
            ["Train", "Trenord", "Use Como stations or Varenna-Esino plus ferry."],
            ["National rail", "Trenitalia", "Check long-distance ticket and disruption separately."],
          ],
        },
        paragraphs: [
          "The old route name C10 persists across blogs and maps. ASF’s 2026 official search lists C110 for Como–Argegno–Menaggio–Colico, with Tremezzo stops including Villa Carlotta and Piazza Trieste–Pontile.",
          "Tremezzina has no railway station. Como San Giovanni is useful for Milan and Switzerland; Como Nord Lago is convenient for the lakefront; Varenna-Esino is the east-shore rail gateway reached by ferry.",
        ],
      },
      {
        heading: "Do not copy a timetable into your notes",
        paragraphs: [
          "Ferry PDFs have explicit validity dates. ASF separates summer, reduced-August, winter, weekday and holiday patterns. Trenord can add engineering works and strike notices. The only robust workflow is to open the official source for the exact travel date.",
          "Take a screenshot only after confirming the PDF validity range. Save the return journey as well as the outward journey, and note the physical stop name—Tremezzo has several stops along the road.",
        ],
      },
      {
        heading: "Emergency and medical basics",
        bullets: [
          "112 — single European emergency number for police, fire and urgent medical help.",
          "116117 — non-emergency medical advice/continuity service where locally available; follow regional instructions.",
          "Nearest open pharmacy — search the ATS/local on-duty pharmacy listing for the date, then phone before travelling.",
          "Hospital choice — emergency dispatch should direct you; do not self-route a serious case using a travel blog.",
        ],
        paragraphs: [
          "Keep the accommodation address in Italian and share your map pin. Lake villages repeat street names and municipality labels; “Tremezzo” alone is not enough for a responder or taxi.",
        ],
      },
      {
        heading: "Tourist offices and attraction contacts",
        paragraphs: [
          "Use official attraction pages for opening hours and accessibility. Villa Carlotta publishes its annual calendar and transport instructions; Villa Monastero publishes month-by-month hours; FAI controls Balbianello booking and closure information.",
          "For local events and trail conditions, prefer the municipality, Lake Como destination portal or named refuge over scraped opening-hours sites. Phone on the day when the service is critical.",
        ],
      },
      {
        heading: "Groceries, taxis and late arrivals",
        paragraphs: [
          "Map the nearest grocery option before Sunday or a public holiday and do not assume a lakeside mini-market keeps city hours. For a late flight, pre-book a transfer or confirm the final rail–bus–ferry chain before buying the flight.",
          "Taxi supply is thinner than in Milan and ride-hailing availability is not guaranteed. Ask for the fare basis and pickup point in writing. A driver cannot wait in every narrow Regina-road location.",
        ],
      },
      {
        heading: "A host link worth saving",
        paragraphs: [
          "A managed apartment gives you one accountable contact for check-in, appliance questions and local logistics. Tulipani 11 lists direct host contact details, a 16:00 check-in, 10:00 check-out and no security deposit; confirm current terms on the booking page.",
          `See [Tulipani 11](${TULIPANI_URL}) or [all ComoStay accommodation](${COMO_STAY_URL}).`,
        ],
        images: tulipaniImages,
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 5 October 2026. Fixed: C110 replaces the old C10 label in current ASF material. Ferry and bus hours are not duplicated because both operators publish seasonal date ranges. Emergency number 112 is stable; pharmacy rotations and local office hours remain live-check items.",
        ],
      },
    ],
    faq: [
      { q: "Which bus serves Tremezzo in 2026?", a: "ASF Autolinee line C110 serves the western shore route through Tremezzo. Open the official timetable for your exact date." },
      { q: "Where is the nearest train station to Tremezzo?", a: "There is no station in Tremezzina. Common gateways are Como San Giovanni/Como Nord Lago or Varenna-Esino across the lake." },
      { q: "What is the emergency number in Italy?", a: "Call 112 for police, fire or urgent medical emergencies." },
      { q: "Can I rely on Google Maps for the last bus?", a: "Use it for orientation, then verify the exact trip in the official ASF timetable, including weekday, holiday and seasonal notes." },
      { q: "How do I find an open pharmacy?", a: "Use the current local/ATS on-duty pharmacy listing and call before setting out, especially at night or on a holiday." },
    ],
    officialSources: [
      { title: "ASF Autolinee — schedules", url: "https://www.asfautolinee.it/search-for-lines-and-schedules/?lang=en" },
      { title: "Navigazione Laghi — Lake Como", url: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/" },
      { title: "Trenord — journey planner", url: "https://www.trenord.it/en/" },
      { title: "European Commission — 112 in the EU", url: "https://digital-strategy.ec.europa.eu/en/policies/112" },
    ],
  },
  {
    slug: "best-things-to-do-lake-como-tremezzo",
    title: "Best things to do on Lake Como: 10 places from Tremezzo",
    seoTitle: "10 Best Things to Do in Lake Como 2026 from Tremezzo",
    description:
      "Ten top Lake Como attractions from Tremezzo with 2026 opening details, ferry logic, booking warnings and a realistic three-day itinerary.",
    excerpt:
      "Villa Carlotta, Balbianello, Bellagio, Varenna, Isola Comacina and the best viewpoints—ranked by travel logic, not just fame.",
    quickAnswer:
      "From Tremezzo, prioritize Villa Carlotta, Villa del Balbianello, the Greenway and one central-lake ferry day linking Bellagio with Varenna or Menaggio. Add Isola Comacina/Sacro Monte di Ossuccio for history and views, or Como city for architecture and rail access. Book Balbianello in advance, check each villa’s official 2026 calendar, and avoid trying to combine both arms of the lake in one rushed day.",
    category: "Things to do",
    updated: "2026-10-05",
    hero: "/images/como/lake-como-attractions.webp",
    heroAlt: "Lake Como view from Tremezzina",
    heroCreditUrl: "https://www.pexels.com/photo/elegant-villa-overlooking-lake-como-italy-38835089/",
    sections: [
      {
        heading: "1–3. The Tremezzina essentials",
        paragraphs: [
          "Villa Carlotta is the easiest major sight from Tremezzo and deserves more than a photo at the gate. Its official 2026 main season runs 20 March–18 October, 10:00–19:00, with the last ticket at 18:00; autumn and special winter dates use shorter hours.",
          "Villa del Balbianello occupies the Lenno promontory and is the sight most likely to punish improvised planning. Reserve through FAI, check closure days and decide whether to walk from Lenno or use the separately operated local boat.",
          "The Greenway del Lario links the villages, villas and lakefront. Walk a selected section instead of driving between adjacent stops on the congested Regina road.",
        ],
        table: {
          columns: ["Place", "Time to allow", "Booking risk"],
          rows: [
            ["Villa Carlotta", "2–3 hours", "Moderate in peak bloom/holidays"],
            ["Villa del Balbianello", "3–4 hours incl. access", "High; reserve in advance"],
            ["Greenway del Lario", "2 hours to full day", "None, but plan heat and return transport"],
          ],
        },
      },
      {
        heading: "4–6. Bellagio, Varenna and Menaggio",
        paragraphs: [
          "Treat the central-lake towns as a ferry circuit, not three car destinations. Bellagio is iconic and busiest; go early and walk beyond the shop lane. Varenna adds Villa Monastero and rail access. Menaggio has the calmest promenade and makes a useful lunch or transfer stop.",
          "Villa Monastero’s official 2026 hours vary by month: summer days run later, while shoulder-season house access can close on Tuesdays. Check the month-specific page rather than a generic “open daily” snippet.",
        ],
      },
      {
        heading: "7–8. Isola Comacina and Sacro Monte di Ossuccio",
        paragraphs: [
          "Isola Comacina is the lake’s only island and pairs naturally with Ossuccio and the Greenway. Boat operation and archaeological access are seasonal, so confirm locally before structuring the whole day around landing on the island.",
          "The Sacro Monte di Ossuccio route climbs past devotional chapels to the sanctuary and a broad lake view. It is a cultural climb with real elevation, not a flat extension of the waterfront.",
        ],
      },
      {
        heading: "9–10. Como city and one mountain viewpoint",
        paragraphs: [
          "Como city earns a day when you want the cathedral, historic centre, Volta heritage and Brunate funicular rather than another villa. It is also the western shore’s main rail gateway.",
          "For a close mountain view, choose San Martino above Griante if conditions are dry and your group is comfortable with a steep path. Do not add it after a full high-mountain hike simply because it appears short on a map.",
        ],
      },
      {
        heading: "A realistic three-day plan",
        table: {
          columns: ["Day", "Morning", "Afternoon"],
          rows: [
            ["1 — Tremezzo", "Villa Carlotta", "Greenway through Lenno/Tremezzo"],
            ["2 — Central lake", "Early Bellagio", "Varenna + Villa Monastero, ferry return"],
            ["3 — Lenno/Ossuccio", "Reserved Balbianello visit", "Isola Comacina or Sacro Monte"],
          ],
        },
        paragraphs: [
          "Swap Como city into day three in poor hiking weather. Do not stack Balbianello, Bellagio and Varenna on one day unless your goal is queues and transfer stress.",
        ],
      },
      {
        heading: "Why Tremezzo works as a base",
        paragraphs: [
          "Tremezzo puts Villa Carlotta, the Greenway and central-lake ferry access around the same base. Tulipani 11 is aimed at up to four guests and provides two bedrooms, two bathrooms, a balcony, kitchen, washing machine, air conditioning and Wi-Fi.",
          `For this exact home, view [Apartment Tulipani 11](${TULIPANI_URL}). If it is unavailable, [browse ComoStay’s full Lake Como collection](${COMO_STAY_URL}) rather than leaving the guide ecosystem.`,
        ],
        images: tulipaniImages,
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 5 October 2026 against Villa Carlotta, Villa Monastero, Navigazione Laghi and Italy’s official tourism portal. Opening hours are stated only where a 2026 official calendar was available; Balbianello and seasonal island operations remain live-check items.",
        ],
      },
    ],
    faq: [
      { q: "What should I not miss on Lake Como?", a: "From Tremezzo, the strongest first trip is Villa Carlotta, Balbianello, the Greenway and a ferry day to Bellagio and Varenna." },
      { q: "Do I need to book Villa del Balbianello?", a: "Yes, advance booking is strongly recommended. Use FAI’s official calendar and allow time to reach the villa from Lenno." },
      { q: "Is Tremezzo a good place to stay without a car?", a: "Yes if you plan around ferries and C110 buses. Check seasonal schedules and the walking distance from your exact apartment to the pier and stop." },
      { q: "Can I visit Bellagio and Varenna in one day?", a: "Yes. Start early, use the central-lake ferry and protect the final return sailing. Add Menaggio only if the timetable leaves comfortable margins." },
      { q: "How many days do I need for Lake Como?", a: "Three full days cover Tremezzina, a central-lake circuit and either Como city or Ossuccio without turning the trip into continuous transfers." },
    ],
    officialSources: [
      { title: "Villa Carlotta — 2026 visit information", url: "https://www.villacarlotta.it/en/visit/" },
      { title: "Villa Monastero — opening hours and tickets", url: "https://www.villamonastero.eu/en/opening-hours-ticket/" },
      { title: "Italia.it — Lake Como", url: "https://www.italia.it/en/lombardy/lake-como" },
      { title: "Lake Como — Greenway del Lario", url: "https://www.lakecomo.is/en/experience/greenway-del-lario/" },
    ],
  },
];

export function getComoGuide(slug: string): ComoGuide | undefined {
  return COMO_GUIDES.find((guide) => guide.slug === slug);
}
