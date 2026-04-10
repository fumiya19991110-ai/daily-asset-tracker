import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { CalendarView } from '../components/history/CalendarView';
import { ReportCard } from '../components/history/ReportCard';
import { AssetTagBadges } from '../components/record/AssetTagBadges';
import { FeedbackCard } from '../components/record/FeedbackCard';
import { useReports } from '../hooks/useReports';
import { getTagCounts, filterReportsByTag } from '../lib/analytics';
import type { DailyReport } from '../lib/types';
import { exportData, importData } from '../lib/db';

function DetailView({ report }: { report: DailyReport }) {
  const navigate = useNavigate();
  const scoreColor =
    report.assetScore >= 7 ? 'var(--green)' :
    report.assetScore >= 4 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button
        onClick={() => navigate('/history')}
        style={{ background: 'none', color: 'var(--accent)', fontSize: '14px', textAlign: 'left', paddingBottom: '4px' }}
      >
        ← 履歴に戻る
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>📅 {report.id}</h1>
        <div style={{ fontSize: '28px', fontWeight: 900, color: scoreColor }}>{report.assetScore}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/10</span></div>
      </div>

      <div>
        <div className="section-label">獲得した資産タグ</div>
        <AssetTagBadges tags={report.assetTags} />
      </div>

      <FeedbackCard icon="💼" title="転職エージェントの視点" content={report.feedbackRecruiter} color="#3b82f6" />
      <FeedbackCard icon="🚀" title="起業家・経営者の視点" content={report.feedbackEntrepreneur} color="#f59e0b" />

      {report.nonAssets.length > 0 && (
        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--red)', marginBottom: '8px' }}>🚫 資産にならなかった業務</div>
          <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {report.nonAssets.map((item, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="section-label">日報テキスト（原文）</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {report.rawText}
        </div>
      </div>
    </div>
  );
}

export function HistoryPage() {
  const { id } = useParams<{ id?: string }>();
  const { reports, loading, refresh } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('tag'));
  const [_selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tag = searchParams.get('tag');
    setSelectedTag(tag);
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      const found = reports.find(r => r.id === id);
      if (found) setSelectedReport(found);
    }
  }, [id, reports]);

  if (id) {
    const report = reports.find(r => r.id === id);
    if (report) return <DetailView report={report} />;
  }

  const tagCounts = getTagCounts(reports);
  const filteredReports = selectedTag ? filterReportsByTag(reports, selectedTag) : [];

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importData(text);
    await refresh();
    alert('インポートしました');
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '280px', borderRadius: '16px' }} />
        <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />
      </div>
    );
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">📅 記録カレンダー</h1>

      <div className="card">
        <CalendarView
          reports={reports}
          onSelect={r => navigate(`/history/${r.id}`)}
        />
      </div>

      {/* Tag filter */}
      <div>
        <div className="section-label">🔍 タグで探す</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tagCounts.slice(0, 20).map(t => (
            <button
              key={t.tag}
              className={`tag-badge ${selectedTag === t.tag ? 'active' : ''}`}
              onClick={() => {
                if (selectedTag === t.tag) {
                  setSelectedTag(null);
                  setSearchParams({});
                } else {
                  setSelectedTag(t.tag);
                  setSearchParams({ tag: t.tag });
                }
              }}
            >
              #{t.tag} <span style={{ opacity: 0.6, marginLeft: '4px' }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtered reports */}
      {selectedTag && (
        <div>
          <div className="section-label">#{selectedTag} の日報 ({filteredReports.length}件)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredReports.map(r => (
              <ReportCard key={r.id} report={r} compact />
            ))}
          </div>
        </div>
      )}

      {/* Export/Import */}
      <div className="card">
        <div className="section-label">データ管理</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" style={{ flex: 1, fontSize: '13px' }} onClick={handleExport}>
            📤 エクスポート
          </button>
          <label style={{ flex: 1 }}>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <div className="btn-secondary" style={{ textAlign: 'center', cursor: 'pointer', fontSize: '13px' }}>
              📥 インポート
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
