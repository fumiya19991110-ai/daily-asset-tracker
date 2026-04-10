import { useNavigate } from 'react-router-dom';
import { HeroScore } from '../components/home/HeroScore';
import { AssetTreemap } from '../components/home/AssetTreemap';
import { RecentTags } from '../components/home/RecentTags';
import { useReports } from '../hooks/useReports';
import {
  getTotalScore, getStreak, getDailyScores,
  getTreemapData, getRecentTags
} from '../lib/analytics';

export function HomePage() {
  const { reports, loading } = useReports();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '200px', borderRadius: '20px' }} />
        <div className="skeleton" style={{ height: '160px', borderRadius: '16px' }} />
        <div className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />
      </div>
    );
  }

  const totalScore = getTotalScore(reports);
  const streak = getStreak(reports);
  const dailyScores = getDailyScores(reports, 30);
  const sparklineData = dailyScores.map(d => d.score);
  const treemapData = getTreemapData(reports);
  const recentTags = getRecentTags(reports, 3);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800 }}>🏯 Daily Asset Tracker</h1>
      </div>

      <HeroScore
        totalScore={totalScore}
        streak={streak}
        sparklineData={sparklineData}
      />

      <div>
        <div className="section-label">今月の資産マップ</div>
        <AssetTreemap data={treemapData} />
      </div>

      {recentTags.length > 0 && (
        <div>
          <div className="section-label">最新の資産タグ</div>
          <RecentTags recent={recentTags} />
        </div>
      )}

      <button
        className="btn-primary"
        onClick={() => navigate('/record')}
        style={{ marginTop: '4px' }}
      >
        ＋ 日報を記録する
      </button>
    </div>
  );
}
