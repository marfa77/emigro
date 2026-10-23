export type Iso2 = string; // uppercase ISO 3166-1 alpha-2
export type PresenceSource = "manual" | "ticket" | "import";
export type TrafficLight = "green" | "yellow" | "red" | "unknown";

export type PresenceInterval = {
  id?: string;
  countryIso2: Iso2;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  source: PresenceSource;
  note?: string | null;
};

export type DayCountRule = {
  /** Default: arrive day counts, depart day does not (night = day). */
  arriveInclusive: boolean;
  departInclusive: boolean;
};
