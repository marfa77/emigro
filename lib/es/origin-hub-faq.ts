import type { FaqItem } from "@/lib/seo/corridor-page-seo";

export type EsOriginIso = "UY" | "EC" | "PE" | "PY" | "CO" | "CL";

type OriginFaqCopy = {
  demonym: string;
  country: string;
  shortStay: string;
  consulate: string;
};

const ORIGIN: Record<EsOriginIso, OriginFaqCopy> = {
  UY: {
    demonym: "uruguayos",
    country: "Uruguay",
    shortStay:
      "El pasaporte uruguayo suele permitir estancia corta Schengen (90/180), pero visitar no es residir ni trabajar.",
    consulate: "Consulado de España en Montevideo — confirme cita y lista en exteriores.gob.es.",
  },
  EC: {
    demonym: "ecuatorianos",
    country: "Ecuador",
    shortStay:
      "A diferencia de UY/PE/CL, la estancia corta Schengen para pasaporte EC suele exigir visado. Confirme en France/Spain visa sites; no mezcle visado C con residencia.",
    consulate: "Consulado / BLS en Quito (y red Ecuador) — confirme la página oficial del consulado.",
  },
  PE: {
    demonym: "peruanos",
    country: "Perú",
    shortStay:
      "El pasaporte peruano suele permitir estancia corta Schengen, pero vivir y trabajar exige vía nacional (nómada, no lucrativa, trabajo, estudios).",
    consulate: "Consulado de España en Lima — no lucrativa inicial se pide allí, no como turista.",
  },
  PY: {
    demonym: "paraguayos",
    country: "Paraguay",
    shortStay:
      "Pasaporte paraguayo: estancia corta Schengen ≠ residencia. Planifique visado nacional o UGE según la vía.",
    consulate: "Consulado de España en Asunción — confirme jurisdicción y cita.",
  },
  CO: {
    demonym: "colombianos",
    country: "Colombia",
    shortStay:
      "Pasaporte colombiano: suele entrar a Schengen sin visado (90/180), pero visitar ≠ residir. Dualidad CO–ES no sustituye el título de residencia.",
    consulate: "Consulado / BLS en Bogotá — no lucrativa inicial = consulado, no turista→NL.",
  },
  CL: {
    demonym: "chilenos",
    country: "Chile",
    shortStay:
      "Pasaporte chileno: Schengen corto suele ser sin visado; Convenio de dualidad 1958 no es un visado de residencia.",
    consulate: "Consulado en Santiago (Providencia) — confirme la ficha actual en exteriores.gob.es.",
  },
};

/** Visible FAQ for LATAM origin hubs — must stay ≥5 Qs for FAQPage. */
export function buildEsOriginHubFaq(iso: EsOriginIso): FaqItem[] {
  const o = ORIGIN[iso];
  return [
    {
      question: `¿Puedo vivir en España como turista con pasaporte de ${o.country}?`,
      answer: `${o.shortStay} Residencia exige nómada digital, no lucrativa, trabajo, estudios o reagrupación. Emigro no es un atajo Schengen→padrón.`,
    },
    {
      question: "¿Cuánto hay que ingresar para nómada digital en 2026?",
      answer:
        "Umbral orientativo ~€2.849/mes del titular (200% SMI, RD 126/2026, cálculo anual/12). Familia: +~€1.068 el primero y +~€356 cada siguiente (75%/25% SMI). No use cifras 2025 €916/€305.",
    },
    {
      question: "¿La no lucrativa se pide ya en España de turista?",
      answer: `No en el caso inicial: visado no lucrativa se solicita en consulado. ${o.consulate} Nómada digital puede ir por UGE y/o consulado según el caso — no asuma Extranjería genérica.`,
    },
    {
      question: `¿Los ${o.demonym} obtienen nacionalidad española en 2 años?`,
      answer:
        "Art. 22 CC: plazo reducido ~2 años de residencia legal para nacionales de Iberoamérica (entre otros). No cuenta la estancia por estudios (0% hacia art. 22). 50% = larga duración-UE, no un máster. CCSE (y DELE si aplica) por separado.",
    },
    {
      question: "¿Emigro sustituye a un abogado?",
      answer:
        "No. Emigro es navegador y evaluador. Cruce umbrales y citas con BOE, Inclusión, el consulado y un profesional colegiado. Siguiente paso: /es/wizard o Assist.",
    },
  ];
}
