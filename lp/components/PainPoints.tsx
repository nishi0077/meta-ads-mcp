const bottlenecks = [
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "打ち手は見えている。実行が追いつかない。",
    description:
      "改善すべきポイントは分かっている。だが管理画面での操作・確認に時間を取られ、本来やるべき戦略設計に手が回らない。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "レポートは作れる。でもそこに時間をかけるべきじゃない。",
    description:
      "データ抽出・加工・レポート化は得意。だがそれは「価値を生む仕事」ではない。本当に時間を使いたいのは、データから何を読み取り、次にどう動くか。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "案件が増えるほど、管理コストが指数関数的に増える。",
    description:
      "複数アカウント・複数クライアントの運用。ビジネスマネージャーの切り替え、それぞれのレポート作成。スケールの壁がそこにある。",
  },
];

export default function PainPoints() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          スキルがあるからこそ感じる<span className="text-primary">ボトルネック</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          運用力がある人ほど、「管理画面の操作」に時間を奪われているという矛盾。
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {bottlenecks.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface-light p-6 transition hover:border-primary/40"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
