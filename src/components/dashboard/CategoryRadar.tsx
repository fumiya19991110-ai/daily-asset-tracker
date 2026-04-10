import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { ASSET_CATEGORIES } from '../../lib/types';
import type { CategoryCount } from '../../lib/analytics';

interface Props {
  data: CategoryCount[];
}

export function CategoryRadar({ data }: Props) {
  const map = new Map(data.map(d => [d.category, d.count]));
  const radarData = ASSET_CATEGORIES.map(cat => ({
    category: cat,
    count: map.get(cat) ?? 0,
  }));

  if (data.length === 0) {
    return (
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        記録がありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="#2a2a2a" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#a0a0a0', fontSize: 10 }}
        />
        <Radar
          dataKey="count"
          stroke="#00d4aa"
          fill="#00d4aa"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
