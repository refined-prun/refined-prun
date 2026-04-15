import { fixed01 } from '@src/utils/format';

// Formats a number of days for display. Infinity → "∞", otherwise fixed01.
export function formatDays(days: number): string {
  if (!isFinite(days) || days >= 1000) {
    return '∞';
  }
  return fixed01(days);
}

// CSS-class name based on a fill ratio. Reuses PrUn's workforce color palette.
export function fillRatioClass(ratio: number): string {
  if (ratio >= 0.95) {
    return C.Workforces.daysMissing;
  }
  if (ratio >= 0.8) {
    return C.Workforces.daysWarning;
  }
  return C.Workforces.daysSupplied;
}
