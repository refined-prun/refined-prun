import { act } from '@src/features/XIT/ACT/act-registry';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

// Maximum significant figures the game accepts for a CX order price.
// e.g. 43810 is truncated by the game to 43800. We reject finer prices so
// what the user pastes matches the order that actually gets placed.
const MAX_PRICE_SIGNIFICANT_FIGURES = 3;

export interface ParsedRow {
  ticker: string;
  amount: number;
  price?: number;
}

export interface ParseError {
  line: number;
  raw: string;
  reason: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
}

// Parse one RFC 4180 record into fields. Honors double-quoted fields with
// embedded delimiters and "" escapes. The delimiter is a comma for CSV;
// callers pass '\t' for spreadsheet (TSV) input.
function splitRecord(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
  }
  fields.push(field);
  return fields.map(x => x.trim());
}

// Number of significant figures in a finite positive number.
function significantFigures(value: number): number {
  // Normalize via exponential notation, strip the exponent, then count digits.
  const normalized = value
    .toExponential()
    .replace(/e[+-]?\d+$/i, '')
    .replace('.', '')
    .replace(/0+$/, '');
  return normalized.length === 0 ? 1 : normalized.length;
}

// Round a positive number to the game's significant-figure limit, for use in
// error messages that suggest a valid value.
function roundToSignificantFigures(value: number, figures: number): number {
  if (value === 0) {
    return 0;
  }
  const magnitude = Math.ceil(Math.log10(value));
  const power = figures - magnitude;
  const factor = Math.pow(10, power);
  return Math.round(value * factor) / factor;
}

// Parse a quantity field: a positive integer. Grouping commas inside an
// integer are unambiguous, so we strip them ("7,529" → 7529).
function parseQuantity(raw: string): { amount: number } | { error: string } {
  const cleaned = raw.replace(/,/g, '');
  if (cleaned.length === 0) {
    return { error: 'missing quantity' };
  }
  const amount = Number(cleaned);
  if (!Number.isFinite(amount)) {
    return { error: `quantity "${raw}" is not a number` };
  }
  if (amount <= 0) {
    return { error: `quantity "${raw}" must be positive` };
  }
  if (!Number.isInteger(amount)) {
    return { error: `quantity "${raw}" must be a whole number` };
  }
  return { amount };
}

// Parse a price field. Accepts a single positive number with an optional
// currency symbol/whitespace. Rejects prices finer than the game's
// significant-figure limit, and rejects values still ambiguous after the
// quantity column has been peeled off the left.
function parsePrice(raw: string): { price: number } | { error: string } {
  // Drop anything that isn't a digit, separator, or sign (e.g. "₳", "$").
  const cleaned = raw.replace(/[^\d.,+-]/g, '').trim();
  if (cleaned.length === 0) {
    return { error: 'missing price' };
  }

  // A lone comma with 1-2 trailing digits is a genuinely ambiguous European
  // decimal (e.g. "529,94" → 529.94 or two fields?). Refuse rather than guess.
  if (/^\d{1,3}(,\d{1,2})$/.test(cleaned) && !cleaned.includes('.')) {
    return {
      error: `price "${raw}" is ambiguous — use "." for decimals (e.g. ${cleaned.replace(',', '.')})`,
    };
  }

  // Otherwise treat commas as grouping separators.
  const price = Number(cleaned.replace(/,/g, ''));
  if (!Number.isFinite(price)) {
    return { error: `price "${raw}" is not a number` };
  }
  if (price <= 0) {
    return { error: `price "${raw}" must be positive` };
  }
  if (significantFigures(price) > MAX_PRICE_SIGNIFICANT_FIGURES) {
    const suggestion = roundToSignificantFigures(price, MAX_PRICE_SIGNIFICANT_FIGURES);
    return {
      error: `price "${raw}" has more than ${MAX_PRICE_SIGNIFICANT_FIGURES} significant figures (game rounds to ${suggestion})`,
    };
  }
  return { price };
}

export function parsePaste(input: string | undefined): ParseResult {
  const result: ParseResult = { rows: [], errors: [] };
  if (!input) {
    return result;
  }

  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().length === 0) {
      continue;
    }
    const line = i + 1;

    // Spreadsheet paste is tab-separated; fall back to comma-separated.
    const delimiter = raw.includes('\t') ? '\t' : ',';
    const fields = splitRecord(raw, delimiter);

    if (fields.length < 2) {
      result.errors.push({ line, raw, reason: 'expected TICKER, QUANTITY[, PRICE]' });
      continue;
    }

    // Left-anchored: ticker, quantity, then everything remaining is the price.
    // This keeps a grouping/decimal separator inside the price from being
    // mistaken for a field break.
    const [tickerRaw, quantityRaw, ...priceParts] = fields;

    const material = materialsStore.getByTicker(tickerRaw.toUpperCase());
    if (!material) {
      result.errors.push({ line, raw, reason: `unknown ticker "${tickerRaw}"` });
      continue;
    }

    const quantity = parseQuantity(quantityRaw);
    if ('error' in quantity) {
      result.errors.push({ line, raw, reason: quantity.error });
      continue;
    }

    const row: ParsedRow = { ticker: material.ticker, amount: quantity.amount };

    if (priceParts.length > 0 && priceParts.join('').trim().length > 0) {
      // Rejoin so a price split by the delimiter is validated as one value.
      const price = parsePrice(priceParts.join(delimiter));
      if ('error' in price) {
        result.errors.push({ line, raw, reason: price.error });
        continue;
      }
      row.price = price.price;
    }

    result.rows.push(row);
  }

  return result;
}

// Aggregate parsed rows into a quantity bill. Returns undefined when the input
// has no valid rows or any errors, so an invalid paste fails loudly.
export function parseMaterials(input: string | undefined): Record<string, number> | undefined {
  const { rows, errors } = parsePaste(input);
  if (errors.length > 0 || rows.length === 0) {
    return undefined;
  }
  const materials: Record<string, number> = {};
  for (const row of rows) {
    materials[row.ticker] = (materials[row.ticker] ?? 0) + row.amount;
  }
  return materials;
}

// Aggregate parsed rows into a per-ticker price map. Last price for a ticker
// wins. Returns {} when no prices are present.
export function parsePrices(input: string | undefined): Record<string, number> {
  const { rows, errors } = parsePaste(input);
  if (errors.length > 0) {
    return {};
  }
  const prices: Record<string, number> = {};
  for (const row of rows) {
    if (row.price !== undefined) {
      prices[row.ticker] = row.price;
    }
  }
  return prices;
}

act.addMaterialGroup<Config>({
  type: 'Paste',
  // TODO(#212): Restore once PR #213 (shortDescription) merges to main.
  // shortDescription: 'Paste materials from clipboard at execution time',
  description: () => 'Paste materials at execution time',
  configureComponent: Configure,
  needsConfigure: () => true,
  isValidConfig: (_data, config) => parseMaterials(config.materials) !== undefined,
  generateMaterialBill: async ({ config, log, setPrices }) => {
    const materials = parseMaterials(config.materials);
    if (!materials) {
      log.error('Invalid or missing pasted materials.');
      return undefined;
    }
    setPrices?.(parsePrices(config.materials), config.currency);
    return materials;
  },
});
