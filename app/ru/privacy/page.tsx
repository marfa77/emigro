import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Политика конфиденциальности",
  description: "Как Emigro собирает, использует и защищает персональные данные пользователей.",
  path: "/ru/privacy",
});

const UPDATED = "25 июня 2026";

export default function PrivacyPage() {
  return (
    <LegalPage title="Политика конфиденциальности" updated={UPDATED}>
      <LegalSection title="1. Кто мы">
        <p>
          Emigro (сайт{" "}
          <Link href="/ru" className="text-corridor-600 hover:underline">
            emigro.online
          </Link>
          ) — информационный сервис по релокации в Европу. Оператор обрабатывает данные в рамках предоставления
          сервиса подбора маршрутов, новостей и передачи заявок партнёрам.
        </p>
        <p>
          Контакт по вопросам персональных данных:{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Какие данные собираем">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Данные wizard:</strong> ответы на вопросы подбора (гражданство, семья, доход, цели и т.д.) —
            для расчёта маршрута.
          </li>
          <li>
            <strong>Контактные данные в форме заявки:</strong> имя, email, телефон (если указан), Telegram (если
            указан), комментарий.
          </li>
          <li>
            <strong>Технические данные:</strong> IP, user-agent, cookies, события аналитики (просмотры страниц,
            шаги wizard, отправка форм).
          </li>
          <li>
            <strong>Данные админ-панели:</strong> только для авторизованных операторов (не относится к обычным
            пользователям).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Зачем обрабатываем">
        <ul className="list-disc space-y-2 pl-5">
          <li>Показ персонализированного результата wizard и shortlist партнёров.</li>
          <li>Передача заявки выбранному партнёру или внутренней обработке команды Emigro.</li>
          <li>Улучшение сервиса, аналитика и защита от злоупотреблений.</li>
          <li>Рассылка новостей — только при отдельном согласии, если такая функция включена.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Правовые основания">
        <p>
          Обработка основана на исполнении запрошенного вами сервиса (подбор маршрута, заявка к партнёру), законном
          интересе оператора (аналитика, безопасность) и, где требуется, на вашем согласии (например, маркетинговые
          рассылки).
        </p>
      </LegalSection>

      <LegalSection title="5. Кому передаём данные">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Партнёры:</strong> при отправке заявки через форму — данные, необходимые для связи (имя,
            контакты, контекст wizard).
          </li>
          <li>
            <strong>Инфраструктура:</strong> хостинг (Vercel), база данных (Supabase), аналитика (Vercel Analytics),
            уведомления (Telegram API при внутренней обработке заявок).
          </li>
          <li>
            <strong>AI-провайдеры:</strong> при генерации новостного контента — без привязки к вашей личной заявке;
            wizard-данные в публичные LLM не отправляются без необходимости.
          </li>
        </ul>
        <p>Мы не продаём персональные данные третьим лицам.</p>
      </LegalSection>

      <LegalSection title="6. Срок хранения">
        <p>
          Данные wizard и заявок хранятся столько, сколько нужно для обработки запроса и улучшения сервиса, но не
          дольше разумного срока (как правило, до 24 месяцев с последней активности), если закон не требует иного.
        </p>
      </LegalSection>

      <LegalSection title="7. Ваши права">
        <p>
          Вы можете запросить доступ, исправление, удаление или ограничение обработки, а также возразить против
          обработки — напишите на{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . Применимое законодательство зависит от вашего местонахождения (в т.ч. GDPR для резидентов ЕС).
        </p>
      </LegalSection>

      <LegalSection title="8. Безопасность">
        <p>
          Используем HTTPS, ограничение доступа к админ-функциям, секреты в переменных окружения. Абсолютной
          безопасности в интернете не существует — не передавайте через форму сверхчувствительные данные (номера
          документов, пароли).
        </p>
      </LegalSection>

      <LegalSection title="9. Дети">
        <p>Сервис не предназначен для лиц младше 16 лет без участия законного представителя.</p>
      </LegalSection>

      <LegalSection title="10. Изменения">
        <p>
          Актуальная версия всегда на этой странице. Существенные изменения можем отразить датой обновления выше.
          См. также{" "}
          <Link href="/ru/cookies" className="text-corridor-600 hover:underline">
            политику cookies
          </Link>{" "}
          и{" "}
          <Link href="/ru/terms" className="text-corridor-600 hover:underline">
            условия использования
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
