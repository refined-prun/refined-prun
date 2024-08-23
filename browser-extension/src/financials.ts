import { cxStore } from '@src/fio/cx';
import { getLocalStorage, setSettings } from '@src/util';
import { contractsStore } from '@src/prun-api/data/contracts';
import { cxosStore } from '@src/prun-api/data/cxos';
import { fxosStore } from '@src/prun-api/data/fxos';
import { balancesStore } from '@src/prun-api/data/balances';
import { storagesStore } from '@src/prun-api/data/storage';
import { sitesStore } from '@src/prun-api/data/sites';
import { getPlanetNameFromAddress } from '@src/prun-api/data/addresses';

export interface FinancialSnapshot {
  Currencies: [string, number][];
  Inventory: [string, number][];
  Buildings: [string, number][];
  ContractValue: number;
  ContractLiability: number;
  CXBuy: number;
  CXSell: number;
  FXBuy: number;
  FXSell: number;
  History: number[];
}

// Actually recording and processing the financials once they are received through BackgroundRunner.
export function calculateFinancials(result, loop) {
  // Wait until contracts and prices are in
  if (loop) {
    if (cxStore.prices) {
      window.setTimeout(() => calculateFinancials(result, false), 100);
      return;
    }
    window.setTimeout(() => calculateFinancials(result, true), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  let CX = 'AI1';
  let priceType = 'Average';
  if (result['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(result['PMMGExtended']['pricing_scheme']);
    CX = interpreted[0];
    priceType = interpreted[1];
  }

  const cxPrices = cxStore.prices![CX]![priceType];

  const finSnapshot: FinancialSnapshot = {
    Currencies: [],
    Inventory: [],
    Buildings: [],
    ContractValue: 0,
    ContractLiability: 0,
    CXBuy: 0,
    CXSell: 0,
    FXBuy: 0,
    FXSell: 0,
    History: [0, 0, 0, 0, 0],
  };

  for (const currency of balancesStore.all.value) {
    finSnapshot.Currencies.push([currency.currency, Math.round(currency.amount * 100) / 100]);
  }

  // Inventory
  for (const location of storagesStore.all.value) {
    let value = 0;

    for (const mat of location.items) {
      const quantity = mat.quantity;
      if (!quantity) {
        continue;
      }
      value += getPrice(cxPrices, quantity.material.ticker) * quantity.amount;
    }

    let name: string;
    if (location.type == 'STORE' || location.type == 'WAREHOUSE_STORE') {
      const site = sitesStore.getById(location.addressableId);
      name = getPlanetNameFromAddress(site?.address)!;
    } else {
      name = location.name!;
    }

    if (value == 0) {
      continue;
    }

    let isMatch = false; // Consolidate multiple storages down into one (warehouses + bases or cargo + stl + ftl tanks)
    for (const inv of finSnapshot.Inventory) {
      if (inv[0] == name) {
        isMatch = true;
        inv[1] += Math.round(value * 100) / 100;
      }
    }
    if (!isMatch) {
      finSnapshot.Inventory.push([name, Math.round(value * 100) / 100]);
    }
  }

  // Buildings
  for (const location of sitesStore.all.value) {
    let value = 0;
    for (const building of location.platforms) {
      for (const mat of building.reclaimableMaterials) {
        value += getPrice(cxPrices, mat.material.ticker) * mat.amount;
      }
    }
    if (value == 0) {
      continue;
    }
    const name = getPlanetNameFromAddress(location.address)!;
    finSnapshot.Buildings.push([name, Math.round(value * 100) / 100]);
  }

  // Handle contracts
  let contractValue = 0;
  let contractLiability = 0;
  const validContracts = contractsStore.all.value.filter(
    c => !invalidContractStatus.includes(c.status),
  );

  for (const contract of validContracts) {
    const party = contract.party;
    //console.log(party)
    for (const condition of contract.conditions) {
      if (condition.status == 'FULFILLED') {
        continue;
      }
      if (condition.type == 'DELIVERY' || condition.type == 'PROVISION') {
        if (condition.party == party) {
          contractLiability +=
            getPrice(cxPrices, condition.quantity!.material.ticker) * condition.quantity!.amount;
        } else {
          contractValue +=
            getPrice(cxPrices, condition.quantity!.material.ticker) * condition.quantity!.amount;
        }
      } else if (condition.type == 'PAYMENT') {
        if (condition.party == party) {
          contractLiability += condition.amount!.amount;
        } else {
          contractValue += condition.amount!.amount;
        }
      } else if (condition.type == 'LOAN_INSTALLMENT') {
        if (condition.party == party) {
          contractLiability += condition.interest!.amount + condition.repayment!.amount;
        } else {
          contractValue += condition.interest!.amount + condition.repayment!.amount;
        }
      } else if (condition.type == 'LOAN_PAYOUT') {
        if (condition.party == party) {
          contractLiability += condition.amount!.amount;
        } else {
          contractValue += condition.amount!.amount;
        }
      }
    }
  }
  finSnapshot.ContractValue = Math.round(contractValue * 100) / 100;
  finSnapshot.ContractLiability = Math.round(contractLiability * 100) / 100;

  // Handle CXOS
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

  // Handle FXOS
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

  finSnapshot.CXBuy = Math.round(cxBuyValue * 100) / 100;
  finSnapshot.CXSell = Math.round(cxSellValue * 100) / 100;
  finSnapshot.FXBuy = Math.round(fxBuyValue * 100) / 100;
  finSnapshot.FXSell = Math.round(fxSellValue * 100) / 100;

  let liquid = 0;
  for (const currency of finSnapshot.Currencies) {
    liquid += currency[1];
  }
  liquid += cxBuyValue + fxBuyValue + fxSellValue;

  let fixed = 0;
  for (const inv of finSnapshot.Buildings) {
    fixed += inv[1];
  }

  let current = cxSellValue + contractValue;
  for (const inv of finSnapshot.Inventory) {
    current += inv[1];
  }

  const liabilities = contractLiability;
  // History stored as [time, fixed, current, liquid, liabilities]
  finSnapshot.History = [
    Date.now(),
    Math.round(fixed * 100) / 100,
    Math.round(current * 100) / 100,
    Math.round(liquid * 100) / 100,
    Math.round(liabilities * 100) / 100,
  ];
  getLocalStorage('PMMG-Finance', writeFinancials, finSnapshot);
}

function writeFinancials(result, finSnapshot: FinancialSnapshot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let history = [] as any[];
  if (result['PMMG-Finance'] && result['PMMG-Finance']['History']) {
    history = result['PMMG-Finance']['History'];
  }
  history.push(finSnapshot.History);
  finSnapshot.History = history;
  result['PMMG-Finance'] = finSnapshot;
  setSettings(result);
}

const invalidContractStatus = ['FULFILLED', 'BREACHED', 'TERMINATED', 'CANCELLED', 'REJECTED'];

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
