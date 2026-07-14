import Link from "next/link";
import { Mail } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Контакты",
  description:
    "Напишите команде Emigro: вопросы по сервису, предложения о партнёрстве и обратная связь. Обычно отвечаем в течение 1–2 рабочих дней.",
  path: "/ru/contact",
});

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Контакты" },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Контакты</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold">Контакты</h1>
        <p className="mt-3 text-slate-600">
          По вопросам сервиса, партнёрства и обратной связи — напишите нам. Обычно отвечаем в течение 1–2 рабочих
          дней.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-corridor-100 p-3 text-corridor-700">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="font-medium text-slate-900">Email</p>
              <a href={MAILTO_CONTACT} className="mt-1 text-lg text-corridor-600 hover:underline">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-3 text-sm text-slate-600">
                Для предложений о партнёрстве укажите в теме «Партнёрство» или перейдите на{" "}
                <Link href="/ru/partners" className="text-corridor-600 hover:underline">
                  страницу для партнёров
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Emigro не оказывает юридические услуги. По вопросам ВНЖ и гражданства обращайтесь к лицензированным
          специалистам.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
