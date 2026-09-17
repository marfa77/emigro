import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { OfficialLinksPreview } from "@/components/satellite/OfficialLinksPreview";
import { KeyTakeaways, NoteBody } from "@/components/satellite/NoteBody";
import { NoteFaq } from "@/components/satellite/NoteFaq";
import { NoteReadingProgress } from "@/components/satellite/NoteReadingProgress";
import { NoteToc } from "@/components/satellite/NoteToc";
import { RelatedNotes } from "@/components/satellite/RelatedNotes";
import { SatelliteFunnelCta } from "@/components/satellite/SatelliteFunnelCta";
import { SatelliteCityChatCta } from "@/components/satellite/SatelliteCityChatCta";
import {
  buildCommunityNoteLlmDescription,
  buildCommunityNoteLlmFacts,
  buildCommunityNoteMetadata,
  buildCommunityNoteSchemas,
} from "@/lib/community-notes/seo-page";
import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getRelatedNotes } from "@/lib/community-notes/repair-note";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import { satelliteHubUrl, satellitePillarUrl } from "@/lib/satellite/funnel-urls";
import { thailandHubPath } from "@/lib/satellite/paths";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { thailandSatelliteUrl } from "@/lib/site-url";
import { estimateNoteReadMinutes, formatReadTime } from "@/lib/community-notes/read-time";
import { inlineMarkdown } from "@/lib/markdown/inline";
import { heroTitle, NOTE_CONTENT_IMAGE_SIZES, noteContentImageClass, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("thailand");
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getPublishedCommunityNoteBySlug(params.slug, "thailand");
  return note ? buildCommunityNoteMetadata(note) : {};
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export default async function ThailandNotePage({ params }: { params: { slug: string } }) {
  const [note, allNotes] = await Promise.all([
    getPublishedCommunityNoteBySlug(params.slug, "thailand"),
    getPublishedCommunityNotes("thailand"),
  ]);
  if (!note) notFound();

  const related = getRelatedNotes(note, allNotes);
  const { articleSchema, breadcrumbSchema, faqSchema, speakableSchema } = buildCommunityNoteSchemas(note);
  const llmFacts = buildCommunityNoteLlmFacts(note);
  const heroImage = note.content_kind === "guide" ? resolveNoteOgImage(note) : null;
  const showHero = heroImage != null && heroImage !== DEFAULT_OG_IMAGE;
  const readMinutes = estimateNoteReadMinutes(note);

  return (
    <main className={satelliteMain}>
      <NoteReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <section className="sr-only" aria-label="AI description" data-llm="facts">
        <h2>ai:description</h2>
        <p>{buildCommunityNoteLlmDescription(note)}</p>
        <ul>{llmFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        <a href={thailandSatelliteUrl("/llms")} data-llm="commercial">llms.txt</a>
      </section>

      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href={thailandHubPath()} className="hover:text-indigo-950">{THAILAND_SATELLITE.cityRu}</Link>
        <span aria-hidden="true"> › </span>
        <span>{note.category}</span>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-800">{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h1 className={`mt-2 ${heroTitle} leading-tight text-slate-900`}>{note.title}</h1>
        <p className="mt-2 text-sm text-slate-600">Пхукет, Таиланд · для релокантов RU/BY/UA/KZ</p>
        {note.published_at && (
          <p className="mt-3 text-sm text-slate-500">
            <time dateTime={note.published_at}>{formatDate(note.published_at)}</time>
            {note.updated_at !== note.published_at && <>{" · "}<span>обновлено {formatDate(note.updated_at)}</span></>}
            {note.content_kind === "guide" && <>{" · "}<span>{formatReadTime(readMinutes)}</span></>}
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

      <div className="community-quick-answer mt-8 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-950">Короткий ответ</p>
        <p
          className="mt-2 leading-relaxed text-slate-800 [&_strong]:font-semibold [&_strong]:text-slate-950"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(note.quick_answer) }}
        />
      </div>

      <SatelliteCityChatCta countryKey="thailand" source="thailand_satellite_note" noteSlug={note.slug} />
      <SatelliteFunnelCta
        countryKey="thailand"
        placement="satellite_note"
        noteSlug={note.slug}
        noteTitle={note.title}
        contentKind={note.content_kind}
      />
      <NoteHashtags tags={note.hashtags} className="mt-6" countryKey="thailand" />
      <KeyTakeaways items={note.key_takeaways} />
      {note.content_kind === "guide" && <NoteToc sections={note.body_sections} hasFaq={note.faq.length > 0} />}
      <NoteBody sections={note.body_sections} paragraphs={note.body_paragraphs} />
      {note.official_links.length > 0 && (
        <OfficialLinksPreview links={note.official_links} accentClassName="text-indigo-900 underline hover:text-indigo-950" />
      )}
      <NoteFaq items={note.faq} />
      <RelatedNotes notes={related} />

      <p className="mt-12 rounded-lg border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-950">
        Не юридическая консультация. Практические сигналы из сообществ не заменяют правила Thai Immigration,
        посольства или конкретного офиса. Проверяйте требования перед подачей.
      </p>
      <p className="mt-8 text-center">
        <Link href={thailandHubPath()} className="text-sm text-indigo-900 underline">← Все заметки</Link>
        {" · "}
        <a
          href={satelliteHubUrl({ countryKey: "thailand", placement: "satellite_note", content: note.slug })}
          className="text-sm text-indigo-900 underline"
        >
          Таиланд на Emigro
        </a>
        {" · "}
        <a
          href={satellitePillarUrl({ countryKey: "thailand", placement: "satellite_note", content: note.slug })}
          className="text-sm text-indigo-900 underline"
        >
          Таиланд для россиян 2026
        </a>
      </p>
    </main>
  );
}
