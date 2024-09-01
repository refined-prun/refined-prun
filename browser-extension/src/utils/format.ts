import { diffDays } from '@src/utils/time-diff';

export const hhmm = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
}).format;

export const hhmmss = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).format;

export const mmdd = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
}).format;

export const mmddyyyy = new Intl.DateTimeFormat(undefined, {
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
