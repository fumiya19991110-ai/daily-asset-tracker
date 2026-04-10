import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { DailyScore } from '../../lib/analytics';

interface Props {
  data: DailyScore[];
}

export function ScoreAreaChart({ data }: Props) {
  const filtered = data.filter(d => d.score > 0);
  if (filtered.length === 0) {
    return (
      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        記録がありません
      </div>
    );
  }

  const display = data.map(d => ({
    ...d,
    date: d.date.slice(5).replace('-', '/'),
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={display} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="date" tick={{ fill: '#606060', fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis domain={[0, 10]} tick={{ fill: '#606060', fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }}
          labelStyle={{ color: '#a0a0a0' }}
          itemStyle={{ color: '#00d4aa' }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#00d4aa"
          strokeWidth={2}
          fill="url(#scoreGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#00d4aa' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
