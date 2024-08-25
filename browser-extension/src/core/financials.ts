import { cxStore } from '@src/fio/cx';
import { setSettings } from '@src/util';
import { contractsStore } from '@src/prun-api/data/contracts';
import { cxosStore } from '@src/prun-api/data/cxos';
import { fxosStore } from '@src/prun-api/data/fxos';
import { balancesStore } from '@src/prun-api/data/balances';
import { storagesStore } from '@src/prun-api/data/storage';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';
import { warehousesStore } from '@src/prun-api/data/warehouses';
import system from '@src/system';

interface LocationSnapshot {
  name: string;
  fixed: number;
  current: number;
  total: number;
}

export interface FinancialSnapshot {
  locations: LocationSnapshot[];
  Currencies: [string, number][];
  ContractValue: number;
  ContractLiability: number;
  CXBuy: number;
  CXSell: number;
  FXBuy: number;
  FXSell: number;
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
  if (!cxStore.prices) {
    window.setTimeout(() => recordFinancials(result), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  let cx = 'AI1';
  let priceType = 'Average';
  if (result['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(result['PMMGExtended']['pricing_scheme']);
    cx = interpreted[0];
    priceType = interpreted[1];
  }

  const finSnapshot = calculateFinancials(cx, priceType);
  void saveFinHistory(finSnapshot);
}

export function calculateFinancials(cx?: string, priceType?: string) {
  cx ??= 'AI1';
  priceType ??= 'Average';
  const cxPrices = cxStore.prices![cx]![priceType];

  const snapshot: FinancialSnapshot = {
    locations: [],
    Currencies: [],
    ContractValue: 0,
    ContractLiability: 0,
    CXBuy: 0,
    CXSell: 0,
    FXBuy: 0,
    FXSell: 0,
    Totals: {
      Fixed: 0,
      Current: 0,
      Liquid: 0,
      Liabilities: 0,
    },
  };

  for (const currency of balancesStore.all.value) {
    snapshot.Currencies.push([currency.currency, Math.round(currency.amount * 100) / 100]);
  }

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
      value += getPrice(cxPrices, item.material.ticker) * item.amount;
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
        value += getPrice(cxPrices, mat.material.ticker) * mat.amount;
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
          total = getPrice(cxPrices, ticker) * amount;
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
  snapshot.ContractValue = contractValue;
  snapshot.ContractLiability = contractLiability;

  // CXOS
  let cxBuyValue = 0;
  let cxSellValue = 0;

  for (const order of cxosStore.all.value) {
    if (order.status == 'FILLED') {
      continue;
    }

    if (order.type == 'SELLING') {
      cxSellValue += getPrice(cxPrices, order.material.ticker) * order.amount;
    } else {
      cxBuyValue += order.limit.amount * order.amount;
    }
  }

  // FXOS
  let fxBuyValue = 0;
  let fxSellValue = 0;
  for (const order of fxosStore.all.value) {
    if (order.status == 'FILLED') {
      continue;
    }

    if (order.type == 'SELLING') {
      fxSellValue += order.initialAmount.amount;
    } else {
      fxBuyValue += order.limit.rate * order.initialAmount.amount;
    }
  }

  snapshot.CXBuy = cxBuyValue;
  snapshot.CXSell = cxSellValue;
  snapshot.FXBuy = fxBuyValue;
  snapshot.FXSell = fxSellValue;

  let liquid = 0;
  for (const currency of snapshot.Currencies) {
    liquid += currency[1];
  }
  liquid += cxBuyValue + fxBuyValue + fxSellValue;

  const fixed = Object.values(snapshot.locations)
    .map(x => x.fixed)
    .reduce((a, b) => a + b, 0);

  let current = cxSellValue + contractValue;
  current += Object.values(snapshot.locations)
    .map(x => x.current)
    .reduce((a, b) => a + b, 0);

  const liabilities = contractLiability;
  snapshot.Totals.Fixed = fixed;
  snapshot.Totals.Current = current;
  snapshot.Totals.Liquid = liquid;
  snapshot.Totals.Liabilities = liabilities;
  return snapshot;
}

export function interpretCX(CXString) {
  let priceType = 'Average';
  const info = CXString.split(' ');
  const CX = info[0];
  switch (info[1]) {
    case 'AVG':
      priceType = 'Average';
      break;
    case 'ASK':
      priceType = 'AskPrice';
      break;
    case 'BID':
      priceType = 'BidPrice';
      break;
  }
  return [CX, priceType];
}

export function getPrice(cxPrices, ticker) {
  return cxPrices[ticker] || 0;
}
