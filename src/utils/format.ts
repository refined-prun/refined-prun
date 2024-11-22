import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { isPresent } from 'ts-extras';

export const hhmm = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
}).format;

export const hhmmss = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).format;

export const ddmm = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
}).format;

export const ddmmyyyy = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
}).format;

export const fixed0 = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
}).format;

export const fixed1 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format;

export const fixed2 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format;

export const percent0 = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 0,
}).format;

export const percent1 = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format;

export const percent2 = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format;

export function formatEta(from: number, to: number) {
  let ret = hhmm(to);
  const days = diffDays(from, to);
  if (days > 0) {
    ret += ` +${days}d`;
  }
  return ret;
}

export function formatCurrency(currency?: number | null, format?: (value: number) => string) {
  if (!isPresent(currency)) {
    return '--';
  }
  format ??= fixed0;
  const sign = currency < 0 ? '-' : '';
  return sign + userData.settings.currency + format(Math.abs(currency));
}
