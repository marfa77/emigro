import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { KeyTakeaways, NoteBody } from "@/components/satellite/NoteBody";
import { NoteFaq } from "@/components/satellite/NoteFaq";
import { NoteReadingProgress } from "@/components/satellite/NoteReadingProgress";
import { NoteToc } from "@/components/satellite/NoteToc";
import { RelatedNotes } from "@/components/satellite/RelatedNotes";
import { BarakhloPromo } from "@/components/satellite/BarakhloPromo";
import {
  buildCommunityNoteLlmDescription,
  buildCommunityNoteLlmFacts,
  buildCommunityNoteMetadata,
  buildCommunityNoteSchemas,
} from "@/lib/community-notes/seo-page";
import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getRelatedNotes } from "@/lib/community-notes/repair-note";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { spainHubPath } from "@/lib/satellite/paths";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { spainSatelliteUrl } from "@/lib/site-url";
import { estimateNoteReadMinutes, formatReadTime } from "@/lib/community-notes/read-time";
import { heroTitle, NOTE_CONTENT_IMAGE_SIZES, noteContentImageClass, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("spain");
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getPublishedCommunityNoteBySlug(params.slug, "spain");
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

export default async function SpainNotePage({ params }: { params: { slug: string } }) {
  const [note, allNotes] = await Promise.all([
    getPublishedCommunityNoteBySlug(params.slug, "spain"),
    getPublishedCommunityNotes("spain"),
  ]);
  if (!note) notFound();

  const related = getRelatedNotes(note, allNotes);
  const { articleSchema, breadcrumbSchema, faqSchema, speakableSchema } = buildCommunityNoteSchemas(note);
  const llmDescription = buildCommunityNoteLlmDescription(note);
  const llmFacts = buildCommunityNoteLlmFacts(note);
  const llmsUrl = spainSatelliteUrl("/llms");
  const heroImage = note.content_kind === "guide" ? resolveNoteOgImage(note) : null;
  const showHero = heroImage != null && heroImage !== DEFAULT_OG_IMAGE;
  const readMinutes = estimateNoteReadMinutes(note);
  const showToc = note.content_kind === "guide";

  return (
    <main className={satelliteMain}>
      <NoteReadingProgress />
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
        <Link href={spainHubPath()} className="hover:text-amber-900">
          {SPAIN_SATELLITE.cityRu}
        </Link>
        <span aria-hidden="true"> › </span>
        <span>{note.category}</span>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h1 className={`mt-2 ${heroTitle} leading-tight text-slate-900`}>{note.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {SPAIN_SATELLITE.cityRu}, Испания · для релокантов RU/BY/UA/KZ
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
            {note.content_kind === "guide" && (
              <>
                {" · "}
                <span>{formatReadTime(readMinutes)}</span>
              </>
            )}
          </p>
        )}
      </header>

      {showHero && (
        <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <Image
            src={heroImage}
            alt=""
            width={1200}
            height={630}
            sizes={NOTE_CONTENT_IMAGE_SIZES}
            className={noteContentImageClass}
            priority
          />
        </figure>
      )}

      <div className="community-quick-answer mt-8 rounded-xl border border-amber-100 bg-amber-50/70 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-900">Короткий ответ</p>
        <p className="mt-2 leading-relaxed text-slate-800">{note.quick_answer}</p>
      </div>

      <NoteHashtags tags={note.hashtags} className="mt-6" countryKey="spain" />

      <KeyTakeaways items={note.key_takeaways} />

      {showToc && <NoteToc sections={note.body_sections} hasFaq={note.faq.length > 0} />}

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
                  className="text-amber-900 underline hover:text-amber-950"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NoteFaq items={note.faq} />

      <BarakhloPromo context={note.slug} placement="satellite_note" category={note.category} />

      <RelatedNotes notes={related} />

      <p className="mt-12 rounded-lg border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-950">
        Не юридическая консультация. Секции «Официально» — формальные требования порталов; «На практике» — опыт
        релокантов из чатов и может отличаться от правил. Перед подачей документов сверяйтесь с extranjería и Agencia
        Tributaria.
      </p>

      <p className="mt-8 text-center">
        <Link href={spainHubPath()} className="text-sm text-amber-900 underline">
          ← Все заметки
        </Link>
        {" · "}
        <a href={SPAIN_SATELLITE.mainSiteUrl} className="text-sm text-amber-900 underline">
          Коридор Испания на Emigro
        </a>
        {" · "}
        <a href={llmsUrl} className="text-sm text-amber-900 underline">
          llms.txt
        </a>
      </p>
    </main>
  );
}
