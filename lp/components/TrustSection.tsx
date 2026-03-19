const stats = [
  { value: "30+", label: "搭載ツール" },
  { value: "1/10", label: "レポート作成時間" },
  { value: "15分", label: "導入完了まで" },
  { value: "0件", label: "誤操作事故" },
];

export default function TrustSection() {
  return (
    <section className="py-14 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
