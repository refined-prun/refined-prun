import { timestampEachSecond } from '@src/utils/dayjs';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';
import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import {
  calcAcidTestRatio,
  calcLiquidationValue,
  calcDebtRatio,
  calcEquity,
  calcQuickAssets,
  calcQuickLiabilities,
  calcTotalAssets,
  calcTotalCurrentAssets,
  calcTotalCurrentLiabilities,
  calcTotalLiabilities,
  calcTotalNonCurrentAssets,
  calcTotalNonCurrentLiabilities,
  calcTotalIntangibleAssets,
} from '@src/core/balance/balance-sheet-summary';

export const liveBalanceSheet = createLiveBalanceSheet();

function createLiveBalanceSheet(): PartialBalanceSheet {
  return unwrapRefProperties({
    timestamp: timestampEachSecond,

    assets: {
      current: unwrapRefProperties({
        cashAndCashEquivalents: unwrapRefProperties({
          cash: currentAssets.cashTotal,
          deposits: unwrapRefProperties({
            cx: currentAssets.cxDepositsTotal,
            fx: currentAssets.fxDepositsTotal,
          }),
          mmMaterials: currentAssets.inventory.mmMaterialsTotal,
        }),
        accountsReceivable: currentAssets.accountsReceivable,
        loansReceivable: unwrapRefProperties({
          principal: currentAssets.shortTermLoans,
          interest: currentAssets.interestReceivable,
        }),
        inventory: unwrapRefProperties({
          cxListedMaterials: currentAssets.inventory.cxListedMaterials,
          cxInventory: currentAssets.inventory.cxInventoryTotal,
          materialsInTransit: currentAssets.inventory.materialsInTransit,
          baseInventory: unwrapRefProperties({
            finishedGoods: currentAssets.inventory.finishedGoods,
            workInProgress: currentAssets.inventory.workInProgress,
            rawMaterials: currentAssets.inventory.rawMaterials,
            workforceConsumables: currentAssets.inventory.workforceConsumables,
            otherItems: currentAssets.inventory.otherItems,
          }),
          fuelTanks: currentAssets.inventory.fuelTanks,
          materialsReceivable: currentAssets.inventory.materialsReceivable,
        }),
      }),
      nonCurrent: unwrapRefProperties({
        buildings: unwrapRefProperties({
          marketValue: unwrapRefProperties({
            infrastructure: nonCurrentAssets.buildings.infrastructure,
            resourceExtraction: nonCurrentAssets.buildings.resourceExtraction,
            production: nonCurrentAssets.buildings.production,
          }),
          accumulatedDepreciation: nonCurrentAssets.buildings.accumulatedDepreciation,
        }),
        ships: unwrapRefProperties({
          marketValue: nonCurrentAssets.shipsMarketValue,
          accumulatedDepreciation: nonCurrentAssets.shipsDepreciation,
        }),
        longTermReceivables: unwrapRefProperties({
          accountsReceivable: nonCurrentAssets.accountsReceivable,
          materialsInTransit: nonCurrentAssets.materialsInTransit,
          materialsReceivable: nonCurrentAssets.materialsReceivable,
          loansPrincipal: nonCurrentAssets.longTermLoans,
        }),
        intangibleAssets: unwrapRefProperties({
          hqUpgrades: nonCurrentAssets.hqUpgrades,
          arc: nonCurrentAssets.arc,
        }),
      }),
    },
    liabilities: {
      current: unwrapRefProperties({
        accountsPayable: currentLiabilities.accountsPayable,
        materialsPayable: currentLiabilities.materialsPayable,
        loansPayable: unwrapRefProperties({
          principal: currentLiabilities.shortTermDebt,
          interest: currentLiabilities.interestPayable,
        }),
      }),
      nonCurrent: unwrapRefProperties({
        longTermPayables: unwrapRefProperties({
          accountsPayable: nonCurrentLiabilities.accountsPayable,
          materialsPayable: nonCurrentLiabilities.materialsPayable,
          loansPrincipal: nonCurrentLiabilities.longTermDebt,
        }),
      }),
    },
  });
}

type RefProperties<T> = { [P in keyof T]: Ref<T[P]> | T[P] };

function unwrapRefProperties<T>(obj: RefProperties<T>): T {
  const result = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const property = obj[key];
      if (isRef(property)) {
        Object.defineProperty(result, key, {
          get: () => property.value,
          enumerable: true,
          configurable: true,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = property as any;
      }
    }
  }

  return result;
}

export const liveBalanceSummary = unwrapBalanceSheetExtras({
  currentAssets: calcTotalCurrentAssets,
  nonCurrentAssets: calcTotalNonCurrentAssets,
  assets: calcTotalAssets,
  currentLiabilities: calcTotalCurrentLiabilities,
  nonCurrentLiabilities: calcTotalNonCurrentLiabilities,
  liabilities: calcTotalLiabilities,
  intangibleAssets: calcTotalIntangibleAssets,
  equity: calcEquity,
  liquidationValue: calcLiquidationValue,
  quickAssets: calcQuickAssets,
  quickLiabilities: calcQuickLiabilities,
  acidTestRatio: calcAcidTestRatio,
  debtRatio: calcDebtRatio,
});

type BalanceSheetExtras<T> = { [P in keyof T]: (sheet: PartialBalanceSheet) => T[P] };

function unwrapBalanceSheetExtras<T>(obj: BalanceSheetExtras<T>): T {
  const result = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const extra = obj[key];
      const ref = computed(() => extra(liveBalanceSheet));
      Object.defineProperty(result, key, {
        get: () => ref.value,
        enumerable: true,
        configurable: true,
      });
    }
  }

  return result;
}
