import { comoStayUrl } from "@/lib/italy/como-guides";

export type ComoPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  creditUrl: string;
  license: string;
  licenseUrl: string;
  width: number;
  height: number;
};

export type ComoMapPoint = {
  id: number;
  label: string;
  description: string;
  x: number;
  y: number;
};

export type ComoMapRoute = {
  label: string;
  points: string;
  color: string;
  dashed?: boolean;
};

export type ComoGuideMap = {
  baseSrc: string;
  alt: string;
  caption: string;
  officialLabel: string;
  officialUrl: string;
  points: ComoMapPoint[];
  routes: ComoMapRoute[];
};

export type ComoGuideMedia = {
  photos: ComoPhoto[];
  sectionPhotos: Record<string, string[]>;
  map: ComoGuideMap;
};

export type ComoEditorialAsset = {
  id: string;
  src: string;
  credit: string;
  creditUrl: string;
  license: string;
  licenseUrl: string;
  width: number;
  height: number;
};

/** Accepted Commons originals. Values are copied from scripts/output/italy-como-media-audit.json. */
export const COMO_EDITORIAL_ASSETS: ComoEditorialAsset[] = [
  {
    id: "san-martino",
    src: "/images/como/editorial/hiking-san-martino.webp",
    credit: "Paebi",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Griante_San_Martino.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    width: 1800,
    height: 1300,
  },
  {
    id: "monte-grona",
    src: "/images/como/editorial/hiking-monte-grona.webp",
    credit: "Mænsard vokser",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Cima_del_Monte_Grona_1.736_m_s.l.m,_vista_da_sud_con_betulle_autunnali_-_2015-10-25,_Plesio_(Como).JPG",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1011,
  },
  {
    id: "monte-crocione",
    src: "/images/como/editorial/hiking-monte-crocione.webp",
    credit: "Kaitu",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Panorama_dal_Pizzo_della_Croce_(6).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1350,
  },
  {
    id: "sacro-monte",
    src: "/images/como/editorial/hiking-greenway-ossuccio.webp",
    credit: "Carlo Dell'Orto",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Sacro_Monte_di_Ossuccio_(Como)_02.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1200,
  },
  {
    id: "madesimo-larici",
    src: "/images/como/editorial/madesimo-larici.webp",
    credit: "Mateus2019",
    creditUrl: "https://commons.wikimedia.org/wiki/File:ITA_%E2%80%94_Lombardia_%E2%80%94_Provincia_di_Sondrio_%E2%80%94_Madesimo_%E2%80%94_Larici_(Talstation)_2020.JPG",
    license: "CC BY 3.0 de",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/de/deed.en",
    width: 1800,
    height: 1350,
  },
  {
    id: "madesimo-piste",
    src: "/images/como/editorial/madesimo-piste.webp",
    credit: "Sandra Grampa",
    creditUrl: "https://commons.wikimedia.org/wiki/File:In_ovovia_a_Madesimo.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1138,
  },
  {
    id: "madesimo-groppera",
    src: "/images/como/editorial/madesimo-groppera.webp",
    credit: "Pier B.",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Groppera_e_Canalone_di_Madesimo_-_panoramio.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    width: 1800,
    height: 1347,
  },
  {
    id: "madesimo-motta",
    src: "/images/como/editorial/madesimo-alpe-motta.webp",
    credit: "FedericoVis",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Mountain_view,_Alpe_Motta-Madesimo,_Italy.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1600,
    height: 1200,
  },
  {
    id: "madesimo-road",
    src: "/images/como/editorial/madesimo-ss36.webp",
    credit: "Olgierd Rudak",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Strada_Statale_36_Passo_dello_Spluga_(2025-08-28_1).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1350,
  },
  {
    id: "ferry-lario",
    src: "/images/como/editorial/ferry-cadenabbia-traghetto.webp",
    credit: "Eustace Bagge",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ferry_Lario_on_Lake_Como_(Cadenabbia)_-_June_2020.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    width: 1800,
    height: 1200,
  },
  {
    id: "ferry-triangle",
    src: "/images/como/editorial/ferry-central-triangle.webp",
    credit: "Daniel Case",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bellagio_and_Lake_Como_from_Menaggio-Varenna_ferry.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    width: 1800,
    height: 813,
  },
  {
    id: "ferry-bellagio",
    src: "/images/como/editorial/ferry-bellagio-lario.webp",
    credit: "Xavier Caré",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Bellagio_-_Lario_Ferry_on_Lake_Como.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1154,
  },
  {
    id: "villa-carlotta",
    src: "/images/como/editorial/attraction-villa-carlotta.webp",
    credit: "Ray in Manila",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Villa_Carlotta,_Tremezzo,_Lake_Como-2.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    width: 1800,
    height: 1091,
  },
  {
    id: "villa-balbianello",
    src: "/images/como/editorial/attraction-balbianello.webp",
    credit: "Jeroen Komen",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Villa_del_Balbianello_Lago_di_Como_featured_in_Casino_Royale_and_in_Star_Wars_(20063743160).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    width: 1800,
    height: 1200,
  },
  {
    id: "villa-monastero",
    src: "/images/como/editorial/attraction-villa-monastero.webp",
    credit: "Tobias1984",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Sea_facing_side_of_Villa_Monastero,_Varenna.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    width: 1800,
    height: 1350,
  },
  {
    id: "isola-comacina",
    src: "/images/como/editorial/attraction-isola-comacina.webp",
    credit: "LigaDue",
    creditUrl: "https://commons.wikimedia.org/wiki/File:IsolaComacinaPanorama1.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 1197,
  },
  {
    id: "varenna",
    src: "/images/como/editorial/attraction-varenna.webp",
    credit: "Xavier Caré",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Varenna_-_Coast,_hotel_Olivedo.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    width: 1800,
    height: 919,
  },
];

const GREENWAY = "#1f7a4d";
const MARTINO = "#c47b2b";
const CROCIONE = "#9a3b3b";
const GRONA = "#2c4c8c";
const PASSENGER = "#f6f1e6";
const TRAGHETTO = "#e2a123";
const BUS = "#c45c26";
const RAIL = "#355f86";
const SPINE = "#1f4e79";
const MOTTA_ROUTE = "#2f6f4e";
const CLOSED = "#8a8178";

/** Como–Colico passenger centerline, kept in the water of the ferry and transport plates. */
const PASSENGER_ROUTE =
  "315,580 331,560 343,540 348,530 352,526 360,522 373,520 391,500 396,480 391,460 389,440 387,420 397,400 420,390 433,380 474,350 505,332 518,320 514,290 521,260 534,230 543,200 548,170 570,120 595,100 615,80";

function editorialPhoto(id: string, alt: string, caption: string): ComoPhoto {
  const asset = COMO_EDITORIAL_ASSETS.find((item) => item.id === id);
  if (!asset) throw new Error(`Missing Como editorial asset: ${id}`);
  return {
    src: asset.src,
    alt,
    caption,
    credit: asset.credit,
    creditUrl: asset.creditUrl,
    license: asset.license,
    licenseUrl: asset.licenseUrl,
    width: asset.width,
    height: asset.height,
  };
}

function stayMediaUrl(guideSlug: string, destination: "tulipani" | "inventory"): string {
  return comoStayUrl(guideSlug, "property-image", destination);
}

function stayPhoto(
  guideSlug: string,
  which: "balcony" | "living",
  alt: string,
  caption: string,
): ComoPhoto {
  return {
    src: which === "balcony" ? "/images/como/tulipani-11-balcony.webp" : "/images/como/tulipani-11-living.webp",
    alt,
    caption,
    credit: "ComoStay · Tulipani 11",
    creditUrl: stayMediaUrl(guideSlug, "tulipani"),
    license: "ComoStay property photography",
    licenseUrl: stayMediaUrl(guideSlug, "inventory"),
    width: 1200,
    height: 900,
  };
}

/** photos[0] is the subject hero for each guide. */
export const COMO_GUIDE_MEDIA: Record<string, ComoGuideMedia> = {
  "lake-como-ferry-guide-timetables": {
    photos: [
      editorialPhoto(
        "ferry-bellagio",
        "Lario ferry at the Bellagio waterfront on Lake Como",
        "The vehicle ferry Lario at the Bellagio waterfront. Hotel signs on the buildings are part of the street scene.",
      ),
      editorialPhoto(
        "ferry-triangle",
        "Bellagio point seen from the Menaggio–Varenna ferry",
        "Lake Como from the Menaggio–Varenna ferry, looking toward the wooded Bellagio point. The view is wide and slightly hazy, not a close pier timetable.",
      ),
      editorialPhoto(
        "villa-carlotta",
        "Lake façade of Villa Carlotta at Tremezzo",
        "Lake façade, gardens and landing of Villa Carlotta at Tremezzo, beside the passenger-boat shore. A small waterfront sign is part of the scene.",
      ),
      editorialPhoto(
        "varenna",
        "Hotel Olivedo and the ferry landing at Varenna",
        "Hotel Olivedo and the ferry landing at Varenna. The dock towers mark the east-shore stop, not the railway station itself.",
      ),
      editorialPhoto(
        "villa-balbianello",
        "Aerial view of Villa del Balbianello on the Lenno peninsula",
        "Aerial of Villa del Balbianello on the Lenno peninsula, with the loggia and gardens. A small aircraft-window edge remains in the corner. The villa boat, when it runs, is separate from the Navigazione Laghi timetable.",
      ),
      editorialPhoto(
        "ferry-lario",
        "Car ferry Lario with an open vehicle deck at Cadenabbia",
        "Vehicle ferry Lario at Cadenabbia with the car deck open. This is the Traghetto, not a Tremezzo passenger boat.",
      ),
      stayPhoto(
        "lake-como-ferry-guide-timetables",
        "balcony",
        "Balcony at Apartment Tulipani 11 in Tremezzo",
        "Balcony at Tulipani 11 in a quiet part of Tremezzo. The listing puts the apartment 1.2 km from both the bus and the port.",
      ),
      stayPhoto(
        "lake-como-ferry-guide-timetables",
        "living",
        "Living room at Apartment Tulipani 11 in Tremezzo",
        "Living room at Tulipani 11, a two-bedroom Tremezzo apartment for four, for the evening after the last useful boat.",
      ),
    ],
    sectionPhotos: {
      "The four stops that matter from Tremezzo": [
        "/images/como/editorial/ferry-central-triangle.webp",
        "/images/como/editorial/attraction-villa-carlotta.webp",
      ],
      "Three useful day-trip patterns": [
        "/images/como/editorial/ferry-bellagio-lario.webp",
        "/images/como/editorial/attraction-varenna.webp",
        "/images/como/editorial/attraction-balbianello.webp",
      ],
      "Tickets, cars and accessibility": ["/images/como/editorial/ferry-cadenabbia-traghetto.webp"],
      "Stay where the central lake is usable": [
        "/images/como/tulipani-11-balcony.webp",
        "/images/como/tulipani-11-living.webp",
      ],
    },
    map: {
      baseSrc: "/images/como/maps/ferries-base.webp",
      alt: "Illustrated planning map of Lake Como passenger boats and car ferries",
      caption:
        "Planning overview of passenger boats and the central-lake Traghetto. The base is illustrated, not a timetable. Seasonal sailings stay on the Navigazione Laghi page.",
      officialLabel: "Navigazione Laghi — Lake Como timetables",
      officialUrl: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/",
      points: [
        {
          id: 1,
          label: "Tremezzo",
          x: 336,
          y: 430,
          description:
            "Tremezzo has a passenger pier in the village. Not every sailing calls, and a boat here is not the Traghetto. Frequency changes with the seasonal Navigazione Laghi timetable.",
        },
        {
          id: 2,
          label: "Cadenabbia Traghetto",
          x: 346,
          y: 376,
          description:
            "Cadenabbia is the nearby Traghetto stop for the central-lake vehicle ferry serving Bellagio, Menaggio and Varenna. Pedestrians can board. Only sailings marked Traghetto take cars, and space is finite.",
        },
        {
          id: 3,
          label: "Bellagio",
          x: 500,
          y: 398,
          description:
            "Bellagio sits on the promontory between the southern arms. The frequent link from the west shore uses Cadenabbia when that ferry is running. Weather and port traffic can still suspend it.",
        },
        {
          id: 4,
          label: "Varenna",
          x: 568,
          y: 330,
          description:
            "Varenna is the east-shore stop on the central triangle and the ferry side of the Varenna-Esino rail gateway. The train does not bring you back to the western shore.",
        },
        {
          id: 5,
          label: "Menaggio",
          x: 468,
          y: 306,
          description:
            "Menaggio is a Traghetto stop on the west side of the northern arm, used with Bellagio and Varenna. It is a different pier from the Tremezzo passenger stop.",
        },
        {
          id: 6,
          label: "Lenno",
          x: 346,
          y: 476,
          description:
            "Lenno has passenger-boat calls for Villa del Balbianello and the Greenway. Not every service stops. The villa’s own boat, when it runs, is a separate local service.",
        },
        {
          id: 7,
          label: "Como",
          x: 286,
          y: 608,
          description:
            "Como is the long passenger-boat ride to the city and its rail connections. Fast and slow services differ. The land fallback is ASF line C110, not another boat.",
        },
      ],
      routes: [
        { label: "Como–Colico passenger boats", points: PASSENGER_ROUTE, color: PASSENGER },
        { label: "Traghetto Cadenabbia–Bellagio", points: "415,385 450,392", color: TRAGHETTO, dashed: true },
        { label: "Traghetto Bellagio–Varenna", points: "528,352 545,338", color: TRAGHETTO, dashed: true },
        { label: "Traghetto Menaggio–Varenna", points: "505,318 538,324", color: TRAGHETTO, dashed: true },
      ],
    },
  },
  "lake-como-hiking-best-trails": {
    photos: [
      editorialPhoto(
        "san-martino",
        "Church of San Martino on the cliff above Griante",
        "Church of San Martino on the cliff above Griante, with the tower plaque on the building. People on the path are incidental. The descent is steep when the stone is wet.",
      ),
      editorialPhoto(
        "sacro-monte",
        "Chapel interior at Sacro Monte di Ossuccio",
        "Chapel interior at Sacro Monte di Ossuccio, with its statue groups. This is the sanctuary climb above the village, not the lakeside Greenway.",
      ),
      editorialPhoto(
        "villa-carlotta",
        "Villa Carlotta where the Greenway passes Tremezzo",
        "Lake façade of Villa Carlotta at Tremezzo. The Greenway passes the villa, and this frame is the building and garden, not the path surface.",
      ),
      editorialPhoto(
        "monte-crocione",
        "Summit view from Pizzo della Croce on Monte Crocione",
        "View from the summit area of Pizzo della Croce on the Monte Crocione ridge, looking over the lake toward a summit marker. This is not a photograph of the mountain taken from the shore.",
      ),
      editorialPhoto(
        "monte-grona",
        "Monte Grona summit and autumn birches from the south",
        "Rocky summit of Monte Grona and autumn birches, seen from the south in October 2015. This is not a summer conditions report.",
      ),
      editorialPhoto(
        "varenna",
        "Varenna ferry landing used toward Sentiero del Viandante",
        "Hotel Olivedo and the Varenna ferry landing, the east-shore gateway toward Sentiero del Viandante. This frame is the waterfront, not the trail.",
      ),
      stayPhoto(
        "lake-como-hiking-best-trails",
        "balcony",
        "Balcony at Apartment Tulipani 11 in Tremezzo",
        "Balcony at Tulipani 11 in Tremezzo, a four-guest base with a kitchen and washing machine after a wet or dusty trail.",
      ),
      stayPhoto(
        "lake-como-hiking-best-trails",
        "living",
        "Living room at Apartment Tulipani 11 in Tremezzo",
        "Living room at Tulipani 11. The apartment sleeps four in two bedrooms and has two bathrooms, air conditioning and Wi-Fi.",
      ),
    ],
    sectionPhotos: {
      "1. Greenway del Lario": [
        "/images/como/editorial/hiking-greenway-ossuccio.webp",
        "/images/como/editorial/attraction-villa-carlotta.webp",
      ],
      "2. San Martino above Griante": ["/images/como/editorial/hiking-san-martino.webp"],
      "3. Monte Crocione": ["/images/como/editorial/hiking-monte-crocione.webp"],
      "4. Rifugio Menaggio and Monte Grona": ["/images/como/editorial/hiking-monte-grona.webp"],
      "5. Sentiero del Viandante": ["/images/como/editorial/attraction-varenna.webp"],
      "A practical hiking base in Tremezzo": [
        "/images/como/tulipani-11-balcony.webp",
        "/images/como/tulipani-11-living.webp",
      ],
    },
    map: {
      baseSrc: "/images/como/maps/hiking-base.webp",
      alt: "Illustrated planning map of Lake Como hikes on the western shore",
      caption:
        "Planning overview of the west-shore walks, from the Greenway to Crocione and Grona. The base is illustrated, not a surveyed GPX. Conflicting Greenway ascent figures are left out of the drawing.",
      officialLabel: "Regione Lombardia — Greenway route",
      officialUrl: "https://edt.in-lombardia.it/en/tours/greenway-lago-di-como",
      points: [
        {
          id: 1,
          label: "Colonno",
          x: 292,
          y: 598,
          description:
            "Colonno, at Via Cappella, is the southern start of the Greenway. Regione Lombardia lists the walk to Griante as easy, about 10.5 km and 3 hours 30 minutes. Ascent figures disagree across official pages, so none is marked. The path crosses the state road and includes steps.",
        },
        {
          id: 2,
          label: "Ossuccio / Lenno",
          x: 286,
          y: 522,
          description:
            "Ossuccio and Lenno are Greenway villages between Sala Comacina and Mezzegra. The official stage notes a careful crossing of the state road, and Ossuccio’s chapel path climbs toward the sanctuary. Lenno’s pier is a boat exit, not a mountain trailhead.",
        },
        {
          id: 3,
          label: "Tremezzo / Griante",
          x: 358,
          y: 452,
          description:
            "Tremezzo and Cadenabbia di Griante are the northern end of the Greenway, past Villa Carlotta to the lakeside finish near the bus. Regione Lombardia rates the full route easy. The local hazard is road crossings and intermittent shade.",
        },
        {
          id: 4,
          label: "San Martino",
          x: 302,
          y: 398,
          description:
            "San Martino is the church on the rock wall above Griante. This guide rates the out-and-back moderate: short, but steep, on stone and woodland paths. No duration is given on the Greenway page. Wet stone on the descent is the main hazard.",
        },
        {
          id: 5,
          label: "Rifugio Venini",
          x: 228,
          y: 398,
          description:
            "Rifugio Venini is a higher start for Monte Crocione behind Tremezzina. It reduces the climb from the lake but adds a narrow seasonal drive and does not remove navigation risk. Lake-level, Boffalora and Venini starts are different hikes, so no single distance is shown.",
        },
        {
          id: 6,
          label: "Monte Crocione",
          x: 208,
          y: 328,
          description:
            "Monte Crocione is the hard ridge directly behind Tremezzina. Treat a lake-level start as a full mountain day and go only in stable weather with an offline CAI track. The summit ridge is exposed, and low cloud erases the landmarks.",
        },
        {
          id: 7,
          label: "Breglia",
          x: 468,
          y: 228,
          description:
            "Breglia is the inland trailhead above Menaggio for Rifugio Menaggio and Monte Grona. This guide rates the route hard and a half or full day. Road access, the refuge and the return bus are seasonal.",
        },
        {
          id: 8,
          label: "Rifugio Menaggio",
          x: 408,
          y: 168,
          description:
            "Rifugio Menaggio stands under Monte Grona and is the decision point before the summit. Reaching the refuge is already a steep hike, and continuing is materially harder. Opening days are seasonal, so do not assume food or water.",
        },
        {
          id: 9,
          label: "Monte Grona",
          x: 388,
          y: 114,
          description:
            "Monte Grona is the higher objective above Rifugio Menaggio. This guide rates it hard. The upper mountain is steeper and more exposed than the refuge walk, and fresh snow turns it into a winter route.",
        },
      ],
      routes: [
        {
          label: "Greenway del Lario",
          points: "292,598 286,560 286,522 318,488 340,468 358,452",
          color: GREENWAY,
        },
        { label: "San Martino", points: "358,452 330,424 302,398", color: MARTINO },
        { label: "Sasso extension", points: "302,398 270,376", color: MARTINO, dashed: true },
        { label: "Monte Crocione", points: "228,398 218,362 208,328", color: CROCIONE },
        { label: "Monte Grona", points: "468,228 438,198 408,168 388,114", color: GRONA },
      ],
    },
  },
  "madesimo-ski-trip-from-lake-como": {
    photos: [
      editorialPhoto(
        "madesimo-piste",
        "Groomed Madesimo runs seen through a gondola window",
        "Groomed runs and ski tracks seen through a Madesimo gondola window, with a reflection in the sky. The runs are readable, and the frame is not a live lift-status report.",
      ),
      editorialPhoto(
        "madesimo-larici",
        "Lower Larici gondola station in Madesimo in summer",
        "Lower Larici gondola station in Madesimo in the green season, with cabins on the line. Banners on the building are local signage. This is not a snow photograph and not a live lift-status report.",
      ),
      editorialPhoto(
        "madesimo-groppera",
        "Snow couloir above Madesimo with no ski lifts",
        "Snow couloir and peak above Madesimo, with no lifts in the frame. Val di Lei and the Groppera infrastructure are unavailable during lift redevelopment.",
      ),
      editorialPhoto(
        "madesimo-motta",
        "Summer pastures and stone huts at Alpe Motta",
        "Summer pastures and stone huts at Alpe Motta above Madesimo. The place is correct, and the frame is not a groomed winter piste or a report of which lifts are running.",
      ),
      editorialPhoto(
        "madesimo-road",
        "Wet SS36 at Passo dello Spluga above Madesimo",
        "Wet Strada Statale 36 at Passo dello Spluga in August 2025, with fog on the slopes. This is the pass above Madesimo, not the village street, and not a live road report.",
      ),
      editorialPhoto(
        "villa-carlotta",
        "Villa Carlotta at Tremezzo before the drive north",
        "Lake façade of Villa Carlotta at Tremezzo, the shore a ski day leaves behind for the drive north. This frame is not the Madesimo ski area.",
      ),
      stayPhoto(
        "madesimo-ski-trip-from-lake-como",
        "balcony",
        "Balcony at Apartment Tulipani 11 in Tremezzo",
        "Balcony at Tulipani 11 in Tremezzo. It suits a lake holiday that includes one ski day; consecutive ski days are better overnight in the valley.",
      ),
      stayPhoto(
        "madesimo-ski-trip-from-lake-como",
        "living",
        "Living room at Apartment Tulipani 11 in Tremezzo",
        "Living room at Tulipani 11, with two bedrooms, two bathrooms, a kitchen and heating for the nights before or after Madesimo.",
      ),
    ],
    sectionPhotos: {
      "Is Madesimo a day trip from Tremezzo?": [
        "/images/como/editorial/madesimo-ss36.webp",
        "/images/como/editorial/attraction-villa-carlotta.webp",
      ],
      "Two doors into the ski area: Madesimo vs Campodolcino": [
        "/images/como/editorial/madesimo-larici.webp",
        "/images/como/editorial/madesimo-alpe-motta.webp",
      ],
      "What the ski area actually offers": [
        "/images/como/editorial/madesimo-piste.webp",
        "/images/como/editorial/madesimo-groppera.webp",
      ],
      "Where to sleep before and after the ski day": [
        "/images/como/tulipani-11-balcony.webp",
        "/images/como/tulipani-11-living.webp",
      ],
    },
    map: {
      baseSrc: "/images/como/maps/madesimo-base.webp",
      alt: "Illustrated planning map from Tremezzo up the valley to Madesimo",
      caption:
        "Planning overview of the valley route from Tremezzo to Madesimo. The base is illustrated, not a live snow or lift report. The dashed mark is closed Groppera and Val di Lei infrastructure, not a named summit.",
      officialLabel: "Valchiavenna — Skiarea Valchiavenna",
      officialUrl: "https://www.valchiavenna.com/en/experience/skiarea-valchiavenna-tra-madesimo-e-campodolcino/",
      points: [
        {
          id: 1,
          label: "Tremezzo",
          x: 398,
          y: 566,
          description:
            "Tremezzo is the lake start for a car day via the north shore and SS36. This guide treats it as a long mountain outing. No driving time is fixed here, because winter traffic changes it.",
        },
        {
          id: 2,
          label: "Colico",
          x: 546,
          y: 392,
          description:
            "Colico is the north-lake point where the route leaves the shore for Valchiavenna. On this plate it sits at the illustrated lake tip, not at a measured road junction.",
        },
        {
          id: 3,
          label: "Chiavenna",
          x: 556,
          y: 342,
          description:
            "Chiavenna is the rail gateway for the public-transport chain toward Madesimo. From Tremezzo that chain needs extra connections and is a weak same-day plan. No permanent bus timetable is copied here.",
        },
        {
          id: 4,
          label: "Campodolcino / Sky Express",
          x: 566,
          y: 288,
          description:
            "Campodolcino is the lower access. The official ski area says the underground Sky Express links Campodolcino with Motta in about three minutes and gains more than 600 metres when it is running. Confirm live status on the day.",
        },
        {
          id: 5,
          label: "Madesimo / Larici",
          x: 570,
          y: 246,
          description:
            "Madesimo village and the Larici side of the ski area. The operator advertises more than 40 km of slopes between Madesimo and Campodolcino. The Larici photograph is a green-season station, not proof the lifts are open.",
        },
        {
          id: 6,
          label: "Alpe Motta",
          x: 608,
          y: 272,
          description:
            "Alpe Motta is the sector the Sky Express reaches from Campodolcino. The photograph shows summer pastures and stone huts, not a groomed winter piste and not today’s snow.",
        },
        {
          id: 7,
          label: "Groppera / Val di Lei",
          x: 508,
          y: 222,
          description:
            "Unavailable. Valchiavenna says Val di Lei is not open to the public during lift redevelopment, and the Groppera frame shows a snow couloir without lifts. This mark stays on the valley side. It does not name a painted peak and it is not an operating lift.",
        },
      ],
      routes: [
        {
          label: "Tremezzo–Madesimo valley spine",
          points: "398,566 416,538 448,508 472,478 498,442 522,408 546,392 556,342 566,288 570,246",
          color: SPINE,
        },
        { label: "Sky Express to Alpe Motta", points: "566,288 590,280 608,272", color: MOTTA_ROUTE },
        {
          label: "Groppera / Val di Lei unavailable",
          points: "570,246 540,232 508,222",
          color: CLOSED,
          dashed: true,
        },
      ],
    },
  },
  "lake-como-yellow-pages-transport-services": {
    photos: [
      editorialPhoto(
        "ferry-lario",
        "Car ferry Lario docked at Cadenabbia on Lake Como",
        "Vehicle ferry Lario at Cadenabbia with the car deck open. Use a stop marked Traghetto when a car has to cross. This is not the Tremezzo passenger pier.",
      ),
      editorialPhoto(
        "ferry-bellagio",
        "Passenger and vehicle ferry Lario at Bellagio",
        "The ferry Lario at the Bellagio waterfront, the central-lake crossing from Cadenabbia. Hotel signs belong to the buildings. The sailing still has to be checked on the day.",
      ),
      editorialPhoto(
        "varenna",
        "Varenna ferry landing beside Hotel Olivedo",
        "Hotel Olivedo and the Varenna ferry landing. Use it with Varenna-Esino for the train. The photograph does not show the station platforms.",
      ),
      editorialPhoto(
        "ferry-triangle",
        "View toward Bellagio from a central-lake ferry",
        "The wooded Bellagio point from the Menaggio–Varenna ferry. Schedules that look like this view still expire. Open the operator page for the travel date.",
      ),
      editorialPhoto(
        "villa-carlotta",
        "Villa Carlotta at the Tremezzo C110 stop name",
        "Lake façade of Villa Carlotta at Tremezzo. ASF lists a C110 stop by this name. The photograph shows the villa, not a bus.",
      ),
      editorialPhoto(
        "villa-monastero",
        "Lakeside terrace of Villa Monastero in Varenna",
        "Lakeside terrace and garden of Villa Monastero in Varenna. The guide points to the official hours page because month-by-month opening changes. A small notice hangs on the chain.",
      ),
      stayPhoto(
        "lake-como-yellow-pages-transport-services",
        "balcony",
        "Balcony at Apartment Tulipani 11 in Tremezzo",
        "Balcony at Tulipani 11 in Tremezzo. The listing gives a direct host contact, a 16:00 check-in and a 10:00 check-out.",
      ),
      stayPhoto(
        "lake-como-yellow-pages-transport-services",
        "living",
        "Living room at Apartment Tulipani 11 in Tremezzo",
        "Living room at Tulipani 11, a managed Tremezzo apartment for four with two bedrooms and two bathrooms.",
      ),
    ],
    sectionPhotos: {
      "Transport links to save": [
        "/images/como/editorial/ferry-cadenabbia-traghetto.webp",
        "/images/como/editorial/ferry-bellagio-lario.webp",
        "/images/como/editorial/attraction-varenna.webp",
      ],
      "Do not copy a timetable into your notes": ["/images/como/editorial/ferry-central-triangle.webp"],
      "Tourist offices and attraction contacts": [
        "/images/como/editorial/attraction-villa-carlotta.webp",
        "/images/como/editorial/attraction-villa-monastero.webp",
      ],
      "A host link worth saving": [
        "/images/como/tulipani-11-balcony.webp",
        "/images/como/tulipani-11-living.webp",
      ],
    },
    map: {
      baseSrc: "/images/como/maps/transport-base.webp",
      alt: "Illustrated planning map of Lake Como buses, ferries and rail gateways",
      caption:
        "Planning overview of the C110, the rail gateways and the lake ferries. The base is illustrated. Bus and rail strokes sit inland of the decorative shore lines, and times stay on the live operator pages.",
      officialLabel: "ASF Autolinee — live line search",
      officialUrl: "https://www.asfautolinee.it/search-for-lines-and-schedules/?lang=en",
      points: [
        {
          id: 1,
          label: "Tremezzo passenger pier",
          x: 372,
          y: 428,
          description:
            "The Tremezzo passenger pier is on the water, separate from the road stops. Not every Navigazione Laghi sailing calls. It is not a Traghetto car-ferry berth.",
        },
        {
          id: 2,
          label: "Cadenabbia car ferry",
          x: 376,
          y: 388,
          description:
            "Cadenabbia is the car-ferry berth for Bellagio, Menaggio and Varenna. Only sailings marked Traghetto take vehicles. Pedestrians can board the same boats.",
        },
        {
          id: 3,
          label: "C110 stop, Tremezzo",
          x: 338,
          y: 418,
          description:
            "ASF line C110 is the western-shore bus, Como–Argegno–Tremezzo–Menaggio–Colico. Tremezzo stops include Villa Carlotta and Piazza Trieste–Pontile. The old C10 label is out of date. This stroke is offset inland from the decorative shore line.",
        },
        {
          id: 4,
          label: "Menaggio",
          x: 446,
          y: 302,
          description:
            "Menaggio is the next western-shore hub north of Cadenabbia, with the C110 and the central-lake Traghetto. It is not a railway station. Tremezzina has no station of its own.",
        },
        {
          id: 5,
          label: "Como S. Giovanni",
          x: 246,
          y: 632,
          description:
            "Como San Giovanni is the long-distance rail gateway for Milan and Switzerland, south of the lake tip. The line drawn here is only that approach. There is no railway up the western shore to Tremezzo.",
        },
        {
          id: 6,
          label: "Varenna-Esino",
          x: 582,
          y: 322,
          description:
            "Varenna-Esino is the east-shore rail gateway, reached from Tremezzo by ferry to Varenna. The station is inland of the landing. The train does not return you to the western shore.",
        },
        {
          id: 7,
          label: "Como",
          x: 268,
          y: 596,
          description:
            "Como city is the south-western end of the lake, with the passenger-boat landing and the C110. Como Nord Lago is the other useful station, on the lakefront side, and is not the same as San Giovanni.",
        },
      ],
      routes: [
        {
          label: "C110 west-shore bus",
          points: "270,598 286,560 312,520 352,478 342,438 338,400 354,378 408,342 440,318 450,280 466,240 488,200 496,160 504,120 534,82",
          color: BUS,
        },
        { label: "Rail approach to Como S. Giovanni", points: "240,645 248,628 258,608", color: RAIL },
        {
          label: "Rail to Varenna-Esino",
          points: "678,535 666,498 628,458 600,398 592,358 582,322 574,286",
          color: RAIL,
        },
        { label: "Como–Colico passenger boats", points: PASSENGER_ROUTE, color: PASSENGER },
        { label: "Traghetto Cadenabbia–Bellagio", points: "415,385 450,392", color: TRAGHETTO, dashed: true },
        { label: "Traghetto Bellagio–Varenna", points: "528,352 545,338", color: TRAGHETTO, dashed: true },
        { label: "Traghetto Menaggio–Varenna", points: "505,318 538,324", color: TRAGHETTO, dashed: true },
      ],
    },
  },
  "best-things-to-do-lake-como-tremezzo": {
    photos: [
      editorialPhoto(
        "villa-carlotta",
        "Villa Carlotta lake façade and gardens at Tremezzo",
        "Lake façade, gardens and landing of Villa Carlotta at Tremezzo. The official 2026 main season runs 20 March–18 October, 10:00–19:00, with the last ticket at 18:00.",
      ),
      editorialPhoto(
        "villa-balbianello",
        "Villa del Balbianello on its Lenno peninsula",
        "Aerial of Villa del Balbianello on the Lenno peninsula, loggia and gardens included. A window edge remains in the corner. Reserve through FAI and check closure days before the visit.",
      ),
      editorialPhoto(
        "ferry-bellagio",
        "Lario ferry along the Bellagio waterfront",
        "The ferry Lario at the Bellagio waterfront. Hotel signs are on the buildings. Bellagio is a ferry stop on the promontory, not a second car destination from Tremezzo.",
      ),
      editorialPhoto(
        "villa-monastero",
        "Villa Monastero terrace facing Lake Como at Varenna",
        "Lakeside terrace, twisted columns and garden at Villa Monastero in Varenna. A small notice hangs on the chain. The 2026 hours change by month, and some shoulder-season house days close on Tuesday.",
      ),
      editorialPhoto(
        "varenna",
        "Varenna waterfront and Hotel Olivedo by the ferry",
        "Hotel Olivedo and the Varenna waterfront, the ferry side of a Bellagio and Varenna day. Villa Monastero is the separate garden terrace in the same town.",
      ),
      editorialPhoto(
        "isola-comacina",
        "Isola Comacina and its church seen from the water",
        "Isola Comacina from the water, with the church and autumn trees. Sala Comacina’s shore is on the right. Landing boats and archaeological access are seasonal.",
      ),
      editorialPhoto(
        "sacro-monte",
        "Statue groups inside a Sacro Monte di Ossuccio chapel",
        "Chapel interior at Sacro Monte di Ossuccio, with its statue groups. This is the sanctuary climb above the village, not the lakeside Greenway.",
      ),
      stayPhoto(
        "best-things-to-do-lake-como-tremezzo",
        "balcony",
        "Balcony at Apartment Tulipani 11 in Tremezzo",
        "Balcony at Tulipani 11 in Tremezzo, the base this guide uses for Villa Carlotta, the Greenway and the central-lake ferries.",
      ),
      stayPhoto(
        "best-things-to-do-lake-como-tremezzo",
        "living",
        "Living room at Apartment Tulipani 11 in Tremezzo",
        "Living room at Tulipani 11, with two bedrooms, two bathrooms, a kitchen, washing machine, air conditioning and Wi-Fi.",
      ),
    ],
    sectionPhotos: {
      "1–3. The Tremezzina essentials": [
        "/images/como/editorial/attraction-villa-carlotta.webp",
        "/images/como/editorial/attraction-balbianello.webp",
      ],
      "4–6. Bellagio, Varenna and Menaggio": [
        "/images/como/editorial/ferry-bellagio-lario.webp",
        "/images/como/editorial/attraction-villa-monastero.webp",
        "/images/como/editorial/attraction-varenna.webp",
      ],
      "7–8. Isola Comacina and Sacro Monte di Ossuccio": [
        "/images/como/editorial/attraction-isola-comacina.webp",
        "/images/como/editorial/hiking-greenway-ossuccio.webp",
      ],
      "Why Tremezzo works as a base": [
        "/images/como/tulipani-11-balcony.webp",
        "/images/como/tulipani-11-living.webp",
      ],
    },
    map: {
      baseSrc: "/images/como/maps/attractions-base.webp",
      alt: "Illustrated planning map of Lake Como sights around Tremezzo",
      caption:
        "Planning overview of the Tremezzo sights and the Greenway corridor. The base is illustrated, not a booking map. Opening hours and island boats stay on the official pages.",
      officialLabel: "Villa Carlotta — 2026 visit information",
      officialUrl: "https://www.villacarlotta.it/en/visit/",
      points: [
        {
          id: 1,
          label: "Villa Carlotta",
          x: 302,
          y: 302,
          description:
            "Villa Carlotta is the easiest major sight from Tremezzo. Its official 2026 main season runs 20 March–18 October, 10:00–19:00, last ticket 18:00. Autumn and special winter dates use shorter hours.",
        },
        {
          id: 2,
          label: "Villa del Balbianello",
          x: 310,
          y: 402,
          description:
            "Villa del Balbianello is on the Lenno promontory. Reserve through FAI and allow time to walk from Lenno or to use the separate local boat when it operates. Closure days are a live check.",
        },
        {
          id: 3,
          label: "Bellagio",
          x: 502,
          y: 288,
          description:
            "Bellagio is the promontory town between the southern arms. Reach it by ferry from Cadenabbia rather than as another car destination. The shop lane is the busiest part, so go early.",
        },
        {
          id: 4,
          label: "Villa Monastero / Varenna",
          x: 626,
          y: 252,
          description:
            "Varenna adds Villa Monastero and the rail gateway. Monastero’s 2026 hours change by month, and shoulder-season house access can close on Tuesdays. Use the month page.",
        },
        {
          id: 5,
          label: "Isola Comacina",
          x: 336,
          y: 466,
          description:
            "Isola Comacina is the lake’s only island, off Ossuccio and the Greenway. Boat and archaeological access are seasonal. This plate does not draw the island, so the marker sits in the western arm where it lies.",
        },
        {
          id: 6,
          label: "Sacro Monte di Ossuccio",
          x: 246,
          y: 428,
          description:
            "Sacro Monte di Ossuccio climbs past the chapels to the sanctuary. It is a cultural climb with real elevation, not the lakeside Greenway. The chapel photograph shows the interior statues.",
        },
        {
          id: 7,
          label: "Como",
          x: 216,
          y: 576,
          description:
            "Como is the western rail gateway and a separate day for the cathedral, the historic centre and the Brunate funicular. It does not fit into a rushed villa circuit.",
        },
        {
          id: 8,
          label: "Greenway del Lario",
          x: 268,
          y: 488,
          description:
            "The Greenway del Lario runs more than 10 km through Colonno, Ossuccio, Lenno, Tremezzo and Griante. Walk a section instead of driving the Regina road between adjacent stops. This line is the corridor, not a surveyed GPX.",
        },
      ],
      routes: [
        {
          label: "Greenway del Lario",
          points: "230,552 268,488 304,430 292,360 302,302",
          color: GREENWAY,
        },
      ],
    },
  },
};

export function getComoGuideMedia(slug: string): ComoGuideMedia | undefined {
  return COMO_GUIDE_MEDIA[slug];
}
