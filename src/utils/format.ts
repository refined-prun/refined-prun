import { diffDays } from '@src/utils/time-diff';
import { userData } from '@src/store/user-data';
import { isPresent } from 'ts-extras';
import { balancesStore } from '@src/infrastructure/prun-api/data/balances';

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

const hhmmRef = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: hour12.value,
  }).format;
});

export const hhmm = (date?: number | Date | undefined) => hhmmRef.value(date);

const hhmmssRef = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: hour12.value,
  }).format;
});

export const hhmmss = (date?: number | Date | undefined) => hhmmssRef.value(date);

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

export const fixed02 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format;

export const fixed1 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format;

export const fixed01 = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
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
