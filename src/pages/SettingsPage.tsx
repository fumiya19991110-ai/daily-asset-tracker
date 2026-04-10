import { useState } from 'react';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">⚙️ 設定</h1>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
          🔑 Gemini APIキー
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.6 }}>
          Google AI Studio（ai.google.dev）で取得したAPIキーを入力してください。
          キーはブラウザのlocalStorageにのみ保存され、サーバーには送信されません。
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{ marginBottom: '12px', fontFamily: 'monospace', fontSize: '14px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>
            {saved ? '✅ 保存しました' : '💾 保存する'}
          </button>
          {apiKey && (
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
          <div>📱 <strong>Daily Asset Tracker</strong></div>
          <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
            毎日の日報からキャリア資産を抽出・可視化するツールです。<br />
            データはすべてブラウザ内（IndexedDB）に保存されます。<br />
            エクスポート機能でバックアップをお取りください。
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
          📱 iPhoneホーム画面に追加
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          1. Safariでこのページを開く<br />
          2. 画面下の「共有」ボタンをタップ<br />
          3. 「ホーム画面に追加」を選択<br />
          4. フルスクリーンアプリとして使用できます
        </div>
      </div>
    </div>
  );
}
