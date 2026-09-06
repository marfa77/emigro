/**
 * Hand-curated Spain satellite guide — SIM, home internet, luz/gas/agua in Valencia.
 * Official CNMC / EMIVASA / operator pages separated from field practice in chats.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const SIM_INTERNET_LUZ_SLUG = "sim-internet-luz-valencia-2026";

const GLOSSARY_INTRO =
  "Эти слова всплывают в салоне оператора, в письме от comercializadora и в переписке с propietario ещё до того, как вы успели разложить чемоданы. Разберём их заранее — так проще не перепутать «смену titular» с полной alta и не ждать fibra там, где в доме нет roseta.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "prepago", ru: "оплата связи авансом; линия без contrato de permanencia — типичный старт в день прилёта" },
  { pt: "eSIM", ru: "виртуальная SIM в телефоне; у операторов ES правила отличаются от prepago и portabilidad" },
  { pt: "CUPS", ru: "20–22 символа — «номер» точки luz/gas; без него comercializadora не оформит suministro" },
  { pt: "PVPC", context: "Precio Voluntario al Pequeño Consumidor", ru: "регулируемая tarifa luz через comercializador de referencia; альтернатива — mercado libre" },
  { pt: "cambio de titular", ru: "смена имени на действующем счётчике; быстрее и дешевле, чем alta nueva, если luz уже была" },
  { pt: "CIE", context: "Certificado de Instalación Eléctrica", ru: "boletín eléctrico; обязателен при alta nueva или если instalación >20 años без revisión" },
  { pt: "EMIVASA", context: "Aguas de Valencia", ru: "единственный operador agua potable в municipio Valencia; alta через oficina virtual или 963 860 600" },
  { pt: "domiciliación", ru: "списание со счёта по mandato SEPA; отказ только из-за страны IBAN может быть незаконной IBAN discrimination" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткая сверка черновика с порталами CNMC, EMIVASA, Endesa и операторов — без вырезания полевой практики. OK = совпадает с официальной страницей; soft = ориентир рынка/чатов; fixed = смягчено под норму; UNCHECKED = не подтверждено fetch в этой сессии.",
    ],
    bullets: [
      "OK / soft: Orange официально предлагает no residentes только prepago, но найденная страница не перечисляет допустимые документы. Паспорт как KYC для покупки в конкретном салоне — подтверждайте у оператора; не выдаём это за текст страницы Orange.",
      "OK: Digi prepago — primera SIM en punto de venta; eSIM en web oficial описана для clientes de contrato vía Mi DIGI con DNI escaneado (digimobil.es).",
      "OK: CNMC comparador — comparador.cnmc.gob.es; PVPC (luz) y TUR (gas) vs mercado libre; cambio comercializador gratuito, plazo máximo 21 días (cnmc.es).",
      "OK: Endesa — alta nueva pide CIE/CUPS; cambio compañía/titular — DNI, IBAN, dirección (endesa.com documentación).",
      "OK / soft: derechos de acometida luz BT — acceso 19,703137 €/kW, extensión 17,374714 €/kW, enganche 9,04476 €/actuación sin IVA (CNMC guía factura); extensión no se paga si suministro activo <3 años.",
      "OK: EMIVASA alta con contador existente 15 mm — total tarifa 37,08 € + IVA según anuncio BOPV 2026/03822 (emivasa.es PDF SUMINISTROYENGANCHE2026).",
      "Soft: сроки fibra «24–48 h» — с movistar.es; в старом фонде Valencia бывают 5–10 días — не универсальный SLA.",
      "UNCHECKED: точные депозitos Naturgy/Iberdrola online для extranjero solo con pasaporte без NIE — сверяйте canal asistido, не копируйте суммы из блогов.",
      "UNCHECKED: нужна ли Licencia de Segunda Ocupación для EMIVASA в каждом caso de alquiler — уточняйте en oficina virtual al introducir dirección.",
    ],
  },
  {
    heading: "Официально: связь, luz, gas y agua в Valencia",
    section_kind: "official",
    paragraphs: [
      "Испания делит телеком и энергетику на регулируемые и свободные рынки, но для релоканта важнее другое: móvil prepago обычно закрывается без банковского пакета, но с идентификацией titular; fibra и luz требуют адрес и платёжные данные; agua в municipio Valencia — отдельный contrato с EMIVASA, если договор аренды не говорит иначе.",
      "Электричество: comercializadora (Endesa, Iberdrola, Naturgy и др.) продаёт tarifa, а distribuidora i-DE / UFD / e-distribución обслуживает contador. Cambio de titular или cambio de comercializador — бесплатный для потребителя процесс до 21 días; alta nueva с CIE — дороже из‑за derechos de acceso y enganche. Gas natural в квартире Valencia встречается реже электричества, но логика та же: CUPS, CIG при alta nueva, TUR или mercado libre — сравнивать через CNMC.",
      "Voda: EMIVASA (Empresa Mixta Valenciana de Aguas) обслуживает ciudad de València; alta, cambio titular и lectura — через oficina virtual emivasa.es или teléfono 963 860 600. Tarifas 2026 опубликованы в BOPV; cuota de alta con contador existente для типичного 15 mm — отдельная строка в официальном PDF, не «деposito наугад».",
    ],
    bullets: [
      "Prepago móvil: операadores обязаны registrar línea на titular (Orange — validación DNI/pasaporte/NIE en tienda o SMS).",
      "Fibra: comercializadora проверяет cobertura по dirección; instalación — cita técnico (Movistar указывает 24–48 h en casos habituales).",
      "Luz — PVPC через comercializador de referencia или fixed price en mercado libre; simular — CNMC «Entiende tu factura».",
      "Cambio comercializador luz/gas: gratuito; nuevo comercializador gestiona trámites (CNMC guía cambio).",
      "EMIVASA: contrato agua — NIE/DNI titular, dirección, IBAN domiciliación; tarifas alta 2026 en PDF oficial EMIVASA.",
      "Contrato utilities на inquilino legalmente возможен; propietario не обязан оставаться titular, если contrato de alquiler это допускает.",
    ],
  },
  {
    heading: "Официально: fibra en casa — cobertura y titular",
    section_kind: "official",
    paragraphs: [
      "Домашний internet в Valencia — это contrato de fibra (o ADSL/radio donde no hay FO) с установкой router. Официально titular — тот, кто подписывает и domicilia recibos; arrendador не должен быть в contrato, если вы inquilino с pasaporte/NIE и IBAN. Movistar, Orange, Vodafone, Digi и O2 venden paquetes fibra+móvil; cobertura проверяется по calle и número, не по району в чате.",
      "Contrato postpago fibra обычно exige identificación и cuenta bancaria; permanencia зависит от oferta — у Movistar на сайте есть tarifas sin permanencia. Если в квартире уже была fibra предыдущего жильца, alta на ваше имя часто быстрее полной instalación с нуля, но técnico всё равно verifica roseta y CTO del edificio.",
    ],
    bullets: [
      "Documentos típicos fibra postpago: документ identificación, IBAN/mandato SEPA, email, teléfono contacto, dirección completa; конкретный KYC зависит от operador.",
      "Cobertura: introducir dirección en web operador; si no hay FO — alternativa radio 5G según operador (Movistar Hogar Conectado 5G).",
      "Instalación: cita con técnico; router y ONT — propiedad operador salvo compra.",
      "Combinar fibra + móvil postpago — часто дешевле, но требует contrato, не prepago SIM del aeropuerto.",
      "Cambio titular fibra — gestión en tienda o área cliente; distinto de portabilidad móvil.",
    ],
  },
  {
    heading: "Практика Valencia: número в день прилёта",
    section_kind: "practice",
    paragraphs: [
      "Аэропорт VLC или центр — не место для «идеального» тарифа, но место, где вы перестаёте зависеть от roaming. Пока документы и счёт ещё в пути, разумный маршрут — prepago после идентификации titular, без обещаний «eSIM без документов».",
      "Orange официально пускает no residentes только en prepago; документ для идентификации уточняйте в конкретном canal. Digi prepago по сайту начинается с SIM en punto de venta. Страница рекламирует eSIM, но не подтверждает в найденном тексте полный первичный prepago eSIM-flow.",
      "После [NIE и padrón](/notes/nie-empadronamiento-poryadok-2026) можно portar номер на contrato или подключить fibra+móvil пакет; до этого держите prepago для SMS банков и cita extranjería.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "spain_granitsa"],
        period: "2025–2026",
        claim:
          "в день прилёта в VLC покупали prepago Orange или Digi en tienda с pasaporte — línea activa после первой llamada o recarga",
        forReader:
          "берите оригинал pasaporte; contrato postpago без NIE/IBAN часто откладывают на неделю 2",
      }),
      "Orange prepago: no residentes допускаются к modalidad prepago; документы и активацию подтвердите в tienda.",
      "Digi prepago: solicitar SIM en punto de venta; activar tarifa vía *100# o Mi DIGI (digimobil.es).",
      "eSIM Digi: доступность для нового prepago подтвердите в punto de venta; официальная prepago-страница не описывает полный первичный eSIM-flow.",
      "Evitar «SIM turística» только online без registro — línea puede bloироваться без validación titular.",
      "Wi‑Fi отеля/Airbnb — не sustituto móvil para cita TIE и banca; нужен свой número ES.",
    ],
  },
  {
    heading: "Практика: fibra, luz, gas y EMIVASA после contrato",
    section_kind: "practice",
    paragraphs: [
      "Типовая последовательность после [аренды в Valencia](/notes/arenda-valencia-idealista-2026): рабочий счёт SEPA → cambio titular luz (если contador активен) → fibra → EMIVASA agua → gas, если hay caldera individual.",
      "На практике propietario иногда оставляет luz на себе и включает сумму в renta — это legal si está en contrato, но для TIE и прозрачности расходов inquilino чаще выгоднее titularidad на себе. CUPS берут с factura anterior или через distribuidora по dirección.",
      "EMIVASA: oficina virtual на emivasa.es — выбрать Valencia; для alta con contador existente cuota 2026 для 15 mm — 37,08 € + IVA по официальному PDF (soft: plazo activación ~48 h laborables en guías EMIVASA, не garantía).",
      "К месяцу 2–3 приходят первые facturas bimestrales agua и mensuales luz; если domiciliación не настроена — riesgo corte por impago, даже при «я только переехал».",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenciarusia", "spainchats"],
        period: "2025–2026",
        claim:
          "после NIE + IBAN cambio titular Endesa/Iberdrola online занимал 3–7 días; alta nueva с CIE — дольше и с derechos en primera factura",
        forReader:
          "спросите propietario factura vieja для CUPS до подписи acta de entrega",
      }),
      "Fibra: Digi/Movistar/Orange — pedir cita instalación; en edificios antiguos Ruzafa/Ciutat Vella técnico puede demorar roseta.",
      "Luz potencia 3,45–4,6 kW — типичный rango piso T2; subir potencia — derechos acceso/extensión según CNMC.",
      "Gas: si solo cocina eléctrica — alta gas puede не понадобиться; verificar caldera y CUPS gas en factura.",
      "EMIVASA: teléfono 963 860 600; documentos NIE, contrato alquiler, IBAN — soft-verify lista en oficina virtual.",
      "Comparar tarifas luz/gas antes de firmar — comparador.cnmc.gob.es, не только «tarifa del portalero».",
      "Guardar PDF expediente каждого alta — нужны при reclamación y para historial arrendamiento.",
    ],
  },
  {
    heading: "Где portal oficial y чат расходятся",
    section_kind: "gap",
    paragraphs: [
      "Сайты comercializadoras рисуют «online en 5 minutos», а extranjero с pasaporte без NIE попадает en canal telefónico. Это не отказ в suministro — другой procedimiento verificación.",
      "В чатах обещают «luz sin contrato de alquiler»; Endesa формально просит acreditar uso del inmueble. На практике cambio titular иногда проходит с dirección + DNI, но риск дозапроса contrato остаётся.",
    ],
    bullets: [
      "На сайте «alta online 24 h» → en tienda/telefono piden NIE o pasaporte con verificación manual para extranjeros.",
      "«Propietario siempre paga luz» → contrato puede переложить suministros на inquilino; спор — cláusula contrato, не Ley general.",
      "«Digi eSIM en aeropuerto» → prepago oficial empieza con SIM física; eSIM contrato — otro flujo (digimobil.es).",
      "«PVPC siempre más barato» → mercado libre a veces gana según consumo; CNMC comparador muestra ambos.",
      "«Agua incluida en comunidad» → vivienda unifamiliar y muchos pisos antiguos — contrato EMIVASA separado.",
      "Ожидание: fibra 48 h → en edificio sin CTO puede ser 1–2 semanas; planifique tethering móvil.",
    ],
  },
  {
    heading: "Типичные ошибки релоканта",
    section_kind: "practice",
    paragraphs: [
      "Большинство срывов в первом месяце — не «испанская бюрократия», а неправильный tipo de trámite: alta nueva вместо cambio titular, postpago fibra без IBAN, или agua «на потом», пока кран уже открыт без contrato.",
    ],
    bullets: [
      "Ошибка: alta nueva luz cuando suministro activo — pagáis derechos de acceso y enganche de más; pedid cambio titular.",
      "Ошибка: fibra postpago без идентификации и рабочего mandato SEPA — contrato se cae; prepago móvil + Wi‑Fi temporal, luego fibra.",
      "Ошибка: no pedir CUPS/factura anterior al propietario — retraso 1–2 semanas en luz y gas.",
      "Ошибка: creer que EMIVASA «включена в renta» — llega factura bimestral a su nombre o corte.",
      "Ошибка: roaming ruso para banca SMS — bloqueos 2FA; número ES prepago с registro titular.",
      "Ошибка: firmar mercado libre luz 24 meses sin leer permanencia — cambio caro antes de mudanza de barrio.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что откладывают и чем бьёт",
    section_kind: "practice",
    paragraphs: [
      "К 4–6 месяцу в Valencia у релоканта уже TIE/resguardo, работа или autónomo, и привычка платить luz/agua/fibra. Именно тогда всплывает то, что в месяц 1 казалось «мелочью»: luz осталась на propietario, prepago не portado, tarifa luz с permanencia, agua EMIVASA на nombre anterior.",
      "К 4–6 месяцу банк и nómina требуют domiciliación с ES IBAN; Revolut-only сценарий ломается на utilities и некоторых seguros. Переоформление titularidades — снова expediente, иногда visita técnico.",
      "Если маршрут визы или autónomo не сходится с фактическими suministros — проверьте [Emigro wizard](https://www.emigro.online/ru/spain/wizard) и при необходимости [Assist Route Check](https://www.emigro.online/ru/assist): не для выбора tarifa Digi, а чтобы связать статус, адрес и бюджет domicilio.",
    ],
    bullets: [
      "К 4–6 месяцу: luz на propietario — сложнее доказать domicilio habitual para trámites.",
      "К 4–6 месяцу: prepago sin portabilidad — потеря номера, привязанного к banca y extranjería SMS.",
      "К 4–6 месяцу: permanencia fibra/luz — штраф при переезде в другой distrito Valencia.",
      "К 4–6 месяцу: EMIVASA sin cambio titular — deuda agua на extranjero anterior → reclamación nueva.",
      "К 4–6 месяцу: potencia luz занижена — saltan automáticos con aire acondicionado verano Comunidad Valenciana.",
    ],
  },
];

const keyTakeaways = [
  "Официально: prepago móvil доступен no residentes (Orange); fibra/luz/agua требуют identificación и IBAN; EMIVASA — отдельный contrato en Valencia.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "день 1 — prepago en tienda с pasaporte; semana 2–4 после NIE+IBAN — cambio titular luz и pedido fibra",
    forReader:
      "не смешивайте alta nueva luz с cambio titular — иначе derechos de acceso en primera factura",
  }),
  "Расхождение: «eSIM сразу online» vs flujo Digi prepago (SIM física) и eSIM contrato с DNI en Mi DIGI.",
  "На практике: к 4–6 месяцу больнее всего titularidades «на потом» и prepago без portabilidad — закройте luz/agua/fibra на своё имя до TIE rutina.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли получить испанский номер в день прилёта без NIE?",
    a: "По правилам prepago регистрируется на pasaporte/NIE en tienda (Orange — no residentes solo prepago). На практике в Valencia покупают SIM en Orange/Digi/Jazztel с pasaporte; contrato postpago чаще ждут NIE и IBAN.",
  },
  {
    q: "На чьё имя оформлять luz и fibra — inquilino или propietario?",
    a: "По правилам titular может ser inquilino con contrato de alquiler y documentos. На практике propietario иногда оставляет luz на себе; для TIE и прозрачности расходов inquilino чаще делает cambio titular после IBAN.",
  },
  {
    q: "PVPC или mercado libre для luz en Valencia?",
    a: "По правилам оба канала легальны; PVPC — tarifa regulada CNMC. На практике сравнивают consumo en comparador.cnmc.gob.es; mercado libre с permanencia может быть дешевле o дороже — зависит от perfil, не от «совета соседа».",
  },
  {
    q: "Сколько стоит alta agua EMIVASA?",
    a: "По правилам EMIVASA cuota alta 2026 con contador existente 15 mm — 37,08 € + IVA (PDF oficial BOPV 2026/03822). На практике добавляют cuota servicio bimestral; exact importe final — en presupuesto EMIVASA al tramitar.",
  },
  {
    q: "Что будет к 2–3 месяцу, если не оформить utilities?",
    a: "По правилам suministro без contrato или impago ведёт к reclamación y posible corte. На практике к mes 2–3 приходят facturas bimestrales agua y mensuales luz; без domiciliación рискуете penalización y повторные trámites с NIE уже занятым TIE.",
  },
];

export const SIM_INTERNET_LUZ_GUIDE = {
  slug: SIM_INTERNET_LUZ_SLUG,
  category: "Связь и ЖКХ",
  content_kind: "guide" as ContentKind,
  title: "SIM-карта, интернет и коммунальные услуги в Валенсии: 2026",
  excerpt:
    "Prepago/eSIM в день прилёта, домашняя fibra на имя арендатора, luz PVPC или mercado libre, газ и вода EMIVASA — порядок для Valencia без выдуманных депозитов.",
  seo_title: "Россиянам SIM и свет в Valencia 2026",
  seo_description:
    "SIM, fibra и свет в Valencia 2026: prepago в день прилёта, PVPC или mercado libre, вода EMIVASA, NIE и IBAN. Практика для RU/BY в Comunidad Valenciana.",
  quick_answer:
    "В Валенсии в день прилёта практичен prepago: Orange допускает no residentes к prepago, документ для KYC уточняйте в салоне; Digi продаёт SIM в punto de venta. Fibra и luz оформляют на titular с идентификацией и счётом SEPA; смена имени на счётчике — если ток уже идёт, новая alta требует технические бумаги. Agua — отдельный contrato EMIVASA. Сравнивайте тарифы в CNMC.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "CNMC — Comparador energía", url: "https://comparador.cnmc.gob.es/" },
    { title: "CNMC — Energía y guías consumidor", url: "https://www.cnmc.es/facil-para-ti/herramientas-utiles/energia" },
    { title: "Endesa — documentación alta luz/gas", url: "https://www.endesa.com/es/te-ayudamos/como-contratar/documentacion-necesito-para-dar-de-alta-luz-gas" },
    { title: "Orange — prepago no residentes", url: "https://ayuda.orange.es/particulares/movil/mi-tarifa/mi-alta-y-mi-permanencia/842-contratacion-de-servicios-de-orange-para-no-residentes-en-espana" },
    { title: "EMIVASA — tarifas alta 2026 (PDF)", url: "https://www.emivasa.es/Sites/2/Docs/Tarifas/SUMINISTROYENGANCHE2026.pdf" },
    { title: "Digi — prepago móvil", url: "https://www.digimobil.es/movil/prepago" },
  ],
  topic_tags: ["sim", "internet", "utilities", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["sim", "internet", "utilities", "valencia"],
    contentKind: "guide",
    extra: ["luz", "emivasa", "prepago", "fibra", "nie"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa+spainchats",
  source_label: "editorial:home-setup-valencia",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
