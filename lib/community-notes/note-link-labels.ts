/** Short Russian labels for /notes/{slug} cross-links in guide body text. */
export const NOTE_LINK_LABELS: Record<string, string> = {
  "pervyj-mesyac-portugaliya-checklist": "чеклист первого месяца",
  "nif-lissabon-chto-puutayut": "гайд по NIF",
  "aima-agora-zapis-2026": "запись в AIMA",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026": "аренда в первый месяц",
  "arenda-lissabon-do-podpisi": "аренда до подписи",
  "mashina-portugaliya-kupit-arenda-import-2026": "гайд по машине",
  "mezhdunarodnye-shkoly-portugaliya-2026": "международные школы",
  "zamena-voditelskih-prav-portugaliya-2026": "обмен водительских прав",
  "zamena-zagranpasporta-portugaliya-2026": "замена загранпаспорта",
};

export function noteLinkLabel(slug: string): string {
  return NOTE_LINK_LABELS[slug] ?? "подробнее";
}
