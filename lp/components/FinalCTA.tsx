export default function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-border overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-blob gradient-blob-primary w-[700px] h-[700px] top-[-20%] left-[20%] opacity-[0.12]" />
        <div
          className="gradient-blob gradient-blob-accent w-[400px] h-[400px] bottom-[-10%] right-[10%] opacity-[0.08]"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">
          What are you waiting for?
        </p>

        <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight">
          あなたの運用力を、
          <br className="hidden sm:block" />
          <span className="text-primary">次のレベル</span>へ。
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-text-muted leading-relaxed">
          管理画面の操作時間を戦略設計に変える。
          すでにスキルがあるあなただからこそ、この差が成果に直結する。
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href="#pricing"
            className="cta-btn w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white"
          >
            武器を手に入れる
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-text-muted transition hover:bg-surface-light hover:text-text"
          >
            機能を見る
          </a>
        </div>

        <p className="mt-8 text-xs text-text-muted">
          14日間返金保証 ・ いつでも解約可能 ・ Stripe決済で安全
        </p>
      </div>
    </section>
  );
}
