const steps = [
  {
    num: "01",
    title: "プランを購入",
    description:
      "プランを選んで決済するだけ。購入後すぐにGitHubプライベートリポジトリへの招待メールが届きます。",
  },
  {
    num: "02",
    title: "環境を構築",
    description:
      "リポジトリをクローンし、pip installで依存パッケージをインストール。.envファイルにMeta App情報を設定します。",
  },
  {
    num: "03",
    title: "AIに話しかけて運用開始",
    description:
      "Claude DesktopまたはCursorを起動し、AIに話しかけるだけ。レポート確認から予算変更まで、すべてチャットで完結します。",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          <span className="text-primary">3ステップ</span>で始められる
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          購入からAI広告運用の開始まで、最短30分で完了します。
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+40px)] hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-primary/40 to-transparent sm:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xl font-bold text-primary">
                {step.num}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
