declare namespace PrunApi {
  interface Site {
    siteId: string;
    address: Address;
    founded: DateTime;
    platforms: Platform[];
    buildOptions: BuildOptions;
    area: number;
    investedPermits: number;
    maximumPermits: number;
  }

  interface BuildOptions {
    options: BuildOption[];
  }

  interface BuildOption {
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

  type ExpertiseCategory =
    | 'AGRICULTURE'
    | 'CHEMISTRY'
    | 'CONSTRUCTION'
    | 'ELECTRONICS'
    | 'FOOD_INDUSTRIES'
    | 'FUEL_REFINING'
    | 'MANUFACTURING'
    | 'METALLURGY'
    | 'RESOURCE_EXTRACTION';

  type PlatformModuleType = 'CORE' | 'HABITATION' | 'PRODUCTION' | 'RESOURCES' | 'STORAGE';

  interface WorkforceCapacity {
    level: WorkforceLevel;
    capacity: number;
  }

  type WorkforceLevel = 'ENGINEER' | 'PIONEER' | 'SCIENTIST' | 'SETTLER' | 'TECHNICIAN';

  interface Platform {
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

  interface PlatformModule {
    id: string;
    platformId: string;
    reactorId: string;
    reactorName: string;
    reactorTicker: string;
    type: PlatformModuleType;
  }
}
