/**
 * @chatporto soft-expert topics — Porto / Norte city life.
 * Match ranks priority; scan still drafts any real question in scope.
 */

export type ChatportoTopic = {
  id: string;
  label: string;
  /** Note slug on portugal.emigro.online */
  noteSlug: string;
  patterns: RegExp[];
  weight: number;
};

/** Must clear a real inventory hit — no “any chat question” floor. */
export const CHATPORTO_MIN_SCORE = 36;

export const CHATPORTO_TOPICS: ChatportoTopic[] = [
  {
    id: "nif",
    label: "NIF Porto",
    noteSlug: "nif-porto-kak-poluchit-2026",
    weight: 55,
    patterns: [/nif\b|financas|finanças|número\s+de\s+contribuinte|налогов\w*\s+номер/i],
  },
  {
    id: "arenda",
    label: "Аренда Porto/Braga",
    noteSlug: "arenda-dolgosrok-porto-braga-2026",
    weight: 50,
    patterns: [/аренд|arrend|idealista|fiador|снять\s+(?:квартир|жиль)|долгосроч/i],
  },
  {
    id: "districts",
    label: "Районы Porto",
    noteSlug: "porto-rajony-arenda-shkoly-parki-sport-2026",
    weight: 48,
    patterns: [
      /район(?:ы|е|а)?\b|cedofeita|campanh|фоз\b|\bfoz\b|matosinhos|вила\s*нова|где\s+жить|где\s+селиться/i,
    ],
  },
  {
    id: "sns",
    label: "SNS / медицина Norte",
    noteSlug: "meditsina-norte-sns-chastnaya-stomatologiya-2026",
    weight: 46,
    patterns: [/sns\b|utente|médico|medico\s+de\s+família|стомат|страхов|multicare|медицин/i],
  },
  {
    id: "aima",
    label: "AIMA / Agora",
    noteSlug: "aima-agora-zapis-2026",
    weight: 44,
    patterns: [/aima|agora|продлен\w*\s+внж|renova|titulo|título|биометр/i],
  },
  {
    id: "bank",
    label: "Банк / IBAN",
    noteSlug: "kak-otkryt-bankovskiy-schet-portugalia-2026",
    weight: 52,
    patterns: [
      /iban|счёт|счет|банк|millennium|activo\s*bank|activobank|novobanco|caixa|ctt\b|mb\s*way|откры\w*\s+сч/i,
    ],
  },
  {
    id: "internet",
    label: "Интернет / оператор",
    noteSlug: "vybor-internet-provaydera-portugaliya-2026",
    weight: 40,
    patterns: [/интернет|провайдер|meo\b|nos\b|vodafone|домашний\s+интернет|мастер/i],
  },
  {
    id: "car",
    label: "Машина / portagens",
    noteSlug: "mashina-portugaliya-kupit-arenda-import-2026",
    weight: 38,
    patterns: [/машин|авто|imt\b|via\s*verde|portagen|штраф|права\s+водител/i],
  },
  {
    id: "school",
    label: "Школа / Porto vs Braga",
    noteSlug: "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
    weight: 36,
    patterns: [/школ|детсад|jardim|creche|braga|international\s+school/i],
  },
  {
    id: "climate",
    label: "Климат / плесень",
    noteSlug: "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
    weight: 34,
    patterns: [/плесен|влажн|отоплени|зим[аыу]|климат|сырость/i],
  },
];
