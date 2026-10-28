/** Normalized outdoor experience for @emigro_portugal. */

export type OutdoorTicket = { name: string; price: number };

export type OutdoorEvent = {
  key: string;
  sourceId: string;
  organizer: string;
  title: string;
  description: string;
  aboutPt: string | null;
  includesPt: string | null;
  startIso: string;
  endIso: string | null;
  location: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
  tickets: OutdoorTicket[];
  priceLabel: string | null;
  url: string;
  imageUrl: string | null;
};

export type OutdoorDraft = {
  title: string;
  lead: string;
  paragraphs: string[];
  tip: string;
  includesRu: string | null;
  cardLines: string[];
  sourceUrl: string;
  mapsUrl: string;
  locationLine: string;
  organizer: string;
  priceLine: string | null;
  priceLabel: string | null;
  whenLine: string;
  image: Buffer;
  eventKey: string;
  sourceId: string;
};
