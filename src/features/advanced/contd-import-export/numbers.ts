import Cookies from 'js-cookie';

const dotDecimal = /^[+-]?(?:(?:\d+|\d{1,3}(?:[,\s]\d{3})+)(?:\.\d+)?|\.\d+)$/;
const commaDecimal = /^[+-]?(?:(?:\d+|\d{1,3}(?:[.\s]\d{3})+)(?:,\d+)?|,\d+)$/;

function parseDecimal(text: string, comma: boolean): number | undefined {
  if (!(comma ? commaDecimal : dotDecimal).test(text)) {
    return undefined;
  }
  const normalized = comma
    ? text.replace(/[.\s]/g, '').replace(',', '.')
    : text.replace(/[,\s]/g, '');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

// Spreadsheet separators are independent of the game and browser locales.
export function parseSpreadsheetNumber(text: string): { value: number } | { error: string } {
  text = text.trim();
  const candidates = new Set([parseDecimal(text, false), parseDecimal(text, true)]);
  candidates.delete(undefined);
  if (candidates.size === 0) {
    return { error: `Invalid number "${text}".` };
  }
  if (candidates.size > 1) {
    return { error: `Ambiguous number "${text}". Remove grouping or add a decimal digit.` };
  }
  return { value: candidates.values().next().value! };
}

// Decimal form fields use the game locale, which defaults to English.
export function parseGameNumber(text: string, decimal: boolean): number | undefined {
  if (decimal) {
    // Verdammte Deutsche!
    return parseDecimal(text.trim(), Cookies.get('pu-locale') === 'de');
  }
  const value = text.trim() === '' ? NaN : Number(text);
  return Number.isFinite(value) ? value : undefined;
}

export function formatGamePrice(value: number): string {
  const text = String(value);
  // Verdammte Deutsche!
  return Cookies.get('pu-locale') === 'de' ? text.replace('.', ',') : text;
}

// Inventory counts use the full display locale, including community translations.
export function parseDisplayedInteger(text: string): number | undefined {
  const locale = Cookies.get('pu-locale')?.replace('_', '-') ?? 'en';
  const group = new Intl.NumberFormat(locale).formatToParts(1000000).find(x => x.type === 'group');
  const value = Number(group ? text.replaceAll(group.value, '') : text);
  return Number.isSafeInteger(value) && value > 0 ? value : undefined;
}
