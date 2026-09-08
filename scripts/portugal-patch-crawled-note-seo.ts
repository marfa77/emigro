/**
 * Patch SEO fields for crawled-not-indexed Portugal notes that live in Supabase
 * (no full hand-guide republish).
 *
 *   npx tsx scripts/portugal-patch-crawled-note-seo.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createServerClient } from "@/lib/supabase/server";

const PATCHES: Array<{
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
}> = [
  {
    slug: "aima-residence-card-sent-abroad-2026",
    title: "Карта ВНЖ AIMA уехала за границу: проверить и сменить адрес 2026",
    excerpt:
      "Título de residência иногда уезжает на старый адрес за границей. Как проверить morada в AIMA/портале, сменить адрес до отправки и что делать, если карта уже в пути.",
    seo_title: "Карта ВНЖ уехала за границу — адрес AIMA",
    seo_description:
      "Карта ВНЖ AIMA уехала на старый адрес за границей: как проверить morada, сменить адрес до отправки и не потерять título. Практика 2026.",
    quick_answer:
      "Если в профиле AIMA / portal остался старый адрес «на родине», título de residência могут отправить туда. До биометрии и отправки карты сверьте morada с NIF/Finanças и договором аренды; после отправки — трек и запрос через каналы AIMA. Это не замена renovação и не запись Agora: отдельный сбой доставки, не слота.",
  },
  {
    slug: "aima-agora-zapis-2026",
    title: "AIMA Португалия 2026: Agora vs portal — слот Porto/Lisboa",
    excerpt:
      "Agora ≠ portal-renovacoes: двери AIMA, лог мониторинга слотов Porto/Lisboa, чек-лист до охоты и день приёма, документы на balcão, план B — с Nota Emigro (fact-check).",
    seo_title: "AIMA 2026: Agora vs portal, слот Porto",
    seo_description:
      "AIMA Португалия 2026: Agora ≠ portal-renovacoes, слот Porto/Lisboa, Chave Móvel, balcão, taxas ≈€440 по DUC. Практика Emigro — не юрконсультация.",
    quick_answer:
      "В Португалии в 2026 типовая renovação часто стартует на portal-renovacoes.aima.gov.pt; Agora — когда нужен личный приём (слоты Porto/Lisboa конкурентны). Ведите лог окон, подготовьте NIF, Chave Móvel, совпадающий адрес и PDF; без ботов. Taxas temporary renovação с 01.03.2026 ориентир ≈€440 — платите по DUC. Карта «уехала за границу» — отдельный гайд про адрес доставки; CIPLE — не Agora.",
  },
  {
    slug: "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
    title: "Аренда в Лиссабоне 2026: NIF, fiador, Idealista — первый месяц",
    excerpt:
      "NIF, fiador, Idealista, open house, caução и Modelo 2: первый месяц аренды в Лиссабоне для релокантов — закон Art. 1076 vs практика чатов 2026. Не путать с Porto/Braga.",
    seo_title: "Аренда Лиссабон 2026: NIF, fiador, Idealista",
    seo_description:
      "Аренда Лиссабон 2026: NIF → Idealista/open house → fiador/caução → Modelo 2. Art. 1076 vs предоплата 6–12 мес. Для Lisboa — не Porto/Braga гайд.",
    quick_answer:
      "Вы стоите в очереди open house в Arroios: 20 человек, агент смотрит на часы, а senhorio уже спрашивает «есть fiador?». В Лиссабоне 2026 без NIF и папки документов вы не кандидат; без fiador рынок часто требует предоплату далеко за лимит Art. 1076. Держите курс на registered contrato и Modelo 2 — иначе AIMA не увидит вашу morada. Для Norte см. гайд аренды Porto/Braga.",
  },
];

async function main() {
  const supabase = createServerClient();
  const now = new Date().toISOString();

  for (const patch of PATCHES) {
    const { data: existing, error: findErr } = await supabase
      .from("community_notes")
      .select("id, slug")
      .eq("slug", patch.slug)
      .maybeSingle();
    if (findErr) throw new Error(findErr.message);
    if (!existing) {
      console.warn(`[skip] not found: ${patch.slug}`);
      continue;
    }
    const { error } = await supabase
      .from("community_notes")
      .update({
        title: patch.title,
        excerpt: patch.excerpt,
        seo_title: patch.seo_title,
        seo_description: patch.seo_description,
        quick_answer: patch.quick_answer,
        updated_at: now,
        source_label: "editorial:gsc-crawled-seo-patch-2026-09-08",
      })
      .eq("id", existing.id);
    if (error) throw new Error(`${patch.slug}: ${error.message}`);
    console.log(`[ok] patched SEO ${patch.slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
