import { timestampEachSecond } from '@src/utils/dayjs';
import { computed, isRef, Ref } from 'vue';
import { currentAssets } from '@src/core/balance/current-assets';
import { nonCurrentAssets } from '@src/core/balance/non-current-assets';
import { currentLiabilities } from '@src/core/balance/current-liabilities';
import { nonCurrentLiabilities } from '@src/core/balance/non-current-liabilities';
import { lockedAssets } from '@src/core/balance/locked-assets';
import { BalanceSheet, PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import {
  calcAcidTestRatio,
  calcCompanyValue,
  calcDebtRatio,
  calcDebtToEquityRatio,
  calcEquity,
  calcQuickAssets,
  calcQuickLiabilities,
  calcTotalAssets,
  calcTotalCurrentAssets,
  calcTotalCurrentLiabilities,
  calcTotalLiabilities,
  calcTotalLockedAssets,
  calcTotalNonCurrentAssets,
  calcTotalNonCurrentLiabilities,
  calcWorkingCapitalRatio,
} from '@src/core/balance/balance-sheet-summary';

export const liveBalanceSheet = createLiveBalanceSheet();

function createLiveBalanceSheet(): BalanceSheet {
  return unwrapRefProperties({
    timestamp: timestampEachSecond(),

    currentAssets: unwrapRefProperties({
      cash: currentAssets.cashTotal,
      deposits: currentAssets.depositsTotal,
      interestReceivable: currentAssets.interestReceivable,
      accountsReceivable: currentAssets.accountsReceivable,
      shortTermLoans: currentAssets.shortTermLoans,
      marketListedMaterials: currentAssets.marketListedMaterials,
      inventory: currentAssets.inventory,
      ordersInProgress: currentAssets.totalOrderValue,
      materialsToReceive: currentAssets.materialsToReceive,
    }),

    nonCurrentAssets: unwrapRefProperties({
      buildings: nonCurrentAssets.buildingsTotal,
      accountsReceivable: nonCurrentAssets.accountsReceivable,
      longTermLoans: nonCurrentAssets.longTermLoans,
      materialsToReceive: nonCurrentAssets.materialsToReceive,
    }),

    currentLiabilities: unwrapRefProperties({
      accountsPayable: currentLiabilities.accountsPayable,
      materialsToDeliver: currentLiabilities.materialsToDeliver,
      shortTermDebt: currentLiabilities.shortTermDebt,
      interestPayable: currentLiabilities.interestPayable,
    }),

    nonCurrentLiabilities: unwrapRefProperties({
      accountsPayable: nonCurrentLiabilities.accountsPayable,
      materialsToDeliver: nonCurrentLiabilities.materialsToDeliver,
      longTermDebt: nonCurrentLiabilities.longTermDebt,
    }),

    lockedAssets: unwrapRefProperties({
      ships: lockedAssets.ships,
      hqUpgrades: lockedAssets.hqUpgrades,
      arc: lockedAssets.apexRepresentationCenter,
    }),
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
  lockedAssets: calcTotalLockedAssets,
  equity: calcEquity,
  companyValue: calcCompanyValue,
  quickAssets: calcQuickAssets,
  quickLiabilities: calcQuickLiabilities,
  acidTestRatio: calcAcidTestRatio,
  workingCapitalRatio: calcWorkingCapitalRatio,
  debtRatio: calcDebtRatio,
  debtToEquityRatio: calcDebtToEquityRatio,
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
