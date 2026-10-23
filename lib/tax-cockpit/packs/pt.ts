import { PT_AE_RENTAL_PLAYBOOK } from "./pt-ae-rental";
import type { CountryPack } from "./types";

/**
 * Day rule: cockpit default (arrive counts, depart does not).
 * CIRS art. 16.º n.º 2 counts a day of presence when that day, full or partial, includes an overnight
 * (dormida) in Portugal. A same-calendar-day turnaround with no overnight is 0.
 * The statute does not use the UK midnight wording; this pack treats the default as the dormida orienter.
 */
export const PT_PACK: CountryPack = {
  iso2: "PT",
  nameRu: "Португалия",
  complete: true,
  presenceThresholdDays: 183,
  /** Art. 16.º n.º 1 a): mais de 183 dias — 183 itself is not over the line. */
  thresholdCompare: "gt",
  notesRu: [
    "Ориентир, не консультация. Ст. 16.º n.º 1 a) CIRS: больше 183 дней, подряд или с разрывами, в любом периоде 12 месяцев, который начинается или кончается в этом году. Светофор сравнивает только календарный год, скользящее окно он не строит.",
    "День присутствия (n.º 2): полный или частичный день, в который была ночёвка в Португалии. В pack день приезда входит, день выезда нет; заезд и выезд в один день без ночёвки — 0.",
    "Если дней меньше, резидентство всё равно возможно: жильё в любой день того же 12-месячного периода и текущее намерение держать его как обычный дом (n.º 1 b), редакция Lei n.º 82/2023). Это не старый тест «только 31 декабря». Жильё светофор не видит.",
    "Экипажи, публичные функции и режим при смене резидентства португальцев на юрисдикцию из списка «явно более благоприятных» в этот pack не входят. Красный — повод проверить дни, не статус для IRS.",
  ],
  tieBreakerQuestionsRu: [
    "Есть ли жильё в Португалии в любой день 12-месячного окна и намерение жить в нём как в обычном доме?",
    "Не набирается ли больше 183 ночёвок в скользящих 12 месяцах, даже если в одном календарном году меньше?",
    "Где семья и работа, если ночёвки рядом с порогом?",
    "Открыт ли ещё NHR или действует IFICI — или режима нет?",
  ],
  playbooks: [PT_AE_RENTAL_PLAYBOOK],
  officialSource: {
    labelRu: "ст. 16.º CIRS (Portal das Finanças)",
    url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs16.aspx",
  },
};
