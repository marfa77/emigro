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

const COMO_STAY_URL =
  "https://comostay.net/en/?utm_source=emigro&utm_medium=guide&utm_campaign=lake_como_2026";
const TULIPANI_URL =
  "https://comostay.net/en/apartment-tulipani-11---tremezzo?utm_source=emigro&utm_medium=guide&utm_campaign=lake_como_2026";

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
    title: "Skiing in Madesimo from Lake Como: a realistic trip plan",
    seoTitle: "Madesimo Ski Trip from Lake Como: 2026 Guide",
    description:
      "Plan a Madesimo ski trip from Tremezzo and Lake Como: drive, public transport reality, parking, lifts, rentals, beginners and weather checks.",
    excerpt:
      "Madesimo is a real Alpine ski area, not a quick lakeside excursion. Here is the practical route, what to verify, and when an overnight stay beats a rushed day trip.",
    quickAnswer:
      "Madesimo is the most practical substantial ski area north of Lake Como, but from Tremezzo it should be treated as a long mountain outing. Driving via the north lake and SS36 is normally the workable day-trip option; public transport requires multiple connections and is better suited to an overnight plan. Check Skiarea Valchiavenna’s live lift status, snow, road conditions and pass prices before departure—especially because Val di Lei is currently unavailable during lift redevelopment.",
    category: "Winter",
    updated: "2026-10-05",
    hero: "/images/como/madesimo-ski.webp",
    heroAlt: "Winter mountain scene in Madesimo",
    heroCreditUrl: "https://www.pexels.com/photo/snowmobiler-in-snowy-madesimo-mountains-36770831/",
    sections: [
      {
        heading: "Is Madesimo a day trip from Tremezzo?",
        paragraphs: [
          "Yes by car for an early-starting group, but it is not a spontaneous half day. The route follows the western/northern lake toward the SS36 and Valchiavenna before climbing to Madesimo. Winter traffic, snow controls and a slow lakeshore section make arrival time variable.",
          "For beginners collecting equipment, arranging a lesson and learning the base area, an overnight stay removes the pressure of the return drive. Experienced skiers can make a day work by pre-booking rentals and leaving before dawn.",
        ],
        bullets: [
          "Check road weather and Italian winter-equipment requirements before leaving.",
          "Do not schedule a non-refundable lesson around a summer driving-time estimate.",
          "Keep chains accessible rather than under all the luggage.",
          "If the upper road is difficult, Campodolcino and the Sky Express may be the operational alternative—verify live status first.",
        ],
      },
      {
        heading: "What the ski area actually offers",
        paragraphs: [
          "The official destination describes more than 40 km of alpine slopes between Madesimo and Campodolcino, with village access, snowmaking and terrain for different levels. The underground Sky Express connects Campodolcino with Motta in about three minutes and gains more than 600 metres.",
          "The operator also states that Val di Lei is currently inaccessible during lift redevelopment. Old piste maps and blog posts can therefore promise terrain that is not available. Always open the live operating map rather than buying based on historic statistics.",
        ],
      },
      {
        heading: "A workable ski-day timeline",
        table: {
          columns: ["Time", "Plan", "Why"],
          rows: [
            ["Before 06:30", "Leave Tremezzo", "Protects against lake-road and mountain delays."],
            ["08:30–09:00", "Park, collect pre-booked equipment", "Rental queues consume the best snow hours."],
            ["09:00–12:30", "Ski the suitable open sector", "Follow live lift status, not a saved map."],
            ["12:30–13:15", "Early lunch", "Avoids the peak restaurant queue."],
            ["13:15–15:30", "Final ski block", "Leave energy and daylight for the drive."],
            ["By 16:00", "Return equipment and depart", "Winter descent and lake traffic are slower after dark."],
          ],
        },
        paragraphs: [
          "This is a planning framework, not an operating timetable. Lift hours and last uplift vary with date and conditions. Confirm them on the official ski-area channel on the morning itself.",
        ],
      },
      {
        heading: "Beginners, families and rentals",
        paragraphs: [
          "Book a school meeting point and rental shop in the same base sector. “Madesimo” and “Campodolcino” access are connected within the ski area when operating, but they are not interchangeable meeting points when a child is waiting for an instructor.",
          "Send heights, weights, shoe sizes and ability levels in advance. Ask whether helmets and damage cover are included. A family with first-time skiers usually gains more from a two-day plan than from paying for a pass while spending the morning in fitting and lesson queues.",
        ],
      },
      {
        heading: "Public transport: possible does not mean practical",
        paragraphs: [
          "The rail gateway is Chiavenna, followed by local mountain transport. From Tremezzo, reaching that chain can require a lakeshore bus and additional connections. Timings are seasonal and a missed final connection can strand a day trip.",
          "Use the official regional journey planners for your exact date and consider staying in Valchiavenna. Do not publish or rely on a permanent “Madesimo bus timetable” copied from a single winter season.",
        ],
      },
      {
        heading: "Where to sleep before and after the ski day",
        paragraphs: [
          "Tulipani 11 makes sense when skiing is one part of a longer Lake Como holiday: four guests, two bedrooms, two bathrooms, a kitchen, washing machine, heating and parking on street. For consecutive ski days, move up-valley instead of repeating the drive.",
          `Book the lake portion at [Tulipani 11](${TULIPANI_URL}), or use [ComoStay](${COMO_STAY_URL}) to compare other Lake Como bases.`,
        ],
        images: tulipaniImages,
      },
      {
        heading: "Fact-check note",
        paragraphs: [
          "Checked 5 October 2026 against Valchiavenna Turismo. Confirmed: the area advertises more than 40 km of slopes and the Campodolcino–Motta Sky Express; fixed: Val di Lei should not be presented as currently skiable while redevelopment is in progress. Prices and opening dates remain volatile and must be checked live.",
        ],
      },
    ],
    faq: [
      { q: "How far is Madesimo from Lake Como?", a: "Travel time depends strongly on your Lake Como base, traffic and winter roads. From Tremezzo, plan it as a long mountain day rather than a nearby resort shuttle." },
      { q: "Can I reach Madesimo without a car?", a: "It is possible through Chiavenna and local transport on some dates, but multiple connections make an overnight plan safer than a same-day ski trip." },
      { q: "Is Madesimo good for beginners?", a: "The area offers varied terrain and ski schools. Beginners should pre-book a lesson and rental at the same base point and verify which sectors are open." },
      { q: "Is Val di Lei open?", a: "The official destination currently says Val di Lei is unavailable during lift redevelopment. Re-check the live ski-area notice before travel." },
      { q: "Do I need snow chains?", a: "Check the current road order and forecast. Italian winter equipment rules apply seasonally, and mountain conditions can require chains even when the lake is clear." },
    ],
    officialSources: [
      { title: "Valchiavenna — official ski-area overview", url: "https://www.valchiavenna.com/en/experience/skiarea-valchiavenna-tra-madesimo-e-campodolcino/" },
      { title: "Valchiavenna — winter information", url: "https://www.valchiavenna.com/en/valchiavenna-in-winter.html" },
      { title: "Valchiavenna — tourist offices and contacts", url: "https://www.valchiavenna.com/en/info-contacts/" },
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
