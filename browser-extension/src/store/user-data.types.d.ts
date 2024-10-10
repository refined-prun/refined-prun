declare namespace UserData {
  type PricingMethod = 'ASK' | 'BID' | 'AVG' | 'VWAP7D' | 'VWAP30D' | 'DEFAULT' | string;

  interface SortingMode {
    label: string;
    storeId: string;
    categories: SortingModeCategory[];
    burn: boolean;
    zero: boolean;
  }

  interface SortingModeCategory {
    name: string;
    materials: string[];
  }

  type TileState = Record<string, unknown>;

  interface Note {
    id: string;
    name: string;
    text: string;
  }

  type ActionPackages = Record<string, ActionPackage | undefined>;

  interface ActionPackage {
    id: string;
    global: {
      name: string;
    };
    groups: ActionPackageGroup[];
    actions: ActionPackageAction[];
  }

  interface ActionPackageGroup {
    type: 'Manual' | 'Resupply' | 'Repair';
    name?: string;
    days?: number | string;
    advanceDays?: number | string;
    planet?: string;
    useBaseInv?: boolean;
    materials?: Record<string, number>;
    exclusions?: string[];
    consumablesOnly?: boolean;
  }

  interface ActionPackageAction {
    type: 'CX Buy' | 'MTRA';

    name?: string;
    group?: string;

    buyPartial?: boolean;
    exchange?: string;
    useCXInv?: boolean;
    priceLimits?: Record<string, number>;

    origin?: string;
    dest?: string;
  }

  interface PmmgSettings {
    currency: string;
    burn: {
      red: number;
      yellow: number;
      resupply: number;
    };
    repair: {
      threshold: number;
      offset: number;
    };
    sidebar?: [string, string][];
    sorting?: UserData.SortingMode[];
  }
}
