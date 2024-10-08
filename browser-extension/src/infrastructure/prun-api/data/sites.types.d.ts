declare namespace PrunApi {
  export interface Site {
    siteId: string;
    address: Address;
    founded: DateTime;
    platforms: Platform[];
    buildOptions: BuildOptions;
    area: number;
    investedPermits: number;
    maximumPermits: number;
  }

  export interface BuildOptions {
    options: BuildOption[];
  }

  export interface BuildOption {
    id: string;
    name: string;
    area: number;
    ticker: string;
    expertiseCategory: ExpertiseCategory | null;
    needsFertileSoil: boolean;
    type: PlatformModuleType;
    workforceCapacities: WorkforceCapacity[];
    materials: MaterialQuantities;
  }

  export declare type ExpertiseCategory =
    | 'AGRICULTURE'
    | 'CHEMISTRY'
    | 'CONSTRUCTION'
    | 'ELECTRONICS'
    | 'FOOD_INDUSTRIES'
    | 'FUEL_REFINING'
    | 'MANUFACTURING'
    | 'METALLURGY'
    | 'RESOURCE_EXTRACTION';

  export declare type PlatformModuleType =
    | 'CORE'
    | 'HABITATION'
    | 'PRODUCTION'
    | 'RESOURCES'
    | 'STORAGE';

  export interface WorkforceCapacity {
    level: WorkforceLevel;
    capacity: number;
  }
  export declare type WorkforceLevel =
    | 'ENGINEER'
    | 'PIONEER'
    | 'SCIENTIST'
    | 'SETTLER'
    | 'TECHNICIAN';

  export interface Platform {
    siteId: string;
    id: string;
    module: PlatformModule;
    area: number;
    creationTime: DateTime;
    reclaimableMaterials: MaterialAmount[];
    repairMaterials: MaterialAmount[];
    repairMaterials24: MaterialAmount[];
    repairMaterials48: MaterialAmount[];
    bookValue: CurrencyAmount;
    condition: number;
    lastRepair: DateTime | null;
  }

  export interface PlatformModule {
    id: string;
    platformId: string;
    reactorId: string;
    reactorName: string;
    reactorTicker: string;
    type: PlatformModuleType;
  }
}
