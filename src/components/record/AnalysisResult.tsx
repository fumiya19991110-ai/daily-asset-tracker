import { AssetTagBadges } from './AssetTagBadges';
import { FeedbackCard } from './FeedbackCard';
import type { GeminiAnalysisResult } from '../../lib/types';

interface Props {
  result: GeminiAnalysisResult;
  onSave: () => void;
  saving: boolean;
}

export function AnalysisResult({ result, onSave, saving }: Props) {
  const barWidth = `${(result.asset_score / 10) * 100}%`;
  const scoreColor =
    result.asset_score >= 7 ? 'var(--green)' :
    result.asset_score >= 4 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Score */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          今日の資産スコア
        </div>
        <div style={{ fontSize: '48px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
          {result.asset_score}
          <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 400 }}>/10</span>
        </div>
        <div style={{ marginTop: '12px' }} className="score-bar">
          <div className="score-bar-fill" style={{ width: barWidth, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}99)` }} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="section-label">獲得した資産タグ</div>
        <AssetTagBadges tags={result.asset_tags} />
      </div>

      {/* Feedback */}
      <FeedbackCard
        icon="💼"
        title="転職エージェントの視点"
        content={result.feedback_recruiter}
        color="#3b82f6"
      />
      <FeedbackCard
        icon="🚀"
        title="起業家・経営者の視点"
        content={result.feedback_entrepreneur}
        color="#f59e0b"
      />

      {/* Non assets */}
      {result.non_assets.length > 0 && (
        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--red)', marginBottom: '8px' }}>
            🚫 資産にならなかった業務
          </div>
          <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {result.non_assets.map((item, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item}</li>
            ))}
          </ul>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            → 意識的に減らしていこう
          </div>
        </div>
      )}

      {/* Save button */}
      <button className="btn-primary" onClick={onSave} disabled={saving}>
        {saving ? '保存中...' : '💾 この分析を保存する'}
      </button>
    </div>
  );
}
