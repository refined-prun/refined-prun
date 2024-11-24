/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepToRaw } from '@src/utils/deep-to-raw';

const migrations: Migration[] = [
  userData => {
    userData.settings.time = 'DEFAULT';
  },
  userData => {
    void chrome.storage.local.set({
      ['rp-backup']: structuredClone(deepToRaw(userData)),
    });
    userData.settings.financial = {
      mmMaterials: 'IDC,EDC',
      ignoredMaterials: 'HEX,JUI',
    };
    userData.balanceHistory.v1 = userData.balanceHistory.v1.map(
      ([timestamp, nonCurrent, current, liquid, liabilities]) => [
        timestamp,
        current + liquid,
        nonCurrent,
        liabilities,
      ],
    );
    userData.balanceHistory.v1.push(
      ...userData.balanceHistory.v2.map(
        ([
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
        ]) => [
          timestamp,
          cash +
            deposits +
            accountsReceivableCurrent +
            shortTermLoans +
            interestReceivable +
            marketListedMaterials +
            inventory +
            ordersInProgress +
            materialsToReceiveCurrent,
          buildings +
            ships +
            accountsReceivableNonCurrent +
            materialsToReceiveNonCurrent +
            longTermLoans +
            hqUpgrades +
            arc,
          accountsPayableCurrent +
            materialsToDeliverCurrent +
            shortTermDebt +
            interestPayable +
            accountsPayableNonCurrent +
            materialsToDeliverNonCurrent +
            longTermDebt,
        ],
      ),
    );
    userData.balanceHistory.v1.push(
      ...userData.balanceHistory.v3.map(
        ([
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
        ]) => [
          timestamp,
          cash +
            cx +
            fx +
            accountsReceivableCurrent +
            loansPrincipalCurrent +
            loansInterestCurrent +
            cxListedMaterials +
            cxInventory +
            materialsInTransitCurrent +
            finishedGoods +
            workInProgress +
            rawMaterials +
            workforceConsumables +
            otherItems +
            fuelTanks +
            materialsReceivableCurrent,
          infrastructure +
            resourceExtraction +
            production -
            accumulatedDepreciation +
            shipsMarketValue -
            shipsDepreciation +
            accountsReceivableNonCurrent +
            materialsReceivableNonCurrent +
            materialsInTransitNonCurrent +
            loansPrincipalNonCurrent +
            hqUpgrades +
            arc,
          accountsPayableCurrent +
            materialsPayableCurrent +
            debtsPrincipalCurrent +
            debtsInterestCurrent +
            accountsPayableNonCurrent +
            materialsPayableNonCurrent +
            debtsPrincipalNonCurrent,
        ],
      ),
    );
    userData.balanceHistory.v2 = [];
    delete userData.balanceHistory.v3;
  },
  userData => {
    userData.settings.currency = {
      preset: 'AIC',
      custom: '$',
      position: 'BEFORE',
      spacing: 'NO_SPACE',
    };
  },
  userData => {
    userData.todo = [];
  },
  userData => {
    userData.systemMessages = [];
  },
  userData => {
    userData.settings.disabled = [];
    userData.settings.pricing.method = 'DEFAULT';
    delete userData.first;
  },
  userData => {
    // Fast-forward initial user data version.
    userData.version = migrations.length - 1;
  },
];

type Migration = (userData: any) => void;

export function migrateUserData(userData: any) {
  while (userData.version < migrations.length) {
    const migration = migrations.length - userData.version - 1;
    migrations[migration](userData);
    userData.version++;
  }
  return userData;
}
