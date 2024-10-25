import { watchUntil } from '@src/utils/watch';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';

interface Entry {
  type: number;
  value: string;
}

export const PrunI18N: Record<string, Entry[] | undefined> = {};

const materialsByName = new Map<string, PrunApi.Material>();

export async function readPrunI18N() {
  await new Promise<void>(resolve => {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.source !== window) {
        return;
      }
      if (event.data.type === 'rp-i18n') {
        if (event.data.data) {
          Object.assign(PrunI18N, event.data.data);
        }
        resolve();
      }
    });

    window.postMessage({ type: 'rp-get-i18n' }, '*');
  });

  await watchUntil(() => materialsStore.all.value !== undefined);
  buildMaterialNameMap(materialsStore.all.value!);
}

function buildMaterialNameMap(materials: PrunApi.Material[]) {
  for (const material of materials) {
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
