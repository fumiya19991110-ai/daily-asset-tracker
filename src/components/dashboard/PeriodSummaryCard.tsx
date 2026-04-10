import type { SummaryData } from '../../lib/types';

interface Props {
  data: SummaryData;
}

export function PeriodSummaryCard({ data }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-around',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent)' }}>{data.total_days}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>記録日数</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent)' }}>{data.avg_score}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>平均スコア</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent)' }}>{data.top_assets.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>主要資産</div>
        </div>
      </div>

      {data.top_assets.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Top資産</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.top_assets.map((a, i) => (
              <span key={i} className="tag-badge" style={{ cursor: 'default', fontSize: '12px' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ borderLeft: '3px solid #3b82f6' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', marginBottom: '6px' }}>💼 転職エージェント総括</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.summary_recruiter}</div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid #f59e0b' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '6px' }}>🚀 起業家総括</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.summary_entrepreneur}</div>
      </div>

      <div className="card" style={{ background: 'var(--accent-dim2)', borderColor: 'var(--border-accent)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>📝 ポートフォリオ1行</div>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic' }}>「{data.portfolio_line}」</div>
      </div>

      {data.growth_areas && (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>伸びている領域</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.growth_areas}</div>
        </div>
      )}
    </div>
  );
}
