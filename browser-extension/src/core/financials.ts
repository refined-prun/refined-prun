import { cxStore, getPrice } from '@src/fio/cx';
import { setSettings } from '@src/util';
import { contractsStore } from '@src/prun-api/data/contracts';
import { cxosStore } from '@src/prun-api/data/cxos';
import { balancesStore } from '@src/prun-api/data/balances';
import { storagesStore } from '@src/prun-api/data/storage';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { warehousesStore } from '@src/prun-api/data/warehouses';
import system from '@src/system';
import { sumBy } from '@src/utils/sum-by';
import { deposits } from '@src/core/deposits';

interface LocationSnapshot {
  name: string;
  fixed: number;
  current: number;
  total: number;
}

export interface FinancialSnapshot {
  locations: LocationSnapshot[];
  Totals: {
    Fixed: number;
    Current: number;
    Liquid: number;
    Liabilities: number;
  };
}

// History stored as [time, fixed, current, liquid, liabilities]
export const finHistory: number[][] = [];

const storageKey = 'PMMG-Finance';

export async function loadFinHistory() {
  const savedSettings = await system.storage.local.get(storageKey);
  const savedHistory = savedSettings[storageKey]?.History ?? [];
  finHistory.length = 0;
  finHistory.push(...savedHistory);
}

async function saveFinHistory(snapshot: FinancialSnapshot) {
  const savedSettings = await system.storage.local.get(storageKey);
  finHistory.push([
    Date.now(),
    Math.round(snapshot.Totals.Fixed * 100) / 100,
    Math.round(snapshot.Totals.Current * 100) / 100,
    Math.round(snapshot.Totals.Liquid * 100) / 100,
    Math.round(snapshot.Totals.Liabilities * 100) / 100,
  ]);
  savedSettings[storageKey].History = finHistory;
  await system.storage.local.set(savedSettings);
}

// Actually recording and processing the financials once they are received through BackgroundRunner.
export function recordFinancials(result) {
  if (!cxStore.fetched) {
    window.setTimeout(() => recordFinancials(result), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  const finSnapshot = calculateFinancials();
  void saveFinHistory(finSnapshot);
}

export function calculateFinancials() {
  const snapshot: FinancialSnapshot = {
    locations: [],
    Totals: {
      Fixed: 0,
      Current: 0,
      Liquid: 0,
      Liabilities: 0,
    },
  };

  function getLocation(name: string) {
    let location = snapshot.locations.find(x => x.name === name);
    if (!location) {
      location = {
        name,
        fixed: 0,
        current: 0,
        total: 0,
      };
      snapshot.locations.push(location);
    }
    return location;
  }

  // Inventory
  for (const store of storagesStore.all.value) {
    let value = 0;

    const items = store.items.map(x => x.quantity!).filter(x => x);
    for (const item of items) {
      value += getPrice(item.material.ticker) * item.amount;
    }

    if (value === 0) {
      continue;
    }

    let name: string | undefined;
    if (store.type == 'STORE') {
      const site = sitesStore.getById(store.addressableId);
      name = getPlanetNameFromAddress(site?.address)!;
    } else if (store.type == 'WAREHOUSE_STORE') {
      const warehouse = warehousesStore.getById(store.addressableId);
      name = getPlanetNameFromAddress(warehouse?.address)!;
    }
    name ??= store.name!;

    const location = getLocation(name);
    location.current += value;
    location.total += value;
  }

  // Buildings
  for (const site of sitesStore.all.value) {
    let value = 0;
    for (const building of site.platforms) {
      for (const mat of building.reclaimableMaterials) {
        value += getPrice(mat.material.ticker) * mat.amount;
      }
    }
    if (value === 0) {
      continue;
    }
    const name = getPlanetNameFromAddress(site.address)!;
    const location = getLocation(name);
    location.fixed += value;
    location.total += value;
  }

  snapshot.locations.sort((a, b) => b.total - a.total);

  // Contracts
  let contractValue = 0;
  let contractLiability = 0;

  for (const contract of contractsStore.all.value) {
    if (
      contract.status !== 'CLOSED' &&
      contract.status !== 'PARTIALLY_FULFILLED' &&
      contract.status !== 'VIOLATED'
    ) {
      continue;
    }
    const party = contract.party;
    for (const condition of contract.conditions) {
      if (condition.status == 'FULFILLED') {
        continue;
      }
      let total = 0;

      switch (condition.type) {
        case 'DELIVERY':
        case 'PROVISION': {
          const ticker = condition.quantity!.material.ticker;
          const amount = condition.quantity!.amount;
          total = getPrice(ticker) * amount;
          break;
        }
        case 'PAYMENT': {
          total = condition.amount!.amount;
          break;
        }
        case 'LOAN_INSTALLMENT': {
          total = condition.interest!.amount + condition.repayment!.amount;
          break;
        }
        case 'LOAN_PAYOUT': {
          total = condition.amount!.amount;
          break;
        }
      }

      if (condition.party == party) {
        contractLiability += total;
      } else {
        contractValue += total;
      }
    }
  }

  // CXOS
  const sellOrders = cxosStore.all.value.filter(x => x.status !== 'FILLED' && x.type === 'SELLING');
  const cxSellValue = sumBy(sellOrders, x => getPrice(x.material.ticker) * x.amount);

  let liquid = 0;
  for (const balance of balancesStore.all.value) {
    liquid += balance.amount;
  }
  for (const deposit of deposits.value.values()) {
    liquid += deposit.cx + deposit.fx;
  }

  const fixed = sumBy(Object.values(snapshot.locations), x => x.fixed);

  let current = cxSellValue + contractValue;
  current += sumBy(Object.values(snapshot.locations), x => x.current);

  const liabilities = contractLiability;
  snapshot.Totals.Fixed = fixed;
  snapshot.Totals.Current = current;
  snapshot.Totals.Liquid = liquid;
  snapshot.Totals.Liabilities = liabilities;
  return snapshot;
}
