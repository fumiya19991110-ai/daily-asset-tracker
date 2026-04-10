import type { DailyReport, AssetCategory, AssetTag } from './types';

export interface TagCount {
  tag: string;
  category: AssetCategory;
  count: number;
}

export interface CategoryCount {
  category: AssetCategory;
  count: number;
}

export interface DailyScore {
  date: string;
  score: number;
}

export function getTotalScore(reports: DailyReport[]): number {
  return reports.reduce((sum, r) => sum + r.assetScore, 0);
}

export function getStreak(reports: DailyReport[]): number {
  if (reports.length === 0) return 0;
  const sorted = [...reports].sort((a, b) => b.id.localeCompare(a.id));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted[i].id === expectedStr) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getDailyScores(reports: DailyReport[], days = 30): DailyScore[] {
  const map = new Map<string, number>();
  for (const r of reports) map.set(r.id, r.assetScore);

  const result: DailyScore[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, score: map.get(key) ?? 0 });
  }
  return result;
}

export function getTagCounts(reports: DailyReport[]): TagCount[] {
  const map = new Map<string, TagCount>();
  for (const r of reports) {
    for (const t of r.assetTags) {
      const existing = map.get(t.tag);
      if (existing) {
        existing.count++;
      } else {
        map.set(t.tag, { tag: t.tag, category: t.category as AssetCategory, count: 1 });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getCategoryCounts(reports: DailyReport[]): CategoryCount[] {
  const map = new Map<AssetCategory, number>();
  for (const r of reports) {
    for (const t of r.assetTags) {
      const cat = t.category as AssetCategory;
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTreemapData(reports: DailyReport[], recentDays = 30) {
  const now = new Date();
  const recentCutoff = new Date(now.getTime() - recentDays * 24 * 60 * 60 * 1000);

  const categoryTagMap = new Map<AssetCategory, Map<string, { total: number; recent: number; detail: string }>>();

  for (const r of reports) {
    const isRecent = new Date(r.date) >= recentCutoff;
    for (const t of r.assetTags) {
      const cat = t.category as AssetCategory;
      if (!categoryTagMap.has(cat)) categoryTagMap.set(cat, new Map());
      const tagMap = categoryTagMap.get(cat)!;
      const existing = tagMap.get(t.tag);
      if (existing) {
        existing.total++;
        if (isRecent) existing.recent++;
      } else {
        tagMap.set(t.tag, { total: 1, recent: isRecent ? 1 : 0, detail: t.detail });
      }
    }
  }

  return Array.from(categoryTagMap.entries()).map(([cat, tagMap]) => ({
    name: cat,
    children: Array.from(tagMap.entries()).map(([tag, data]) => ({
      name: tag,
      size: data.total,
      recent: data.recent,
      detail: data.detail,
    })),
  }));
}

export function buildTagSummaryText(reports: DailyReport[]): string {
  const counts = getTagCounts(reports);
  return counts.map(t => `${t.tag}: ${t.count}回`).join('\n');
}

export function buildDailySummariesText(reports: DailyReport[]): string {
  return reports
    .slice(0, 30)
    .map(r => `${r.id} スコア${r.assetScore}: ${r.assetTags.map(t => t.tag).join(', ')}`)
    .join('\n');
}

export function getRecentTags(reports: DailyReport[], days = 3): { date: string; tags: AssetTag[] }[] {
  const sorted = [...reports].sort((a, b) => b.id.localeCompare(a.id));
  return sorted.slice(0, days).map(r => ({ date: r.id, tags: r.assetTags }));
}

export function filterReportsByTag(reports: DailyReport[], tag: string): DailyReport[] {
  return reports.filter(r => r.assetTags.some(t => t.tag === tag));
}

export function getWeekReports(reports: DailyReport[]): DailyReport[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return reports.filter(r => new Date(r.date) >= cutoff);
}

export function getMonthReports(reports: DailyReport[]): DailyReport[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return reports.filter(r => new Date(r.date) >= cutoff);
}

export function get3MonthReports(reports: DailyReport[]): DailyReport[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  return reports.filter(r => new Date(r.date) >= cutoff);
}
