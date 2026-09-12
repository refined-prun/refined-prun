import { MaterialEntry, ParseResult } from './types';
import { emptySpec, parseJsonMaterials } from './shared';

// PRUNPlanner Supply Cart

interface SupplyCartJson {
  groups?: Array<{ materials?: unknown }>;
}

export function parseSupplyCart(json: string): ParseResult {
  if (json.trim() === '') {
    return { spec: emptySpec() };
  }

  let data: SupplyCartJson;
  try {
    data = JSON.parse(json);
  } catch {
    return { error: 'Invalid JSON.', spec: emptySpec() };
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { error: 'Expected a JSON object.', spec: emptySpec() };
  }

  const groups = Array.isArray(data.groups) ? data.groups : [];
  if (groups.length === 0) {
    return { error: 'No material groups found.', spec: emptySpec() };
  }

  const materials: MaterialEntry[] = [];
  for (const group of groups) {
    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
      return { error: 'Invalid material group.', spec: emptySpec() };
    }
    if (
      group.materials !== undefined &&
      (typeof group.materials !== 'object' ||
        group.materials === null ||
        Array.isArray(group.materials))
    ) {
      return { error: 'Invalid materials.', spec: emptySpec() };
    }
    const entries = parseJsonMaterials(group.materials);
    if (entries === undefined) {
      return { error: 'Invalid materials.', spec: emptySpec() };
    }
    materials.push(...entries);
  }

  return { groupCount: groups.length, spec: { materials } };
}
