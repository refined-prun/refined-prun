import { fixed01 } from '@src/utils/format';

// Days ≥ 1000 collapse to "∞" so very-large values don't clutter the UI.
export function formatDays(days: number): string {
  if (!isFinite(days) || days >= 1000) {
    return '∞';
  }
  return fixed01(days);
}

// Above 100 days, exact count stops mattering — render as "100+".
export function formatDaysCompact(days: number): string {
  if (!isFinite(days) || days >= 1000) {
    return '∞';
  }
  if (days > 100) {
    return '100+';
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
