const pains = [
  {
    num: "01",
    headline: "広告をクリックした人の22%が、ページに着く前に消えている。",
    body: "広告はクリックされている。でもページが表示される前に離脱している。この原因を管理画面だけで特定しようとすると、何時間もかかる。",
  },
  {
    num: "02",
    headline: "代理店に毎月20%の手数料を払い続けている。",
    body: "レポートをもらって、修正を依頼して、返事を待つ。ノウハウは代理店に溜まり、自社には何も残らない。この構造を変えない限り、コストは下がらない。",
  },
  {
    num: "03",
    headline: "同じ商品なのに、獲得単価に4倍の差がある。",
    body: "あるキャンペーンは¥242、別のキャンペーンは¥928。なぜこんなに差がつくのか？広告の設定か、見せ方か、ターゲットか。原因の特定に時間がかかりすぎている。",
  },
];

export default function PainPoints() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-sm font-medium tracking-widest text-text-muted uppercase">
          Bottleneck
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl leading-snug">
          あなたの時間、<br className="sm:hidden" />
          どこに消えている？
        </h2>

        <div className="mt-10 space-y-0">
          {pains.map((item, i) => (
            <div
              key={item.num}
              className={`py-8 sm:py-10 ${i !== pains.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="text-xs font-mono text-text-muted tracking-wider">
                ── {item.num}
              </span>
              <h3 className="mt-3 text-xl font-bold sm:text-2xl leading-snug">
                {item.headline}
              </h3>
              <p className="mt-3 text-sm text-text-muted leading-relaxed sm:text-base max-w-xl">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
