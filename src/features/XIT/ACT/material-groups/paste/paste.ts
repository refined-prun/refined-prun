import Papa from 'papaparse';
import { act } from '@src/features/XIT/ACT/act-registry';
import Configure from '@src/features/XIT/ACT/material-groups/paste/Configure.vue';
import { Config } from '@src/features/XIT/ACT/material-groups/paste/config';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { MaterialBill } from '@src/features/XIT/ACT/shared-types';

type Delimiter = '\t' | ';' | ',';

interface ParsedRow {
  ticker: string;
  amount: number;
  price?: number;
}

interface ParseError {
  line: number;
  raw: string;
  reason: string;
}

interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
  delimiter?: Delimiter;
  fatal?: string;
}

const DELIMITER_NAMES: Record<Delimiter, string> = {
  '\t': 'tab-separated (TSV)',
  ';': 'semicolon-separated',
  ',': 'comma-separated (CSV)',
};

interface ParsedRecord {
  delimiter: Delimiter;
  result: Papa.ParseResult<string[]>;
}

function parseRecord(raw: string, delimiterHint?: Delimiter) {
  const delimiters = new Set<Delimiter>([delimiterHint ?? ',', ',', '\t', ';']);
  const input = raw.replace(/^ +/, '');
  let fallback: ParsedRecord;
  for (const delimiter of delimiters) {
    // Keep `dynamicTyping: false` so application validation receives the original numeric text.
    const result = Papa.parse<string[]>(input, {
      delimiter,
      dynamicTyping: false,
      skipEmptyLines: false,
    });
    const candidate = { delimiter, result };
    // A ticker cannot contain another field separator; decimal commas do not select CSV.
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
const DOT_DECIMAL_PATTERN = /^\+?(?:(?:\d+|[1-9]\d{0,2}(?:,\d{3})+)(?:\.\d+)?|\.\d+)$/;
const COMMA_DECIMAL_PATTERN = /^\+?(?:(?:\d+|[1-9]\d{0,2}(?:\.\d{3})+)(?:,\d+)?|,\d+)$/;

function normalizeDecimal(value: string) {
  return value
    .replace(/^\+/, '')
    .replace(/^\./, '0.')
    .replace(/^0+(?=\d)/, '')
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

function parseNumber(raw: string): { value: number; normalized: string } | { error: string } {
  const candidates = new Set<string>();
  if (DOT_DECIMAL_PATTERN.test(raw)) {
    candidates.add(normalizeDecimal(raw.replaceAll(',', '')));
  }
  if (COMMA_DECIMAL_PATTERN.test(raw)) {
    candidates.add(normalizeDecimal(raw.replaceAll('.', '').replace(',', '.')));
  }
  if (candidates.size === 0) {
    return { error: `"${raw}" is not a supported number` };
  }
  if (candidates.size > 1) {
    return { error: `"${raw}" has ambiguous separators; use an ungrouped value` };
  }
  const [normalized] = candidates;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0 || value > Number.MAX_SAFE_INTEGER) {
    return { error: `"${raw}" is not a finite positive number` };
  }
  return { value, normalized };
}

function parseQuantity(raw: string): { amount: number } | { error: string } {
  const parsed = parseNumber(raw);
  if ('error' in parsed) {
    return parsed;
  }
  if (parsed.normalized.includes('.') || !Number.isSafeInteger(parsed.value)) {
    return { error: `quantity "${raw}" is not a whole number` };
  }
  return { amount: parsed.value };
}

function parsePrice(raw: string): { price: number } | { error: string } {
  const parsed = parseNumber(raw);
  if ('error' in parsed) {
    return parsed;
  }
  // CXPO_BUY writes prices through fixed02. Do not accept a limit it would round.
  if ((parsed.normalized.split('.')[1]?.length ?? 0) > 2) {
    return { error: `price "${raw}" must have at most two decimal places` };
  }
  // CXPO rounds prices to 3 significant figures. For example, 123456789 becomes 123000000.
  const MAX_PRICE_SIGNIFICANT_FIGURES = 3;
  const digits = parsed.normalized.replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
  if (digits.length > MAX_PRICE_SIGNIFICANT_FIGURES) {
    const suggestion = Number(parsed.value.toPrecision(MAX_PRICE_SIGNIFICANT_FIGURES));
    return {
      error: `price "${raw}" has more than ${MAX_PRICE_SIGNIFICANT_FIGURES} significant figures (use ${suggestion})`,
    };
  }
  return { price: parsed.value };
}

export function parsePaste(input: string | undefined) {
  const result: ParseResult = { rows: [], errors: [] };
  if (!input || input.trim().length === 0) {
    return result;
  }

  const prices = new Map<string, { price: number; line: number }>();

  // Papa Parse will interpret \r as a valid line separator and will return extra records, so we
  // should split by all combinations of \r\n, \r, and \n.
  const lines = input.split(/\r\n|\r|\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (raw.length === 0) {
      continue;
    }
    const line = i + 1;
    const { delimiter, result: parsed } = parseRecord(raw, result.delimiter);
    if (parsed.errors.length > 0) {
      result.errors.push({ line, raw, reason: parsed.errors[0].message });
      continue;
    }
    const fields = parsed.data[0].map(x => x.trim());
    if (fields.length < 2 || fields.length > 3) {
      result.errors.push({
        line,
        raw,
        reason: `expected TICKER, QUANTITY[, PRICE] (got ${fields.length} fields)`,
      });
      continue;
    }
    if (result.delimiter !== undefined && result.delimiter !== delimiter) {
      result.fatal = `Paste mixes ${DELIMITER_NAMES[result.delimiter]} and ${DELIMITER_NAMES[delimiter]}. Use one delimiter for the whole paste.`;
      result.rows = [];
      return result;
    }
    result.delimiter = delimiter;

    const [tickerRaw, quantityRaw, priceRaw] = fields;
    const material = materialsStore.getByTicker(tickerRaw);
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
    if (priceRaw !== undefined && priceRaw.length > 0) {
      const price = parsePrice(priceRaw);
      if ('error' in price) {
        result.errors.push({ line, raw, reason: price.error });
        continue;
      }
      const previous = prices.get(material.ticker);
      if (previous !== undefined && previous.price !== price.price) {
        result.errors.push({
          line,
          raw,
          reason: `conflicting price for ${material.ticker}; use the same price as line ${previous.line}`,
        });
        continue;
      }
      if (previous === undefined) {
        prices.set(material.ticker, { price: price.price, line });
      }
      row.price = price.price;
    }
    result.rows.push(row);
  }
  return result;
}

function parseMaterials(input: string | undefined) {
  const { rows, errors, fatal } = parsePaste(input);
  if (fatal || errors.length > 0 || rows.length === 0) {
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

act.addMaterialGroup<Config>({
  type: 'Paste',
  shortDescription: 'Paste materials from clipboard at execution time',
  description: () => 'Paste materials at execution time',
  configureComponent: Configure,
  needsConfigure: () => true,
  isValidConfig: (_data, config) => parseMaterials(config.materials) !== undefined,
  generateMaterialBill: async ({ config, log }) => {
    const parsed = parseMaterials(config.materials);
    if (!parsed) {
      log.error('Invalid or missing pasted materials.');
      return undefined;
    }
    return parsed;
  },
});
