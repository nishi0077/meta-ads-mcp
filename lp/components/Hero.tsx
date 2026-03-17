export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light px-4 py-1.5 text-sm text-text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          広告マネージャーを開かずにMeta広告を運用する方法
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
          <span className="text-text-muted">「CPCが高い広告、止めて」</span>
          <br />
          <span className="text-primary">AIにそう言うだけで、本当に止まる。</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl leading-relaxed">
          レポート確認、キャンペーン作成、予算変更、クリエイティブ管理
          <br className="hidden sm:block" />
          ―― 広告マネージャーで手作業していた<strong className="text-text">すべての操作</strong>が、AIとの会話で完結します。
          <br className="hidden sm:block" />
          <span className="text-accent font-medium">週3時間の運用作業が、15分に。</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-accent/40"
          >
            料金プランを見る
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-text-muted transition hover:bg-surface-light hover:text-text"
          >
            どう動くか見る
          </a>
        </div>

        <div className="mt-16 rounded-xl border border-border bg-surface-light/60 p-4 shadow-2xl backdrop-blur">
          <div className="rounded-lg bg-[#1E1E1E] p-6 font-mono text-sm text-left leading-relaxed">
            <p className="text-text-muted">
              <span className="text-primary">あなた:</span>{" "}
              <span className="text-text">
                過去30日でCPCが高い広告を全部一時停止して
              </span>
            </p>
            <div className="mt-4 text-text-muted">
              <span className="text-accent">AI:</span>{" "}
              <span className="text-text">3件の広告が該当します。</span>
            </div>
            <div className="mt-2 ml-4 space-y-1 text-text-muted text-xs sm:text-sm">
              <p>
                <span className="text-yellow-400/80">1.</span> 「春キャンペーン_バナーA」
                CPC ¥320 ― Imp 28,400 / Click 892
              </p>
              <p>
                <span className="text-yellow-400/80">2.</span> 「リターゲ_カルーセル」
                CPC ¥285 ― Imp 15,200 / Click 534
              </p>
              <p>
                <span className="text-yellow-400/80">3.</span> 「ブランド認知_動画」
                CPC ¥410 ― Imp 42,100 / Click 1,028
              </p>
            </div>
            <div className="mt-3 ml-4 text-text-muted">
              <span className="text-accent">↳</span>{" "}
              <span className="text-text">
                ドライランモードで一時停止をプレビューしました。
              </span>
              <span className="text-text-muted">
                {" "}実行しますか？（dry_run=false で本番反映）
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-muted">
          30の操作ツール搭載 ・ Claude Desktop / Cursor 対応 ・ ドライランで安全操作
        </p>
      </div>
    </section>
  );
}
