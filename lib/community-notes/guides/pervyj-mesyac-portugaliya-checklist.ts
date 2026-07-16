/**
 * Hand-curated guide — first month checklist for a Golden Visa family in Norte.
 * Voice «Опытный релокант за кофе» (lib/community-notes/editorial-voice.ts).
 *
 * Assumptions (stated in quick_answer and body):
 * - Family of 3: typically 2 adults + 1 school-age child
 * - Destination: Braga or Porto (Norte), arrival via OPO
 * - Status: Golden Visa / ARI (or ARI family titles) — not D7/D8 primary track
 * - Rent a car on arrival; school enrollment is week-1 priority
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { APARTMENT_BUY_NORTE_GUIDE_SLUG } from "@/lib/community-notes/guides/apartment-buy-norte-portugal";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { MEDITSINA_NORTE_HEALTHCARE_SLUG } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import { VNJ_RENEWAL_SLUG } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYJ_MESYAC_CHECKLIST_SLUG = "pervyj-mesyac-portugaliya-checklist";

const DISCLAIMER_GV =
  "**Emigro — не юридическая консультация.** Правила Golden Visa / ARI (Autorização de Residência para Investimento) и каналы AIMA **меняются**. Ниже — бытовой чеклист первого месяца для семьи; сроки biometria, taxas и список документов сверяйте на [aima.gov.pt — Portal ARI](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari) и с вашим **advogado de imigração**.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(PERVYJ_MESYAC_CHECKLIST_SLUG)!,
      "Слова, которые услышите в Loja AIMA, в Finanças и на open day школы — разберём до первого утра в Porto или Braga."
    ),
    paragraphs: [
      "Слова, которые услышите в Loja AIMA, в Finanças и на open day школы — разберём до первого утра в Porto или Braga.",
      DISCLAIMER_GV,
    ],
  },
  {
    heading: "Официально: ARI, NIF, morada и SNS для семьи",
    section_kind: "official",
    paragraphs: [
      "Что делать: закрыть базовый контур документов на троих — налоговый номер, адрес, здоровье и статус ARI — в порядке, который принимают Finanças, школа и AIMA.",
      "Зачем: без NIF и comprovativo de morada не откроете счёт и не закроете matrícula; без трека Portal ARI семья рискует пропустить biometria.",
      "Главное: hard-правила ARI — только на [aima.gov.pt Portal ARI](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari); ниже — официальный каркас быта.",
    ],
    bullets: [
      "NIF выдаёт Autoridade Tributária / Portal das Finanças — один номер на человека на всю страну; детям тоже нужен свой NIF для школы и SNS.",
      "Comprovativo de morada: contrato de arrendamento с registo, Atestado de Residência Junta или иной документ, который принимает ваш balcão — обновите morada fiscal после переезда.",
      "Número de utente do SNS — через inscrição в centro de saúde по morada; детали доступа меняются, сверяйте [sns.gov.pt](https://www.sns.gov.pt/).",
      "ARI / Golden Visa: candidatura, agregado familiar, DUC и agendamento Loja AIMA — через Portal ARI; не подменяйте маршрут общим «как D7 через Agora».",
      "Храните PDF passaporte, título/comprovativo pedido, NIF и recibos — AIMA и банк запрашивают повторно.",
    ],
  },
  {
    heading: "До прилёта: папка семьи, школа, авто, временное жильё",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: собрать цифровую и бумажную папку на троих, забронировать temporary housing рядом со shortlist школ и подтвердить аренду авто в OPO с детским креслом.",
      "Зачем: в первые 72 часа вы не хотите искать «где NIF ребёнка» и «какая школа ещё принимает в сентябре» — это решается до посадки.",
      "Главное: школа и temporary адрес — раньше Idealista long-term; машина — раньше обсуждения «купить сразу».",
    ],
    bullets: [
      "Соберите на каждого: загранпаспорт, título/визу ARI или comprovativo pedido, NIF если уже есть, страховку путешествия/здоровья на первые недели.",
      "Добавьте на ребёнка: свидетельство о рождении (apostille + перевод PT/EN по запросу школы), transcripts/табель, calendário vacinação или caderneta de vacinação, 2–4 фото.",
      "Составьте shortlist 2–3 international schools (Porto: OBS/CLIP/LFIP; Braga: CLIB) и запросите admissions checklist — см. [международные школы](/notes/" +
        INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
        ").",
      "Забронируйте temporary 2–4 недели (aparthotel / mid-term) в зоне commute до shortlist — Foz/Boavista/Matosinhos или Braga centro/Gualtar; выбор города — [Porto vs Braga](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
      "Подтвердите rent-a-car в аэропорту Francisco Sá Carneiro (OPO): full-to-full, child seat, Via Verde/EasyToll — иначе платные дороги «догонят» штрафом; см. [tolls](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        ").",
    ],
  },
  {
    heading: "Дни 1–3: OPO → Porto/Braga, машина, NIF, временный адрес",
    section_kind: "practice",
    paragraphs: [
      "Что делать: забрать авто, доехать до temporary, активировать связь и закрыть NIF (если ещё нет) — без марафона по Lisboa.",
      "Зачем: без NIF и адреса для correspondência школа, Finanças и банк встанут; без Via Verde на A3/A28 счета за portagens придут поздно и дороже.",
      "Главное: первые три дня — логистика семьи, не «закрыть всю бюрократию».",
    ],
    bullets: [
      "Заберите авто в OPO, проверьте dents на фото, активируйте Via Verde / EasyToll в приложении или у desk — детали в [платные дороги Norte](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        ").",
      "Доезжайте сразу в Porto (Foz/Boavista/Matosinhos) или Braga — не «ночь в Lisboa ради AIMA Saldanha»; для ARI слоты в Norte свои.",
      "Купите eSIM/SIM (MEO/NOS/Vodafone) на взрослых; ребёнку — только если школа просит контактный номер.",
      "Закройте NIF в Finanças (Loja do Cidadão Porto/Braga или com representante) на всех троих, если номеров ещё нет — один налоговый номер на страну, не «лиссабонский».",
      "Зафиксируйте temporary morada: confirmação брони + e-mail senhorio; сфотографируйте acta de entrada — сырость Norte ловится в первую неделю, см. [климат](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
    ],
  },
  {
    heading: "Неделя 1: школа первой, затем Finanças, банк, morada",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: посетить admissions / open day, подать matrícula-пакет, параллельно обновить morada fiscal и открыть PT-счёт, если банк ещё не открыт под ARI.",
      "Зачем: waiting list на Year 7 в Porto часто 6–12 месяцев; откладывать школу «после банка» — типичная потеря семестра.",
      "Главное: школа → comprovativo de morada → банк под аренду; не наоборот.",
    ],
    bullets: [
      "Запишитесь на visit в 1–2 школы из shortlist в первые 3 рабочих дня; возьмите transcripts, vacinas, NIF ребёнка и passaportes родителей.",
      "Подайте enrollment / waiting list с comprovativo temporary или long-term адреса — детали fees и документов в [гайде по школам](/notes/" +
        INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
        ").",
      "Обновите morada на Portal das Finanças и при необходимости получите Atestado de Residência в Junta de Freguesia (Porto/Braga).",
      "Откройте или активируйте conta em Portugal (Millennium, ActivoBank, CGD — по политике KYC для ARI): NIF + passaporte + comprovativo morada; Revolut удобен первые дни, но long-term renda часто просит PT IBAN.",
      "Не переводите caução за long-term T2/T3 до проверки contrato — порядок оплаты в [аренде Porto/Braga](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
    ],
  },
  {
    heading: "Неделя 2: SNS, шаги AIMA/ARI, свет и вода",
    section_kind: "practice",
    paragraphs: [
      "Что делать: зарегистрировать utente SNS по morada, сверить статус ARI/Portal ARI с адвокатом и подключить utilities на имя арендатора.",
      "Зачем: ребёнок без número de utente и без частной страховки — риск платить полный счёт в urgências; пропуск biometria/agenda ARI дороже любой Idealista-сделки.",
      "Главное: здоровье и статус проживания — на той же неделе, что и Wi‑Fi.",
    ],
    bullets: [
      "Запишитесь в centro de saúde / USF по morada (Porto или Braga): NIF, comprovativo, документ резидентства — порядок в [медицине Norte](/notes/" +
        MEDITSINA_NORTE_HEALTHCARE_SLUG +
        ").",
      "Держите частную страховку (часто уже в ARI-пакете) активной до стабильного médico de família; для педиатрии заложите CUF/Lusíadas/Trofa как plan B.",
      "Сверьте с advogado: Portal ARI, agendamento Loja AIMA, biometria семьи, DUC/taxas — официально на [aima.gov.pt Portal ARI](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari); не путайте с Agora-потоком D7.",
      "Подключите eletricidade (EDP/Iberdrola) и água (Águas do Porto / municipal Braga) на NIF + IBAN; internet fibra — по cobertura адреса.",
      "Сохраните PDF: recibos, comprovativo pedido ARI, matrícula школы — банк и Junta часто просят повторно.",
    ],
  },
  {
    heading: "Недели 3–4: закрепиться, жильё на год, решить по машине",
    section_kind: "practice",
    paragraphs: [
      "Что делать: перейти с temporary на contrato ≥12 месяцев рядом со школой, решить keep rent vs buy car и закрыть бытовые хвосты.",
      "Зачем: к концу месяца у семьи должен быть адрес для школы/SNS, понятный commute и план по авто — иначе второй месяц уходит на переезды.",
      "Главное: сначала школа и morada, потом покупка квартиры «навсегда».",
    ],
    bullets: [
      "Подпишите long-term T2/T3 в зоне commute (Foz/Boavista/Matosinhos или Gualtar/Braga centro) с registo contrato в Finanças — бюджеты в [аренде](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
      "Осмотрите на humidade/bolor до подписи — чеклист в [климате Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        "); acta de entrada с фото углов обязательна.",
      "Решите по авто: продлить rent, купить в PT или import — сравнение в [машине в Португалии](/notes/" +
        CAR_PORTUGAL_GUIDE_SLUG +
        "); не покупайте вслепую на второй неделе.",
      "Если смотрите покупку жилья под жизнь (не обязательно под ARI-инвест): ритуал CPCV/escritura — [купить квартиру Norte](/notes/" +
        APARTMENT_BUY_NORTE_GUIDE_SLUG +
        ").",
      "Отметьте expiry título и горизонт renovação — общий порядок в [продлении ВНЖ](/notes/" + VNJ_RENEWAL_SLUG + "); для ARI taxas другие, чем €99,80 у D7.",
    ],
  },
  {
    heading: "Golden Visa (ARI) для семьи: чем отличается от D7/D8",
    section_kind: "gap",
    paragraphs: [
      "Что делать: идти по маршруту ARI / Portal ARI и чеклисту адвоката — не копировать «первый месяц D8» из чата один в один.",
      "Зачем: путаница каналов (Agora vs Portal ARI vs portal-renovacoes) съедает недели; у семьи из трёх biometria и документы на каждого.",
      "Главное: soft-ориентир ниже; hard-правила — только aima.gov.pt и ваш processo.",
    ],
    bullets: [
      "Чат: «сначала Agora как у всех» → для ARI первичный трек часто Portal ARI и Loja AIMA по инструкции процесса, не общая fila D-visa.",
      "Чат: «нужно жить 183 дня как D7» → у ARI минимальное пребывание исторически мягче (ориентир «несколько дней в году» в старых правилах); актуальный mínimo сверяйте в условиях вашего título и у advogado.",
      "Официально: agregado familiar (супруг/дети) идут в том же investment-кейсе через Portal ARI — у каждого свой pedido/taxas; список PDF — на портале на дату подачи.",
      "Расхождение: «SNS и банк ждут карту» → NIF + comprovativo legal stay часто хватает раньше пластика; карту не откладывайте, но быт не стопорите.",
      "Продление и taxas ARI — отдельная шкала (тысячи €), не путать с renovação D7/D8 за €99,80 — см. [продление ВНЖ](/notes/" + VNJ_RENEWAL_SLUG + ").",
    ],
  },
  {
    heading: "Porto или Braga: развилки первого месяца",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать базу на первые 30 дней от школы и commute, а не от «где красивее Ribeira».",
      "Зачем: одна international school в Braga (CLIB) vs несколько tracks в Porto — от этого зависят район, бюджет T2 и километраж на арендованной машине.",
      "Главное: сначала школа, потом город; сравнение — в [Porto vs Braga](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
    ],
    bullets: [
      "Porto: temporary в Foz/Boavista/Matosinhos — ближе к OBS/CLIP/LFIP; аренда выше, expat-плотность больше, Metro + Andante дополняют авто.",
      "Braga: temporary у centro/Gualtar — ближе к CLIB; T2 дешевле, A3 до Porto ~45–60 мин, если нужен open day в CLIP/OBS.",
      "Медицина: urgência pediátrica — São João (Porto) или Hospital de Braga; inscrição SNS — по morada concelho, см. [медицину](/notes/" +
        MEDITSINA_NORTE_HEALTHCARE_SLUG +
        ").",
      "Климат одинаково сырой зимой в обоих городах — обогреватель и проверка bolor важнее «вида на Douro», см. [климат](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
      "Аренда long-term: бюджеты Foz vs Gualtar — в [аренде dolgosrok](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
    ],
  },
  {
    heading: "Типичные ошибки первого месяца",
    section_kind: "practice",
    paragraphs: [
      "Что делать: пройти список «чего не делать» до перевода caução и до отмены temporary.",
      "Зачем: семьи с ARI теряют недели не на инвестициях, а на порядке школа → адрес → банк.",
      "Главное: не копируйте чеклист Lisboa-D8 без правки под Norte и ARI.",
    ],
    bullets: [
      "Ошибка: искать long-term квартиру до shortlist школы — потом переезд через две недели.",
      "Ошибка: ехать в AIMA Lisboa «потому что так в чате», игнорируя Portal ARI и Loja в Norte.",
      "Ошибка: арендовать авто без Via Verde/EasyToll и удивляться штрафам portagens — см. [tolls](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        ").",
      "Ошибка: забыть caderneta/vacinas и apostille на birth certificate — admissions возвращает пакет.",
      "Ошибка: отменить частную страховку в день utente SNS — специалисты и педиатр ещё месяцы.",
    ],
  },
];

const keyTakeaways = [
  "Официально: NIF → comprovativo de morada → escola/SNS/банк; ARI-процесс и taxas — на [Portal ARI AIMA](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari), не «как у D7».",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim:
      "семьи с детьми в Norte чаще всего теряют первую неделю на неправильном порядке: Idealista до школы и банк до NIF ребёнка",
    forReader:
      "в дни 1–7 поставьте admissions и NIF семьи выше поиска «идеальной» T3 — temporary на 2–4 недели как раз для этого",
  }),
  "На практике: с арендованной машины в OPO сразу включайте Via Verde/EasyToll — иначе A3/A28 прилетят счетами позже; детали в гайде по платным дорогам.",
  "Расхождение: «первый месяц = Lisboa и Agora» → для семьи ARI в Porto/Braga база — школа Norte, Finanças/Junta локально и Portal ARI по вашему processo.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Для кого этот чеклист — какая семья?",
    a: "Да, ориентир — семья из трёх: обычно двое взрослых + один ребёнок школьного возраста. Если детей двое или есть младенец — те же блоки, плюс больше времени на pediatria и кресла в авто.",
  },
  {
    q: "С чего начать в первый день после OPO?",
    a: "Три шага: авто с детским креслом и Via Verde → temporary в Porto или Braga → eSIM и слот/визит в Finanças на NIF, если номеров ещё нет. По правилам школа не обязана в день 1; на практике visit — в первые три рабочих дня.",
  },
  {
    q: "Golden Visa — те же шаги, что у D7/D8?",
    a: "Нет, не один в один. По правилам быт (NIF, morada, школа, SNS) похож, а миграционный канал ARI идёт через Portal ARI / Loja AIMA. На практике сверяйте [aima.gov.pt](https://aima.gov.pt/) и адвоката; Emigro не заменяет юрконсультацию.",
  },
  {
    q: "Porto или Braga выбрать на первый месяц?",
    a: "От школы. По правилам оба города в Norte принимают SNS и Finanças локально. На практике несколько international tracks — temporary в Porto (Foz/Boavista/Matosinhos); CLIB и бюджет — Braga/Gualtar. Сравнение — [Porto vs Braga](/notes/" +
      PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
      ").",
  },
  {
    q: "Какие документы ребёнка просят в international school?",
    a: "Обычно 5–7 файлов: паспорт, NIF, transcripts, calendário/caderneta vacinação, comprovativo de morada; часто apostille + перевод свидетельства о рождении. По правилам точный список — у admissions; на практике пакет без vacinas возвращают. Обзор — [школы](/notes/" +
      INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
      ").",
  },
  {
    q: "Когда покупать машину вместо аренды?",
    a: "Не в дни 1–7. По правилам владение авто не нужно для ARI в первый месяц. На практике сначала школа и адрес, потом rent vs buy — [машина в Португалии](/notes/" +
      CAR_PORTUGAL_GUIDE_SLUG +
      "). На аренде сразу закройте tolls.",
  },
];

export const PERVYJ_MESYAC_CHECKLIST_GUIDE = {
  slug: PERVYJ_MESYAC_CHECKLIST_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первый месяц в Португалии: чеклист семьи с Golden Visa (Porto / Braga)",
  excerpt:
    "Семья из трёх, ARI, Norte: до прилёта, дни 1–3, недели 1–4 — школа в приоритете, аренда авто, NIF, SNS, Portal ARI. Porto vs Braga и чем GV отличается от D7/D8.",
  seo_title: "Первый месяц PT 2026 — семья GV Porto/Braga",
  seo_description:
    "Семья из трёх с Golden Visa в Португалии (Porto или Braga): чеклист первого месяца — школа в приоритете, аренда авто, NIF, SNS, AIMA. По дням и неделям.",
  quick_answer:
    "Вы выходите из OPO с двумя чемоданами и детским креслом — и едете сразу в Porto или Braga, не в Lisboa. Для семьи из трёх с Golden Visa (ARI) в Португалии первый месяц — школа в приоритете, NIF и temporary morada в неделю 1, SNS и шаги Portal ARI в неделю 2, long-term жильё и решение по машине к неделям 3–4. Правила ARI меняются: сверяйте aima.gov.pt и адвоката.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "AIMA — Portal ARI (Golden Visa)",
      url: "https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari",
    },
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "SNS — número de utente", url: "https://www.sns.gov.pt/" },
    { title: "Agora", url: "https://agora.imigrante.pt/" },
    { title: "Banco de Portugal", url: "https://www.bportugal.pt/" },
  ],
  topic_tags: ["nif", "aima", "sns", "bank", "arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["nif", "aima", "sns", "bank", "arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "golden-visa", "ari", "familia", "escola", "checklist"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:pervyj-mesyac-gv-norte",
};
