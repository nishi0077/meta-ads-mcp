import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PainPoints from "@/components/PainPoints";
import Impact from "@/components/Impact";
import Features from "@/components/Features";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Hero />
      <TrustSection />
      <PainPoints />
      <Impact />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />

      <footer className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <span className="text-lg font-bold">
                <span className="text-primary">Meta Ads</span> MCP
              </span>
              <p className="mt-3 text-sm text-text-muted leading-relaxed max-w-xs">
                Meta広告運用のスキルに30のAI自動化ツールを掛け合わせる。プロのためのMCPサーバー。
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                リンク
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#features" className="text-text-muted transition hover:text-text">
                    機能一覧
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-text-muted transition hover:text-text">
                    使い方
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-text-muted transition hover:text-text">
                    料金プラン
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nishi0077/meta-ads-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted transition hover:text-text"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                サポート
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://github.com/nishi0077/meta-ads-mcp/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted transition hover:text-text"
                  >
                    お問い合わせ (GitHub Issues)
                  </a>
                </li>
                <li>
                  <span className="text-text-muted">14日間返金保証</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <p>&copy; {new Date().getFullYear()} Meta Ads MCP Server. All rights reserved.</p>
            <p>
              本サービスは Meta 公式のものではありません。
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
