import type { GeminiAnalysisResult, SummaryData } from './types';
import { ANALYSIS_PROMPT, SUMMARY_PROMPT_TEMPLATE } from './prompts';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent';

function getApiKey(): string {
  return localStorage.getItem('gemini_api_key') || '';
}

function parseJson<T>(text: string): T {
  // Remove ```json fences if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('APIキーが設定されていません。設定画面から入力してください。');

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || res.statusText;
    throw new Error(`Gemini APIエラー: ${msg}`);
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('APIからのレスポンスが空です。');
  return text;
}

export async function analyzeReport(reportText: string): Promise<GeminiAnalysisResult> {
  const text = await callGemini(ANALYSIS_PROMPT + reportText);
  return parseJson<GeminiAnalysisResult>(text);
}

export async function generateSummary(
  period: string,
  tagSummary: string,
  dailySummaries: string
): Promise<SummaryData> {
  const prompt = SUMMARY_PROMPT_TEMPLATE(period, tagSummary, dailySummaries);
  const text = await callGemini(prompt);
  return parseJson<SummaryData>(text);
}
