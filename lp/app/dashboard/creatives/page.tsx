"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { creatives, formatNumber } from "@/lib/mock-data";

const ratingStyles = {
  excellent: { bg: "bg-accent/10", text: "text-accent", label: "優秀" },
  good: { bg: "bg-primary/10", text: "text-primary", label: "良好" },
  average: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "普通" },
  poor: { bg: "bg-red-500/10", text: "text-red-400", label: "要改善" },
};

const typeLabels = { image: "画像", video: "動画", carousel: "カルーセル" };

const chartData = creatives.map((c) => ({
  name: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
  CTR: c.ctr,
  CPC: c.cpc,
}));

export default function CreativesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">クリエイティブ比較</h1>
        <p className="text-sm text-text-muted mt-1">
          クリエイティブ別のパフォーマンス分析
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-5 sm:p-6">
        <h3 className="font-semibold mb-6">CTR 比較</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#8896B3", fontSize: 11 }}
                axisLine={{ stroke: "#243049" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8896B3", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #243049",
                  borderRadius: "12px",
                  color: "#E2E8F0",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value}%`, "CTR"]}
              />
              <Bar dataKey="CTR" fill="#0668E1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creatives.map((c) => {
          const rating = ratingStyles[c.rating];
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-5 transition hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {c.campaignName}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${rating.bg} ${rating.text}`}
                >
                  {rating.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-lg bg-surface-lighter px-2 py-0.5 text-xs text-text-muted">
                  {typeLabels[c.type]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-surface/60 py-3">
                  <p className="text-lg font-bold">{c.ctr}%</p>
                  <p className="text-xs text-text-muted">CTR</p>
                </div>
                <div className="rounded-xl bg-surface/60 py-3">
                  <p className="text-lg font-bold">¥{formatNumber(c.cpc)}</p>
                  <p className="text-xs text-text-muted">CPC</p>
                </div>
                <div className="rounded-xl bg-surface/60 py-3">
                  <p className="text-lg font-bold">{formatNumber(c.conversions)}</p>
                  <p className="text-xs text-text-muted">CV</p>
                </div>
                <div className="rounded-xl bg-surface/60 py-3">
                  <p className="text-lg font-bold">
                    {formatNumber(c.impressions)}
                  </p>
                  <p className="text-xs text-text-muted">Imp</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
