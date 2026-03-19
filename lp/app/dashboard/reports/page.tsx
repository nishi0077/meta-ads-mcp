"use client";

import { useState } from "react";
import { dailyMetrics, formatCurrency, formatNumber } from "@/lib/mock-data";

type Period = "7d" | "14d" | "30d";

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("14d");

  const periodDays = { "7d": 7, "14d": 14, "30d": 30 };
  const days = periodDays[period];
  const data = dailyMetrics.slice(0, Math.min(days, dailyMetrics.length));

  const totals = data.reduce(
    (acc, d) => ({
      spend: acc.spend + d.spend,
      impressions: acc.impressions + d.impressions,
      clicks: acc.clicks + d.clicks,
      conversions: acc.conversions + d.conversions,
    }),
    { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
  );

  const avgCtr =
    totals.impressions > 0
      ? ((totals.clicks / totals.impressions) * 100).toFixed(2)
      : "0";
  const avgCpa =
    totals.conversions > 0
      ? Math.round(totals.spend / totals.conversions)
      : 0;

  const periods: { value: Period; label: string }[] = [
    { value: "7d", label: "過去7日" },
    { value: "14d", label: "過去14日" },
    { value: "30d", label: "過去30日" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">レポート</h1>
        <p className="text-sm text-text-muted mt-1">
          期間別パフォーマンスレポート
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition cursor-pointer ${
              period === p.value
                ? "bg-primary text-white"
                : "border border-border bg-surface-light text-text-muted hover:text-text"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "総広告費", value: formatCurrency(totals.spend) },
          { label: "総インプレッション", value: formatNumber(totals.impressions) },
          { label: "平均CTR", value: `${avgCtr}%` },
          { label: "平均CPA", value: formatCurrency(avgCpa) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-5 text-center"
          >
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border">
          <h3 className="font-semibold">日別レポート</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-surface-light/80">
                <th className="px-5 py-3 font-medium text-text-muted">日付</th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">
                  広告費
                </th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">
                  Imp
                </th>
                <th className="px-5 py-3 font-medium text-text-muted text-right">
                  Click
                </th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden sm:table-cell">
                  CTR
                </th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden sm:table-cell">
                  CV
                </th>
                <th className="px-5 py-3 font-medium text-text-muted text-right hidden md:table-cell">
                  CPA
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => {
                const ctr =
                  d.impressions > 0
                    ? ((d.clicks / d.impressions) * 100).toFixed(2)
                    : "0";
                const cpa =
                  d.conversions > 0
                    ? Math.round(d.spend / d.conversions)
                    : 0;
                return (
                  <tr
                    key={d.date}
                    className={
                      i !== data.length - 1
                        ? "border-b border-border/40"
                        : ""
                    }
                  >
                    <td className="px-5 py-4 font-medium text-text">
                      {d.date}
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted">
                      {formatCurrency(d.spend)}
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted">
                      {formatNumber(d.impressions)}
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted">
                      {formatNumber(d.clicks)}
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted hidden sm:table-cell">
                      {ctr}%
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted hidden sm:table-cell">
                      {d.conversions}
                    </td>
                    <td className="px-5 py-4 text-right text-text-muted hidden md:table-cell">
                      {formatCurrency(cpa)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
