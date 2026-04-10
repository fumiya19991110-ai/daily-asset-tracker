import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', icon: '🏯', label: 'ホーム' },
  { path: '/record', icon: '📝', label: '記録' },
  { path: '/dashboard', icon: '📊', label: 'ダッシュ' },
  { path: '/history', icon: '📅', label: '履歴' },
  { path: '/settings', icon: '⚙️', label: '設定' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      background: 'rgba(20,20,20,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'flex-start',
      paddingTop: '4px',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '8px 4px',
              background: 'none',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              minHeight: '44px',
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 500 }}>{tab.label}</span>
            {active && (
              <span style={{
                position: 'absolute',
                bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) - 2px)',
                width: '20px',
                height: '2px',
                background: 'var(--accent)',
                borderRadius: '1px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
