import { createAdminClient } from "@/lib/admin/supabase";
import { sendOwnerTelegramDm } from "@/lib/telegram";

const CONSENT_VERSION = "bot-property-v1";

export type SubmitInvestmentLiteInput = {
  name: string;
  contact: string;
  destination: string;
  destinationIso2?: string;
  message: string;
  kind: "uae" | "thailand" | "other";
  source?: string;
};

export async function submitInvestmentLeadLite(
  input: SubmitInvestmentLiteInput
): Promise<{ leadId: string | null; stored: boolean; error?: string }> {
  const source = input.source || "emigro_bot_property";
  const consentAt = new Date().toISOString();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_manual_leads")
      .insert({
        name: input.name,
        email: input.contact,
        telegram: input.contact.startsWith("@") ? input.contact : null,
        notes: input.message,
        preferred_language: "ru",
        status: "new",
        lead_type: "investment",
        source,
        destination_iso2: input.destinationIso2 ?? null,
        selected_program_slugs: [],
        selected_provider_ids: [],
        consent_at: consentAt,
        consent_version: CONSENT_VERSION,
        lead_packet: {
          schema_version: "bot-lite",
          kind: input.kind,
          destination: input.destination,
          message: input.message,
        },
      })
      .select("id")
      .single();
    if (error || !data) {
      console.error("[investment-lite] insert failed:", error?.message);
      return { leadId: null, stored: false, error: error?.message };
    }

    await sendOwnerTelegramDm(
      [
        "💼 Emigro — заявка на недвижимость / инвест (бот)",
        "",
        `ID: ${data.id}`,
        `Направление: ${input.destination}`,
        `Тип: ${input.kind}`,
        `Имя: ${input.name}`,
        `Контакт: ${input.contact}`,
        "",
        input.message,
      ].join("\n")
    );
    return { leadId: data.id, stored: true };
  } catch (e) {
    return { leadId: null, stored: false, error: e instanceof Error ? e.message : "failed" };
  }
}
