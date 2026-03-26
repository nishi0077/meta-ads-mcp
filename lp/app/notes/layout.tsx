import Link from "next/link";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-bold text-text transition hover:text-primary"
          >
            <span className="text-primary">Meta Ads</span> MCP
          </Link>
          <div className="flex items-center gap-3 text-xs text-text-muted sm:text-sm">
            <span className="rounded-full border border-border bg-surface-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent sm:text-xs">
              下書きプレビュー
            </span>
            <Link href="/notes" className="text-text-muted transition hover:text-text">
              一覧
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
