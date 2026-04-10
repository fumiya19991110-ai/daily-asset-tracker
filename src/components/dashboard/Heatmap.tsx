import type { DailyReport } from '../../lib/types';

interface Props {
  reports: DailyReport[];
  weeks?: number;
}

function scoreToColor(score: number): string {
  if (score === 0) return '#1a1a1a';
  if (score <= 3) return '#14532d';
  if (score <= 6) return '#16a34a';
  return '#4ade80';
}

function scoreToOpacity(score: number): number {
  if (score === 0) return 1;
  if (score <= 3) return 0.5;
  if (score <= 6) return 0.75;
  return 1;
}

export function Heatmap({ reports, weeks = 16 }: Props) {
  const scoreMap = new Map<string, number>();
  for (const r of reports) scoreMap.set(r.id, r.assetScore);

  // Build grid: weeks × 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOffset = today.getDay(); // 0=Sun

  const days: { date: string; score: number }[][] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const week: { date: string; score: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const daysAgo = w * 7 + (6 - d) - (6 - startOffset);
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      const key = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      week.push({ date: isFuture ? '' : key, score: isFuture ? -1 : (scoreMap.get(key) ?? 0) });
    }
    days.push(week);
  }

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div>
      <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
          <div style={{ height: '12px' }} />
          {dayLabels.map(l => (
            <div key={l} style={{ width: '12px', height: '12px', fontSize: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {l}
            </div>
          ))}
        </div>
        {/* Grid */}
        {days.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Month label */}
            <div style={{ height: '12px', fontSize: '8px', color: 'var(--text-muted)' }}>
              {week[0].date && week[0].date.slice(8) === '01' ? week[0].date.slice(5, 7) + '月' : ''}
            </div>
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date ? `${day.date}: スコア${day.score}` : undefined}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: day.score === -1 ? 'transparent' : scoreToColor(day.score),
                  opacity: day.score === -1 ? 0 : scoreToOpacity(day.score),
                  border: day.date === today.toISOString().slice(0, 10) ? '1px solid var(--accent)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '10px', color: 'var(--text-muted)' }}>
        <span>少</span>
        {[0, 3, 5, 8].map(score => (
          <div key={score} style={{ width: '10px', height: '10px', borderRadius: '2px', background: scoreToColor(score) }} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
