export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          広告マネージャーの<span className="text-primary">作業時間を1/3に</span>しませんか？
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-muted leading-relaxed">
          管理画面を行き来する時間を、分析と戦略立案に使えるようになります。
          14日間の返金保証付きなので、リスクなくお試しいただけます。
        </p>

        <div className="mt-8">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-accent/40"
          >
            今すぐプランを選ぶ
          </a>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          14日間返金保証 ・ いつでも解約可能 ・ クレジットカード決済
        </p>
      </div>
    </section>
  );
}
