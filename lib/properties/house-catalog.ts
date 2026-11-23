import { HOUSE_QUARTERS, type HouseQuarter, type QuarterListing } from "@/lib/properties/houses";
import { formatEur } from "@/lib/properties/catalog";
import { QUARTER_ROADS, type QuarterRoads } from "@/lib/properties/house-roads";
import type { ProjectPhoto } from "@/lib/properties/photos";

export type CatalogQuarter = HouseQuarter & {
  /** 1-based pin: gated condominiums first, then estates, each by road distance to the centre. */
  pin: number;
  roads: QuarterRoads;
  photo: ProjectPhoto | null;
  active: QuarterListing[];
  priceFrom: number | null;
  priceTo: number | null;
};

const iv = (id: string) => `https://www.imovirtual.com/pt/anuncio/${id}`;

/** Cover photos. Listing photos credit the agency and link to the ad. */
export const QUARTER_PHOTOS: Record<string, ProjectPhoto> = {
  "leao-xiii": {
    src: "/properties/doma/leao-xiii.webp",
    credit: "частное объявление, Imovirtual",
    url: iv("moradia-com-garagem-e-jardim-em-aldoar-a-600m-do-parque-da-cidade-ID1jecO"),
    alt: "Двухэтажные дома в ряд на мощёной улице Bairro Leão XIII",
  },
  "antonio-aroso": {
    src: "/properties/doma/antonio-aroso.webp",
    credit: "Kendall & Associado",
    url: iv("moradia-v4-na-foz-ID1iiKI"),
    alt: "Перестроенный дом на Rua de Bitarães в Bairro de António Aroso",
  },
  telefonistas: {
    src: "/properties/doma/telefonistas.webp",
    credit: "Arcobarca",
    url: iv("moradia-t3-1-aldoar-porto-ID1iKg1"),
    alt: "Рядные трёхэтажные дома на Rua Nossa Senhora da Silva",
  },
  costibela: {
    src: "/properties/doma/costibela.webp",
    credit: "Blue Select",
    url: iv("moradia-t3-nova-em-condominio-privado-de-referen-ID1j8c1"),
    alt: "Новый дом из бетона и дерева в кондоминиуме на Travessa da Costibela",
  },
  vilarinha: {
    src: "/properties/doma/vilarinha.webp",
    credit: "Condelix",
    url: iv("moradia-t2-na-vilarinha-arrendamento-exclusivamente-associado-a-a-ID1iYSk"),
    alt: "Спаренные дома на Rua de Santo Tirso в Bairro da Vilarinha",
  },
  "correios-ramalde": {
    src: "/properties/doma/correios-ramalde.webp",
    credit: "Presente Resiliente",
    url: iv("moradia-potencial-para-remodelacao-a-avenida-antunes-guimaraes-ID1j0un"),
    alt: "Одноэтажный жёлтый дом 1940-х в Bairro dos Correios",
  },
  "lar-familiar": {
    src: "/properties/doma/lar-familiar.webp",
    credit: "Ricardo Saraiva de Almeida, CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Bairro_da_Cooperativa_%22O_Lar_Familiar%22_01.jpg",
    alt: "Модернистские рядные дома кооператива «O Lar Familiar»",
  },
  "villas-do-parque": {
    src: "/properties/doma/villas-do-parque.webp",
    credit: "Savills",
    url: iv("moradia-v4-villas-do-parque-porto-ID1ieZM"),
    alt: "Виллы кондоминиума Villas do Parque",
  },
  "quinta-marques-gomes": {
    src: "/properties/doma/quinta-marques-gomes.webp",
    credit: "ZOME",
    url: iv("moradia-t4-vistas-rio-e-mar-em-condominio-de-luxo-vila-nova-de-g-ID1hnUe"),
    alt: "Виллы Quinta Marques Gomes на склоне, за ними старый дворец усадьбы",
  },
  "splendouro-village": {
    src: "/properties/doma/splendouro-village.webp",
    credit: "Sharp Developers, визуализация (через idealista/news)",
    url: "https://www.idealista.pt/news/imobiliario/construcao/2025/07/06/70087-condominio-de-luxo-em-gaia-une-natureza-e-urbanidade",
    alt: "Визуализация Splendouro Village сверху: дома вокруг общего парка, за ними устье Douro",
  },
  "quinta-casa-amarela": {
    src: "/properties/doma/quinta-casa-amarela.webp",
    credit: "CENTURY 21 Realty Art Foz",
    url: iv("moradia-t4-condominio-luxo-nas-antas-ID1fixP"),
    alt: "Низкие стеклянные дома Souto de Moura в саду Quinta da Casa Amarela",
  },
  "as-camelias": {
    src: "/properties/doma/as-camelias.webp",
    credit: "Kendall & Associado",
    url: iv("moradia-t4-1-num-novo-condominio-na-boavista-ID1hkqr"),
    alt: "Двор As Camélias: бетонные дома с зелёными террасами",
  },
  "madalena-vila-mar": {
    src: "/properties/doma/madalena-vila-mar.webp",
    credit: "Chave Nova, визуализация застройщика",
    url: iv("moradia-t4-empreendimento-madalena-vila-mar-ID1j7aV"),
    alt: "Визуализация: стена с решётчатыми воротами и сосна у входа в Madalena Vila Mar",
  },
  "privilege-gaia": {
    src: "/properties/doma/privilege-gaia.webp",
    credit: "PREDIMED, визуализация",
    url: iv("moradia-t3-em-condominio-fechado-arcozelo-ID1hlfx"),
    alt: "Визуализация Privilege Gaia сверху: ряды домов с садами",
  },
  "condominio-francelos": {
    src: "/properties/doma/condominio-francelos.webp",
    credit: "Chave Nova, визуализация",
    url: iv("condominio-francelos-moradia-em-banda-ID1hDQw"),
    alt: "Визуализация Condomínio Francelos сверху: три корпуса рядных домов с садами",
  },
  "villas-real": {
    src: "/properties/doma/villas-real.webp",
    credit: "MEDIUM Real Estate",
    url: iv("moradia-t4-2escritorios-no-villas-real-maia-ID1hCsK"),
    alt: "Кирпичные рядные дома Villas Real вокруг общего бассейна",
  },
  "quinta-do-sardao": {
    src: "/properties/doma/quinta-do-sardao.webp",
    credit: "UP Real Estate",
    url: iv("exclusiva-moradia-de-luxo-em-condominio-fechado-ID1gbHH"),
    alt: "Отдельный дом из гранита и белой штукатурки в Quinta do Sardão",
  },
};

/** Reference points for the map; the same targets as in house-roads.ts. */
export const HOUSE_LANDMARKS = [
  { lat: 41.2373, lng: -8.6708, label: "Аэропорт", title: "Аэропорт Francisco Sá Carneiro" },
  { lat: 41.1821, lng: -8.6535, label: "NorteShopping", title: "NorteShopping, Senhora da Hora" },
  { lat: 41.1485, lng: -8.611, label: "Aliados", title: "Центр: Avenida dos Aliados" },
];

export const KIND_LABEL = { estate: "Квартал домов", gated: "Закрытый кондоминиум" } as const;

export function listHouseQuarters(): CatalogQuarter[] {
  return HOUSE_QUARTERS.map((q) => {
    const active = q.listings.filter((l) => l.status === "active").sort((a, b) => a.price_eur - b.price_eur);
    return {
      ...q,
      pin: 0,
      roads: QUARTER_ROADS[q.slug]!,
      photo: QUARTER_PHOTOS[q.slug] ?? null,
      active,
      priceFrom: active.length ? active[0]!.price_eur : null,
      priceTo: active.length ? active[active.length - 1]!.price_eur : null,
    };
  })
    .sort((a, b) => (a.kind === b.kind ? a.roads.centre.km - b.roads.centre.km : a.kind === "gated" ? -1 : 1))
    .map((q, i) => ({ ...q, pin: i + 1 }));
}

export function getHouseQuarter(slug: string): CatalogQuarter | null {
  return listHouseQuarters().find((q) => q.slug === slug) ?? null;
}

export function housesVerifiedDate(quarters: CatalogQuarter[]): string {
  return quarters.map((q) => q.verified).sort().pop() ?? "";
}

function ruHouses(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "дом";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "дома";
  return "домов";
}

/** «5 домов: 237 тыс. € – 2,49 млн €» or «Сейчас в продаже нет». */
export function priceLine(q: CatalogQuarter): string {
  if (!q.active.length) return "Сейчас в продаже нет";
  const n = q.active.length;
  return n === 1
    ? `1 дом в продаже: ${formatEur(q.priceFrom)}`
    : `${n} ${ruHouses(n)} в продаже: ${formatEur(q.priceFrom)} – ${formatEur(q.priceTo)}`;
}

export type Indicator = { key: keyof QuarterRoads; label: string; value: string; sub: string };

/** Walk if it is under half an hour, otherwise the drive. */
function reach(label: string, leg: { km: number; car: number; walk?: number }, key: keyof QuarterRoads, extra?: string): Indicator {
  const km = `${leg.km.toLocaleString("ru-RU")} км`;
  if (leg.walk != null && leg.walk <= 30) {
    return { key, label, value: `≈ ${Math.max(1, leg.walk)} мин пешком`, sub: [km, extra].filter(Boolean).join(" · ") };
  }
  return { key, label, value: km, sub: [`≈ ${Math.max(1, leg.car)} мин на машине`, extra].filter(Boolean).join(" · ") };
}

/** Five reference distances, same order everywhere: sea, park, centre, NorteShopping, airport. */
export function indicators(q: CatalogQuarter): Indicator[] {
  const r = q.roads;
  return [
    reach("Океан", r.sea, "sea", r.sea.name),
    reach("Parque da Cidade", r.park, "park"),
    reach("Центр (Aliados)", r.centre, "centre"),
    reach("NorteShopping", r.norteshopping, "norteshopping"),
    reach("Аэропорт", r.airport, "airport"),
  ];
}
