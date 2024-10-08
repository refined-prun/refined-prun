import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { userData } from '@src/store/user-data';
import dayjs from 'dayjs';
import { diffHours } from '@src/utils/time-diff';
import { liveBalanceSheet } from '@src/core/balance/balance-sheet-live';
import { computed } from 'vue';
import { sleep } from '@src/util';
import { timestampEachMinute } from '@src/utils/dayjs';

const v1 = computed(() => userData.balanceHistory.v1.map(deserializeBalanceSheetV1Data));
const v2 = computed(() => userData.balanceHistory.v2.map(deserializeBalanceSheetV2Data));
const v3 = computed(() => userData.balanceHistory.v3.map(deserializeBalanceSheetV3Data));

export const balanceHistory = computed(() => v1.value.concat(v2.value).concat(v3.value));

export const lastBalance = computed(() => {
  // Touch timestampEachMinute to trigger reactivity,
  // but use Date.now() instead because the most recent
  // history entry can be more recent than a minute ago.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = timestampEachMinute.value;
  const now = Date.now();
  const dayjsNow = dayjs(now);
  const history = balanceHistory.value;
  for (let i = history.length - 1; i >= 0; i--) {
    const timestamp = history[i].timestamp;
    if (now < timestamp) {
      return undefined;
    }
    if (!dayjsNow.isSame(timestamp, 'isoWeek')) {
      return history[i];
    }
  }
  return undefined;
});

export const previousBalance = computed(() => {
  if (!lastBalance.value) {
    return undefined;
  }
  // Touch timestampEachMinute to trigger reactivity,
  // but use Date.now() instead because the most recent
  // history entry can be more recent than a minute ago.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = timestampEachMinute.value;
  const lastTimestamp = lastBalance.value.timestamp;
  const lastDayjs = dayjs(lastTimestamp);
  const now = Date.now();
  const history = balanceHistory.value;
  for (let i = history.length - 1; i >= 0; i--) {
    const timestamp = history[i].timestamp;
    if (now < timestamp) {
      return undefined;
    }
    if (lastBalance.value.timestamp < timestamp) {
      continue;
    }
    if (!lastDayjs.isSame(timestamp, 'isoWeek')) {
      return history[i];
    }
  }
  return undefined;
});

export function canCollectFinDataPoint() {
  return serializeBalanceSheet(liveBalanceSheet) !== undefined;
}

export function collectFinDataPoint(): boolean {
  const sheet = serializeBalanceSheet(liveBalanceSheet);
  if (sheet) {
    userData.balanceHistory.v3.push(sheet);
    return true;
  }

  return false;
}

export async function trackBalanceHistory() {
  while (true) {
    if (hasRecentBalanceRecording()) {
      await sleep(1000);
      continue;
    }

    while (!collectFinDataPoint()) {
      await sleep(1000);
    }

    await sleep(60000);
  }
}

function hasRecentBalanceRecording() {
  const lastRecording = balanceHistory.value[balanceHistory.value.length - 1];
  // Offset 'now' by 10 minutes in the past to prevent recording on 23:59
  const now = Date.now() - dayjs.duration(10, 'minutes').asMilliseconds();
  return (
    lastRecording &&
    (dayjs(lastRecording.timestamp).isSame(now, 'day') ||
      diffHours(lastRecording.timestamp, now) < 8)
  );
}

export function deserializeBalanceSheetV1Data(
  data: UserData.BalanceSheetDataV1,
): PartialBalanceSheet {
  const [timestamp, totalFixed, current, liquid, totalLiabilities] = data;
  const totalCurrent = current + liquid;
  const totalAssets = totalCurrent + totalFixed;
  const equity = totalAssets - totalLiabilities;
  return {
    timestamp,

    assets: {
      current: {
        total: totalCurrent,
      },
      nonCurrent: {
        total: totalFixed,
      },

      total: totalAssets,
    },

    liabilities: {
      total: totalLiabilities,
    },
    equity,
  };
}

export function deserializeBalanceSheetV2Data(
  data: UserData.BalanceSheetDataV2,
): PartialBalanceSheet {
  const [
    timestamp,
    cash,
    deposits,
    interestReceivable,
    accountsReceivableCurrent,
    shortTermLoans,
    marketListedMaterials,
    inventory,
    ordersInProgress,
    materialsToReceiveCurrent,
    buildings,
    accountsReceivableNonCurrent,
    longTermLoans,
    materialsToReceiveNonCurrent,
    accountsPayableCurrent,
    materialsToDeliverCurrent,
    shortTermDebt,
    interestPayable,
    accountsPayableNonCurrent,
    materialsToDeliverNonCurrent,
    longTermDebt,
    ships,
    hqUpgrades,
    arc,
  ] = data;

  return {
    timestamp,
    assets: {
      current: {
        cashAndCashEquivalents: {
          cash,
          deposits: {
            total: deposits,
          },
        },
        accountsReceivable: accountsReceivableCurrent,
        loansReceivable: {
          principal: shortTermLoans,
          interest: interestReceivable,
        },
        inventory: {
          cxListedMaterials: marketListedMaterials,
          baseInventory: {
            workInProgress: ordersInProgress,
          },
          materialsReceivable: materialsToReceiveCurrent,
          total: marketListedMaterials + inventory + ordersInProgress + materialsToReceiveCurrent,
        },
      },
      nonCurrent: {
        buildings: {
          total: buildings,
        },
        longTermReceivables: {
          accountsReceivable: accountsReceivableNonCurrent,
          materialsReceivable: materialsToReceiveNonCurrent,
          materialsInTransit: 0,
          loansPrincipal: longTermLoans,
        },
      },
    },
    liabilities: {
      current: {
        accountsPayable: accountsPayableCurrent,
        materialsPayable: materialsToDeliverCurrent,
        loansPayable: {
          principal: shortTermDebt,
          interest: interestPayable,
        },
      },
      nonCurrent: {
        longTermPayables: {
          accountsPayable: accountsPayableNonCurrent,
          materialsPayable: materialsToDeliverNonCurrent,
          loansPrincipal: longTermDebt,
        },
      },
    },
    lockedAssets: {
      ships: {
        total: ships,
      },
      hqUpgrades,
      arc,
    },
  };
}

export function deserializeBalanceSheetV3Data(
  data: UserData.BalanceSheetDataV3,
): PartialBalanceSheet {
  const [
    timestamp,
    cash,
    cx,
    fx,
    accountsReceivableCurrent,
    loansPrincipalCurrent,
    loansInterestCurrent,
    cxListedMaterials,
    cxInventory,
    finishedGoods,
    workInProgress,
    rawMaterials,
    workforceConsumables,
    otherItems,
    fuelTanks,
    materialsInTransitCurrent,
    materialsReceivableCurrent,
    infrastructure,
    resourceExtraction,
    production,
    accumulatedDepreciation,
    accountsReceivableNonCurrent,
    materialsInTransitNonCurrent,
    materialsReceivableNonCurrent,
    loansPrincipalNonCurrent,
    accountsPayableCurrent,
    materialsPayableCurrent,
    debtsPrincipalCurrent,
    debtsInterestCurrent,
    accountsPayableNonCurrent,
    materialsPayableNonCurrent,
    debtsPrincipalNonCurrent,
    shipsMarketValue,
    shipsDepreciation,
    hqUpgrades,
    arc,
  ] = data;

  return {
    timestamp,
    assets: {
      current: {
        cashAndCashEquivalents: {
          cash,
          deposits: {
            cx,
            fx,
          },
        },
        accountsReceivable: accountsReceivableCurrent,
        loansReceivable: {
          principal: loansPrincipalCurrent,
          interest: loansInterestCurrent,
        },
        inventory: {
          cxListedMaterials,
          cxInventory,
          materialsInTransit: materialsInTransitCurrent,
          baseInventory: {
            finishedGoods,
            workInProgress,
            rawMaterials,
            workforceConsumables,
            otherItems,
          },
          fuelTanks,
          materialsReceivable: materialsReceivableCurrent,
        },
      },
      nonCurrent: {
        buildings: {
          marketValue: {
            infrastructure,
            resourceExtraction,
            production,
          },
          accumulatedDepreciation,
        },
        longTermReceivables: {
          accountsReceivable: accountsReceivableNonCurrent,
          materialsReceivable: materialsReceivableNonCurrent,
          materialsInTransit: materialsInTransitNonCurrent,
          loansPrincipal: loansPrincipalNonCurrent,
        },
      },
    },
    liabilities: {
      current: {
        accountsPayable: accountsPayableCurrent,
        materialsPayable: materialsPayableCurrent,
        loansPayable: {
          principal: debtsPrincipalCurrent,
          interest: debtsInterestCurrent,
        },
      },
      nonCurrent: {
        longTermPayables: {
          accountsPayable: accountsPayableNonCurrent,
          materialsPayable: materialsPayableNonCurrent,
          loansPrincipal: debtsPrincipalNonCurrent,
        },
      },
    },
    lockedAssets: {
      ships: {
        marketValue: shipsMarketValue,
        accumulatedDepreciation: shipsDepreciation,
      },
      hqUpgrades,
      arc,
    },
  };
}

export function serializeBalanceSheet(
  data: PartialBalanceSheet,
): UserData.BalanceSheetDataV3 | undefined {
  const sheet: (number | undefined)[] = [
    data.timestamp,
    data.assets?.current?.cashAndCashEquivalents?.cash,
    data.assets?.current?.cashAndCashEquivalents?.deposits?.cx,
    data.assets?.current?.cashAndCashEquivalents?.deposits?.fx,
    data.assets?.current?.accountsReceivable,
    data.assets?.current?.loansReceivable?.principal,
    data.assets?.current?.loansReceivable?.interest,
    data.assets?.current?.inventory?.cxListedMaterials,
    data.assets?.current?.inventory?.cxInventory,
    data.assets?.current?.inventory?.baseInventory?.finishedGoods,
    data.assets?.current?.inventory?.baseInventory?.workInProgress,
    data.assets?.current?.inventory?.baseInventory?.rawMaterials,
    data.assets?.current?.inventory?.baseInventory?.workforceConsumables,
    data.assets?.current?.inventory?.baseInventory?.otherItems,
    data.assets?.current?.inventory?.fuelTanks,
    data.assets?.current?.inventory?.materialsInTransit,
    data.assets?.current?.inventory?.materialsReceivable,
    data.assets?.nonCurrent?.buildings?.marketValue?.infrastructure,
    data.assets?.nonCurrent?.buildings?.marketValue?.resourceExtraction,
    data.assets?.nonCurrent?.buildings?.marketValue?.production,
    data.assets?.nonCurrent?.buildings?.accumulatedDepreciation,
    data.assets?.nonCurrent?.longTermReceivables?.accountsReceivable,
    data.assets?.nonCurrent?.longTermReceivables?.materialsInTransit,
    data.assets?.nonCurrent?.longTermReceivables?.materialsReceivable,
    data.assets?.nonCurrent?.longTermReceivables?.loansPrincipal,
    data.liabilities?.current?.accountsPayable,
    data.liabilities?.current?.materialsPayable,
    data.liabilities?.current?.loansPayable?.principal,
    data.liabilities?.current?.loansPayable?.interest,
    data.liabilities?.nonCurrent?.longTermPayables?.accountsPayable,
    data.liabilities?.nonCurrent?.longTermPayables?.materialsPayable,
    data.liabilities?.nonCurrent?.longTermPayables?.loansPrincipal,
    data.lockedAssets?.ships?.marketValue,
    data.lockedAssets?.ships?.accumulatedDepreciation,
    data.lockedAssets?.hqUpgrades,
    data.lockedAssets?.arc,
  ];
  if (sheet.some(x => x === undefined)) {
    return undefined;
  }
  return sheet.map(x => Math.round(x!)) as UserData.BalanceSheetDataV3;
}
