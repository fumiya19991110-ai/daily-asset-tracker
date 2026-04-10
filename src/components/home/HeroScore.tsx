import { useEffect, useRef, useState } from 'react';

interface Props {
  totalScore: number;
  streak: number;
  sparklineData: number[];
}

export function HeroScore({ totalScore, streak, sparklineData }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const duration = 1200;

  useEffect(() => {
    if (totalScore === 0) return;
    startRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(totalScore * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [totalScore]);

  const max = Math.max(...sparklineData, 1);
  const w = 200;
  const h = 40;
  const points = sparklineData.map((v, i) => {
    const x = (i / (sparklineData.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  });
  const areaPoints = `0,${h} ${points.join(' ')} ${w},${h}`;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.04))',
      border: '1px solid var(--border-accent)',
      borderRadius: '20px',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '8px' }}>
        🔥 資産スコア累計
      </div>
      <div style={{
        fontSize: '64px',
        fontWeight: 900,
        color: 'var(--accent)',
        lineHeight: 1,
        letterSpacing: '-2px',
        marginBottom: '4px',
      }}>
        {displayed}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        assets accumulated
      </div>

      {sparklineData.length > 1 && (
        <div style={{ margin: '0 auto 16px', maxWidth: '200px' }}>
          <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#sparkGrad)" />
            <polyline
              points={points.join(' ')}
              fill="none"
              stroke="#00d4aa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0,212,170,0.1)',
        borderRadius: '20px',
        padding: '6px 16px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--accent)',
      }}>
        📅 {streak > 0 ? `${streak}日連続記録中` : '記録を始めよう'}
      </div>
    </div>
  );
}
