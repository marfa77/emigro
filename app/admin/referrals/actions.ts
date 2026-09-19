"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { saveRevolutReferralOffer } from "@/lib/partners/revolut-referral-store";
import { saveWiseReferralOffer } from "@/lib/partners/wise-referral-store";
import type { RevolutReferralKind } from "@/lib/partners/revolut-referral";

function authorized(): boolean {
  const secret = process.env.EMIGRO_ADMIN_SECRET?.trim();
  return Boolean(secret) && cookies().get("emigro_admin")?.value === secret;
}

export async function saveRevolutReferralForm(formData: FormData): Promise<void> {
  if (!authorized()) throw new Error("Unauthorized");
  const kind = String(formData.get("kind") ?? "") as RevolutReferralKind;
  if (kind !== "personal" && kind !== "business") throw new Error("Invalid kind");
  await saveRevolutReferralOffer({
    kind,
    url: String(formData.get("url") ?? ""),
    endsOn: String(formData.get("ends_on") ?? ""),
    enabled: formData.get("enabled") === "on",
  });
  revalidateTag(CACHE_TAGS.partnerReferrals);
  revalidatePath("/admin/referrals");
}

export async function saveWiseReferralForm(formData: FormData): Promise<void> {
  if (!authorized()) throw new Error("Unauthorized");
  await saveWiseReferralOffer({
    url: String(formData.get("url") ?? ""),
    endsOn: String(formData.get("ends_on") ?? ""),
    enabled: formData.get("enabled") === "on",
  });
  revalidateTag(CACHE_TAGS.partnerReferrals);
  revalidatePath("/admin/referrals");
}
