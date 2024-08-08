declare module PrunApi {
  export interface CXBroker {
    id: string;
    ticker: string;
    exchange: ExchangeEntity;
    address: Address;
    currency: Currency;
    material: Material;
    price: CurrencyAmount;
    priceTime: DateTime;
    high: CurrencyAmount;
    allTimeHigh: CurrencyAmount;
    low: CurrencyAmount;
    allTimeLow: CurrencyAmount;
    ask: CXBrokerPriceAmount | null;
    bid: CXBrokerPriceAmount | null;
    supply: number;
    demand: number;
    traded: number;
    volume: CurrencyAmount;
    priceAverage: CurrencyAmount;
    narrowPriceBand: CXBrokerPriceBand;
    widePriceBand: CXBrokerPriceBand;
    sellingOrders: CXBrokerOrder[];
    buyingOrders: CXBrokerOrder[];
  }

  export interface CXBrokerPriceAmount {
    price: CurrencyAmount;
    amount: number;
  }

  export interface CXBrokerOrder {
    id: string;
    trader: ExchangeEntity;
    amount: number;
    limit: CurrencyAmount;
  }

  export interface CXBrokerPriceBand {
    low: number;
    high: number;
  }
}
