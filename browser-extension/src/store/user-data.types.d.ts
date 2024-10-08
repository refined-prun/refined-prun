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

  export type BalanceHistory = {
    v1: UserData.BalanceSheetDataV1[];
    v2: UserData.BalanceSheetDataV2[];
    v3: UserData.BalanceSheetDataV3[];
  };

  type BalanceSheetDataV1 = [
    timestamp: number,
    fixed: number,
    current: number,
    liquid: number,
    liabilities: number,
  ];

  type BalanceSheetDataV2 = [
    timestamp: number,

    // Current Assets
    cash: number,
    deposits: number,
    interestReceivable: number,
    accountsReceivable: number,
    shortTermLoans: number,
    marketListedMaterials: number,
    inventory: number,
    ordersInProgress: number,
    materialsToReceive: number,

    // Non-Current Assets
    buildings: number,
    accountsReceivable: number,
    longTermLoans: number,
    materialsToReceive: number,

    // Current Liabilities
    accountsPayable: number,
    materialsToDeliver: number,
    shortTermDebt: number,
    interestPayable: number,

    // Non-Current Liabilities
    accountsPayable: number,
    materialsToDeliver: number,
    longTermDebt: number,

    // Locked Assets
    ships: number,
    hqUpgrades: number,
    arc: number,
  ];

  type BalanceSheetDataV3 = [
    timestamp: number,

    // Current Assets
    cash: number,
    cx: number,
    fx: number,
    accountsReceivable: number,
    loansPrincipal: number,
    loansInterest: number,
    cxListedMaterials: number,
    cxInventory: number,
    finishedGoods: number,
    workInProgress: number,
    rawMaterials: number,
    workforceConsumables: number,
    otherItems: number,
    fuelTanks: number,
    materialsInTransit: number,
    materialsReceivable: number,

    // Non-Current Assets
    infrastructure: number,
    resourceExtraction: number,
    production: number,
    accumulatedDepreciation: number,
    accountsReceivable: number,
    materialsInTransit: number,
    materialsReceivable: number,
    loansPrincipal: number,

    // Current Liabilities
    accountsPayable: number,
    materialsPayable: number,
    debtsPrincipal: number,
    debtsInterest: number,

    // Non-Current Liabilities
    accountsPayable: number,
    materialsPayable: number,
    debtsPrincipal: number,

    // Locked Assets
    shipsMarketValue: number,
    shipsDepreciation: number,
    hqUpgrades: number,
    arc: number,
  ];

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
