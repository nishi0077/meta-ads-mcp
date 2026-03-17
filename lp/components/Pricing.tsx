"use client";

const plans = [
  {
    name: "月額プラン",
    badge: null,
    price: 4980,
    priceLabel: "¥4,980",
    priceSuffix: "/月",
    priceNote: null,
    features: [
      "プライベートリポジトリへのアクセス",
      "30ツールすべて利用可能",
      "アップデート自動配信",
      "セットアップドキュメント",
      "いつでも解約OK",
    ],
    cta: "月額で始める",
    priceId: "monthly",
    highlighted: false,
  },
  {
    name: "年額プラン",
    badge: "50%OFF",
    price: 29800,
    priceLabel: "¥29,800",
    priceSuffix: "/年",
    priceNote: "月あたり¥2,483 ― 年間で¥29,960おトク",
    features: [
      "月額プランの全機能",
      "優先メールサポート",
      "セットアップガイド動画",
      "Meta API活用Tips集",
      "月額の半額で利用可能",
    ],
    cta: "年額で始める",
    priceId: "yearly",
    highlighted: true,
  },
  {
    name: "買い切りプラン",
    badge: "BEST VALUE",
    price: 59800,
    priceLabel: "¥59,800",
    priceSuffix: "（一括）",
    priceNote: "月額12ヶ月分で永久利用 ― 追加費用なし",
    features: [
      "年額プランの全機能",
      "永久アクセス権",
      "将来のアップデートも無料",
      "Slackサポートチャンネル",
      "サブスク不要で安心",
    ],
    cta: "買い切りで手に入れる",
    priceId: "lifetime",
    highlighted: false,
  },
];

export default function Pricing() {
  const handleCheckout = async (priceId: string) => {
    const ghUser = prompt(
      "GitHubユーザー名を入力してください（リポジトリ招待に使用します）"
    );
    if (!ghUser) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, githubUsername: ghUser }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <section id="pricing" className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          料金プラン
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
          14日間の返金保証付き。合わなければ全額返金します。
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition ${
                plan.highlighted
                  ? "border-primary bg-surface-light shadow-lg shadow-primary/10 sm:scale-[1.03]"
                  : "border-border bg-surface-light hover:border-primary/30"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white ${
                    plan.highlighted ? "bg-primary" : "bg-accent"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-bold">{plan.name}</h3>

              <div className="mt-5">
                <span className="text-4xl font-extrabold">
                  {plan.priceLabel}
                </span>
                <span className="text-text-muted">{plan.priceSuffix}</span>
              </div>
              {plan.priceNote && (
                <p className="mt-1.5 text-xs text-accent font-medium">
                  {plan.priceNote}
                </p>
              )}

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.priceId)}
                className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/25"
                    : "border border-border bg-surface-lighter text-text hover:border-primary/40 hover:bg-surface-light"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-text-muted">
          クレジットカード決済（Stripe）・ 14日間返金保証 ・
          買い切りプランは永久利用
        </p>
      </div>
    </section>
  );
}
