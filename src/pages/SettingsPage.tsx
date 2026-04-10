import { useState, useEffect } from 'react';
import { saveApiKey, loadApiKey } from '../lib/db';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    loadApiKey().then(key => {
      setApiKey(key);
      setIsSet(!!key);
    });
  }, []);

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    await saveApiKey(trimmed);
    setIsSet(!!trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    await saveApiKey('');
    setApiKey('');
    setIsSet(false);
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">⚙️ 設定</h1>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
          🔑 Gemini APIキー
        </div>

        {isSet && (
          <div style={{
            background: '#22c55e15',
            border: '1px solid #22c55e40',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#86efac',
            marginBottom: '12px',
          }}>
            ✅ APIキー設定済み — 次回以降も自動で読み込まれます
          </div>
        )}

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.6 }}>
          Google AI Studio（ai.google.dev）で取得したAPIキーを入力してください。
          一度保存すれば再入力は不要です。
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          style={{ marginBottom: '12px', fontFamily: 'monospace', fontSize: '14px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>
            {saved ? '✅ 保存しました' : '💾 保存する'}
          </button>
          {isSet && (
            <button className="btn-secondary" style={{ flex: 1 }} onClick={handleClear}>
              削除
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
          ℹ️ アプリについて
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <div>🏯 <strong>Daily Asset Tracker</strong></div>
          <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
            毎日の日報からキャリア資産を抽出・可視化するツールです。<br />
            データはすべてブラウザ内（IndexedDB）に保存されます。<br />
            エクスポート機能でバックアップをお取りください。
          </div>
        </div>
      </div>
    </div>
  );
}
