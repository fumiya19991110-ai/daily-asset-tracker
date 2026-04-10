import { useState } from 'react';
import { CATEGORY_COLORS } from '../../lib/types';
import type { AssetCategory } from '../../lib/types';

interface TreeNode {
  name: string;
  children: { name: string; size: number; recent: number; detail: string }[];
}

interface Props {
  data: TreeNode[];
}

export function AssetTreemap({ data }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  if (data.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--border)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.3 }}>🗺️</div>
        <div>日報を記録すると資産マップが表示されます</div>
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6 }}>ここが埋まっていきます →</div>
      </div>
    );
  }

  const total = data.reduce((s, cat) => s + cat.children.reduce((cs, c) => cs + c.size, 0), 0);

  const selectedCat = data.find(d => d.name === selected);

  return (
    <div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {data.map(cat => {
          const catTotal = cat.children.reduce((s, c) => s + c.size, 0);
          const pct = (catTotal / total) * 100;
          const maxRecent = Math.max(...cat.children.map(c => c.recent), 1);
          const recentness = cat.children.reduce((s, c) => s + c.recent, 0) / maxRecent;
          const opacity = 0.4 + recentness * 0.6;
          const color = CATEGORY_COLORS[cat.name as AssetCategory] || '#6b7280';

          return (
            <button
              key={cat.name}
              onClick={() => setSelected(selected === cat.name ? null : cat.name)}
              style={{
                flex: `${Math.max(pct, 8)} 0 auto`,
                minWidth: '60px',
                minHeight: '56px',
                background: `${color}`,
                opacity,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                cursor: 'pointer',
                border: selected === cat.name ? '2px solid #fff' : '2px solid transparent',
                transition: 'opacity 0.2s, border 0.15s',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#000', textAlign: 'center', lineHeight: 1.2 }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#000' }}>{catTotal}</div>
            </button>
          );
        })}
      </div>

      {selectedCat && (
        <div style={{
          marginTop: '12px',
          background: 'var(--bg-elevated)',
          borderRadius: '12px',
          padding: '12px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>
            {selectedCat.name} の資産タグ
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {selectedCat.children.map(c => (
              <div
                key={c.name}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                {c.name} <span style={{ color: 'var(--accent)', fontWeight: 700 }}>×{c.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
