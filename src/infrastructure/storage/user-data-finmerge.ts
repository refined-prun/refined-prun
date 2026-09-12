import dayjs from 'dayjs';
import { fileType } from '@src/infrastructure/storage/user-data-serializer';
import { userData } from '@src/store/user-data';

type RootData = typeof userData;

export interface BackupFile {
  type: string;
  data: RootData;
}

export interface MergeReport {
  base: 'A' | 'B';
  baseLatest: number;
  otherLatest: number;
  v1DaysAdded: number;
  v2DaysAdded: number;
  v1Mismatch?: [baseLength: number, otherLength: number];
  v2Mismatch?: [baseLength: number, otherLength: number];
}

export interface MergeResult {
  result: BackupFile;
  report: MergeReport;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBackup(json: any): json is BackupFile {
  return (
    json?.type === fileType &&
    Array.isArray(json.data?.balanceHistory?.v1) &&
    Array.isArray(json.data?.balanceHistory?.v2)
  );
}

export function mergeUserDataBackups(a: BackupFile, b: BackupFile): MergeResult {
  const latestA = latestTimestamp(a.data.balanceHistory);
  const latestB = latestTimestamp(b.data.balanceHistory);
  const aIsBase = latestA >= latestB;
  const base = aIsBase ? a.data : b.data;
  const other = aIsBase ? b.data : a.data;

  const merged = structuredClone(base);
  const v1 = mergeVersion(merged.balanceHistory.v1, other.balanceHistory.v1);
  const v2 = mergeVersion(merged.balanceHistory.v2, other.balanceHistory.v2);
  merged.balanceHistory.v1 = v1.merged;
  merged.balanceHistory.v2 = v2.merged;

  return {
    result: { type: fileType, data: merged },
    report: {
      base: aIsBase ? 'A' : 'B',
      baseLatest: aIsBase ? latestA : latestB,
      otherLatest: aIsBase ? latestB : latestA,
      v1DaysAdded: v1.daysAdded,
      v2DaysAdded: v2.daysAdded,
      v1Mismatch: v1.mismatch,
      v2Mismatch: v2.mismatch,
    },
  };
}

function latestTimestamp(history: UserData.BalanceHistory): number {
  const timestamps = [...history.v1, ...history.v2].map(x => x[0]);
  return timestamps.length > 0 ? Math.max(...timestamps) : 0;
}

// Each array element is [timestamp, ...values]; tuple length must match across
// backups or merging would misalign values recorded under a different data version.
function mergeVersion<T extends number[]>(
  base: T[],
  other: T[],
): { merged: T[]; daysAdded: number; mismatch?: [number, number] } {
  if (base.length > 0 && other.length > 0 && base[0].length !== other[0].length) {
    return { merged: base, daysAdded: 0, mismatch: [base[0].length, other[0].length] };
  }

  const baseDays = new Set(base.map(x => dayKey(x[0])));
  const missing = other.filter(x => !baseDays.has(dayKey(x[0])));
  // The game records at most one entry per day and downstream code (lastBalance/
  // previousBalance) assumes ascending order, so the merged array must stay sorted.
  const merged = [...base, ...missing].sort((x, y) => x[0] - y[0]);

  return { merged, daysAdded: missing.length };
}

function dayKey(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD');
}
