import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { KeyTakeaways, NoteBody } from "@/components/satellite/NoteBody";
import { RelatedNotes } from "@/components/satellite/RelatedNotes";
import { Prep2GoPromo } from "@/components/satellite/Prep2GoPromo";
import { BarakhloPromo } from "@/components/satellite/BarakhloPromo";
import {
  buildCommunityNoteLlmDescription,
  buildCommunityNoteLlmFacts,
  buildCommunityNoteMetadata,
  buildCommunityNoteSchemas,
  communityNoteUrl,
} from "@/lib/community-notes/seo-page";
import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getRelatedNotes } from "@/lib/community-notes/repair-note";
import { shouldShowPrep2GoPromo } from "@/lib/community-notes/sponsor-promo";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { portugalHubPath } from "@/lib/satellite/paths";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("portugal");
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getPublishedCommunityNoteBySlug(params.slug, "portugal");
  if (!note) return {};
  return buildCommunityNoteMetadata(note);
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function PortugalNotePage({ params }: { params: { slug: string } }) {
  const [note, allNotes] = await Promise.all([
    getPublishedCommunityNoteBySlug(params.slug, "portugal"),
    getPublishedCommunityNotes("portugal"),
  ]);
  if (!note) notFound();

  const related = getRelatedNotes(note, allNotes);
  const showPrep2Go = shouldShowPrep2GoPromo(note);

  const { articleSchema, breadcrumbSchema, faqSchema, speakableSchema } = buildCommunityNoteSchemas(note);
  const llmDescription = buildCommunityNoteLlmDescription(note);
  const llmFacts = buildCommunityNoteLlmFacts(note);
  const llmsUrl = portugalSatelliteUrl("/llms");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{llmDescription}</p>
        <ul>
          {llmFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <a href={llmsUrl}>llms.txt</a>
      </section>

      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href={portugalHubPath()} className="hover:text-teal-700">
          {PORTUGAL_SATELLITE.cityRu}
        </Link>
        <span aria-hidden="true"> › </span>
        <span>{note.category}</span>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900">{note.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {PORTUGAL_SATELLITE.cityRu}, Португалия · для релокантов RU/BY/UA/KZ
        </p>
        {note.published_at && (
          <p className="mt-3 text-sm text-slate-500">
            <time dateTime={note.published_at}>{formatDate(note.published_at)}</time>
            {note.updated_at !== note.published_at && (
              <>
                {" · "}
                <span>обновлено {formatDate(note.updated_at)}</span>
              </>
            )}
          </p>
        )}
      </header>

      <div className="community-quick-answer mt-8 rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Короткий ответ</p>
        <p className="mt-2 leading-relaxed text-slate-800">{note.quick_answer}</p>
      </div>

      <NoteHashtags tags={note.hashtags} className="mt-6" />

      <KeyTakeaways items={note.key_takeaways} />

      <NoteBody sections={note.body_sections} paragraphs={note.body_paragraphs} />

      {note.official_links.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Официальные источники</h2>
          <ul className="mt-3 space-y-2">
            {note.official_links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 underline hover:text-teal-900"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {note.faq.length > 0 && (
        <section className="mt-10" id="faq">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">FAQ</h2>
          <dl className="mt-4 space-y-4">
            {note.faq.map((item) => (
              <div key={item.q} className="rounded-lg border border-slate-200 bg-white p-4">
                <dt className="font-medium text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {showPrep2Go && <Prep2GoPromo noteSlug={note.slug} />}

      <BarakhloPromo context={note.slug} placement="satellite_note" />

      <RelatedNotes notes={related} />

      <p className="mt-12 rounded-lg border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-950">
        Не юридическая консультация. Проверяйте правила на официальных порталах перед подачей документов.
      </p>

      <p className="mt-8 text-center">
        <Link href={portugalHubPath()} className="text-sm text-teal-700 underline">
          ← Все заметки
        </Link>
        {" · "}
        <a href={PORTUGAL_SATELLITE.mainSiteUrl} className="text-sm text-teal-700 underline">
          Коридор Португалия на Emigro
        </a>
        {" · "}
        <a href={llmsUrl} className="text-sm text-teal-700 underline">
          llms.txt
        </a>
      </p>
      <link rel="canonical" href={communityNoteUrl(note.slug)} />
    </main>
  );
}
