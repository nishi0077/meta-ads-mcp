"use client";

import { useState } from "react";

const faqs = [
  {
    q: "どのAIツールで使えますか？",
    a: "Claude Desktop と Cursor に対応しています。MCP（Model Context Protocol）に準拠しているため、MCP対応のAIツールであれば今後も利用可能です。",
  },
  {
    q: "セットアップは難しいですか？",
    a: "Python 3.11以上の環境があれば、pip installとenvファイルの設定だけで完了します。詳細なセットアップガイドとドキュメントを用意しているので、エンジニアでなくても30分程度で始められます。",
  },
  {
    q: "Meta Appの作成は必要ですか？",
    a: "はい。Meta for Developersでアプリを作成し、App IDとApp Secretを取得する必要があります。OAuth認証またはシステムユーザートークンで接続できます。手順はドキュメントに記載しています。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい。いつでも解約可能で、次の請求から課金が停止されます。解約後も当月末まではリポジトリへのアクセスが維持されます。",
  },
  {
    q: "返金保証はありますか？",
    a: "はい。購入後14日以内であれば、理由を問わず全額返金いたします。安心してお試しください。",
  },
  {
    q: "本番の広告アカウントを壊してしまう心配はありませんか？",
    a: "書き込み操作はすべてデフォルトでドライラン（プレビューモード）になっています。変更内容を確認してから実行するので、誤操作のリスクはありません。新規作成はすべてPAUSED状態で作成されます。",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          よくある質問
        </h2>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface-light transition hover:border-primary/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium pr-4">{faq.q}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
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
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
