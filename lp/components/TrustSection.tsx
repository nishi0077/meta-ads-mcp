const stats = [
  { value: "代理店手数料", highlight: "最大20%削減", sub: "自社で分析・運用できる範囲が広がる" },
  { value: "運用ノウハウを", highlight: "自社に蓄積", sub: "外注依存から脱却し、再現性のある運用へ" },
  { value: "作業時間", highlight: "月20時間削減", sub: "レポート・分析を自動化して戦略に集中" },
  { value: "広告成果", highlight: "獲得単価74%改善", sub: "浮いた時間で施策の質と量を向上" },
];

export default function TrustSection() {
  return (
    <section className="py-14 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-sm text-text-muted">{stat.value}</div>
              <div className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
                {stat.highlight}
              </div>
              <div className="mt-1 text-xs text-text-muted">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
