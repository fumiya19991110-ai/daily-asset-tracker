import { useNavigate } from 'react-router-dom';
import type { DailyReport } from '../../lib/types';
import { CATEGORY_COLORS } from '../../lib/types';
import type { AssetCategory } from '../../lib/types';

interface Props {
  report: DailyReport;
  compact?: boolean;
}

export function ReportCard({ report, compact }: Props) {
  const navigate = useNavigate();
  const scoreColor =
    report.assetScore >= 7 ? 'var(--green)' :
    report.assetScore >= 4 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'background 0.15s' }}
      onClick={() => navigate(`/history/${report.id}`)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>
            📅 {report.id}
          </div>
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: 900,
          color: scoreColor,
          background: `${scoreColor}15`,
          borderRadius: '8px',
          padding: '2px 10px',
        }}>
          {report.assetScore}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: compact ? 0 : '8px' }}>
        {report.assetTags.slice(0, compact ? 3 : 999).map(t => {
          const color = CATEGORY_COLORS[t.category as AssetCategory] || '#6b7280';
          return (
            <span key={t.tag} style={{
              background: `${color}22`,
              border: `1px solid ${color}55`,
              color,
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              #{t.tag}
            </span>
          );
        })}
      </div>

      {!compact && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {report.feedbackRecruiter.slice(0, 60)}...
          <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>詳細を見る →</span>
        </div>
      )}
    </div>
  );
}
