import { shallowReactive } from 'vue';

async function fetchPrices() {
  const url = 'https://rest.fnar.net/exchange/all';
  const response = await fetch(url);
  const fioPrices = (await response.json()) as FioPrices[];

  // @ts-expect-error Ah shit here we go again
  const newPrices: Prices = {
    Age: Date.now(),
  };
  for (const priceData of fioPrices) {
    const ticker = priceData.MaterialTicker;
    const cxPrices = (newPrices[priceData.ExchangeCode] ??= {
      AskPrice: {},
      BidPrice: {},
      Average: {},
    });
    cxPrices.AskPrice[ticker] = priceData.Ask;
    cxPrices.BidPrice[ticker] = priceData.Bid;
    cxPrices.Average[ticker] = priceData.PriceAverage;
  }

  cx.age = Date.now();
  cx.prices = newPrices;
}

interface FioPrices {
  MaterialTicker: string;
  ExchangeCode: string;
  MMBuy: number | null;
  MMSell: number | null;
  PriceAverage: number | null;
  AskCount: number | null;
  Ask: number | null;
  Supply: number | null;
  BidCount: number | null;
  Bid: number | null;
  Demand: number;
}

interface Prices {
  [cxCode: string]: CXPrices | undefined;

  // @ts-expect-error Ah shit here we go again
  Age: number;
}

interface CXPrices {
  AskPrice: MaterialPrices;
  BidPrice: MaterialPrices;
  Average: MaterialPrices;
}

interface MaterialPrices {
  [ticker: string]: number | undefined | null;
}

const cx = shallowReactive({
  fetchPrices,
  prices: undefined as Prices | undefined,
  age: 0,
});

export default cx;
