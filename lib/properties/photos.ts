/**
 * One cover photo per project: the best facade/aerial render from the listing it came from.
 * Files live in /public/properties, resized to ≤1200 px webp. Credit = the agency that
 * published the image; the link goes to that listing. Projects without a usable image
 * (no facade shot, or none published) fall back to the drawn location plate.
 */
export type ProjectPhoto = { src: string; credit: string; url: string; alt: string };

const iv = (slug: string) => `https://www.imovirtual.com/pt/anuncio/${slug}`;

export const PROJECT_PHOTOS: Record<string, ProjectPhoto> = {
  "noble-boavista": {
    src: "/properties/noble-boavista.webp",
    credit: "Grupo MCaetano",
    url: "https://nobleboavista.pt/",
    alt: "NOBLE: рендер фасада со стороны Avenida da Boavista, живая изгородь и деревья перед домом",
  },
  "boavista-5205": {
    src: "/properties/boavista-5205.webp",
    credit: "Dils",
    url: "https://www.imovirtual.com/pt/empreendimento/boavista-5205-ID1aff2",
    alt: "Boavista 5205: ряд дуплексов с бассейнами, вид сверху со стороны Avenida da Boavista",
  },
  "raiz-avenida-parque": {
    src: "/properties/raiz-avenida-parque.webp",
    credit: "RE/MAX Grupo Dragão",
    url: iv("apartamento-t3-para-venda-ID1hhJx"),
    alt: "RAIZ Avenida Parque: рендер фасада с деревянными перголами вдоль улицы",
  },
  "casas-garcia-de-orta": {
    src: "/properties/casas-garcia-de-orta.webp",
    credit: "EMPRIL",
    url: iv("t2-casas-garcia-de-orta-ID1i9RA"),
    alt: "Casas Garcia de Orta: рендер трёхэтажного белого дома на углу улицы",
  },
  "greenstone-nevogilde": {
    src: "/properties/greenstone-nevogilde.webp",
    credit: "Savills",
    url: iv("penthouse-de-luxo-com-piscina-em-nevogilde-foz-do-douro-ID1fvZH"),
    alt: "Greenstone: терраса пентхауса с бассейном и видом на сосны парка",
  },
  "castelo-do-queijo-rua-particular": {
    src: "/properties/castelo-do-queijo-rua-particular.webp",
    credit: "Jaime Pinto",
    url: iv("apartamento-de-excelencia-t2-portugal-nevogilde-porto-ID1iaLA"),
    alt: "Дом на Rua Particular do Castelo do Queijo: гостиная квартиры T2",
  },
  "matosinhos-sea-living": {
    src: "/properties/matosinhos-sea-living.webp",
    credit: "Luximos Christie's",
    url: iv("apartamento-t1-novo-com-terraco-para-venda-no-matosinhos-sea-living-ID1hFR0"),
    alt: "Matosinhos Sea Living: рендер белого фасада с балконами",
  },
  "nautilus-iv-matosinhos": {
    src: "/properties/nautilus-iv-matosinhos.webp",
    credit: "ZOME",
    url: iv("penthouse-t4-nova-matosinhos-sul-ID1hFwD"),
    alt: "Nautilus IV: вид сверху на Матозиньюш Сул с отметкой дома, на горизонте океан и пляж",
  },
  "casal-de-passos": {
    src: "/properties/casal-de-passos.webp",
    credit: "Vila Mais",
    url: iv("apartamento-t3-de-luxo-casal-de-passos-ID1gNDX"),
    alt: "Casal de Passos: вид сверху на отреставрированный особняк и новый корпус",
  },
  "condominio-boavista-imomundo": {
    src: "/properties/condominio-boavista-imomundo.webp",
    credit: "IMOMUNDO",
    url: iv("luxuoso-t3-novo-com-ampla-varanda-condominio-fechado-boavista-porto-ID1iJ6r"),
    alt: "Закрытый кондоминиум у Boavista: рендер фасада с озеленёнными террасами",
  },
  "central-park-matosinhos": {
    src: "/properties/central-park-matosinhos.webp",
    credit: "Essia",
    url: iv("apartamento-t2-com-varanda-no-central-park-matosinhos-ID1iPtU"),
    alt: "Central Park Matosinhos: рендер длинного дома с террасами-садами",
  },
  "foliage-foz": {
    src: "/properties/foliage-foz.webp",
    credit: "Dils",
    url: iv("apartamento-t2-com-jardim-na-foz-do-douro-ID1iVl5"),
    alt: "Foliage: рендер скруглённого фасада с балконами среди деревьев",
  },
};
