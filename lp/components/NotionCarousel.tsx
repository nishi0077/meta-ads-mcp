"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const notionScreens = [
  {
    title: "週次レポート — 自動生成",
    icon: "📊",
    content: (
      <div className="space-y-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#999] text-xs">
          <span>2026年3月17日 〜 3月23日</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[11px] font-medium">自動更新</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "広告費", value: "¥198.6万", change: "+12%", up: true },
            { label: "問い合わせ数", value: "3,090件", change: "+23%", up: true },
            { label: "獲得単価", value: "¥643", change: "-8%", up: false },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg bg-[#2f2f2f] p-3">
              <div className="text-[11px] text-[#999]">{kpi.label}</div>
              <div className="mt-1 text-lg font-bold text-white">{kpi.value}</div>
              <div className={`mt-0.5 text-[11px] font-medium ${kpi.up ? "text-green-400" : "text-blue-400"}`}>
                {kpi.change} vs 先週
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-[#2f2f2f] p-3">
          <div className="text-[11px] text-[#999] mb-2">キャンペーン別パフォーマンス</div>
          <div className="space-y-2">
            {[
              { name: "引越し（AI最適化）", spend: "¥61.4万", cpa: "¥670", roas: "6.75%", bar: 92 },
              { name: "便利屋", spend: "¥28.6万", cpa: "¥463", roas: "2.99%", bar: 85 },
              { name: "機器設置（AI最適化）", spend: "¥2.8万", cpa: "¥242", roas: "4.83%", bar: 95 },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-[140px] truncate text-[12px] text-[#ccc]">{c.name}</div>
                <div className="flex-1 h-1.5 rounded-full bg-[#3a3a3a] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.bar}%` }} />
                </div>
                <div className="text-[11px] text-[#999] w-16 text-right">{c.roas}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "クリエイティブ分析レポート",
    icon: "🎨",
    content: (
      <div className="space-y-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#999] text-xs">
          <span>上位クリエイティブ比較</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[11px] font-medium">AI分析済</span>
        </div>
        <div className="space-y-3">
          {[
            { rank: "1", name: "親がいなくなったら4", ctr: "5.40%", cvr: "1.8%", status: "🟢 Active", score: 95 },
            { rank: "2", name: "親がいなくなったら5", ctr: "2.94%", cvr: "1.7%", status: "🟢 Active", score: 82 },
            { rank: "3", name: "画像_親がいなくなったら1", ctr: "2.12%", cvr: "0.9%", status: "🟡 Review", score: 68 },
            { rank: "4", name: "やってはいけない3選", ctr: "1.04%", cvr: "0.0%", status: "🔴 Pause推奨", score: 41 },
          ].map((c) => (
            <div key={c.rank} className="flex items-center gap-3 rounded-lg bg-[#2f2f2f] p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3a3a3a] text-xs font-bold text-white">
                {c.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-white font-medium truncate">{c.name}</div>
                <div className="flex gap-3 mt-0.5 text-[11px] text-[#999]">
                  <span>CTR {c.ctr}</span>
                  <span>CVR {c.cvr}</span>
                </div>
              </div>
              <div className="text-[11px] whitespace-nowrap">{c.status}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[#3a3a3a] p-3">
          <div className="text-[11px] text-[#999]">💡 AIインサイト</div>
          <div className="mt-1 text-[12px] text-[#ccc] leading-relaxed">
            「親がいなくなったら4」がCTR 5.40%で最高。「やってはいけない3選」はImp 40.5KでもCVR 0%のためPause推奨。
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "オーディエンス分析",
    icon: "👥",
    content: (
      <div className="space-y-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#999] text-xs">
          <span>セグメント別パフォーマンス</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[11px] font-medium">最新データ</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { seg: "引越し_AI最適化", size: "19.4万人", cpa: "¥670", trend: "↗︎" },
            { seg: "引越し_ファミリー層", size: "17.8万人", cpa: "¥704", trend: "→" },
            { seg: "購入者に似た層", size: "6.8万人", cpa: "¥463", trend: "↗︎" },
            { seg: "45歳以上_提案", size: "3.5万人", cpa: "¥5,946", trend: "↘︎" },
          ].map((s) => (
            <div key={s.seg} className="rounded-lg bg-[#2f2f2f] p-3">
              <div className="text-[12px] text-white font-medium">{s.seg}</div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-sm font-bold text-white">{s.cpa}</span>
                <span className="text-[11px] text-[#999]">{s.trend}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[#999]">size: {s.size}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-[#2f2f2f] p-3">
          <div className="text-[11px] text-[#999] mb-2">配信面パフォーマンス</div>
          <div className="space-y-1.5">
            {[
              { place: "Feed", share: "52%", cpa: "¥702", bar: 72 },
              { place: "Stories/Reels", share: "31%", cpa: "¥510", bar: 90 },
              { place: "Video Feeds", share: "12%", cpa: "¥463", bar: 95 },
              { place: "Audience Network", share: "5%", cpa: "¥1,285", bar: 30 },
            ].map((p) => (
              <div key={p.place} className="flex items-center gap-2">
                <div className="w-[110px] text-[12px] text-[#ccc]">{p.place}</div>
                <div className="flex-1 h-1.5 rounded-full bg-[#3a3a3a] overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${p.bar}%` }} />
                </div>
                <div className="text-[11px] text-[#999] w-14 text-right">{p.cpa}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "施策タスク管理",
    icon: "✅",
    content: (
      <div className="space-y-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#999] text-xs">
          <span>今週の施策アクション</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[11px] font-medium">5件のタスク</span>
        </div>
        <div className="space-y-2">
          {[
            { task: "やってはいけない3選 → Pause実行", status: "完了", color: "bg-green-500", checked: true },
            { task: "親がいなくなったら4 → 予算+30%スケール", status: "完了", color: "bg-green-500", checked: true },
            { task: "引越し × 動画配信面の新しい広告セット作成", status: "進行中", color: "bg-blue-500", checked: false },
            { task: "45歳以上向け → 獲得単価の改善 or 停止判断", status: "未着手", color: "bg-[#555]", checked: false },
            { task: "便利屋の保存率が高い広告を他業種に横展開", status: "未着手", color: "bg-[#555]", checked: false },
          ].map((t) => (
            <div key={t.task} className="flex items-start gap-3 rounded-lg bg-[#2f2f2f] p-3">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded ${t.checked ? "bg-blue-500" : "border border-[#555]"} flex items-center justify-center`}>
                {t.checked && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] font-medium ${t.checked ? "text-[#888] line-through" : "text-white"}`}>
                  {t.task}
                </div>
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium text-white ${t.color}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-[#3a3a3a] p-3">
          <div className="text-[11px] text-[#999]">📌 次週の優先事項</div>
          <div className="mt-1 text-[12px] text-[#ccc] leading-relaxed">
            動画配信面の強化（獲得単価¥463で最安）。45歳以上は表示単価が高騰しており縮小を検討。
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "月次サマリー — 3月",
    icon: "📈",
    content: (
      <div className="space-y-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#999] text-xs">
          <span>2026年3月 月次サマリー</span>
          <span className="ml-auto px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[11px] font-medium">目標達成</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "総広告費", value: "¥198.6万", sub: "全キャンペーン合計" },
            { label: "総CV数", value: "3,090件", sub: "前月比 +22%" },
            { label: "平均獲得単価", value: "¥643", sub: "最安¥242（機器設置）" },
            { label: "平均クリック率", value: "3.41%", sub: "AI最適化が牽引（6.75%）" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-[#2f2f2f] p-3">
              <div className="text-[11px] text-[#999]">{m.label}</div>
              <div className="mt-1 text-lg font-bold text-white">{m.value}</div>
              <div className="mt-0.5 text-[11px] text-green-400">{m.sub}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-[#2f2f2f] p-3">
          <div className="text-[11px] text-[#999] mb-2">週別推移</div>
          <div className="flex items-end gap-1 h-16">
            {[40, 55, 48, 72, 65, 80, 78, 85, 90, 88, 95, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-blue-500/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-[#666]">
            <span>W1</span>
            <span>W2</span>
            <span>W3</span>
            <span>W4</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function NotionCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalSlides = notionScreens.length;

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    el.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        scrollToIndex(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, totalSlides, scrollToIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const card = el.children[0] as HTMLElement | undefined;
      if (!card) return;
      const cardWidth = card.offsetWidth;
      const gap = 16;
      const idx = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(idx, totalSlides - 1));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [totalSlides]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
  };

  return (
    <div
      className="mt-10 sm:mt-14 animate-in"
      style={{ animationDelay: "0.4s" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-sm font-medium text-text-muted">
            <span className="text-primary font-semibold">Notion連携</span> — AIが自動でレポート生成
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => goTo((activeIndex - 1 + totalSlides) % totalSlides)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-light/80 text-text-muted transition hover:bg-surface-lighter hover:text-text cursor-pointer"
            aria-label="前へ"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goTo((activeIndex + 1) % totalSlides)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-light/80 text-text-muted transition hover:bg-surface-lighter hover:text-text cursor-pointer"
            aria-label="次へ"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 notion-carousel"
      >
        {notionScreens.map((screen, i) => (
          <div
            key={i}
            className="w-[340px] sm:w-[400px] shrink-0 rounded-2xl border border-border/80 bg-[#191919] shadow-xl overflow-hidden transition-transform duration-300"
            style={{ transform: activeIndex === i ? "scale(1)" : "scale(0.97)", opacity: activeIndex === i ? 1 : 0.7 }}
          >
            <div className="flex items-center gap-2 border-b border-[#2a2a2a] bg-[#202020] px-4 py-2.5">
              <svg className="h-4 w-4 text-[#999]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4.5A2.5 2.5 0 016.5 2H18a2.5 2.5 0 012.5 2.5v15a2.5 2.5 0 01-2.5 2.5H6.5A2.5 2.5 0 014 19.5v-15zM6.5 4a.5.5 0 00-.5.5v15a.5.5 0 00.5.5H18a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5H6.5z" />
              </svg>
              <span className="text-[13px] text-[#ccc] font-medium">{screen.icon} {screen.title}</span>
            </div>

            <div className="p-4">
              {screen.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        {notionScreens.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-text-muted/40"
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
