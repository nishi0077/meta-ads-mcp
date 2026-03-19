const stats = [
  { value: "1/10", label: "レポート作成時間" },
  { value: "15分", label: "導入完了まで" },
];

const techStack = [
  "Meta Graph API v24.0",
  "Claude Desktop",
  "Cursor",
  "MCP Protocol",
  "OAuth 2.0",
];

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 max-w-md mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center">
          <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
            採用技術
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {techStack.map((name) => (
              <span
                key={name}
                className="text-sm font-medium text-text-muted/70 transition hover:text-text-muted"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
