import { useState, useEffect, useCallback } from 'react';
import { getAllReports, saveReport, deleteReport } from '../lib/db';
import type { DailyReport } from '../lib/types';

export function useReports() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await getAllReports();
    setReports(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (report: DailyReport) => {
    await saveReport(report);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await deleteReport(id);
    await refresh();
  }, [refresh]);

  return { reports, loading, save, remove, refresh };
}
