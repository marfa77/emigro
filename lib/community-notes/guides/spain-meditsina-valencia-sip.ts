/**
 * Hand-curated Spain satellite guide — SNS + SIP healthcare in Valencia.
 * Official san.gva.es / seg-social.es separated from cautious field practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { BANK_IBAN_SLUG } from "@/lib/community-notes/guides/spain-bank-iban-nerezident";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_SLUG } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const MEDITSINA_VALENCIA_SLUG = "meditsina-valencia-sip-sns-chastnaya-2026";

const GLOSSARY_INTRO =
  "Слова с tarjeta sanitaria, окна centro de salud и письма Seguridad Social — разберём до первого кашля, пока «SIP как в Португалии» не стоил вам месяца без médico de familia.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "SNS", context: "Sistema Nacional de Salud", ru: "государственная система здравоохранения Испании; в CV доступ через SIP" },
  { pt: "SIP", context: "Sistema de Información Poblacional", ru: "реестр пациентов CV; tarjeta sanitaria SIP — ваш ID в публичной системе" },
  { pt: "centro de salud", ru: "поликлиника первичной помощи по domicilio; сюда идут за alta SIP и médico de cabecera" },
  { pt: "médico de familia", context: "médico de cabecera", ru: "участковый терапевт (GP); запись через cita previa или APP Sanitat" },
  { pt: "urgencias", ru: "приёмное отделение hospital; для угрозы жизни — 112, не «просто кашель»" },
  { pt: "Seguridad Social", context: "INSS", ru: "соцстрах; alta как trabajador/pensionista даёт право на asistencia sanitaria" },
  { pt: "empadronamiento", context: "padrón", ru: "прописка по адресу; certificado часто нужен для SIP и ASU" },
  { pt: "copago farmacéutico", ru: "доплата за рецептурные лекарства; % зависит от renta (дохода) по IRPF" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор спорных формулировок. **OK** — сверено с san.gva.es / seg-social.es на 2026; **soft** — чаты и рынок без фиксированной цены; **fixed** — типичная путаница с PT utente. Не юридическая консультация.",
    ],
    bullets: [
      "OK: tarjeta sanitaria **SIP** — документ Comunitat Valenciana, действует **по всей Испании**; за пределами EU для поездок — Tarjeta Sanitaria Europea через **INSS**, не SIP ([san.gva.es FAQ](https://www.san.gva.es/es/web/tarjeta-sanitaria/preguntas-frecuentes)).",
      "OK: alta в SIP — telemáticamente («Alta de un ciudadano en el Sistema de Información Poblacional») с certificado digital / Cl@ve **или** лично в **centro de salud más cercano** к domicilio ([san.gva.es](https://www.san.gva.es/es/web/tarjeta-sanitaria)).",
      "OK: право на asistencia sanitaria признаёт **INSS**; с документом о покрытии — tarjeta в **centro de salud que le corresponda** ([seg-social.es](https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/44539/43384/45200)).",
      "OK: экстренная медицина в CV — звонок **112**; оператор 112CV передаёт в **CICU**, mobiliza **SAMU** ([ses.san.gva.es](https://ses.san.gva.es/es/)).",
      "Fixed: «SIP = utente SNS Португалии» → разные реестры: в ES после alta SS/SIP в **centro de salud** по адресу, не через sns.gov.pt.",
      "Soft / UNCHECKED: цены Sanitas, DKV, Adeslas и частных consultas — **не фиксированы законом**; simulación индивидуальна, цифры из чатов не копируйте.",
      "Soft: **estancia temporal** vs **residencia** — право на публичное покрытие зависит от статуса, SS и RD 180/2026; не переносите «автоматом SIP с визой D» без проверки вашего título ([san.gva.es — estancia temporal](https://www.san.gva.es/es/web/tarjeta-sanitaria)).",
      "OK / soft: **Convenio Especial** CV — при ≥1 года residencia efectiva и empadronamiento в CV, без другого публичного покрытия: cuota **€60/мес.** (<65) или **€157/мес.** (≥65), farmacia **не включена** (FAQ san.gva.es).",
    ],
  },
  {
    heading: "Официально: SNS, SIP и право на asistencia sanitaria",
    section_kind: "official",
    paragraphs: [
      "Sistema Nacional de Salud покрывает первичную помощь, специалистов по направлению, госпитализацию и рецептурную фармацию с copago. В Comunitat Valenciana ваш пропуск в систему — **tarjeta sanitaria SIP** (физическая или виртуаль в **GVA+Salut**). Это не «медстраховка на год», а административный ID пациента после включения в **Sistema de Información Poblacional**.",
      "Titular права на asistencia sanitaria — граждане ES с residencia habitual, иностранцы с **residencia legal y habitual** без обязательного покрытия «другим título», а также аsegurados Seguridad Social и их beneficiarios. **INSS** (Instituto Nacional de la Seguridad Social) признаёт право; **centro de salud** оформляет SIP и назначает **médico de familia** по domicilio.",
      "Trabajador en alta en Seguridad Social **не подаёт отдельную заявку** на право — достаточно документов в centro de salud. Autónomo после **alta en RETA** и nómina в SS идёт тем же путём. Пока alta нет, многие релоканты держат **seguro privado** — это не замена права, а мост на первые месяцы.",
    ],
    bullets: [
      "Alta SIP online: trámite «Alta de un ciudadano en el SIP» на портале GVA — нужны certificado digital или Cl@ve ([san.gva.es/tarjeta-sanitaria](https://www.san.gva.es/es/web/tarjeta-sanitaria)).",
      "Без Cl@ve: **centro de salud más cercano** к domicilio — паспорт/NIE, certificado empadronamiento (рекомендуют vigente **6 meses**), документ INSS о derecho asistencia sanitaria.",
      "Beneficiario asegurado: cita в INSS + документы семьи; centro de salud выдаёт SIP каждому beneficiario.",
      "Número SIP — на tarjeta или documento de inclusión; без него cita previa и рецепты в SNS не работают.",
      "Cita previa к médico de familia: APP **Sanitat**, web san.gva.es, телефон centro de salud с tarjeta SIP или **96 183 90 00** (FAQ san.gva.es).",
      "Copago farmacéutico: % доплаты за лекарства по renta IRPF; часть коллективов (pensionistas <€18k и др.) получает subvenciones CV — проверка на san.gva.es.",
    ],
  },
  {
    heading: "Официально: без SS, ASU и Convenio Especial",
    section_kind: "official",
    paragraphs: [
      "Не каждый expat попадает в SIP в первую неделю. Если нет alta Seguridad Social и нет другого título, портал CV описывает отдельные маршруты — **Asistencia Sanitaria Universal (ASU)** через **trabajador/a social sanitario/a** в centro de salud и **Convenio Especial** для тех, кто прожил в ES **≥1 año** без публичного покрытия.",
      "Extranjero/a **regular sin recursos** направляется в centro de salud → derivación к social sanitario → documento de asistencia temporal на время рассмотрения (до **3 meses** на resolución ASU по FAQ). **Extranjero irregular** — тоже через centro de salud и social; после urgencias hospitalarias нужно как можно скорее явиться в centro de salud.",
      "Convenio Especial — платный доступ к публичной asistencia (без farmacia): empadronamiento в CV, **1 año residencia efectiva** непрерывно, отсутствие другого публичного покрытия. Cuota domiciliada en cuenta bancaria; подача в registros Sanidad CV или telemáticamente.",
    ],
    bullets: [
      "ASU: solicitud в centro de salud — pasaporte/NIE, certificado empadronamiento, residencia efectiva **≥3 meses** (FAQ); отсутствие одного документа **не отменяет** cita с social.",
      "ASU одобрена: cobertura **1–2 года**, продление через centro de salud до caducidad.",
      "ASU отказ: право на информацию о denegación; альтернатива — seguro privado или Convenio Especial при eligibility.",
      "Convenio Especial: **€60/mes.** (<65), **€157/mes.** (≥65); farmacia **исключена** — закладывайте отдельно.",
      "Ciudadanos UE desplazados: Tarjeta Sanitaria Europea из страны происхождения + centro de salud → documento de inclusión temporal.",
      "Estancia temporal / RD 180/2026: отдельные страницы на san.gva.es — **не приравнивайте** к автоматическому SIP без чтения вашего supuesto.",
    ],
  },
  {
    heading: "SIP и centro de salud на практике в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Valencia — крупный Departamento de Salud с десятками **centros de salud**; ваш назначается по **domicilio** (адресу empadronamiento), а не по «красивому району на карте». Точное имя и телефон cita previa смотрите на [san.gva.es](https://www.san.gva.es/es/web/tarjeta-sanitaria) или в APP Sanitat после alta — **не копируйте чужой centro из чата**: сосед в Ruzafa и вы в Benimaclet попадут в разные CS.",
      "Типовой маршрут релоканта с visado D / autónomo / employment: **NIE → empadronamiento → alta SS (если применимо) → centro de salud с пакетом → SIP + médico de cabecera**. Параллельно — частный полис на gap между landing и alta. Порядок документов — в [NIE и empadronamiento](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ") и [первые 30 дней](/notes/" +
        PERVYE_30_SLUG +
        ").",
      "Первичный приём médico de familia часто через **cita previa** — не walk-in «как к терапевту в поликлинике». Острая, но не угрожающая жизни ситуация: cita mismo día или urgencias centro/hospital по triaje — ожидание в чатах **часы**, не «15 минут как в частной».",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "без certificado de empadronamiento centro de salud часто откладывает alta SIP, хотя формально просят vigente 6 meses — resguardo + contrato не всегда заменяют certificado",
        forReader:
          "запросите certificado сразу после padrón в ayuntamiento Valencia — это же нужно банку и TIE",
      }),
      formatPracticeBullet({
        channels: ["spain_granitsa"],
        period: "2025–2026",
        claim:
          "между resguardo alta Seguridad Social (autónomo/empleo) и физической tarjeta SIP проходили 2–6 недели; до карты принимали documento INSS + NIE",
        forReader:
          "сохраните PDF derecho asistencia sanitaria и número provisional SIP с первого визита в CS",
      }),
      "Смена domicilio: comunicar в centro de salud или telemáticamente — вам назначат **nuevo centro de salud** по новому padrón (FAQ san.gva.es).",
      "Libre elección médico/centro: solicitud в выбранном CS — ответ до **15 días**; молчание администрации = resolución favorable (FAQ).",
      "GVA+Salut: tarjeta SIP virtual на телефоне — удобнее, чем ждать пластик; на admissión urgencias показывайте virtual + pasaporte/NIE.",
      "Язык: в CS Valencia часто испанский/валенсийский; английский в частных Quirónsalud / Vithas / IMED — не в каждом CS.",
      "Pediatra: при alta ребёнка — documentación bebé; иногда SIP provisional 3 meses выдают в hospital de parto (FAQ).",
      "Связка с банком: domiciliación Convenio Especial требует ES IBAN — см. [банк и IBAN](/notes/" + BANK_IBAN_SLUG + ").",
    ],
  },
  {
    heading: "Экстренная помощь: 112, SAMU и urgencias в Valencia",
    section_kind: "practice",
    paragraphs: [
      "При угрозе жизни — **112**. В Comunitat Valenciana звонок принимает **112CV**, alerta передаётся в **Centro de Información y Coordinación de Urgencias (CICU)**, mobiliza **Servicio de Ayuda Médica Urgente (SAMU)** или другой ресурс по triaje. Звонок возможен **без saldo** на телефоне. Оператор попросит адрес, возраст, дышит ли пациент; может провести по телефону RCP до приезда бригады.",
      "Urgencias hospitalarias — для острых состояний, которые нельзя ждать cita у médico de familia: сильная боль, лихорадка у младенца, травма, подозрение на инфаркт/инсульт. «Насморк и лёгкое недомогание» — низкий triaje; ожидание зависит от загрузки и приоритета, без обещания фиксированных 4–8 часов.",
      "Крупные **hospitales públicos** с urgencias 24h в área Valencia (Departamentos de Salud san.gva.es): **Hospital General Universitario de Valencia**, **Hospital Universitari i Politècnic La Fe**, **Hospital Universitari Doctor Peset**, **Hospital Clínico – La Malva-Rosa**. Выбор «ближайший с urgencias» логичнее, чем ехать «в самый известный» через весь город. Адреса и карта — на портале Conselleria, не в этом гайде: сверяйте перед поездкой.",
    ],
    bullets: [
      "112 — единый номер экстренной медицины в CV; **061** в регионе интегрирован в цепочку через 112 (ses.san.gva.es).",
      "На admissión urgencias: SIP / documento inclusión, pasaporte/NIE, список alergias и medicación habitual.",
      "Без SIP: при реальной emergencia не откажут; последующий trabajador social / счёт — отдельный разговор; не рискуйте «потом оформлю».",
      "Transporte: SAMU — emergencia; перевод между hospitalами — «transporte secundario» по решению CICU, не «вызов такси в urgencias».",
      "Частные urgencias (Quirónsalud, Vithas, HLA) — с seguro privado или полная оплата; triaje быстрее, но без poliza дорого (**soft / UNCHECKED** — simulación у страховщика).",
      "Pediatría urgente: La Fe и General — частые точки в чатах семей; проверьте актуальный SAIP pediátrico вашего departamento.",
      "После urgencias: если нет SIP — FAQ san.gva.es просит как можно скорее идти в **centro de salud** для follow-up и social.",
      "Сохраните 112 и телефон cita previa своего CS в контактах до первой болезни.",
    ],
  },
  {
    heading: "Стоматология и что в SNS почти всегда частное",
    section_kind: "practice",
    paragraphs: [
      "Для взрослых публичная **стоматология** не равна «только удаление»: cartera CV включает профилактику, диагностику, лечение острых инфекций/травм, exodoncias и малую хирургию. Ortodoncia, импланты (кроме специальных показаний) и чисто эстетические процедуры обычно исключены, поэтому плановая восстановительная стоматология часто остаётся частной.",
      "Цены consulta / limpieza / corona в Valencia **не регламентированы** для частного рынка — в Nota Emigro помечены как **UNCHECKED**. Запрашивайте presupuesto до кресла; poliza Sanitas/DKV/Adeslas покрывает dental только на старших тарифах — читайте cobertura.",
    ],
    bullets: [
      "SNS dental: дети и программы salud pública — cita через centro de salud; взрослым полный спектр **не гарантирован**.",
      "Частная consulta dentista Valencia — **soft**: участники @valenforum в 2025–2026 называли первичный приём «десятки евро», limpieza выше; simulación обязательна.",
      "Urgencia dentaria (боль, absceso): частные clínicas « mismo día »; SNS — triaje и очередь, не «за час».",
      "Seguro privado: dental rider часто с **carencia** 3–6 meses — не отменяйте полис visado до проверки waiting period.",
      "Receita médica SNS vs частный dentista: в аптеке (farmacia) copago только по рецепту médico SNS; частный receituário — полная цена.",
      "Детский dentista RU/EN: ищите через международные школы и @valenciarusia — не через urgencias hospital.",
      "Не путайте «медосмотр для прав» (psicotécnico / reconocimiento médico) со стоматологией — разные центры.",
      "К 4–6 месяцу профилактика (limpieza) часто дешевле, чем лечение запущенного кариеса без poliza — заложите в бюджет.",
    ],
  },
  {
    heading: "Частная страховка: Sanitas, DKV, Adeslas и месяцы 1–6",
    section_kind: "practice",
    paragraphs: [
      "Частная страховка требуется не «для TIE вообще», а только когда она является условием конкретного visado/autorización (например, no lucrativa). Arrendador не устанавливает миграционное требование. Пока нет публичного покрытия, полис закрывает consulta, pruebas и частные urgencias; после SIP его сохраняют по желанию и по условиям autorización.",
      "Sanitas, DKV, Adeslas, Asisa — типовые бренды в ES; **red de centros** (сеть клиник) и franquicia/copago различаются. **Цены simulación — UNCHECKED** в этом гайде: возраст, preexistencias и copago меняют премию в разы.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["spain_granitsa", "valenforum"],
        period: "2025–2026",
        claim:
          "на visado/TIE держали poliza Sanitas или Adeslas 6–12 meses параллельно SIP — especialista SNS «через 4+ месяца», частная consulta «на неделе»",
        forReader:
          "не отменяйте seguro в день получения tarjeta SIP; сначала дождитесь первой cita médico de familia",
      }),
      "Poliza для маршрута, где seguro обязателен: сверяйте cobertura, carencias и copagos с требованиями именно вашей autorización; travel policy не подменяет полноценное покрытие, если его требует trámite.",
      "Red concertada: лечение вне сети — 100% или высокий copago; перед подписью откройте карту centros в Valencia.",
      "Autónomo: alta RETA даёт SNS; seguro privado остаётся опцией для dental/ortopedia, не обязанностью SS.",
      "EHIC / GHIC (EU passport holders): краткий визit — не заменяет SIP при relocación; desplazamiento ≠ residencia.",
      "Reembolso: частные polizas требуют autorización prévia на RMN/TAC — 24–72 ч; без неё отказ в оплате.",
      "Telemedicina в poliza — удобна для receta повторная, не для urgencias с triaje.",
      "Assist / gestoría: при спорном статусе (estancia vs residencia) не угадывайте право — [Route Check Emigro Assist](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=meditsina-valencia).",
    ],
  },
  {
    heading: "Где san.gva.es и жизнь расходятся",
    section_kind: "gap",
    paragraphs: [
      "Портал описывает trámite; Valencia добавляет очереди padrón, SS и перегруженные CS. Типичные расхождения из @valenforum, @valenciarusia и @spain_granitsa — не закон, но то, на что вы наткнётесь.",
    ],
    bullets: [
      "Портал: «alta telemática за minutos» → без Cl@ve и certificado empadronamiento реальный путь — **balcão CS** с очередью.",
      "«SIP = бесплатно всё» → copago farmacéutico, частная dental и franquicia seguro остаются.",
      "«С visado D SIP сразу» → без alta SS / ASU / Convenio часто **только seguro privado** до отдельного trámite.",
      "«061 быстрее 112» → в CV официальная цепочка emergencia через **112 → CICU → SAMU**.",
      "«Любой hospital для GP» → médico de familia только в **вашем CS**; hospital — urgencias и especialistas по derivación.",
      "«Отменил seguro — экономлю» → especialista SNS 3–6 meses; одна частная RMN без poliza бьёт по бюджету сильнее годовой премии (**soft**).",
    ],
  },
  {
    heading: "Типичные ошибки первых месяцев",
    section_kind: "practice",
    paragraphs: [
      "Ошибки повторяются в Valencia не потому, что «система против иммигрантов», а потому что SNS, SIP, SS и seguro privado — **четыре разных слоя**. Список ниже — то, что стоит проверить до первой temperature 39 °C.",
    ],
    bullets: [
      "Ошибка: ждать TIE для SIP — при alta SS и padrón можно идти в CS **раньше** plástico TIE; нужны NIE + empadronamiento + documento SS.",
      "Ошибка: ехать в La Fe urgencias с насмorkом — triaje низкий, **5+ часов**; сначала cita CS или teléfono consulta.",
      "Ошибка: путать SIP с poliza visado — TIE renewal просит **действующий seguro** даже при SIP.",
      "Ошибка: не обновить domicilio в SIP после переезда — остались прикреплены к CS на другом конце города.",
      "Ошибка: «PT utente работает в ES» — нужен **новый alta SIP** в CV, не перенос número de utente PT.",
      "Ошибка: игнорировать derivación — especialista SNS без volante от médico de familia часто **не примет**.",
      "Ошибка: один certificado empadronamiento на все trámites — для SIP/TIE лучше **vigente <3–6 meses**.",
      "Ошибка: не сохранить documento INSS / inclusión temporal — без него urgencias оформляют медленнее.",
    ],
  },
  {
    heading: "К 4–6 месяцу: когда SIP «есть», а быт всё ещё частный",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу в Valencia у многих уже есть tarjeta SIP, médico de cabecera в контактах и привычка звонить **96 183 90 00** для cita. Но именно здесь всплывает отложенное: seguro privado всё ещё оплачивается «на всякий случай», dental так и не записали, а volante к traumatólogo так и висит в очереди.",
      "Если alta Seguridad Social случилась только на 3–4 месяце (autónomo, смена contrato), SIP мог оформиться поздно — **carencia** частной poliza и реальное SNS-покрытие **перекрываются не с первого дня**. К 4–6 месяцу имеет смысл пересчитать: нужен ли полный dental rider, осталась ли franquicia seguro выше copago SNS, обновлён ли empadronamiento после смены аренды.",
      "Семьи с детьми: pediatra CS + школьные формы salud — проверьте, что SIP детей активен, не только родителей. Без этого vacunas программы salud pública и cita pediátrica упираются в administrativo, не в врача.",
      "Маршрут статуса и документов — [wizard Испания](https://www.emigro.online/ru/spain/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=meditsina-valencia); при спорном праве на asistencia — [Emigro Assist](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=meditsina-valencia).",
    ],
    bullets: [
      "Пересмотр seguro: после стабильного médico de familia можно снизить тарif, но **не отменяйте hospitalización** до первой успешной derivación SNS.",
      "Convenio Especial: если год в ES без SS близок — готовьте документы **1 año residencia efectiva** заранее (FAQ san.gva.es).",
      "Farmacia: проверьте tramo copago в APP Sanitat / receta — renta IRPF влияет на % с года на год.",
      "Плановые операции: volante + lista espera SNS **месяцы**; если срок критичен — autorización seguro privado или segunda opinión (**soft**).",
      "Renovación/autorización: seguro privado должен быть activo только если это требование вашего основания; не переносите условие no lucrativa на work/SS cases.",
      "Historial médico: запросите volantes и informes из частных clínicas — при переходе на SNS médico de familia не видит их автоматически.",
    ],
  },
];

const keyTakeaways = [
  "Официально: derecho asistencia sanitaria — INSS/SS; tarjeta SIP — centro de salud по domicilio; emergencia CV — **112** → CICU → SAMU.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "без empadronamiento и documento SS alta SIP в Valencia часто сдвигается на недели, а релоканты держат Sanitas/Adeslas параллельно SIP",
    forReader:
      "закройте padrón и SS до отмены seguro visado; centro de salud назначается по адресу на san.gva.es — не копируйте чужой CS",
  }),
  "На практике: urgencias La Fe/General — для emergencia; насморк в CS или частная consulta; стоматология взрослым — почти всегда privado.",
  "Расхождение: «SIP бесплатный и сразу с visado» vs copago, очереди especialistas и seguro privado на месяцы 1–6; цены Sanitas/DKV — simulación, не цифры из чата.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как получить tarjeta SIP в Valencia?",
    a: "По правилам san.gva.es: alta en SIP telemáticamente (Cl@ve/certificado digital) или в centro de salud más cercano к domicilio с NIE/pasaporte, certificado empadronamiento (рекомендуют 6 meses vigente) и documento INSS о derecho asistencia sanitaria, если вы asegurado/beneficiario SS. На практике в @valenforum без padrón часто откладывают визит — сначала [empadronamiento](/notes/" +
      NIE_EMPADRONAMIENTO_SLUG +
      ").",
  },
  {
    q: "Как узнать свой centro de salud?",
    a: "По правилам CV centro назначается по domicilio empadronamiento. На практике после alta SIP смотрите назначенный CS в APP GVA+Salut / Sanitat или на san.gva.es — не используйте чужой адрес CS из чата; при переезде comunicar cambio de domicilio в CS.",
  },
  {
    q: "Нужна ли частная страховка при SIP?",
    a: "Зависит от visado/TIE и очередей. По правилам TIE и многих visados нужен seguro privado на подачу. На практике expat держат Sanitas/DKV/Adeslas для dental и especialistas, пока SNS volante идёт месяцами; цены — только simulación (**UNCHECKED** в гайде).",
  },
  {
    q: "Куда ехать в urgencias в Valencia?",
    a: "При угрозе жизни — **112**. По правилам CV CICU mobiliza SAMU. Urgencias hospitalarias 24h: Hospital General, La Fe, Doctor Peset, Clínico La Malva-Rosa — ближайший с triaje. На практике при «не экстренно» ожидание 4–8+ ч; лёгкие симптомы — cita médico de familia.",
  },
  {
    q: "Покрывает ли SNS стоматологию?",
    a: "По правилам SNS — ограниченно (дети, льготы, некоторые extracciones). На практике взрослым implantes/ortodoncia/estética — privado; limpieza и consulta — simulación у dentista или dental rider seguro (**цены UNCHECKED**).",
  },
];

export const MEDITSINA_VALENCIA_GUIDE = {
  slug: MEDITSINA_VALENCIA_SLUG,
  category: "Здоровье и быт",
  content_kind: "guide" as ContentKind,
  title: "Медицина Valencia 2026: SIP, SNS, частная страховка и urgencias",
  excerpt:
    "Tarjeta sanitaria SIP, centro de salud по padrón, médico de familia, 112/SAMU, La Fe и General, Sanitas/DKV/Adeslas на месяцы 1–6, стоматология privada — практический гайд для релокантов в Comunitat Valenciana.",
  seo_title: "Медицина Valencia 2026 — SIP, SNS, seguro",
  seo_description:
    "Медицина Valencia 2026: tarjeta SIP, centro de salud, 112 и SAMU, Hospital La Fe, seguro на месяцы 1–6. Практика SNS и частной клиники для RU/BY в CV.",
  quick_answer:
    "В Valencia базовый путь: empadronamiento → derecho asistencia sanitaria (INSS/SS, если требуется признание) → alta SIP в centro de salud по адресу → cita previa. Экстренные — **112** (CICU/SAMU). Публичная стоматология взрослым покрывает профилактику и часть острых/хирургических случаев, но не большинство ортодонтии, имплантов и эстетики; частный полис держите, пока он нужен по вашему основанию или для удобства.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Conselleria Sanidad — Tarjeta Sanitaria SIP", url: "https://www.san.gva.es/es/web/tarjeta-sanitaria" },
    { title: "SIP — Preguntas frecuentes (san.gva.es)", url: "https://www.san.gva.es/es/web/tarjeta-sanitaria/preguntas-frecuentes" },
    { title: "Seguridad Social — Asistencia Sanitaria", url: "https://www.seg-social.es/wps/portal/wss/internet/InformacionUtil/44539/43384/45200" },
    { title: "Servicio de Emergencias Sanitarias CV — 112", url: "https://ses.san.gva.es/es/" },
    { title: "Sanidad CV — cartera de atención primaria", url: "https://www.san.gva.es/documents/d/assistencia-sanitaria/2_cartera_servicios_atencion_primaria_comunitaria_resumida_es-pdf" },
    { title: "Trámites Seguridad Social", url: "https://tramites.seg-social.es/" },
  ],
  topic_tags: ["sns", "spain", "valencia", "sip"],
  hashtags: buildNoteHashtags({
    topicTags: ["sns", "spain", "valencia", "sip"],
    contentKind: "guide",
    extra: ["salud", "seguro", "stomatologia", "urgencias", "empadronamiento"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:health-valencia",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
