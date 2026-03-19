const pains = [
  {
    num: "01",
    headline: "1日の3割、管理画面を眺めている。",
    body: "打ち手は頭にある。でも数値の確認、設定の変更、ステータスのチェック。管理画面との往復が、戦略を考える時間を奪い続けている。",
  },
  {
    num: "02",
    headline: "レポート作成、毎週2時間。",
    body: "データを引っ張って、加工して、整形して、共有する。できて当たり前の仕事に、本来使うべき時間が溶けている。",
  },
  {
    num: "03",
    headline: "5アカウント × 同じ作業の繰り返し。",
    body: "ビジネスマネージャーを切り替え、同じ操作を繰り返す。案件が増えるたびに、作業量だけが線形に増えていく。",
  },
];

export default function PainPoints() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-sm font-medium tracking-widest text-text-muted uppercase">
          Bottleneck
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl leading-snug">
          あなたの時間、<br className="sm:hidden" />
          どこに消えている？
        </h2>

        <div className="mt-14 space-y-0">
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
