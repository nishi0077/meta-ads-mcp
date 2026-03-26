"use client";

import { useState, useMemo } from "react";

const PRESETS = [
  { label: "月50万円", value: 500000 },
  { label: "月100万円", value: 1000000 },
  { label: "月200万円", value: 2000000 },
  { label: "月500万円", value: 5000000 },
];

const MCP_YEARLY_COST = 29800;

export default function ROICalculator() {
  const [adSpend, setAdSpend] = useState(2000000);
  const [feeRate, setFeeRate] = useState(20);

  const result = useMemo(() => {
    const monthlyFee = adSpend * (feeRate / 100);
    const yearlyFee = monthlyFee * 12;
    const savings = yearlyFee - MCP_YEARLY_COST;
    const roi = Math.round((savings / MCP_YEARLY_COST) * 100);
    return { monthlyFee, yearlyFee, savings, roi };
  }, [adSpend, feeRate]);

  const formatYen = (n: number) =>
    n >= 10000
      ? `¥${(n / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万`
      : `¥${n.toLocaleString("ja-JP")}`;

  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          どれだけコスト削減できるか、計算してみる
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-muted">
          現在の広告費と代理店手数料を入力するだけで、年間の削減額がわかります。
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <label className="flex items-center justify-between text-sm font-medium mb-3">
                <span>月額広告費</span>
                <span className="text-primary font-bold text-lg">{formatYen(adSpend)}</span>
              </label>

              <input
                type="range"
                min={100000}
                max={10000000}
                step={100000}
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setAdSpend(p.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                      adSpend === p.value
                        ? "bg-primary text-white"
                        : "bg-surface-lighter text-text-muted hover:bg-surface-light hover:text-text"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-medium mb-3">
                <span>代理店手数料率</span>
                <span className="text-primary font-bold text-lg">{feeRate}%</span>
              </label>

              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={feeRate}
                onChange={(e) => setFeeRate(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-lighter accent-primary"
              />

              <div className="mt-2 flex justify-between text-xs text-text-muted">
                <span>5%</span>
                <span>15%</span>
                <span>20%（相場）</span>
                <span>30%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-light p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <span className="text-sm text-text-muted">現在の年間代理店手数料</span>
                <span className="text-lg font-bold text-red-400">{formatYen(result.yearlyFee)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <span className="text-sm text-text-muted">Meta Ads MCP（年額プラン）</span>
                <span className="text-lg font-bold text-accent">{formatYen(MCP_YEARLY_COST)}</span>
              </div>

              <div className="flex items-center justify-between py-4 rounded-xl bg-accent/10 border border-accent/20 px-4 -mx-1">
                <span className="text-sm font-semibold text-accent">年間削減額</span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-accent">
                    {formatYen(Math.max(0, result.savings))}
                  </span>
                  {result.roi > 0 && (
                    <p className="text-xs text-accent/80 mt-0.5">
                      ROI {result.roi.toLocaleString()}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            <a
              href="#pricing"
              className="cta-btn mt-6 block w-full rounded-lg bg-accent py-3.5 text-center text-sm font-semibold text-white"
            >
              7日間無料で始める
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
