import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORY_COLORS } from '../../lib/types';
import type { TagCount } from '../../lib/analytics';
import type { AssetCategory } from '../../lib/types';

interface Props {
  data: TagCount[];
}

export function TagBarChart({ data }: Props) {
  const top10 = data.slice(0, 10);
  if (top10.length === 0) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        記録がありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(top10.length * 32, 160)}>
      <BarChart
        data={top10}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 80 }}
      >
        <XAxis type="number" tick={{ fill: '#606060', fontSize: 10 }} />
        <YAxis
          type="category"
          dataKey="tag"
          tick={{ fill: '#a0a0a0', fontSize: 11 }}
          width={80}
        />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }}
          cursor={{ fill: '#ffffff08' }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {top10.map((entry) => (
            <Cell
              key={entry.tag}
              fill={CATEGORY_COLORS[entry.category as AssetCategory] || '#6b7280'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
