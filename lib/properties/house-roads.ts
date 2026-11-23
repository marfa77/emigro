/**
 * Road distances from each house quarter, OSRM (routing.openstreetmap.de, car and foot profiles, OpenStreetMap data), 2026-11-23.
 * Generated — do not edit by hand. Car minutes are free-flow, without traffic.
 * sea and park: km is the walking route (nearest Atlantic beach; nearest point of the Parque da Cidade outline);
 * airport, norteshopping, centre: km is the driving route.
 * Targets: airport terminal (41.2373, -8.6708), NorteShopping (41.1821, -8.6535), Avenida dos Aliados (41.1485, -8.6110).
 */

export type RoadLeg = { km: number; car: number; walk?: number };
export type QuarterRoads = {
  sea: RoadLeg & { walk: number; name: string };
  park: RoadLeg & { walk: number };
  airport: RoadLeg;
  norteshopping: RoadLeg;
  centre: RoadLeg;
};

export const QUARTER_ROADS: Record<string, QuarterRoads> = {
  "carrical": {
    sea: { km: 3.9, car: 9, walk: 52, name: "Praia Internacional" },
    park: { km: 2.9, car: 6, walk: 39 },
    airport: { km: 8.9, car: 10 },
    norteshopping: { km: 1.1, car: 2 },
    centre: { km: 7.9, car: 12 },
  },
  "leao-xiii": {
    sea: { km: 2.7, car: 6, walk: 36, name: "Praia Internacional" },
    park: { km: 0.8, car: 2, walk: 10 },
    airport: { km: 10.6, car: 12 },
    norteshopping: { km: 2.3, car: 5 },
    centre: { km: 7.3, car: 12 },
  },
  "antonio-aroso": {
    sea: { km: 2.0, car: 4, walk: 27, name: "Praia de Gondarém" },
    park: { km: 0.8, car: 2, walk: 10 },
    airport: { km: 10.8, car: 12 },
    norteshopping: { km: 3.0, car: 5 },
    centre: { km: 6.6, car: 10 },
  },
  "telefonistas": {
    sea: { km: 2.3, car: 5, walk: 31, name: "Praia Internacional" },
    park: { km: 0.4, car: 1, walk: 5 },
    airport: { km: 10.3, car: 11 },
    norteshopping: { km: 2.5, car: 4 },
    centre: { km: 6.6, car: 10 },
  },
  "costibela": {
    sea: { km: 2.7, car: 6, walk: 37, name: "Praia Internacional" },
    park: { km: 0.8, car: 2, walk: 11 },
    airport: { km: 10.5, car: 12 },
    norteshopping: { km: 2.2, car: 4 },
    centre: { km: 7.6, car: 12 },
  },
  "vilarinha": {
    sea: { km: 2.3, car: 5, walk: 31, name: "Praia de Gondarém" },
    park: { km: 1.6, car: 3, walk: 22 },
    airport: { km: 11.4, car: 13 },
    norteshopping: { km: 3.1, car: 6 },
    centre: { km: 6.1, car: 10 },
  },
  "correios-ramalde": {
    sea: { km: 3.7, car: 7, walk: 50, name: "Praia Internacional" },
    park: { km: 1.8, car: 3, walk: 24 },
    airport: { km: 10.3, car: 11 },
    norteshopping: { km: 1.9, car: 3 },
    centre: { km: 6.4, car: 10 },
  },
  "lar-familiar": {
    sea: { km: 2.8, car: 5, walk: 37, name: "Praia dos Ingleses" },
    park: { km: 2.2, car: 3, walk: 29 },
    airport: { km: 12.8, car: 14 },
    norteshopping: { km: 4.5, car: 7 },
    centre: { km: 4.8, car: 7 },
  },
  "villas-do-parque": {
    sea: { km: 0.7, car: 1, walk: 9, name: "Praia do Castelo do Queijo" },
    park: { km: 0.9, car: 0, walk: 12 },
    airport: { km: 11.3, car: 11 },
    norteshopping: { km: 4.5, car: 7 },
    centre: { km: 7.5, car: 10 },
  },
  "quinta-marques-gomes": {
    sea: { km: 1.8, car: 5, walk: 25, name: "Praia do Cabedelo" },
    park: { km: 5.2, car: 10, walk: 72 },
    airport: { km: 17.0, car: 19 },
    norteshopping: { km: 8.7, car: 12 },
    centre: { km: 7.6, car: 12 },
  },
  "splendouro-village": {
    sea: { km: 1.8, car: 4, walk: 25, name: "Praia do Cabedelo" },
    park: { km: 5.3, car: 9, walk: 72 },
    airport: { km: 16.8, car: 17 },
    norteshopping: { km: 8.5, car: 10 },
    centre: { km: 7.4, car: 11 },
  },
  "quinta-casa-amarela": {
    sea: { km: 8.8, car: 13, walk: 117, name: "Praia do Carneiro" },
    park: { km: 8.2, car: 10, walk: 110 },
    airport: { km: 15.6, car: 14 },
    norteshopping: { km: 8.1, car: 10 },
    centre: { km: 3.2, car: 5 },
  },
  "as-camelias": {
    sea: { km: 3.6, car: 6, walk: 48, name: "Praia dos Ingleses" },
    park: { km: 3.3, car: 4, walk: 44 },
    airport: { km: 11.6, car: 12 },
    norteshopping: { km: 3.3, car: 5 },
    centre: { km: 4.8, car: 7 },
  },
  "madalena-vila-mar": {
    sea: { km: 0.3, car: 1, walk: 3, name: "Praia de Madalena Norte" },
    park: { km: 10.0, car: 13, walk: 135 },
    airport: { km: 20.3, car: 21 },
    norteshopping: { km: 12.0, car: 14 },
    centre: { km: 10.8, car: 15 },
  },
  "privilege-gaia": {
    sea: { km: 1.9, car: 3, walk: 25, name: "Praia de Miramar" },
    park: { km: 15.7, car: 18, walk: 211 },
    airport: { km: 24.6, car: 26 },
    norteshopping: { km: 16.3, car: 19 },
    centre: { km: 16.1, car: 18 },
  },
  "condominio-francelos": {
    sea: { km: 1.6, car: 2, walk: 21, name: "Praia do Atlântico" },
    park: { km: 12.2, car: 15, walk: 165 },
    airport: { km: 22.2, car: 23 },
    norteshopping: { km: 13.9, car: 16 },
    centre: { km: 11.7, car: 16 },
  },
  "villas-real": {
    sea: { km: 7.9, car: 12, walk: 106, name: "" },
    park: { km: 11.4, car: 13, walk: 153 },
    airport: { km: 3.5, car: 5 },
    norteshopping: { km: 9.6, car: 13 },
    centre: { km: 13.6, car: 18 },
  },
  "quinta-do-sardao": {
    sea: { km: 8.5, car: 13, walk: 114, name: "Praia de Madalena Norte" },
    park: { km: 11.1, car: 14, walk: 149 },
    airport: { km: 22.2, car: 21 },
    norteshopping: { km: 14.9, car: 16 },
    centre: { km: 6.3, car: 9 },
  },
};
