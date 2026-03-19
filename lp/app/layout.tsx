import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-serif-jp",
});

export const metadata: Metadata = {
  title: "Meta Ads MCP Server | 実力ある運用者を、さらに強者にする",
  description:
    "Meta広告運用のスキルに30のAI自動化ツールを掛け合わせる。分析スピード、施策の打ち手、レポート精度。すべてが一段上のレベルになるMCPサーバー。",
  openGraph: {
    title: "Meta Ads MCP Server | 実力ある運用者を、さらに強者にする",
    description:
      "あなたの広告運用スキルに30のAI自動化ツールを掛け合わせる。チャットで完結する、プロのためのMeta広告運用ツール。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads MCP Server | 実力ある運用者を、さらに強者にする",
    description:
      "あなたの広告運用スキルに30のAI自動化ツールを掛け合わせる。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSerifJP.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
