export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          あなたの運用力を、<span className="text-primary">次のレベル</span>へ。
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-muted leading-relaxed">
          管理画面の操作時間を戦略設計に変える。
          すでにスキルがあるあなただからこそ、この差が成果に直結する。
        </p>

        <div className="mt-8">
          <a
            href="#pricing"
            className="cta-btn inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white"
          >
            武器を手に入れる
          </a>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          14日間返金保証 ・ いつでも解約可能 ・ Stripe決済で安全
        </p>
      </div>
    </section>
  );
}
