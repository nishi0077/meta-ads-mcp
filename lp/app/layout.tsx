import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Meta Ads MCP Server | AIでMeta広告運用を自動化",
  description:
    "AIに話しかけるだけでFacebook / Instagram広告の管理・分析が完結。30ツール搭載のMCPサーバーで、レポート確認・クリエイティブ管理・予算変更まですべてチャットで。",
  openGraph: {
    title: "Meta Ads MCP Server | AIでMeta広告運用を自動化",
    description:
      "広告マネージャーを開かずに、AIとの対話だけでMeta広告を運用。30ツール搭載、ドライランモードで安全操作。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads MCP Server | AIでMeta広告運用を自動化",
    description:
      "広告マネージャーを開かずに、AIとの対話だけでMeta広告を運用。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
