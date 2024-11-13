import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

const correctableCommands = new Set(['CXM', 'CXOB', 'CXP', 'CXPC', 'CXPO', 'MAT']);

export function correctMaterialCommand(parts: string[]) {
  if (!correctableCommands.has(parts[0].toUpperCase())) {
    return;
  }

  const material = materialsStore.getByTicker(parts[1]);
  if (material && parts[1] !== material.ticker) {
    parts[1] = material.ticker;
  }
}
