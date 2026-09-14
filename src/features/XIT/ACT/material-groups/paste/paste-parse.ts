import Papa from 'papaparse';
import { MaterialBill } from '@src/features/XIT/ACT/material-bill';

// Pure Paste parser; inject ticker lookup to test without stores or components.

export type Delimiter = '\t' | ';' | ',';

export const delimiterNames: Record<Delimiter, string> = {
  '\t': 'tab-separated',
  ';': 'semicolon-separated',
  ',': 'comma-separated',
};

// Reject prices exceeding CXPO's significant-figure limit to prevent rounding.
export const maxPriceSignificantFigures = 3;

export interface ParsedRow {
  ticker: string;
  amount: number;
  price?: number;
}

export interface ParseError {
  line: number;
  reason: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
  delimiter?: Delimiter;
  // Set when the paste cannot be read at all. Suppresses per-line errors.
  fatal?: string;
}

// Resolves a pasted ticker to its canonical form, or undefined if unknown.
export type ResolveTicker = (ticker: string) => string | undefined;

function parseRecord(raw: string, delimiterHint?: Delimiter) {
  const delimiters = new Set<Delimiter>([delimiterHint ?? ',', ',', '\t', ';']);
  let fallback: { delimiter: Delimiter; result: Papa.ParseResult<string[]> };
  for (const delimiter of delimiters) {
    // Keep numeric text intact so validation can reject ambiguity and fractions.
    const result = Papa.parse<string[]>(raw, { delimiter, dynamicTyping: false });
    const candidate = { delimiter, result };
    // A ticker cannot contain another field separator.
    const fields = result.data[0];
    if (fields.length > 1 && !/[,;\t]/.test(fields[0])) {
      return candidate;
    }
    if (delimiter === ',') {
      fallback = candidate;
    }
  }
  // Comma is always tried when no delimiter matches.
  return fallback!;
}

// Each decimal convention permits the other separator in groups of three digits.
const dotDecimalPattern = /^\+?(?:(?:\d+|[1-9]\d{0,2}(?:,\d{3})+)(?:\.\d+)?|\.\d+)$/;
const commaDecimalPattern = /^\+?(?:(?:\d+|[1-9]\d{0,2}(?:\.\d{3})+)(?:,\d+)?|,\d+)$/;

function normalizeDecimal(value: string) {
  return value
    .replace(/^\+/, '')
    .replace(/^\./, '0.')
    .replace(/^0+(?=\d)/, '')
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

interface ParsedNumber {
  value: number;
  normalized: string;
}

// Deduplicate numeric readings; separator-free text is identical under both conventions.
function numberCandidates(raw: string) {
  const candidates = new Set<string>();
  if (dotDecimalPattern.test(raw)) {
    candidates.add(normalizeDecimal(raw.replaceAll(',', '')));
  }
  if (commaDecimalPattern.test(raw)) {
    candidates.add(normalizeDecimal(raw.replaceAll('.', '').replace(',', '.')));
  }
  return [...candidates];
}

function toParsedNumber(normalized: string, raw: string): ParsedNumber | { error: string } {
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0 || value > Number.MAX_SAFE_INTEGER) {
    return { error: `"${raw}" is not a finite positive number` };
  }
  return { value, normalized };
}

function parseQuantity(raw: string): { amount: number } | { error: string } {
  const candidates = numberCandidates(raw);
  if (candidates.length === 0) {
    return { error: `"${raw}" is not a supported number` };
  }
  if (candidates.length > 1) {
    return { error: `quantity "${raw}" has ambiguous separators; write it without grouping` };
  }
  const parsed = toParsedNumber(candidates[0], raw);
  if ('error' in parsed) {
    return parsed;
  }
  if (parsed.normalized.includes('.') || !Number.isSafeInteger(parsed.value)) {
    return { error: `quantity "${raw}" is not a whole number` };
  }
  return { amount: parsed.value };
}

function parsePrice(raw: string): { price: number } | { error: string } {
  const candidates = numberCandidates(raw);
  if (candidates.length === 0) {
    return { error: `"${raw}" is not a supported number` };
  }
  // A price can be fractional, so grouping cannot be told from a decimal here.
  if (candidates.length > 1) {
    return { error: `price "${raw}" has ambiguous separators; write it without grouping` };
  }
  const parsed = toParsedNumber(candidates[0], raw);
  if ('error' in parsed) {
    return parsed;
  }
  // CXPO_BUY writes the limit through fixed02. Do not accept one it would round.
  if ((parsed.normalized.split('.')[1]?.length ?? 0) > 2) {
    return { error: `price "${raw}" has more than two decimal places` };
  }
  const digits = parsed.normalized.replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
  if (digits.length > maxPriceSignificantFigures) {
    const suggestion = Number(parsed.value.toPrecision(maxPriceSignificantFigures));
    return {
      error: `price "${raw}" has more than ${maxPriceSignificantFigures} significant figures (use ${suggestion})`,
    };
  }
  return { price: parsed.value };
}

export function parsePaste(input: string | undefined, resolveTicker: ResolveTicker): ParseResult {
  const result: ParseResult = { rows: [], errors: [] };
  if (input === undefined || input.trim().length === 0) {
    return result;
  }

  const prices = new Map<string, { price: number; line: number }>();

  // Split on every line-ending combination - a paste can arrive with \r alone.
  const lines = input.split(/\r\n|\r|\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (raw.length === 0) {
      continue;
    }
    const line = i + 1;

    const { delimiter, result: parsed } = parseRecord(raw, result.delimiter);
    if (parsed.errors.length > 0) {
      result.errors.push({ line, reason: parsed.errors.map(x => x.message).join('; ') });
      continue;
    }
    const fields = parsed.data[0].map(x => x.trim());
    if (fields.length < 2 || fields.length > 3) {
      result.errors.push({
        line,
        reason: `expected TICKER, QUANTITY[, PRICE] (got ${fields.length} fields)`,
      });
      continue;
    }

    if (result.delimiter !== undefined && result.delimiter !== delimiter) {
      result.fatal = `Paste mixes ${delimiterNames[result.delimiter]} and ${delimiterNames[delimiter]} rows. Use one delimiter throughout.`;
      result.rows = [];
      result.errors = [];
      return result;
    }
    result.delimiter = delimiter;

    const [tickerRaw, quantityRaw, priceRaw] = fields;
    const ticker = resolveTicker(tickerRaw);
    if (ticker === undefined) {
      result.errors.push({ line, reason: `unknown ticker "${tickerRaw}"` });
      continue;
    }
    const quantity = parseQuantity(quantityRaw);
    if ('error' in quantity) {
      result.errors.push({ line, reason: quantity.error });
      continue;
    }

    const row: ParsedRow = { ticker, amount: quantity.amount };
    if (priceRaw !== undefined && priceRaw.length > 0) {
      const price = parsePrice(priceRaw);
      if ('error' in price) {
        result.errors.push({ line, reason: price.error });
        continue;
      }
      // One ticker cannot carry two limits: the second row would silently win.
      const previous = prices.get(ticker);
      if (previous !== undefined && previous.price !== price.price) {
        result.errors.push({
          line,
          reason: `conflicting price for ${ticker}; line ${previous.line} used ${previous.price}`,
        });
        continue;
      }
      if (previous === undefined) {
        prices.set(ticker, { price: price.price, line });
      }
      row.price = price.price;
    }
    result.rows.push(row);
  }
  return result;
}

// Build a bill only if all rows parsed, so partial pastes never reach the game.
export function parseMaterials(
  input: string | undefined,
  resolveTicker: ResolveTicker,
): MaterialBill | undefined {
  const { rows, errors, fatal } = parsePaste(input, resolveTicker);
  if (fatal !== undefined || errors.length > 0 || rows.length === 0) {
    return undefined;
  }
  const materials: MaterialBill = {};
  for (const row of rows) {
    const material = (materials[row.ticker] ??= { quantity: 0 });
    material.quantity += row.amount;
    if (!Number.isSafeInteger(material.quantity)) {
      return undefined;
    }
    if (row.price !== undefined) {
      material.price = row.price;
    }
  }
  return materials;
}
