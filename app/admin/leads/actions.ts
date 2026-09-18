"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/admin/supabase";

const ACTIONS = new Set([
  "reserve",
  "contact_shared",
  "accepted",
  "rejected",
  "won",
  "lost",
  "commission",
]);

function authorized(): boolean {
  const secret = process.env.EMIGRO_ADMIN_SECRET?.trim();
  return Boolean(secret) && cookies().get("emigro_admin")?.value === secret;
}

export async function advanceInvestmentLead(formData: FormData): Promise<void> {
  if (!authorized()) throw new Error("Unauthorized");
  const leadId = String(formData.get("lead_id") ?? "");
  const action = String(formData.get("action") ?? "");
  const providerId = String(formData.get("provider_id") ?? "").trim();
  const commissionEur = Number(formData.get("commission_eur") ?? 0);
  if (!leadId || !ACTIONS.has(action)) throw new Error("Invalid handoff action");
  if ((action === "reserve" || action === "contact_shared") && !providerId) {
    throw new Error("Provider is required before sharing a lead");
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  let assignmentId: string | null = null;
  if (providerId) {
    const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("emigro_lead_assignments")
      .upsert(
        {
          lead_id: leadId,
          provider_id: providerId,
          status: "reserved",
          attribution_expires_at: expires,
          updated_at: now,
        },
        { onConflict: "lead_id,provider_id" }
      )
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Assignment failed");
    assignmentId = data.id;
  }

  const assignmentStatus =
    action === "reserve"
      ? "reserved"
      : action === "contact_shared"
        ? "introduced"
        : action === "commission"
          ? undefined
          : action;
  if (assignmentId && assignmentStatus) {
    await supabase
      .from("emigro_lead_assignments")
      .update({
        status: assignmentStatus,
        accepted_at: action === "accepted" ? now : undefined,
        closed_at: action === "won" || action === "lost" || action === "rejected" ? now : undefined,
        commission_terms:
          action === "commission" && Number.isFinite(commissionEur)
            ? { amount_eur: commissionEur, recorded_at: now }
            : undefined,
        updated_at: now,
      })
      .eq("id", assignmentId);
  }

  const leadStatus =
    action === "won" || action === "lost" || action === "rejected"
      ? "closed"
      : action === "reserve" || action === "contact_shared" || action === "accepted"
        ? "assigned"
        : undefined;
  if (leadStatus) {
    await supabase
      .from("emigro_manual_leads")
      .update({
        status: leadStatus,
        selected_provider_ids: providerId ? [providerId] : undefined,
        updated_at: now,
      })
      .eq("id", leadId);
  }

  const eventType =
    action === "reserve"
      ? "provider_reserved"
      : action === "contact_shared"
        ? "contact_shared"
        : action === "accepted"
          ? "provider_accepted"
          : action === "rejected"
            ? "provider_rejected"
            : action === "won"
              ? "deal_won"
              : action === "lost"
                ? "deal_lost"
                : "commission_recorded";
  const { error } = await supabase.from("emigro_lead_handoff_events").insert({
    lead_id: leadId,
    assignment_id: assignmentId,
    event_type: eventType,
    actor_type: "emigro",
    payload: {
      provider_id: providerId || null,
      commission_eur: action === "commission" ? commissionEur : null,
    },
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}
