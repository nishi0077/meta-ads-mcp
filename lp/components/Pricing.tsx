"use client";

import { useState } from "react";

const plans = [
  {
    name: "月額プラン",
    badge: null,
    price: 4980,
    priceLabel: "¥4,980",
    priceSuffix: "/月",
    priceNote: null,
    features: [
      "全30ツール即利用可能",
      "プロ版リポジトリへのアクセス",
      "アップデート自動配信",
      "セットアップドキュメント",
      "いつでも解約OK",
    ],
    cta: "まず試してみる",
    priceId: "monthly",
    highlighted: false,
  },
  {
    name: "年額プラン",
    badge: "50%OFF",
    price: 29800,
    priceLabel: "¥29,800",
    priceSuffix: "/年",
    priceNote: "月あたり¥2,483 ― 年間¥29,960の差がつく",
    features: [
      "月額プランの全機能",
      "優先サポート",
      "運用効率化ガイド",
      "Meta API活用Tips集",
      "実質半額で武器を維持",
    ],
    cta: "年額で導入する",
    priceId: "yearly",
    highlighted: true,
  },
  {
    name: "買い切りプラン",
    badge: "BEST VALUE",
    price: 59800,
    priceLabel: "¥59,800",
    priceSuffix: "（一括）",
    priceNote: "一度の投資で永久に使える武器",
    features: [
      "年額プランの全機能",
      "永久アクセス権",
      "将来のアップデートも無料",
      "Slackサポートチャンネル",
      "ランニングコストゼロ",
    ],
    cta: "永久ライセンスを手に入れる",
    priceId: "lifetime",
    highlighted: false,
  },
];

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlanClick = (priceId: string) => {
    setSelectedPlan(priceId);
    setGithubUsername("");
    setError("");
    setModalOpen(true);
  };

  const handleCheckout = async () => {
    if (!githubUsername.trim()) {
      setError("GitHubユーザー名を入力してください");
      return;
    }

    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(githubUsername.trim())) {
      setError("有効なGitHubユーザー名を入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: selectedPlan,
          githubUsername: githubUsername.trim(),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "エラーが発生しました。もう一度お試しください。");
      }
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.priceId === selectedPlan);

  return (
    <>
      <section id="pricing" className="py-20 sm:py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            投資対効果で選ぶ
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
            14日間の返金保証付き。使ってみて合わなければ全額返金。リスクゼロで試せる。
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
                  onClick={() => handlePlanClick(plan.priceId)}
                  className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition cursor-pointer ${
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

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface-light p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">購入手続き</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-lighter hover:text-text transition cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedPlanData && (
              <div className="mb-6 rounded-xl bg-surface/60 border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedPlanData.name}</span>
                  <span className="font-bold text-primary">
                    {selectedPlanData.priceLabel}
                    <span className="text-sm text-text-muted">{selectedPlanData.priceSuffix}</span>
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="github-username" className="block text-sm font-medium mb-2">
                  GitHubユーザー名
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">@</span>
                  <input
                    id="github-username"
                    type="text"
                    value={githubUsername}
                    onChange={(e) => {
                      setGithubUsername(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCheckout();
                    }}
                    placeholder="your-username"
                    className="w-full rounded-lg border border-border bg-surface py-3 pl-8 pr-4 text-sm text-text placeholder:text-text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  購入後、このアカウントにリポジトリ招待が送られます
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full rounded-lg bg-accent py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    処理中...
                  </span>
                ) : (
                  "Stripeで安全に決済する"
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SSL暗号化
                </span>
                <span>14日間返金保証</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
