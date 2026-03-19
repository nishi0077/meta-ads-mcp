"use client";

import { useState } from "react";
import { campaigns, formatCurrency, formatNumber } from "@/lib/mock-data";

type StatusFilter = "ALL" | "ACTIVE" | "PAUSED" | "COMPLETED";

const statusStyles = {
  ACTIVE: "bg-accent/10 text-accent",
  PAUSED: "bg-yellow-500/10 text-yellow-400",
  COMPLETED: "bg-text-muted/10 text-text-muted",
};

const statusLabels = {
  ACTIVE: "配信中",
  PAUSED: "停止中",
  COMPLETED: "完了",
};

export default function CampaignsPage() {
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const filtered =
    filter === "ALL"
      ? campaigns
      : campaigns.filter((c) => c.status === filter);

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "ALL", label: "すべて" },
    { value: "ACTIVE", label: "配信中" },
    { value: "PAUSED", label: "停止中" },
    { value: "COMPLETED", label: "完了" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">キャンペーン分析</h1>
        <p className="text-sm text-text-muted mt-1">
          全キャンペーンの詳細パフォーマンス
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer ${
              filter === f.value
                ? "bg-primary text-white"
                : "border border-border bg-surface-light text-text-muted hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-surface-light/80">
                <th className="px-5 py-3 font-medium text-text-muted">キャンペーン名</th>
                <th className="px-5 py-3 font-medium text-text-muted">ステータス</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">費用</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">Imp</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">Click</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">CTR</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden sm:table-cell">CPC</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden md:table-cell">CV</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden md:table-cell">CPA</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden lg:table-cell">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className={`transition hover:bg-surface-lighter/50 ${
                    i !== filtered.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-text whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[c.status]}`}
                    >
                      {statusLabels[c.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted">
                    {formatCurrency(c.spend)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted">
                    {formatNumber(c.impressions)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted">
                    {formatNumber(c.clicks)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted">{c.ctr}%</td>
                  <td className="px-5 py-4 text-right text-text-muted hidden sm:table-cell">
                    {formatCurrency(c.cpc)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted hidden md:table-cell">
                    {formatNumber(c.conversions)}
                  </td>
                  <td className="px-5 py-4 text-right text-text-muted hidden md:table-cell">
                    {formatCurrency(c.cpa)}
                  </td>
                  <td className="px-5 py-4 text-right font-medium hidden lg:table-cell">
                    <span
                      className={
                        c.roas >= 3
                          ? "text-accent"
                          : c.roas >= 2
                            ? "text-primary"
                            : "text-text-muted"
                      }
                    >
                      {c.roas}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
