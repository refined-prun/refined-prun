declare namespace PrunApi {
  export interface Experts {
    active: number;
    address: Address;
    experts: ExpertField[];
    siteId: string;
    total: number;
    totalActiveCap: number;
  }

  export interface ExpertField {
    category: ExpertCategory;
    entry: ExpertFieldEntry;
  }

  export interface ExpertFieldEntry {
    available: number;
    category: ExpertCategory;
    current: number;
    efficiencyGain: number;
    limit: number;
    progress: number;
  }

  export type ExpertCategory =
    | 'AGRICULTURE'
    | 'CHEMISTRY'
    | 'CONSTRUCTION'
    | 'ELECTRONICS'
    | 'FOOD_INDUSTRIES'
    | 'FUEL_REFINING'
    | 'MANUFACTURING'
    | 'METALLURGY'
    | 'RESOURCE_EXTRACTION';
}
