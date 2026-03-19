export interface KpiData {
  label: string;
  value: string;
  change: number;
  prefix?: string;
  suffix?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  roas: number;
}

export interface Creative {
  id: string;
  name: string;
  type: "image" | "video" | "carousel";
  campaignName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  rating: "excellent" | "good" | "average" | "poor";
}

export interface DailyMetric {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export const kpiData: KpiData[] = [
  { label: "月間広告費", value: "1,234,567", change: 12.5, prefix: "¥" },
  { label: "インプレッション", value: "4,892,301", change: 8.3 },
  { label: "CTR", value: "2.14", change: 0.3, suffix: "%" },
  { label: "CPA", value: "823", change: -15.2, prefix: "¥" },
];

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "リード獲得キャンペーン",
    status: "ACTIVE",
    objective: "LEAD_GENERATION",
    spend: 456780,
    impressions: 1823400,
    clicks: 38921,
    ctr: 2.13,
    cpc: 11.74,
    conversions: 412,
    cpa: 1109,
    roas: 3.2,
  },
  {
    id: "c2",
    name: "ブランド認知拡大",
    status: "ACTIVE",
    objective: "BRAND_AWARENESS",
    spend: 312450,
    impressions: 2145000,
    clicks: 28340,
    ctr: 1.32,
    cpc: 11.02,
    conversions: 89,
    cpa: 3511,
    roas: 1.1,
  },
  {
    id: "c3",
    name: "コンバージョン最適化",
    status: "ACTIVE",
    objective: "CONVERSIONS",
    spend: 289340,
    impressions: 542100,
    clicks: 15230,
    ctr: 2.81,
    cpc: 19.0,
    conversions: 287,
    cpa: 1008,
    roas: 4.5,
  },
  {
    id: "c4",
    name: "リターゲティング",
    status: "PAUSED",
    objective: "CONVERSIONS",
    spend: 123400,
    impressions: 298700,
    clicks: 8920,
    ctr: 2.99,
    cpc: 13.83,
    conversions: 156,
    cpa: 791,
    roas: 5.8,
  },
  {
    id: "c5",
    name: "春の新商品プロモ",
    status: "COMPLETED",
    objective: "TRAFFIC",
    spend: 52597,
    impressions: 83101,
    clicks: 4320,
    ctr: 5.2,
    cpc: 12.17,
    conversions: 34,
    cpa: 1547,
    roas: 2.1,
  },
];

export const creatives: Creative[] = [
  {
    id: "cr1",
    name: "画像A - メインビジュアル",
    type: "image",
    campaignName: "リード獲得キャンペーン",
    impressions: 40497,
    clicks: 421,
    ctr: 1.04,
    cpc: 531,
    conversions: 12,
    cpa: 8325,
    rating: "excellent",
  },
  {
    id: "cr2",
    name: "動画A - 商品紹介30秒",
    type: "video",
    campaignName: "リード獲得キャンペーン",
    impressions: 28340,
    clicks: 312,
    ctr: 1.1,
    cpc: 480,
    conversions: 8,
    cpa: 10200,
    rating: "good",
  },
  {
    id: "cr3",
    name: "動画B - ユーザーの声",
    type: "video",
    campaignName: "ブランド認知拡大",
    impressions: 8128,
    clicks: 102,
    ctr: 1.25,
    cpc: 280,
    conversions: 0,
    cpa: 0,
    rating: "average",
  },
  {
    id: "cr4",
    name: "カルーセル - 機能紹介",
    type: "carousel",
    campaignName: "コンバージョン最適化",
    impressions: 15230,
    clicks: 289,
    ctr: 1.9,
    cpc: 410,
    conversions: 15,
    cpa: 6820,
    rating: "good",
  },
  {
    id: "cr5",
    name: "画像B - セール告知",
    type: "image",
    campaignName: "春の新商品プロモ",
    impressions: 12400,
    clicks: 198,
    ctr: 1.6,
    cpc: 320,
    conversions: 5,
    cpa: 7600,
    rating: "average",
  },
  {
    id: "cr6",
    name: "動画C - Before/After",
    type: "video",
    campaignName: "リターゲティング",
    impressions: 6500,
    clicks: 156,
    ctr: 2.4,
    cpc: 210,
    conversions: 18,
    cpa: 4200,
    rating: "excellent",
  },
];

export const dailyMetrics: DailyMetric[] = [
  { date: "3/1", spend: 42300, impressions: 168200, clicks: 3540, conversions: 32 },
  { date: "3/2", spend: 38100, impressions: 152400, clicks: 3210, conversions: 28 },
  { date: "3/3", spend: 45600, impressions: 182400, clicks: 3890, conversions: 41 },
  { date: "3/4", spend: 41200, impressions: 164800, clicks: 3420, conversions: 35 },
  { date: "3/5", spend: 48900, impressions: 195600, clicks: 4120, conversions: 44 },
  { date: "3/6", spend: 39800, impressions: 159200, clicks: 3340, conversions: 30 },
  { date: "3/7", spend: 35200, impressions: 140800, clicks: 2960, conversions: 25 },
  { date: "3/8", spend: 44100, impressions: 176400, clicks: 3710, conversions: 38 },
  { date: "3/9", spend: 46800, impressions: 187200, clicks: 3940, conversions: 42 },
  { date: "3/10", spend: 43500, impressions: 174000, clicks: 3660, conversions: 36 },
  { date: "3/11", spend: 50200, impressions: 200800, clicks: 4230, conversions: 47 },
  { date: "3/12", spend: 47100, impressions: 188400, clicks: 3960, conversions: 43 },
  { date: "3/13", spend: 41800, impressions: 167200, clicks: 3520, conversions: 33 },
  { date: "3/14", spend: 38900, impressions: 155600, clicks: 3270, conversions: 29 },
];

export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function formatCurrency(n: number): string {
  return "¥" + n.toLocaleString("ja-JP");
}
