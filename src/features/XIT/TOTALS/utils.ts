import { fixed0, fixed01, fixed2 } from '@src/utils/format';

// Underscores are the XIT parameter separator, so a preset name must not contain one.
export function isValidPresetName(name: string) {
  return /^[ 0-9a-zA-Z.-]*$/.test(name);
}

export function toParamName(name: string) {
  return name.split(' ').join('_');
}

export function formatAmount(amount: number) {
  return amount >= 100 ? fixed0(amount) : fixed01(amount);
}

// Each exchange trades in its own currency, so the cell carries the code.
export function formatValue(value: number | undefined, currency: string) {
  return value === undefined ? '--' : `${fixed0(value)} ${currency}`;
}

export function formatWeight(weight: number) {
  return `${fixed2(weight)}t`;
}

export function formatVolume(volume: number) {
  return `${fixed2(volume)}m³`;
}
