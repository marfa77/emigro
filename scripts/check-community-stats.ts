import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
import { createServerClient } from "@/lib/supabase/server";

async function statsForCountry(countryKey: "portugal" | "spain", label: string) {
  const sb = createServerClient();
  const { data: signals, count } = await sb
    .from("community_signals")
    .select("status, content_kind, posted_at, channel_username", { count: "exact" })
    .eq("country_key", countryKey)
    .order("posted_at", { ascending: false });

  const { data: notes } = await sb
    .from("community_notes")
    .select("slug, title, status, content_kind, published_at")
    .eq("country_key", countryKey)
    .order("published_at", { ascending: false });

  const byStatus: Record<string, number> = {};
  const byKind: Record<string, number> = {};
  for (const r of signals ?? []) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    byKind[r.content_kind ?? "?"] = (byKind[r.content_kind ?? "?"] ?? 0) + 1;
  }

  console.log(`=== ${label}: community_signals ===`);
  console.log("total:", count);
  console.log("by status:", byStatus);
  console.log("by content_kind:", byKind);
  if (signals?.[0]) console.log("newest signal:", signals[0].posted_at, signals[0].channel_username);

  console.log(`\n=== ${label}: community_notes ===`);
  const pub = (notes ?? []).filter((n) => n.status === "published");
  console.log("published:", pub.length);
  for (const n of pub) console.log(`  [${n.content_kind}] ${n.slug}`);
  console.log("");
}

async function main() {
  await statsForCountry("portugal", "Portugal");
  await statsForCountry("spain", "Spain");
}

main();
