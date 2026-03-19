"use client";

import { useState } from "react";

const faqs = [
  {
    q: "どのAIツールで使えますか？",
    a: "Claude Desktop と Cursor に対応しています。MCP（Model Context Protocol）準拠のため、MCP対応のAIツールであれば利用可能です。",
  },
  {
    q: "Meta広告の運用経験がなくても使えますか？",
    a: "ツール自体は使えますが、本ツールは「すでにMeta広告運用のスキルがある方」が最大の効果を発揮できる設計です。広告運用の基礎知識がある前提で、その実行スピードと分析精度を引き上げるツールです。",
  },
  {
    q: "本番の広告アカウントを壊す心配は？",
    a: "書き込み操作はすべてデフォルトでドライラン（プレビューモード）です。変更内容を確認してから実行でき、新規作成はすべてPAUSED状態。プロの現場を想定した安全設計です。",
  },
  {
    q: "複数の広告アカウントで使えますか？",
    a: "はい。ビジネスマネージャー配下の全アカウントにアクセスできます。代理店運用で複数クライアントを管理する場合にも最適です。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい。月額・年額プランはいつでも解約可能で、次の請求から課金が停止されます。解約後も当月末まではリポジトリへのアクセスが維持されます。",
  },
  {
    q: "返金保証はありますか？",
    a: "はい。購入後14日以内であれば、理由を問わず全額返金します。実際に使ってみて判断してください。",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            FAQ
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            よくある質問
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm transition hover:border-primary/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
