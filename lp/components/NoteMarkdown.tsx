import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-black tracking-tight text-text sm:text-4xl" style={{ fontFamily: "var(--font-serif-jp), serif" }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 border-b border-border pb-2 text-xl font-bold text-text sm:text-2xl first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-semibold text-text">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-relaxed text-text-muted">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-5 text-text-muted marker:text-primary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-5 text-text-muted marker:text-primary">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition hover:text-blue-300"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-10 border-border" />,
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[480px] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-lighter text-left text-text">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
  tr: ({ children }) => <tr className="border-border">{children}</tr>,
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-3 font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-text-muted">{children}</td>
  ),
};

export default function NoteMarkdown({ source }: { source: string }) {
  return (
    <div className="note-md space-y-4">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </Markdown>
    </div>
  );
}
