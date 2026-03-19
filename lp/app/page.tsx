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
      <PainPoints />
      <Impact />
      <Features />
      <TrustSection />
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
