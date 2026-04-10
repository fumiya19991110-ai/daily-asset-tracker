import { useState } from 'react';
import { ScoreAreaChart } from '../components/dashboard/ScoreAreaChart';
import { TagBarChart } from '../components/dashboard/TagBarChart';
import { CategoryRadar } from '../components/dashboard/CategoryRadar';
import { Heatmap } from '../components/dashboard/Heatmap';
import { PeriodSummaryCard } from '../components/dashboard/PeriodSummaryCard';
import { useReports } from '../hooks/useReports';
import { useGemini } from '../hooks/useGemini';
import {
  getDailyScores, getTagCounts, getCategoryCounts,
  getWeekReports, getMonthReports, get3MonthReports,
  buildTagSummaryText, buildDailySummariesText
} from '../lib/analytics';
import { saveSummary } from '../lib/db';
import type { PeriodSummary, SummaryData } from '../lib/types';

type Period = 'week' | 'month' | '3month' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  week: '今週',
  month: '今月',
  '3month': '3ヶ月',
  all: '全期間',
};

export function DashboardPage() {
  const { reports, loading } = useReports();
  const [period, setPeriod] = useState<Period>('month');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const { summarize } = useGemini();

  const filtered =
    period === 'week' ? getWeekReports(reports) :
    period === 'month' ? getMonthReports(reports) :
    period === '3month' ? get3MonthReports(reports) :
    reports;

  const dailyScores = getDailyScores(filtered, period === 'week' ? 7 : period === 'month' ? 30 : period === '3month' ? 90 : 365);
  const tagCounts = getTagCounts(filtered);
  const categoryCounts = getCategoryCounts(filtered);

  const handleGenerateSummary = async (type: 'weekly' | 'monthly') => {
    setSummaryLoading(true);
    const periodLabel = type === 'weekly' ? '1週間' : '1ヶ月';
    const targetReports = type === 'weekly' ? getWeekReports(reports) : getMonthReports(reports);
    const tagText = buildTagSummaryText(targetReports);
    const dailyText = buildDailySummariesText(targetReports);
    const result = await summarize(periodLabel, tagText, dailyText);
    if (result) {
      setSummary(result);
      const now = new Date();
      const id = type === 'weekly'
        ? `week-${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`
        : `month-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const ps: PeriodSummary = { id, type, period: result.period, data: result, createdAt: now };
      await saveSummary(ps);
    }
    setSummaryLoading(false);
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '40px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '180px', borderRadius: '16px' }} />
        <div className="skeleton" style={{ height: '220px', borderRadius: '16px' }} />
      </div>
    );
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">📊 ダッシュボード</h1>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: period === p ? 700 : 500,
              background: period === p ? 'var(--accent)' : 'var(--bg-elevated)',
              color: period === p ? '#000' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Area chart */}
      <div className="card">
        <div className="section-label">📈 資産スコア推移</div>
        <ScoreAreaChart data={dailyScores} />
      </div>

      {/* Heatmap */}
      <div className="card">
        <div className="section-label">🗓 資産ヒートマップ</div>
        <Heatmap reports={reports} weeks={16} />
      </div>

      {/* Tag bar chart */}
      <div className="card">
        <div className="section-label">🏷 資産タグ Top10</div>
        <TagBarChart data={tagCounts} />
      </div>

      {/* Radar chart */}
      <div className="card">
        <div className="section-label">🧩 カテゴリ別バランス</div>
        <CategoryRadar data={categoryCounts} />
      </div>

      {/* Summary */}
      <div className="card">
        <div className="section-label">📊 週次 / 月次総括</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            className="btn-secondary"
            style={{ flex: 1, fontSize: '13px' }}
            onClick={() => handleGenerateSummary('weekly')}
            disabled={summaryLoading}
          >
            {summaryLoading ? '生成中...' : '今週の総括を生成する'}
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, fontSize: '13px' }}
            onClick={() => handleGenerateSummary('monthly')}
            disabled={summaryLoading}
          >
            {summaryLoading ? '生成中...' : '今月の総括を生成する'}
          </button>
        </div>

        {summaryLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton" style={{ height: '60px', borderRadius: '10px' }} />
            <div className="skeleton" style={{ height: '80px', borderRadius: '10px' }} />
            <div className="skeleton" style={{ height: '80px', borderRadius: '10px' }} />
          </div>
        )}

        {summary && !summaryLoading && <PeriodSummaryCard data={summary} />}
      </div>
    </div>
  );
}
