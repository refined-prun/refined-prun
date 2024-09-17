export interface BalanceSheet {
  timestamp: number;

  currentAssets: {
    cash: number;
    deposits: number;
    interestReceivable: number;
    accountsReceivable: number;
    shortTermLoans: number;
    marketListedMaterials: number;
    inventory: number;
    ordersInProgress: number;
    materialsToReceive: number;
    total?: number;
  };

  nonCurrentAssets: {
    buildings: number;
    accountsReceivable: number;
    longTermLoans: number;
    materialsToReceive: number;
    total?: number;
  };

  totalAssets?: number;

  currentLiabilities: {
    accountsPayable: number;
    materialsToDeliver: number;
    shortTermDebt: number;
    interestPayable: number;
    total?: number;
  };

  nonCurrentLiabilities: {
    accountsPayable: number;
    materialsToDeliver: number;
    longTermDebt: number;
    total?: number;
  };

  totalLiabilities?: number;

  equity?: number;

  lockedAssets: {
    ships: number;
    hqUpgrades: number;
    arc: number;
    total?: number;
  };

  companyValue?: number;
}

export type PartialBalanceSheet = DeepPartial<BalanceSheet> & { timestamp: number };
