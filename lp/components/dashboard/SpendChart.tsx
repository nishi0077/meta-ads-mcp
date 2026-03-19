"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { dailyMetrics } from "@/lib/mock-data";

export default function SpendChart() {
  return (
    <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">日別広告費推移</h3>
          <p className="text-sm text-text-muted mt-0.5">直近14日間</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyMetrics}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0668E1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0668E1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#243049" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8896B3", fontSize: 12 }}
              axisLine={{ stroke: "#243049" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8896B3", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #243049",
                borderRadius: "12px",
                color: "#E2E8F0",
                fontSize: "13px",
              }}
              formatter={(value) => [
                `¥${Number(value).toLocaleString()}`,
                "広告費",
              ]}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="#0668E1"
              strokeWidth={2}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
