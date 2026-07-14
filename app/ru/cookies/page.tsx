import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Политика cookies",
  description:
    "Политика cookies Emigro: какие файлы cookies используются, зачем нужны аналитические и функциональные cookies и как ими управлять в настройках браузера.",
  path: "/ru/cookies",
});

const UPDATED = "25 июня 2026";

export default function CookiesPage() {
  return (
    <LegalPage title="Политика cookies" updated={UPDATED}>
      <LegalSection title="1. Что такое cookies">
        <p>
          Cookies — небольшие файлы, которые сайт сохраняет в браузере. Они помогают запомнить настройки, измерить
          трафик и улучшить работу сервиса.
        </p>
      </LegalSection>

      <LegalSection title="2. Какие cookies мы используем">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Необходимые:</strong> сессия, безопасность, работа форм (минимум для функционирования сайта).
          </li>
          <li>
            <strong>Аналитические:</strong> Vercel Analytics — агрегированная статистика посещений без продажи
            данных рекламным сетям (см. документацию Vercel).
          </li>
          <li>
            <strong>Функциональные:</strong> идентификатор сессии wizard на сервере (без сохранения ответов в браузере;
            аналогичная технология хранения на устройстве).
          </li>
        </ul>
        <p>Мы не используем cookies для таргетированной рекламы на сторонних площадках.</p>
      </LegalSection>

      <LegalSection title="3. События аналитики">
        <p>
          Emigro может записывать обезличенные события (просмотр новости, шаг wizard, отправка заявки) для
          улучшения продукта. Подробнее — в{" "}
          <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
            политике конфиденциальности
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Как управлять">
        <p>
          Вы можете удалить cookies в настройках браузера или включить режим «не отслеживать». Отключение
          необходимых cookies может ограничить работу wizard и форм.
        </p>
      </LegalSection>

      <LegalSection title="5. Контакты">
        <p>
          Вопросы:{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
