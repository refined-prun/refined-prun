import { loadLocalJson } from '@src/util';

let namesByTicker: Record<string, string> = {};
let tickersByName: Record<string, string> = {};

export async function loadMaterialNames() {
  namesByTicker = await loadLocalJson('material-names.json');
  tickersByName = {};
  for (const ticker in namesByTicker) {
    tickersByName[namesByTicker[ticker]] = ticker;
  }
}

export function getMaterialNameByTicker(ticker?: string | null) {
  return ticker ? namesByTicker[ticker] : undefined;
}

export function getTickerByMaterialName(name?: string | null) {
  return name ? tickersByName[name] : undefined;
}
