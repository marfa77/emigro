/**
 * Spain family reunification (régimen general) for applicants from Russia.
 * Facts checked 2026-11-09 against:
 * - Hoja 8, Ministerio de Inclusión (RD 1155/2024): sponsor-side requirements and procedure.
 * - Consulado General de España en Moscú, «Visado de reagrupación familiar en régimen general».
 * Do not add thresholds or deadlines that are not on those two pages.
 */
const HOJA_8_URL =
  "https://www.inclusion.gob.es/web/migraciones/w/autorizacion-de-residencia-temporal-por-reagrupacion-familiar";
const MOSCOW_VISA_URL =
  "https://www.exteriores.gob.es/Consulados/moscu/es/ServiciosConsulares/Paginas/index.aspx?scca=Visados&scco=Rusia&scd=203&scs=Visados+Nacionales+-+Visado+de+reagrupaci%C3%B3n+familiar+en+r%C3%A9gimen+general";

const SPONSOR_STEPS = [
  {
    title: "Стаж спонсора",
    body: "Подать можно, когда спонсор прожил в Испании не меньше года и уже подал на продление ещё минимум на год. Исключения: ВНЖ larga duración (для родителей) и статус larga duración-UE из другой страны ЕС.",
  },
  {
    title: "Доход",
    body: "150% IPREM в месяц на семью из двух человек и ещё 50% IPREM за каждого следующего. Если второй член семьи — ребёнок, считают от Ingreso Mínimo Vital: 110% годовой суммы и +10% за каждого следующего ребёнка.",
  },
  {
    title: "Жильё и страховка",
    body: "Отчёт о подходящем жилье (informe de vivienda adecuada) от автономного сообщества или мэрии и медицинская страховка на спонсора и всех, кого он перевозит.",
  },
  {
    title: "Подача и срок",
    body: "Подаёт спонсор: лично в Oficina de Extranjería своей провинции или онлайн через Mercurio. Пошлина — форма 790, код 052. Решение — до 2 месяцев; если ответа нет, это отказ.",
  },
] as const;

const RU_DOCS = [
  "Паспорт: действует ещё минимум год, 2 чистые страницы, выдан не раньше чем 10 лет назад. Гражданам РФ — ещё оригинал и полная копия внутреннего паспорта: по нему консульство проверяет, что вы живёте в его округе.",
  "Оригинал разрешения на воссоединение, которое получил спонсор, и копия его карты TIE.",
  "Свидетельство о браке или рождении — с апостилем и переводом на испанский.",
  "Справка о несудимости с 18 лет из всех стран, где вы жили последние 5 лет. Российская — с апостилем; перевод — присяжного переводчика или заверенный в консульстве.",
  "Медицинская справка (оригинал и копия) с переводом присяжного переводчика или заверенным в консульстве.",
] as const;

const TIMELINE = [
  { when: "2 месяца", what: "на подачу визы после того, как спонсору сообщили о положительном решении" },
  { when: "1 месяц", what: "консульство принимает решение по визе" },
  { when: "1 месяц", what: "чтобы забрать визу и ещё 1 месяц, чтобы въехать в Испанию" },
  { when: "1 месяц", what: "после въезда — подать на карту TIE в полиции той провинции, где оформляли разрешение" },
] as const;

export function SpainFamilyReunificationRu({ slug }: { slug: string }) {
  if (slug !== "spain-family-reunification") return null;

  return (
    <section className="mt-12 space-y-8" aria-labelledby="spain-family-ru">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Для граждан России</p>
        <h2 id="spain-family-ru" className="mt-1 text-3xl font-bold text-slate-900">
          Воссоединение семьи в Испании из России: два этапа
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
          Сначала разрешение получает спонсор в Испании, и только потом родственник подаёт на визу в России. Перевезти
          можно одного супруга или партнёра старше 18 лет, детей до 18 лет и родителей старше 65 лет, если они на
          иждивении.
        </p>

        <h3 className="mt-8 text-xl font-bold text-slate-900">Этап 1. Спонсор в Испании</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SPONSOR_STEPS.map((step) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold text-slate-900">{step.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.body}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-8 text-xl font-bold text-slate-900">Этап 2. Виза в России</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          Подавать лично в визовом центре BLS своего консульского округа. Все российские документы — с апостилем или
          легализацией и с переводом на испанский.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
          {RU_DOCS.map((doc) => (
            <li key={doc} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-corridor-600" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-bold text-slate-900">Сроки по шагам</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-semibold">Срок</th>
                <th className="py-2 font-semibold">Что за это время</th>
              </tr>
            </thead>
            <tbody>
              {TIMELINE.map((row) => (
                <tr key={row.what} className="border-b border-slate-100 align-top">
                  <td className="whitespace-nowrap py-2 pr-4 font-semibold text-slate-900">{row.when}</td>
                  <td className="py-2 text-slate-700">{row.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <strong>Nota Emigro (fact-check, 9 ноября 2026):</strong> сверено с{" "}
          <a href={HOJA_8_URL} className="underline" target="_blank" rel="noopener noreferrer">
            Hoja 8 Министерства инклюзии и миграций
          </a>{" "}
          и{" "}
          <a href={MOSCOW_VISA_URL} className="underline" target="_blank" rel="noopener noreferrer">
            карточкой визы Генконсульства Испании в Москве
          </a>
          . Сумму IPREM, перечень документов и порядок записи проверяйте на дату подачи: консульство может запросить
          дополнительные документы или собеседование.
        </p>
      </div>
    </section>
  );
}
