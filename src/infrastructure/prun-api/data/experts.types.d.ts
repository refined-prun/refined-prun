declare namespace PrunApi {
  export interface Experts {
    active: ExpertsTotalAllowed;
    address: Address;
    experts: ExpertField[];
    siteId: string;
    total: ExpertsTotalAllowed;
    totalActiveCap: 6;
  }

  export interface ExpertField {
    category: ExpertCategory;
    entry: ExpertFieldEntry;
  }

  export interface ExpertFieldEntry {
    available: ExpertsFieldAllowed;
    category: ExpertCategory;
    current: ExpertsFieldAllowed;
    efficiencyGain: number;
    limit: 5;
    progress: number;
  }

  export type ExpertsFieldAllowed = 0 | 1 | 2 | 3 | 4 | 5;
  export type ExpertsTotalAllowed = ExpertsFieldAllowed | 6;

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
