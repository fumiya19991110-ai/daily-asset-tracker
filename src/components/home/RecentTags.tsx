import { useNavigate } from 'react-router-dom';
import type { AssetTag } from '../../lib/types';

interface Props {
  recent: { date: string; tags: AssetTag[] }[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return '今日';
  if (diff === 1) return '昨日';
  if (diff === 2) return '一昨日';
  return dateStr.slice(5).replace('-', '/');
}

export function RecentTags({ recent }: Props) {
  const navigate = useNavigate();
  if (recent.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {recent.map(({ date, tags }) => (
        <div key={date} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            minWidth: '40px',
            paddingTop: '4px',
          }}>
            {formatDate(date)}:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.map(t => (
              <button
                key={t.tag}
                className="tag-badge"
                onClick={() => navigate(`/history?tag=${encodeURIComponent(t.tag)}`)}
              >
                #{t.tag}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
