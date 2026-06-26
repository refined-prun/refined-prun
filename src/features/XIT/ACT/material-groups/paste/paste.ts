import { act } from '@src/features/XIT/ACT/act-registry';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

// Maximum significant figures the game accepts for a CX order price.
// e.g. 43810 is rounded by the game to 43800. We reject finer prices so what
// the user pastes matches the order that actually gets placed.
const MAX_PRICE_SIGNIFICANT_FIGURES = 3;

export type Delimiter = '\t' | ';' | ',';

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
  // The delimiter detected for the whole paste, if one could be determined.
  delimiter?: Delimiter;
  // Set when the paste mixes delimiter families and was rejected wholesale.
  fatal?: string;
}

const DELIMITER_NAMES: Record<Delimiter, string> = {
  '\t': 'tab-separated (TSV)',
  ';': 'semicolon-separated',
  ',': 'comma-separated (CSV)',
};

// Detect which single delimiter the whole paste uses. We support exactly one
// per paste and never mix them. Tab wins (spreadsheet copies are TSV), then
// semicolon (European CSV), then comma (RFC 4180 CSV).
//
// Commas are ignored for detection when they sit inside double quotes, so a
// quoted decimal like "35,4" in an otherwise comma-separated file doesn't
// trigger a false "mixed delimiters" rejection.
function detectDelimiter(input: string): { delimiter: Delimiter } | { error: string } {
  const hasTab = input.includes('\t');
  const hasSemicolon = input.includes(';');
  const hasUnquotedComma = hasCharOutsideQuotes(input, ',');

  const present: Delimiter[] = [];
  if (hasTab) {
    present.push('\t');
  }
  if (hasSemicolon) {
    present.push(';');
  }

  if (present.length > 1) {
    const names = present.map(d => DELIMITER_NAMES[d]).join(' and ');
    return { error: `Paste mixes ${names}. Use one delimiter for the whole paste.` };
  }

  // A structural delimiter is present along with another delimiter family.
  if (present.length === 1) {
    return { delimiter: present[0] };
  }

  if (hasUnquotedComma) {
    return { delimiter: ',' };
  }

  // No delimiter at all (e.g. a single "TICKER QTY" can't be split). Default to
  // comma so the per-line column check produces a useful error.
  return { delimiter: ',' };
}

function hasCharOutsideQuotes(input: string, target: string): boolean {
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === target && !inQuotes) {
      return true;
    }
  }
  return false;
}

// Split one record into fields on the given delimiter, honoring RFC 4180
// double-quoting (quoted fields may contain the delimiter; "" is an escaped
// quote). Returns an error if quotes are malformed.
function splitRecord(line: string, delimiter: Delimiter): { fields: string[] } | { error: string } {
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
      if (field.trim().length > 0) {
        return { error: 'quote may only open at the start of a field' };
      }
      inQuotes = true;
    } else if (char === delimiter) {
      fields.push(field);
      field = '';
    } else {
      field += char;
    }
  }
  if (inQuotes) {
    return { error: 'unterminated quote' };
  }
  fields.push(field);
  return { fields: fields.map(x => x.trim()) };
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

// Normalize a single numeric field into a plain JS number string.
//
// Because the field is already delimited (tab/semicolon/quoted), its commas
// and periods are part of the value, not column breaks. We resolve them:
//   - A lone "," or "." followed by 1-3 digits at the end is a DECIMAL mark
//     ("35,4" -> "35.4", "35.4" -> "35.4").
//   - Any other separators are grouping and are stripped ("1,234.5" -> "1234.5",
//     "1.234,5" -> "1234.5").
function normalizeNumber(raw: string): string {
  const cleaned = raw.replace(/[^\d.,+-]/g, '');
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  const lastSep = Math.max(lastComma, lastDot);

  if (lastSep === -1) {
    return cleaned;
  }

  const trailing = cleaned.length - lastSep - 1;
  const sepChar = cleaned[lastSep];
  // Treat the last separator as a decimal mark only when it has 1-3 trailing
  // digits AND it's the only separator of its kind beyond grouping.
  const decimalLike = trailing >= 1 && trailing <= 3;

  // Strip every separator except the chosen decimal one.
  let result = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === ',' || char === '.') {
      if (i === lastSep && decimalLike && char === sepChar) {
        result += '.';
      }
      // Else: grouping separator, drop it.
    } else {
      result += char;
    }
  }
  return result;
}

// Parse a quantity field: a positive integer. Grouping separators are stripped;
// a value that resolves to a non-integer is rejected (catches "1,5" meaning 1.5
// pasted into a quantity column).
function parseQuantity(raw: string): { amount: number } | { error: string } {
  if (raw.trim().length === 0) {
    return { error: 'missing quantity' };
  }
  const amount = Number(normalizeNumber(raw));
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

// Parse a price field: positive, at most 3 significant figures (the game rounds
// finer prices, so we reject them and suggest the rounded value).
function parsePrice(raw: string): { price: number } | { error: string } {
  if (raw.trim().length === 0) {
    return { error: 'missing price' };
  }
  const price = Number(normalizeNumber(raw));
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
  if (!input || input.trim().length === 0) {
    return result;
  }

  const detected = detectDelimiter(input);
  if ('error' in detected) {
    result.fatal = detected.error;
    return result;
  }
  const delimiter = detected.delimiter;
  result.delimiter = delimiter;

  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim().length === 0) {
      continue;
    }
    const line = i + 1;

    const split = splitRecord(raw, delimiter);
    if ('error' in split) {
      result.errors.push({ line, raw, reason: split.error });
      continue;
    }
    const fields = split.fields;

    if (fields.length < 2 || fields.length > 3) {
      result.errors.push({
        line,
        raw,
        reason: `expected TICKER, QUANTITY[, PRICE] (got ${fields.length} ${DELIMITER_NAMES[delimiter]} field${fields.length === 1 ? '' : 's'})`,
      });
      continue;
    }

    const [tickerRaw, quantityRaw, priceRaw] = fields;

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

    if (priceRaw !== undefined && priceRaw.trim().length > 0) {
      const price = parsePrice(priceRaw);
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
  const { rows, errors, fatal } = parsePaste(input);
  if (fatal || errors.length > 0 || rows.length === 0) {
    return undefined;
  }
  const materials: Record<string, number> = {};
  for (const row of rows) {
    materials[row.ticker] = (materials[row.ticker] ?? 0) + row.amount;
  }
  return materials;
}

// Aggregate parsed rows into a per-ticker price map. Last price for a ticker
// wins. Returns {} when no prices are present or the paste is invalid.
export function parsePrices(input: string | undefined): Record<string, number> {
  const { rows, errors, fatal } = parsePaste(input);
  if (fatal || errors.length > 0) {
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
    setPrices?.(parsePrices(config.materials));
    return materials;
  },
});
