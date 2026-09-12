import { ContractDraftSpec, ParseResult } from './types';
import {
  emptySpec,
  parseJsonMaterials,
  parsePositiveNumber,
  parseTemplateType,
  specHasContractFields,
} from './shared';

interface ContractJson {
  type?: unknown;
  currency?: unknown;
  deadline?: unknown;
  location?: unknown;
  origin?: unknown;
  destination?: unknown;
  payment?: unknown;
  autoProvision?: unknown;
  materials?: unknown;
}

export function parseContractJson(json: string): ParseResult {
  if (json.trim() === '') {
    return { spec: emptySpec() };
  }

  let data: ContractJson;
  try {
    data = JSON.parse(json);
  } catch {
    return { error: 'Invalid JSON.', spec: emptySpec() };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { error: 'Expected a JSON object.', spec: emptySpec() };
  }

  const materials = parseJsonMaterials(data.materials);
  if (materials === undefined) {
    return { error: 'Invalid materials.', spec: emptySpec() };
  }

  const spec: ContractDraftSpec = { materials };

  if (data.type !== undefined) {
    spec.type = typeof data.type === 'string' ? parseTemplateType(data.type) : undefined;
    if (spec.type === undefined) {
      return { error: 'Invalid type (expected BUY, SELL, or SHIP).', spec: emptySpec() };
    }
  }
  if (data.currency !== undefined) {
    if (typeof data.currency !== 'string' || data.currency.trim() === '') {
      return { error: 'Invalid currency.', spec: emptySpec() };
    }
    spec.currency = data.currency.trim().toUpperCase();
  }
  for (const key of ['location', 'origin', 'destination'] as const) {
    const value = data[key];
    if (value !== undefined) {
      if (typeof value !== 'string' || value.trim() === '') {
        return { error: `Invalid ${key}.`, spec: emptySpec() };
      }
      spec[key] = value.trim();
    }
  }
  if (data.autoProvision !== undefined) {
    if (typeof data.autoProvision === 'boolean') {
      spec.autoProvision = data.autoProvision;
    } else if (typeof data.autoProvision === 'string' && data.autoProvision.trim() !== '') {
      spec.autoProvision = data.autoProvision.trim();
    } else {
      return { error: 'Invalid autoProvision.', spec: emptySpec() };
    }
  }
  for (const key of ['payment', 'deadline'] as const) {
    const value = data[key];
    if (value !== undefined) {
      const parsed = parsePositiveNumber(String(value));
      if (parsed === undefined) {
        return { error: `Invalid ${key}.`, spec: emptySpec() };
      }
      spec[key] = parsed;
    }
  }

  if (spec.materials.length === 0 && !specHasContractFields(spec)) {
    return { error: 'Empty contract.', spec: emptySpec() };
  }

  return { spec };
}
