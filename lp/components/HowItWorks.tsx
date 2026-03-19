const steps = [
  {
    num: "01",
    title: "プランを選んで購入",
    description:
      "決済完了と同時に、プロ版リポジトリへのGitHub招待が届く。待ち時間ゼロで即アクセス。",
  },
  {
    num: "02",
    title: "環境をセットアップ",
    description:
      "git clone → pip install → .env設定。いつもの開発フローと同じ手順で、15分あれば完了する。",
  },
  {
    num: "03",
    title: "あなたの運用が加速する",
    description:
      "Claude DesktopまたはCursorから即座に利用開始。分析も施策実行も、チャットで完結する新しい運用スタイルへ。",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          導入は<span className="text-primary">15分</span>で完了する
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          複雑な設定は不要。普段のワークフローに組み込むだけ。
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
