declare module PrUnApi {
  declare module WORLD_MATERIAL_CATEGORIES {
    export interface Payload {
      categories: MaterialCategory[];
    }

    interface MaterialCategory {
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
  }
}
