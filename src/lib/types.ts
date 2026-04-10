export interface AssetTag {
  tag: string;
  category: AssetCategory;
  detail: string;
}

export type AssetCategory =
  | 'EC運用'
  | 'Web開発'
  | 'マーケティング'
  | '営業・交渉'
  | 'データ分析'
  | 'コンテンツ制作'
  | '事業設計'
  | 'AI活用'
  | 'その他';

export const ASSET_CATEGORIES: AssetCategory[] = [
  'EC運用',
  'Web開発',
  'マーケティング',
  '営業・交渉',
  'データ分析',
  'コンテンツ制作',
  '事業設計',
  'AI活用',
  'その他',
];

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  'EC運用': '#00d4aa',
  'Web開発': '#3b82f6',
  'マーケティング': '#f59e0b',
  '営業・交渉': '#ef4444',
  'データ分析': '#8b5cf6',
  'コンテンツ制作': '#ec4899',
  '事業設計': '#14b8a6',
  'AI活用': '#06b6d4',
  'その他': '#6b7280',
};

export interface DailyReport {
  id: string;           // YYYY-MM-DD
  date: Date;
  rawText: string;
  assetTags: AssetTag[];
  nonAssets: string[];
  feedbackRecruiter: string;
  feedbackEntrepreneur: string;
  assetScore: number;   // 1-10
  createdAt: Date;
}

export interface PeriodSummary {
  id: string;           // "week-2026-W15" or "month-2026-04"
  type: 'weekly' | 'monthly';
  period: string;
  data: SummaryData;
  createdAt: Date;
}

export interface SummaryData {
  period: string;
  total_days: number;
  avg_score: number;
  top_assets: string[];
  new_assets: string[];
  growth_areas: string;
  weak_areas: string;
  summary_recruiter: string;
  summary_entrepreneur: string;
  portfolio_line: string;
}

export interface GeminiAnalysisResult {
  asset_tags: AssetTag[];
  non_assets: string[];
  feedback_recruiter: string;
  feedback_entrepreneur: string;
  asset_score: number;
}
