import { useNavigate } from 'react-router-dom';
import { CATEGORY_COLORS } from '../../lib/types';
import type { AssetTag, AssetCategory } from '../../lib/types';

interface Props {
  tags: AssetTag[];
}

export function AssetTagBadges({ tags }: Props) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags.map(t => {
        const color = CATEGORY_COLORS[t.category as AssetCategory] || '#6b7280';
        return (
          <button
            key={t.tag}
            onClick={() => navigate(`/history?tag=${encodeURIComponent(t.tag)}`)}
            title={t.detail}
            style={{
              background: `${color}22`,
              border: `1px solid ${color}66`,
              color,
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              textAlign: 'center',
              minWidth: '80px',
              transition: 'background 0.15s',
            }}
          >
            <span>#{t.tag}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }}>{t.category}</span>
          </button>
        );
      })}
    </div>
  );
}
