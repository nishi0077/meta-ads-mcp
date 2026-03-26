const rows = [
  {
    label: "全キャンペーンの比較",
    before: "管理画面で1件ずつ確認",
    after: "一言で全体を俯瞰",
    note: "費用・成果・効率を一括比較",
  },
  {
    label: "獲得単価の改善",
    before: "原因の仮説→手動検証→半日",
    after: "AIが数秒で要因を特定",
    note: "どの設定が効いているか即判明",
  },
  {
    label: "ページ離脱の原因分析",
    before: "複数の分析画面を行き来",
    after: "チャットで即座に分析",
    note: "どこで離脱しているか可視化",
  },
  {
    label: "週次レポート作成",
    before: "データ収集→加工→整形 2時間",
    after: "「先週のレポートを出して」",
    note: "反応データ込みで12分で完了",
  },
];

export default function Impact() {
  return (
    <section className="relative py-20 sm:py-28 border-t border-border overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="gradient-blob gradient-blob-accent w-[400px] h-[400px] bottom-0 left-[-5%] opacity-[0.06]"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            Impact
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            導入すると、何が変わるか。
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            浮いた時間を戦略設計に回す。それだけで運用成果が変わる。
          </p>
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-surface-light/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-light/80">
                  <th className="px-6 py-4 font-medium text-text-muted" />
                  <th className="px-6 py-4 font-medium text-text-muted">Before</th>
                  <th className="px-6 py-4 font-medium text-text-muted">After</th>
                  <th className="px-6 py-4 font-medium text-text-muted hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i !== rows.length - 1 ? "border-b border-border/40" : ""}
                  >
                    <td className="px-6 py-5 font-medium text-text whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="px-6 py-5 text-text-muted line-through decoration-text-muted/30">
                      {row.before}
                    </td>
                    <td className="px-6 py-5 font-semibold text-accent">
                      {row.after}
                    </td>
                    <td className="px-6 py-5 text-xs text-text-muted hidden sm:table-cell">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid gap-px sm:grid-cols-3 rounded-2xl overflow-hidden border border-border">
          {[
            { value: "月20時間", desc: "削減できる作業時間" },
            { value: "クリック率 2.7倍", desc: "AI最適化で広告の反応率が向上" },
            { value: "獲得単価 74%減", desc: "¥928→¥242への改善実績" },
          ].map((stat) => (
            <div
              key={stat.desc}
              className="bg-surface-light/60 backdrop-blur-sm px-6 py-8 text-center"
            >
              <div className="text-2xl font-extrabold text-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-text-muted">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
