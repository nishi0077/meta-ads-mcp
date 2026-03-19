interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  prefix?: string;
  suffix?: string;
}

export default function KpiCard({ label, value, change, prefix, suffix }: KpiCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-5 sm:p-6">
      <p className="text-sm text-text-muted">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-extrabold sm:text-3xl">
          {prefix}
          {value}
          {suffix}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? label === "CPA"
                ? "bg-red-500/10 text-red-400"
                : "bg-accent/10 text-accent"
              : isNegative
                ? label === "CPA"
                  ? "bg-accent/10 text-accent"
                  : "bg-red-500/10 text-red-400"
                : "bg-surface-lighter text-text-muted"
          }`}
        >
          <svg
            className={`h-3 w-3 ${isNegative ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-text-muted">前月比</span>
      </div>
    </div>
  );
}
