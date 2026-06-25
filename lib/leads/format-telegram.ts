export type LeadTelegramPayload = {
  leadId: string;
  corridorTitle: string;
  corridorSlug: string;
  name: string;
  email: string;
  telegram?: string | null;
  notes?: string | null;
  passportIso2: string;
  programSlugs: string[];
  sessionId?: string | null;
};

export function formatLeadTelegramMessage(p: LeadTelegramPayload): string {
  const programs =
    p.programSlugs.length > 0 ? p.programSlugs.map((s) => `• ${s}`).join("\n") : "—";

  const lines = [
    "🆕 Emigro — заявка на shortlist",
    "",
    `Коридор: ${p.corridorTitle}`,
    `ID: ${p.leadId}`,
    "",
    `Имя: ${p.name}`,
    `Email: ${p.email}`,
    p.telegram ? `Telegram: ${p.telegram}` : null,
    `Паспорт: ${p.passportIso2}`,
    "",
    "Маршруты:",
    programs,
    p.notes ? `\nКомментарий:\n${p.notes}` : null,
    p.sessionId ? `\nWizard session: ${p.sessionId}` : null,
  ];

  return lines.filter((line): line is string => line !== null).join("\n");
}
