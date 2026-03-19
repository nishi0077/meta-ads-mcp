import KpiCard from "@/components/dashboard/KpiCard";
import SpendChart from "@/components/dashboard/SpendChart";
import CampaignTable from "@/components/dashboard/CampaignTable";
import { kpiData } from "@/lib/mock-data";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">概要</h1>
        <p className="text-sm text-text-muted mt-1">Meta広告のパフォーマンスサマリー</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <SpendChart />

      <CampaignTable />
    </div>
  );
}
