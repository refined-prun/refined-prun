declare namespace PrunApi {
  interface Workforce {
    level: string;
    population: number;
    reserve: number;
    capacity: number;
    required: number;
    satisfaction: number;
    needs: Need[];
  }

  interface Need {
    category: NeedCategory;
    essential: boolean;
    material: Material;
    satisfaction: number;
    unitsPerInterval: number;
    unitsPer100: number;
  }

  type NeedCategory = 'CLOTHING' | 'FOOD' | 'HEALTH' | 'TOOLS' | 'WATER';
}
