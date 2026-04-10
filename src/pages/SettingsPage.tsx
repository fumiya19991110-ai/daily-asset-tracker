import { useState, useEffect } from 'react';
import { saveApiKey, loadApiKey } from '../lib/db';
import { GEMINI_MODELS, DEFAULT_MODEL } from '../lib/gemini';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [saved, setSaved] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);
  const [detectError, setDetectError] = useState('');

  useEffect(() => {
    loadApiKey().then(key => {
      setApiKey(key);
      setIsSet(!!key);
    });
    setModel(localStorage.getItem('gemini_model') || DEFAULT_MODEL);
  }, []);

  const handleDetect = async () => {
    const key = apiKey.trim();
    if (!key) { setDetectError('先にAPIキーを入力してください'); return; }
    setDetecting(true);
    setDetectError('');
    setAvailableModels([]);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=50`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || '取得失敗');
      const models = (data.models || [])
        .filter((m: { name: string; supportedGenerationMethods?: string[] }) =>
          m.supportedGenerationMethods?.includes('generateContent')
        )
        .map((m: { name: string; displayName?: string }) => ({
          id: m.name.replace('models/', ''),
          name: m.displayName || m.name.replace('models/', ''),
        }));
      setAvailableModels(models);
      if (models.length > 0) setModel(models[0].id);
    } catch (e) {
      setDetectError(e instanceof Error ? e.message : '検出失敗');
    } finally {
      setDetecting(false);
    }
  };

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    await saveApiKey(trimmed);
    localStorage.setItem('gemini_model', model);
    setIsSet(!!trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    await saveApiKey('');
    setApiKey('');
    setIsSet(false);
  };

  const displayModels = availableModels.length > 0 ? availableModels : GEMINI_MODELS.map(m => ({ id: m.id, name: m.label }));

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 className="page-title">⚙️ 設定</h1>

      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>🔑 Gemini APIキー</div>

        {isSet && (
          <div style={{ background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#86efac', marginBottom: '12px' }}>
            ✅ APIキー設定済み
          </div>
        )}

        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          style={{ marginBottom: '12px', fontFamily: 'monospace', fontSize: '14px' }}
        />

        <button
          className="btn-secondary"
          style={{ width: '100%', marginBottom: '16px', fontSize: '13px' }}
          onClick={handleDetect}
          disabled={detecting}
        >
          {detecting ? '検出中...' : '🔍 使えるモデルを自動検出'}
        </button>

        {detectError && (
          <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px' }}>❌ {detectError}</div>
        )}

        {availableModels.length > 0 && (
          <div style={{ background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#86efac', marginBottom: '12px' }}>
            ✅ {availableModels.length}件のモデルが使用可能です
          </div>
        )}

        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>🤖 使用モデル</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', maxHeight: '240px', overflowY: 'auto' }}>
          {displayModels.map(m => (
            <label key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px',
              background: model === m.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: model === m.id ? '1px solid var(--border-accent)' : '1px solid var(--border)',
              cursor: 'pointer',
            }}>
              <input type="radio" name="model" value={m.id} checked={model === m.id} onChange={() => setModel(m.id)} style={{ accentColor: 'var(--accent)' }} />
              <span style={{ fontSize: '12px', color: model === m.id ? 'var(--accent)' : 'var(--text-secondary)', wordBreak: 'break-all' }}>
                {m.name}
              </span>
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
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>ℹ️ アプリについて</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          🏯 <strong style={{ color: 'var(--text-primary)' }}>Daily Asset Tracker</strong><br />
          毎日の日報からキャリア資産を抽出・可視化するツール。<br />
          データはブラウザ内（IndexedDB）に保存。
        </div>
      </div>
    </div>
  );
}
