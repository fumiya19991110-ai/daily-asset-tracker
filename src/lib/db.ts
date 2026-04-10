import Dexie, { type Table } from 'dexie';
import type { DailyReport, PeriodSummary } from './types';

class AssetTrackerDB extends Dexie {
  reports!: Table<DailyReport>;
  summaries!: Table<PeriodSummary>;

  constructor() {
    super('AssetTrackerDB');
    this.version(1).stores({
      reports: 'id, date, assetScore, createdAt',
      summaries: 'id, type, createdAt',
    });
  }
}

export const db = new AssetTrackerDB();

// Reports
export async function saveReport(report: DailyReport): Promise<void> {
  await db.reports.put(report);
}

export async function getReport(id: string): Promise<DailyReport | undefined> {
  return db.reports.get(id);
}

export async function getAllReports(): Promise<DailyReport[]> {
  return db.reports.orderBy('id').reverse().toArray();
}

export async function deleteReport(id: string): Promise<void> {
  await db.reports.delete(id);
}

// Summaries
export async function saveSummary(summary: PeriodSummary): Promise<void> {
  await db.summaries.put(summary);
}

export async function getSummary(id: string): Promise<PeriodSummary | undefined> {
  return db.summaries.get(id);
}

// Export / Import
export async function exportData(): Promise<string> {
  const reports = await getAllReports();
  const summaries = await db.summaries.toArray();
  return JSON.stringify({ reports, summaries }, null, 2);
}

export async function importData(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.reports) {
    for (const r of data.reports) {
      r.date = new Date(r.date);
      r.createdAt = new Date(r.createdAt);
      await db.reports.put(r);
    }
  }
  if (data.summaries) {
    for (const s of data.summaries) {
      s.createdAt = new Date(s.createdAt);
      await db.summaries.put(s);
    }
  }
}
