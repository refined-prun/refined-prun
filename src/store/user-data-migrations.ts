/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'ts-extras';

const migrations: Migration[] = [
  userData => {
    userData.tabs = {
      order: [],
      hidden: [],
    };
  },
  // End of beta
  userData => {
    for (const pkg of userData.actionPackages) {
      for (const group of pkg.groups) {
        group.type = group.type === 'RESUPPLY' ? 'Resupply' : group.type;
        group.type = group.type === 'REPAIR' ? 'Repair' : group.type;
        group.type = group.type === 'MANUAL' ? 'Manual' : group.type;
        delete group.id;
      }
      for (const action of pkg.actions) {
        action.type = action.type === 'CX_BUY' ? 'CX Buy' : action.type;
        action.type = action.type === 'MTRA' ? 'MTRA' : action.type;
        delete action.id;
      }
      pkg.global = {
        name: pkg.name,
      };
      delete pkg.name;
      delete pkg.id;
    }
  },
  userData => {
    for (const key of Object.keys(userData.tileState)) {
      const state = userData.tileState[key];
      if (state['activeSort'] === '__CAT__') {
        delete state['activeSort'];
      }
      if (isEmpty(Object.keys(state))) {
        delete userData.tileState[key];
      }
    }
  },
  userData => {
    userData.settings.time = 'DEFAULT';
  },
  userData => {
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
