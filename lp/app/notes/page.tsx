import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotesMeta } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Note記事プレビュー | Meta Ads MCP",
  description: "Note公開前の下書きをここで確認できます。",
  robots: { index: false, follow: false },
};

export default function NotesIndexPage() {
  const notes = getAllNotesMeta();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <h1
        className="text-2xl font-black text-text sm:text-3xl"
        style={{ fontFamily: "var(--font-serif-jp), serif" }}
      >
        Note記事プレビュー
      </h1>
      <p className="mt-3 text-sm text-text-muted leading-relaxed">
        Noteに貼る前の下書きです。公開サイトに載せる場合は、このページのURLを検索に載せたくないなら
        <code className="mx-1 rounded bg-surface-light px-1.5 py-0.5 text-xs text-text">robots: noindex</code>
        を維持するか、Basic認証をかけてください。
      </p>

      <ul className="mt-10 space-y-3">
        {notes.map((n, i) => (
          <li key={n.slug}>
            <Link
              href={`/notes/${n.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-surface-light/50 p-4 transition hover:border-primary/40 hover:bg-surface-light"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="font-semibold text-text group-hover:text-primary transition">
                  {n.title}
                </span>
                <p className="mt-1 font-mono text-xs text-text-muted">/notes/{n.slug}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-sm text-text-muted">
        <Link href="/" className="text-primary underline-offset-2 hover:underline">
          LPトップへ戻る
        </Link>
      </p>
    </div>
  );
}
