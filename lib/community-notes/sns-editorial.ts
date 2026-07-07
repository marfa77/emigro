import type { NoteBodySection } from "@/lib/community-notes/types";

/** Prompt block — SNS (система) ≠ número de utente (ID пациента). gov.pt */
export const SNS_UTENTE_EDITORIAL_RULES = `
SNS и utente — РАЗНЫЕ понятия (не пиши «SNS (utente)» и не «номер SNS»):
- SNS (Serviço Nacional de Saúde) — государственная система здравоохранения.
- Número de utente — ID пациента в Registo Nacional de Utentes после регистрации в centro de saúde.
- Правильно: «запишитесь в centro de saúde → получите número de utente do SNS».
- Наличие utente НЕ гарантирует покрытие расходов: нужны ВНЖ, NIF, адрес в Португалии в регистрации (gov.pt).
- D7/D8: частная страховка по визе часто нужна до/параллельно с регистрацией в SNS.
Запрещено: «SNS (numero de utente)», «номер SNS», «utente даёт доступ к системе здравоохранения» без регистрации и условий.`.trim();

/** Patterns that conflate SNS with utente or oversimplify access. */
const CONFLATION_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /(?<!de utente do )SNS\s*\([^)]*(?:utente|numero)/i, label: "SNS (utente…) — система и номер смешаны" },
  { re: /(?<!de utente do )sns\s*\([^)]*numero/i, label: "SNS (numero…) — система и номер смешаны" },
  { re: /номер[а]?\s+(?:пользователя\s+)?sns\s*\(/i, label: "«номер SNS (…)» — система и número de utente смешаны" },
  { re: /номер[а]?\s+sns\b/i, label: "«номер SNS» — так не называют; есть número de utente" },
  { re: /n[uú]mero\s+sns\b/i, label: "«numero SNS» — так не называют" },
  {
    re: /(?:n[uú]mero\s+de\s+)?utente[^.\n]{0,80}даёт\s+доступ\s+к\s+(?:государственной\s+)?(?:системе\s+)?здравоохран/i,
    label: "utente «даёт доступ» без регистрации/условий",
  },
  {
    re: /utente[^.\n]{0,40}даёт\s+доступ/i,
    label: "utente «даёт доступ» — oversimplify (нужна регистрация в centro de saúde)",
  },
];

const REGISTRATION_CONTEXT =
  /centro de sa[uú]de|регистрац|запишитесь|записаться|внж|внж|resid[eê]ncia|nif|покрытие|страховк|co-?pay|доплат/i;

function linesFromSections(sections: NoteBodySection[]): string[] {
  return sections.flatMap((s) => [
    s.heading,
    ...(s.paragraphs ?? []),
    ...(s.bullets ?? []),
  ]);
}

export function validateSnsUtenteCopy(texts: string[]): string[] {
  const errors: string[] = [];
  for (const text of texts) {
    const t = text.trim();
    if (!t || !/\bsns\b|utente|здравоохран/i.test(t)) continue;

    for (const { re, label } of CONFLATION_PATTERNS) {
      if (re.test(t)) {
        errors.push(`sns/utente: ${label}`);
        break;
      }
    }

    if (/utente[^.\n]{0,60}даёт\s+доступ/i.test(t) && !REGISTRATION_CONTEXT.test(t)) {
      errors.push("sns/utente: «utente даёт доступ» без centro de saúde / ВНЖ / регистрации");
    }
  }
  return errors;
}

/** Fix common LLM/seed phrasing in place. Returns true if anything changed. */
export function sanitizeSnsUtenteText(text: string): { text: string; changed: boolean } {
  let out = text;
  const before = out;

  // Longest / most specific phrases first (order matters).
  out = out.replace(
    /(?:N[uú]mero|Номер)\s+SNS\s*\(\s*utente\s*\)\s+даёт\s+доступ\s+к\s+государственной\s+системе\s+здравоохранения\.?/gi,
    "Запишитесь в centro de saúde → получите número de utente (ID пациента в SNS). При действующем ВНЖ, NIF и адресе в регистрации — доступ к госмедицине по правилам SNS (с доплатами); на D7/D8 часто нужна частная страховка."
  );
  out = out.replace(
    /n[uú]mero de utente do SNS\s*\(\s*N[uú]mero de [Uu]tente\s*\)\s+даёт\s+право[^.]*\.?/gi,
    "После регистрации в centro de saúde вы получите número de utente — ID пациента в SNS; при ВНЖ, NIF и адресе в регистрации — доступ к госмедицине по правилам SNS."
  );
  out = out.replace(
    /(?:N[uú]mero\s+de\s+)?utente\s+даёт\s+доступ\s+к\s+государственной\s+системе\s+здравоохранения\.?/gi,
    "После регистрации в centro de saúde вы получите número de utente — ID пациента в SNS; покрытие расходов при привязанных ВНЖ, NIF и адресе."
  );
  out = out.replace(
    /номер[а]?\s+(?:пользователя\s+)?SNS\s*\(\s*N[uú]mero\s+de\s+[Uu]tente\s*\)/gi,
    "número de utente do SNS"
  );
  out = out.replace(
    /n[uú]mero de utente do SNS\s*\(\s*n[uú]mero de utente\s*\)/gi,
    "número de utente do SNS"
  );
  out = out.replace(
    /n[uú]mero de utente do SNS\s*\(\s*N[uú]mero de [Uu]tente\s*\)/gi,
    "número de utente do SNS"
  );
  out = out.replace(/получения номера регистрация в SNS/gi, "получения número de utente do SNS");
  out = out.replace(
    /номер[а]?\s+регистрация в SNS\s*\(\s*n[uú]mero de utente\s*\)/gi,
    "número de utente do SNS"
  );
  out = out.replace(
    /SNS\s*\(\s*numero\s+de\s+utente\s*\)/gi,
    "регистрация в SNS и número de utente"
  );
  out = out.replace(/(?:N[uú]mero|Номер)\s+SNS\s*\(\s*utente\s*\)/gi, "número de utente do SNS");
  out = out.replace(/SNS\s*\(\s*utente\s*\)/gi, "регистрация в SNS (número de utente)");
  out = out.replace(/SNS\s*\(\s*utente[^)]*\)/gi, "регистрация в SNS (número de utente)");
  out = out.replace(/(?:N[uú]mero|Номер)\s+SNS\b/gi, "número de utente do SNS");

  return { text: out, changed: out !== before };
}

export function sanitizeSnsFields(fields: {
  quick_answer: string;
  key_takeaways: string[];
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  faq?: Array<{ q: string; a: string }>;
}): { patch: typeof fields; changed: boolean } {
  const quick = sanitizeSnsUtenteText(fields.quick_answer);
  const takeaways = fields.key_takeaways.map((t) => sanitizeSnsUtenteText(t));
  const paragraphs = fields.body_paragraphs.map((p) => sanitizeSnsUtenteText(p));
  const sections = fields.body_sections.map((s) => {
    const heading = sanitizeSnsUtenteText(s.heading);
    const paragraphs = (s.paragraphs ?? []).map((p) => sanitizeSnsUtenteText(p));
    const bullets = (s.bullets ?? []).map((b) => sanitizeSnsUtenteText(b));
    return {
      heading: heading.text,
      ...(s.section_kind ? { section_kind: s.section_kind } : {}),
      paragraphs: paragraphs.map((x) => x.text),
      bullets: bullets.map((x) => x.text),
    };
  });
  const faq = (fields.faq ?? []).map((item) => {
    const q = sanitizeSnsUtenteText(item.q);
    const a = sanitizeSnsUtenteText(item.a);
    return { q: q.text, a: a.text };
  });

  const changed =
    quick.changed ||
    takeaways.some((x) => x.changed) ||
    paragraphs.some((x) => x.changed) ||
    (fields.faq ?? []).some((item, i) => {
      const f = faq[i];
      return f && (f.q !== item.q || f.a !== item.a);
    }) ||
    sections.some(
      (sec, i) =>
        sec.heading !== fields.body_sections[i]?.heading ||
        JSON.stringify(sec) !== JSON.stringify(fields.body_sections[i])
    );

  return {
    changed,
    patch: {
      quick_answer: quick.text,
      key_takeaways: takeaways.map((x) => x.text),
      body_paragraphs: paragraphs.map((x) => x.text),
      body_sections: sections,
      faq,
    },
  };
}

export function snsTextsFromDraft(input: {
  quick_answer: string;
  key_takeaways: string[];
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  faq: Array<{ q: string; a: string }>;
}): string[] {
  return [
    input.quick_answer,
    ...input.key_takeaways,
    ...input.body_paragraphs,
    ...linesFromSections(input.body_sections),
    ...input.faq.flatMap((f) => [f.q, f.a]),
  ];
}
