import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

interface Entry {
  type: number;
  value: string;
}

export const PrunI18N: Record<string, Entry[] | undefined> = {};

const materialsByName = new Map<string, PrunApi.Material>();

export function loadPrunI18N() {
  Object.assign(PrunI18N, window['PrUn_i18n']);
  for (const material of materialsStore.all.value!) {
    const name = getMaterialName(material);
    if (name) {
      materialsByName.set(name, material);
    }
  }
}

export function getMaterialName(material?: PrunApi.Material | null) {
  return material ? PrunI18N[`Material.${material?.name}.name`]?.[0]?.value : undefined;
}

export function getMaterialByName(name?: string | null) {
  return name ? materialsByName.get(name) : undefined;
}
