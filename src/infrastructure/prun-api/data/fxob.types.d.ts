declare namespace PrunApi {
  interface FXBroker {
    id: string;
    ticker: string;
    pair: {
      base: Currency;
      quote: Currency;
      decimals: number;
    };
    price: {
      open: FXBrokerRate;
      low: FXBrokerRate;
      high: FXBrokerRate;
      previous: FXBrokerRate;
      close: FXBrokerRate;
      traded: CurrencyAmount;
      volume: CurrencyAmount;
      time: Datetime;
    };
    bid: FXBrokerRate;
    ask: FXBrokerRate;
    spread: FXBrokerRate;
    sellingOrders: FXBrokerOrder[];
    buyingOrders: FXBrokerOrder[];
    lotSize: CurrencyAmount;
    feesFactor: number;
  }

  export interface FXBrokerOrder {
    id: string;
    trader: ExchangeEntity;
    amount: CurrencyAmount;
    limit: FXBrokerRate;
  }

  export interface FXBrokerRate {
    base: string;
    quote: string;
    rate: number;
    decimals: number;
  }
}
