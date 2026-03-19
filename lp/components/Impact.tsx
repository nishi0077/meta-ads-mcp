const rows = [
  {
    label: "レポート作成",
    before: "2時間 / 週",
    after: "12分 / 週",
    note: "作業時間 1/10",
  },
  {
    label: "管理画面の操作",
    before: "1日の30%",
    after: "チャットで完結",
    note: "戦略設計に集中",
  },
  {
    label: "アカウント切り替え",
    before: "手動で1件ずつ",
    after: "一括横断分析",
    note: "5件でも1回",
  },
  {
    label: "施策の実行スピード",
    before: "思いついてから30分",
    after: "思いついたら即実行",
    note: "打ち手の数が変わる",
  },
];

export default function Impact() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-sm font-medium tracking-widest text-text-muted uppercase">
          Impact
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl leading-snug">
          導入すると、何が変わるか。
        </h2>
        <p className="mt-4 text-text-muted max-w-xl">
          浮いた時間を戦略設計に回す。それだけで運用成果が変わる。
        </p>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="pb-3 pr-4 font-medium" />
                <th className="pb-3 px-4 font-medium">Before</th>
                <th className="pb-3 px-4 font-medium">After</th>
                <th className="pb-3 pl-4 font-medium hidden sm:table-cell" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <td className="py-5 pr-4 font-medium text-text whitespace-nowrap">
                    {row.label}
                  </td>
                  <td className="py-5 px-4 text-text-muted">{row.before}</td>
                  <td className="py-5 px-4 font-semibold text-accent">
                    {row.after}
                  </td>
                  <td className="py-5 pl-4 text-xs text-text-muted hidden sm:table-cell">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-px sm:grid-cols-3 rounded-xl overflow-hidden border border-border">
          {[
            { value: "月20時間", desc: "削減できる作業時間" },
            { value: "3〜5倍", desc: "施策の実行回数" },
            { value: "ROAS改善", desc: "打ち手が増えた結果" },
          ].map((stat) => (
            <div
              key={stat.desc}
              className="bg-surface-light px-6 py-8 text-center"
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
