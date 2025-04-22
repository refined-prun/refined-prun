declare namespace PrunApi {
  interface Material {
    name: string;
    id: string;
    ticker: string;
    category: string;
    weight: number;
    volume: number;
    resource: boolean;
  }

  interface MaterialAmount {
    material: Material;
    amount: number;
  }

  interface MaterialQuantities {
    quantities: MaterialAmount[];
  }

  interface MaterialAmountLimit {
    material: Material;
    amount: number;
    limit: number;
  }

  interface ProjectInventory {
    items: MaterialAmountLimit[];
  }

  interface MaterialAmountValue {
    value: CurrencyAmount;
    material: Material;
    amount: number;
  }

  interface MaterialCategory {
    name: string;
    id: string;
    materials: Material[];
  }
}
