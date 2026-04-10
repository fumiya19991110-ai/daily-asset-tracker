import { useState, useEffect } from 'react';
import { CLAUDE_MODELS, DEFAULT_MODEL } from '../lib/claude';

const STORAGE_KEY = 'claude_api_key';
const MODEL_KEY = 'claude_model';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [saved, setSaved] = useState(false);
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem(STORAGE_KEY) || '';
    setApiKey(key);
    setIsSet(!!key);
    setModel(localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL);
  }, []);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    localStorage.setItem(MODEL_KEY, model);
    setIsSet(!!trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsSet(false);
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">⚙️ 設定</h1>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
          🔑 Claude APIキー
        </div>

        {isSet && (
          <div style={{ background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#86efac', marginBottom: '12px' }}>
            ✅ APIキー設定済み
          </div>
        )}

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.6 }}>
          Anthropic Console（console.anthropic.com）でAPIキーを取得してください。<br />
          キーは「sk-ant-...」で始まります。
        </div>

        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          style={{ marginBottom: '16px', fontFamily: 'monospace', fontSize: '14px' }}
        />

        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          🤖 使用モデル
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {CLAUDE_MODELS.map(m => (
            <label key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px', borderRadius: '10px',
              background: model === m.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: model === m.id ? '1px solid var(--border-accent)' : '1px solid var(--border)',
              cursor: 'pointer',
            }}>
              <input type="radio" name="model" value={m.id} checked={model === m.id}
                onChange={() => setModel(m.id)} style={{ accentColor: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '13px', color: model === m.id ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600 }}>
                  {m.label}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave}>
            {saved ? '✅ 保存しました' : '💾 保存する'}
          </button>
          {isSet && (
            <button className="btn-secondary" style={{ flex: 1 }} onClick={handleClear}>削除</button>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>📖 APIキーの取得方法</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.9 }}>
          1. <strong style={{ color: 'var(--text-primary)' }}>console.anthropic.com</strong> にアクセス<br />
          2. サインアップ / ログイン<br />
          3. 「API Keys」→「Create Key」<br />
          4. 発行されたキー（sk-ant-...）をコピー<br />
          5. 上の入力欄に貼り付けて保存
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>ℹ️ アプリについて</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          🏯 <strong style={{ color: 'var(--text-primary)' }}>Daily Asset Tracker</strong><br />
          毎日の日報からキャリア資産を抽出・可視化するツール。<br />
          データはブラウザ内（IndexedDB）に保存。
        </div>
      </div>
    </div>
  );
}
