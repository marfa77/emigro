/** One-off: add renewal guide bridge to aima-agora-zapis-2026 body_paragraphs. */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createServerClient } from "@/lib/supabase/server";

const BRIDGE =
  "Про **папку документов, сроки и каналы renovação** (portal-renovacoes vs Agora vs services.aima) — отдельный [гайд по продлению ВНЖ](https://www.emigro.online/ru/guides/prodlenie-vnzh-portugaliya-aima-2026); здесь только охота за слотом Agora.";

async function main() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select("id, body_paragraphs")
    .eq("slug", "aima-agora-zapis-2026")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    console.log("[bridge] aima-agora-zapis-2026 not in DB — seed only");
    return;
  }

  const paragraphs = (data.body_paragraphs as string[]) ?? [];
  if (paragraphs.some((p) => p.includes("prodlenie-vnzh-portugaliya-aima-2026"))) {
    console.log("[bridge] already present");
    return;
  }

  const { error: upd } = await supabase
    .from("community_notes")
    .update({
      body_paragraphs: [...paragraphs, BRIDGE],
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (upd) throw new Error(upd.message);
  console.log("[bridge] appended to aima-agora-zapis-2026");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
