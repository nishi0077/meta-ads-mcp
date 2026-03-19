import { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入完了 | Meta Ads MCP Server",
};

const setupSteps = [
  {
    num: "1",
    title: "ライセンスキーを確認",
    description:
      "ご登録のメールアドレスにライセンスキーが記載された確認メールが届きます。このキーは.envファイルの設定で使用します。（形式: MMCP-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX）",
  },
  {
    num: "2",
    title: "GitHubの招待メールを確認",
    description:
      "登録したGitHubアカウントのメールアドレスに招待メールが届きます。「Accept invitation」をクリックしてリポジトリへのアクセスを有効にしてください。",
  },
  {
    num: "3",
    title: "リポジトリをクローン",
    code: "git clone https://github.com/nishi0077/meta-ads-mcp-pro.git\ncd meta-ads-mcp-pro",
  },
  {
    num: "4",
    title: "環境を構築",
    code: "python -m venv .venv\n# Mac/Linux: source .venv/bin/activate\n# Windows: .venv\\Scripts\\activate\npip install -r requirements.txt",
  },
  {
    num: "5",
    title: ".envファイルを設定",
    code: "cp .env.example .env\n# .env を開いてMeta App情報とライセンスキーを記入",
  },
  {
    num: "6",
    title: "初回OAuth認証を実行",
    code: "python meta_ads_server.py",
    description:
      "ブラウザが開き、Metaアカウントの認証画面が表示されます。許可するとトークンが自動保存されます。",
  },
  {
    num: "7",
    title: "Claude Desktop / Cursor に接続",
    description:
      "設定ファイルにMCPサーバーの接続情報を追加し、アプリを再起動すれば準備完了です。詳細はリポジトリのREADMEを参照してください。",
  },
];

export default function SuccessPage() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <svg
              className="h-10 w-10 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">ご購入ありがとうございます</h1>
          <p className="mt-3 text-text-muted">
            GitHubリポジトリへの招待メールをお送りしました。
            <br />
            以下の手順でセットアップを完了してください。
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {setupSteps.map((step) => (
            <div
              key={step.num}
              className="rounded-xl border border-border bg-surface-light p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {step.num}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  {step.description && (
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  {step.code && (
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-[#1E1E1E] p-4 text-sm text-text-muted">
                      <code>{step.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <h3 className="font-semibold text-primary">
            サポートが必要ですか？
          </h3>
          <p className="mt-2 text-sm text-text-muted">
            セットアップでお困りの場合は、お気軽にお問い合わせください。
          </p>
          <a
            href="https://github.com/nishi0077/meta-ads-mcp-pro/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center rounded-lg border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            GitHubでサポートを受ける
          </a>
        </div>
      </div>
    </main>
  );
}
