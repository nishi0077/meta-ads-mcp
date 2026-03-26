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
    <section id="how-it-works" className="relative py-16 sm:py-20 border-t border-border overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-blob gradient-blob-primary w-[500px] h-[500px] top-[10%] right-[-10%] opacity-[0.08]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            Getting Started
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            導入は<span className="text-primary">15分</span>で完了する
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            複雑な設定は不要。普段のワークフローに組み込むだけ。
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+48px)] hidden h-px w-[calc(100%-96px)] bg-gradient-to-r from-primary/40 to-transparent sm:block" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 rotate-6 transition group-hover:rotate-12" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-primary/30 bg-surface-light text-2xl font-bold text-primary">
                    {step.num}
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
