import { ContractDraftSpec, MaterialEntry, ParseResult, TemplateType } from './types';

export function emptySpec(): ContractDraftSpec {
  return { materials: [] };
}

export function specHasContractFields(spec: ContractDraftSpec): boolean {
  return (
    spec.type !== undefined ||
    spec.currency !== undefined ||
    spec.deadline !== undefined ||
    spec.location !== undefined ||
    spec.origin !== undefined ||
    spec.destination !== undefined ||
    spec.payment !== undefined ||
    spec.autoProvision !== undefined
  );
}

const templateTypeMap: Record<string, TemplateType> = {
  BUY: 'BUY',
  BUYING: 'BUY',
  SELL: 'SELL',
  SELLING: 'SELL',
  SHIP: 'SHIP',
  SHIPPING: 'SHIP',
};

export function parseTemplateType(value: string): TemplateType | undefined {
  return templateTypeMap[value.trim().toUpperCase()];
}

export function parsePositiveNumber(value: string): number | undefined {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function describeSpecFields(spec: ContractDraftSpec): string[] {
  const fields: string[] = [];
  if (spec.type !== undefined) {
    fields.push(spec.type);
  }
  if (spec.currency !== undefined) {
    fields.push(spec.currency);
  }
  if (spec.location !== undefined) {
    fields.push('location');
  }
  if (spec.origin !== undefined) {
    fields.push('origin');
  }
  if (spec.destination !== undefined) {
    fields.push('destination');
  }
  if (spec.payment !== undefined) {
    fields.push('payment');
  }
  if (spec.autoProvision !== undefined) {
    fields.push('auto-provision');
  }
  if (spec.deadline !== undefined) {
    fields.push('deadline');
  }
  return fields;
}

export function summarize(result: ParseResult): string {
  if (result.error) {
    return result.error;
  }
  const { spec, skipped, groupCount } = result;
  const count = spec.materials.length;
  const parts: string[] = [];
  if (groupCount !== undefined) {
    parts.push(`${groupCount} group${groupCount === 1 ? '' : 's'}`);
  }
  parts.push(`${count} material${count === 1 ? '' : 's'}`);
  const fields = describeSpecFields(spec);
  if (fields.length > 0) {
    parts.push(fields.join(', '));
  }
  const skippedText =
    skipped !== undefined && skipped > 0
      ? ` (${skipped} row${skipped === 1 ? '' : 's'} skipped)`
      : '';
  return `Parsed ${parts.join(' + ')}${skippedText}.`;
}

export function parseJsonMaterials(value: unknown): MaterialEntry[] | undefined {
  if (value === undefined) {
    return [];
  }
  // Both shapes are accepted: [{ticker, amount, price?}] and {TICKER: amount}.
  if (Array.isArray(value)) {
    const materials: MaterialEntry[] = [];
    for (const entry of value) {
      const ticker = typeof entry?.ticker === 'string' ? entry.ticker.trim().toUpperCase() : '';
      const amount = Number(entry?.amount);
      if (!ticker || !Number.isFinite(amount)) {
        return undefined;
      }
      const price = entry.price === undefined ? undefined : parseJsonPrice(entry.price);
      if (entry.price !== undefined && price === undefined) {
        return undefined;
      }
      materials.push({ ticker, amount, price });
    }
    return materials;
  }
  if (typeof value === 'object' && value !== null) {
    const materials: MaterialEntry[] = [];
    for (const [ticker, amount] of Object.entries(value)) {
      if (!Number.isFinite(Number(amount))) {
        return undefined;
      }
      materials.push({ ticker: ticker.trim().toUpperCase(), amount: Number(amount) });
    }
    return materials;
  }
  return undefined;
}

function parseJsonPrice(value: unknown): number | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return undefined;
  }
  return parsePositiveNumber(String(value));
}
