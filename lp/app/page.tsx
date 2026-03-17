import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-surface/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-bold">
            <span className="text-primary">Meta Ads</span> MCP
          </span>
          <div className="hidden sm:flex items-center gap-6 text-sm text-text-muted">
            <a href="#how-it-works" className="transition hover:text-text">
              使い方
            </a>
            <a href="#pricing" className="transition hover:text-text">
              料金
            </a>
            <a
              href="#pricing"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              導入する
            </a>
          </div>
        </div>
      </nav>

      <Hero />
      <PainPoints />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} Meta Ads MCP Server. All rights reserved.</p>
          <p className="mt-2">
            本サービスは Meta 公式のものではありません。Meta Graph API を利用する際は Meta の利用規約を遵守してください。
          </p>
        </div>
      </footer>
    </main>
  );
}
