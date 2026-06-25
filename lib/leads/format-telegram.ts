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

export type AssistLeadTelegramPayload = {
  leadId?: string | null;
  stored: boolean;
  country: string;
  corridorSlug?: string | null;
  programRoute: string;
  planTier?: string | null;
  paymentMethod?: string | null;
  selectedProviders: string[];
  name: string;
  contact: string;
  message: string;
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

export function formatAssistLeadTelegramMessage(p: AssistLeadTelegramPayload): string {
  const providers =
    p.selectedProviders.length > 0 ? p.selectedProviders.map((provider) => `• ${provider}`).join("\n") : "—";

  const lines = [
    "🆕 Emigro Assist — заявка",
    "",
    p.leadId ? `ID: ${p.leadId}` : null,
    `Сохранено в Supabase: ${p.stored ? "да" : "нет"}`,
    `Страна: ${p.country}`,
    p.corridorSlug ? `Коридор: ${p.corridorSlug}` : null,
    `Маршрут: ${p.programRoute}`,
    p.planTier ? `Тариф: ${p.planTier}` : null,
    p.paymentMethod ? `Оплата: ${p.paymentMethod}` : null,
    "",
    `Имя: ${p.name}`,
    `Контакт: ${p.contact}`,
    "",
    "Выбранные сервисы:",
    providers,
    "",
    `Сообщение:\n${p.message}`,
  ];

  return lines.filter((line): line is string => line !== null).join("\n");
}
