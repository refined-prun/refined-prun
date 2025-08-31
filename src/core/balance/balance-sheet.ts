export interface BalanceSheet {
  timestamp: number;

  assets: {
    current: {
      cashAndCashEquivalents: {
        cash: number;
        deposits: {
          cx: number;
          fx: number;
          total: number;
        };
        mmMaterials: number;
        total: number;
      };
      accountsReceivable: number;
      loansReceivable: {
        principal: number;
        interest: number;
        total: number;
      };
      inventory: {
        cxListedMaterials: number;
        cxInventory: number;
        materialsInTransit: number;
        baseInventory: {
          finishedGoods: number;
          workInProgress: number;
          rawMaterials: number;
          workforceConsumables: number;
          otherItems: number;
          total: number;
        };
        fuelTanks: number;
        materialsReceivable: number;
        total: number;
      };
      total: number;
    };

    nonCurrent: {
      buildings: {
        marketValue: {
          infrastructure: number;
          resourceExtraction: number;
          production: number;
          total: number;
        };
        accumulatedDepreciation: number;
        total: number;
      };
      ships: {
        marketValue: number;
        accumulatedDepreciation: number;
        total: number;
      };
      longTermReceivables: {
        accountsReceivable: number;
        materialsInTransit: number;
        materialsReceivable: number;
        loansPrincipal: number;
        total: number;
      };
      intangibleAssets: {
        hqUpgrades: number;
        arc: number;
        total: number;
      };
      total: number;
    };

    total: number;
  };

  liabilities: {
    current: {
      accountsPayable: number;
      materialsPayable: number;
      loansPayable: {
        principal: number;
        interest: number;
        total: number;
      };
      total: number;
    };

    nonCurrent: {
      longTermPayables: {
        accountsPayable: number;
        materialsPayable: number;
        loansPrincipal: number;
        total: number;
      };
      total: number;
    };

    total: number;
  };

  equity: number;
}

export type PartialBalanceSheet = PartialDeep<BalanceSheet> & { timestamp: number };
