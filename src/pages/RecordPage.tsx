import { useState } from 'react';
import { AnalysisResult } from '../components/record/AnalysisResult';
import { useGemini } from '../hooks/useGemini';
import { useReports } from '../hooks/useReports';
import type { GeminiAnalysisResult, DailyReport } from '../lib/types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RecordPage() {
  const [date, setDate] = useState(todayStr());
  const [text, setText] = useState('');
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { loading, error, analyze } = useGemini();
  const { save } = useReports();

  const hasApiKey = !!localStorage.getItem('gemini_api_key');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setSaved(false);
    const res = await analyze(text);
    if (res) setResult(res);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    const report: DailyReport = {
      id: date,
      date: new Date(date),
      rawText: text,
      assetTags: result.asset_tags,
      nonAssets: result.non_assets,
      feedbackRecruiter: result.feedback_recruiter,
      feedbackEntrepreneur: result.feedback_entrepreneur,
      assetScore: result.asset_score,
      createdAt: new Date(),
    };
    await save(report);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 className="page-title">📝 日報を記録</h1>

      {!hasApiKey && (
        <div style={{
          background: '#ef444420',
          border: '1px solid #ef444450',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#fca5a5',
        }}>
          ⚠️ APIキーが未設定です。設定画面からGemini APIキーを入力してください。
        </div>
      )}

      <div>
        <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          日付
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ maxWidth: '180px' }}
        />
      </div>

      <div>
        <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          日報テキストをここに貼付
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="LINEからコピーした日報テキストを貼り付けてください..."
          style={{
            minHeight: '200px',
            resize: 'vertical',
            lineHeight: 1.6,
          }}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleAnalyze}
        disabled={loading || !text.trim() || !hasApiKey}
      >
        {loading ? '分析中...' : '🔍 資産を分析する'}
      </button>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />
        </div>
      )}

      {error && (
        <div style={{
          background: '#ef444420',
          border: '1px solid #ef444450',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#fca5a5',
        }}>
          ❌ {error}
        </div>
      )}

      {saved && (
        <div style={{
          background: '#22c55e20',
          border: '1px solid #22c55e50',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#86efac',
          textAlign: 'center',
        }}>
          ✅ 保存しました！
        </div>
      )}

      {result && !loading && (
        <AnalysisResult result={result} onSave={handleSave} saving={saving} />
      )}
    </div>
  );
}
