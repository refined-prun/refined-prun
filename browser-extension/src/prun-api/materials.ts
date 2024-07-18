import materialNames from './material-names.json';

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
let onLoaded = () => {};

const materialsById: Map<string, Material> = new Map();
const materialsByTicker: Map<string, Material> = new Map();
const materialsByName: Map<string, Material> = new Map();
const categoriesById: Map<string, MaterialCategory> = new Map();

function getDisplayName(material: Material) {
  return materialNames[material.ticker] ?? material.name;
}

function load(payload: PrUnApi.WORLD_MATERIAL_CATEGORIES.Payload) {
  if (loaded) {
    return;
  }
  for (const apiCategory of payload.categories) {
    const category: MaterialCategory = {
      id: apiCategory.id,
      name: apiCategory.name,
      materials: [],
    };
    categoriesById.set(category.id, category);
    for (const apiMaterial of apiCategory.materials) {
      const material: Material = {
        name: apiMaterial.name,
        id: apiMaterial.id,
        ticker: apiMaterial.ticker,
        category: category,
        get displayName() {
          return getDisplayName(this);
        },
        weight: apiMaterial.weight,
        volume: apiMaterial.volume,
        resource: apiMaterial.resource,
      };
      category.materials.push(material);
      materialsById.set(material.id, material);
      materialsByTicker.set(material.ticker, material);
      materialsByName.set(material.displayName, material);
    }
  }
  loaded = true;
  setTimeout(onLoaded, 0);
}

async function waitForLoaded() {
  if (loaded) {
    return;
  }

  await new Promise<void>(resolve => (onLoaded = resolve));
}

const materials = {
  load,
  waitForLoaded,
  get: (ticker?: string | null) => (ticker ? materialsByTicker.get(ticker) : undefined),
  getByName: (name?: string | null) => (name ? materialsByName.get(name) : undefined),
  getTickerByName: (name?: string | null) => (name ? materialsByName.get(name)?.ticker : undefined),
};

export default materials;
