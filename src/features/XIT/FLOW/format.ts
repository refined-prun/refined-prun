import { fixed0, fixed01, fixed02, formatCurrency } from '@src/utils/format';

export function formatPrice(value: number) {
  const abs = Math.abs(value);
  let format = fixed02;
  if (abs >= 100) {
    format = fixed0;
  } else if (abs >= 10) {
    format = fixed01;
  }
  return formatCurrency(value, format);
}
