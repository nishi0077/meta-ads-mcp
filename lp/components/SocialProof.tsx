"use client";

const dataAfter = [520, 680, 820, 950, 1120, 1480, 1986];
const dataBefore = [480, 520, 580, 610, 640, 670, 700];
const labels = ["9月", "10月", "11月", "12月", "1月", "2月", "3月"];

const W = 560;
const H = 200;
const PX = 40;
const PY = 20;
const chartW = W - PX * 2;
const chartH = H - PY * 2;
const maxVal = 2200;

function toPoints(data: number[]): string {
  return data
    .map((v, i) => {
      const x = PX + (i / (data.length - 1)) * chartW;
      const y = PY + chartH - (v / maxVal) * chartH;
      return `${x},${y}`;
    })
    .join(" ");
}

function toAreaPath(data: number[]): string {
  const pts = data.map((v, i) => {
    const x = PX + (i / (data.length - 1)) * chartW;
    const y = PY + chartH - (v / maxVal) * chartH;
    return { x, y };
  });
  const bottom = PY + chartH;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.4;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.4;
    d += ` C${cp1x},${pts[i - 1].y} ${cp2x},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  d += ` L${pts[pts.length - 1].x},${bottom} L${pts[0].x},${bottom} Z`;
  return d;
}

function toLinePath(data: number[]): string {
  const pts = data.map((v, i) => {
    const x = PX + (i / (data.length - 1)) * chartW;
    const y = PY + chartH - (v / maxVal) * chartH;
    return { x, y };
  });
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.4;
    const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.4;
    d += ` C${cp1x},${pts[i - 1].y} ${cp2x},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
}

const gridLines = [0, 550, 1100, 1650, 2200];

export default function SocialProof() {
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            導入企業の<span className="text-primary">売上推移</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-text-muted">
            代理店任せから自社運用に切り替え、6ヶ月で売上184%増を達成。
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface-light/60 p-5 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-text-muted">月間広告経由の売上</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold text-text">¥1,986万</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +184%
                </span>
              </div>
            </div>
            <div className="flex gap-5 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded-full bg-primary" />
                MCP導入後
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded-full bg-text-muted/40" />
                導入前
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0668E1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0668E1" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {gridLines.map((val) => {
                const y = PY + chartH - (val / maxVal) * chartH;
                return (
                  <g key={val}>
                    <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#243049" strokeWidth="0.5" strokeDasharray="4 4" />
                    <text x={PX - 6} y={y + 3} textAnchor="end" fill="#8896B3" fontSize="9" fontFamily="sans-serif">
                      {val === 0 ? "0" : `${val / 100}万`}
                    </text>
                  </g>
                );
              })}

              {labels.map((label, i) => {
                const x = PX + (i / (labels.length - 1)) * chartW;
                return (
                  <text key={label} x={x} y={H - 2} textAnchor="middle" fill="#8896B3" fontSize="10" fontFamily="sans-serif">
                    {label}
                  </text>
                );
              })}

              <path d={toAreaPath(dataAfter)} fill="url(#areaGrad)" />
              <path d={toLinePath(dataBefore)} fill="none" stroke="#8896B3" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
              <path d={toLinePath(dataAfter)} fill="none" stroke="#0668E1" strokeWidth="2.5" strokeLinecap="round" />

              {dataAfter.map((v, i) => {
                const x = PX + (i / (dataAfter.length - 1)) * chartW;
                const y = PY + chartH - (v / maxVal) * chartH;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#0A0E1A" stroke="#0668E1" strokeWidth="2" />
                    {i === dataAfter.length - 1 && (
                      <g>
                        <rect x={x - 28} y={y - 24} width="56" height="18" rx="4" fill="#0668E1" />
                        <text x={x} y={y - 12} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                          ¥1,986万
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-5">
            {[
              { label: "作業時間", value: "月20時間削減", color: "text-accent" },
              { label: "クリック率", value: "2.7倍に向上", color: "text-primary" },
              { label: "獲得単価", value: "74%改善", color: "text-accent" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-lg font-bold sm:text-xl ${s.color}`}>{s.value}</div>
                <div className="mt-0.5 text-xs text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
