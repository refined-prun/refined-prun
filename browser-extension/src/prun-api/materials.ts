interface ApiResponse {
  categories: Category[];
}

interface Category {
  name: string;
  id: string;
  materials: Material[];
}

interface Material {
  name: string;
  id: string;
  ticker: string;
  category: string;
  weight: number;
  volume: number;
  resource: boolean;
}

let loaded = false;
let onLoaded = () => {};

const materialsById: Map<string, Material> = new Map();
const materialsByTicker: Map<string, Material> = new Map();
const categoriesById: Map<string, Category> = new Map();

function load(apiResponse: ApiResponse) {
  if (loaded) {
    return;
  }
  for (const category of apiResponse.categories) {
    categoriesById.set(category.id, category);
    for (const material of category.materials) {
      materialsById.set(material.id, material);
      materialsByTicker.set(material.ticker, material);
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
  get: (ticker: string) => materialsByTicker.get(ticker),
};

export default materials;
