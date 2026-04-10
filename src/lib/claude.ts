import type { GeminiAnalysisResult, SummaryData } from './types';
import { ANALYSIS_PROMPT, SUMMARY_PROMPT_TEMPLATE } from './prompts';

export const CLAUDE_MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku（高速・安価）' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet（高精度）' },
];

export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

function getModel(): string {
  return localStorage.getItem('claude_model') || DEFAULT_MODEL;
}

export function getApiKey(): string {
  return localStorage.getItem('claude_api_key') || '';
}

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

async function callClaude(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('APIキーが設定されていません。設定画面から入力してください。');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || res.statusText;
    throw new Error(`Claude APIエラー: ${msg}`);
  }

  const data = await res.json() as {
    content?: { type: string; text: string }[];
  };
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('APIからのレスポンスが空です。');
  return text;
}

export async function analyzeReport(reportText: string): Promise<GeminiAnalysisResult> {
  const text = await callClaude(ANALYSIS_PROMPT + reportText);
  return parseJson<GeminiAnalysisResult>(text);
}

export async function generateSummary(
  period: string,
  tagSummary: string,
  dailySummaries: string
): Promise<SummaryData> {
  const prompt = SUMMARY_PROMPT_TEMPLATE(period, tagSummary, dailySummaries);
  const text = await callClaude(prompt);
  return parseJson<SummaryData>(text);
}
