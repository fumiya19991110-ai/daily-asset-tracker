interface Props {
  icon: string;
  title: string;
  content: string;
  color?: string;
}

export function FeedbackCard({ icon, title, content, color = 'var(--accent)' }: Props) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      <div style={{
        background: `${color}15`,
        borderBottom: `1px solid ${color}30`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color }}>{title}</span>
      </div>
      <div style={{
        padding: '16px',
        fontSize: '14px',
        lineHeight: 1.7,
        color: 'var(--text-secondary)',
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  );
}
