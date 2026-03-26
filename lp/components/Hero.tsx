"use client";

import { useState } from "react";
import Image from "next/image";
import NotionCarousel from "./NotionCarousel";

const DEMO_VIDEO_ID = "";

const techStack = [
  "Meta Graph API",
  "Claude Desktop",
  "Cursor",
  "MCP Protocol",
  "OAuth 2.0",
];

function DemoSection() {
  const [playing, setPlaying] = useState(false);
  const hasVideo = DEMO_VIDEO_ID.length > 0;

  if (hasVideo && playing) {
    return (
      <div className="mt-12 sm:mt-16 animate-in" style={{ animationDelay: "0.2s" }}>
        <div className="relative rounded-2xl border border-border/80 bg-surface-light/50 p-2 sm:p-3 shadow-2xl shadow-primary/5 backdrop-blur overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0`}
              title="Meta Ads MCP デモ動画"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-text-muted/70">
          60秒でわかるMeta Ads MCP — AIで広告分析を自動化
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 sm:mt-16 animate-in" style={{ animationDelay: "0.2s" }}>
      <div className="relative rounded-2xl border border-border/80 bg-surface-light/50 p-2 sm:p-3 shadow-2xl shadow-primary/5 backdrop-blur overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-9 sm:h-11 bg-surface-light/90 border-b border-border/60 flex items-center px-4 gap-1.5 z-10">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-4 text-xs text-text-muted/60 font-mono hidden sm:inline">
            AI分析レポート — クリエイティブ比較分析
          </span>
          <span className="ml-3 text-xs text-text-muted/60 font-mono sm:hidden">
            クリエイティブ分析
          </span>
        </div>
        <div className="pt-9 sm:pt-11 relative">
          <Image
            src="/analysis-hero.png"
            alt="Meta Ads MCP Serverによる広告分析レポートの出力例"
            width={1200}
            height={675}
            className="w-full rounded-lg"
            priority
          />
          {hasVideo && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              aria-label="デモ動画を再生"
            >
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-accent/90 shadow-xl shadow-accent/30 backdrop-blur transition-transform hover:scale-110">
                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text-muted/70">
        AIがあなたの指示で瞬時に分析・レポートを出力。30ツール搭載 ・ ドライランで安全操作
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="gradient-blob gradient-blob-primary w-[600px] h-[600px] top-[-10%] left-[10%]" />
        <div
          className="gradient-blob gradient-blob-accent w-[400px] h-[400px] top-[20%] right-[5%]"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="gradient-blob gradient-blob-primary w-[500px] h-[500px] bottom-[0%] left-[40%]"
          style={{ animationDelay: "8s", opacity: 0.1 }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center animate-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/80 px-4 py-1.5 text-sm text-text-muted backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            すでにMeta広告を回している運用者のための武器
          </div>

          <h1
            className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            <span className="text-text">広告運用の強者を、</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              さらに強者に。
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted sm:text-lg leading-relaxed">
            あなたの広告運用スキルに、
            <strong className="text-text">30のAI自動化ツール</strong>
            を掛け合わせる。
            <br className="hidden sm:block" />
            分析スピード、施策の打ち手、レポート精度 ――
            すべてが
            <span className="text-accent font-medium">一段上のレベル</span>
            になる。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#pricing"
              className="cta-btn w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white"
            >
              7日間無料で試す
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-text-muted transition hover:bg-surface-light hover:text-text"
            >
              何ができるか見る
            </a>
          </div>
          <p className="mt-3 text-xs text-text-muted/60">
            クレカ登録後7日間は無料。期間中の解約で課金なし。
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {techStack.map((name) => (
            <span
              key={name}
              className="text-xs font-medium tracking-wide text-text-muted/60 uppercase transition hover:text-text-muted"
            >
              {name}
            </span>
          ))}
        </div>

        <DemoSection />

        <NotionCarousel />
      </div>
    </section>
  );
}
