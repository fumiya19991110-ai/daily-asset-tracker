import { useState, useCallback } from 'react';
import { analyzeReport, generateSummary } from '../lib/claude';
import type { GeminiAnalysisResult, SummaryData } from '../lib/types';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (text: string): Promise<GeminiAnalysisResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeReport(text);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析中にエラーが発生しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const summarize = useCallback(
    async (period: string, tagSummary: string, dailySummaries: string): Promise<SummaryData | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateSummary(period, tagSummary, dailySummaries);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : '総括生成中にエラーが発生しました');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, analyze, summarize };
}
