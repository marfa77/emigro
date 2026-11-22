/**
 * New-build catalog on the Portugal satellite (porto.emigro.online/novostroyki).
 *
 * Every project uses the same shape so two developers can be compared field by field.
 * A field we could not confirm stays `null` and is listed in `unknowns`; it is never guessed.
 * When two sources disagree, both values go into `conflicts` instead of picking one silently.
 */

export type Typology = "T0" | "T1" | "T2" | "T3" | "T4" | "T5";

export type ProjectStatus =
  | "selling" // on sale, under construction
  | "ready" // built, ready for escritura
  | "embargo" // works stopped by the Câmara
  | "sold_out";

export type Side = "porto" | "matosinhos";

export type SourceKind = "developer" | "portal" | "press" | "agency";

export type PropertySource = {
  id: string;
  label: string;
  url: string;
  kind: SourceKind;
  /** Day we last opened the page (YYYY-MM-DD). */
  checked: string;
};

export type UnitStatus = "available" | "reserved" | "sold" | "assignment";

export type PropertyUnit = {
  typology: Typology;
  /** Gross private area as the listing states it (área bruta privativa / área interior). */
  area_m2: number | null;
  outdoor_m2?: number | null;
  floor?: string | null;
  parking?: number | null;
  price_eur: number | null;
  status: UnitStatus;
  label?: string;
  /** PropertySource.id */
  source: string;
};

export type ParqueProject = {
  slug: string;
  name: string;
  /** Plain-language one-liner shown under the name. */
  tagline: string;
  side: Side;
  freguesia: string;
  address: string;
  /** null when the address is not confirmed well enough to put a pin on the map. */
  lat: number | null;
  lng: number | null;
  /** How we got the point: geocoded street, the developer's map, or a listing pin. */
  location_basis: string;
  status: ProjectStatus;
  completion: string | null;
  developer: string | null;
  architect: string | null;
  units_total: number | null;
  typologies: Typology[];
  energy_class: string | null;
  features: string[];
  units: PropertyUnit[];
  summary: string;
  /** What to watch for. Written by the editor, not copied from ads. */
  notes: string[];
  conflicts: string[];
  unknowns: string[];
  sources: PropertySource[];
  verified: string;
};
