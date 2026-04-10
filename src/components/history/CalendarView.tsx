import { useState } from 'react';
import type { DailyReport } from '../../lib/types';

interface Props {
  reports: DailyReport[];
  onSelect: (report: DailyReport) => void;
}

function scoreToEmoji(score: number): string {
  if (score >= 7) return '🟢';
  if (score >= 4) return '🟡';
  return '🔴';
}

export function CalendarView({ reports, onSelect }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const scoreMap = new Map<string, number>();
  for (const r of reports) scoreMap.set(r.id, r.assetScore);
  const reportMap = new Map<string, DailyReport>();
  for (const r of reports) reportMap.set(r.id, r);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const weeks: (number | null)[][] = [];
  let current: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    current.push(d);
    if (current.length === 7) { weeks.push(current); current = []; }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  const dayLabels = ['月', '火', '水', '木', '金', '土', '日'];
  // Adjust: JS getDay() returns 0=Sun, but we show Mon-Sun
  // firstDay from new Date().getDay(): 0=Sun, need to convert for Mon-start
  // Re-calc with Mon-start
  const firstDayMon = (new Date(year, month, 1).getDay() + 6) % 7;
  const weeksMon: (number | null)[][] = [];
  let cur: (number | null)[] = Array(firstDayMon).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cur.push(d);
    if (cur.length === 7) { weeksMon.push(cur); cur = []; }
  }
  if (cur.length > 0) {
    while (cur.length < 7) cur.push(null);
    weeksMon.push(cur);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', fontSize: '18px' }} onClick={prev}>◀</button>
        <div style={{ fontWeight: 700, fontSize: '16px' }}>{year}年{month + 1}月</div>
        <button className="btn-secondary" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', fontSize: '18px' }} onClick={next}>▶</button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {dayLabels.map(l => (
          <div key={l} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '4px 0' }}>{l}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {weeksMon.flat().map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const score = scoreMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const report = reportMap.get(dateStr);

          return (
            <button
              key={i}
              onClick={() => { if (report) onSelect(report); }}
              disabled={!report}
              style={{
                aspectRatio: '1',
                borderRadius: '10px',
                background: isToday ? 'var(--accent-dim)' : 'var(--bg-card)',
                border: isToday ? '1px solid var(--accent)' : '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px',
                cursor: report ? 'pointer' : 'default',
                opacity: !report && !isToday ? 0.5 : 1,
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-primary)' }}>{day}</span>
              {score !== undefined && (
                <span style={{ fontSize: '8px', lineHeight: 1 }}>{scoreToEmoji(score)}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
        <span>🟢 7以上</span>
        <span>🟡 4-6</span>
        <span>🔴 1-3</span>
        <span>空白=未記録</span>
      </div>
    </div>
  );
}
