import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NoteMarkdown from "@/components/NoteMarkdown";
import {
  getNoteBySlug,
  getNoteSlugs,
  NOTE_SLUG_ORDER,
} from "@/lib/notes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NOTE_SLUG_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: "Not found" };
  return {
    title: `${note.title} | Noteプレビュー`,
    description: note.title,
    robots: { index: false, follow: false },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <nav className="mb-8 text-sm text-text-muted">
        <Link href="/notes" className="transition hover:text-text">
          ← 一覧
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-muted">{note.slug}</span>
      </nav>

      <NoteMarkdown source={note.content} />

      <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-text-muted">
        <Link href="/notes" className="text-primary underline-offset-2 hover:underline">
          他の記事を見る
        </Link>
        <span className="mx-2 text-border">·</span>
        <Link href="/" className="underline-offset-2 hover:text-text hover:underline">
          LPトップ
        </Link>
      </footer>
    </article>
  );
}
