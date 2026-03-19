import Image from "next/image";

const techStack = [
  "Meta Graph API",
  "Claude Desktop",
  "Cursor",
  "MCP Protocol",
  "OAuth 2.0",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="gradient-blob gradient-blob-primary w-[600px] h-[600px] top-[-10%] left-[10%]" />
        <div
          className="gradient-blob gradient-blob-accent w-[400px] h-[400px] top-[20%] right-[5%]"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="gradient-blob gradient-blob-primary w-[500px] h-[500px] bottom-[0%] left-[40%]"
          style={{ animationDelay: "8s", opacity: 0.1 }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center animate-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/80 px-4 py-1.5 text-sm text-text-muted backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            すでにMeta広告を回している運用者のための武器
          </div>

          <h1
            className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            <span className="text-text">広告運用の強者を、</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              さらに強者に。
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg leading-relaxed">
            あなたの広告運用スキルに、
            <strong className="text-text">30のAI自動化ツール</strong>
            を掛け合わせる。
            <br className="hidden sm:block" />
            分析スピード、施策の打ち手、レポート精度 ――
            すべてが
            <span className="text-accent font-medium">一段上のレベル</span>
            になる。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#pricing"
              className="cta-btn w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white"
            >
              武器を手に入れる
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-text-muted transition hover:bg-surface-light hover:text-text"
            >
              何ができるか見る
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {techStack.map((name) => (
            <span
              key={name}
              className="text-xs font-medium tracking-wide text-text-muted/60 uppercase transition hover:text-text-muted"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 animate-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-2xl border border-border/80 bg-surface-light/50 p-2 sm:p-3 shadow-2xl shadow-primary/5 backdrop-blur overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-9 sm:h-11 bg-surface-light/90 border-b border-border/60 flex items-center px-4 gap-1.5 z-10">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
              <span className="ml-4 text-xs text-text-muted/60 font-mono hidden sm:inline">
                AI分析レポート — クリエイティブ比較分析
              </span>
              <span className="ml-3 text-xs text-text-muted/60 font-mono sm:hidden">
                クリエイティブ分析
              </span>
            </div>
            <div className="pt-9 sm:pt-11">
              <Image
                src="/analysis-hero.png"
                alt="Meta Ads MCP Serverによる広告分析レポートの出力例"
                width={1200}
                height={675}
                className="w-full rounded-lg"
                priority
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-text-muted/70">
            AIがあなたの指示で瞬時に分析・レポートを出力。30ツール搭載 ・ ドライランで安全操作
          </p>
        </div>
      </div>
    </section>
  );
}
