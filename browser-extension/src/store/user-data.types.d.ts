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
