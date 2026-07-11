import fs from "fs";
import path from "path";

/** Slugs with committed hero/OG WebP in public/images/community-notes/ (regenerate via portugal:generate-note-images). */
export const COMMITTED_NOTE_OG_SLUGS = new Set([
  "aima-agora-zapis-2026",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
  "arenda-lissabon-do-podpisi",
  "ciple-guide-2026",
  "elektromobil-tesla-v-portugalii-2026",
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
  "lgoty-s-vnj-kulturnye-mesta-2026",
  "mashina-portugaliya-kupit-arenda-import-2026",
  "mezhdunarodnye-shkoly-portugaliya-2026",
  "nif-lissabon-chto-puutayut",
  "otkrytie-scheta-kreditnaya-karta-portugaliya-2026",
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
  "pervyj-mesyac-portugaliya-checklist",
  "pokupka-zemli-postroyka-doma-norte-portugaliya-2026",
  "poisk-mestnyh-uslug-portugaliya-2026",
  "poterya-pitomtsa-portugaliya-gid-2026",
  "smena-adresa-nif-financas-2026",
  "sns-registration-changes-2026",
  "studencheskiy-vnzh-portugal-mify-aima-2026",
  "termo-responsabilidade-podtverzhdenie-zhilya-2026",
  "vozvrat-remont-tovarov-portugaliya-2026",
  "vybor-internet-provaydera-portugaliya-2026",
  "zamena-voditelskih-prav-portugaliya-2026",
]);

const MANIFEST_PATH = path.join(process.cwd(), "lib/community-notes/note-og-slugs.ts");

/** Append slug to COMMITTED_NOTE_OG_SLUGS manifest when repo filesystem is writable (VPS / local). */
export function appendCommittedNoteOgSlug(slug: string): boolean {
  if (COMMITTED_NOTE_OG_SLUGS.has(slug)) return false;

  try {
    if (!fs.existsSync(MANIFEST_PATH)) return false;
    const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
    if (content.includes(`"${slug}"`)) {
      COMMITTED_NOTE_OG_SLUGS.add(slug);
      return false;
    }

    const updated = content.replace(/(\n\]);/, `\n  "${slug}",\n]);`);
    if (updated === content) return false;

    fs.writeFileSync(MANIFEST_PATH, updated);
    COMMITTED_NOTE_OG_SLUGS.add(slug);
    console.log(`[note-og] manifest: appended ${slug} (commit + deploy for static CDN path)`);
    return true;
  } catch (error) {
    console.warn(
      `[note-og] manifest append skipped for ${slug}:`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}
