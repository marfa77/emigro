/** Short Russian labels for /notes/{slug} cross-links in guide body text. */
export const NOTE_LINK_LABELS: Record<string, string> = {
  "pervyj-mesyac-portugaliya-checklist": "чеклист первого месяца",
  "nif-lissabon-chto-puutayut": "гайд по NIF",
  "aima-agora-zapis-2026": "запись в AIMA",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026": "аренда в первый месяц",
  "arenda-lissabon-do-podpisi": "аренда до подписи",
  "mashina-portugaliya-kupit-arenda-import-2026": "гайд по машине",
  "platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026": "платные дороги и штрафы",
  "mezhdunarodnye-shkoly-portugaliya-2026": "международные школы",
  "zamena-voditelskih-prav-portugaliya-2026": "обмен водительских прав",
  "zamena-zagranpasporta-portugaliya-2026": "замена загранпаспорта",
  "nie-empadronamiento-poryadok-2026": "NIE и empadronamiento",
  "tie-cita-extranjeria-valencia-2026": "TIE и cita extranjería",
  "dnv-uge-konsulstvo-2026": "DNV и UGE",
  "arenda-valencia-idealista-2026": "аренда Valencia",
  "bank-iban-nerezident-ispaniya-2026": "банк и IBAN",
  "beckham-autonomo-mify-2026": "Beckham и autónomo",
  "pervye-30-dnej-v-ispanii-satelit-2026": "первые 30 дней в Испании",
  "arenda-dolgosrok-porto-braga-2026": "аренда Porto/Braga",
  "turizm-vnutri-portugalii-norte-2026": "внутренний туризм PT",
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026": "Порту vs Брага",
  "klimat-norte-zhara-vlazhnost-plesen-zima-2026": "климат Norte",
  "kak-otkryt-bankovskiy-schet-portugalia-2026": "открытие счёта",
};

export function noteLinkLabel(slug: string): string {
  return NOTE_LINK_LABELS[slug] ?? "подробнее";
}
