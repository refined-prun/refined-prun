declare namespace PrunApi {
  interface CXBroker {
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

  interface CXBrokerPriceAmount {
    price: CurrencyAmount;
    amount: number;
  }

  interface CXBrokerOrder {
    id: string;
    trader: ExchangeEntity;
    amount: number | null;
    limit: CurrencyAmount;
  }

  interface CXBrokerPriceBand {
    low: number;
    high: number;
  }
}
