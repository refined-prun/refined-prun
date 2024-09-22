import { PartialBalanceSheet } from '@src/core/balance/balance-sheet';
import { userData } from '@src/store/user-data';
import dayjs from 'dayjs';
import { diffHours } from '@src/utils/time-diff';
import { liveBalanceSheet } from '@src/core/balance/balance-sheet-live';
import { computed } from 'vue';
import { sleep } from '@src/util';

const v1 = computed(() => userData.balanceHistory.v1.map(deserializeBalanceSheetV1Data));
const v2 = computed(() => userData.balanceHistory.v2.map(deserializeBalanceSheetV2Data));

export const balanceHistory = computed(() => v1.value.slice().concat(v2.value));

export function canCollectFinDataPoint() {
  return serializeBalanceSheet(liveBalanceSheet) !== undefined;
}

export function collectFinDataPoint(): boolean {
  const sheet = serializeBalanceSheet(liveBalanceSheet);
  if (sheet) {
    userData.balanceHistory.v2.push(sheet);
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

    currentAssets: {
      total: totalCurrent,
    },

    nonCurrentAssets: {
      total: totalFixed,
    },

    totalAssets,
    totalLiabilities,
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
    currentAssets: {
      cash,
      deposits,
      interestReceivable,
      accountsReceivable: accountsReceivableCurrent,
      shortTermLoans,
      marketListedMaterials,
      inventory,
      ordersInProgress,
      materialsToReceive: materialsToReceiveCurrent,
    },
    nonCurrentAssets: {
      buildings,
      accountsReceivable: accountsReceivableNonCurrent,
      longTermLoans,
      materialsToReceive: materialsToReceiveNonCurrent,
    },
    currentLiabilities: {
      accountsPayable: accountsPayableCurrent,
      materialsToDeliver: materialsToDeliverCurrent,
      shortTermDebt,
      interestPayable,
    },
    nonCurrentLiabilities: {
      accountsPayable: accountsPayableNonCurrent,
      materialsToDeliver: materialsToDeliverNonCurrent,
      longTermDebt,
    },
    lockedAssets: {
      ships,
      hqUpgrades,
      arc,
    },
  };
}

export function serializeBalanceSheet(
  data: PartialBalanceSheet,
): UserData.BalanceSheetDataV2 | undefined {
  const sheet: (number | undefined)[] = [
    data.timestamp,
    data.currentAssets?.cash,
    data.currentAssets?.deposits,
    data.currentAssets?.interestReceivable,
    data.currentAssets?.accountsReceivable,
    data.currentAssets?.shortTermLoans,
    data.currentAssets?.marketListedMaterials,
    data.currentAssets?.inventory,
    data.currentAssets?.ordersInProgress,
    data.currentAssets?.materialsToReceive,
    data.nonCurrentAssets?.buildings,
    data.nonCurrentAssets?.accountsReceivable,
    data.nonCurrentAssets?.longTermLoans,
    data.nonCurrentAssets?.materialsToReceive,
    data.currentLiabilities?.accountsPayable,
    data.currentLiabilities?.materialsToDeliver,
    data.currentLiabilities?.shortTermDebt,
    data.currentLiabilities?.interestPayable,
    data.nonCurrentLiabilities?.accountsPayable,
    data.nonCurrentLiabilities?.materialsToDeliver,
    data.nonCurrentLiabilities?.longTermDebt,
    data.lockedAssets?.ships,
    data.lockedAssets?.hqUpgrades,
    data.lockedAssets?.arc,
  ];
  if (sheet.some(x => x === undefined)) {
    return undefined;
  }
  return sheet.map(x => Math.round(x!)) as UserData.BalanceSheetDataV2;
}
