import { userData } from '@src/store/user-data';
import dayjs from 'dayjs';
import { isPresent } from 'ts-extras';

const updateInterval = dayjs.duration(15, 'minutes').asMilliseconds();

export async function fetchPrices() {
  setTimeout(fetchPrices, updateInterval);

  const url = 'https://refined-prun.github.io/refined-prices/all.json';
  const response = await fetch(url);
  const tickersInfo = (await response.json()) as TickerPriceInfo[];

  const prices = new Map<string, CXPriceInfo>();
  const tickers = new Set<string>();
  for (const tickerInfo of tickersInfo) {
    const code = tickerInfo.ExchangeCode;
    let cxPrices = prices.get(code);
    if (!cxPrices) {
      cxPrices = new Map<string, TickerPriceInfo>();
      prices.set(code, cxPrices);
    }
    const ticker = tickerInfo.MaterialTicker;
    cxPrices.set(ticker, tickerInfo);
    tickers.add(ticker);
  }

  const universe = new Map<string, TickerPriceInfo>();
  prices.set('UNIVERSE', universe);
  for (const ticker of tickers.values()) {
    const tickerInfos = Array.from(prices.values()).map(x => x.get(ticker));
    const tickerInfo: TickerPriceInfo = {
      MaterialTicker: ticker,
      ExchangeCode: 'UNIVERSE',
      MMBuy: weightedAverage(tickerInfos, x => x.MMBuy),
      MMSell: weightedAverage(tickerInfos, x => x.MMSell),
      PriceAverage: weightedAverage(tickerInfos, x => x.PriceAverage),
      Ask: weightedAverage(tickerInfos, x => x.Ask),
      Bid: weightedAverage(tickerInfos, x => x.Bid),
      VWAP7D: weightedAverage(
        tickerInfos,
        x => x.VWAP7D,
        x => x.Traded7D,
      ),
      VWAP30D: weightedAverage(
        tickerInfos,
        x => x.VWAP30D,
        x => x.Traded30D,
      ),
    };
    universe.set(ticker, tickerInfo);
  }

  cxStore.age = Date.now();
  cxStore.prices = prices;
  cxStore.fetched = true;
}

interface TickerPriceInfo {
  MaterialTicker: string;
  ExchangeCode: string;
  MMBuy?: number | null;
  MMSell?: number | null;
  PriceAverage?: number | null;
  AskCount?: number | null;
  Ask?: number | null;
  Supply?: number | null;
  BidCount?: number | null;
  Bid?: number | null;
  Demand?: number | null;
  VWAP7D?: number | null;
  Traded7D?: number | null;
  AverageTraded7D?: number | null;
  VWAP30D?: number | null;
  Traded30D?: number | null;
  AverageTraded30D?: number | null;
}

type CXPriceInfo = Map<string, TickerPriceInfo>;
type Prices = Map<string, CXPriceInfo>;

function weightedAverage<T>(
  items: (T | undefined)[],
  value: (info: T) => number | undefined | null,
  weight?: (info: T) => number | undefined | null,
) {
  let sum: number | null = null;
  let weights: number | null = null;
  for (const item of items) {
    if (item === undefined) {
      continue;
    }

    const itemValue = value(item);
    const itemWeight = weight ? weight(item) : 1;
    if (!isPresent(itemValue) || !isPresent(itemWeight)) {
      continue;
    }

    sum = (sum ?? 0) + itemValue * itemWeight;
    weights = (weights ?? 0) + itemWeight;
  }

  if (!isPresent(sum) || !isPresent(weights)) {
    return null;
  }

  return sum / weights;
}

const ignored = computed(() => new Set(userData.settings.financial.ignoredMaterials.split(',')));
const mmMaterials = computed(() => new Set(userData.settings.financial.mmMaterials.split(',')));

export function getPrice(ticker?: string | null) {
  if (!ticker) {
    return undefined;
  }

  const upper = ticker.toUpperCase();
  if (ignored.value.has(upper)) {
    return 0;
  }

  if (!cxStore.fetched) {
    return undefined;
  }

  const pricing = userData.settings.pricing;
  const exchange = cxStore.prices.get(pricing.exchange);
  if (!exchange) {
    return undefined;
  }

  if (mmMaterials.value.has(upper)) {
    return exchange.get(ticker)?.MMBuy ?? 0;
  }

  const tickerInfo = exchange.get(ticker);
  if (!tickerInfo) {
    return 0;
  }

  switch (pricing.method) {
    case 'ASK':
      return tickerInfo.Ask ?? 0;
    case 'BID':
      return tickerInfo.Bid ?? 0;
    case 'AVG':
      return tickerInfo.PriceAverage ?? 0;
    case 'VWAP7D':
      return tickerInfo.VWAP7D ?? 0;
    case 'VWAP30D':
      return tickerInfo.VWAP30D ?? 0;
    case 'DEFAULT':
      return (
        tickerInfo.VWAP7D ??
        tickerInfo.VWAP30D ??
        tickerInfo.PriceAverage ??
        tickerInfo.Ask ??
        tickerInfo.Bid ??
        0
      );
  }

  return undefined;
}

export function getMaterialPrice(material: PrunApi.Material) {
  return getPrice(material.ticker);
}

export function calcMaterialAmountPrice(amount: PrunApi.MaterialAmount) {
  const price = getMaterialPrice(amount.material);
  return price !== undefined ? price * amount.amount : undefined;
}

export function sumMaterialAmountPrice(amounts?: PrunApi.MaterialAmount[]) {
  if (!amounts) {
    return undefined;
  }
  let result = 0;
  for (const item of amounts) {
    const price = calcMaterialAmountPrice(item);
    if (price === undefined) {
      return undefined;
    }
    result += price;
  }
  return result;
}

export const cxStore = shallowReactive({
  prices: undefined! as Prices,
  age: 0,
  fetched: false,
});
