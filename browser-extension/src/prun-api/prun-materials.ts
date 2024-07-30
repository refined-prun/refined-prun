import { loadFallbackPacket } from '@src/prun-api/fallback-files';
import { loadLocalJson } from '@src/util';

import ApiPayload = PrunApi.WORLD_MATERIAL_CATEGORIES.Payload;

interface Material {
  name: string;
  id: string;
  ticker: string;
  category: MaterialCategory;
  displayName: string;
  weight: number;
  volume: number;
  resource: boolean;
}

interface MaterialCategory {
  name: string;
  id: string;
  materials: Material[];
}

let loaded = false;

const materialsById: Map<string, Material> = new Map();
const materialsByTicker: Map<string, Material> = new Map();
const materialsByName: Map<string, Material> = new Map();
const categoriesById: Map<string, MaterialCategory> = new Map();

let materialNames: { [ticker: string]: string };

function getDisplayName(material: Material) {
  return materialNames[material.ticker] ?? material.name;
}

function applyApiPayload(payload: ApiPayload) {
  materialsById.clear();
  materialsByTicker.clear();
  materialsByName.clear();
  categoriesById.clear();

  for (const apiCategory of payload.categories) {
    const category: MaterialCategory = {
      id: apiCategory.id,
      name: apiCategory.name,
      materials: [],
    };
    categoriesById.set(category.id.toLowerCase(), category);
    for (const apiMaterial of apiCategory.materials) {
      const material: Material = {
        name: apiMaterial.name,
        id: apiMaterial.id,
        ticker: apiMaterial.ticker,
        category,
        get displayName() {
          return getDisplayName(this);
        },
        weight: apiMaterial.weight,
        volume: apiMaterial.volume,
        resource: apiMaterial.resource,
      };
      category.materials.push(material);
      materialsById.set(material.id.toLowerCase(), material);
      materialsByTicker.set(material.ticker.toLowerCase(), material);
      materialsByName.set(material.displayName.toLowerCase(), material);
    }
  }

  loaded = true;
}

async function load() {
  materialNames = await loadLocalJson('material-names.json');

  if (loaded) {
    return;
  }

  const fallbackPacket = await loadFallbackPacket<ApiPayload>('WORLD_MATERIAL_CATEGORIES');
  if (loaded) {
    return;
  }

  applyApiPayload(fallbackPacket);
}

function get(ticker?: string | null) {
  if (!ticker) {
    return undefined;
  }
  // Extract ticker from H2O.AI1
  const dotIndex = ticker.indexOf('.');
  if (dotIndex >= 0) {
    ticker = ticker.substring(0, dotIndex);
  }
  return materialsByTicker.get(ticker.toLowerCase());
}

const prunMaterials = {
  applyApiPayload,
  load,
  get,
  getTickerByName: (name?: string | null) => (name ? materialsByName.get(name.toLowerCase())?.ticker : undefined),
};

export default prunMaterials;
