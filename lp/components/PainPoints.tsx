const pains = [
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "広告マネージャーの操作に毎日30分以上",
    description:
      "キャンペーンの確認、広告のオンオフ、予算変更のたびに広告マネージャーを開いて何画面も遷移する。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
    title: "レポート作成に毎週数時間",
    description:
      "データのエクスポート、Excelでの加工、レポートへの転記。毎週同じ作業を繰り返している。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "複数アカウントの切り替えが面倒",
    description:
      "代理店運用で複数アカウントを管理。ビジネスマネージャーの切り替えに手間がかかる。",
  },
];

export default function PainPoints() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          こんな<span className="text-primary">悩み</span>、ありませんか？
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {pains.map((pain) => (
            <div
              key={pain.title}
              className="rounded-xl border border-border bg-surface-light p-6 transition hover:border-primary/40"
            >
              <div className="mb-4">{pain.icon}</div>
              <h3 className="text-lg font-semibold">{pain.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {pain.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
