import { campaigns, formatCurrency } from "@/lib/mock-data";

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

export default function CampaignTable() {
  return (
    <div className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border">
        <div>
          <h3 className="font-semibold">キャンペーン一覧</h3>
          <p className="text-sm text-text-muted mt-0.5">直近のキャンペーン</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border bg-surface-light/80">
              <th className="px-5 py-3 font-medium text-text-muted">キャンペーン名</th>
              <th className="px-5 py-3 font-medium text-text-muted">ステータス</th>
              <th className="px-5 py-3 font-medium text-text-muted text-right">費用</th>
              <th className="px-5 py-3 font-medium text-text-muted text-right hidden sm:table-cell">CTR</th>
              <th className="px-5 py-3 font-medium text-text-muted text-right hidden md:table-cell">CPA</th>
              <th className="px-5 py-3 font-medium text-text-muted text-right hidden lg:table-cell">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr
                key={c.id}
                className={i !== campaigns.length - 1 ? "border-b border-border/40" : ""}
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
                <td className="px-5 py-4 text-right text-text-muted hidden sm:table-cell">
                  {c.ctr}%
                </td>
                <td className="px-5 py-4 text-right text-text-muted hidden md:table-cell">
                  {formatCurrency(c.cpa)}
                </td>
                <td className="px-5 py-4 text-right font-medium hidden lg:table-cell">
                  <span className={c.roas >= 3 ? "text-accent" : c.roas >= 2 ? "text-primary" : "text-text-muted"}>
                    {c.roas}x
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
