declare namespace PrunApi {
  export interface Currency {
    numericCode: number;
    code: string;
    name: string;
    decimals: number;
  }

  export interface ExchangeEntity {
    id: string;
    name: string;
    code: string;
  }

  export interface PrunPacket<T, K> {
    messageType: T;
    payload: K;
  }

  export type Packet =
    | ACCOUNTING_CASH_BALANCES.Packet
    | ACTION_COMPLETED.Packet
    | COMPANY_DATA.Packet
    | PRODUCTION_SITE_PRODUCTION_LINES.Packet
    | SITE_SITES.Packet
    | STORAGE_CHANGE.Packet
    | STORAGE_STORAGES.Packet
    | SYSTEM_STARS_DATA.Packet
    | USER_DATA.Packet
    | WAREHOUSE_STORAGES.Packet
    | WORKFORCE_WORKFORCES.Packet;

  declare namespace ACTION_COMPLETED {
    export type Packet = PrunPacket<'ACTION_COMPLETED', Payload>;

    export interface Payload {
      actionId: string;
      status: number;
      message: PrunApi.Packet | null;
    }
  }

  declare namespace USER_DATA {
    export type Packet = PrunPacket<'USER_DATA', Payload>;

    export interface Payload {
      id: string;
      username: string;
      subscriptionLevel: string;
      subscriptionExpiry: DateTime;
      highestTier: null;
      team: boolean;
      moderator: boolean;
      pioneer: boolean;
      perks: unknown[];
      created: DateTime;
      companyId: string;
      systemNamingRights: number;
      planetNamingRights: number;
      isPayingUser: boolean;
      isModeratorChat: boolean;
      mutedUsers: unknown[];
      blacklistedUsers: unknown[];
      isMuted: boolean;
      discardedNotifications: unknown[];
      contexts: Context[];
      preferredLocale: string;
    }

    export interface Context {
      id: string;
      type: string;
      creation: DateTime;
      actionRoles: string[];
    }
  }

  declare namespace ACCOUNTING_CASH_BALANCES {
    export type Packet = PrunPacket<'ACCOUNTING_CASH_BALANCES', Payload>;

    export interface Payload {
      ownCurrency: Currency;
      currencyAccounts: CurrencyAccount[];
    }

    export interface CurrencyAccount {
      category: string;
      type: number;
      number: number;
      bookBalance: CurrencyAmount;
      currencyBalance: CurrencyAmount;
    }
  }

  declare namespace COMPANY_DATA {
    export type Packet = PrunPacket<'COMPANY_DATA', Payload>;

    export interface Payload {
      id: string;
      name: string;
      code: string;
      countryId: string;
      startingProfile: string;
      startingLocation: Address;
      ratingReport: RatingReport;
      headquarters: Headquarters;
      representation: Representation;
    }

    export interface Headquarters {
      address: Address;
      level: number;
      basePermits: number;
      usedBasePermits: number;
      inventory: Inventory;
      additionalBasePermits: number;
      additionalProductionQueueSlots: number;
      nextRelocationTime: null;
      relocationLocked: boolean;
      efficiencyGains: EfficiencyGain[];
      efficiencyGainsNextLevel: EfficiencyGain[];
    }

    export interface EfficiencyGain {
      category: string;
      gain: number;
    }

    export interface Inventory {
      items: Item[];
    }

    export interface Item {
      material: Material;
      amount: number;
      limit: number;
    }

    export interface RatingReport {
      overallRating: string;
      contractCount: number;
      earliestContract: EarliestContract;
    }

    export interface EarliestContract {
      timestamp: number | null;
    }

    export interface Representation {
      currentLevel: number;
      costNextLevel: RepresentationLevel;
      contributedNextLevel: RepresentationLevel;
      leftNextLevel: RepresentationLevel;
      contributedTotal: RepresentationLevel;
      contributors: unknown[];
    }

    export interface RepresentationLevel {
      amount: number;
      currency: string;
    }
  }

  declare namespace PRODUCTION_SITE_PRODUCTION_LINES {
    export type Packet = PrunPacket<'PRODUCTION_SITE_PRODUCTION_LINES', Payload>;

    export interface Payload {
      siteId: string;
      productionLines: ProductionLine[];
    }

    export interface ProductionLine {
      id: string;
      siteId: string;
      address: Address;
      type: string;
      capacity: number;
      slots: number;
      efficiency: number;
      condition: number;
      workforces: Workforce[];
      orders: Order[];
      productionTemplates: ProductionTemplate[];
      efficiencyFactors: EfficiencyFactor[];
    }

    export interface EfficiencyFactor {
      expertiseCategory?: string;
      type: string;
      effectivity: number;
      value: number;
    }

    export interface Order {
      id: string;
      productionLineId: string;
      inputs: MaterialAmountWithValue[];
      outputs: MaterialAmountWithValue[];
      created: DateTime;
      started: DateTime | null;
      completion: DateTime | null;
      duration: TimeSpan;
      lastUpdated: DateTime | null;
      completed: number;
      halted: boolean;
      productionFee: CurrencyAmount;
      productionFeeCollector: ProductionFeeCollector;
      recurring: boolean;
    }

    export interface ProductionFeeCollector {
      currency: Currency;
    }

    export interface ProductionTemplate {
      id: string;
      name: string;
      inputFactors: ProductionFactor[];
      outputFactors: ProductionFactor[];
      effortFactor: number;
      efficiency: number;
      duration: TimeSpan;
      productionFeeFactor: CurrencyAmount;
      productionFeeCollector: ProductionFeeCollector;
    }

    export interface ProductionFactor {
      material: Material;
      factor: number;
    }

    export interface Workforce {
      level: string;
      efficiency: number;
    }
  }

  declare namespace SITE_SITES {
    export type Packet = PrunPacket<'SITE_SITES', Payload>;

    export interface Payload {
      sites: Site[];
    }

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
      options: Option[];
    }

    export interface Option {
      id: string;
      name: string;
      area: number;
      ticker: string;
      expertiseCategory: ExpertiseCategory | null;
      needsFertileSoil: boolean;
      type: OptionType;
      workforceCapacities: WorkforceCapacity[];
      materials: Materials;
    }

    export enum ExpertiseCategory {
      Agriculture = 'AGRICULTURE',
      Chemistry = 'CHEMISTRY',
      Construction = 'CONSTRUCTION',
      Electronics = 'ELECTRONICS',
      FoodIndustries = 'FOOD_INDUSTRIES',
      FuelRefining = 'FUEL_REFINING',
      Manufacturing = 'MANUFACTURING',
      Metallurgy = 'METALLURGY',
      ResourceExtraction = 'RESOURCE_EXTRACTION',
    }

    export interface Materials {
      quantities: MaterialAmount[];
    }

    export enum OptionType {
      Core = 'CORE',
      Habitation = 'HABITATION',
      Production = 'PRODUCTION',
      Resources = 'RESOURCES',
      Storage = 'STORAGE',
    }

    export interface WorkforceCapacity {
      level: Level;
      capacity: number;
    }

    export enum Level {
      Engineer = 'ENGINEER',
      Pioneer = 'PIONEER',
      Scientist = 'SCIENTIST',
      Settler = 'SETTLER',
      Technician = 'TECHNICIAN',
    }

    export interface Platform {
      siteId: string;
      id: string;
      module: Module;
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

    export interface Module {
      id: string;
      platformId: string;
      reactorId: string;
      reactorName: string;
      reactorTicker: string;
      type: OptionType;
    }
  }

  declare namespace STORAGE_CHANGE {
    export type Packet = PrunPacket<'STORAGE_CHANGE', Payload>;

    export interface Payload {
      stores: Store[];
    }
  }

  declare namespace STORAGE_STORAGES {
    export type Packet = PrunPacket<'STORAGE_STORAGES', Payload>;

    export interface Payload {
      stores: Store[];
    }
  }

  declare namespace SYSTEM_STARS_DATA {
    export type Packet = PrunPacket<'SYSTEM_STARS_DATA', Payload>;

    export interface Payload {
      stars: Star[];
    }

    export interface Star {
      systemId: string;
      address: Address;
      name: string;
      type: StarType;
      position: Position;
      sectorId: string;
      subSectorId: string;
      connections: string[];
    }

    export interface Position {
      x: number;
      y: number;
      z: number;
    }

    export type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
  }

  declare namespace WAREHOUSE_STORAGES {
    export type Packet = PrunPacket<'WAREHOUSE_STORAGES', Payload>;

    export interface Payload {
      storages: Storage[];
    }

    export interface Storage {
      warehouseId: string;
      storeId: string;
      units: number;
      weightCapacity: number;
      volumeCapacity: number;
      nextPayment: DateTime;
      fee: CurrencyAmount;
      feeCollector: FeeCollector;
      status: string;
      address: Address;
    }

    export interface FeeCollector {
      currency?: Currency;
      id?: string;
      code?: string;
      name?: string;
    }
  }

  declare namespace WORKFORCE_WORKFORCES {
    export type Packet = PrunPacket<'WORKFORCE_WORKFORCES', Payload>;

    export interface Payload {
      address: Address;
      siteId: string;
      workforces: Workforce[];
    }

    export interface Workforce {
      level: string;
      population: number;
      reserve: number;
      capacity: number;
      required: number;
      satisfaction: number;
      needs: Need[];
    }

    export interface Need {
      category: NeedCategory;
      essential: boolean;
      material: Material;
      satisfaction: number;
      unitsPerInterval: number;
      unitsPer100: number;
    }

    export enum NeedCategory {
      Clothing = 'CLOTHING',
      Food = 'FOOD',
      Health = 'HEALTH',
      Tools = 'TOOLS',
      Water = 'WATER',
    }
  }
}
