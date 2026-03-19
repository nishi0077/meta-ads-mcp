const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3M3.75 3.75h16.5v16.5H3.75z" />
      </svg>
    ),
    title: "30ツールをチャットで即実行",
    description:
      "キャンペーン分析、広告セット操作、クリエイティブ管理、オーディエンス設計。管理画面で10分かかる操作が、一言で終わる。",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "本番環境を壊さない設計思想",
    description:
      "書き込み操作はデフォルトでドライラン。新規作成はPAUSED状態。プロの現場だからこそ求められる安全性を、設計レベルで担保。",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "複数アカウント横断分析",
    description:
      "代理店運用の現場に対応。アカウントを横断してCPA・ROAS・クリエイティブ別の比較分析を一発で。",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Claude / Cursor、どちらでも",
    description:
      "MCPプロトコル準拠で、Claude DesktopでもCursorでも即座に利用可能。あなたの作業環境に合わせて装備できる。",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "リアルタイム分析レポート",
    description:
      "日次・週次・月次のパフォーマンスを数秒で集計。CPA・ROAS・CTRの算出からクリエイティブ比較まで瞬時に完了。",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: "ライフタイム無料アップデート",
    description:
      "Meta APIの変更にも即追従。新機能・新ツールの追加も含め、常に最新の状態で運用できる。",
  },
];

const badges = [
  "レスポンシブ対応",
  "30+ 搭載ツール",
  "ドライラン対応",
  "OAuth 2.0",
  "高速パフォーマンス",
  "日本語対応",
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            Core Features
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            あなたの運用力に
            <span className="text-primary">レバレッジ</span>
            をかける
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            操作の自動化ではなく、判断と実行のスピードを加速させるツール。
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-surface-light/60 p-6 backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/20">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-light/80 px-4 py-1.5 text-xs font-medium text-text-muted"
            >
              <svg
                className="h-3.5 w-3.5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
