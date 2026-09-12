import { parseSpreadsheetNumber } from '../numbers';
import { ContractDraftSpec, ParseResult } from './types';
import { emptySpec, parsePositiveNumber, parseTemplateType, specHasContractFields } from './shared';

// Tab-separated material rows use amount, ticker, and price.
// Contract fields use keyword/value rows; unrecognized rows are skipped.

type KeywordHandler = (spec: ContractDraftSpec, value: string) => boolean;

const keywordHandlers = new Map<string, KeywordHandler>([
  ['template', applyTemplateType],
  ['type', applyTemplateType],
  [
    'currency',
    (spec, value) => {
      spec.currency = value.trim().toUpperCase();
      return spec.currency !== '';
    },
  ],
  ['location', (spec, value) => applyText(value, v => (spec.location = v))],
  ['origin', (spec, value) => applyText(value, v => (spec.origin = v))],
  ['destination', (spec, value) => applyText(value, v => (spec.destination = v))],
  ['payment', applyPayment],
  ['price', applyPayment],
  [
    'deadline',
    (spec, value) => {
      spec.deadline = parsePositiveNumber(value);
      return spec.deadline !== undefined;
    },
  ],
  ['autoprovision', applyAutoProvision],
  ['auto-provision', applyAutoProvision],
]);

// Toggle words become the portable boolean form; any other non-empty value
// stays a string and matches a specific store by text or value.
const autoProvisionWords: Record<string, boolean> = {
  yes: true,
  true: true,
  on: true,
  no: false,
  false: false,
  off: false,
};

function applyAutoProvision(spec: ContractDraftSpec, value: string): boolean {
  return applyText(value, v => (spec.autoProvision = autoProvisionWords[v.toLowerCase()] ?? v));
}

function applyTemplateType(spec: ContractDraftSpec, value: string): boolean {
  spec.type = parseTemplateType(value);
  return spec.type !== undefined;
}

function applyPayment(spec: ContractDraftSpec, value: string): boolean {
  spec.payment = parsePositiveNumber(value);
  return spec.payment !== undefined;
}

function applyText(value: string, set: (value: string) => void): boolean {
  const trimmed = value.trim();
  if (trimmed === '') {
    return false;
  }
  set(trimmed);
  return true;
}

export function parseSheets(text: string): ParseResult {
  if (text.trim() === '') {
    return { spec: emptySpec() };
  }

  const spec = emptySpec();
  let skipped = 0;
  for (const line of text.split('\n')) {
    if (line.trim() === '') {
      continue;
    }

    const [firstCol, secondCol, thirdCol] = line.split('\t');

    const keyword = firstCol.trim().toLowerCase();
    const handler = keywordHandlers.get(keyword);
    if (handler) {
      let value = secondCol ?? '';
      if (keyword === 'payment' || keyword === 'price' || keyword === 'deadline') {
        const parsed = parseSpreadsheetNumber(value);
        if ('error' in parsed) {
          return { error: `${keyword}: ${parsed.error}`, spec: emptySpec() };
        }
        value = String(parsed.value);
      }
      if (!handler(spec, value)) {
        skipped++;
      }
      continue;
    }

    const ticker = secondCol?.trim().toUpperCase();
    if (!ticker || !/^[+\-\d.,]/.test(firstCol.trim())) {
      skipped++;
      continue;
    }
    const parsedAmount = parseSpreadsheetNumber(firstCol);
    if ('error' in parsedAmount) {
      return { error: `${ticker} amount: ${parsedAmount.error}`, spec: emptySpec() };
    }
    const amount = parsedAmount.value;

    const priceText = thirdCol?.trim();
    let price: number | undefined;
    if (priceText) {
      const parsedPrice = parseSpreadsheetNumber(priceText);
      if ('error' in parsedPrice) {
        return { error: `${ticker} price: ${parsedPrice.error}`, spec: emptySpec() };
      }
      if (parsedPrice.value <= 0) {
        return { error: `Invalid ${ticker} price.`, spec: emptySpec() };
      }
      price = parsedPrice.value;
    }

    spec.materials.push({ ticker, amount, price });
  }

  if (spec.materials.length === 0 && !specHasContractFields(spec)) {
    return { error: 'No material or keyword rows found.', spec: emptySpec() };
  }

  return { spec, skipped };
}
