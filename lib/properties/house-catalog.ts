import { distancesFrom, type Distances } from "@/lib/properties/distances";
import { HOUSE_QUARTERS, type HouseQuarter, type QuarterListing } from "@/lib/properties/houses";
import { formatEur } from "@/lib/properties/catalog";
import type { ProjectPhoto } from "@/lib/properties/photos";

export type CatalogQuarter = HouseQuarter & {
  /** 1-based pin, ordered by bike minutes to CLIP. */
  pin: number;
  dist: Distances;
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
};

/** Colégio Luso-Internacional do Porto, OSM way 446887283. */
export const CLIP = { lat: 41.173339, lng: -8.670915, label: "CLIP", title: "Colégio Luso-Internacional do Porto (CLIP)" };

export const KIND_LABEL = { estate: "Квартал домов", gated: "Закрытый кондоминиум" } as const;

export function listHouseQuarters(): CatalogQuarter[] {
  return HOUSE_QUARTERS.map((q) => {
    const active = q.listings.filter((l) => l.status === "active").sort((a, b) => a.price_eur - b.price_eur);
    return {
      ...q,
      pin: 0,
      dist: distancesFrom(q.lat, q.lng),
      photo: QUARTER_PHOTOS[q.slug] ?? null,
      active,
      priceFrom: active.length ? active[0]!.price_eur : null,
      priceTo: active.length ? active[active.length - 1]!.price_eur : null,
    };
  })
    .sort((a, b) => a.clip.min - b.clip.min || a.clip.km - b.clip.km)
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

/** Nearest of metro and metrobus. */
export function transitLine(q: CatalogQuarter): { label: string; min: number; name: string } {
  const t = q.dist.metrobus ?? q.dist.metro;
  return { label: q.dist.metrobus ? "Метробус" : "Метро", min: t.min, name: t.name };
}
