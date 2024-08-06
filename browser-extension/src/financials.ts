import cx from '@src/prun-api/cx';
import { getLocalStorage, setSettings } from '@src/util';
import { Consumption } from '@src/GameProperties';
import user from '@src/store/user';
import { selectCxos } from '@src/store/database/selectors';
import database from '@src/store/database/database';

// Actually recording and processing the financials once they are received through BackgroundRunner.
export function calculateFinancials(webData, result, loop) {
  // Wait until contracts and prices are in
  if (loop) {
    if (cx.prices) {
      window.setTimeout(() => calculateFinancials(webData, result, false), 100);
      return;
    }
    window.setTimeout(() => calculateFinancials(webData, result, true), 50);
    return;
  }

  result['PMMGExtended']['last_fin_recording'] = Date.now();
  setSettings(result);

  let CX = 'AI1';
  let priceType = 'Average';
  if (result['PMMGExtended']['pricing_scheme']) {
    const interpreted = interpretCX(result['PMMGExtended']['pricing_scheme'], result);
    CX = interpreted[0];
    priceType = interpreted[1];
  }

  const cxPrices = cx.prices![CX]![priceType];

  // Calculate price basket
  const weights = { PIO: 0.7435, SET: 0.1954, TEC: 0.0444, ENG: 0.0132, SCI: 0.0035 };

  let priceBasket = 0;

  Object.keys(Consumption).forEach(workforce => {
    let tierCost = 0;
    Object.keys(Consumption[workforce]).forEach(mat => {
      tierCost += averageCX(cx.prices, mat) * Consumption[workforce][mat];
    });

    priceBasket += tierCost * weights[workforce];
  });

  priceBasket /= 2030.55; // Normalize by prices on 12/27/2023

  // Now we have the data, find financial value
  const finSnapshot = {};

  // Get currencies
  finSnapshot['Currencies'] = [];

  for (const currency of user.currency) {
    finSnapshot['Currencies'].push([currency.currency, Math.round(currency.amount * 100) / 100]);
  }

  // Put together inventory value
  finSnapshot['Inventory'] = [];
  finSnapshot['Buildings'] = [];

  for (const location of user.storage) {
    let value = 0;

    location['items'].forEach(mat => {
      value +=
        getPrice(
          cxPrices,
          webData['custom_prices'],
          result['PMMGExtended']['pricing_scheme'],
          mat.MaterialTicker,
          priceBasket,
        ) * mat.Amount;
    });

    let name;
    if (location.type == 'STORE' || location.type == 'WAREHOUSE_STORE') {
      name = location.PlanetName;
    } else {
      name = location.name;
    }

    if (value == 0) {
      continue;
    }

    let isMatch = false; // Consolidate multiple storages down into one (warehouses + bases or cargo + stl + ftl tanks)
    finSnapshot['Inventory'].forEach(inv => {
      if (inv[0] == name) {
        isMatch = true;
        inv[1] += Math.round(value * 100) / 100;
      }
    });
    if (!isMatch) {
      finSnapshot['Inventory'].push([name, Math.round(value * 100) / 100]);
    }
  }
  // Put together building value
  for (const location of user.sites) {
    if (location.type != 'BASE') {
      continue;
    }
    let value = 0;
    location['buildings'].forEach(building => {
      building['reclaimableMaterials'].forEach(mat => {
        value +=
          getPrice(
            cxPrices,
            webData['custom_prices'],
            result['PMMGExtended']['pricing_scheme'],
            mat.material.ticker,
            priceBasket,
          ) * mat.amount;
      });
    });
    if (value == 0) {
      continue;
    }
    finSnapshot['Buildings'].push([location.PlanetName, Math.round(value * 100) / 100]);
  }

  // Handle contracts
  let contractValue = 0;
  let contractLiability = 0;
  const validContracts = user.contracts.filter(c => !invalidContractStatus.includes(c['status']));

  for (const contract of validContracts) {
    const party = contract['party'];
    //console.log(party)
    contract['conditions'].forEach(condition => {
      if (condition['status'] == 'FULFILLED') {
        return;
      }
      if (condition['type'] == 'DELIVERY' || condition['type'] == 'PROVISION') {
        if (condition['party'] == party) {
          contractLiability +=
            getPrice(
              cxPrices,
              webData['custom_prices'],
              result['PMMGExtended']['pricing_scheme'],
              condition.quantity!.material.ticker,
              priceBasket,
            ) * condition.quantity!.amount;
        } else {
          contractValue +=
            getPrice(
              cxPrices,
              webData['custom_prices'],
              result['PMMGExtended']['pricing_scheme'],
              condition.quantity!.material.ticker,
              priceBasket,
            ) * condition.quantity!.amount;
        }
      } else if (condition['type'] == 'PAYMENT') {
        if (condition['party'] == party) {
          contractLiability += condition.amount!.amount;
        } else {
          contractValue += condition.amount!.amount;
        }
      } else if (condition['type'] == 'LOAN_INSTALLMENT') {
        if (condition['party'] == party) {
          contractLiability += condition.interest!.amount + condition.repayment!.amount;
        } else {
          contractValue += condition.interest!.amount + condition.repayment!.amount;
        }
      } else if (condition['type'] == 'LOAN_PAYOUT') {
        if (condition['party'] == party) {
          contractLiability += condition.amount!.amount;
        } else {
          contractValue += condition.amount!.amount;
        }
      }
    });
  }
  finSnapshot['ContractValue'] = Math.round(contractValue * 100) / 100;
  finSnapshot['ContractLiability'] = Math.round(contractLiability * 100) / 100;

  // Handle CXOS
  let cxBuyValue = 0;
  let cxSellValue = 0;

  selectCxos(database.getState()).forEach(order => {
    if (order.status == 'FILLED') {
      return;
    }

    if (order.type == 'SELLING') {
      cxSellValue +=
        getPrice(
          cxPrices,
          webData['custom_prices'],
          result['PMMGExtended']['pricing_scheme'],
          order.material.ticker,
          priceBasket,
        ) * order.amount;
    } else {
      cxBuyValue += order.limit.amount * order.amount;
    }
  });

  // Handle FXOS
  let fxBuyValue = 0;
  let fxSellValue = 0;
  user.fxos.forEach(order => {
    if (order.status == 'FILLED') {
      return;
    }

    if (order.type == 'SELLING') {
      fxSellValue += order.initialAmount.amount;
    } else {
      fxBuyValue += order.limit.rate * order.initialAmount.amount;
    }
  });

  finSnapshot['CXBuy'] = Math.round(cxBuyValue * 100) / 100;
  finSnapshot['CXSell'] = Math.round(cxSellValue * 100) / 100;
  finSnapshot['FXBuy'] = Math.round(fxBuyValue * 100) / 100;
  finSnapshot['FXSell'] = Math.round(fxSellValue * 100) / 100;

  let liquid = 0;
  finSnapshot['Currencies'].forEach(currency => {
    liquid += currency[1];
  });
  liquid += cxBuyValue + fxBuyValue + fxSellValue;

  let fixed = 0;
  finSnapshot['Buildings'].forEach(inv => {
    fixed += inv[1];
  });

  let current = cxSellValue + contractValue;
  finSnapshot['Inventory'].forEach(inv => {
    current += inv[1];
  });

  const liabilities = contractLiability;
  //console.log(finSnapshot);
  // History stored as [time, fixed, current, liquid, liabilities]
  finSnapshot['History'] = [
    Date.now(),
    Math.round(fixed * 100) / 100,
    Math.round(current * 100) / 100,
    Math.round(liquid * 100) / 100,
    Math.round(liabilities * 100) / 100,
  ];
  getLocalStorage('PMMG-Finance', writeFinancials, finSnapshot);
}

function writeFinancials(result, finSnapshot) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let history = [] as any[];
  if (result['PMMG-Finance'] && result['PMMG-Finance']['History']) {
    history = result['PMMG-Finance']['History'];
  }
  history.push(finSnapshot['History']);
  finSnapshot['History'] = history;
  result['PMMG-Finance'] = finSnapshot;
  setSettings(result);
}

const invalidContractStatus = ['FULFILLED', 'BREACHED', 'TERMINATED', 'CANCELLED', 'REJECTED'];

export function interpretCX(CXString, result) {
  let CX = 'AI1';
  let priceType = 'Average';
  switch (CXString) {
    case 'Price Basket':
      break;
    case 'Custom (Spreadsheet)':
      if (result['PMMGExtended']['backup_pricing_scheme']) {
        const data = interpretCX(result['PMMGExtended']['backup_pricing_scheme'], result);
        CX = data[0];
        priceType = data[1];
      }
      break;
    default: {
      const info = CXString.split(' ');
      CX = info[0];
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
    }
  }
  return [CX, priceType];
}

export function getPrice(cxPrices, customPrices, priceScheme, ticker, priceBasket) {
  if (priceScheme == 'Custom (Spreadsheet)' && customPrices && customPrices[ticker]) {
    return customPrices[ticker];
  } else if (priceScheme == 'Price Basket') {
    return averageCX(cx.prices, ticker) / priceBasket;
  }

  return cxPrices[ticker] || 0;
}

export function averageCX(prices, ticker) {
  const CXs = ['AI1', 'NC1', 'IC1', 'CI1'];

  let cxCount = 0;
  let price = 0;

  CXs.forEach(cx => {
    if (prices[cx]['Average'][ticker]) {
      cxCount++;
      price += prices[cx]['Average'][ticker];
    }
  });

  return cxCount == 0 ? 0 : price / cxCount;
}
