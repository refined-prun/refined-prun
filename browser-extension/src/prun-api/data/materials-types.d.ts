declare namespace PrunApi {
  export interface Material {
    name: string;
    id: string;
    ticker: string;
    category: string;
    weight: number;
    volume: number;
    resource: boolean;
  }

  export interface MaterialAmount {
    material: Material;
    amount: number;
  }

  export interface MaterialAmountWithValue {
    value: CurrencyAmount;
    material: Material;
    amount: number;
  }

  export interface MaterialCategory {
    name: string;
    id: string;
    materials: Material[];
  }
}
