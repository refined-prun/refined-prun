import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { isPresent } from 'ts-extras';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';
import { userDataStore } from '@src/infrastructure/prun-api/data/user-data';

const hour12 = computed(() => {
  switch (userData.settings.time) {
    case '24H':
      return false;
    case '12H':
      return true;
    case 'DEFAULT':
      return undefined;
  }
});

const locale = computed(() => {
  let preferredLocale = userDataStore.preferredLocale;
  if (!preferredLocale) {
    return undefined;
  }
  preferredLocale = preferredLocale.replace('_', '-');
  return navigator.language.startsWith(preferredLocale) ? navigator.language : preferredLocale;
});

function dateTimeFormat(options: Intl.DateTimeFormatOptions | (() => Intl.DateTimeFormatOptions)) {
  const format = computed(() => {
    return new Intl.DateTimeFormat(
      locale.value,
      typeof options === 'function' ? options() : options,
    );
  });
  return (date?: number | Date | undefined) => format.value.format(date);
}

function numberFormat(options: Intl.NumberFormatOptions | (() => Intl.NumberFormatOptions)) {
  const format = computed(() => {
    return new Intl.NumberFormat(locale.value, typeof options === 'function' ? options() : options);
  });
  return (value: number) => format.value.format(value);
}

export const hhForXitSet = computed(() => {
  return new Intl.DateTimeFormat(locale.value, { hour: '2-digit' }).format;
});

export const hhmm = dateTimeFormat(() => ({
  hour: '2-digit',
  minute: '2-digit',
  hour12: hour12.value,
}));

export const hhmmss = dateTimeFormat(() => ({
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: hour12.value,
}));

export const ddmm = dateTimeFormat({
  month: '2-digit',
  day: '2-digit',
});

export const ddmmyyyy = dateTimeFormat({
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

export const fixed0 = numberFormat({
  maximumFractionDigits: 0,
});

export const fixed02 = numberFormat({
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const fixed1 = numberFormat({
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const fixed01 = numberFormat({
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export const fixed2 = numberFormat({
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const percent0 = numberFormat({
  style: 'percent',
  maximumFractionDigits: 0,
});

export const percent1 = numberFormat({
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const percent2 = numberFormat({
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEta(from: number, to: number) {
  let ret = hhmm(to);
  const days = diffDays(from, to);
  if (days > 0) {
    ret += ` +${days}d`;
  }
  return ret;
}

export function displaytimeBetween(from: number, to: number) {
  const diffMs = to - from;
  if (diffMs <= 0) return '0m';

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

export function formatCurrency(currency?: number | null, format?: (value: number) => string) {
  if (!isPresent(currency)) {
    return '--';
  }
  format ??= fixed0;
  const settings = userData.settings.currency;
  const symbol = getCurrencySymbol(settings);
  const spacing = settings.preset === 'DEFAULT' ? 'HAS_SPACE' : settings.spacing;
  const position = settings.preset === 'DEFAULT' ? 'AFTER' : settings.position;
  if (position === 'AFTER') {
    return spacing === 'HAS_SPACE' ? format(currency) + ' ' + symbol : format(currency) + symbol;
  }
  const sign = currency < 0 ? '-' : '';
  return spacing === 'HAS_SPACE'
    ? sign + symbol + ' ' + format(Math.abs(currency))
    : sign + symbol + format(Math.abs(currency));
}

function getCurrencySymbol(settings: typeof userData.settings.currency) {
  switch (settings.preset) {
    case 'DEFAULT':
      return balancesStore.ownCurrency.value;
    case 'AIC':
      return '₳';
    case 'ICA':
      return 'ǂ';
    case 'CIS':
      return '₡';
    case 'NCC':
      return '₦';
    case 'CUSTOM':
      return settings.custom;
  }
}
