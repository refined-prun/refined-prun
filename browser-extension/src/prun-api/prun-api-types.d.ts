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
    | ACTION_COMPLETED.Packet
    | SITE_SITES.Packet
    | SYSTEM_STARS_DATA.Packet
    | USER_DATA.Packet;

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
}
