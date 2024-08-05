export async function trackPrices() {
  setInterval(fetchPrices, 1000);
}

async function fetchPrices() {
  const url = 'https://rest.fnar.net/exchange/all';
  const response = await fetch(url);
  const fioPrices = (await response.json()) as FioPrices[];

  const newPrices: Prices = {};
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

  newPrices.Age = Date.now();
  cx.prices = newPrices;
}

interface FioPrices {
  MaterialTicker: string;
  ExchangeCode: string;
  MMBuy: null;
  MMSell: null;
  PriceAverage: number;
  AskCount: number;
  Ask: number;
  Supply: number;
  BidCount: null;
  Bid: null;
  Demand: number;
}

interface Prices {
  [cxCode: string]: CXPrices | undefined;
  Age: number;
}

interface CXPrices {
  AskPrice: MaterialPrices;
  BidPrice: MaterialPrices;
  Average: MaterialPrices;
}

interface MaterialPrices {
  [ticker: string]: number | undefined;
}

const cx = {
  trackPrices,
  prices: undefined as Prices | undefined,
};

export default cx;
