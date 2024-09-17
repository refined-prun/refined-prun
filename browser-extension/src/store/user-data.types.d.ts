declare namespace UserData {
  type PricingMethod = 'ASK' | 'BID' | 'AVG' | 'VWAP7D' | 'VWAP30D' | string;

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
}