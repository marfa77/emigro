/**
 * Publish unified Portugal bank account + credit card guide.
 * Archives legacy duplicate slug and leaves redirect in next.config.
 *
 *   npm run portugal:publish-bank-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  PORTUGAL_BANK_ACCOUNT_GUIDE,
  PORTUGAL_BANK_ACCOUNT_LEGACY_SLUG,
} from "@/lib/community-notes/guides/portugal-bank-account";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";
import { createServerClient } from "@/lib/supabase/server";

async function archiveLegacy() {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("community_notes")
    .select("id")
    .eq("slug", PORTUGAL_BANK_ACCOUNT_LEGACY_SLUG)
    .maybeSingle();
  if (!existing) {
    console.log(`[archive] legacy ${PORTUGAL_BANK_ACCOUNT_LEGACY_SLUG} not found — skip`);
    return;
  }
  const { error } = await supabase
    .from("community_notes")
    .update({
      status: "archived",
      updated_at: now,
      excerpt:
        "Объединено с гайдом «Как открыть банковский счёт…». Смотрите kak-otkryt-bankovskiy-schet-portugalia-2026.",
    })
    .eq("id", existing.id);
  if (error) throw new Error(`archive legacy: ${error.message}`);
  console.log(`[archive] ${PORTUGAL_BANK_ACCOUNT_LEGACY_SLUG}`);
}

async function main() {
  await publishHandGuide({ ...PORTUGAL_BANK_ACCOUNT_GUIDE, city: "lisbon" });
  await archiveLegacy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
